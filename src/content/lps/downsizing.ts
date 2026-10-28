/*
 * Downsizing LP: people aged 50–70 moving somewhere smaller.
 * Copy follows the build specification, adapted to US English.
 * Section order on the page is the order of `sections` below.
 */
import type { LandingPage } from '../types';
import { site } from '../site';
import { paymentNote } from '../payment-note';

export const downsizing: LandingPage = {
  slug: 'downsizing',
  scene: 'move',
  meta: {
    title: `Home appraisal for your move | ${site.company.name}`,
    description:
      'Moving somewhere smaller? We appraise your belongings at home, so you can choose what comes with you and what to pass on.',
    // TODO: replace the plain placeholder with the hero photo cropped to 1200×630.
    ogImage: '/images/og-downsizing.png',
  },
  cta: {
    label: 'Talk to us about your move',
    bookingLabel: 'Request a visit online',
    stickyLabel: 'Call {phone}',
  },
  sections: [
    {
      type: 'hero',
      id: 'top',
      eyebrow: 'For your move',
      headline: 'On to your next chapter.',
      lead: 'Choose what comes with you, one thing at a time. We appraise at home, so nothing needs carrying.',
      reassurance: 'Appraisal only is fine. You decide afterward.',
      image: null,
      imageAlt: 'Belongings being sorted before a move, in morning light.',
      imagePlaceholder:
        '{{TODO: hero photo. A bright, half-packed room; a few boxes and a well-loved object on a table.}}',
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
    {
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
    },
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
      secondary: { label: 'See what we appraise', href: '#what-we-appraise' },
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
          a: '{{TODO: confirm visit and appraisal fees.}}',
        },
        {
          id: 'area',
          q: 'Which areas do you cover?',
          a: '{{TODO: service area.}}',
        },
        {
          id: 'payment',
          q: 'If I decide to sell, how am I paid?',
          a: 'We tell you the amount at your home. If you agree to sell, we pay you by bank transfer by the end of the next day.',
          note: paymentNote,
        },
        {
          id: 'resale',
          q: 'What happens to the things I sell?',
          a: '{{TODO: one or two sentences on how items are resold to their next owners.}}',
        },
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
  ],
  form: {
    submitLabel: 'Send my request',
    afterSubmit:
      "We'll call or email within {{TODO: number of}} business days to arrange a time. Nothing is sold unless you say so.",
    success: "Thank you. We've received your request and will be in touch to arrange a time.",
  },
};
