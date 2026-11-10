/*
 * The one place for company facts every LP shows: names, phone, hours, address and
 * the Texas OCCC registration. Fill the values here and every LP picks them up
 * (src/content/site.ts for Downsizing and Silver, src/content/lps/home-value/config.ts
 * for Home Value). Do not type these facts into an LP's own content or page.
 *
 * null = not confirmed. Downsizing and Silver then show a {{TODO: ...}} placeholder for the
 * address, email and phone (draft pages only: `npm run check:public` fails a build that
 * prints one on a published page). If the OCCC registration number or notice is null, it is
 * simply left out of every page, so no page claims a registration we do not hold.
 * Home Value shows nothing or its explicit preview state, and never a dummy value.
 */
export interface CompanyFacts {
  /** Public brand name, as customers know it (REWORTH). The company that operates it is legalName. */
  brand: string;
  /** The brand logo, the same on every LP. */
  logo: { src: string; srcLight: string; width: number; height: number };
  /** The favicon (RW monogram), the same on every page. */
  icon: { svg: string; png: string; apple: string };
  /** Registered name of the company that operates in Texas. */
  legalName: string | null;
  /** The parent group, as named in the "About the BuySell group" copy. */
  group: { name: string };
  /** The primary contact email. It is also where privacy requests go (shown on the legal pages). */
  email: string | null;
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
  icon: {
    svg: '/images/brand/reworth-monogram-icon.svg',
    png: '/images/brand/reworth-icon-32.png',
    apple: '/images/brand/reworth-apple-touch-icon.png',
  },
  legalName: 'BuySell America, Inc.',
  // The parent group's official English name (Tokyo Stock Exchange Growth Market, code 7685).
  group: { name: 'BuySell Technologies Co., Ltd.' },
  email: 'info@buysell-america.com',
  address: '5717 Legacy Drive, Suite 250, Plano, TX 75024',
  phone: { display: '(877) 745-7677', e164: '+18777457677' },
  // TODO: confirm which days the phone is answered, then set showHours to true to publish the hours
  hours: '9:00 a.m.–midnight',
  showHours: false,
  timeZone: 'Central Time',
  occc: {
    // Our registration number, as issued by the OCCC (supplied 2026-11-04). It turns on, everywhere: the registration
    // lines (header, footer, company info, Privacy), the "Registered with the Texas OCCC" band on Silver and the
    // structured-data identifier. Set it back to null if the registration lapses, and every one of them disappears.
    registrationNumber: '2600083284-237004',
    // The OCCC's contact details (supplied 2026-11-04). Printed as one line under the OCCC's name.
    // TODO: confirm with counsel whether our registration requires specific notice wording on the site (for example a
    // complaint notice). Only the contact details are shown until then; add any required wording to this string.
    regulatorNotice: '2601 N Lamar Blvd, Austin, TX 78705 · (512) 936-7600 · www.occc.texas.gov',
  },
};

/** A callable U.S. number: a 10-digit NANP E.164 value whose display form shows the same digits. */
export const isCallablePhone = (phone: CompanyFacts['phone']): phone is NonNullable<CompanyFacts['phone']> =>
  phone !== null &&
  phone.display.trim() !== '' &&
  /^\+1[2-9]\d{2}[2-9]\d{6}$/.test(phone.e164) &&
  phone.display.replace(/\D/g, '').replace(/^1/, '') === phone.e164.slice(2);
