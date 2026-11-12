import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { appraisal, appraisalCategories, appraisalFaq } from '../src/content/lps/appraisal.ts';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('/appraisal is a published page with its own layout and stylesheet', () => {
  assert.equal(appraisal.slug, 'appraisal');
  assert(existsSync(new URL('src/pages/appraisal.astro', root)));
  assert(!existsSync(new URL('src/draft-pages/appraisal.astro', root)), 'no draft copy');
  assert(existsSync(new URL(`public${appraisal.meta.ogImage}`, root)), 'OG image');
  const layout = read('src/layouts/AppraisalLayout.astro');
  assert.match(layout, /styles\/appraisal\.css/);
  assert.doesNotMatch(layout, /import '[^']*(base|silver|gold)\.css'/);
});

test('appraisal.css is loaded only by AppraisalLayout, and no other layout loads it', () => {
  const walk = (dir) =>
    readdirSync(new URL(dir, root), { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(`${dir}${e.name}/`) : [`${dir}${e.name}`],
    );
  const importers = walk('src/').filter((f) => /\.(astro|ts)$/.test(f) && /import '[^']*appraisal\.css'/.test(read(f)));
  assert.deepEqual(importers, ['src/layouts/AppraisalLayout.astro']);
  for (const layout of ['BaseLayout', 'SilverLayout', 'GoldLayout', 'LegalLayout']) {
    assert.doesNotMatch(read(`src/layouts/${layout}.astro`), /import '[^']*appraisal\.css'/);
  }
});

test('the page uses the shared form, ZIP box, brand logo and company facts', () => {
  const page = read('src/pages/appraisal.astro');
  assert.match(page, /<ContactForm/);
  assert.match(page, /<ZipCheck/);
  assert.match(page, /<BrandLogo/);
  assert.match(page, /site\.phone\.e164/);
  assert.doesNotMatch(page, /\(\d{3}\) \d{3}-\d{4}/, 'no phone number typed into the page');
});

test('the category ribbon lists the main categories first, then the others', () => {
  const ids = appraisalCategories.map((c) => c.id);
  assert.deepEqual(ids.slice(0, 3), ['accessories', 'designer-goods', 'watches']);
  assert.deepEqual(ids.slice(3), ['jewelry', 'antiques', 'cameras', 'gold-coins', 'silverware']);
});

test('the copy keeps to the purchase rule (appraisal only at the visit) and makes no claim it cannot back', () => {
  const text = [read('src/pages/appraisal.astro'), read('src/content/lps/appraisal.ts')].join('\n');
  assert.doesNotMatch(text, /same[- ]day|on the spot|before we leave|right away|cash on|paid (today|instantly)/i);
  assert.doesNotMatch(text, /no photos|best price|highest price|guarantee|authenticat/i);
  const payment = appraisalFaq.find((f) => f.id === 'payment');
  assert.match(payment.a, /Nothing is bought at the visit/);
  assert.match(payment.a, /collect your items the next day/);
  assert.doesNotMatch(payment.a, /end of the next day/);
});

test('the hero uses the agreed copy', () => {
  const page = read('src/pages/appraisal.astro');
  assert.match(page, /TOO NICE TO TOSS\./);
  assert.match(page, /Not using it\. Not <span class="glint">tossing<\/span> it\./);
  assert.match(page, /Just give us a call\./);
  assert.match(page, /Free in-home appraisals for the things/);
});
