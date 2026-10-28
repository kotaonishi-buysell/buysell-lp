export interface HomeValueConfig {
  brand: string;
  area: string;
  phone: { display: string; e164: string } | null;
  hours: string | null;
  localOperator: { name: string; address: string; contact: string } | null;
  privacyUrl: string | null;
  legalLinks: { label: string; href: string }[];
  productionOrigin: string | null;
  deliveryEndpoint: string | null;
  measurementEnabled: boolean;
  group: { name: string; purchaseCount: string; regions: string; approved: boolean };
}

// Client-confirmed facts from docs/requirements/home-value.en.md.
// Nulls are intentional: never fall back to the legacy page's dummy values.
export const homeValueConfig: HomeValueConfig = {
  brand: 'BuySell',
  area: 'Dallas–Fort Worth and surrounding areas',
  phone: null,
  hours: null,
  localOperator: null,
  // The shared legal pages (the same on every LP); the text is in src/content/legal.ts.
  privacyUrl: '/privacy',
  legalLinks: [
    { label: 'Terms of use', href: '/terms' },
    { label: 'Do not sell or share my personal information', href: '/do-not-sell' },
  ],
  productionOrigin: null,
  deliveryEndpoint: null,
  measurementEnabled: false,
  group: {
    name: 'BuySell Technologies Co. Ltd.',
    purchaseCount: '400,000',
    regions: 'Japan and the United States',
    approved: false,
  },
};

export const approvedPhone = (phone: HomeValueConfig['phone']): HomeValueConfig['phone'] =>
  phone && phone.display.trim() && /^\+1[2-9]\d{2}[2-9]\d{6}$/.test(phone.e164) ? phone : null;
