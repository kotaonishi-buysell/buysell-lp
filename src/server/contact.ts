/*
 * Receiving side of the shared contact form.
 *
 * Web-standard Request in, Response out, so it runs on Vercel Functions and in
 * unit tests alike. It checks everything again (the browser is not trusted),
 * drops obvious bots, and emails the inquiry to the team.
 *
 * Contract with the browser (see src/lib/contact-form.ts):
 *   POST JSON  ->  200 { "accepted": true }   only after the email provider accepted the message
 *                  4xx/5xx { "accepted": false, "error": "<code>" }
 *
 * Environment variables (set in the hosting dashboard, never in the repo):
 *   RESEND_API_KEY            API key of the email provider
 *   CONTACT_TO_EMAIL          who receives inquiries (comma-separated for several people)
 *   CONTACT_FROM_EMAIL        sender, on a domain verified with the provider, e.g. "REWORTH <inquiries@example.com>"
 *   CONTACT_ALLOWED_ORIGINS   optional, comma-separated extra origins allowed to post (the site's own origin is always allowed)
 *   CONTACT_DRY_RUN           optional, "true" to check the pipeline without email: the request is validated, a redacted
 *                             summary goes to the function log, nothing is emailed, and the browser is told it was a dry run
 *   EMAIL_API_URL             optional, for testing only: replaces the provider's address (default https://api.resend.com/emails)
 *
 * The email provider is isolated in sendEmail(); replace that one function to change provider.
 */
import { MESSAGE_MAX, UTM_KEYS, buildRequest, validate, type ContactRequest } from '../lib/contact-form.ts';

export interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
  EMAIL_API_URL?: string;
  CONTACT_DRY_RUN?: string;
}

export interface ContactDeps {
  fetch?: typeof fetch;
  now?: () => Date;
}

/** Largest request body accepted, in characters. A full message is about 1.5 KB. */
export const MAX_BODY_CHARS = 10_000;
/** Humans need longer than this between opening the page and sending the form. */
export const MIN_ELAPSED_MS = 2000;
const EMAIL_TIMEOUT_MS = 10_000;

const json = (status: number, body: Record<string, unknown>): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const rejected = (status: number, error: string): Response => json(status, { accepted: false, error });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const text = (value: unknown): string => (typeof value === 'string' ? value : '');

/** Removes control characters other than newlines, so nothing can break the email layout. */
const clean = (value: string): string => value.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ');

const formatPhone = (digits: string): string => `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;

function originAllowed(request: Request, env: ContactEnv): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // not a browser cross-site call; CORS already blocks those
  const allowed = new Set([new URL(request.url).origin]);
  for (const item of (env.CONTACT_ALLOWED_ORIGINS ?? '').split(',')) {
    if (item.trim()) allowed.add(item.trim());
  }
  return allowed.has(origin);
}

/** Turns the untrusted JSON body into a normalised request, or null when it is not valid. */
function parseRequest(body: unknown, now: Date): ContactRequest | null {
  if (!isRecord(body)) return null;
  const values = {
    firstName: text(body.firstName),
    lastName: text(body.lastName),
    zip: text(body.zip),
    phone: text(body.phone),
    email: text(body.email),
    message: text(body.message),
  };
  if (validate(values).length > 0) return null;

  const lp = text(body.lp);
  if (!/^[a-z0-9-]{1,40}$/.test(lp)) return null;

  const smsConsent = body.smsConsent === true;
  const consentText = text(body.smsConsentText).slice(0, 1000);
  if (smsConsent && !consentText) return null;
  const consentAt = text(body.smsConsentAt);
  const consentTime = Date.parse(consentAt);

  const utm: Record<string, string> = {};
  if (isRecord(body.utm)) {
    for (const key of UTM_KEYS) {
      const value = text(body.utm[key]).trim();
      if (value) utm[key] = value.slice(0, 200);
    }
  }

  return buildRequest(values, {
    lp,
    smsConsent,
    smsConsentAt: smsConsent && !Number.isNaN(consentTime) ? new Date(consentTime).toISOString() : null,
    smsConsentText: consentText,
    utm,
    honeypot: text(body.honeypot),
    elapsedMs: typeof body.elapsedMs === 'number' && Number.isFinite(body.elapsedMs) ? body.elapsedMs : -1,
    now,
  });
}

/**
 * What the dry run writes to the function log: enough to see that the request arrived and
 * was normalised correctly, without the visitor's name, phone number, email or message.
 */
export function redactedSummary(request: ContactRequest): Record<string, unknown> {
  const initial = (name: string) => `${[...name][0] ?? ''}… (${[...name].length} letters)`;
  const email = request.email;
  return {
    lp: request.lp,
    firstName: initial(request.firstName),
    lastName: initial(request.lastName),
    zip: request.zip,
    phone: `${request.phone.length} digits, ends ${request.phone.slice(-4)}`,
    email: email ? `…@${email.split('@')[1] ?? '?'}` : '(not given)',
    messageLength: request.message.length,
    smsConsent: request.smsConsent,
    smsConsentAt: request.smsConsentAt,
    smsConsentTextLength: request.smsConsentText?.length ?? 0,
    utm: request.utm,
    elapsedMs: request.elapsedMs,
    submittedAt: request.submittedAt,
  };
}

const isOn = (value: string | undefined): boolean => ['1', 'true', 'yes', 'on'].includes((value ?? '').trim().toLowerCase());

/** Plain-text body of the notification email. */
export function composeEmail(request: ContactRequest, receivedAt: Date): { subject: string; text: string } {
  const lines = [
    'A new inquiry came in from the website.',
    '',
    `Landing page: ${request.lp}`,
    `Received: ${receivedAt.toISOString()}`,
    '',
    `Name: ${clean(request.firstName)} ${clean(request.lastName)}`,
    `Phone: ${formatPhone(request.phone)}`,
    `Email: ${request.email ? clean(request.email) : '(not given)'}`,
    `ZIP code: ${request.zip}`,
    '',
    'Message:',
    request.message ? clean(request.message) : '(none)',
    '',
    `Text messages (SMS): ${request.smsConsent ? 'YES, the visitor agreed' : 'No, the box was not ticked'}`,
  ];
  if (request.smsConsent) {
    lines.push(`  Agreed at (visitor's browser clock): ${request.smsConsentAt ?? 'unknown'}`);
    lines.push(`  Wording shown: ${clean(request.smsConsentText ?? '')}`);
  }
  const utm = Object.entries(request.utm);
  if (utm.length > 0) {
    lines.push('', 'Campaign:', ...utm.map(([key, value]) => `  ${key}: ${clean(value)}`));
  }
  // The subject holds no visitor-supplied text; lp is restricted to [a-z0-9-].
  return { subject: `New inquiry (${request.lp})`, text: lines.join('\n') };
}

/** Sends the email through Resend. Throws when the provider does not accept it. */
async function sendEmail(
  message: { subject: string; text: string; replyTo?: string },
  env: Required<Pick<ContactEnv, 'RESEND_API_KEY' | 'CONTACT_TO_EMAIL' | 'CONTACT_FROM_EMAIL'>> & { EMAIL_API_URL?: string },
  transport: typeof fetch,
): Promise<void> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), EMAIL_TIMEOUT_MS);
  try {
    const response = await transport(env.EMAIL_API_URL || 'https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL.split(',').map((address) => address.trim()).filter(Boolean),
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: abort.signal,
    });
    if (!response.ok) throw new Error(`email provider answered ${response.status}`);
  } finally {
    clearTimeout(timer);
  }
}

export async function handleContact(request: Request, env: ContactEnv, deps: ContactDeps = {}): Promise<Response> {
  const transport = deps.fetch ?? fetch;
  const now = (deps.now ?? (() => new Date()))();

  if (request.method !== 'POST') return rejected(405, 'method_not_allowed');
  if (!originAllowed(request, env)) return rejected(403, 'origin_not_allowed');
  if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
    return rejected(415, 'unsupported_media_type');
  }

  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_CHARS * 4) return rejected(413, 'too_large');
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return rejected(413, 'too_large');

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return rejected(400, 'invalid_json');
  }

  const parsed = parseRequest(body, now);
  if (!parsed) return rejected(400, 'invalid_request');

  // A bot filled the hidden field: answer as if it worked, send nothing.
  if (parsed.honeypot.trim()) return json(200, { accepted: true });
  // Submitted faster than a person can: ask the browser to try again.
  if (parsed.elapsedMs < MIN_ELAPSED_MS) return rejected(400, 'too_fast');
  if (parsed.message.length > MESSAGE_MAX) return rejected(400, 'invalid_request');

  // Dry run: everything above was checked for real; only the email is skipped.
  if (isOn(env.CONTACT_DRY_RUN)) {
    console.info('contact dry run: request received and valid, no email sent.', JSON.stringify(redactedSummary(parsed)));
    return json(200, { accepted: true, dryRun: true });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('contact: email settings are missing (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL)');
    return rejected(500, 'not_configured');
  }

  try {
    const { subject, text: emailText } = composeEmail(parsed, now);
    await sendEmail(
      { subject, text: emailText, replyTo: parsed.email || undefined },
      { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, EMAIL_API_URL: env.EMAIL_API_URL },
      transport,
    );
  } catch (error) {
    // Log the reason only; the log must not contain the visitor's details.
    console.error('contact: could not send the notification email:', error instanceof Error ? error.message : error);
    return rejected(502, 'delivery_failed');
  }
  return json(200, { accepted: true });
}
