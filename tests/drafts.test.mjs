import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);

test('the draft LPs (/downsizing, /home-value) are not pages of a normal build', () => {
  const pages = readdirSync(new URL('src/pages', root));
  assert.deepEqual(pages.filter((f) => /downsizing|home-value|\[/.test(f)), [], 'no draft or dynamic page in src/pages');
  assert(existsSync(new URL('src/draft-pages/home-value.astro', root)));
  assert(existsSync(new URL('src/draft-pages/lp.astro', root)));
});

test('the drafts are routes only in dev or with PUBLIC_DRAFT_LPS=true, and / goes to Silver', () => {
  const config = readFileSync(new URL('astro.config.mjs', root), 'utf8');
  assert.match(config, /command !== 'dev' && env\.PUBLIC_DRAFT_LPS !== 'true'\) return/);
  assert.match(config, /'\/': '\/silver'/);
  const netlify = readFileSync(new URL('netlify.toml', root), 'utf8');
  assert.match(netlify, /from = "\/"\s+to = "\/silver"/);
  assert.doesNotMatch(netlify, /to = "\/downsizing"/);
});
