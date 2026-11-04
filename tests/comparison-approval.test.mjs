import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { silverComparison } from '../src/content/lps/silver-comparison.ts';
import { goldComparison } from '../src/content/lps/gold-comparison.ts';

const comparisons = { silver: silverComparison, gold: goldComparison };

test('a competitor comparison is shown only after legal has approved it', () => {
  for (const [lp, flag] of Object.entries(comparisons)) {
    if (!flag.enabled) continue; // hidden: nothing to check
    assert(flag.legalApproved && flag.legalApproved.trim(), `${lp}: enabled without legalApproved`);
  }
});

test('while hidden, nobody has approved it yet', () => {
  for (const [lp, flag] of Object.entries(comparisons)) {
    if (flag.enabled) continue;
    assert.equal(flag.legalApproved, null, lp);
  }
});

test('Gold keeps its comparison behind the flag, without the TODO note, and says four promises', () => {
  const page = readFileSync(new URL('../src/pages/gold.astro', import.meta.url), 'utf8');
  assert.match(page, /\{goldComparison\.enabled && <section class="sec" id="cmp">/);
  assert.doesNotMatch(page, /counsel review|comparisonNote|idAtDoorNote|insuredNote|houstonNote|dealerLookupNote|itemsListNote/);
  assert.equal(page.match(/<div class="pro">/g)?.length, 4);
  assert.match(page, /Four things that are always true/);
});

test('the page keeps the comparison behind the flag and numbers the sections after it without a gap', () => {
  const page = readFileSync(new URL('../src/pages/silver.astro', import.meta.url), 'utf8');
  assert.match(page, /\{silverComparison\.enabled && <section class="comparison/);
  assert.doesNotMatch(page, /legal to confirm this comparison/);
  for (const n of [7, 8, 9]) assert.match(page, new RegExp(`\\{no\\(${n}\\)\\} /`));
});
