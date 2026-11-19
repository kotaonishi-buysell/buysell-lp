// @ts-check
import { defineConfig } from 'astro/config';

// Node's environment (no @types/node in this project, so it is read through globalThis).
/** @type {Record<string, string | undefined>} */
const env = /** @type {any} */ (globalThis).process?.env ?? {};

// Draft LPs: pages that are still being built. Put the page in src/draft-pages/ (Astro does not turn that folder into
// pages by itself) and list its route below. It is then a route only in `astro dev`, or in a build with
// PUBLIC_DRAFT_LPS=true (npm run build:drafts); a normal build, so the Netlify production site, does not publish it.
// To publish a draft, move the page into src/pages/ and remove its line here (README.md).
// There are no drafts now: /downsizing and /home-value were published on 2026-11-19.
/** @type {{ pattern: string; entrypoint: string }[]} */
const draftRoutes = [];

/** @type {import('astro').AstroIntegration} */
const draftPages = {
  name: 'draft-lps',
  hooks: {
    'astro:config:setup': ({ command, injectRoute, logger }) => {
      if (draftRoutes.length === 0) return;
      if (command !== 'dev' && env.PUBLIC_DRAFT_LPS !== 'true') return;
      for (const route of draftRoutes) injectRoute(route);
      logger.info(`Draft LPs are included: ${draftRoutes.map((route) => route.pattern).join(', ')}.`);
    },
  },
};

export default defineConfig({
  integrations: [draftPages],
  // The origin used for canonical and Open Graph URLs. On Netlify, URL is the site's address (a custom domain
  // once one is set), so nothing needs changing; elsewhere set PUBLIC_SITE_URL. With neither, the tags are left out.
  site: env.PUBLIC_SITE_URL || env.URL || undefined,
  trailingSlash: 'never',
  build: {
    format: 'file',
    // The stylesheet is small; inlining it removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  // The bare domain goes to Silver, the LP that is live.
  redirects: {
    '/': '/silver',
  },
});
