import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');
const walk = (dir) =>
  readdirSync(new URL(dir, root), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}${e.name}/`) : [`${dir}${e.name}`],
  );
const sourceFiles = walk('src/').filter((f) => /\.(astro|ts)$/.test(f));
const importersOf = (css) => sourceFiles.filter((f) => new RegExp(`import '[^']*${css.replace('.', '\\.')}'`).test(read(f))).sort();

const family = [
  ['silver', 'SilverLayout'],
  ['appraisal', 'AppraisalLayout'],
  ['replace-pwshp', 'ReplacePwshpLayout'],
];

test('silver-family.css is loaded only by the three layouts of the Silver family', () => {
  assert.deepEqual(
    importersOf('silver-family.css'),
    family.map(([, layout]) => `src/layouts/${layout}.astro`).sort(),
  );
});

test('each family LP file is loaded only by its own layout, after the shared base', () => {
  for (const [lp, layout] of family) {
    assert.deepEqual(importersOf(`${lp}.css`), [`src/layouts/${layout}.astro`], `${lp}.css importers`);
    const source = read(`src/layouts/${layout}.astro`);
    const baseAt = source.indexOf("styles/silver-family.css'");
    const lpAt = source.indexOf(`styles/${lp}.css'`);
    assert(baseAt > -1 && lpAt > baseAt, `${layout} loads silver-family.css before ${lp}.css`);
  }
});

test('the other LPs and the legal pages never load the family base', () => {
  for (const layout of ['BaseLayout', 'GoldLayout', 'GoldV2Layout', 'LegalLayout']) {
    assert.doesNotMatch(read(`src/layouts/${layout}.astro`), /import '[^']*silver-family\.css'/, layout);
  }
});

test('the LP files hold only what differs: small, and no copy of the form skin or of the base rules', () => {
  const base = read('src/styles/silver-family.css');
  assert.match(base, /\[data-lp\] :is\(\.cf, \.cf-success\)/, 'the form skin is in the shared base');
  for (const [lp] of family) {
    const css = read(`src/styles/${lp}.css`);
    assert(css.split('\n').length < 80, `${lp}.css should stay small (it is ${css.split('\n').length} lines)`);
    assert.doesNotMatch(css, /\.cf-label|--cf-text/, `${lp}.css must not repeat the form skin`);
  }
});
