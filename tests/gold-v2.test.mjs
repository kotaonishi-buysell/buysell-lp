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

test('the Figma is mobile only: below 960px one column of at most 430px; the only width rule is one 960px block (no zoom)', () => {
  const css = read('src/styles/gold-v2.css');
  assert.match(css, /\.g2-page\{[^}]*width:min\(100%,430px\)/, 'the mobile column');
  const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const widthRules = [...code.matchAll(/@media\s*\(\s*(?:min|max)-width\s*:\s*[^)]+\)/g)].map((m) => m[0].replace(/\s+/g, ''));
  assert.deepEqual(widthRules, ['@media(min-width:960px)'], 'one block for wide screens, nothing else depends on the width');
  assert.doesNotMatch(css, /--pc-zoom/);
  // From 960px up the sticky bar, the carousel buttons and the drawer menu are not used.
  const wide = code.slice(code.indexOf('@media (min-width:960px)'));
  assert.match(wide, /\.g2-sticky,\.g2-car-nav,\.g2-menu,\.g2-drawer\{display:none!important\}/);
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

test('every photo slot holds a picture that exists, with alt text and its size', () => {
  const page = read('src/pages/gold-v2.astro');
  const slots = [...page.matchAll(/<figure[^>]*data-slot="([^"]+)">(.*?)<\/figure>/g)];
  assert.equal(slots.length, 13, 'hero, company, four steps and seven cards');
  assert.equal(new Set(slots.map((m) => m[1])).size, 13, 'slot names are unique');
  for (const [, slot, body] of slots) {
    const img = body.match(/<img\b[^>]*>/)?.[0] ?? '';
    assert(img, `${slot} is empty`);
    assert.match(img, /\balt="[^"]+"/, `${slot} needs alt text`);
    assert.match(img, /\bwidth="\d+" height="\d+"/, `${slot} needs its size`);
    const src = img.match(/\bsrc="([^"]+)"/)?.[1] ?? '';
    assert(src.startsWith('/images/gold-v2/') && existsSync(new URL(`public${src}`, root)), `${slot}: ${src} is missing`);
  }
  assert.doesNotMatch(page, /<img\b(?![^>]*\balt=)/);
});

test('/gold-v2 is not indexed by search engines: noindex flag, Document writes the robots tag and no canonical, /gold stays indexable', () => {
  assert.equal(goldV2.meta.noindex, true);
  const doc = read('src/layouts/Document.astro');
  assert.match(doc, /<meta name="robots" content="noindex, nofollow"/);
  assert.match(doc, /const canonical = noindex \? null :/);
  assert.doesNotMatch(read('src/content/lps/gold.ts'), /noindex/, '/gold stays indexable');
  assert(!existsSync(new URL('public/robots.txt', root)), 'a robots.txt block would hide the noindex from crawlers');
});
