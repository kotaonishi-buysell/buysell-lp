import { company as companyFacts, isCallablePhone, type CompanyFacts } from '../../company.ts';

export interface HomeValueConfig {
  brand: string;
  area: string;
  phone: { display: string; e164: string } | null;
  /** Primary contact email. */
  email: string | null;
  /** Hours with the time zone, e.g. "Mon–Fri, 9 a.m.–5 p.m. (Central Time)". null = do not show hours. */
  hours: string | null;
  localOperator: { name: string; address: string; contact: string | null } | null;
  privacyUrl: string | null;
  legalLinks: { label: string; href: string }[];
  productionOrigin: string | null;
  deliveryEndpoint: string | null;
  measurementEnabled: boolean;
  group: { name: string; purchaseCount: string; regions: string; approved: boolean };
}

export const approvedPhone = (phone: HomeValueConfig['phone']): HomeValueConfig['phone'] =>
  isCallablePhone(phone) ? phone : null;

// Company facts (brand, phone, hours, name, address, group) come from src/content/company.ts.
// Nulls are intentional: never fall back to the legacy page's dummy values.
// The rest is client-confirmed in docs/requirements/home-value.en.md.
export const buildHomeValueConfig = (facts: CompanyFacts): HomeValueConfig => ({
  brand: facts.brand,
  area: 'Dallas–Fort Worth and surrounding areas',
  phone: approvedPhone(facts.phone),
  email: facts.email,
  hours: facts.showHours && facts.hours?.trim() ? `${facts.hours.trim()} (${facts.timeZone})` : null,
  // Shown only once both the operating entity and its address are confirmed.
  localOperator:
    facts.legalName && facts.address
      ? { name: facts.legalName, address: facts.address, contact: approvedPhone(facts.phone)?.display ?? null }
      : null,
  // The shared legal pages (the same on every LP); the text is in src/content/legal.ts.
  privacyUrl: '/privacy',
  legalLinks: [
    { label: 'Terms of use', href: '/terms' },
    { label: 'Do not sell or share my personal information', href: '/do-not-sell' },
  ],
  productionOrigin: null,
  deliveryEndpoint: null,
  measurementEnabled: false,
  group: { name: facts.group.name, purchaseCount: '400,000', regions: 'Japan and the United States', approved: false },
});

export const homeValueConfig: HomeValueConfig = buildHomeValueConfig(companyFacts);
