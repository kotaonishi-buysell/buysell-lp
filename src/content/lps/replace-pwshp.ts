/*
 * Replace-pwshp LP (/replace-pwshp): in-home (house call) appraisals, for people who were about to carry things
 * to a shop to sell them. Like Appraisal it has its own page, src/pages/replace-pwshp.astro, and its own stylesheet.
 * This file holds the meta, the copy of the shared contact form, the FAQ (which analytics tracks) and the
 * category list. Company facts (phone, hours, registration) come from ../site.ts, which derives from ../company.ts.
 * Spec: docs/lp-house-call-spec.md. Design: docs/design/replace-pwshp/DESIGN_SYSTEM.md.
 *
 * Open business questions are kept as comments that begin with the word TODO: (listed by `npm run todos`); none reaches a visitor.
 * Copy rules (tests/replace-pwshp.test.mjs, tests/purchase-flow.test.mjs): never name, or urge people away from, any shop or
 * other company; no superlatives; no promise of a price; and nothing about payment that purchase-flow.ts does not say.
 */
import type { CustomLandingPage, FaqItem } from '../types.ts';
import { site } from '../site.ts';
import { purchaseFlow } from '../purchase-flow.ts';
import { replacePwshpItems, type ItemCard } from '../items.ts';

export const replacePwshp: CustomLandingPage = {
  slug: 'replace-pwshp',
  meta: {
    // TODO: the title and description are drafts. Agree them with the ad team (the page is indexable; the spec's draft said noindex, the business decided against it).
    title: `Sell from home: free in-home appraisals | ${site.brand.name}`,
    description:
      'Nothing to carry to a shop. Our appraiser visits your home, looks at a wide range of items in one visit, and tells you the appraised amount. Free, no obligation, in Texas.',
    // TODO: Silver's share image (REWORTH logo between two appraisers) is reused; replace it with a page-specific
    // image (1200x630) when one exists. SNS caches the image URL, so rename the file when replacing it.
    ogImage: '/images/og-silver-reworth.jpg',
    ogImageAlt: 'The REWORTH logo between two appraisers: one smiling in a suit, the other examining an item through a loupe.',
  },
  form: {
    // The form, its fields, consent text and destination are the shared ones (spec open question 6: reused as is).
    submitLabel: 'Send my request',
    afterSubmit:
      "We'll call or email within 3 business days to arrange a time. Nothing is sold unless you say so.",
    success: "Thank you. We've received your request and will be in touch to arrange a time.",
  },
};

/** The cards of "Items we buy". Defined once in ../items.ts (the confirmed Appraisal items, plus a catch-all). */
export const replacePwshpCategories: ItemCard[] = replacePwshpItems;

/** Shown in the page's FAQ. Answers marked "same as the other LPs" are the Silver / Appraisal wording. */
export const replacePwshpFaq: FaqItem[] = [
  {
    id: 'consignment',
    q: 'Is this consignment? When do I get paid?',
    // TODO: (spec open question 1): the spec's draft promised cash at the visit. The repository's purchase rule
    // (purchase-flow.ts) is: appraisal only at the visit, collection the next day or you send the items, payment by bank
    // transfer, no payment time promised. This answer follows that rule. Confirm "we purchase, we do not consign" with the business.
    a: `No. We purchase the items you decide to sell, rather than holding them for someone else to sell. ${purchaseFlow.full}`,
  },
  {
    id: 'free',
    q: 'Is the appraisal really free?',
    a: 'Yes. There is no appraisal fee and no obligation to sell.',
  },
  {
    id: 'decline',
    q: 'What happens if I decide not to sell?',
    a: 'You keep your items. There is no fee for declining, and the decision is entirely yours.',
  },
  {
    id: 'id',
    q: 'What ID will I need?',
    a: "If you decide to sell, we'll need a valid government-issued photo ID, such as a driver license or state ID card. Texas law requires us to record details from it, and to keep a record of each purchase that includes photographs of the items we buy. We'll tell you what we need when we arrange the pickup.",
  },
  {
    id: 'family',
    q: 'Can a family member be there during the visit?',
    a: 'Absolutely. A family member or someone you trust is always welcome to join you, ask questions, and help you decide.',
  },
  {
    id: 'areas',
    q: 'Which areas do you cover?',
    // TODO: (spec open question 3): same areas as Silver (Dallas–Fort Worth and Houston metropolitan areas; the ZIP list is
    // site.serviceArea.zipPrefixes). Confirm with the business that this LP covers the same area.
    a: `We visit homes in the Dallas–Fort Worth and Houston metropolitan areas of Texas, including Plano and The Woodlands. Enter your ZIP code in the box above to check. ${site.serviceArea.outsideNote}`,
  },
];
