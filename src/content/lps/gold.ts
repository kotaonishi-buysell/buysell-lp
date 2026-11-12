/*
 * Gold LP (/gold): gold appraisals by house call. Like Silver it has its own page,
 * src/pages/gold.astro, and its own stylesheet (src/styles/gold.css), because its design differs from the
 * Home Appraisal design system. This file holds what is shared with the other LPs' machinery (meta and the
 * copy of the shared contact form) and page copy. /gold is a published page, so it never shows a TODO: an
 * unconfirmed fact is left out (or worded so that it promises nothing) and the open question is a `// TODO:`
 * comment beside it, listed by `npm run todos`. `npm run check:public` fails a build that prints one.
 * Company facts (phone, address, registration) come from ../site.ts, which reads ../company.ts.
 */
import type { CustomLandingPage } from '../types.ts';
import { site } from '../site.ts';
import { purchaseFlow } from '../purchase-flow.ts';

export const gold: CustomLandingPage = {
  slug: 'gold',
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
 * Page copy. The visit is an appraisal only: the appraised amount is told at the visit, and if the customer decides to
 * sell, we collect the items the next day or the customer sends them to us (the same on every LP, see ../purchase-flow.ts).
 *
 * Left out of the page until the business confirms them (each would be a promise or a claim we cannot back yet):
 * TODO: how soon after the request we visit ("We visit within N days").
 * TODO: the full list of items we buy.
 * TODO: that our appraisers show ID at the door (it was one of the "always true" promises; now four).
 * TODO: the insurance wording ("Insured ...").
 * TODO: a link to the Texas dealer registration look-up (shown next to the registration number once we have one).
 * TODO: U.S. counsel to review the comparison wording; the comparison is hidden until then (gold-comparison.ts).
 */
export const goldCopy = {
  visitTiming: 'We come to your home at the time we arranged.',
  step4: `Nothing is bought at the visit. ${purchaseFlow.afterYes}`,
  payment: purchaseFlow.full,
};
