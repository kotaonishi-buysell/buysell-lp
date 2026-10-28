import { homeValueConfig as config } from './config';
import { paymentNote } from '../../payment-note';

export const homeValue = {
  slug: 'home-value',
  meta: {
    title: 'Free In-Home Appraisals in Dallas–Fort Worth | BuySell',
    description: 'Decluttering your home? BuySell assesses bags, watches, jewelry, tableware, and hobby items at home. Free appraisal and travel. One item is enough.',
  },
  contact: {
    call: 'Call BuySell',
    request: 'Request a Visit',
    phonePending: 'Phone number pending.',
    preference: 'Send a request and our team will contact you to arrange a visit.',
  },
  hero: {
    label: 'Free in-home appraisals in Dallas–Fort Worth',
    headline: "Before you clear it out, find out what it's worth.",
    body: 'Bags you no longer use. Tableware tucked away. Things from an old hobby. BuySell comes to your home to assess them together, so you can decide what to keep and what to sell.',
    reassurances: ['Free appraisal and travel.', 'One item is enough.', "Just curious about the value? That's welcome, too."],
    image: '/images/home-value/hero-sample.svg',
    imageAlt: 'Sample illustration of bags, a watch, jewelry, tableware and hobby belongings on shelves at home.',
  },
  empathy: {
    heading: 'Sound familiar?',
    items: ['You bought it years ago, but hardly use it now.', "It was a gift, and it's still tucked away.", "You used to collect it. Now you're ready to make some room."],
    closing: "You don't need to know what it's worth before you get in touch.",
  },
  categories: {
    heading: 'Different kinds of belongings. One visit.',
    items: [
      { name: 'Bags', image: 'bags', alt: 'Sample illustration of a handbag.' },
      { name: 'Watches', image: 'watches', alt: 'Sample illustration of a wristwatch.' },
      { name: 'Jewelry and accessories', image: 'jewelry', alt: 'Sample illustration of a necklace and earrings.' },
      { name: 'Tableware', image: 'tableware', alt: 'Sample illustration of a cup and plates.' },
      { name: 'Cameras', image: 'cameras', alt: 'Sample illustration of a camera.' },
      { name: 'Musical instruments', image: 'instruments', alt: 'Sample illustration of a guitar.' },
      { name: 'Coins and stamps', image: 'coins-stamps', alt: 'Sample illustration of coins and a postage stamp.' },
      { name: 'Art and antiques', image: 'art-antiques', alt: 'Sample illustration of framed art and a vase.' },
      { name: 'Other belongings you would like us to assess', image: 'other', alt: 'Sample illustration of a vase and a storage box.' },
    ],
    body: "Start with the items you have in mind. If something else comes to mind while we're there, you can show us that, too.",
    qualification: 'We can assess your items and explain whether we can make a purchase offer.',
  },
  decision: {
    heading: 'Know the value. Then decide.',
    body: 'Hear the appraisal and the offer before choosing what to do. Keep the things you want to keep, consider selling others, or simply learn more about what you have.',
    cards: [
      { title: 'Just curious is welcome.', body: 'You can request a visit without having decided to sell.' },
      { title: 'Choose item by item.', body: 'You do not have to sell everything together.' },
      { title: 'Hear what is possible.', body: 'We may explain that an item cannot be purchased. Appraisal and travel are free.' },
    ],
  },
  inquiries: {
    heading: "You don't have to have it all figured out.",
    label: 'Example inquiries',
    examples: [
      'I have an unused bag and some tableware. Can you look at both?',
      "I have a few things from an old hobby, but I don't know what they're worth.",
      "I'd like to start with one item and show you a few other things at home.",
    ],
    disclaimer: 'Illustrative inquiries, not customer reviews.',
    groupHeading: 'About the BuySell group',
    groupBody: `${config.group.name} is publicly listed in Japan. The group has completed ${config.group.purchaseCount} purchases across ${config.group.regions}.`,
    groupDraft: 'Client-supplied draft for this preview. Official entity wording, the local operator relationship, and the purchase-count source and reporting period require confirmation before public launch.',
  },
  process: {
    heading: 'How a home visit works',
    steps: [
      { title: 'Tell us what you have.', body: 'Call BuySell or send a visit request. Our team will contact you to arrange a time.' },
      { title: 'Show us your items at home.', body: 'We assess the items you want us to see. You can add other belongings during the visit.' },
      { title: 'Hear the offer and decide.', body: 'We explain the appraisal. You choose which items, if any, you would like to sell.' },
      { title: 'Receive your payment.', body: 'If a purchase is completed, we transfer the payment to your bank account by the end of the next day.', note: paymentNote },
    ],
    faqHeading: 'A few things you may be wondering.',
    faqs: [
      { q: 'Can I request a visit for just one item?', a: 'Yes. Visits are available for one item.' },
      { q: 'Can you assess different types of items in the same visit?', a: 'Yes. You can show us bags, watches, jewelry and accessories, tableware, cameras, musical instruments, coins and stamps, art and antiques, and other belongings.' },
      { q: 'Can I show you more items during the visit?', a: "Yes. If you think of something else while we're there, you can ask us to assess it." },
      { q: 'What if I only want to know the value?', a: "That's welcome. You do not need to decide to sell before requesting an appraisal." },
      { q: 'How much does the visit cost?', a: 'Appraisal and travel are free.' },
      { q: "What if I don't know what the item is?", a: 'Tell us what you can. You do not need to identify the item or estimate its value before contacting us.' },
      { q: 'Can I ask about an older item or one with signs of use?', a: 'Yes. Tell us about its condition so we can assess it and explain whether we can make a purchase offer.' },
      { q: 'When will I receive payment?', a: 'After a completed purchase, we transfer the funds to your bank account by the end of the next day.', note: paymentNote },
      { q: 'Where do you visit?', a: `We serve ${config.area}. Contact us to confirm your location.` },
      { q: 'Is my appointment confirmed when I send a request?', a: 'No. Your request tells us how to reach you. Our team will contact you to arrange and confirm the appointment.' },
    ],
  },
  final: {
    heading: 'Make some room. Start by finding out what you have.',
    body: 'One item or several. Ready to sell or just curious. Talk to BuySell about a free in-home appraisal in Dallas–Fort Worth.',
    clarification: 'Submitting a request does not confirm an appointment. Our team will confirm the date and time with you.',
  },
  form: {
    heading: 'Request a Visit',
    intro: "Tell us how to reach you and what you'd like us to assess.",
    submit: 'Send Visit Request',
    success: 'Your visit request has been received. Our team will contact you to arrange the visit. Your appointment is not confirmed yet.',
  },
};
