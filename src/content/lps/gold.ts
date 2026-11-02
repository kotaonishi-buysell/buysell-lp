/*
 * Gold LP (/gold): gold appraisals by house call. Like Silver it has its own page,
 * src/pages/gold.astro, and its own stylesheet (src/styles/gold.css), because its design differs from the
 * Home Appraisal design system. This file holds what is shared with the other LPs' machinery (meta and the
 * copy of the shared contact form) and the page copy that carries unconfirmed facts ({{TODO: ...}} markers,
 * listed by `npm run todos`). The rest of the copy is in the page.
 * Company facts (phone, address, registration) come from ../site.ts, which reads ../company.ts.
 */
import type { CustomLandingPage } from '../types.ts';
import { site } from '../site.ts';
import { paymentNote } from '../payment-note.ts';

export const gold: CustomLandingPage = {
  slug: 'gold',
  meta: {
    title: `Sell gold at home in Dallas–Fort Worth & Houston | Free in-home appraisal | ${site.brand.name}`,
    description:
      'We come to your home in Dallas–Fort Worth and Houston to appraise and buy gold jewelry, chains, rings and broken gold. Free appraisal, no obligation to sell.',
    ogImage: '/images/og-gold.jpg',
    ogImageAlt: 'An appraiser in white gloves looks at gold jewelry with a loupe at a customer’s dining table. Illustrative image.',
  },
  form: {
    submitLabel: 'Send my request',
    afterSubmit:
      "We'll call or email within {{TODO: number of}} business days to arrange a time. Nothing is sold unless you say so.",
    success: "Thank you. We've received your request and will be in touch to arrange a time.",
  },
};

/**
 * Page copy with unconfirmed facts. {{TODO: ...}} shows as a placeholder on the page (see lib/text.ts).
 * Payment: the amount is told at the visit; if the customer agrees to sell, we pay by bank transfer by the end of
 * the next calendar day (the same on every LP, see ../payment-note.ts).
 */
export const goldCopy = {
  visitTiming: 'We visit within {{TODO: number of}} days.',
  step4: "It's a sale, not consignment. If you agree to sell, we pay you by bank transfer by the end of the next day.",
  payment: 'Once you decide to sell, we buy it and pay you by bank transfer by the end of the next day.',
  paymentNote,
  itemsListNote: '{{TODO: confirm the full list of items we buy}}',
  houstonNote: '{{TODO: confirm when Houston visits start}}',
  idAtDoorNote: '{{TODO: confirm that our appraisers show ID at the door}}',
  comparisonNote: '{{TODO: have U.S. counsel review the comparison wording}}',
  insuredNote: 'Insured {{TODO: confirm insurance wording}}.',
  dealerLookupNote: '{{TODO: link to the Texas dealer registration look-up}}',
};
