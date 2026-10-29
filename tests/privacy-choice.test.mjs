import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  PRIVACY_OPTOUT_KEY,
  clearTrackingCookies,
  cookieDomains,
  cookieNames,
  gpcOn,
  isTrackingCookie,
  optedOut,
  setOptOut,
} from '../src/lib/privacy-choice.ts';
import { privacyPolicy, doNotSell } from '../src/content/legal.ts';

const memory = () => {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) };
};

test('Global Privacy Control counts as an opt-out; only a real true does', () => {
  assert.equal(gpcOn({ globalPrivacyControl: true }), true);
  assert.equal(gpcOn({ globalPrivacyControl: false }), false);
  assert.equal(gpcOn({}), false);
});

test('the opt-out is saved in the browser and can be undone; no storage means not opted out', () => {
  const storage = memory();
  assert.equal(optedOut(storage), false);
  setOptOut(storage, true);
  assert.equal(optedOut(storage), true);
  assert.equal(storage.getItem(PRIVACY_OPTOUT_KEY), '1');
  setOptOut(storage, false);
  assert.equal(optedOut(storage), false);
  assert.equal(optedOut(null), false);
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() {} };
  assert.equal(optedOut(broken), false);
  assert.doesNotThrow(() => setOptOut(broken, true));
});

test('only the cookies of the tools are removed', () => {
  for (const name of ['_ga', '_ga_JP716WPFW5', '_gid', '_fbp', '_fbc', '_clck', '_clsk']) assert(isTrackingCookie(name), name);
  for (const name of ['session', 'cf_form', 'rw-privacy-optout', '_gadget']) assert(!isTrackingCookie(name), name);
  assert.deepEqual(cookieNames('_ga=1; session=x; _fbp=2'), ['_ga', 'session', '_fbp']);
  assert.deepEqual(cookieDomains('a.b.netlify.app'), ['a.b.netlify.app', '.a.b.netlify.app', '.b.netlify.app', '.netlify.app']);
  const writes = [];
  const doc = { get cookie() { return '_ga=1; keep=2; _clck=3'; }, set cookie(value) { writes.push(value); } };
  clearTrackingCookies(doc, 'x.example.org');
  assert(writes.some((w) => w.startsWith('_ga=;')) && writes.some((w) => w.startsWith('_clck=;')));
  assert(!writes.some((w) => w.startsWith('keep=')));
});

test('Google Tag Manager is not loaded after an opt-out or with Global Privacy Control, and the form is masked for Clarity', () => {
  const layout = readFileSync(new URL('../src/layouts/Document.astro', import.meta.url), 'utf8');
  assert.match(layout, /PRIVACY_OPTOUT_KEY/);
  assert.match(layout, /navigator\.globalPrivacyControl===true/);
  const form = readFileSync(new URL('../src/components/ContactForm.astro', import.meta.url), 'utf8');
  assert.match(form, /data-clarity-mask="True"/);
});

const text = (page) =>
  [page.intro, ...page.sections.flatMap((s) => s.blocks.flatMap((b) => (typeof b === 'string' ? [b] : 'list' in b ? b.list : [])))].join('\n');

test('the policy and the opt-out page name every tool in the Google Tag Manager container (GTM-PQQFZ723, 2026-10-29)', () => {
  for (const page of [privacyPolicy, doNotSell]) {
    for (const name of ['Meta Pixel', 'Google Analytics', 'Microsoft Clarity']) assert.match(text(page), new RegExp(name), `${page.slug}: ${name}`);
  }
  assert(doNotSell.sections.some((s) => s.blocks.some((b) => typeof b === 'object' && 'control' in b)), 'the opt-out control is on the page');
  assert.match(text(doNotSell), /Global Privacy Control/);
  // The pixel is advertising: the pages must not say there is no sharing for advertising.
  assert.doesNotMatch(text(doNotSell), /There is nothing you need to opt out of/);
  assert.doesNotMatch(text(privacyPolicy), /We do none of these/);
});
