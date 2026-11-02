import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { silverComparison } from '../src/content/lps/silver-comparison.ts';

test('the competitor comparison is shown only after legal has approved it', () => {
  if (!silverComparison.enabled) return; // hidden: nothing to check
  assert(silverComparison.legalApproved && silverComparison.legalApproved.trim(), 'enabled without legalApproved');
});

test('while hidden, nobody has approved it yet', () => {
  if (silverComparison.enabled) return;
  assert.equal(silverComparison.legalApproved, null);
});

test('the page keeps the comparison behind the flag and numbers the sections after it without a gap', () => {
  const page = readFileSync(new URL('../src/pages/silver.astro', import.meta.url), 'utf8');
  assert.match(page, /\{silverComparison\.enabled && <section class="comparison/);
  assert.doesNotMatch(page, /legal to confirm this comparison/);
  for (const n of [7, 8, 9]) assert.match(page, new RegExp(`\\{no\\(${n}\\)\\} /`));
});
