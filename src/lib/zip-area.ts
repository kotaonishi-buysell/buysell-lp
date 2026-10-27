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

/** HTML message for a ZIP code, or '' while the value is not a complete ZIP code yet. */
export const zipAreaMessage = (value: string, config: ZipConfig): string => {
  const zip = normalizeZip(value);
  if (!zip) return '';
  if (config.zipPrefixes.length === 0) return config.zipMessages.notConfigured;
  const inArea = config.zipPrefixes.some((prefix) => zip.startsWith(prefix));
  return inArea ? config.zipMessages.inArea : config.zipMessages.outOfArea;
};
