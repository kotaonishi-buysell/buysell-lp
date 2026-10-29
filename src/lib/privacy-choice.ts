/*
 * The visitor's choice to turn off the advertising and measurement tools (Google Tag Manager and the Meta Pixel,
 * Google Analytics and Microsoft Clarity it loads). Used by the layout that loads Google Tag Manager
 * (layouts/Document.astro) and by the Do Not Sell or Share page (scripts/privacy-choice.ts), so both agree.
 *
 * Off when the browser sends Global Privacy Control, or the visitor opted out on this browser (localStorage).
 */
export const PRIVACY_OPTOUT_KEY = 'rw-privacy-optout';

/** Cookies those tools set on our own domain; removed when the visitor opts out. */
export const TRACKING_COOKIE_PATTERNS: RegExp[] = [/^_ga$/, /^_ga_.+$/, /^_gid$/, /^_gat(_.+)?$/, /^_fbp$/, /^_fbc$/, /^_clck$/, /^_clsk$/];

export const isTrackingCookie = (name: string): boolean => TRACKING_COOKIE_PATTERNS.some((pattern) => pattern.test(name));

interface NavigatorLike {
  globalPrivacyControl?: boolean;
}
interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Navigator has no typed globalPrivacyControl yet, so it is read through a narrow type. */
export const gpcOn = (nav: object): boolean => (nav as NavigatorLike).globalPrivacyControl === true;

const safe = <T>(read: () => T, fallback: T): T => {
  try {
    return read();
  } catch {
    return fallback;
  }
};

export const optedOut = (storage: StorageLike | null): boolean => !!storage && safe(() => storage.getItem(PRIVACY_OPTOUT_KEY) === '1', false);

export const setOptOut = (storage: StorageLike | null, value: boolean): void => {
  if (!storage) return;
  safe(() => (value ? storage.setItem(PRIVACY_OPTOUT_KEY, '1') : storage.removeItem(PRIVACY_OPTOUT_KEY)), undefined);
};

/** Cookie names in a document.cookie string. */
export const cookieNames = (cookie: string): string[] =>
  cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter(Boolean);

/** Domains a cookie could have been set for: the host and each parent ("a.b.com" -> a.b.com, .a.b.com, .b.com). */
export const cookieDomains = (hostname: string): string[] => {
  const parts = hostname.split('.');
  const domains = [hostname];
  for (let i = 0; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
  return domains;
};

/** Expires the tool cookies on this host and its parent domains. */
export const clearTrackingCookies = (doc: { cookie: string }, hostname: string): void => {
  for (const name of cookieNames(doc.cookie).filter(isTrackingCookie)) {
    for (const domain of cookieDomains(hostname)) {
      doc.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    }
    doc.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
};
