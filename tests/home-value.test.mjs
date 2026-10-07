import test from 'node:test';
import assert from 'node:assert/strict';
import { chicagoDate, validUSPhone, invalidFields, deliverVisitRequest, DeliveryError } from '../src/lib/home-value-request.ts';
import { approvedPhone } from '../src/content/lps/home-value/config.ts';

const now = new Date('2026-10-08T02:00:00Z');
const valid = () => ({
  lp: 'home-value', name: 'Preview Test', phone: '(214) 555-0123', email: '',
  zip: '75201', categories: [], preferredDate: '2026-10-07',
  preferredTime: '', timeZone: 'America/Chicago', notes: '',
});

test('local date uses Chicago even when UTC and Tokyo have moved to the next day', () => {
  assert.equal(chicagoDate(now), '2026-10-07');
  assert.equal(chicagoDate(new Date('2026-01-02T05:30:00Z')), '2026-01-01');
});
test('accepts common US phone punctuation and an optional country code', () => {
  for (const phone of ['2145550123', '(214) 555-0123', '+1 214 555 0123', '214.555.0123']) assert(validUSPhone(phone), phone);
  for (const phone of ['', '5550123', 'call2145550123', '+44 20 1234 5678']) assert(!validUSPhone(phone), phone);
});
test('required fields, optional email, ZIP format and Central Time preference are independently validated', () => {
  assert.deepEqual(invalidFields(valid(), now), []);
  assert.deepEqual(invalidFields({ ...valid(), name: '', phone: '', zip: '75201-1234', preferredDate: '' }, now), ['name', 'phone', 'zip', 'preferredDate']);
  assert.deepEqual(invalidFields({ ...valid(), email: 'bad', preferredTime: '25:00' }, now), ['email', 'preferredTime']);
});
test('rejects past dates and impossible calendar dates; allows future dates and time preferences', () => {
  for (const preferredDate of ['2026-10-06', '2027-02-30', '2026-13-01']) assert(invalidFields({ ...valid(), preferredDate }, now).includes('preferredDate'));
  assert.deepEqual(invalidFields({ ...valid(), preferredDate: '2026-10-08', preferredTime: '14:30' }, now), []);
});
test('preview never calls a receiving service and never reports acceptance', async () => {
  let calls = 0;
  assert.equal(await deliverVisitRequest(valid(), null, async () => { calls++; throw new Error(); }), 'preview');
  assert.equal(calls, 0);
});
test('a configured service must explicitly acknowledge acceptance, using the documented payload', async () => {
  let payload;
  const result = await deliverVisitRequest(valid(), '/approved-request', async (url, options) => {
    assert.equal(url, '/approved-request');
    assert.equal(options.method, 'POST');
    payload = JSON.parse(options.body);
    return new Response(JSON.stringify({ accepted: true }), { status: 202 });
  });
  assert.equal(result, 'accepted');
  assert.equal(payload.timeZone, 'America/Chicago');
  assert.equal(payload.preferredDate, '2026-10-07');
});
test('non-2xx, empty/malformed and non-accepting responses are failures', async () => {
  for (const response of [
    new Response('failure', { status: 500 }),
    new Response(null, { status: 204 }),
    new Response('not JSON', { status: 200 }),
    new Response(JSON.stringify({ accepted: false }), { status: 200 }),
    new Response(JSON.stringify({ ok: true }), { status: 200 }),
  ]) await assert.rejects(deliverVisitRequest(valid(), '/approved-request', async () => response), DeliveryError);
});
test('network failures preserve the input for a subsequent retry', async () => {
  const request = valid();
  const original = structuredClone(request);
  await assert.rejects(deliverVisitRequest(request, '/approved-request', async () => { throw new Error('test network'); }), (error) => error.category === 'network');
  assert.deepEqual(request, original);
  assert.equal(await deliverVisitRequest(request, '/approved-request', async () => new Response('{"accepted":true}')), 'accepted');
});
test('rejects protocol-relative or insecure destinations before sending', async () => {
  let calls = 0;
  for (const endpoint of ['//other-service.test/request', 'http://other-service.test/request']) await assert.rejects(
    deliverVisitRequest(valid(), endpoint, async () => { calls++; return new Response('{}'); }),
    (error) => error.category === 'configuration',
  );
  assert.equal(calls, 0);
});
test('unconfigured or malformed business phone produces no callable number', () => {
  assert.equal(approvedPhone(null), null);
  assert.equal(approvedPhone({ display: '(800) 000-0000', e164: '+18000000000' }), null);
  assert.equal(approvedPhone({ display: '  ', e164: '+12145550123' }), null);
  assert.equal(approvedPhone({ display: '(214) 555-0123', e164: '+12145550123' }).e164, '+12145550123');
});
