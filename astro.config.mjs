// @ts-check
import { defineConfig } from 'astro/config';

// Node's environment (no @types/node in this project, so it is read through globalThis).
/** @type {Record<string, string | undefined>} */
const env = /** @type {any} */ (globalThis).process?.env ?? {};

export default defineConfig({
  // The origin used for canonical and Open Graph URLs. On Netlify, URL is the site's address (a custom domain
  // once one is set), so nothing needs changing; elsewhere set PUBLIC_SITE_URL. With neither, the tags are left out.
  site: env.PUBLIC_SITE_URL || env.URL || undefined,
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
