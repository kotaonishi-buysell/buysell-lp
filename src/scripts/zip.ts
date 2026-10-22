/** ZIP code check shared by the request form and the service-area box of an LP. */
export const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;

export interface ZipConfig {
  zipPrefixes: string[];
  zipMessages: { inArea: string; outOfArea: string; notConfigured: string };
}

/** HTML message for a ZIP code, or '' while the value is not a complete ZIP yet. */
export const zipAreaMessage = (value: string, config: ZipConfig): string => {
  const zip = value.trim();
  if (!ZIP_PATTERN.test(zip)) return '';
  if (config.zipPrefixes.length === 0) return config.zipMessages.notConfigured;
  const inArea = config.zipPrefixes.some((prefix) => zip.startsWith(prefix));
  return inArea ? config.zipMessages.inArea : config.zipMessages.outOfArea;
};
