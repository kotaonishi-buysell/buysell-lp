/*
 * Downsizing LP: people aged 50–70 moving somewhere smaller.
 * Copy follows the build specification, adapted to US English.
 * Section order on the page is the order of `sections` below.
 */
import type { LandingPage } from '../types';
import { site } from '../site';

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
          a: '{{TODO: payment method and timing.}}',
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
    name: { label: 'Your name' },
    contact: {
      legend: 'How should we reach you?',
      hint: 'A phone number, an email address, or both.',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
    },
    zip: {
      label: 'ZIP code',
      hint: 'So we can check that we visit your area.',
      inArea: 'Good news. We visit homes in your area.',
      outOfArea: "We may not visit this ZIP code yet. Call us and we'll check.",
      notConfigured: '{{TODO: service-area ZIP list}}',
    },
    items: {
      legend: 'What would you like us to look at?',
      options: [
        'Furniture and antiques',
        'Tableware and decorative items',
        'Jewelry and watches',
        'Bags and clothing',
        'Art and collectibles',
        'Other',
        'Not sure yet',
      ],
      draftNote: '{{TODO: align with accepted items.}}',
    },
    amount: {
      label: 'Roughly how many items?',
      prompt: 'Choose one',
      options: ['A few', 'A shelf or cabinet', 'A room or more', 'Not sure'],
    },
    timing: {
      label: 'When are you moving?',
      prompt: 'Choose one',
      options: ['Within a month', 'In 1–3 months', 'In 3–6 months', 'Not decided yet'],
    },
    notes: {
      label: 'Anything else we should know?',
      placeholder: "For example: your moving date, or family members who'd like to be there.",
    },
    privacy: {
      before: 'I have read and agree to the ',
      linkText: 'privacy policy',
      after: '.',
    },
    tcpa: {
      label: '{{TODO: consent to calls and text messages about this request. Wording to be confirmed by counsel (TCPA).}}',
    },
    optionalMark: '(optional)',
    submitLabel: 'Send my request',
    sendingLabel: 'Sending your request…',
    afterSubmit:
      "We'll call or email within {{TODO: number of}} business days to arrange a time. Nothing is sold unless you say so.",
    success: "Thank you. We've received your request and will be in touch to arrange a time.",
    failure: "Sorry, we couldn't send your request. Please try again, or call us at {phone}.",
    errors: {
      summaryOne: 'Please check 1 answer before sending.',
      summaryMany: 'Please check {count} answers before sending.',
      name: 'Please enter your name.',
      contactMissing: 'Please enter a phone number or an email address.',
      phoneInvalid: 'Please enter a 10-digit phone number, like (512) 555-0123.',
      emailInvalid: 'Please enter an email address, like name@example.com.',
      zipMissing: 'Please enter your ZIP code.',
      zipInvalid: 'Please enter a 5-digit ZIP code.',
      privacy: "Please confirm you've read the privacy policy.",
    },
  },
};
