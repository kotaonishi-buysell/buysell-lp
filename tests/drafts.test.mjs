import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('/downsizing and /home-value are published pages (src/pages), no longer drafts', () => {
  assert(existsSync(new URL('src/pages/[slug].astro', root)), 'Downsizing: the dynamic page of the LP registry');
  assert(existsSync(new URL('src/pages/home-value.astro', root)));
  assert.equal(existsSync(new URL('src/draft-pages/lp.astro', root)), false);
  assert.equal(existsSync(new URL('src/draft-pages/home-value.astro', root)), false);
});

test('the dynamic page builds only the LPs of the registry (Downsizing), so it cannot publish anything by accident', () => {
  assert.match(read('src/content/lps/index.ts'), /landingPages: LandingPage\[\] = \[downsizing\];/);
});

test('the draft mechanism stays for future drafts: routes only in dev or with PUBLIC_DRAFT_LPS=true, and every listed draft exists, in no other place', () => {
  const config = read('astro.config.mjs');
  assert.match(config, /command !== 'dev' && env\.PUBLIC_DRAFT_LPS !== 'true'\) return/);
  const list = config.match(/const draftRoutes[^=]*= \[([\s\S]*?)\];/)?.[1] ?? '';
  const entrypoints = [...list.matchAll(/entrypoint: '\.\/(src\/draft-pages\/[^']+)'/g)].map((m) => m[1]);
  for (const file of entrypoints) assert(existsSync(new URL(file, root)), `${file} is listed but missing`);
  // A page is either a draft or published, never both.
  const drafts = existsSync(new URL('src/draft-pages', root)) ? readdirSync(new URL('src/draft-pages', root)) : [];
  const pages = readdirSync(new URL('src/pages', root));
  assert.deepEqual(drafts.filter((file) => pages.includes(file)), [], 'a page in both src/draft-pages and src/pages');
});

test('/ goes to Silver', () => {
  assert.match(read('astro.config.mjs'), /'\/': '\/silver'/);
  const netlify = read('netlify.toml');
  assert.match(netlify, /from = "\/"\s+to = "\/silver"/);
  assert.doesNotMatch(netlify, /to = "\/downsizing"/);
});

test('Downsizing: what is not confirmed yet is left out of the page, not shown as a TODO', () => {
  const file = read('src/content/lps/downsizing.ts');
  // The hidden parts are kept in two constants. Outside them no TODO marker is part of the copy.
  const outsideHidden = file
    .replace(/const whatWeAppraise: PageSection = [\s\S]*?\n\};\n/, '')
    .replace(/const resaleFaq: FaqItem = [\s\S]*?\n\};\n/, '');
  assert.doesNotMatch(outsideHidden, /\{\{\s*TODO/, 'a TODO marker would reach the page');
  assert.match(file, /categories: false,/);
  assert.match(file, /resale: false,/);
  assert.match(file, /\.\.\.\(confirmed\.categories \? \[whatWeAppraise\] : \[\]\)/);
  assert.match(file, /\.\.\.\(confirmed\.resale \? \[resaleFaq\] : \[\]\)/);
  // The button that pointed at the hidden section goes to the form instead.
  assert.match(file, /talkToUsLink: Link = confirmed\.categories\s*\? \{ label: 'See what we appraise'/);
  // No photo yet: a text-only hero and no share image tag.
  assert.match(file, /imagePlaceholder: '',/);
  assert.match(file, /ogImage: '',/);
});

test('the hero is text only when there is neither a photo nor a placeholder note, and the share image tag needs an image', () => {
  assert.match(read('src/components/Hero.astro'), /const hasMedia = Boolean\(section\.image \|\| section\.imagePlaceholder\)/);
  assert.match(read('src/layouts/Document.astro'), /const ogImage = meta\.ogImage \? absoluteUrl\(meta\.ogImage, Astro\.site\) : null/);
});
