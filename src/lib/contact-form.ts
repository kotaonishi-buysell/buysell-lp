/*
 * Shared contact form: field rules, normalisation, request payload and delivery.
 * Pure functions only (no DOM), so every LP and the unit tests use the same code.
 */

export const NAME_MAX = 100;
export const EMAIL_MAX = 254;
export const MESSAGE_MAX = 1000;

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export type FieldName = 'firstName' | 'lastName' | 'zip' | 'phone' | 'email' | 'message';

/** Fields in page order. */
export const FIELD_ORDER: readonly FieldName[] = ['firstName', 'lastName', 'zip', 'phone', 'email', 'message'];

export type IssueCode = 'required' | 'invalid' | 'tooLong';

export interface FieldIssue {
  field: FieldName;
  code: IssueCode;
}

/** Raw values as typed. */
export interface ContactFormValues {
  firstName: string;
  lastName: string;
  zip: string;
  phone: string;
  email: string;
  message: string;
}

/** What the browser sends to the receiving endpoint. */
export interface ContactRequest {
  lp: string;
  firstName: string;
  lastName: string;
  zip: string;
  /** Ten digits, digits only. */
  phone: string;
  email: string;
  message: string;
  smsConsent: boolean;
  /** UTC time the box was ticked (browser clock). null when not consented. */
  smsConsentAt: string | null;
  /** The exact consent wording shown next to the box. null when not consented. */
  smsConsentText: string | null;
  /** UTC time of the submit (browser clock). */
  submittedAt: string;
  utm: Record<string, string>;
  /** Spam trap: a field people never see. Anything in it means a bot filled the form. */
  honeypot: string;
  /** Milliseconds from page load to submit. Bots submit almost instantly. */
  elapsedMs: number;
}

// ---------- normalisers ----------

/** Trims and collapses runs of whitespace. */
export const normalizeName = (value: string): string => value.trim().replace(/\s+/g, ' ');

/** Letters (any script), combining marks, spaces, hyphens, apostrophes and periods; must start with a letter. */
const NAME_PATTERN = /^[\p{L}][\p{L}\p{M}'’.\-\s]*$/u;

/**
 * Ten-digit US number from common formats, or null when it is not one.
 * Accepts "(555) 123-4567", "555-123-4567", "555.123.4567", "5551234567",
 * and a leading country code "1" or "+1".
 */
export function normalizePhone(value: string): string | null {
  const text = value.trim();
  if (!/^\+?[\d\s().\-]+$/.test(text)) return null;
  const digits = text.replace(/\D/g, '');
  if (text.startsWith('+')) return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : null;
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
  return digits.length === 10 ? digits : null;
}

/** "12345" or "12345-6789". Nine digits without the hyphen are accepted and normalised. */
export function normalizeZip(value: string): string | null {
  const match = /^(\d{5})(?:-?(\d{4}))?$/.exec(value.trim());
  if (!match) return null;
  return match[2] ? `${match[1]}-${match[2]}` : match[1];
}

export const normalizeMessage = (value: string): string => value.trim();

// ---------- validation ----------

const nameIssue = (field: 'firstName' | 'lastName', value: string): FieldIssue | null => {
  const name = normalizeName(value);
  if (!name) return { field, code: 'required' };
  if (name.length > NAME_MAX || !NAME_PATTERN.test(name)) return { field, code: 'invalid' };
  return null;
};

/** Every problem with the values, in page order. An empty list means valid. */
export function validate(values: ContactFormValues): FieldIssue[] {
  const issues: FieldIssue[] = [];
  const add = (issue: FieldIssue | null) => issue && issues.push(issue);

  add(nameIssue('firstName', values.firstName));
  add(nameIssue('lastName', values.lastName));

  if (!values.zip.trim()) add({ field: 'zip', code: 'required' });
  else if (!normalizeZip(values.zip)) add({ field: 'zip', code: 'invalid' });

  if (!values.phone.trim()) add({ field: 'phone', code: 'required' });
  else if (!normalizePhone(values.phone)) add({ field: 'phone', code: 'invalid' });

  const email = values.email.trim();
  if (email && (email.length > EMAIL_MAX || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    add({ field: 'email', code: 'invalid' });
  }

  if (normalizeMessage(values.message).length > MESSAGE_MAX) add({ field: 'message', code: 'tooLong' });

  return issues;
}

/** Characters left in the message box, for the live counter. Never below zero. */
export const messageRemaining = (value: string): number => Math.max(0, MESSAGE_MAX - value.length);

// ---------- request ----------

export interface RequestContext {
  lp: string;
  smsConsent: boolean;
  smsConsentAt: string | null;
  smsConsentText: string;
  utm?: Record<string, string>;
  honeypot?: string;
  elapsedMs?: number;
  now?: Date;
}

/** Builds the normalised request. Call only with values that passed validate(). */
export function buildRequest(values: ContactFormValues, context: RequestContext): ContactRequest {
  const consented = context.smsConsent;
  const now = context.now ?? new Date();
  return {
    lp: context.lp,
    firstName: normalizeName(values.firstName),
    lastName: normalizeName(values.lastName),
    zip: normalizeZip(values.zip) ?? values.zip.trim(),
    phone: normalizePhone(values.phone) ?? '',
    email: values.email.trim(),
    message: normalizeMessage(values.message),
    smsConsent: consented,
    smsConsentAt: consented ? (context.smsConsentAt ?? now.toISOString()) : null,
    smsConsentText: consented ? context.smsConsentText : null,
    submittedAt: now.toISOString(),
    utm: context.utm ?? {},
    honeypot: context.honeypot ?? '',
    elapsedMs: Math.max(0, Math.round(context.elapsedMs ?? 0)),
  };
}

/** Keeps only the allowed UTM parameters from a query string. */
export function readUtm(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) utm[key] = value.slice(0, 200);
  }
  return utm;
}

// ---------- delivery ----------

export type DeliveryCategory = 'network' | 'timeout' | 'rejected' | 'invalid_acknowledgement' | 'configuration';

export class DeliveryError extends Error {
  constructor(public category: DeliveryCategory) {
    super(category);
  }
}

export const DELIVERY_TIMEOUT_MS = 15000;

/**
 * Sends the request to the shared receiving endpoint.
 *
 * Contract: POST JSON; the endpoint answers 2xx with JSON { "accepted": true }.
 * Anything else is a failure and the visitor's input stays in the form.
 * With no endpoint configured nothing is sent and 'preview' is returned, and the same
 * when the server answers { accepted: true, dryRun: true }. The page must never present
 * either as a received request.
 */
export async function deliverContactRequest(
  request: ContactRequest,
  endpoint: string | null,
  transport: typeof fetch = fetch,
): Promise<'preview' | 'accepted'> {
  if (!endpoint) return 'preview';
  const sameOriginPath = endpoint.startsWith('/') && !endpoint.startsWith('//');
  if (!sameOriginPath && !/^https:\/\//.test(endpoint)) throw new DeliveryError('configuration');

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), DELIVERY_TIMEOUT_MS);
  try {
    let response: Response;
    try {
      response = await transport(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: abort.signal,
      });
    } catch {
      throw new DeliveryError(abort.signal.aborted ? 'timeout' : 'network');
    }
    if (!response.ok) throw new DeliveryError('rejected');
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new DeliveryError('invalid_acknowledgement');
    }
    if (!body || typeof body !== 'object' || !('accepted' in body) || body.accepted !== true) {
      throw new DeliveryError('invalid_acknowledgement');
    }
    // A dry run (CONTACT_DRY_RUN on the server) checked the request but sent nothing.
    if ('dryRun' in body && body.dryRun === true) return 'preview';
    return 'accepted';
  } finally {
    clearTimeout(timer);
  }
}

// ---------- delivery to Netlify Forms ----------

/**
 * The submission as Netlify Forms expects it (application/x-www-form-urlencoded). Values come from the
 * normalised request, not from the raw inputs: digits-only phone, trimmed text, 'yes'/'no' consent.
 * The spam trap goes in 'homepage_url', the honeypot field declared in the form's markup, so
 * Netlify drops submissions that fill it.
 */
export function toFormBody(request: ContactRequest, formName: string): string {
  const fields: Record<string, string> = {
    'form-name': formName,
    lp: request.lp,
    firstName: request.firstName,
    lastName: request.lastName,
    zip: request.zip,
    phone: request.phone,
    email: request.email,
    message: request.message,
    smsConsent: request.smsConsent ? 'yes' : 'no',
    smsConsentAt: request.smsConsentAt ?? '',
    smsConsentText: request.smsConsentText ?? '',
    submittedAt: request.submittedAt,
    homepage_url: request.honeypot,
  };
  for (const key of UTM_KEYS) fields[key] = request.utm[key] ?? '';
  return new URLSearchParams(fields).toString();
}

/**
 * Posts the request to Netlify Forms: a POST to the page's own path, as a plain HTML form would do.
 * Netlify answers 2xx once it has taken the submission (it cannot answer with our JSON). Any other
 * outcome is a failure and the visitor's input stays in the form.
 * Netlify answers 2xx for spam it filters out too, so this is "taken in", not "will be read".
 */
export async function deliverToNetlifyForms(
  request: ContactRequest,
  formName: string,
  path: string,
  transport: typeof fetch = fetch,
): Promise<'accepted'> {
  if (!path.startsWith('/') || path.startsWith('//')) throw new DeliveryError('configuration');

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), DELIVERY_TIMEOUT_MS);
  try {
    let response: Response;
    try {
      response = await transport(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: toFormBody(request, formName),
        signal: abort.signal,
      });
    } catch {
      throw new DeliveryError(abort.signal.aborted ? 'timeout' : 'network');
    }
    if (!response.ok) throw new DeliveryError('rejected');
    return 'accepted';
  } finally {
    clearTimeout(timer);
  }
}
