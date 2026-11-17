/*
 * Copy of the text-message sign-up page (/sms). This is the public page where a customer agrees to texts:
 * the shared contact form, with the SMS checkbox unticked, plus a plain statement of the program.
 * It is the "consent form on our website" URL for the carriers' toll-free number review.
 *
 * Tokens filled in by the page: {brand} {company} {phone} {email}.
 * The consent wording itself is in src/content/contact-form.ts and is shown beside the checkbox.
 */
import { smsMessageLimit } from './contact-form.ts';

export const smsConsentPage = {
  slug: 'sms',
  title: 'Text message sign-up',
  description: 'How {brand} uses text messages, and the form where you can agree to receive them.',
  intro:
    '{brand}, a service of {company}, offers free in-home appraisals. When you ask for a visit, you can choose to get text messages about it. Texting is optional: you can send the form below without agreeing to texts.',
  whatHeading: 'What the text messages are',
  what: [
    'Replies to your inquiry.',
    'Scheduling and reminders for your appraisal visit.',
    'If you decide to sell, follow-up about your sale, such as collecting your items.',
  ],
  detailsHeading: 'Before you agree',
  details: [
    `We send up to ${smsMessageLimit} messages per month.`,
    'Message and data rates may apply.',
    'Consent is not a condition of any purchase or service. You can ask for an appraisal without agreeing to texts.',
    'Reply STOP at any time to stop the messages. Reply HELP for help, or call {phone} or email {email}.',
    'We do not use text messages for advertising.',
    'We do not share your mobile number or your text-message consent with any third party or affiliate for their marketing or promotional purposes.',
  ],
  formHeading: 'Ask for a free appraisal',
  formIntro: 'Fill in the form. Tick the text-message box only if you want text messages.',
  submitLabel: 'Send my request',
  success: "Thank you. We've received your request and will be in touch.",
};
