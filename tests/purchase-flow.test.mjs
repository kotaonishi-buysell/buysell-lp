import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { purchaseFlow } from '../src/content/purchase-flow.ts';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

// The visit is an appraisal only (Texas Occupations Code 1956.067: a purchase at a temporary location may need a
// notice before each visit). If the customer decides to sell, we collect the items the next day or they send them.
test('the shared copy says the visit buys nothing, and how a sale goes after it', () => {
  assert.match(purchaseFlow.atVisit, /Nothing is bought at the visit/);
  assert.match(purchaseFlow.afterYes, /collect your items the next day, or you can send them to us/);
  assert.match(purchaseFlow.afterYes, /Payment is by bank transfer/);
  assert.doesNotMatch(purchaseFlow.full, /end of the next day|same[- ]day|within \d/i);
});

test('no published page or its copy says we buy at the customer\'s home, or promises a payment time', () => {
  const files = [
    'src/pages/silver.astro',
    'src/pages/gold.astro',
    'src/pages/appraisal.astro',
    'src/content/lps/silver.ts',
    'src/content/lps/gold.ts',
    'src/content/lps/appraisal.ts',
    'src/content/legal.ts',
  ];
  for (const file of files) {
    const text = read(file);
    assert.doesNotMatch(text, /appraise and buy/i, `${file}: "appraise and buy"`);
    assert.doesNotMatch(text, /Paid next day|Your offer on the spot|Your offer at the visit/i, `${file}: old payment headline`);
    assert.doesNotMatch(text, /(pay|paid|payment|transfer)[^.<]{0,60}end of the next (calendar )?day/i, `${file}: a payment time`);
    assert.doesNotMatch(text, /we (buy|purchase) (it|them|your [a-z ]+) (at|in) your home/i, `${file}: buying at home`);
  }
});
