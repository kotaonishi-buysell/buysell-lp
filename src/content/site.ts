/*
 * Interface copy and the facts shared by Downsizing and Silver (Home Value reads
 * the same company facts through its own config).
 * Company name, phone, hours, address and OCCC registration are not typed here: they
 * come from ./company.ts, the single source. While one is unconfirmed (null) this LP
 * family shows a {{TODO: ...}} placeholder for it.
 */
import { company as companyFacts, isCallablePhone, type CompanyFacts } from './company.ts';
import type { SiteContent } from './types.ts';
import { serviceAreaZips } from './service-area-zips.ts';

// Written as a concatenation so `npm run todos` lists the open item once, in company.ts.
const pending = (what: string): string => '{{' + `TODO: ${what}` + '}}';

// Shown only while company.phone is unconfirmed, so the layout and tel: links can be reviewed.
const placeholderPhone = { display: '(800) 000-0000', e164: '+18000000000' };

export const buildSite = (facts: CompanyFacts): SiteContent => ({
  brand: { name: facts.brand },
  company: {
    name: facts.legalName ?? 'Company name',
    address: facts.address ?? pending('street address, city, TX ZIP'),
    email: facts.email ?? pending('contact email'),
    registration: {
      label: 'Texas registration No.',
      value: facts.occc.registrationNumber ?? pending('state registration number'),
    },
    // null = hours are not published (company.showHours). Pages then leave the hours out.
    hours: facts.showHours ? `${facts.hours ?? pending('days and hours')}, ${facts.timeZone}` : null,
  },
  phone: {
    ...(isCallablePhone(facts.phone) ? facts.phone : placeholderPhone),
    callPrefix: 'Call',
    hoursLine: 'Calls answered {hours}.',
  },
  serviceArea: {
    summary: 'Dallas–Fort Worth and Houston metropolitan areas, Texas',
    places: ['Dallas–Fort Worth', 'Houston'],
    // Every ZIP code of the Dallas–Fort Worth and Houston metropolitan areas (generated, see service-area-zips.ts).
    zipPrefixes: serviceAreaZips,
    outsideNote: "Don't see your area? Call us and we'll check.",
  },
  regulator: {
    label: 'Texas Office of Consumer Credit Commissioner (OCCC)',
    value: facts.occc.regulatorNotice ?? pending('OCCC address, phone and the notice wording required for our registration'),
  },
  legal: {
    effectiveDate: 'October 29, 2026',
    // Privacy requests go to the primary contact email.
    privacyEmail: facts.email ?? pending('privacy contact email'),
  },
  links: {
    // The shared legal pages (src/pages/privacy.astro, terms.astro, do-not-sell.astro), the same on every LP.
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
      email: 'Email',
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
    // Google Tag Manager container. Loaded by layouts/Document.astro (/downsizing and /silver; /home-value has its own page).
    gtmId: 'GTM-PQQFZ723',
  },
});

export const site: SiteContent = buildSite(companyFacts);
