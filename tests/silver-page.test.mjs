import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../src/pages/silver.astro', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles/silver.css', import.meta.url), 'utf8');

test('Silver carries no design-preview banner or draft wording', () => {
  assert.doesNotMatch(page, /DESIGN PREVIEW|Design preview|showPreviewStrip|preview-strip|require\s+confirmation before launch/i);
  assert.doesNotMatch(css, /preview-strip|footer-preview/);
});

test('Silver still tells visitors that its photography is illustrative (only the hero is a real photograph)', () => {
  assert.match(page, /<p class="fine footer-note">Illustrative photography\.<\/p>/);
});
