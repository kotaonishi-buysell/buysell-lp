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

  test(`${lp} still tells visitors that its photography is illustrative`, () => {
    assert.match(read(`src/pages/${lp}.astro`), /<p class="fine footer-note">Illustrative photography\.<\/p>/);
  });
}
