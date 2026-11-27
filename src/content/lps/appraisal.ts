/*
 * Appraisal LP (/appraisal): house-call appraisals of everything a household has kept (accessories, designer
 * goods, watches, jewelry, antiques, cameras, gold coins, silverware). Like Silver it has its own page,
 * src/pages/appraisal.astro, and its own stylesheet. This file holds the meta, the copy of the shared contact
 * form, the FAQ (which analytics tracks) and the category list. Company facts (phone, hours, registration) come from
 * ../site.ts, which derives from ../company.ts.
 *
 * Open business questions are kept as comments that begin with the word TODO (listed by `npm run todos`); none reaches a visitor.
 */
import type { CustomLandingPage, FaqItem } from '../types.ts';
import { site } from '../site.ts';
import { purchaseFlow } from '../purchase-flow.ts';
import { appraisalItems, appraisalItemsText, type ItemCard } from '../items.ts';

export const appraisal: CustomLandingPage = {
  slug: 'appraisal',
  meta: {
    title: `Not using it? Not tossing it? Free in-home appraisals | ${site.brand.name}`,
    description:
      'Jewelry, watches, designer bags and more that have been sitting around the house? Just give us a call. Free, no-obligation appraisals by house call in Texas.',
    // TODO: Silver's share image (REWORTH logo between two appraisers) is reused; replace it with an Appraisal-specific
    // image (1200x630) when the category photos exist. SNS caches the image URL, so rename the file when replacing it.
    ogImage: '/images/og-silver-reworth.jpg',
    ogImageAlt: 'The REWORTH logo between two appraisers: one smiling in a suit, the other examining an item through a loupe.',
  },
  form: {
    submitLabel: 'Send my request',
    afterSubmit:
      "We'll call or email within 3 business days to arrange a time. Nothing is sold unless you say so.",
    success: "Thank you. We've received your request and will be in touch to arrange a time.",
  },
};

/**
 * The ribbon. The items (wording, icon, scope questions) are defined once, in ../items.ts, and shared with the other
 * LPs that list the same things; this name stays so the page and its tests keep one import.
 */
export const appraisalCategories: ItemCard[] = appraisalItems;

/** Shown in the page's FAQ. */
export const appraisalFaq: FaqItem[] = [
  {
    id: 'one-item',
    q: 'Do I need to have a lot of things for you to visit?',
    a: "No. We're happy to visit for a single item. You're also welcome to show us as much as you like in the same visit.",
  },
  {
    id: 'what-can-i-show',
    q: 'What can I show you?',
    a: `We appraise ${appraisalItemsText}. Not sure whether something qualifies? Show us anyway. We'll tell you what we can appraise.`,
  },
  {
    id: 'not-sure',
    q: "I don't know if any of it is worth anything. Should I still call?",
    a: "Yes. That's exactly what the call is for. Tell us roughly what you have, and we'll arrange a time to take a look. There is no fee and no obligation to sell.",
  },
  {
    id: 'condition',
    q: 'Does everything need to be in good condition?',
    a: "No. Show us pieces as they are, including worn, older or incomplete ones. We'll explain what we find.",
  },
  {
    id: 'clean',
    q: 'Should I clean or polish anything before the visit?',
    // TODO: confirm with the appraisers that "leave it as it is" is right for every category (Silver's FAQ says it for silver).
    a: 'No. Please leave things as they are. Cleaning and polishing can damage finishes and delicate details.',
  },
  {
    id: 'boxes-papers',
    q: 'Should I look for boxes, papers or receipts?',
    // TODO: confirm that original boxes and papers matter to the offer for watches and designer goods.
    a: "If you still have original boxes, papers or receipts, set them out with the item. It's fine if you don't.",
  },
  {
    id: 'free',
    q: 'Is the appraisal really free?',
    a: 'Yes. There is no appraisal fee, no fee for the visit and no obligation to sell.',
  },
  {
    id: 'decline',
    q: 'What happens if I decide not to sell?',
    a: 'You keep your items. There is no fee for declining, and the decision is entirely yours.',
  },
  {
    id: 'payment',
    q: 'If I decide to sell, what happens next?',
    a: purchaseFlow.full,
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
];
