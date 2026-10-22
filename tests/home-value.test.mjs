import test from 'node:test';
import assert from 'node:assert/strict';
import { approvedPhone } from '../src/content/lps/home-value/config.ts';

// The form, validation and delivery are shared with every LP: see contact-form.test.mjs.
test('unconfigured or malformed business phone produces no callable number', () => {
  assert.equal(approvedPhone(null), null);
  assert.equal(approvedPhone({ display: '(800) 000-0000', e164: '+18000000000' }), null);
  assert.equal(approvedPhone({ display: '  ', e164: '+12145550123' }), null);
  assert.equal(approvedPhone({ display: '(214) 555-0123', e164: '+12145550123' }).e164, '+12145550123');
});
