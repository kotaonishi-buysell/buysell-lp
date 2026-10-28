/*
 * Service-area ZIP check, shared by every LP that shows the ZIP box (src/components/ZipCheck.astro).
 * "Is this a ZIP code?" is the contact form's rule (normalizeZip: 12345, 12345-6789 or nine digits),
 * so the box and the form cannot disagree.
 */
import { normalizeZip } from './contact-form.ts';

export interface ZipConfig {
  /** ZIP code prefixes we visit, e.g. "770" for Houston. Empty = the list is not configured yet. */
  zipPrefixes: string[];
  /** HTML (already escaped, may hold a TODO placeholder). */
  zipMessages: { inArea: string; outOfArea: string; notConfigured: string };
}

export type ZipAreaStatus = 'invalid' | 'notConfigured' | 'inArea' | 'outOfArea';

/** What the ZIP code is: not a ZIP code yet, no list to check against, in the area or out of it. */
export const zipAreaStatus = (value: string, config: Pick<ZipConfig, 'zipPrefixes'>): ZipAreaStatus => {
  const zip = normalizeZip(value);
  if (!zip) return 'invalid';
  if (config.zipPrefixes.length === 0) return 'notConfigured';
  return config.zipPrefixes.some((prefix) => zip.startsWith(prefix)) ? 'inArea' : 'outOfArea';
};

/** HTML message for a ZIP code, or '' while the value is not a complete ZIP code yet. */
export const zipAreaMessage = (value: string, config: ZipConfig): string => {
  const status = zipAreaStatus(value, config);
  return status === 'invalid' ? '' : config.zipMessages[status];
};
