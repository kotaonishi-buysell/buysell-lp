/*
 * Silver LP (/silver): silver appraisals by house call. Unlike the other LPs it
 * has its own page, src/pages/silver.astro, with its own stylesheet, because its
 * design differs from the Home Appraisal design system. This file holds what is
 * shared with the other LPs' machinery: meta, the consultation form and the FAQ
 * (which analytics tracks). The rest of the copy is in the page.
 * Company facts (phone, hours, registration) come from ../site.ts.
 */
import type { CustomLandingPage, FaqItem } from '../types';
import { site } from '../site';

export const silver: CustomLandingPage = {
  slug: 'silver',
  meta: {
    title: `Silver appraisals, right at your kitchen table | ${site.company.name}`,
    description:
      "Keep the silver at home. We'll handle the rest. Explore free, no-obligation silver appraisals by house call in Texas.",
    ogImage: '/images/og-silver.jpg',
    ogImageAlt: 'A silver appraiser and a homeowner looking at a flatware chest at a kitchen table. Illustrative image.',
  },
  form: {
    name: { label: 'Your name' },
    contact: {
      legend: 'How should we reach you?',
      hint: 'A phone number, an email address, or both.',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
    },
    zip: {
      label: 'ZIP code',
      hint: 'So we can check that we visit your area.',
      inArea: 'Good news. We visit homes in your area.',
      outOfArea: "We may not visit this ZIP code yet. Call us and we'll check.",
      notConfigured: '{{TODO: service-area ZIP list}}',
    },
    items: {
      legend: 'What would you like us to look at?',
      options: [
        'Silver flatware',
        'Tea and coffee service',
        'Trays and candlesticks',
        'Silver coins',
        'Silver jewelry',
        'Tarnished or damaged pieces',
        'Not sure it is silver',
      ],
      draftNote: '{{TODO: align with accepted items.}}',
    },
    amount: {
      label: 'Roughly how much silver do you have?',
      prompt: 'Choose one',
      options: ['A few pieces', 'A drawer or a small set', 'A full set, or more than one', 'Not sure'],
    },
    timing: {
      label: 'When would you like us to visit?',
      prompt: 'Choose one',
      options: ['As soon as possible', 'Within a month', 'In 1–3 months', 'Just exploring for now'],
    },
    notes: {
      label: 'Anything else we should know?',
      placeholder: "For example: other items you'd like us to look at, or family members who'd like to be there.",
    },
    privacy: {
      before: 'I have read and agree to the ',
      linkText: 'privacy policy',
      after: '.',
    },
    tcpa: {
      label: '{{TODO: consent to calls and text messages about this request. Wording to be confirmed by counsel (TCPA).}}',
    },
    optionalMark: '(optional)',
    submitLabel: 'Send my request',
    sendingLabel: 'Sending your request…',
    afterSubmit:
      "We'll call or email within {{TODO: number of}} business days to arrange a time. Nothing is sold unless you say so.",
    success: "Thank you. We've received your request and will be in touch to arrange a time.",
    failure: "Sorry, we couldn't send your request. Please try again, or call us at {phone}.",
    errors: {
      summaryOne: 'Please check 1 answer before sending.',
      summaryMany: 'Please check {count} answers before sending.',
      name: 'Please enter your name.',
      contactMissing: 'Please enter a phone number or an email address.',
      phoneInvalid: 'Please enter a 10-digit phone number, like (512) 555-0123.',
      emailInvalid: 'Please enter an email address, like name@example.com.',
      zipMissing: 'Please enter your ZIP code.',
      zipInvalid: 'Please enter a 5-digit ZIP code.',
      privacy: "Please confirm you've read the privacy policy.",
    },
  },
};

/** Shown in the page's FAQ. Bracketed placeholders from the mock-up are {{TODO}} markers here. */
export const silverFaq: FaqItem[] = [
  {
    id: 'is-it-real-silver',
    q: "I'm not sure it's real silver. How can I tell?",
    a: "Look for a stamp such as “925” or “Sterling.” Those marks can be a useful clue, but you don't need to identify anything yourself. Leave your pieces as they are and we'll take a look.",
  },
  {
    id: 'silver-plated',
    q: 'What if it turns out to be silver-plated?',
    a: "That's okay. We'll explain what we find. Silver-plated pieces have a thin silver layer rather than solid sterling silver, and purchase eligibility depends on the item.",
  },
  {
    id: 'incomplete-set',
    q: "My set isn't complete. Is that okay?",
    a: "Yes. You can show us incomplete sets, single pieces, and mismatched items. Everything doesn't have to match to be worth a look.",
  },
  {
    id: 'polish',
    q: 'Should I polish my silver before the visit?',
    a: 'No. Please leave it as it is. Polishing can remove patina or damage delicate details. We can assess tarnished silver.',
  },
  {
    id: 'other-items',
    q: 'Can you look at items other than silver?',
    a: "Yes. In fact, that's part of why we come. Tell us what else you'd like to show us when you book, and we'll confirm what we can appraise.",
  },
  {
    id: 'free',
    q: 'Is the appraisal really free?',
    a: 'Yes. There is no appraisal fee and no obligation to sell.',
  },
  {
    id: 'decline',
    q: 'What happens if I decide not to sell?',
    a: 'You keep your items. There is no fee for declining an offer, and the decision is entirely yours.',
  },
  {
    id: 'payment',
    q: 'When and how will I be paid?',
    a: 'If you accept an offer, payment is made before we leave. {{TODO: approved payment methods and any processing conditions.}}',
  },
  {
    id: 'id',
    q: 'What ID will I need?',
    a: "We'll tell you the identification and recordkeeping requirements before your appointment. {{TODO: Texas-specific ID requirements and approved wording, pending legal review.}}",
  },
  {
    id: 'family',
    q: 'Can a family member be there during the visit?',
    a: 'Absolutely. A family member or someone you trust is always welcome to join you, ask questions, and help you decide.',
  },
];
