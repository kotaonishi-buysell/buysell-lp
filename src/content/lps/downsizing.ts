/*
 * Downsizing LP: people aged 50–70 moving somewhere smaller.
 * Copy follows the build specification, adapted to US English.
 * Section order on the page is the order of the `sections` list.
 */
import type { FaqItem, LandingPage, Link } from '../types';
import { site } from '../site';
import { purchaseFlow } from '../purchase-flow';

type PageSection = LandingPage['sections'][number];

/**
 * Parts of this LP that wait for answers from the business (docs/requirements/downsizing-open-questions.md).
 * While a flag is false the part is left out of the page: it would show a TODO, or name items we have not
 * confirmed that we appraise. Set a flag to true once the content of that part is filled in.
 */
const confirmed = {
  /** Q2 and Q3: the categories we appraise (with examples) and what we cannot accept. */
  categories: false,
  /** Q4: how the items we collect are resold. */
  resale: false,
};

const bookingLabel = 'Request a visit online';

/** The link beside the phone button in the middle of the page: to the categories once they are shown, else to the form. */
const talkToUsLink: Link = confirmed.categories
  ? { label: 'See what we appraise', href: '#what-we-appraise' }
  : { label: bookingLabel, href: '#consult', booking: true };

const whatWeAppraise: PageSection = {
  type: 'categories',
  id: 'what-we-appraise',
  band: 'paper',
  header: {
    eyebrow: 'What we look at',
    headline: "Everything you're reviewing, in one visit.",
    lead: "Bring nothing to a shop. Show us whatever you're unsure about.",
  },
  draftNote: '{{TODO: confirm the categories we accept, with examples. The names below are a draft taken from the form.}}',
  categories: [
    { name: 'Furniture and antiques', examples: '{{TODO: examples}}' },
    { name: 'Tableware and decorative items', examples: '{{TODO: examples}}' },
    { name: 'Jewelry and watches', examples: '{{TODO: examples}}' },
    { name: 'Bags and clothing', examples: '{{TODO: examples}}' },
    { name: 'Art and collectibles', examples: '{{TODO: examples}}' },
  ],
  notAcceptedTitle: "We can't accept",
  notAccepted: ["{{TODO: items we can't accept}}"],
  note: "If you're unsure whether we can take something, ask anyway.",
};

const resaleFaq: FaqItem = {
  id: 'resale',
  q: 'What happens to the things I sell?',
  a: '{{TODO: one or two sentences on how items are resold to their next owners.}}',
};

/** Section order on the page is the order of this list. */
const sections: PageSection[] = [
  {
    type: 'hero',
    id: 'top',
    eyebrow: 'For your move',
    headline: 'On to your next chapter.',
    lead: 'Choose what comes with you, one thing at a time. We appraise at home, so nothing needs carrying.',
    reassurance: 'Appraisal only is fine. You decide afterward.',
    image: null,
    imageAlt: 'Belongings being sorted before a move, in morning light.',
    // TODO: hero photo (a bright, half-packed room; a few boxes and a well-loved object on a table), then set `image`.
    // Until there is one, the hero is text only: an empty imagePlaceholder shows nothing.
    imagePlaceholder: '',
  },
  {
    type: 'empathy',
    id: 'sound-familiar',
    band: 'paper',
    header: {
      eyebrow: 'Sound familiar?',
      headline: 'A home fills up over the years.',
    },
    items: [
      "The children's rooms are quiet now.",
      "There's more here than the next home can hold.",
      "Some things might be valuable, but you're not sure which.",
      'Deciding feels easier with someone to talk it through.',
    ],
  },
  {
    type: 'choices',
    id: 'why-an-appraisal',
    band: 'sunk',
    header: {
      eyebrow: 'Why an appraisal',
      headline: 'Know the value, then choose.',
      lead: "An appraisal isn't a commitment to sell. It's information to help you decide.",
    },
    cards: [
      {
        mark: 'Bring',
        title: 'Take it with you',
        body: 'Now that you know its value, it may mean even more in your new home.',
      },
      {
        mark: 'Pass on',
        title: 'Let it go to someone new',
        body: 'Sell only the pieces you choose. We find each a next owner.',
      },
      {
        mark: 'Not yet',
        title: 'Decide later',
        body: 'Keep your options open until your plans are settled.',
      },
    ],
  },
  ...(confirmed.categories ? [whatWeAppraise] : []),
  {
    type: 'quote',
    id: 'letting-go',
    text: 'Letting go is easier when you know what something is worth.',
  },
  {
    type: 'process',
    id: 'how-it-works',
    header: {
      eyebrow: 'How it works',
      headline: 'We come to you. You decide.',
    },
    steps: [
      { title: 'Get in touch', body: 'Tell us roughly what you have. No need to sort anything first.' },
      { title: 'We visit', body: 'An appraiser comes to your home at a time that works for you.' },
      { title: 'We explain', body: 'Each price comes with the reasons behind it.' },
      { title: 'You decide', body: 'Sell some, all or none. No pressure either way.' },
    ],
  },
  {
    type: 'ctaRow',
    id: 'talk-to-us',
    band: 'paper',
    secondary: talkToUsLink,
    reassurance: 'Appraisal only is fine.',
  },
  {
    type: 'faq',
    id: 'questions',
    band: 'sunk',
    header: {
      eyebrow: 'Questions',
      headline: 'Before you get in touch.',
    },
    items: [
      {
        id: 'move-date',
        q: "I haven't set a moving date yet. Is it too early?",
        a: 'Not at all. Knowing values early makes it easier to plan what comes with you.',
      },
      {
        id: 'appraisal-only',
        q: 'Can I just get an appraisal without selling?',
        a: 'Yes. Many people start that way. You hear each price and the reasons, then decide later, or not at all.',
      },
      {
        id: 'many-items',
        q: 'There are a lot of items. Is that a problem?',
        a: "No. Tell us roughly how much there is and we'll plan the visit time to match.",
      },
      {
        id: 'some-only',
        q: 'Can I sell just a few things?',
        a: 'Yes. You choose item by item.',
      },
      {
        id: 'fee',
        q: 'Is there a charge for the visit or the appraisal?',
        a: 'No. The visit and the appraisal are free, and you are never obliged to sell.',
      },
      {
        id: 'area',
        q: 'Which areas do you cover?',
        a: `We visit homes in the ${site.serviceArea.places.join(' and ')} metropolitan areas. Send us your ZIP code, or call us, and we'll tell you if we come to your area.`,
      },
      {
        id: 'payment',
        q: 'If I decide to sell, what happens next?',
        a: purchaseFlow.full,
      },
      ...(confirmed.resale ? [resaleFaq] : []),
    ],
  },
  {
    type: 'final',
    id: 'get-started',
    headline: 'Ready to start sorting?',
    body: "Tell us a little about your move. We'll arrange a visit at a time that works for you.",
    reassurance: 'Appraisal only is fine. You decide afterward.',
    formHeading: 'Or send us a request online',
  },
  {
    type: 'company',
    id: 'company',
    band: 'paper',
  },
];

export const downsizing: LandingPage = {
  slug: 'downsizing',
  scene: 'move',
  meta: {
    title: `Home appraisal for your move | ${site.brand.name}`,
    description:
      'Moving somewhere smaller? We appraise your belongings at home, so you can choose what comes with you and what to pass on.',
    // TODO: a share image for this page (1200×630: the hero photo, cropped). No image is shared until there is one.
    ogImage: '',
  },
  cta: {
    label: 'Talk to us about your move',
    bookingLabel,
    stickyLabel: 'Call {phone}',
  },
  sections,
  form: {
    submitLabel: 'Send my request',
    afterSubmit:
      // TODO: number of business days until we get back to a request (Silver and Appraisal say 3). Until the business
      // confirms it for this LP, no time is promised.
      "We'll call or email to arrange a time. Nothing is sold unless you say so.",
    success: "Thank you. We've received your request and will be in touch to arrange a time.",
  },
};
