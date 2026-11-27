import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { itemCatalog, appraisalItems, replacePwshpItems, homeValueItems, appraisalItemsText, homeValueItemsText, joinNames } from '../src/content/items.ts';
import { appraisalCategories, appraisalFaq } from '../src/content/lps/appraisal.ts';
import { replacePwshpCategories } from '../src/content/lps/replace-pwshp.ts';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('the LP content files use the lists of items.ts, not copies', () => {
  assert.equal(appraisalCategories, appraisalItems);
  assert.equal(replacePwshpCategories, replacePwshpItems);
  // Home Value's content file imports without extensions (Astro style), which Node cannot load here: read its source.
  const hv = read('src/content/lps/home-value/index.ts');
  assert.match(hv, /items: homeValueItems,/);
  assert.match(hv, /import \{ homeValueItems, homeValueItemsText \} from '..\/..\/items'/);
  for (const file of ['src/content/lps/appraisal.ts', 'src/content/lps/replace-pwshp.ts', 'src/content/lps/home-value/index.ts']) {
    assert.doesNotMatch(read(file), /<path d=|<circle cx=/, `${file} must not hold icon markup`);
  }
});

test('every card of the shared lists exists in the catalog, with its icon and alt text', () => {
  for (const card of [...appraisalItems, ...replacePwshpItems]) {
    assert(itemCatalog[card.id], `${card.id} is in the catalog`);
    assert(card.icon && card.alt && card.label, `${card.id} has icon, alt and label`);
  }
  assert.equal(new Set(appraisalItems.map((c) => c.id)).size, appraisalItems.length, 'no duplicate in Appraisal');
  assert.equal(new Set(replacePwshpItems.map((c) => c.id)).size, replacePwshpItems.length, 'no duplicate in Replace-pwshp');
});

test('the sentences that list the items come from the same lists', () => {
  const what = appraisalFaq.find((f) => f.id === 'what-can-i-show');
  assert(what.a.includes(appraisalItemsText));
  for (const card of appraisalItems) assert(appraisalItemsText.includes(card.name), card.name);
  assert.match(read('src/content/lps/home-value/index.ts'), /You can show us \$\{homeValueItemsText\}\./);
  assert.equal(homeValueItemsText, 'bags, watches, jewelry and accessories, tableware, cameras, musical instruments, coins and stamps, art and antiques, and other belongings');
  for (const item of homeValueItems) assert(homeValueItemsText.includes(item.plain), item.plain);
});

test('every Home Value card has its illustration in public/', () => {
  const files = new Set(readdirSync(new URL('public/images/home-value/', root)));
  for (const item of homeValueItems) assert(files.has(`${item.image}-sample.svg`), item.image);
});

test('joinNames writes a list as a sentence', () => {
  assert.equal(joinNames(['a']), 'a');
  assert.equal(joinNames(['a', 'b']), 'a and b');
  assert.equal(joinNames(['a', 'b', 'c']), 'a, b and c');
  assert.equal(joinNames(['a', 'b', 'c'], true), 'a, b, and c');
});
