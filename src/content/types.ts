/*
 * Content model for the Home Appraisal LPs.
 *
 * Copy may contain {{TODO: ...}} markers for business facts that are not
 * confirmed yet. They render as visible placeholders (see src/lib/text.ts)
 * and are listed by `npm run todos`.
 */

/** Scene tint of an LP. Downsizing = move, Declutter = sort, Parents' belongings = memory, Brand goods = brand. */
export type SceneId = 'move' | 'sort' | 'memory' | 'brand';

/** Background band of a section on the paper ground. */
export type Band = 'paper' | 'sunk';

/** Where a call-to-action sits, reported with every cta_click event. */
export type CtaLocation = 'header' | 'hero' | 'mid' | 'final' | 'sticky' | 'company';

export interface Link {
  label: string;
  href: string;
}

export interface SectionHeaderContent {
  eyebrow: string;
  headline: string;
  lead?: string;
}

export interface ImageContent {
  src: string;
  width: number;
  height: number;
}

export interface ChoiceCard {
  mark: string;
  title: string;
  body: string;
}

export interface Category {
  name: string;
  examples: string;
}

export interface ProcessStep {
  title: string;
  body: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  /** Small print under the answer. */
  note?: string;
}

export interface SelectQuestion {
  label: string;
  /** Text of the empty first option. */
  prompt: string;
  options: string[];
}

export interface HeroSection {
  type: 'hero';
  id: string;
  eyebrow: string;
  headline: string;
  lead: string;
  reassurance: string;
  /** null until photography arrives: a neutral placeholder block is shown. */
  image: ImageContent | null;
  imageAlt: string;
  /** Visible note on the placeholder block while image is null. */
  imagePlaceholder: string;
}

export interface EmpathySection {
  type: 'empathy';
  id: string;
  band: Band;
  header: SectionHeaderContent;
  items: string[];
}

export interface ChoicesSection {
  type: 'choices';
  id: string;
  band: Band;
  header: SectionHeaderContent;
  cards: [ChoiceCard, ChoiceCard, ChoiceCard];
}

export interface CategoriesSection {
  type: 'categories';
  id: string;
  band: Band;
  header: SectionHeaderContent;
  /** Shown above the grid while the category list is a draft. */
  draftNote?: string;
  categories: Category[];
  notAcceptedTitle: string;
  notAccepted: string[];
  note?: string;
}

export interface QuoteSection {
  type: 'quote';
  id: string;
  text: string;
}

export interface ProcessSection {
  type: 'process';
  id: string;
  header: SectionHeaderContent;
  steps: [ProcessStep, ProcessStep, ProcessStep, ProcessStep];
}

export interface CtaRowSection {
  type: 'ctaRow';
  id: string;
  band: Band;
  /** Plain in-page link shown beside the phone button. */
  secondary: Link;
  reassurance: string;
}

export interface FaqSection {
  type: 'faq';
  id: string;
  band: Band;
  header: SectionHeaderContent;
  items: FaqItem[];
}

export interface FinalSection {
  type: 'final';
  id: string;
  headline: string;
  body: string;
  reassurance: string;
  /** Heading above the online request form. */
  formHeading: string;
}

export interface CompanySection {
  type: 'company';
  id: string;
  band: Band;
}

export type Section =
  | HeroSection
  | EmpathySection
  | ChoicesSection
  | CategoriesSection
  | QuoteSection
  | ProcessSection
  | CtaRowSection
  | FaqSection
  | FinalSection
  | CompanySection;

/** What an LP adds to the shared contact form (fields, validation and endpoint are shared). */
export interface LpFormCopy {
  submitLabel: string;
  /** Note under the submit button. May contain {{TODO: ...}} markers. */
  afterSubmit?: string;
  /** Thank-you text after a successful request. */
  success: string;
}

export interface LandingPage {
  slug: string;
  scene: SceneId;
  meta: {
    title: string;
    description: string;
    /** Path under public/, 1200×630. */
    ogImage: string;
  };
  cta: {
    /** First line of the phone button; the LP's own wording. */
    label: string;
    /** Secondary button that opens the online request form. */
    bookingLabel: string;
    /** Single-line label for the mobile sticky bar. {phone} is replaced. */
    stickyLabel: string;
  };
  sections: Section[];
  form: LpFormCopy;
}

/**
 * An LP with its own page and stylesheet (e.g. silver) instead of the shared
 * sections. It still takes its meta and the copy of the shared contact form from
 * content, so the form, validation and analytics stay shared. It is not listed in
 * landingPages: src/pages/<slug>.astro renders it.
 */
export interface CustomLandingPage {
  slug: string;
  meta: LandingPage['meta'] & { ogImageAlt: string };
  form: LpFormCopy;
}

export interface SiteContent {
  company: {
    name: string;
    address: string;
    registration: { label: string; value: string };
    /** null = hours are not published; render nothing. */
    hours: string | null;
  };
  phone: {
    /** As printed on the page. Call-tracking number swaps should target this exact string. */
    display: string;
    /** E.164, used in tel: links and structured data. */
    e164: string;
    /** Prefix inside phone buttons, e.g. "Call". */
    callPrefix: string;
    /** Line shown under every phone button. {hours} is replaced. */
    hoursLine: string;
  };
  serviceArea: {
    summary: string;
    places: string[];
    /** ZIP codes (or prefixes of them) we visit. A full 5-digit ZIP code is a prefix of itself. Empty = not configured yet. Used by the ZIP box. */
    zipPrefixes: string[];
    outsideNote: string;
  };
  regulator: {
    label: string;
    value: string;
  };
  links: {
    privacy: string;
    terms: string;
    doNotSell: string;
  };
  ui: {
    skipLink: string;
    /** Screen-reader note on links that open a new tab. */
    newTab: string;
    headerBooking: string;
    companyHeading: string;
    companyLabels: {
      name: string;
      address: string;
      registration: string;
      hours: string;
      phone: string;
      serviceArea: string;
    };
    footer: {
      navLabel: string;
      privacy: string;
      terms: string;
      doNotSell: string;
      companyInfo: string;
      copyright: string;
    };
  };
  analytics: {
    /** Google Tag Manager container ID (GTM-XXXX). null = no GTM snippet; events still go to window.dataLayer. */
    gtmId: string | null;
  };
}
