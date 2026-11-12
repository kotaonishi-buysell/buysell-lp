import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

// The published LPs that once carried the mock-up banner.
for (const lp of ['silver', 'appraisal']) {
  test(`${lp} carries no design-preview banner or draft wording`, () => {
    assert.doesNotMatch(read(`src/pages/${lp}.astro`), /DESIGN PREVIEW|Design preview|showPreviewStrip|preview-strip|require\s+confirmation before launch/i);
    assert.doesNotMatch(read(`src/styles/${lp}.css`), /preview-strip|footer-preview/);
  });

  test(`${lp} no longer prints the "Illustrative photography" note (removed on request, 2026-11-12)`, () => {
    assert.doesNotMatch(read(`src/pages/${lp}.astro`), /Illustrative photography/);
  });
}
