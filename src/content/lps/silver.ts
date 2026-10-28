/*
 * Silver LP (/silver): silver appraisals by house call. Unlike the other LPs it
 * has its own page, src/pages/silver.astro, with its own stylesheet, because its
 * design differs from the Home Appraisal design system. This file holds what is
 * shared with the other LPs' machinery: meta, the copy of the shared contact form and
 * the FAQ (which analytics tracks). The ZIP box copy is shared too (content/zip-check.ts). The rest of the copy is in the page.
 * Company facts (phone, hours, registration) come from ../site.ts.
 */
import type { CustomLandingPage, FaqItem } from '../types';
import { site } from '../site';
import { paymentNote } from '../payment-note';

export const silver: CustomLandingPage = {
  slug: 'silver',
  meta: {
    title: `Silver appraisals, right at your kitchen table | ${site.brand.name}`,
    description:
      "Keep the silver at home. We'll handle the rest. Explore free, no-obligation silver appraisals by house call in Texas.",
    ogImage: '/images/og-silver.jpg',
    ogImageAlt: 'A silver appraiser and a homeowner looking at a flatware chest at a kitchen table. Illustrative image.',
  },
  form: {
    submitLabel: 'Send my request',
    afterSubmit:
      "We'll call or email within {{TODO: number of}} business days to arrange a time. Nothing is sold unless you say so.",
    success: "Thank you. We've received your request and will be in touch to arrange a time.",
  },
};

/** Shown in the page's FAQ. Bracketed placeholders from the mock-up are TODO markers here. */
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
    a: 'If you accept an offer, we tell you the amount at your home, and we pay you by bank transfer by the end of the next day.',
    note: paymentNote,
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
