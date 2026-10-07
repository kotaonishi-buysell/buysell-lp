/*
 * Company facts and interface copy shared by every LP.
 * Values marked {{TODO: ...}} are business facts the client confirms before launch.
 */
import type { SiteContent } from './types';

export const site: SiteContent = {
  company: {
    // TODO: company name (placeholder from the build spec)
    name: 'Company name',
    address: '{{TODO: street address, city, TX ZIP}}',
    registration: {
      label: 'Texas registration No.',
      value: '{{TODO: state registration number}}',
    },
    hours: '{{TODO: days and hours}}, Central Time',
  },
  phone: {
    // TODO: phone number. Placeholder in US format; replace both values together.
    display: '(800) 000-0000',
    e164: '+18000000000',
    callPrefix: 'Call',
    hoursLine: 'Calls answered {hours}.',
  },
  serviceArea: {
    summary: '{{TODO: service area}}',
    places: ['{{TODO: cities we visit}}'],
    // TODO: ZIP code prefixes of the service area, e.g. ['770', '773'] for parts of Houston.
    zipPrefixes: [],
    outsideNote: "Don't see your area? Call us and we'll check.",
  },
  regulator: {
    label: 'Texas Office of Consumer Credit Commissioner (OCCC)',
    value: '{{TODO: OCCC address, phone and the notice wording required for our registration}}',
  },
  links: {
    // TODO: confirm the URLs once the policy pages exist.
    privacy: '/privacy',
    terms: '/terms',
    doNotSell: '/do-not-sell',
  },
  ui: {
    skipLink: 'Skip to main content',
    newTab: '(opens in a new tab)',
    headerBooking: 'Book a consultation',
    companyHeading: 'Company information',
    companyLabels: {
      name: 'Company',
      address: 'Address',
      registration: 'Texas registration',
      hours: 'Hours',
      phone: 'Phone',
      serviceArea: 'Service area',
    },
    footer: {
      navLabel: 'Legal',
      privacy: 'Privacy policy',
      terms: 'Terms of use',
      doNotSell: 'Do not sell or share my personal information',
      companyInfo: 'Company information',
      copyright: '© {year} {company}',
    },
  },
  analytics: {
    // TODO: Google Tag Manager container ID, e.g. 'GTM-ABC1234'.
    gtmId: null,
  },
};
