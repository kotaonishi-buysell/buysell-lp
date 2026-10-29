import test from 'node:test';
import assert from 'node:assert/strict';
import { absoluteUrl } from '../src/lib/site-url.ts';

test('a real site origin gives absolute URLs', () => {
  assert.equal(absoluteUrl('/terms', new URL('https://loquacious-muffin-1f588f.netlify.app')), 'https://loquacious-muffin-1f588f.netlify.app/terms');
  assert.equal(absoluteUrl('/images/og.jpg', 'https://reworth.example.org/'), 'https://reworth.example.org/images/og.jpg');
});

test('no origin, or a placeholder host, gives no URL (so no canonical link to a page that does not exist)', () => {
  assert.equal(absoluteUrl('/terms', undefined), null);
  assert.equal(absoluteUrl('/terms', new URL('https://example.com')), null);
  assert.equal(absoluteUrl('/terms', 'https://www.example.com'), null);
  assert.equal(absoluteUrl('/terms', 'not a url'), null);
});
