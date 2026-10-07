import type { LandingPage } from '../../types';
import { downsizing } from '../downsizing';

// Reuse the shared form vocabulary; override all move-specific questions.
// Business facts and their TODO markers remain shared with the existing LP.
export const homeValue: LandingPage = {
  slug: 'home-value',
  scene: 'sort',
  meta: {
    title: 'Discover the value of things at home | BuySell America',
    description: 'Before you clear things out, ask about their value. Discuss different belongings at home, then choose what to keep or consider selling.',
    // TODO: replace this shared placeholder with home-value photography, 1200 × 630.
    ogImage: '/images/og-downsizing.png',
  },
  cta: {
    label: 'Ask about your items at home',
    bookingLabel: 'Request a visit online',
    stickyLabel: 'Call {phone}',
  },
  sections: [
    {
      type: 'hero', id: 'top', eyebrow: 'Discover what is already at home',
      headline: 'Before you clear it out, see what it might be worth.',
      lead: 'Things you bought years ago. Gifts you rarely use. A collection tucked away. Ask about them together, without carrying them to a shop.',
      reassurance: 'Hear the appraisal, then choose what to keep or consider selling.',
      image: null,
      imageAlt: 'A bag, watch, tableware and jewelry arranged in a bright everyday home.',
      imagePlaceholder: '{{TODO: licensed home-value hero photograph featuring several item categories in natural light.}}',
    },
    {
      type: 'empathy', id: 'sound-familiar', band: 'paper',
      header: { eyebrow: 'Sound familiar?', headline: 'Some things have been waiting for years.' },
      items: ['Something you bought but no longer use.', 'A gift that rarely leaves the cabinet.', 'A collection from a hobby you used to love.'],
    },
    {
      type: 'categories', id: 'what-we-appraise', band: 'paper',
      header: { eyebrow: 'What we can look at', headline: 'Start with what you already have at home.', lead: 'Not sure of the name or brand? Describe it when you contact us.' },
      draftNote: '{{TODO: confirm accepted categories and examples before publishing; the following list is a proposal.}}',
      categories: [
        { name: 'Bags', examples: 'A bag you rarely carry.' },
        { name: 'Watches', examples: 'A watch tucked in a drawer.' },
        { name: 'Jewelry', examples: 'Accessories you no longer wear.' },
        { name: 'Tableware', examples: 'Pieces kept in a cabinet.' },
        { name: 'Precious metals', examples: 'Items whose material you are unsure about.' },
        { name: 'Collectibles', examples: 'Pieces from an earlier hobby.' },
      ],
      notAcceptedTitle: 'What to check before a visit',
      notAccepted: ['{{TODO: confirm excluded items and visit conditions.}}'],
      note: 'This is an appraisal and resale service, not junk removal or a whole-home cleanout. Not every item can be purchased.',
    },
    {
      type: 'choices', id: 'appraise-first', band: 'sunk',
      header: { eyebrow: 'Appraise first, decide later', headline: 'Find out the value. You decide.', lead: 'You do not need to sell everything you show us.' },
      cards: [
        { mark: '01', title: 'We take a look', body: 'Show us the items you would like to ask about.' },
        { mark: '02', title: 'We explain the value', body: 'Hear the appraisal and any available offer.' },
        { mark: '03', title: 'You decide', body: 'Choose what stays and what you would like to sell.' },
      ],
    },
    {
      type: 'choices', id: 'consultation-examples', band: 'paper',
      header: { eyebrow: 'Illustrative consultation examples', headline: 'You can start with a simple question.', lead: 'These are example situations, not customer testimonials.' },
      cards: [
        { mark: 'Bags + tableware', title: 'Could you look at these together?', body: 'I have a bag and some tableware I no longer use.' },
        { mark: 'Gifts', title: 'I do not know what this is worth.', body: 'I received it years ago and would like to understand its value.' },
        { mark: 'Collections', title: 'Can I keep some of the pieces?', body: 'I am reviewing an old collection and want to choose item by item.' },
      ],
    },
    {
      type: 'process', id: 'how-it-works',
      header: { eyebrow: 'How it works', headline: 'A conversation, a visit, your choice.' },
      steps: [
        { title: 'Tell us what you have', body: 'Describe the items and roughly how many you want to discuss.' },
        { title: 'Arrange a visit', body: 'Confirm eligible items, your area and visit conditions with us.' },
        { title: 'Hear the appraisal', body: 'We explain the value and any available offer at your home.' },
        { title: 'You decide', body: 'Choose which eligible items, if any, you want to sell.' },
      ],
    },
    {
      type: 'faq', id: 'questions', band: 'sunk',
      header: { eyebrow: 'Questions', headline: 'It is okay to be unsure.' },
      items: [
        { id: 'unknown-value', q: 'What if I do not know the value or product name?', a: 'Start by describing what you have. We can discuss what information is needed before arranging a visit.' },
        { id: 'mixed-items', q: 'Can I ask about different types of items?', a: 'Describe the different items when you contact us so we can check their eligibility together.' },
        { id: 'some-only', q: 'Do I need to sell everything?', a: 'No. You choose which eligible items, if any, to sell after hearing the appraisal.' },
        { id: 'old-items', q: 'What if my items are old or their condition worries me?', a: 'Tell us about their age and condition. An appraisal does not guarantee an offer.' },
        { id: 'many-items', q: 'What if there are many items?', a: 'Tell us roughly how many you want to discuss so we can confirm the visit arrangements.' },
        { id: 'fee', q: 'Is there a fee for the visit or appraisal?', a: '{{TODO: confirm visit and appraisal fees.}}' },
        { id: 'area', q: 'Which areas do you serve?', a: '{{TODO: confirm service areas and visit conditions.}}' },
      ],
    },
    {
      type: 'final', id: 'get-started',
      headline: 'Before you clear it out, ask about its value.',
      body: 'Tell us what you have at home. Start with the pieces you are curious about.',
      reassurance: 'You choose what stays and what goes.',
      formHeading: 'Or send us a request online',
    },
    { type: 'company', id: 'company', band: 'paper' },
  ],
  form: {
    ...downsizing.form,
    items: {
      legend: 'What would you like us to look at?',
      options: ['Bags', 'Watches', 'Jewelry', 'Tableware', 'Precious metals', 'Collectibles', 'Not sure yet'],
      draftNote: '{{TODO: align these draft options with confirmed accepted items.}}',
    },
    timing: { label: 'When would you like to discuss your items?', prompt: 'Choose one', options: ['Soon', 'Within a month', 'In 1–3 months', 'Not decided yet'] },
    notes: { label: 'Anything else we should know?', placeholder: 'For example: the types of items, their condition, or a collection you would like to discuss.' },
  },
};
