import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validate, buildRequest, normalizePhone, normalizeZip, normalizeName, messageRemaining, readUtm,
  deliverContactRequest, DeliveryError, MESSAGE_MAX,
} from '../src/lib/contact-form.ts';
import { smsConsentText } from '../src/content/contact-form.ts';

const valid = () => ({
  firstName: 'Maria', lastName: 'Lopez', zip: '75201', phone: '(214) 555-0123', email: '', message: '',
});
const fieldsOf = (values) => validate(values).map((issue) => `${issue.field}:${issue.code}`);

// ---------- names ----------
test('names accept hyphens, apostrophes, periods, spaces and accented letters', () => {
  for (const name of ["O'Brien", 'O’Brien', 'Smith-Jones', 'José', 'María José', 'Zoë', 'St. John', 'de la Cruz', 'Nguyễn', 'Müller', '李']) {
    assert.deepEqual(validate({ ...valid(), firstName: name, lastName: name }), [], name);
  }
});
test('names are required, and obviously wrong characters are rejected without being strict', () => {
  assert.deepEqual(fieldsOf({ ...valid(), firstName: '   ', lastName: '' }), ['firstName:required', 'lastName:required']);
  for (const name of ['R2D2', 'Pat@home', '<b>x</b>', '-Smith', "'", '123']) {
    assert(fieldsOf({ ...valid(), firstName: name }).includes('firstName:invalid'), name);
  }
  assert(fieldsOf({ ...valid(), lastName: 'a'.repeat(101) }).includes('lastName:invalid'));
});
test('names are trimmed and inner whitespace collapsed on save', () => {
  assert.equal(normalizeName('  Mary   Ann '), 'Mary Ann');
});

// ---------- phone ----------
test('phone accepts common US formats and normalises to ten digits', () => {
  for (const phone of ['(555) 123-4567', '555-123-4567', '555.123.4567', '5551234567', '555 123 4567', '1-555-123-4567', '+1 555 123 4567']) {
    assert.equal(normalizePhone(phone), '5551234567', phone);
  }
});
test('phone rejects wrong lengths, letters and foreign numbers', () => {
  for (const phone of ['', '555123456', '555-1234', 'call 5551234567', '+44 20 7946 0958', '+5551234567', '15551234567890']) {
    assert.equal(normalizePhone(phone), null, phone);
  }
  assert.deepEqual(fieldsOf({ ...valid(), phone: '' }), ['phone:required']);
  assert.deepEqual(fieldsOf({ ...valid(), phone: '555-1234' }), ['phone:invalid']);
});

// ---------- ZIP ----------
test('ZIP accepts five digits and ZIP+4, and normalises nine digits', () => {
  assert.equal(normalizeZip('75201'), '75201');
  assert.equal(normalizeZip(' 75201-1234 '), '75201-1234');
  assert.equal(normalizeZip('752011234'), '75201-1234');
  for (const zip of ['7520', '752011', '75201-12', 'ABCDE', '75201 1234']) assert.equal(normalizeZip(zip), null, zip);
  assert.deepEqual(fieldsOf({ ...valid(), zip: '' }), ['zip:required']);
  assert.deepEqual(fieldsOf({ ...valid(), zip: '7520' }), ['zip:invalid']);
});

// ---------- email ----------
test('email is checked only when entered', () => {
  assert.deepEqual(validate({ ...valid(), email: '' }), []);
  assert.deepEqual(validate({ ...valid(), email: 'name@example.com' }), []);
  for (const email of ['name', 'name@', '@example.com', 'a b@example.com', 'name@example']) {
    assert.deepEqual(fieldsOf({ ...valid(), email }), ['email:invalid'], email);
  }
});

// ---------- message ----------
test('message is optional, limited to 1,000 characters after trimming, and trimmed on save', () => {
  assert.deepEqual(validate({ ...valid(), message: '' }), []);
  assert.deepEqual(validate({ ...valid(), message: 'x'.repeat(MESSAGE_MAX) }), []);
  assert.deepEqual(validate({ ...valid(), message: `  ${'x'.repeat(MESSAGE_MAX)}  ` }), []);
  assert.deepEqual(fieldsOf({ ...valid(), message: 'x'.repeat(MESSAGE_MAX + 1) }), ['message:tooLong']);
  assert.equal(buildRequest({ ...valid(), message: '  hello \n' }, ctx()).message, 'hello');
});
test('the counter shows the characters left and never goes below zero', () => {
  assert.equal(messageRemaining(''), 1000);
  assert.equal(messageRemaining('abc'), 997);
  assert.equal(messageRemaining('x'.repeat(1200)), 0);
});

// ---------- request ----------
const ctx = (extra = {}) => ({
  lp: 'downsizing', smsConsent: false, smsConsentAt: null, smsConsentText: 'consent text',
  now: new Date('2026-10-20T15:00:00Z'), ...extra,
});

test('the request is normalised: digits-only phone, trimmed values, lp and submit time', () => {
  const request = buildRequest({ ...valid(), firstName: ' Maria ', zip: '752011234', email: ' a@b.co ' }, ctx());
  assert.deepEqual(request, {
    lp: 'downsizing', firstName: 'Maria', lastName: 'Lopez', zip: '75201-1234', phone: '2145550123',
    email: 'a@b.co', message: '', smsConsent: false, smsConsentAt: null, smsConsentText: null,
    submittedAt: '2026-10-20T15:00:00.000Z', utm: {}, honeypot: '', elapsedMs: 0,
  });
});
test('SMS consent is off by default; ticking it stores the choice, the time and the wording', () => {
  const none = buildRequest(valid(), ctx());
  assert.equal(none.smsConsent, false);
  assert.equal(none.smsConsentAt, null);
  assert.equal(none.smsConsentText, null);
  const yes = buildRequest(valid(), ctx({ smsConsent: true, smsConsentAt: '2026-10-20T14:59:00.000Z' }));
  assert.equal(yes.smsConsent, true);
  assert.equal(yes.smsConsentAt, '2026-10-20T14:59:00.000Z');
  assert.equal(yes.smsConsentText, 'consent text');
  // A form restored by the browser with the box ticked still gets a time.
  assert.equal(buildRequest(valid(), ctx({ smsConsent: true })).smsConsentAt, '2026-10-20T15:00:00.000Z');
});
test('SMS consent is not required: an otherwise valid form passes without it', () => {
  assert.deepEqual(validate(valid()), []);
});
test('the provisional consent wording names the company', () => {
  assert.match(smsConsentText('BuySell'), /^I agree to receive text messages from BuySell about my inquiry\. Message frequency varies\. Msg & data rates may apply\. Reply STOP to opt out, HELP for help\.$/);
});
test('only allowed UTM parameters are kept', () => {
  assert.deepEqual(readUtm('?utm_source=google&utm_medium=cpc&gclid=abc&utm_campaign=%20tx%20&other=1'), {
    utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'tx',
  });
});

// ---------- delivery ----------
const request = () => buildRequest(valid(), ctx());
test('preview never calls a receiving service and never reports acceptance', async () => {
  let calls = 0;
  assert.equal(await deliverContactRequest(request(), null, async () => { calls++; throw new Error(); }), 'preview');
  assert.equal(calls, 0);
});
test('a configured service must explicitly acknowledge acceptance, using the documented payload', async () => {
  let payload;
  const result = await deliverContactRequest(request(), '/api/contact', async (url, options) => {
    assert.equal(url, '/api/contact');
    assert.equal(options.method, 'POST');
    payload = JSON.parse(options.body);
    return new Response(JSON.stringify({ accepted: true }), { status: 202 });
  });
  assert.equal(result, 'accepted');
  assert.equal(payload.phone, '2145550123');
  assert.equal(payload.lp, 'downsizing');
  assert.equal(payload.smsConsent, false);
});
test('non-2xx, empty/malformed and non-accepting responses are failures', async () => {
  for (const response of [
    new Response('failure', { status: 500 }),
    new Response(null, { status: 204 }),
    new Response('not JSON', { status: 200 }),
    new Response(JSON.stringify({ accepted: false }), { status: 200 }),
    new Response(JSON.stringify({ ok: true }), { status: 200 }),
  ]) await assert.rejects(deliverContactRequest(request(), '/api/contact', async () => response), DeliveryError);
});
test('network failures are reported and leave the request unchanged for a retry', async () => {
  const req = request();
  const original = structuredClone(req);
  await assert.rejects(deliverContactRequest(req, '/api/contact', async () => { throw new Error('offline'); }), (error) => error.category === 'network');
  assert.deepEqual(req, original);
  assert.equal(await deliverContactRequest(req, '/api/contact', async () => new Response('{"accepted":true}')), 'accepted');
});
test('protocol-relative or insecure destinations are refused before sending', async () => {
  let calls = 0;
  for (const endpoint of ['//other.test/x', 'http://other.test/x']) await assert.rejects(
    deliverContactRequest(request(), endpoint, async () => { calls++; return new Response('{}'); }),
    (error) => error.category === 'configuration',
  );
  assert.equal(calls, 0);
});

// ---------- Netlify Forms ----------
import { toFormBody, deliverToNetlifyForms } from '../src/lib/contact-form.ts';

const nfRequest = (extra = {}) => buildRequest({ ...valid(), firstName: " Zoë ", phone: '(214) 555-0123', zip: '752011234', email: 'zoe@example.com', message: ' hi & bye = 1 ' }, ctx({ utm: { utm_source: 'google', utm_medium: 'cpc' }, honeypot: '', ...extra }));
const parse = (body) => Object.fromEntries(new URLSearchParams(body));

test('Netlify Forms body: normalised values, the form name and every field the form declares', () => {
  const f = parse(toFormBody(nfRequest(), 'contact'));
  assert.deepEqual(f, {
    'form-name': 'contact', lp: 'downsizing', firstName: 'Zoë', lastName: 'Lopez', zip: '75201-1234', phone: '2145550123',
    email: 'zoe@example.com', message: 'hi & bye = 1', smsConsent: 'no', smsConsentAt: '', smsConsentText: '',
    submittedAt: '2026-10-20T15:00:00.000Z', homepage_url: '', utm_source: 'google', utm_medium: 'cpc',
    utm_campaign: '', utm_term: '', utm_content: '',
  });
});
test('Netlify Forms body: special characters survive the encoding, and consent carries its time and wording', () => {
  const body = toFormBody(nfRequest({ smsConsent: true, smsConsentAt: '2026-10-20T14:58:00.000Z', smsConsentText: 'I agree & accept = yes.' }), 'contact');
  assert(!body.includes(' '), 'no raw spaces');
  const f = parse(body);
  assert.equal(f.message, 'hi & bye = 1');
  assert.equal(f.smsConsent, 'yes');
  assert.equal(f.smsConsentAt, '2026-10-20T14:58:00.000Z');
  assert.equal(f.smsConsentText, 'I agree & accept = yes.');
});
test('Netlify Forms body: the spam trap travels as the honeypot field', () => {
  assert.equal(parse(toFormBody(nfRequest({ honeypot: 'http://spam.example' }), 'contact')).homepage_url, 'http://spam.example');
});
test('delivery to Netlify Forms: POSTs urlencoded to the given path and is accepted on 2xx', async () => {
  let seen;
  const result = await deliverToNetlifyForms(nfRequest(), 'contact', '/downsizing', async (url, options) => {
    seen = { url, options };
    return new Response('<html>thanks</html>', { status: 200, headers: { 'content-type': 'text/html' } });
  });
  assert.equal(result, 'accepted');
  assert.equal(seen.url, '/downsizing');
  assert.equal(seen.options.method, 'POST');
  assert.equal(seen.options.headers['Content-Type'], 'application/x-www-form-urlencoded');
  assert.equal(parse(seen.options.body)['form-name'], 'contact');
});
test('delivery to Netlify Forms: non-2xx and network failures are failures, and the request is unchanged for a retry', async () => {
  const req = nfRequest();
  const original = structuredClone(req);
  for (const status of [404, 500]) await assert.rejects(deliverToNetlifyForms(req, 'contact', '/silver', async () => new Response('x', { status })), (e) => e.category === 'rejected');
  await assert.rejects(deliverToNetlifyForms(req, 'contact', '/silver', async () => { throw new Error('offline'); }), (e) => e.category === 'network');
  assert.deepEqual(req, original);
  assert.equal(await deliverToNetlifyForms(req, 'contact', '/silver', async () => new Response('ok')), 'accepted');
});
test('delivery to Netlify Forms: only a path on the same site is accepted', async () => {
  let calls = 0;
  for (const path of ['//other.test/x', 'https://other.test/x', 'downsizing', '']) await assert.rejects(
    deliverToNetlifyForms(nfRequest(), 'contact', path, async () => { calls++; return new Response('ok'); }), (e) => e.category === 'configuration');
  assert.equal(calls, 0);
});
