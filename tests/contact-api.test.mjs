import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact, composeEmail, MIN_ELAPSED_MS, MAX_BODY_CHARS } from '../src/server/contact.ts';
import netlifyFunction, { config as functionConfig } from '../netlify/functions/contact.ts';

const env = { RESEND_API_KEY: 'key_test', CONTACT_TO_EMAIL: 'team@example.com, owner@example.com', CONTACT_FROM_EMAIL: 'BuySell <inquiries@example.com>' };
const now = () => new Date('2026-10-20T15:00:00Z');

const payload = (extra = {}) => ({
  lp: 'downsizing', firstName: "Maria", lastName: "O'Brien", zip: '75201', phone: '2145550123', email: 'maria@example.com',
  message: 'Need help with a few things', smsConsent: false, smsConsentAt: null, smsConsentText: null,
  submittedAt: '2026-10-20T14:59:00.000Z', utm: { utm_source: 'google' }, honeypot: '', elapsedMs: 9000, ...extra,
});
const post = (body, headers = {}, url = 'https://site.example/api/contact') =>
  new Request(url, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://site.example', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

/** A provider stand-in that records what it was asked to send. */
const provider = (status = 200) => {
  const calls = [];
  const fetch = async (url, options) => { calls.push({ url, options, body: JSON.parse(options.body) }); return new Response('{"id":"x"}', { status }); };
  return { calls, fetch };
};

for (const [name, handler] of [['source', (r, e, d) => handleContact(r, e, d)], ['netlify function', async (r, e, d) => {
  // The Netlify wrapper reads its settings from Netlify.env and sends through the global fetch.
  const savedFetch = globalThis.fetch;
  globalThis.fetch = d.fetch;
  globalThis.Netlify = { env: { toObject: () => e } };
  try { return await netlifyFunction(r); } finally { globalThis.fetch = savedFetch; delete globalThis.Netlify; }
}]]) {
  test(`[${name}] a valid inquiry is emailed to the team and acknowledged`, async () => {
    const p = provider();
    const res = await handler(post(payload()), env, { fetch: p.fetch, now });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { accepted: true });
    assert.equal(p.calls.length, 1);
    const sent = p.calls[0];
    assert.equal(sent.url, 'https://api.resend.com/emails');
    assert.equal(sent.options.headers.Authorization, 'Bearer key_test');
    assert.deepEqual(sent.body.to, ['team@example.com', 'owner@example.com']);
    assert.equal(sent.body.from, 'BuySell <inquiries@example.com>');
    assert.equal(sent.body.reply_to, 'maria@example.com');
    assert.equal(sent.body.subject, 'New inquiry (downsizing)');
    for (const part of ["Maria O'Brien", '(214) 555-0123', 'maria@example.com', '75201', 'Need help with a few things', 'No, the box was not ticked', 'utm_source: google']) {
      assert(sent.body.text.includes(part), `email mentions ${part}`);
    }
  });

  test(`[${name}] invalid data is refused before anything is sent`, async () => {
    for (const bad of [payload({ firstName: '' }), payload({ phone: '555' }), payload({ zip: '1' }), payload({ email: 'x' }), payload({ message: 'x'.repeat(1001) }), payload({ lp: 'Bad LP!' }), payload({ smsConsent: true, smsConsentText: null }), [], 'null']) {
      const p = provider();
      const res = await handler(post(bad), env, { fetch: p.fetch, now });
      assert.equal(res.status, 400, JSON.stringify(bad).slice(0, 60));
      assert.equal((await res.json()).accepted, false);
      assert.equal(p.calls.length, 0);
    }
  });

  test(`[${name}] a filled hidden field looks like a bot: answered as success, nothing sent`, async () => {
    const p = provider();
    const res = await handler(post(payload({ honeypot: 'http://spam.example' })), env, { fetch: p.fetch, now });
    assert.equal(res.status, 200);
    assert.equal(p.calls.length, 0);
  });

  test(`[${name}] a form sent faster than a person can is asked to retry`, async () => {
    for (const elapsedMs of [0, MIN_ELAPSED_MS - 1, undefined, 'fast']) {
      const p = provider();
      const res = await handler(post(payload({ elapsedMs })), env, { fetch: p.fetch, now });
      assert.equal(res.status, 400);
      assert.equal((await res.json()).error, 'too_fast');
      assert.equal(p.calls.length, 0);
    }
    const p = provider();
    assert.equal((await handler(post(payload({ elapsedMs: MIN_ELAPSED_MS })), env, { fetch: p.fetch, now })).status, 200);
  });

  test(`[${name}] only POST, JSON, same-origin and small bodies are accepted`, async () => {
    const p = provider(); const d = { fetch: p.fetch, now };
    assert.equal((await handler(new Request('https://site.example/api/contact', { method: 'GET' }), env, d)).status, 405);
    assert.equal((await handler(post(payload(), { 'content-type': 'text/plain' }), env, d)).status, 415);
    assert.equal((await handler(post(payload(), { origin: 'https://evil.example' }), env, d)).status, 403);
    assert.equal((await handler(post('{not json'), env, d)).status, 400);
    assert.equal((await handler(post(payload({ message: 'x'.repeat(MAX_BODY_CHARS) })), env, d)).status, 413);
    assert.equal(p.calls.length, 0);
    // extra allowed origin, and requests with no Origin header (not a browser cross-site call)
    assert.equal((await handler(post(payload(), { origin: 'https://lp.example' }), { ...env, CONTACT_ALLOWED_ORIGINS: 'https://lp.example' }, d)).status, 200);
    const noOrigin = new Request('https://site.example/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload()) });
    assert.equal((await handler(noOrigin, env, d)).status, 200);
  });

  test(`[${name}] when the email provider fails, the browser is told it failed`, async () => {
    for (const p of [provider(500), { calls: [], fetch: async () => { throw new Error('offline'); } }]) {
      const res = await handler(post(payload()), env, { fetch: p.fetch, now });
      assert.equal(res.status, 502);
      assert.deepEqual(await res.json(), { accepted: false, error: 'delivery_failed' });
    }
  });

  test(`[${name}] missing email settings are reported, never acknowledged`, async () => {
    const p = provider();
    for (const missing of ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL']) {
      const e = { ...env }; delete e[missing];
      const res = await handler(post(payload()), e, { fetch: p.fetch, now });
      assert.equal(res.status, 500);
      assert.equal((await res.json()).accepted, false);
    }
    assert.equal(p.calls.length, 0);
  });
}

test('the email records SMS consent with its time and wording, and no visitor text reaches the subject', () => {
  const request = { ...payload({ smsConsent: true, smsConsentAt: '2026-10-20T14:58:00.000Z', smsConsentText: 'I agree to receive text messages from BuySell.' }), phone: '2145550123' };
  const { subject, text } = composeEmail(request, now());
  assert.match(text, /Text messages \(SMS\): YES/);
  assert(text.includes('2026-10-20T14:58:00.000Z') && text.includes('I agree to receive text messages from BuySell.'));
  assert.equal(subject, 'New inquiry (downsizing)');
});

test('control characters in visitor text cannot break the email layout', () => {
  const { text } = composeEmail(payload({ firstName: 'A\u0007B', message: 'line1\nline2\u0000x' }), now());
  assert(!/[\u0000-\u0009\u000B-\u001F]/.test(text));
  assert(text.includes('line1\nline2 x'));
});

test('the function is served at /api/contact', () => {
  assert.equal(functionConfig.path, '/api/contact');
});
