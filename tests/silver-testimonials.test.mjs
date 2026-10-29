import test from 'node:test';
import assert from 'node:assert/strict';
import { silverTestimonials } from '../src/content/lps/silver-testimonials.ts';

test('Silver testimonials are shown only when every one is a real, sourced review', () => {
  if (!silverTestimonials.enabled) return; // hidden: nothing to check
  assert(silverTestimonials.items.length > 0, 'enabled with no reviews');
  for (const item of silverTestimonials.items) {
    assert(item.source && item.source.trim(), `no source for ${item.name}`);
  }
});

test('while hidden, the sample reviews have no source (they are not real)', () => {
  if (silverTestimonials.enabled) return;
  for (const item of silverTestimonials.items) assert.equal(item.source, null);
});
