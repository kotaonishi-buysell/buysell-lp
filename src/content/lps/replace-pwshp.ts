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

export interface ReplacePwshpCategory {
  id: string;
  /** Visible label. <br> is allowed. */
  label: string;
  /** Accessible description of the icon. */
  alt: string;
  /** Inner markup of a 48x48 stroke icon. */
  icon: string;
}

/**
 * The cards of "Items we buy". Only categories that other published LPs already confirm (Appraisal: gold and platinum
 * accessories, designer handbags and goods, watches, fine jewelry, antiques, cameras, gold coins, silverware),
 * plus one catch-all card that promises nothing.
 * TODO: the spec (open question 2) also lists apparel, musical instruments, stamps, tableware other than silverware and
 * art. They are NOT shown until the business confirms that the Texas team buys them. When confirmed, add a card for each
 * here (apparel and "brand items beyond bags" also need new icons).
 * TODO: the spec's card "Brand items" is shown as "Designer handbags & goods", the wording Appraisal already uses;
 * "Coins and stamps" is shown as "Gold coins", and "Art and antiques" as "Antiques", for the same reason.
 */
export const replacePwshpCategories: ReplacePwshpCategory[] = [
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
    label: 'Jewelry &amp;<br>accessories',
    alt: 'A cut gemstone',
    icon: '<path d="M17 10h14l6 8-13 20L11 18l6-8Z"/><path d="M11 18h26M20 10l4 8 4-8M24 18v20"/>',
  },
  {
    id: 'cameras',
    label: 'Cameras',
    alt: 'A camera',
    icon: '<path d="M7 16h8l3-5h12l3 5h8v22H7V16Z"/><circle cx="24" cy="26" r="7"/><path d="M36 21h1"/>',
  },
  {
    id: 'antiques',
    label: 'Antiques',
    alt: 'An antique mantel clock',
    icon: '<path d="M10 41h28M13 41V24a11 11 0 0 1 22 0v17"/><circle cx="24" cy="24" r="6"/><path d="M24 21v3l2 1.5"/>',
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
  {
    id: 'other',
    label: 'Other belongings you would<br>like us to assess',
    alt: 'An open box with a few items inside',
    icon: '<path d="M7 20h34v20H7V20ZM7 20l5-8h24l5 8M19 20v6h10v-6"/>',
  },
];

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
