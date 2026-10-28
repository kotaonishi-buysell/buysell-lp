import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { legalPages, privacyPolicy, termsOfUse, doNotSell } from '../src/content/legal.ts';
import { site } from '../src/content/site.ts';

const text = (page) =>
  [page.intro, ...page.sections.flatMap((s) => [s.heading, ...s.blocks.flatMap((b) => (typeof b === 'string' ? [b] : b.list))])].join('\n');

test('every legal link of the site has a page', () => {
  for (const href of Object.values(site.links)) {
    assert(existsSync(new URL(`../src/pages${href}.astro`, import.meta.url)), href);
  }
  assert.deepEqual(legalPages.map((p) => `/${p.slug}`).sort(), Object.values(site.links).sort());
});

test('each page has unique section ids and no empty text', () => {
  for (const page of legalPages) {
    const ids = page.sections.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, page.slug);
    assert(page.title && page.description && page.intro, page.slug);
    for (const section of page.sections) {
      assert(section.heading.trim(), `${page.slug}/${section.id}`);
      assert(section.blocks.length > 0, `${page.slug}/${section.id}`);
    }
  }
});

test('only known tokens are used', () => {
  const known = new Set(['company', 'address', 'phone', 'hours', 'email', 'effective', 'registration', 'regulator']);
  for (const page of legalPages) {
    const stripped = `${text(page)} ${page.description}`.replace(/\{\{[^}]*\}\}/g, '');
    for (const [, token] of stripped.matchAll(/\{(\w+)\}/g)) assert(known.has(token), `${page.slug}: {${token}}`);
  }
});

test('the three pages agree with the rules of the business', () => {
  assert.match(text(doNotSell), /does not sell your personal information/);
  assert.match(text(privacyPolicy), /do not sell your personal information/);
  // Texting is optional and can be stopped.
  for (const page of [privacyPolicy, termsOfUse]) assert.match(text(page), /Reply STOP/);
  assert.match(text(termsOfUse), /not a condition/);
  // The payment rule is the one of every LP.
  assert.match(text(termsOfUse), /bank transfer by the end of the next calendar day/);
  assert.doesNotMatch(text(termsOfUse), /same day|before we leave/i);
  // Texas dealer records exist, so no page may promise "no photos" or "no sharing".
  for (const page of legalPages) assert.doesNotMatch(text(page), /no photos|never (take|share)/i, page.slug);
  assert.match(text(privacyPolicy), /photographs/);
});

test('the draft notice and the unconfirmed facts stay visible as TODO markers', () => {
  assert.match(text(privacyPolicy), /\{\{TODO/);
  assert.match(site.legal.privacyEmail, /\{\{TODO/);
});

test('while Google Tag Manager is on the LPs, the policy says so and the legal pages do not load it', () => {
  assert(site.analytics.gtmId, 'gtmId is set');
  assert.match(text(privacyPolicy), /Google Tag Manager/);
  assert.match(text(doNotSell), /Google Tag Manager/);
  assert.doesNotMatch(text(privacyPolicy), /do not currently use advertising or cross-site tracking cookies/);
  // LegalLayout is its own document: it must not render the GTM snippet or the shared scripts.
  const layout = readFileSync(new URL('../src/layouts/LegalLayout.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(layout, /gtm|Document\.astro|scripts\/main/i);
});
