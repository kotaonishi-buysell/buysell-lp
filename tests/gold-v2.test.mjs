import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { goldV2, goldV2Copy } from '../src/content/lps/gold-v2.ts';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');
const walk = (dir) =>
  readdirSync(new URL(dir, root), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}${e.name}/`) : [`${dir}${e.name}`],
  );

test('/gold-v2 is a published page: it is in src/pages, not a draft route, and /gold is a separate page', () => {
  assert(existsSync(new URL('src/pages/gold-v2.astro', root)));
  assert.equal(existsSync(new URL('src/draft-pages/gold-v2.astro', root)), false);
  assert.equal(goldV2.slug, 'gold-v2');
  assert.match(read('astro.config.mjs'), /const draftRoutes[^=]*= \[\];/, 'no draft routes: /gold-v2 is not one');
  assert(existsSync(new URL('src/pages/gold.astro', root)), '/gold stays');
  assert(existsSync(new URL(`public${goldV2.meta.ogImage}`, root)), 'OG image');
});

test('gold-v2.css is loaded only by GoldV2Layout, which loads no other LP stylesheet', () => {
  const importers = walk('src/').filter((f) => /\.(astro|ts)$/.test(f) && /import '[^']*gold-v2\.css'/.test(read(f)));
  assert.deepEqual(importers, ['src/layouts/GoldV2Layout.astro']);
  assert.doesNotMatch(read('src/layouts/GoldV2Layout.astro'), /import '[^']*(base|silver|gold)\.css'/);
  for (const layout of ['BaseLayout', 'SilverLayout', 'GoldLayout', 'LegalLayout']) {
    assert.doesNotMatch(read(`src/layouts/${layout}.astro`), /import '[^']*gold-v2\.css'/);
  }
});

test('the design is one mobile layout: a column of at most 430px, and no width-dependent rules', () => {
  const css = read('src/styles/gold-v2.css');
  assert.match(css, /\.g2-page\{[^}]*width:min\(100%,430px\)/);
  assert.doesNotMatch(css, /@media\s*\(\s*(min|max)-width/, 'nothing changes layout with the screen width');
  assert.doesNotMatch(css, /--pc-zoom/);
});

test('the page uses the shared contact form, brand logo and company facts, not its own copies', () => {
  const page = read('src/pages/gold-v2.astro');
  assert.match(page, /<ContactForm/);
  assert.match(page, /<BrandLogo/);
  assert.doesNotMatch(page, /<form\b/, 'no form of its own');
  assert.doesNotMatch(page, /XXX|\[TBC\]|\[X\]|\[Real name\]|TODO|tel:\+1/);
  assert.doesNotMatch(page.replace(/BuySell (Technologies|America|group)/g, ''), /buysell/i);
  for (const link of ['site.links.privacy', 'site.links.terms', 'site.links.doNotSell']) assert(page.includes(link), link);
});

test('payment is never promised the same day or "before we leave", and no payment time is promised at all', () => {
  const text = [read('src/pages/gold-v2.astro'), JSON.stringify(goldV2Copy)].join('\n');
  assert.doesNotMatch(text, /(paid|pay|payment)\b[^.]{0,40}(right away|on the spot|same[- ]day)|same[- ]day|before we leave/i);
  assert.match(goldV2Copy.step4 + goldV2Copy.payment, /Payment is by bank transfer/);
  assert.doesNotMatch(goldV2Copy.step4 + goldV2Copy.payment, /end of the next day/);
});

test('photo slots are empty figures with a data-slot name, and any image put in one has alt text', () => {
  const page = read('src/pages/gold-v2.astro');
  const slots = [...page.matchAll(/<figure[^>]*data-slot="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(slots.length, 13, 'hero, company, four steps and seven cards');
  assert.equal(new Set(slots).size, slots.length, 'slot names are unique');
  assert.doesNotMatch(page, /<img\b(?![^>]*\balt=)/);
});
