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
import { paymentNote } from '../payment-note.ts';

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

export interface AppraisalCategory {
  id: string;
  /** Visible label. <br> is allowed. */
  label: string;
  /** Accessible description of the icon (and, later, of the photo that replaces it). */
  alt: string;
  /** Inner markup of a 48x48 stroke icon. Shown in the category circle until the photographs exist. */
  icon: string;
}

/**
 * The ribbon, main categories first (accessories, designer goods, watches), then the rest.
 * TODO: confirm the exact wording and scope of each category with the business. In particular: "accessories" is
 * read as gold and platinum accessories (the main category); silver pieces belong to the Silver LP and gold bullion
 * to the Gold LP, and here they appear only as "silverware" and "gold coins".
 * TODO: confirm what is not accepted (counterfeits, damaged items, firearms, ...) and put it in the FAQ.
 * TODO: replace each icon with a generated photograph (public/images/appraisal/): see docs/design/appraisal/DESIGN_SYSTEM.md.
 */
export const appraisalCategories: AppraisalCategory[] = [
  {
    id: 'accessories',
    label: 'Gold &amp; platinum<br>accessories',
    alt: 'A gold chain necklace with a pendant',
    icon: '<path d="M9 8c0 15 6 24 15 24s15-9 15-24"/><circle cx="24" cy="38" r="4.5"/>',
  },
  {
    id: 'designer-goods',
    label: 'Designer<br>handbags &amp; goods',
    alt: 'A leather handbag',
    icon: '<path d="M10 18h28l3 22H7l3-22Z"/><path d="M17 18v-4a7 7 0 0 1 14 0v4M17 25v1M31 25v1"/>',
  },
  {
    id: 'watches',
    label: 'Watches',
    alt: 'A wristwatch',
    icon: '<circle cx="24" cy="24" r="10"/><path d="M24 18v6l4 3M19 14l1.5-7h7L29 14M19 34l1.5 7h7L29 34"/>',
  },
  {
    id: 'jewelry',
    label: 'Fine jewelry',
    alt: 'A cut gemstone',
    icon: '<path d="M17 10h14l6 8-13 20L11 18l6-8Z"/><path d="M11 18h26M20 10l4 8 4-8M24 18v20"/>',
  },
  {
    id: 'antiques',
    label: 'Antiques',
    alt: 'An antique mantel clock',
    icon: '<path d="M10 41h28M13 41V24a11 11 0 0 1 22 0v17"/><circle cx="24" cy="24" r="6"/><path d="M24 21v3l2 1.5"/>',
  },
  {
    id: 'cameras',
    label: 'Cameras',
    alt: 'A camera',
    icon: '<path d="M7 16h8l3-5h12l3 5h8v22H7V16Z"/><circle cx="24" cy="26" r="7"/><path d="M36 21h1"/>',
  },
  {
    id: 'gold-coins',
    label: 'Gold coins',
    alt: 'A stack of coins',
    icon: '<ellipse cx="22" cy="14" rx="12" ry="5"/><path d="M10 14v7c0 2.8 5.4 5 12 5s12-2.2 12-5v-7M10 21v7c0 2.8 5.4 5 12 5s12-2.2 12-5v-7"/><circle cx="35" cy="34" r="8"/><path d="M35 30v8M32.5 32.5c0-1.4 1-2 2.5-2s2.5.6 2.5 2-1 2-2.5 2-2.5.6-2.5 2 1 2 2.5 2 2.5-.6 2.5-2"/>',
  },
  {
    id: 'silverware',
    label: 'Silverware',
    alt: 'A fork and a spoon',
    icon: '<path d="M12 6v8a4 4 0 0 0 8 0V6M16 6v8M16 18v24"/><ellipse cx="32" cy="13" rx="5" ry="8"/><path d="M32 21v21"/>',
  },
];

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
    a: "We appraise gold and platinum accessories, designer handbags and goods, watches, fine jewelry, antiques, cameras, gold coins and silverware. Not sure whether something qualifies? Show us anyway. We'll tell you what we can appraise.",
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
    a: "Please have a valid government-issued photo ID, such as a driver license or state ID card, ready at your appointment. Texas law requires us to record details from it, and to keep a record of each purchase that includes photographs of the items we buy. We'll tell you what we need before your visit.",
  },
  {
    id: 'family',
    q: 'Can a family member be there during the visit?',
    a: 'Absolutely. A family member or someone you trust is always welcome to join you, ask questions, and help you decide.',
  },
];
