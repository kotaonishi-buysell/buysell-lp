/*
 * Shared contact form: one endpoint and one set of copy for every LP.
 * LPs only choose the heading, submit label, thank-you text and skin.
 * Change the destination here once and every LP follows.
 */

export const contactFormConfig = {
  // TODO: shared receiving endpoint. Same-origin path (e.g. '/api/contact') or an https:// URL.
  // It must answer 2xx with JSON { "accepted": true }. While null, no request is sent
  // and the form says so (preview mode).
  endpoint: null as string | null,
};

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
  /** {count} is replaced with the number of characters left. */
  remaining: '{count} characters left',
  remainingOne: '1 character left',
  // TODO: provisional wording, replace after legal review (TCPA). {company} is the LP's company name.
  smsConsent:
    'I agree to receive text messages from {company} about my inquiry. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help.',
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

/** Fills the {company} token of the consent wording. */
export const smsConsentText = (company: string): string => contactFormCopy.smsConsent.replace('{company}', company);
