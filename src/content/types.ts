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

export interface FormContent {
  name: { label: string };
  contact: {
    legend: string;
    hint: string;
    phoneLabel: string;
    emailLabel: string;
  };
  zip: {
    label: string;
    hint: string;
    inArea: string;
    outOfArea: string;
    /** Shown while the service-area ZIP list is not configured. */
    notConfigured: string;
  };
  items: {
    legend: string;
    options: string[];
    /** Shown under the options while they are a draft. */
    draftNote?: string;
  };
  amount: SelectQuestion;
  timing: SelectQuestion;
  notes: { label: string; placeholder: string };
  privacy: { before: string; linkText: string; after: string };
  /** Consent to calls and texts (TCPA). Optional to tick. */
  tcpa: { label: string };
  /** Added after the label of optional questions. */
  optionalMark: string;
  submitLabel: string;
  sendingLabel: string;
  afterSubmit: string;
  success: string;
  failure: string;
  errors: {
    summaryOne: string;
    /** {count} is replaced with the number of fields to fix. */
    summaryMany: string;
    name: string;
    contactMissing: string;
    phoneInvalid: string;
    emailInvalid: string;
    zipMissing: string;
    zipInvalid: string;
    privacy: string;
  };
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
  form: FormContent;
}

export interface SiteContent {
  company: {
    name: string;
    address: string;
    registration: { label: string; value: string };
    hours: string;
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
    /** ZIP code prefixes we visit, e.g. "770" for Houston. Empty = not configured yet. */
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
