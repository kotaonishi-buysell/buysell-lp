import test from 'node:test';
import assert from 'node:assert/strict';
import { createVerify, generateKeyPairSync } from 'node:crypto';
import { SHEET_COLUMNS, appendRow, appendViaScript, resetTokenCache, scriptConfigured, sheetDestination, sheetsConfigured, signJwt, toRow } from '../src/server/sheets.ts';
import { readFileSync } from 'node:fs';
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
  assert.equal(row[0], '2026-11-17T12:00:00.000Z');
  assert.equal(row[1], 'silver');
  assert.equal(row[5], 'yes');
  assert.equal(row[6], '2145550123');
  assert.equal(row[8], '=HYPERLINK("http://evil.example","click")');
  assert.equal(row[9], 'yes');
  assert.equal(row[12], '2026-11-17T11:59:30.000Z');
  assert.equal(row[13], 'google'); // utm_source
  assert.deepEqual(SHEET_COLUMNS.slice(-UTM_KEYS.length), UTM_KEYS);
  assert.equal(toRow(request({ smsConsent: false, smsConsentAt: null, smsConsentText: null }), now(), null)[9], 'no');
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

// ---------- the Apps Script way (no key file) ----------

const scriptEnv = { GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxTEST/exec', GOOGLE_SCRIPT_SECRET: 'shh-its-a-secret' };

/** The web app: answers a POST with the given status and body (fetch has followed Apps Script's redirect by then). */
const scriptServer = (status = 200, body = '{"ok":true}') => {
  const calls = [];
  const fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return new Response(body, { status, headers: { 'Content-Type': 'application/json' } });
  };
  return { calls, fetch };
};

test('the Apps Script way is configured by its address and secret; it wins over the service account', () => {
  assert.equal(scriptConfigured(scriptEnv), true);
  assert.equal(scriptConfigured({ GOOGLE_SCRIPT_URL: 'https://x' }), false);
  assert.equal(sheetDestination(scriptEnv), 'script');
  assert.equal(sheetDestination(env), 'api');
  assert.equal(sheetDestination({ ...env, ...scriptEnv }), 'script');
  assert.equal(sheetDestination({}), null);
});

test('appendViaScript posts the row and the secret as text, and follows the redirect', async () => {
  const s = scriptServer();
  await appendViaScript(['a', 'b'], scriptEnv, s.fetch);
  assert.equal(s.calls.length, 1);
  assert.equal(s.calls[0].url, scriptEnv.GOOGLE_SCRIPT_URL);
  assert.equal(s.calls[0].options.method, 'POST');
  assert.equal(s.calls[0].options.redirect, 'follow');
  assert.match(s.calls[0].options.headers['Content-Type'], /^text\/plain/);
  assert.deepEqual(JSON.parse(s.calls[0].options.body), { secret: 'shh-its-a-secret', row: ['a', 'b'] });
});

test('appendViaScript throws, with no visitor data and no secret in the message, when the script does not take the row', async () => {
  const cases = [
    [scriptServer(500), /Apps Script answered 500/],
    [scriptServer(200, '<html>Sign in</html>'), /did not answer JSON/],
    [scriptServer(200, '{"ok":false,"error":"unauthorized"}'), /refused the row \(unauthorized\)/],
    [scriptServer(200, '{"ok":false,"error":"no_tab"}'), /refused the row \(no_tab\)/],
    [scriptServer(200, 'null'), /refused the row/],
  ];
  for (const [server, pattern] of cases) {
    await assert.rejects(() => appendViaScript(['Maria', '2145550123'], scriptEnv, server.fetch), (error) => {
      assert.match(error.message, pattern);
      assert(!/Maria|2145550123|shh-its-a-secret/.test(error.message));
      return true;
    });
  }
  await assert.rejects(() => appendViaScript(['x'], { ...scriptEnv, GOOGLE_SCRIPT_URL: 'http://insecure' }, scriptServer().fetch), /https/);
});

test('with the Apps Script set up, an inquiry becomes a row through it (no Google sign-in, no Sheets API)', async () => {
  const calls = [];
  const fetch = async (url, options) => { calls.push({ url: String(url), options }); return new Response('{"ok":true}', { status: 200 }); };
  const res = await handleContact(post(request()), scriptEnv, { fetch, now });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { accepted: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, scriptEnv.GOOGLE_SCRIPT_URL);
  const { row, secret } = JSON.parse(calls[0].options.body);
  assert.equal(secret, 'shh-its-a-secret');
  assert.equal(row.length, SHEET_COLUMNS.length);
  assert.equal(row[2], 'Maria');
  assert.equal(row[5], 'yes');
  // the script refuses -> not acknowledged
  const refused = async () => new Response('{"ok":false,"error":"unauthorized"}', { status: 200 });
  const bad = await handleContact(post(request()), scriptEnv, { fetch: refused, now });
  assert.equal(bad.status, 502);
});

test('the Apps Script file in the repo checks the secret, takes a row, and writes text only', () => {
  const code = readFileSync(new URL('../docs/forms/google-apps-script/Code.gs', import.meta.url), 'utf8');
  assert.match(code, /function doPost\(e\)/);
  assert.match(code, /getProperty\('SECRET'\)/);
  assert.match(code, /body\.secret !== secret/);
  assert.match(code, /setNumberFormat\('@'\)/);
  assert.match(code, /LockService/);
  assert.match(code, /const TAB = 'Inquiries'/);
  assert.match(code, /const TAB_GID = 2116123203;/);
  assert.match(code, /getSheetId\(\) === TAB_GID/);
});
