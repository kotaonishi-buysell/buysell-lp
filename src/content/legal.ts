/*
 * The shared legal pages: Privacy Policy, Terms of Use, Do Not Sell or Share.
 * One text for every LP (the links are site.links.privacy, .terms and .doNotSell).
 *
 * Written from what the site and the form actually do (see docs/forms/contact-form.md), not from
 * a template. Business facts that are not confirmed are {{TODO: ...}} markers and show on the page.
 * The whole text needs a lawyer's review before launch; the draft notice below says so and is a
 * TODO marker too, so `npm run todos` lists it until it is removed.
 *
 * Tokens filled in by the page: {company} {brand} {address} {phone} {hoursSuffix} {email} {registration} {regulator}
 */

export type LegalBlock = string | { list: string[] } | { control: 'privacy-choice' };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalPageContent {
  slug: 'privacy' | 'terms' | 'do-not-sell';
  /** Page title, also the h1. */
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
}

export const legalDraftNotice =
  '{{TODO: Draft for legal review. Remove this notice when the text is approved.}}';

export const legalCopy = {
  effective: 'Effective date: {effective}',
  contents: 'On this page',
  back: 'Back to the top',
  navLabel: 'Legal pages',
  home: 'Home',
  /** The opt-out control on the Do Not Sell or Share page. */
  choice: {
    checking: 'Checking your browser…',
    gpc: 'Your browser is sending a Global Privacy Control signal, so these tools are already off for you.',
    on: 'These tools are on in this browser.',
    off: 'You have opted out. These tools are off in this browser.',
    optOut: 'Opt out in this browser',
    turnOn: 'Turn the tools back on',
    noStorage: 'These tools are on in this browser. Your browser does not let us save a choice, so to opt out, send a Global Privacy Control signal or contact us.',
    noScript: 'Turning this off needs JavaScript. To opt out without it, contact us using the details below.',
  },
};

const contact: LegalSection = {
  id: 'contact',
  heading: 'Contact us',
  blocks: [
    {
      list: [
        '{company}',
        '{address}',
        'Phone: {phone}{hoursSuffix}',
        'Email: {email}',
      ],
    },
  ],
};

export const privacyPolicy: LegalPageContent = {
  slug: 'privacy',
  title: 'Privacy Policy',
  description: 'What personal information {company} collects for {brand} when you ask about an in-home appraisal, how we use it, and your choices.',
  intro:
    '{company} ("we", "us") operates {brand}, which offers free in-home appraisals and buys items such as silver, jewelry and watches from people in Texas. This policy explains what personal information we collect on our websites, by phone and at your home, how we use and share it, and the choices you have.',
  sections: [
    {
      id: 'collect',
      heading: 'Information we collect',
      blocks: [
        'Information you give us when you ask for a visit or call us:',
        {
          list: [
            'Your first and last name, ZIP code and phone number (all required on our request form).',
            'Your email address, if you give it (optional).',
            'The message you write, if any (up to 1,000 characters).',
            'Whether you agreed to receive text messages, the time you agreed, and the exact wording you saw.',
          ],
        },
        'Information we must record if you sell us something. Texas law requires a dealer that buys crafted precious metal, such as silver, gold and jewelry, to register with the Texas Office of Consumer Credit Commissioner (OCCC) and to keep a transaction report for each purchase. That report can include:',
        {
          list: [
            'Your name, address, date of birth and physical description, and the number and a copy of your driver license or other government ID.',
            'A description and photographs of the items we buy.',
            'The date, the price and how you were paid, including the bank account details we need to send a transfer.',
          ],
        },
        'We collect this only at a visit and only for a purchase. We do not ask for it on our websites.',
        'Information collected automatically when you use our websites:',
        {
          list: [
            'The campaign details in the link you used to reach us (for example utm_source and utm_campaign), so we know which ad or message brought the request.',
            'How long the form was open before it was sent, and whether a hidden spam-trap field was filled in. We use both only to block automated spam.',
            'Basic technical data (IP address, browser and device type, pages requested) that our hosting provider logs to run and secure the site.',
          ],
        },
        'Some of our landing pages use Google Tag Manager to load three tools. They set cookies and similar technologies, and they receive data such as your IP address, browser and device, the page you came from, the pages you view, and the actions you take (for example, tapping a call or request button, opening a question, or starting or sending the form). They do not receive what you type into the form.',
        {
          list: [
            'Google Analytics (Google). Measures how many people visit and what they do. Cookies: _ga and _ga_*.',
            'Meta Pixel (Meta Platforms, Inc.). Measures our ads on Facebook and Instagram and lets Meta show our ads to people who visited our pages. Cookies: _fbp and _fbc. This is advertising use: see "Who we share it with".',
            'Microsoft Clarity (Microsoft). Records how people use the page (clicks, taps, scrolling, mouse movement) as session recordings and heatmaps, so we can improve the page. We mask what you type into our form. Cookies: _clck and _clsk.',
          ],
        },
        'You can turn these tools off for your browser at any time: see "Do not sell or share my personal information". This policy and our other legal pages do not load Google Tag Manager.',
      ],
    },
    {
      id: 'use',
      heading: 'How we use it',
      blocks: [
        {
          list: [
            'To answer your request, arrange a visit and tell you whether we can come to your ZIP code.',
            'To appraise and buy items, and to pay you.',
            'To keep the records the law requires and to answer lawful requests from police and regulators.',
            'To send text messages about your request, only if you agreed (see "Text messages").',
            'To block spam and fraud and to keep our websites secure.',
            'To understand which pages and campaigns lead to requests, and how people use our pages.',
            'To measure our advertising and to show our ads to people who visited our pages (through the Meta Pixel).',
          ],
        },
      ],
    },
    {
      id: 'sms',
      heading: 'Text messages',
      blocks: [
        'Texting is optional. The box on our form is unticked by default, and you can ask for a visit without ticking it. If you tick it, we may text you about your request. Message frequency varies. Message and data rates may apply. Reply STOP at any time to opt out, or HELP for help.',
        'We keep a record of when you agreed and the wording you saw. {{TODO: confirm that we do not share mobile numbers or text-message consent with third parties for their own marketing.}}',
        'More details are in our Terms of Use.',
      ],
    },
    {
      id: 'sharing',
      heading: 'Who we share it with',
      blocks: [
        'We do not sell your personal information for money. We do use the advertising and measurement tools described above, which send limited data (such as cookie IDs, your IP address, the pages you view and button taps) to Meta, Google and Microsoft. Under some state privacy laws, sending data to Meta for advertising can count as a "sale", as "sharing", or as "targeted advertising". You can opt out: see "Do not sell or share my personal information".',
        'We give information to others as follows:',
        {
          list: [
            'Service providers that work for us under contract: website hosting and form-processing providers, analytics and session-recording providers, and providers of email, text messaging and scheduling. {{TODO: confirm there is no other category of provider that receives personal information, for example a CRM tool.}}',
            'Advertising and social media platforms (for example Meta), through the advertising tool described above, for advertising and ad measurement. You can opt out: see "Do not sell or share my personal information".',
            'Other companies in the BuySell group, to help run the service. {{TODO: confirm whether and under what terms data goes to BuySell Technologies group companies.}}',
            'Police and regulators. We report each purchase to local law enforcement, as Texas law requires, and we give purchase records to the OCCC and others when the law requires it or a lawful request is made.',
            'A buyer or successor, if our business is sold or reorganized.',
          ],
        },
      ],
    },
    {
      id: 'retention',
      heading: 'How long we keep it',
      blocks: [
        'We keep requests that did not lead to a purchase for {{TODO: retention period for requests}}. Purchase records are kept for at least three years, which is the period the OCCC requires for transaction reports, and are then deleted when we no longer need them.',
      ],
    },
    {
      id: 'security',
      heading: 'Security',
      blocks: [
        'We use reasonable safeguards to protect your information, and we limit who can see it. No website or storage system is completely secure, so we cannot promise absolute security.',
      ],
    },
    {
      id: 'rights',
      heading: 'Your choices and Texas privacy rights',
      blocks: [
        // TODO: confirm with counsel whether the Texas Data Privacy and Security Act applies to us (docs/design/legal/RESEARCH.md). The rights are described either way.
        'Residents of Texas can ask us to:',
        {
          list: [
            'confirm whether we process your personal information, and give you access to it;',
            'correct inaccuracies;',
            'delete it. We cannot delete a purchase record that the law requires us to keep, and we will tell you if that is the case;',
            'give you a copy in a portable format;',
            'opt out of the sale of it, of targeted advertising and of profiling. We do not profile you in a way that has legal or similarly significant effects. You can opt out of the advertising tools yourself at any time on our "Do not sell or share my personal information" page.',
          ],
        },
        'To make a request, email {email} or call {phone}. We may need to confirm who you are before we act. We answer within 45 days, and we may extend that once by 45 more days when reasonably necessary, telling you why. There is no charge for a reasonable request.',
        'If we decline a request, you can appeal by replying to our answer or writing to the email above. We answer an appeal within 60 days. If you are not satisfied, you can contact the Texas Attorney General\'s office.',
        'To stop texts, reply STOP. To stop emails, use the link in the email or write to us.',
      ],
    },
    {
      id: 'children',
      heading: 'Children',
      blocks: [
        'Our services are for adults who are 18 or older. We do not knowingly collect personal information from anyone under 18. If you think someone under 18 has sent us information, contact us and we will delete it.',
      ],
    },
    {
      id: 'links',
      heading: 'Other websites',
      blocks: ['Our pages may link to other websites. We do not control them and are not responsible for their privacy practices.'],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      blocks: [
        'We may update this policy. The effective date at the top shows when it last changed. We will post significant changes on this page.',
      ],
    },
    contact,
    {
      id: 'regulator',
      heading: 'Our registration',
      blocks: ['{registration}', '{regulator}'],
    },
  ],
};

export const termsOfUse: LegalPageContent = {
  slug: 'terms',
  title: 'Terms of Use',
  description: 'The terms for using the {brand} websites, asking for a free appraisal and receiving text messages.',
  intro:
    'These terms apply when you use the {brand} websites operated by {company} ("we", "us") or ask us for an appraisal. By using our websites you agree to them. If you do not agree, please do not use the websites; you can still call us.',
  sections: [
    {
      id: 'site',
      heading: 'What our websites are for',
      blocks: [
        'Our websites give information about our in-home appraisal service and let you ask for a visit. You must be 18 or older to send a request. Sending a request does not book or confirm an appointment. Our team will contact you to arrange and confirm a time.',
        'We visit only the ZIP codes in our service area. The ZIP check on our pages is a guide; we confirm your address when we contact you.',
      ],
    },
    {
      id: 'appraisals',
      heading: 'Appraisals and purchases',
      blocks: [
        {
          list: [
            'The appraisal is free, and you are never obliged to sell. Decide after you hear the offer.',
            'An appraisal is not a promise that we will buy an item, and prices or ranges on our pages are illustrations, not offers. An offer is the amount we tell you at your home.',
            'We may decline an item, for example if we cannot confirm what it is or who owns it.',
            'You must be 18 or older, and you must own the item or have the right to sell it.',
            'If you agree to sell, Texas law requires us to record your ID details and to keep photographs and a description of what we buy. See our Privacy Policy.',
            'The sale itself is governed by the written purchase record you receive at the visit.',
          ],
        },
        'Payment: if you agree to sell, we pay you by bank transfer by the end of the next calendar day. When the funds arrive depends on your bank, and weekends and bank holidays can add time.',
      ],
    },
    {
      id: 'use',
      heading: 'Using the websites',
      blocks: [
        'Give us accurate information, and use the websites lawfully. Do not:',
        {
          list: [
            'send requests for someone else without their permission;',
            'use bots or scripts to fill in our forms, or try to disrupt or break into the websites;',
            'copy or reuse our content for commercial purposes without our written permission.',
          ],
        },
      ],
    },
    {
      id: 'texting',
      heading: 'Text message terms',
      blocks: [
        'If you tick the text-message box on our request form, you agree to receive text messages from {company} about your inquiry, such as scheduling and appointment messages. Consent is not a condition of asking for an appraisal or selling to us.',
        {
          list: [
            'Message frequency varies.',
            'Message and data rates may apply.',
            'Reply STOP to stop receiving messages. You may get one last message confirming that you have opted out.',
            'Reply HELP for help, or call {phone}.',
            'Mobile carriers are not liable for delayed or undelivered messages.',
          ],
        },
        'How we handle your number is described in our Privacy Policy.',
      ],
    },
    {
      id: 'ip',
      heading: 'Our content',
      blocks: [
        'The text, images, logos and design of our websites belong to us or our licensors. You may view them and print a copy for your own use, but you may not otherwise copy or reuse them without our written permission.',
      ],
    },
    {
      id: 'links',
      heading: 'Other websites',
      blocks: ['Links to other websites are for your convenience. We do not control them and are not responsible for them.'],
    },
    {
      id: 'disclaimer',
      heading: 'No warranty',
      blocks: [
        'Our websites and their content are provided "as is" and "as available". To the fullest extent the law allows, we do not promise that they will be error-free, always available or up to date. Nothing on the websites is legal, tax or financial advice.',
      ],
    },
    {
      id: 'liability',
      heading: 'Limit of liability',
      blocks: [
        'To the fullest extent the law allows, we are not liable for indirect, incidental or consequential damages from your use of the websites. This does not limit rights you have under the purchase record you receive at a visit, or any right that cannot be limited by law.',
      ],
    },
    {
      id: 'law',
      heading: 'Governing law',
      blocks: [
        'These terms are governed by the laws of the State of Texas, without regard to its conflict-of-law rules. {{TODO: confirm the venue (for example, the courts of Collin County, Texas) with counsel.}}',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes',
      blocks: ['We may change these terms. The effective date at the top shows when they last changed. Using the websites after a change means you accept it.'],
    },
    contact,
  ],
};

export const doNotSell: LegalPageContent = {
  slug: 'do-not-sell',
  title: 'Do Not Sell or Share My Personal Information',
  description: 'How {brand} uses advertising and measurement tools, and how to opt out of them.',
  intro:
    '{company} does not sell your personal information for money. Some of our pages use advertising and measurement tools that send limited information to Meta, Google and Microsoft. Under some state privacy laws that can count as a "sale", as "sharing" or as "targeted advertising". You can opt out here at any time.',
  sections: [
    {
      id: 'opt-out',
      heading: 'Opt out on this browser',
      blocks: [
        'When you opt out, we stop loading Google Tag Manager, and with it the Meta Pixel, Google Analytics and Microsoft Clarity, on our pages in this browser, and we remove the cookies those tools set on this site.',
        { control: 'privacy-choice' },
        'We also treat an opt-out preference signal, such as Global Privacy Control, as an opt-out. If your browser sends one, these tools are not loaded at all. The choice applies to this browser and device; if you use another browser or device, or clear your site data, choose again.',
      ],
    },
    {
      id: 'what',
      heading: 'What we use, and what it receives',
      blocks: [
        {
          list: [
            'Meta Pixel (Meta Platforms, Inc.): advertising. Measures our ads on Facebook and Instagram and lets Meta show our ads to people who visited our pages. This is the use that can count as a sale, sharing or targeted advertising. You can also control ads in your Facebook and Instagram settings.',
            'Google Analytics (Google): measures visits and what people do on the page.',
            'Microsoft Clarity (Microsoft): session recordings and heatmaps of clicks, taps and scrolling. We mask what you type into our form.',
          ],
        },
        'These tools receive data such as cookie IDs, your IP address, your browser and device, the page you came from, the pages you view and the actions you take (for example, tapping a call or request button, or starting or sending the form). They do not receive what you type into the form: not your name, phone number, email address or message.',
        'We do not share your contact details, your ID or purchase records, or your text-message consent record with advertisers.',
      ],
    },
    {
      id: 'providers',
      heading: 'Service providers',
      blocks: [
        'We also give information to service providers that work for us, such as the company that hosts our websites and stores your request. They may use it only to provide their service to us, and we do not consider this a sale or sharing. We give records to police and regulators when the law requires it. See our Privacy Policy.',
      ],
    },
    {
      id: 'ask',
      heading: 'Questions or requests',
      blocks: [
        'You can also ask to see, correct or delete your personal information, or ask us about this page. Email {email} or call {phone}. Your other rights are described in our Privacy Policy.',
      ],
    },
    contact,
  ],
};

export const legalPages = [privacyPolicy, termsOfUse, doNotSell];
