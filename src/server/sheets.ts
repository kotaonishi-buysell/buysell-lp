/*
 * Writes one inquiry as one row of a Google Sheet (Google Sheets API, values.append).
 *
 * Authentication is a Google service account (a robot account that is given edit access to the sheet), signed
 * with the Web Crypto API, so there is no dependency. The sheet is "append only" for the site: the function
 * adds rows and never reads or changes existing ones.
 *
 * Environment variables (set in the hosting dashboard, never in the repo):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL   the service account's address (client_email in its key file)
 *   GOOGLE_PRIVATE_KEY             its private key (private_key in the key file; "\n" written as text is accepted)
 *   GOOGLE_SHEET_ID                the id in the sheet's address: docs.google.com/spreadsheets/d/<ID>/edit
 *   GOOGLE_SHEET_TAB               optional, the tab (sheet) name; default "Inquiries"
 *   GOOGLE_TOKEN_URL, GOOGLE_SHEETS_API_URL   optional, for testing only: replace Google's addresses
 */
import { UTM_KEYS, type ContactRequest } from '../lib/contact-form.ts';

export interface SheetsEnv {
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_PRIVATE_KEY?: string;
  GOOGLE_SHEET_ID?: string;
  GOOGLE_SHEET_TAB?: string;
  GOOGLE_TOKEN_URL?: string;
  GOOGLE_SHEETS_API_URL?: string;
}

export const DEFAULT_TAB = 'Inquiries';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const TIMEOUT_MS = 10_000;

/** Column titles, in the order of a row. Paste them into row 1 of the tab (docs/forms/contact-form.md). */
export const SHEET_COLUMNS = [
  'Received at (UTC)',
  'Landing page',
  'First name',
  'Last name',
  'ZIP code',
  'In service area',
  'Phone',
  'Email',
  'Message',
  'Text messages (SMS)',
  'SMS agreed at (UTC)',
  'SMS wording shown',
  'Submitted at (UTC, visitor clock)',
  ...UTM_KEYS,
] as const;

/** True when every setting needed to write to the sheet is present. */
export const sheetsConfigured = (env: SheetsEnv): boolean =>
  Boolean(env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_PRIVATE_KEY && env.GOOGLE_SHEET_ID);

/** Strips control characters (other than newline) so a cell cannot carry anything odd. */
const clean = (value: string): string => value.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ');

/**
 * One request as one row. Everything is text: the values are sent with valueInputOption RAW, which stores them
 * as typed (a message that starts with "=" stays text and is never run as a formula; a phone number keeps its digits).
 */
export function toRow(request: ContactRequest, receivedAt: Date, inServiceArea: boolean | null): string[] {
  return [
    receivedAt.toISOString(),
    request.lp,
    clean(request.firstName),
    clean(request.lastName),
    request.zip,
    inServiceArea === null ? '' : inServiceArea ? 'yes' : 'no',
    request.phone,
    clean(request.email),
    clean(request.message),
    request.smsConsent ? 'yes' : 'no',
    request.smsConsentAt ?? '',
    clean(request.smsConsentText ?? ''),
    request.submittedAt,
    ...UTM_KEYS.map((key) => clean(request.utm[key] ?? '')),
  ];
}

// ---------- authentication ----------

const base64url = (input: ArrayBuffer | string): string => {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/** PEM text ("-----BEGIN PRIVATE KEY-----...") to the bytes of the key. */
const pemToBytes = (pem: string): Uint8Array<ArrayBuffer> => {
  const body = pem
    .replace(/\\n/g, '\n')
    .replace(/-----BEGIN [A-Z ]*-----|-----END [A-Z ]*-----/g, '')
    .replace(/\s+/g, '');
  const binary = atob(body);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

/** The signed request for an access token (a JWT, RS256) as Google's service-account flow defines it. */
export async function signJwt(
  claims: { iss: string; scope: string; aud: string; iat: number; exp: number },
  privateKeyPem: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToBytes(privateKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const unsigned = `${base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64url(JSON.stringify(claims))}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  return `${unsigned}.${base64url(signature)}`;
}

let cachedToken: { value: string; expiresAt: number; key: string } | null = null;

/** Forgets the cached access token (tests). */
export const resetTokenCache = (): void => {
  cachedToken = null;
};

async function accessToken(env: SheetsEnv, transport: typeof fetch, now: Date): Promise<string> {
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const cacheKey = `${email}|${env.GOOGLE_TOKEN_URL ?? ''}`;
  // A token lasts an hour; reuse it (warm function) until a minute before it ends.
  if (cachedToken && cachedToken.key === cacheKey && cachedToken.expiresAt - 60_000 > now.getTime()) return cachedToken.value;

  const audience = env.GOOGLE_TOKEN_URL || TOKEN_URL;
  const issuedAt = Math.floor(now.getTime() / 1000);
  const assertion = await signJwt(
    { iss: email, scope: SCOPE, aud: audience, iat: issuedAt, exp: issuedAt + 3600 },
    env.GOOGLE_PRIVATE_KEY!,
  );
  const response = await transport(audience, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }).toString(),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Google sign-in answered ${response.status}`);
  const data = (await response.json()) as { access_token?: unknown; expires_in?: unknown };
  if (typeof data.access_token !== 'string') throw new Error('Google sign-in gave no access token');
  const lifetime = typeof data.expires_in === 'number' ? data.expires_in : 3600;
  cachedToken = { value: data.access_token, expiresAt: now.getTime() + lifetime * 1000, key: cacheKey };
  return data.access_token;
}

/**
 * Appends one row at the end of the tab. Throws when Google does not accept it; the caller decides what the
 * visitor sees. The error message holds no visitor data.
 */
export async function appendRow(
  row: string[],
  env: SheetsEnv,
  transport: typeof fetch = fetch,
  now: Date = new Date(),
): Promise<void> {
  const tab = (env.GOOGLE_SHEET_TAB || DEFAULT_TAB).replace(/'/g, "''");
  const range = encodeURIComponent(`'${tab}'!A:A`);
  const base = env.GOOGLE_SHEETS_API_URL || SHEETS_URL;
  const url = `${base}/${encodeURIComponent(env.GOOGLE_SHEET_ID!)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const send = async (token: string) =>
    transport(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ majorDimension: 'ROWS', values: [row] }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

  let response = await send(await accessToken(env, transport, now));
  if (response.status === 401) {
    // The cached token was refused (revoked or expired early): sign in again, once.
    resetTokenCache();
    response = await send(await accessToken(env, transport, now));
  }
  if (!response.ok) throw new Error(`Google Sheets answered ${response.status}`);
}
