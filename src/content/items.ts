/*
 * The item lists of the LPs, in one place. Every list of "what we appraise" that a data-driven LP shows (the category
 * ribbons of /appraisal and /replace-pwshp, the category cards of /home-value, and the sentences in their FAQs that
 * list the same items) is defined here and nowhere else. The LP content files import from this file.
 *
 * Three views, one source:
 *   - itemCatalog      the confirmed items, with the wording, the icon and the description of each
 *   - appraisalItems   Appraisal's ribbon (the primary list of the "mixed items" group: Appraisal, Replace-pwshp, Home Value)
 *   - replacePwshpItems  Replace-pwshp's cards: the same confirmed items (its own order and one label), plus a catch-all
 *   - homeValueItems   Home Value's nine cards (illustrations in public/images/home-value/)
 *
 * NOT here, on purpose: the pieces that belong to one metal (Silver's six silver categories and Gold's cards are
 * hand-written in src/pages/silver.astro and gold*.astro, and describe that LP's own offer), and Downsizing's categories
 * (hidden until the business answers; src/content/lps/downsizing.ts).
 *
 * TODO: the three lists are not the same set yet. Home Value's nine cards were approved by the client on 2026-10-08
 * (docs/requirements/home-value.en.md) and include musical instruments, coins and stamps, tableware, art and antiques;
 * Appraisal's eight items wait for the business to confirm their exact scope (see the TODOs below), and Replace-pwshp
 * shows only items another published LP already confirms. When the business confirms one list for all three, change it
 * here: the three pages follow.
 */

/** Joins names into a sentence: "a, b and c", or with the serial comma: "a, b, and c". */
export function joinNames(names: string[], serialComma = false): string {
  if (names.length < 2) return names.join('');
  const head = names.slice(0, -1).join(', ');
  return `${head}${serialComma ? ',' : ''} and ${names[names.length - 1]}`;
}

export interface CatalogItem {
  /** Name for running text (an FAQ answer), in lower case. */
  name: string;
  /** Visible label. <br> is allowed. */
  label: string;
  /** Accessible description of the icon (and, later, of the photo that replaces it). */
  alt: string;
  /** Inner markup of a 48x48 stroke icon. Shown in the category circle until the photographs exist. */
  icon: string;
}

export interface ItemCard extends CatalogItem {
  id: string;
}

/**
 * The confirmed items.
 * TODO: confirm the exact wording and scope of each item with the business. In particular: "accessories" is read as
 * gold and platinum accessories (the main category); silver pieces belong to the Silver LP and gold bullion to the
 * Gold LP, and here they appear only as "silverware" and "gold coins".
 * TODO: confirm what is not accepted (counterfeits, damaged items, firearms, ...) and put it in the FAQ.
 * TODO: replace each icon with a generated photograph (public/images/appraisal/): see docs/design/appraisal/DESIGN_SYSTEM.md.
 */
export const itemCatalog = {
  accessories: {
    name: 'gold and platinum accessories',
    label: 'Gold &amp; platinum<br>accessories',
    alt: 'A gold chain necklace with a pendant',
    icon: '<path d="M9 8c0 15 6 24 15 24s15-9 15-24"/><circle cx="24" cy="38" r="4.5"/>',
  },
  'designer-goods': {
    name: 'designer handbags and goods',
    label: 'Designer<br>handbags &amp; goods',
    alt: 'A leather handbag',
    icon: '<path d="M10 18h28l3 22H7l3-22Z"/><path d="M17 18v-4a7 7 0 0 1 14 0v4M17 25v1M31 25v1"/>',
  },
  watches: {
    name: 'watches',
    label: 'Watches',
    alt: 'A wristwatch',
    icon: '<circle cx="24" cy="24" r="10"/><path d="M24 18v6l4 3M19 14l1.5-7h7L29 14M19 34l1.5 7h7L29 34"/>',
  },
  jewelry: {
    name: 'fine jewelry',
    label: 'Fine jewelry',
    alt: 'A cut gemstone',
    icon: '<path d="M17 10h14l6 8-13 20L11 18l6-8Z"/><path d="M11 18h26M20 10l4 8 4-8M24 18v20"/>',
  },
  antiques: {
    name: 'antiques',
    label: 'Antiques',
    alt: 'An antique mantel clock',
    icon: '<path d="M10 41h28M13 41V24a11 11 0 0 1 22 0v17"/><circle cx="24" cy="24" r="6"/><path d="M24 21v3l2 1.5"/>',
  },
  cameras: {
    name: 'cameras',
    label: 'Cameras',
    alt: 'A camera',
    icon: '<path d="M7 16h8l3-5h12l3 5h8v22H7V16Z"/><circle cx="24" cy="26" r="7"/><path d="M36 21h1"/>',
  },
  'gold-coins': {
    name: 'gold coins',
    label: 'Gold coins',
    alt: 'A stack of coins',
    icon: '<ellipse cx="22" cy="14" rx="12" ry="5"/><path d="M10 14v7c0 2.8 5.4 5 12 5s12-2.2 12-5v-7M10 21v7c0 2.8 5.4 5 12 5s12-2.2 12-5v-7"/><circle cx="35" cy="34" r="8"/><path d="M35 30v8M32.5 32.5c0-1.4 1-2 2.5-2s2.5.6 2.5 2-1 2-2.5 2-2.5.6-2.5 2 1 2 2.5 2 2.5-.6 2.5-2"/>',
  },
  silverware: {
    name: 'silverware',
    label: 'Silverware',
    alt: 'A fork and a spoon',
    icon: '<path d="M12 6v8a4 4 0 0 0 8 0V6M16 6v8M16 18v24"/><ellipse cx="32" cy="13" rx="5" ry="8"/><path d="M32 21v21"/>',
  },
  /** A catch-all that promises nothing. Only Replace-pwshp shows it as a card. */
  other: {
    name: 'other belongings',
    label: 'Other belongings you would<br>like us to assess',
    alt: 'An open box with a few items inside',
    icon: '<path d="M7 20h34v20H7V20ZM7 20l5-8h24l5 8M19 20v6h10v-6"/>',
  },
} satisfies Record<string, CatalogItem>;

export type CatalogId = keyof typeof itemCatalog;

const card = (id: CatalogId, label?: string): ItemCard => ({ id, ...itemCatalog[id], ...(label ? { label } : {}) });

/** Appraisal's ribbon, main categories first (accessories, designer goods, watches), then the rest. */
export const appraisalItems: ItemCard[] = (
  ['accessories', 'designer-goods', 'watches', 'jewelry', 'antiques', 'cameras', 'gold-coins', 'silverware'] as const
).map((id) => card(id));

/** The sentence part of Appraisal's FAQ ("We appraise ..."). */
export const appraisalItemsText = joinNames(appraisalItems.map((item) => item.name));

/**
 * Replace-pwshp's cards: only items another published LP already confirms (the Appraisal list), plus the catch-all.
 * TODO: the spec (open question 2) also lists apparel, musical instruments, stamps, tableware other than silverware and
 * art. They are NOT shown until the business confirms that the Texas team buys them. When confirmed, add a card for each
 * (apparel and "brand items beyond bags" also need new icons).
 * TODO: the spec's card "Brand items" is shown as "Designer handbags & goods", the wording Appraisal already uses;
 * "Coins and stamps" is shown as "Gold coins", and "Art and antiques" as "Antiques", for the same reason.
 */
export const replacePwshpItems: ItemCard[] = [
  card('designer-goods'),
  card('watches'),
  card('jewelry', 'Jewelry &amp;<br>accessories'),
  card('cameras'),
  card('antiques'),
  card('gold-coins'),
  card('silverware'),
  card('other'),
];

export interface HomeValueItem {
  /** Visible name. */
  name: string;
  /** File stem in public/images/home-value/ (<image>-sample.svg). */
  image: string;
  alt: string;
  /** Name for running text (the FAQ answer). */
  plain: string;
}

/** Home Value's nine cards, as approved on 2026-10-08. See the TODO at the top of this file. */
export const homeValueItems: HomeValueItem[] = [
  { name: 'Bags', image: 'bags', alt: 'Illustration of a handbag.', plain: 'bags' },
  { name: 'Watches', image: 'watches', alt: 'Illustration of a wristwatch.', plain: 'watches' },
  { name: 'Jewelry and accessories', image: 'jewelry', alt: 'Illustration of a necklace and earrings.', plain: 'jewelry and accessories' },
  { name: 'Tableware', image: 'tableware', alt: 'Illustration of a cup and plates.', plain: 'tableware' },
  { name: 'Cameras', image: 'cameras', alt: 'Illustration of a camera.', plain: 'cameras' },
  { name: 'Musical instruments', image: 'instruments', alt: 'Illustration of a guitar.', plain: 'musical instruments' },
  { name: 'Coins and stamps', image: 'coins-stamps', alt: 'Illustration of coins and a postage stamp.', plain: 'coins and stamps' },
  { name: 'Art and antiques', image: 'art-antiques', alt: 'Illustration of framed art and a vase.', plain: 'art and antiques' },
  {
    name: 'Other belongings you would like us to assess',
    image: 'other',
    alt: 'Illustration of a vase and a storage box.',
    plain: 'other belongings',
  },
];

/** The sentence part of Home Value's FAQ ("You can show us ..."). */
export const homeValueItemsText = joinNames(homeValueItems.map((item) => item.plain), true);
