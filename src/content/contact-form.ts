/*
 * Shared contact form: one delivery setting and one set of copy for every LP.
 * LPs only choose the heading, submit label, thank-you text and skin.
 * Change the delivery here once and every LP follows.
 */

export type ContactMode = 'preview' | 'netlify-forms' | 'function';

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

/**
 * How a request is delivered. netlify.toml sets PUBLIC_CONTACT_MODE for Netlify builds only, so a
 * local build stays in preview mode: nothing is sent and the form says so.
 *
 *   netlify-forms  the browser posts to its own page and Netlify Forms stores the submission
 *                  (notifications are set in the Netlify dashboard). Default on Netlify.
 *   function       the browser posts JSON to PUBLIC_CONTACT_ENDPOINT (src/server/contact.ts,
 *                  e.g. '/api/contact'), which checks it again and adds a row to a Google Sheet
 *                  and/or emails it. Set the endpoint variable and leave PUBLIC_CONTACT_MODE unset
 *                  to use it. With PUBLIC_CONTACT_FALLBACK=netlify-forms, a request the function
 *                  could not take (not set up yet, or down) goes to Netlify Forms instead, so no
 *                  inquiry is lost (never after a refusal such as a bad input).
 *   preview        neither is set.
 */
export const contactFormConfig = {
  mode: (env.PUBLIC_CONTACT_MODE === 'netlify-forms'
    ? 'netlify-forms'
    : env.PUBLIC_CONTACT_ENDPOINT
      ? 'function'
      : 'preview') as ContactMode,
  /** Same-origin path (e.g. '/api/contact') or an https:// URL. Used by the 'function' mode only. */
  endpoint: (env.PUBLIC_CONTACT_ENDPOINT || null) as string | null,
  /** Used by the 'function' mode: where to send a request the function could not take. */
  fallback: (env.PUBLIC_CONTACT_MODE !== 'netlify-forms' && env.PUBLIC_CONTACT_ENDPOINT && env.PUBLIC_CONTACT_FALLBACK === 'netlify-forms'
    ? 'netlify-forms'
    : null) as 'netlify-forms' | null,
  /** Name of the form in Netlify Forms. The same on every LP, so one form collects them all. */
  formName: 'contact',
};

/** Most text messages we send one person in a month. Stated in the consent wording, the Terms and the Privacy Policy. */
export const smsMessageLimit = 10;

export const contactFormCopy = {
  fields: {
    firstName: 'First name',
    lastName: 'Last name',
    zip: 'ZIP code',
    phone: 'Phone number',
    email: 'Email',
    message: 'How can we help you?',
  },
  required: '(required)',
  optional: '(optional)',
  zipHint: 'We use this to check that we can visit your area.',
  /** Above the submit button: the form is for adults. */
  ageNote: 'By sending this request, you confirm that you are 18 or older.',
  /** Under the message box: keep sensitive details out of the free text. */
  messageHint: "Please don't write ID numbers, bank account details or other sensitive information here. We'll ask for anything we need later.",
  /** {count} is replaced with the number of characters left. */
  remaining: '{count} characters left',
  remainingOne: '1 character left',
  // TODO: provisional wording, replace after legal review (TCPA). {brand} and {company} are filled in by smsConsentText.
  // Toll-free verification asks for: who sends, what kinds of messages, how often, rates, STOP/HELP, "consent is not a
  // condition", and links to the Terms and Privacy Policy. Keep all of them.
  smsConsent:
    `I agree to receive text messages from {brand}, a service of {company}, about my inquiry, scheduling my visit and, if I sell items to you, follow-up about my sale. Up to ${smsMessageLimit} messages per month. Msg & data rates may apply. Consent is not a condition of any purchase or service. Reply STOP to opt out, HELP for help.`,
  /** Sentence after the consent wording; the two names are links to the Terms and the Privacy Policy. */
  smsConsentSee: { before: 'See our ', terms: 'Terms of Use', and: ' and ', privacy: 'Privacy Policy', after: '.' },
  submit: 'Send my request',
  sending: 'Sending your request…',
  edit: 'Edit my details',
  privacy: 'Privacy policy',
  previewNote: 'Preview only. No request will be sent.',
  previewResult: 'Preview only. Your details are valid, but nothing was sent and no appointment has been booked.',
  previewThanksLabel: 'Visitors will see this message after a successful request:',
  defaultSuccess: "Thank you. We've received your request and will be in touch.",
  failure: "We couldn't send your request. Please check your connection and try again.",
  /** {count} is replaced with the number of fields to fix. */
  summary: 'Please check {count} fields below and try again.',
  summaryOne: 'Please check 1 field below and try again.',
  errors: {
    firstName: {
      required: 'Please enter your first name.',
      invalid: 'First name can only include letters, spaces, hyphens, apostrophes and periods.',
    },
    lastName: {
      required: 'Please enter your last name.',
      invalid: 'Last name can only include letters, spaces, hyphens, apostrophes and periods.',
    },
    zip: {
      required: 'Please enter your ZIP code.',
      invalid: 'Enter a 5-digit ZIP code, like 75201, or a ZIP+4, like 75201-1234.',
    },
    phone: {
      required: 'Please enter your phone number.',
      invalid: 'Enter a 10-digit U.S. phone number, like (214) 555-0123.',
    },
    email: {
      invalid: 'Enter an email address like name@example.com, or leave this blank.',
    },
    message: {
      tooLong: 'Please keep your message to 1,000 characters or fewer.',
    },
  },
};

export type ContactFormCopy = typeof contactFormCopy;

/**
 * The full consent wording, as stored with each request. It must read exactly as shown next to the checkbox:
 * the text, then "See our Terms of Use and Privacy Policy." (ContactForm renders those two names as links).
 */
export const smsConsentText = (company: string, brand: string): string => {
  const see = contactFormCopy.smsConsentSee;
  return `${contactFormCopy.smsConsent.replace('{brand}', brand).replace('{company}', company)} ${see.before}${see.terms}${see.and}${see.privacy}${see.after}`;
};
