import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { approvedPhone, buildHomeValueConfig } from '../src/content/lps/home-value/config.ts';
import { company } from '../src/content/company.ts';

// The form, validation and delivery are shared with every LP: see contact-form.test.mjs.
test('unconfigured or malformed business phone produces no callable number', () => {
  assert.equal(approvedPhone(null), null);
  assert.equal(approvedPhone({ display: '(800) 000-0000', e164: '+18000000000' }), null);
  assert.equal(approvedPhone({ display: '  ', e164: '+12145550123' }), null);
  assert.equal(approvedPhone({ display: '(214) 555-0123', e164: '+12145550123' }).e164, '+12145550123');
});

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

test('the page prints the OCCC registration and contact line from the shared company facts, and nothing when they are unset', () => {
  const cfg = buildHomeValueConfig(company);
  assert.deepEqual(cfg.registration, { label: 'Texas registration No.', value: company.occc.registrationNumber });
  assert.match(cfg.regulator.value, /2601 N Lamar Blvd/);
  const none = buildHomeValueConfig({ ...company, occc: { registrationNumber: null, regulatorNotice: null } });
  assert.equal(none.registration, null);
  assert.equal(none.regulator, null);
});

test('the purchase count is stated only when its source is approved; the listing alone is stated meanwhile', () => {
  assert.equal(buildHomeValueConfig(company).group.approved, false);
  const copy = read('src/content/lps/home-value/index.ts');
  const body = copy.slice(copy.indexOf('groupBody:'), copy.indexOf('process:'));
  assert.match(body, /is publicly listed in Japan\./);
  // The count and "purchases" appear only inside the branch that runs when the source is approved.
  assert.match(body, /config\.group\.approved \? ` The group has completed \$\{config\.group\.purchaseCount\} purchases/);
  assert.equal(body.split('purchases').length - 1, 1);
});

test('the page carries no draft or preview wording, and takes its canonical URL from the site address', () => {
  const page = read('src/draft-pages/home-value.astro');
  const copy = read('src/content/lps/home-value/index.ts');
  assert.doesNotMatch(`${page}\n${copy}`, /real photography will replace|preview asset|Client-supplied|require confirmation before public launch|Sample illustration/);
  assert.match(page, /absoluteUrl\('\/home-value', Astro\.site\)/);
  assert.doesNotMatch(page, /productionOrigin/);
});

test('the "phone pending" text for screen readers exists only while there is no callable phone number', () => {
  assert.match(read('src/draft-pages/home-value.astro'), /\{!config\.phone && <p id="phone-pending"/);
});
