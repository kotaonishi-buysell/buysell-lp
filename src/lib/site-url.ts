/*
 * Absolute URLs for canonical links and Open Graph tags.
 * The site origin is Astro's `site` (astro.config.mjs): Netlify's own URL for the site (it follows a custom
 * domain once one is set) or PUBLIC_SITE_URL. Without a real origin (a local build) there is no absolute
 * URL, and the tags are left out: a canonical link to a placeholder host would send crawlers, and link
 * checkers, to a page that does not exist.
 */
const PLACEHOLDER_HOSTS = new Set(['example.com', 'www.example.com']);

/** The absolute URL of a path on the site, or null when the site origin is not set (or is a placeholder). */
export const absoluteUrl = (path: string, site: URL | string | undefined): string | null => {
  if (!site) return null;
  let origin: URL;
  try {
    origin = new URL(site);
  } catch {
    return null;
  }
  if (PLACEHOLDER_HOSTS.has(origin.hostname)) return null;
  return new URL(path, origin).href;
};
