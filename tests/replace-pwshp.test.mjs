import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { replacePwshp, replacePwshpCategories, replacePwshpFaq } from '../src/content/lps/replace-pwshp.ts';
import { replacePwshpComparison } from '../src/content/lps/replace-pwshp-comparison.ts';
import { appraisalCategories } from '../src/content/lps/appraisal.ts';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('/replace-pwshp is a published page with its own layout and stylesheet', () => {
  assert.equal(replacePwshp.slug, 'replace-pwshp');
  assert(existsSync(new URL('src/pages/replace-pwshp.astro', root)));
  assert(!existsSync(new URL('src/draft-pages/replace-pwshp.astro', root)), 'no draft copy');
  assert(existsSync(new URL(`public${replacePwshp.meta.ogImage}`, root)), 'OG image');
  const layout = read('src/layouts/ReplacePwshpLayout.astro');
  assert.match(layout, /styles\/replace-pwshp\.css/);
  assert.doesNotMatch(layout, /import '[^']*(base|silver|gold|appraisal)\.css'/);
  assert(existsSync(new URL('docs/design/replace-pwshp/DESIGN_SYSTEM.md', root)), 'design system doc');
});

test('replace-pwshp.css is loaded only by ReplacePwshpLayout', () => {
  const walk = (dir) =>
    readdirSync(new URL(dir, root), { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(`${dir}${e.name}/`) : [`${dir}${e.name}`],
    );
  const importers = walk('src/').filter((f) => /\.(astro|ts)$/.test(f) && /import '[^']*replace-pwshp\.css'/.test(read(f)));
  assert.deepEqual(importers, ['src/layouts/ReplacePwshpLayout.astro']);
  for (const layout of ['BaseLayout', 'SilverLayout', 'GoldLayout', 'AppraisalLayout', 'LegalLayout']) {
    assert.doesNotMatch(read(`src/layouts/${layout}.astro`), /import '[^']*replace-pwshp\.css'/);
  }
});

test('the page uses the shared form, ZIP box, brand logo and company facts', () => {
  const page = read('src/pages/replace-pwshp.astro');
  assert.match(page, /<ContactForm/);
  assert.match(page, /<ZipCheck/);
  assert.match(page, /<BrandLogo/);
  assert.match(page, /site\.phone\.e164/);
  assert.doesNotMatch(page, /\(\d{3}\) \d{3}-\d{4}/, 'no phone number typed into the page');
  assert.match(page, /import '\.\.\/scripts\/silver'/);
});

test('the copy never names a pawn shop or tells people to stay away from one', () => {
  const text = [read('src/pages/replace-pwshp.astro'), read('src/content/lps/replace-pwshp.ts')].join('\n');
  assert.doesNotMatch(text, /pawn/i);
  assert.doesNotMatch(text, /don['’]t go to|do not go to|instead of (a |the )?(shop|store)/i);
});

test('the copy keeps to the purchase rule (appraisal only at the visit) and makes no claim it cannot back', () => {
  const text = [read('src/pages/replace-pwshp.astro'), read('src/content/lps/replace-pwshp.ts')].join('\n');
  assert.doesNotMatch(text, /same[- ]day|on the spot|before we leave|right away|instant cash|cash on|paid (today|instantly)/i);
  assert.doesNotMatch(text, /no photos|best price|highest price|no\. ?1|guarantee|authenticat/i);
  const payment = replacePwshpFaq.find((f) => f.id === 'consignment');
  assert.match(payment.a, /Nothing is bought at the visit/);
  assert.match(payment.a, /collect your items the next day/);
  assert.match(payment.a, /Payment is by bank transfer/);
  assert.doesNotMatch(payment.a, /end of the next day/);
});

test('the item cards promise only categories other published LPs already confirm, plus a catch-all', () => {
  const confirmed = new Set(appraisalCategories.map((c) => c.id));
  for (const card of replacePwshpCategories) {
    if (card.id === 'other') continue;
    assert(confirmed.has(card.id), `${card.id} is not a confirmed category`);
  }
  const labels = replacePwshpCategories.map((c) => c.label).join(' ');
  assert.doesNotMatch(labels, /apparel|clothing|musical|instrument|stamp|art\b/i);
  assert.equal(replacePwshpCategories.at(-1).id, 'other');
});

test('the comparison stays hidden, and is gated by its flag in the page', () => {
  assert.equal(replacePwshpComparison.enabled, false);
  assert.equal(replacePwshpComparison.legalApproved, null);
  const page = read('src/pages/replace-pwshp.astro');
  assert.match(page, /\{comparison\.enabled && <section class="comparison/);
});

test('the page is indexable: no robots meta is added for it', () => {
  assert.doesNotMatch(read('src/pages/replace-pwshp.astro'), /name="robots"/);
  assert.doesNotMatch(read('src/layouts/ReplacePwshpLayout.astro'), /name="robots"/);
});

test('the hero and the three reasons use the agreed copy', () => {
  const page = read('src/pages/replace-pwshp.astro');
  assert.match(page, /AT YOUR HOME\. AT YOUR PACE\./);
  assert.match(page, /Sell from <span class="glint">home<\/span>\./);
  assert.match(page, /No need to carry anything/);
  assert.match(page, /We buy, not consign/);
  assert.match(page, /One visit, many items/);
  for (const chip of ['Free appraisal', 'No obligation', 'We come to you', 'We buy, not consign']) {
    assert.match(page, new RegExp(`<li>${chip}</li>`));
  }
});
