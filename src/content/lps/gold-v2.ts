/*
 * Gold LP, second design (/gold-v2): the Figma design "バイセルUS_GOLD_LP" (SP_W390_A), a single mobile layout that is also
 * used, at the same width, on wide screens. It is a published page (src/pages/gold-v2.astro) next to /gold, which it does
 * not replace or change. This file holds what is shared with the other LPs' machinery (meta and the copy of the shared
 * contact form) and the copy that follows the company-wide sales flow. Company facts (phone, address, registration)
 * come from ../site.ts, which reads ../company.ts. Like /gold, the page never prints a TODO: an unconfirmed fact is left
 * out and the open question is a `// TODO:` comment beside it, listed by `npm run todos`.
 */
import type { CustomLandingPage } from '../types.ts';
import { site } from '../site.ts';
import { purchaseFlow } from '../purchase-flow.ts';

export const goldV2: CustomLandingPage = {
  slug: 'gold-v2',
  meta: {
    title: `Gold appraisal at home in Dallas–Fort Worth & Houston | Free in-home appraisal | ${site.brand.name}`,
    description:
      'We come to your home in Dallas–Fort Worth and Houston to appraise gold jewelry, chains, rings and broken gold. Free appraisal, no obligation to sell.',
    ogImage: '/images/og-gold.jpg',
    ogImageAlt: 'An appraiser in white gloves looks at gold jewelry with a loupe at a customer’s dining table. Illustrative image.',
  },
  form: {
    submitLabel: 'Send my request',
    afterSubmit:
      // TODO: number of business days until we get back to a request. State it here once the business confirms it; until then no time is promised.
      "We'll call or email to arrange a time. Nothing is sold unless you say so.",
    success: "Thank you. We've received your request and will be in touch to arrange a time.",
  },
};

/**
 * Page copy that follows the company-wide sales flow: the visit is an appraisal only, the appraised amount is told at the
 * visit, and if the customer decides to sell, we collect the items the next day or the customer sends them to us (see
 * ../purchase-flow.ts).
 *
 * Left out of the page until the business confirms them (each would be a promise or a claim we cannot back yet):
 * TODO: how soon after the request we visit ("We visit within N days").
 * TODO: the full list of items we buy (the Figma cards name chains, rings, earrings, broken pieces, watches and sterling silver).
 * TODO: the insurance wording ("Insured ...").
 * TODO: the photographs: they come from Figma as exports; until then the photo slots are empty (docs/design/gold-v2/DESIGN_SYSTEM.md).
 */
export const goldV2Copy = {
  step4: `Nothing is bought at the visit. ${purchaseFlow.afterYes}`,
  payment: purchaseFlow.full,
};
