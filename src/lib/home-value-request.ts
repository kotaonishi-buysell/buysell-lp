export interface VisitRequest {
  lp: 'home-value';
  name: string;
  phone: string;
  email: string;
  zip: string;
  categories: string[];
  preferredDate: string;
  preferredTime: string;
  timeZone: 'America/Chicago';
  notes: string;
}
export type RequestField = 'name' | 'phone' | 'email' | 'zip' | 'preferredDate' | 'preferredTime' | 'notes';

export function chicagoDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const value = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}
export function validUSPhone(value: string): boolean {
  if (!/^[\d\s()+.\-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return /^\d{10}$/.test(digits) || /^1\d{10}$/.test(digits);
}
export function validPreferredDate(value: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00Z');
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value && value >= chicagoDate(now);
}
export function invalidFields(request: VisitRequest, now = new Date()): RequestField[] {
  const invalid: RequestField[] = [];
  if (!request.name.trim()) invalid.push('name');
  if (!validUSPhone(request.phone)) invalid.push('phone');
  if (request.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) invalid.push('email');
  if (!/^\d{5}$/.test(request.zip)) invalid.push('zip');
  if (!validPreferredDate(request.preferredDate, now)) invalid.push('preferredDate');
  if (request.preferredTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(request.preferredTime)) invalid.push('preferredTime');
  if (request.notes.length > 1000) invalid.push('notes');
  return invalid;
}

export class DeliveryError extends Error {
  constructor(public category: 'network' | 'timeout' | 'rejected' | 'invalid_acknowledgement' | 'configuration') {
    super(category);
  }
}

// The approved receiving service must return 2xx JSON { accepted: true }.
// This is our adapter contract, not an assumed Jobber API.
export async function deliverVisitRequest(
  request: VisitRequest,
  endpoint: string | null,
  transport: typeof fetch = fetch,
): Promise<'preview' | 'accepted'> {
  if (!endpoint) return 'preview';
  if (!(endpoint.startsWith('/') && !endpoint.startsWith('//')) && !/^https:\/\//.test(endpoint)) {
    throw new DeliveryError('configuration');
  }
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 15000);
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
    try { body = await response.json(); } catch { throw new DeliveryError('invalid_acknowledgement'); }
    if (!body || typeof body !== 'object' || !('accepted' in body) || body.accepted !== true) {
      throw new DeliveryError('invalid_acknowledgement');
    }
    return 'accepted';
  } finally { clearTimeout(timer); }
}
