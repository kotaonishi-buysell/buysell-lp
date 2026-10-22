// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: set to the production origin once hosting is decided (used for canonical and Open Graph URLs).
  site: 'https://example.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
    // The stylesheet is small; inlining it removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  // Only one LP exists for now; send the bare domain to it.
  redirects: {
    '/': '/downsizing',
  },
});
