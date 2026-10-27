/*
 * Copy of the service-area ZIP box, shared by every LP that shows it.
 * The list of ZIP codes we visit is site.serviceArea.zipPrefixes (src/content/site.ts).
 * An LP may pass its own label, placeholder or button text to ZipCheck.astro.
 */
export const zipCheckCopy = {
  label: 'Check your ZIP code',
  placeholder: 'Enter your ZIP code',
  button: 'Check availability',
  /** Shown before a ZIP code is checked, and again when the entry is not a ZIP code. */
  prompt: 'Enter a 5-digit ZIP code.',
  inArea: 'Good news. We visit homes in your area.',
  outOfArea: "We may not visit this ZIP code yet. Call us and we'll check.",
  notConfigured: '{{TODO: service-area ZIP list}}',
  /** Button under the "in your area" answer. It opens the contact form with the ZIP code filled in. */
  requestButton: 'Request a visit',
};
