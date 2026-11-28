import test from 'node:test';
import assert from 'node:assert/strict';
import { createVerify, generateKeyPairSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { SHEET_COLUMNS, appendRow, resetTabCache, resetTokenCache, sheetsConfigured, signJwt, toDallasTime, toRow } from '../src/server/sheets.ts';
import { handleContact } from '../src/server/contact.ts';
import { UTM_KEYS, canFallBack, DeliveryError } from '../src/lib/contact-form.ts';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' });
const env = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: 'robot@project.iam.gserviceaccount.com',
  GOOGLE_PRIVATE_KEY: privatePem,
  GOOGLE_SHEET_ID: 'SHEET123',
};
const now = () => new Date('2026-11-17T12:00:00Z');

const request = (extra = {}) => ({
  lp: 'silver', firstName: 'Maria', lastName: "O'Brien", zip: '75201', phone: '2145550123', email: 'maria@example.com',
  message: '=HYPERLINK("http://evil.example","click")', smsConsent: true, smsConsentAt: '2026-11-17T11:59:00.000Z',
  smsConsentText: 'I agree to receive text messages.', submittedAt: '2026-11-17T11:59:30.000Z', utm: { utm_source: 'google' },
  honeypot: '', elapsedMs: 9000, ...extra,
});

/** Stand-ins for Google's sign-in and Sheets endpoints. */
const google = ({ tokenStatus = 200, appendStatuses = [200] } = {}) => {
  const calls = [];
  let appends = 0;
  const fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/token')) {
      return new Response(JSON.stringify({ access_token: `tok${calls.filter((c) => c.url.includes('/token')).length}`, expires_in: 3600 }), { status: tokenStatus });
    }
    const status = appendStatuses[Math.min(appends++, appendStatuses.length - 1)];
    return new Response('{}', { status });
  };
  return { calls, fetch };
};
const withTestUrls = { ...env, GOOGLE_TOKEN_URL: 'https://google.test/token', GOOGLE_SHEETS_API_URL: 'https://sheets.test/v4/spreadsheets' };

test('the sheet is configured only when all three settings are there', () => {
  assert.equal(sheetsConfigured(env), true);
  assert.equal(sheetsConfigured({ ...env, GOOGLE_SHEET_ID: '' }), false);
  assert.equal(sheetsConfigured({}), false);
});

test('the JWT for Google is signed with the service account key (RS256) and carries the right claims', async () => {
  const jwt = await signJwt({ iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, scope: 'scope', aud: 'aud', iat: 1, exp: 3601 }, privatePem);
  const [header, claims, signature] = jwt.split('.');
  assert.deepEqual(JSON.parse(Buffer.from(header, 'base64url')), { alg: 'RS256', typ: 'JWT' });
  assert.deepEqual(JSON.parse(Buffer.from(claims, 'base64url')), { iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, scope: 'scope', aud: 'aud', iat: 1, exp: 3601 });
  const verify = createVerify('RSA-SHA256').update(`${header}.${claims}`);
  assert(verify.verify(publicKey, Buffer.from(signature, 'base64url')), 'the signature verifies with the public key');
  // A key pasted into a one-line setting, with "\n" written as text, works too.
  const oneLine = privatePem.replace(/\n/g, '\\n');
  await assert.doesNotReject(() => signJwt({ iss: 'a', scope: 's', aud: 'u', iat: 1, exp: 2 }, oneLine));
});

test('a row has one cell per column, all text, and a message that starts with "=" is just text', () => {
  const row = toRow(request(), now(), true);
  assert.equal(row.length, SHEET_COLUMNS.length);
  assert(row.every((cell) => typeof cell === 'string'));
  assert.equal(row[0], '2026-11-17 06:00:00'); // 12:00 UTC is 6 a.m. in Dallas in November
  assert.equal(row[1], 'silver');
  assert.equal(row[5], 'yes');
  assert.equal(row[6], '2145550123');
  assert.equal(row[8], '=HYPERLINK("http://evil.example","click")');
  assert.equal(row[9], 'yes');
  assert.equal(row[10], '2026-11-17 05:59:00'); // SMS agreed at
  assert.equal(row[12], '2026-11-17 05:59:30'); // submitted at
  assert.equal(row[13], 'google'); // utm_source
  assert.deepEqual(SHEET_COLUMNS.slice(-UTM_KEYS.length), UTM_KEYS);
  assert.equal(toRow(request({ smsConsent: false, smsConsentAt: null, smsConsentText: null }), now(), null)[9], 'no');
  assert.equal(toRow(request({ smsConsent: false, smsConsentAt: null, smsConsentText: null }), now(), null)[10], '', 'no consent, no time');
  assert.equal(toRow(request(), now(), null)[5], '');
  assert.equal(toRow(request(), now(), false)[5], 'no');
  // control characters cannot get into a cell
  assert.equal(toRow(request({ message: 'a\u0007b' }), now(), true)[8], 'a b');
});

test('appendRow signs in, then adds one row to the tab with RAW values', async () => {
  resetTokenCache();
  const g = google();
  await appendRow(['a', 'b'], { ...withTestUrls, GOOGLE_SHEET_TAB: "Rew'orth" }, g.fetch, now());
  assert.equal(g.calls.length, 2);
  const [token, append] = g.calls;
  assert.equal(token.url, 'https://google.test/token');
  const form = new URLSearchParams(token.options.body);
  assert.equal(form.get('grant_type'), 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  assert.equal(form.get('assertion').split('.').length, 3);
  assert.match(append.url, /^https:\/\/sheets\.test\/v4\/spreadsheets\/SHEET123\/values\//);
  assert.match(append.url, /:append\?valueInputOption=RAW&insertDataOption=INSERT_ROWS$/);
  assert(decodeURIComponent(append.url).includes("'Rew''orth'!A:A"), 'the tab name is quoted');
  assert.equal(append.options.headers.Authorization, 'Bearer tok1');
  assert.deepEqual(JSON.parse(append.options.body), { majorDimension: 'ROWS', values: [['a', 'b']] });
});

test('the access token is reused while it is valid, and renewed after a 401', async () => {
  resetTokenCache();
  const g = google();
  await appendRow(['1'], withTestUrls, g.fetch, now());
  await appendRow(['2'], withTestUrls, g.fetch, now());
  assert.equal(g.calls.filter((c) => c.url.includes('/token')).length, 1, 'one sign-in for two rows');
  const refused = google({ appendStatuses: [401, 200] });
  resetTokenCache();
  await appendRow(['3'], withTestUrls, refused.fetch, now());
  assert.equal(refused.calls.filter((c) => c.url.includes('/token')).length, 2, 'signed in again after the 401');
  assert.equal(refused.calls.filter((c) => !c.url.includes('/token')).length, 2);
});

test('appendRow throws, with no visitor data in the message, when Google refuses', async () => {
  resetTokenCache();
  await assert.rejects(() => appendRow(['Maria', '2145550123'], withTestUrls, google({ appendStatuses: [403] }).fetch, now()), (error) => {
    assert.match(error.message, /Google Sheets answered 403/);
    assert(!/Maria|2145550123/.test(error.message));
    return true;
  });
  resetTokenCache();
  await assert.rejects(() => appendRow(['x'], withTestUrls, google({ tokenStatus: 400 }).fetch, now()), /Google sign-in answered 400/);
});

// ---------- finding the tab by its id (GOOGLE_SHEET_GID) ----------

/** Google with a spreadsheet whose tabs can be renamed between calls; appends to a name that no longer exists answer 400. */
const renamableSheet = (tabs) => {
  const calls = [];
  const fetch = async (url, options) => {
    const text = String(url);
    calls.push({ url: text, options });
    if (text.includes('/token')) return new Response(JSON.stringify({ access_token: 't', expires_in: 3600 }), { status: 200 });
    if (!text.includes(':append')) {
      return new Response(JSON.stringify({ sheets: tabs.map((t) => ({ properties: { sheetId: t.id, title: t.title } })) }), { status: 200 });
    }
    const written = decodeURIComponent(text).match(/\/values\/'(.*)'!A:A:append/)?.[1].replace(/''/g, "'");
    return new Response('{}', { status: tabs.some((t) => t.title === written) ? 200 : 400 });
  };
  return { calls, fetch, tabs };
};
const lookups = (g) => g.calls.filter((c) => !c.url.includes('/token') && !c.url.includes(':append'));
const appends = (g) => g.calls.filter((c) => c.url.includes(':append'));
const writtenTab = (call) => decodeURIComponent(call.url).match(/\/values\/'(.*)'!A:A:append/)[1];
const byId = { ...withTestUrls, GOOGLE_SHEET_GID: '2116123203' };

test('with GOOGLE_SHEET_GID the row goes to the tab that has that id, whatever the tab is called now', async () => {
  resetTokenCache();
  resetTabCache();
  const g = renamableSheet([{ id: 0, title: 'Notes' }, { id: 2116123203, title: '10_Inquiries' }]);
  await appendRow(['a'], { ...byId, GOOGLE_SHEET_TAB: 'Inquiries' }, g.fetch, now());
  assert.equal(lookups(g).length, 1);
  assert.match(lookups(g)[0].url, /^https:\/\/sheets\.test\/v4\/spreadsheets\/SHEET123\?fields=/);
  assert.equal(lookups(g)[0].options.method, 'GET');
  assert.equal(lookups(g)[0].options.headers.Authorization, 'Bearer t');
  assert.equal(appends(g).length, 1);
  assert.equal(writtenTab(appends(g)[0]), '10_Inquiries', 'the id wins over GOOGLE_SHEET_TAB');
});

test('the tab found by its id is remembered for a few minutes, then looked up again', async () => {
  resetTokenCache();
  resetTabCache();
  const g = renamableSheet([{ id: 2116123203, title: 'Inquiries' }]);
  await appendRow(['1'], byId, g.fetch, now());
  await appendRow(['2'], byId, g.fetch, now());
  assert.equal(lookups(g).length, 1, 'one lookup for two rows');
  await appendRow(['3'], byId, g.fetch, new Date('2026-11-17T12:06:00Z'));
  assert.equal(lookups(g).length, 2, 'looked up again after the cache time');
});

test('a tab renamed while its old name is remembered: the write is refused (400), the name is looked up again, and the row is saved', async () => {
  resetTokenCache();
  resetTabCache();
  const g = renamableSheet([{ id: 2116123203, title: 'Inquiries' }]);
  await appendRow(['1'], byId, g.fetch, now());
  g.tabs[0].title = 'Renamed tab'; // someone renames the tab in Google Sheets
  await appendRow(['2'], byId, g.fetch, now());
  assert.deepEqual(appends(g).map(writtenTab), ['Inquiries', 'Inquiries', 'Renamed tab']);
  assert.equal(lookups(g).length, 2);
});

test('an id that no tab has is an error (nothing is written), and the message holds no visitor data', async () => {
  resetTokenCache();
  resetTabCache();
  const g = renamableSheet([{ id: 1, title: 'Inquiries' }]);
  await assert.rejects(() => appendRow(['Maria', '2145550123'], byId, g.fetch, now()), (error) => {
    assert.match(error.message, /no tab with the id 2116123203/);
    assert(!/Maria|2145550123/.test(error.message));
    return true;
  });
  assert.equal(appends(g).length, 0);
});

test('a GOOGLE_SHEET_GID that is not a number is ignored: the tab name is used, with no lookup', async () => {
  resetTokenCache();
  resetTabCache();
  const g = renamableSheet([{ id: 5, title: 'Leads' }]);
  await appendRow(['a'], { ...withTestUrls, GOOGLE_SHEET_GID: 'abc', GOOGLE_SHEET_TAB: 'Leads' }, g.fetch, now());
  assert.equal(lookups(g).length, 0);
  assert.equal(writtenTab(appends(g)[0]), 'Leads');
});

// ---------- the receiving function ----------

const post = (body) =>
  new Request('https://site.example/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://site.example' }, body: JSON.stringify(body) });

/** One transport that answers for Google and for the email provider. */
const world = ({ sheet = 200, email = 200 } = {}) => {
  const calls = [];
  const fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/token')) return new Response(JSON.stringify({ access_token: 't', expires_in: 3600 }), { status: 200 });
    if (String(url).includes('sheets.test')) return new Response('{}', { status: sheet });
    return new Response('{"id":"x"}', { status: email });
  };
  return { calls, fetch };
};
const emailEnv = { RESEND_API_KEY: 'k', CONTACT_TO_EMAIL: 'team@example.com', CONTACT_FROM_EMAIL: 'REWORTH <i@example.com>' };
const appended = (w) => w.calls.filter((c) => c.url.includes('sheets.test'));

test('an inquiry becomes a row in the sheet, with the service-area answer, and is acknowledged', async () => {
  resetTokenCache();
  const w = world();
  const res = await handleContact(post(request()), withTestUrls, { fetch: w.fetch, now });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { accepted: true });
  assert.equal(appended(w).length, 1);
  const [row] = JSON.parse(appended(w)[0].options.body).values;
  assert.equal(row.length, SHEET_COLUMNS.length);
  assert.equal(row[0], '2026-11-17 06:00:00', 'the time that reaches Google is Dallas time');
  assert.equal(row[1], 'silver');
  assert.equal(row[2], 'Maria');
  assert.equal(row[5], 'yes'); // 75201 is in the service area
  assert.equal(w.calls.some((c) => c.url.includes('resend')), false, 'no email when the email is not set up');
  resetTokenCache();
  const out = world();
  await handleContact(post(request({ zip: '78701' })), withTestUrls, { fetch: out.fetch, now });
  assert.equal(JSON.parse(appended(out)[0].options.body).values[0][5], 'no'); // Austin is not
});

test('if the sheet fails and there is no other destination, the request is not acknowledged', async () => {
  resetTokenCache();
  const w = world({ sheet: 500 });
  const res = await handleContact(post(request()), withTestUrls, { fetch: w.fetch, now });
  assert.equal(res.status, 502);
  assert.deepEqual(await res.json(), { accepted: false, error: 'delivery_failed' });
});

test('with the sheet and the email both set up, one of them is enough to accept', async () => {
  resetTokenCache();
  const sheetDown = world({ sheet: 500 });
  const a = await handleContact(post(request()), { ...withTestUrls, ...emailEnv }, { fetch: sheetDown.fetch, now });
  assert.equal(a.status, 200, 'the email took it');
  resetTokenCache();
  const emailDown = world({ email: 500 });
  const b = await handleContact(post(request()), { ...withTestUrls, ...emailEnv }, { fetch: emailDown.fetch, now });
  assert.equal(b.status, 200, 'the sheet took it');
  resetTokenCache();
  const bothDown = world({ sheet: 500, email: 500 });
  const c = await handleContact(post(request()), { ...withTestUrls, ...emailEnv }, { fetch: bothDown.fetch, now });
  assert.equal(c.status, 502);
});

test('with nothing set up, the function answers 500 not_configured (so the browser can fall back)', async () => {
  const res = await handleContact(post(request()), {}, { fetch: world().fetch, now });
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { accepted: false, error: 'not_configured' });
});

test('the browser falls back to Netlify Forms only when the function could not do its job', () => {
  assert.equal(canFallBack(new DeliveryError('network')), true);
  assert.equal(canFallBack(new DeliveryError('timeout')), true);
  assert.equal(canFallBack(new DeliveryError('invalid_acknowledgement')), true);
  assert.equal(canFallBack(new DeliveryError('rejected', 500)), true);
  assert.equal(canFallBack(new DeliveryError('rejected', 502)), true);
  assert.equal(canFallBack(new DeliveryError('rejected', 400)), false, 'a refusal is not sent elsewhere');
  assert.equal(canFallBack(new DeliveryError('rejected', 403)), false);
  assert.equal(canFallBack(new DeliveryError('configuration')), false);
  assert.equal(canFallBack(new TypeError('boom')), true);
});

// ---------- Dallas time ----------

test('Dallas time: the wall clock follows CST (UTC-6) in winter and CDT (UTC-5) in summer, and no zone name is written', () => {
  assert.equal(toDallasTime('2026-01-15T18:30:00Z'), '2026-01-15 12:30:00');
  assert.equal(toDallasTime('2026-07-04T18:30:00Z'), '2026-07-04 13:30:00');
  assert.equal(toDallasTime(new Date('2026-07-04T18:30:00Z')), '2026-07-04 13:30:00');
});

test('Dallas time: the date is the Dallas date, and midnight is 00, not 24', () => {
  assert.equal(toDallasTime('2026-11-17T06:00:00Z'), '2026-11-17 00:00:00');
  assert.equal(toDallasTime('2026-11-17T05:59:59Z'), '2026-11-16 23:59:59', 'still the 16th in Dallas');
  assert.equal(toDallasTime('2026-07-01T04:59:59Z'), '2026-06-30 23:59:59');
});

test('Dallas time: the clock changes (March 8 and November 1, 2026); the repeated 1:30 a.m. reads the same twice (no CST/CDT)', () => {
  assert.equal(toDallasTime('2026-03-08T07:59:59Z'), '2026-03-08 01:59:59');
  assert.equal(toDallasTime('2026-03-08T08:00:00Z'), '2026-03-08 03:00:00', '2 a.m. does not exist: the clock jumps to 3');
  assert.equal(toDallasTime('2026-11-01T06:30:00Z'), '2026-11-01 01:30:00');
  assert.equal(toDallasTime('2026-11-01T07:30:00Z'), '2026-11-01 01:30:00', 'the same wall-clock text, an hour later: the known limit of writing no CST/CDT');
});

test('Dallas time: an empty value stays empty, and text that is not a date is kept (cleaned), not lost', () => {
  for (const empty of [null, undefined, '']) assert.equal(toDallasTime(empty), '');
  assert.equal(toDallasTime(new Date('nonsense')), '');
  assert.equal(toDallasTime('not a date'), 'not a date');
  assert.equal(toDallasTime('a\u0007b'), 'a b');
});

test('through the function, "Submitted at" is the server time (the same as "Received at"); the visitor\'s own submittedAt is not used', async () => {
  resetTokenCache();
  const w = world();
  await handleContact(post(request({ submittedAt: '1999-01-01T00:00:00.000Z' })), withTestUrls, { fetch: w.fetch, now });
  const [row] = JSON.parse(appended(w)[0].options.body).values;
  assert.equal(row[0], '2026-11-17 06:00:00');
  assert.equal(row[12], row[0], 'the browser clock did not get into the column');
  assert.equal(row[10], '2026-11-17 05:59:00', 'the SMS agreement time is the visitor\'s browser clock');
});

test('no time cell ends with CST or CDT', () => {
  const row = toRow(
    { lp: 'silver', firstName: 'A', lastName: 'B', zip: '75201', phone: '2145550123', email: '', message: '', smsConsent: true, smsConsentAt: '2026-07-04T18:30:00.000Z', smsConsentText: 'x', submittedAt: '2026-07-04T18:30:00.000Z', utm: {}, honeypot: '', elapsedMs: 5000 },
    new Date('2026-07-04T18:30:00Z'),
    true,
  );
  for (const index of [0, 10, 12]) assert.equal(row[index], '2026-07-04 13:30:00');
  assert.equal(row.some((cell) => /\b(CST|CDT)\b/.test(cell)), false);
});

test('the three time columns say Dallas time, and none says UTC any more', () => {
  const times = SHEET_COLUMNS.filter((title) => /time/i.test(title));
  assert.deepEqual(times, ['Received at (Dallas time)', 'SMS agreed at (Dallas time)', 'Submitted at (Dallas time)']);
  assert.equal(SHEET_COLUMNS.some((title) => /UTC/.test(title)), false);
});

test('the header row written in docs/forms/contact-form.md is exactly SHEET_COLUMNS', () => {
  const doc = readFileSync(new URL('../docs/forms/contact-form.md', import.meta.url), 'utf8');
  const header = doc.split('\n').find((line) => line.startsWith('Received at ('));
  assert(header, 'the header row is in the doc');
  assert.equal(header, SHEET_COLUMNS.join('\t'));
});

test('if the runtime cannot do time zones, the module still loads and the time is written in UTC', async () => {
  const { spawnSync } = await import('node:child_process');
  const sheets = new URL('../src/server/sheets.ts', import.meta.url).href;
  const code = `
    Intl.DateTimeFormat = function () { throw new RangeError('Invalid time zone specified'); };
    const { toDallasTime } = await import(${JSON.stringify(sheets)});
    console.log(toDallasTime('2026-11-17T12:00:00Z'));`;
  const run = spawnSync(process.execPath, ['--experimental-transform-types', '--no-warnings', '--input-type=module', '-e', code], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.stdout.trim(), '2026-11-17T12:00:00.000Z');
});
