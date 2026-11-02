import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { gold, goldCopy } from '../src/content/lps/gold.ts';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('/gold is a published page with its own layout, stylesheet and script', () => {
  assert(existsSync(new URL('src/pages/gold.astro', root)));
  assert.equal(gold.slug, 'gold');
  assert(existsSync(new URL(`public${gold.meta.ogImage}`, root)), 'OG image');
  const layout = read('src/layouts/GoldLayout.astro');
  assert.match(layout, /styles\/gold\.css/);
  assert.doesNotMatch(layout, /import '[^']*(base|silver)\.css'/);
});

test('gold.css is loaded only by GoldLayout, and no other layout loads it', () => {
  const walk = (dir) =>
    readdirSync(new URL(dir, root), { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(`${dir}${e.name}/`) : [`${dir}${e.name}`],
    );
  const importers = walk('src/').filter((f) => /\.(astro|ts)$/.test(f) && /import '[^']*gold\.css'/.test(read(f)));
  assert.deepEqual(importers, ['src/layouts/GoldLayout.astro']);
  for (const layout of ['BaseLayout', 'SilverLayout', 'LegalLayout']) {
    assert.doesNotMatch(read(`src/layouts/${layout}.astro`), /import '[^']*gold\.css'/);
  }
});

test('the page uses the shared contact form, brand logo and company facts, not its own copies', () => {
  const page = read('src/pages/gold.astro');
  assert.match(page, /<ContactForm/);
  assert.match(page, /<BrandLogo/);
  assert.doesNotMatch(page, /<form\b/, 'no form of its own');
  assert.doesNotMatch(page, /XXX|\[TBC\]|\[X\]|\[Real name\]|assets\/img|LP_CONFIG|tel:\+1/);
  assert.doesNotMatch(page.replace(/BuySell (Technologies|America|group)/g, ''), /buysell/i);
});

test('payment is never promised the same day or "before we leave": next-day bank transfer only', () => {
  const text = [read('src/pages/gold.astro'), JSON.stringify(goldCopy)].join('\n');
  assert.doesNotMatch(text, /(paid|pay|payment)\b[^.]{0,40}(right away|on the spot|same[- ]day)|same[- ]day|before we leave/i);
  assert.match(goldCopy.step4 + goldCopy.payment, /bank transfer by the end of the next day/);
});

test('the sample appraisers and sample reviews of the designer\'s page are not published', () => {
  const page = read('src/pages/gold.astro');
  assert.doesNotMatch(page, /id="ppl"|id="reviews"|Sample photo|Sample review|class="rcard"/);
  assert.equal(existsSync(new URL('public/images/gold/A1.webp', root)), false);
  assert.equal(existsSync(new URL('public/images/gold/A2.webp', root)), false);
});
