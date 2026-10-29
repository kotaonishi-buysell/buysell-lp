// @ts-check
import { defineConfig } from 'astro/config';

// Node's environment (no @types/node in this project, so it is read through globalThis).
/** @type {Record<string, string | undefined>} */
const env = /** @type {any} */ (globalThis).process?.env ?? {};

// Draft LPs (/downsizing, /home-value) are still being built. Their code stays in src/draft-pages/, which Astro does
// not turn into pages by itself: they are added as routes only in `astro dev`, or in a build with
// PUBLIC_DRAFT_LPS=true (npm run build:drafts). A normal build, so the Netlify production site, publishes only
// the pages in src/pages/ (Silver and the legal pages). To publish a draft, move it into src/pages/ (or add it to
// the list below), see README.md.
/** @type {import('astro').AstroIntegration} */
const draftPages = {
  name: 'draft-lps',
  hooks: {
    'astro:config:setup': ({ command, injectRoute, logger }) => {
      if (command !== 'dev' && env.PUBLIC_DRAFT_LPS !== 'true') return;
      injectRoute({ pattern: '/[slug]', entrypoint: './src/draft-pages/lp.astro' });
      injectRoute({ pattern: '/home-value', entrypoint: './src/draft-pages/home-value.astro' });
      logger.info('Draft LPs are included: /downsizing and /home-value.');
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
