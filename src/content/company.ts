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
  /** Public brand name, as customers know it. */
  brand: string;
  /** Registered name of the company that operates in Texas. */
  legalName: string | null;
  /** The parent group, as named in the "About the BuySell group" copy. */
  group: { name: string };
  /** One line, e.g. "123 Main St, Suite 4, Dallas, TX 75201". */
  address: string | null;
  /** The reception number. Every phone button and link uses it. */
  phone: { display: string; e164: string } | null;
  /** Days and hours the phone is answered, without the time zone, e.g. "Mon–Fri, 9 a.m.–5 p.m.". */
  hours: string | null;
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
  brand: 'BuySell',
  // TODO: company name (the registered entity in Texas)
  legalName: null,
  // TODO: confirm the official English group name. Home Value's requirements say "Co. Ltd."; the Silver mock-up said "Inc."
  group: { name: 'BuySell Technologies Co. Ltd.' },
  // TODO: street address, city, TX ZIP
  address: null,
  // TODO: reception phone number. Both values from the same number, e.g. { display: '(214) 555-0123', e164: '+12145550123' }
  phone: null,
  // TODO: days and hours the phone is answered
  hours: null,
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
