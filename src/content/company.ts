/*
 * The one place for company facts every LP shows: names, phone, hours, address and
 * the Texas OCCC registration. Fill the values here and every LP picks them up
 * (src/content/site.ts for Downsizing and Silver, src/content/lps/home-value/config.ts
 * for Home Value). Do not type these facts into an LP's own content or page.
 *
 * null = not confirmed. Downsizing and Silver then show their {{TODO: ...}} placeholders;
 * Home Value shows nothing or its explicit preview state, and never a dummy value.
 */
export interface CompanyFacts {
  /** Public brand name, as customers know it (REWORTH). The company that operates it is legalName. */
  brand: string;
  /** The brand logo, the same on every LP. */
  logo: { src: string; srcLight: string; width: number; height: number };
  /** Registered name of the company that operates in Texas. */
  legalName: string | null;
  /** The parent group, as named in the "About the BuySell group" copy. */
  group: { name: string };
  /** One line, e.g. "123 Main St, Suite 4, Dallas, TX 75201". */
  address: string | null;
  /** The reception number. Every phone button and link uses it. */
  phone: { display: string; e164: string } | null;
  /** Hours the phone is answered, without the time zone, e.g. "9:00 a.m.–midnight". */
  hours: string | null;
  /** false = no LP prints hours (they are recorded above for later). true = show them everywhere. */
  showHours: boolean;
  /** Appended to the hours wherever they are shown. */
  timeZone: string;
  /** Texas Office of Consumer Credit Commissioner (OCCC). */
  occc: {
    /** Our OCCC registration number. */
    registrationNumber: string | null;
    /** The OCCC address, phone and the notice wording our registration requires. */
    regulatorNotice: string | null;
  };
}

export const company: CompanyFacts = {
  brand: 'REWORTH',
  // public/images/brand/. The light file is for dark backgrounds.
  logo: { src: '/images/brand/reworth-logo.png', srcLight: '/images/brand/reworth-logo-light.png', width: 800, height: 322 },
  legalName: 'BuySell America, Inc.',
  // TODO: confirm the official English group name. Home Value's requirements say "Co. Ltd."; the Silver mock-up said "Inc."
  group: { name: 'BuySell Technologies Co. Ltd.' },
  address: '5717 Legacy Drive, Suite 250, Plano, TX 75024',
  phone: { display: '(469) 668-2619', e164: '+14696682619' },
  // TODO: confirm which days the phone is answered, then set showHours to true to publish the hours
  hours: '9:00 a.m.–midnight',
  showHours: false,
  timeZone: 'Central Time',
  occc: {
    // TODO: OCCC registration number
    registrationNumber: null,
    // TODO: OCCC address, phone and the notice wording required for our registration
    regulatorNotice: null,
  },
};

/** A callable U.S. number: a 10-digit NANP E.164 value whose display form shows the same digits. */
export const isCallablePhone = (phone: CompanyFacts['phone']): phone is NonNullable<CompanyFacts['phone']> =>
  phone !== null &&
  phone.display.trim() !== '' &&
  /^\+1[2-9]\d{2}[2-9]\d{6}$/.test(phone.e164) &&
  phone.display.replace(/\D/g, '').replace(/^1/, '') === phone.e164.slice(2);
