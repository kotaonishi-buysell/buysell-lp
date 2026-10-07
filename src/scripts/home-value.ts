import { chicagoDate, invalidFields, deliverVisitRequest, DeliveryError, type VisitRequest, type RequestField } from '../lib/home-value-request';

type EventName = 'phone_click' | 'visit_request_open' | 'visit_request_submit' | 'visit_request_error';
export function measure(enabled: boolean, event: EventName, category?: DeliveryError['category']): void {
  if (!enabled) return;
  // Local, allowlisted payload only. No external tracker, form data or query string.
  window.dispatchEvent(new CustomEvent('buysell:measurement', {
    detail: { event, lp: 'home-value', ...(category ? { category } : {}) },
  }));
}

function initHomeValue(): void {
  const form = document.querySelector<HTMLFormElement>('[data-visit-form]');
  const configNode = document.querySelector('[data-visit-config]');
  if (!form || !configNode?.textContent) return;
  const config = JSON.parse(configNode.textContent) as {
    endpoint: string | null;
    measurementEnabled: boolean;
    errors: Record<RequestField, string>;
    summary: string;
    sending: string;
    previewValid: string;
    success: string;
    failure: string;
  };
  const control = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('[data-visit-status]')!;
  const date = control('preferredDate') as HTMLInputElement;
  date.min = chicagoDate();
  let sending = false;
  let attempted = false;
  let revision = 0;
  form.addEventListener('input', () => { revision += 1; });

  const collect = (): VisitRequest => {
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? '').trim();
    return {
      lp: 'home-value', name: value('name'), phone: value('phone'), email: value('email'),
      zip: value('zip'), categories: data.getAll('categories').map(String),
      preferredDate: value('preferredDate'), preferredTime: value('preferredTime'),
      timeZone: 'America/Chicago', notes: value('notes'),
    };
  };
  const showErrors = () => {
    date.min = chicagoDate();
    const invalid = invalidFields(collect());
    for (const field of Object.keys(config.errors) as RequestField[]) {
      const error = form.querySelector<HTMLElement>(`[data-error="${field}"]`)!;
      const isInvalid = invalid.includes(field);
      error.textContent = isInvalid ? config.errors[field] : '';
      error.hidden = !isInvalid;
      control(field).setAttribute('aria-invalid', String(isInvalid));
    }
    return invalid;
  };
  form.addEventListener('focusout', () => { if (attempted && !sending) showErrors(); });
  form.addEventListener('input', () => {
    status.textContent = '';
    if (attempted && !sending) showErrors();
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-visit-open]').forEach((link) => {
    link.addEventListener('click', () => {
      measure(config.measurementEnabled, 'visit_request_open');
      document.querySelector<HTMLElement>('#visit-title')?.focus({ preventScroll: true });
    });
  });
  document.querySelectorAll('[data-phone-call]').forEach((link) => {
    link.addEventListener('click', () => measure(config.measurementEnabled, 'phone_click'));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    attempted = true;
    const invalid = showErrors();
    if (invalid.length) {
      status.textContent = config.summary;
      control(invalid[0]).focus();
      return;
    }
    sending = true;
    const sentRevision = revision;
    const request = collect();
    const idleLabel = button.textContent!;
    button.disabled = true;
    button.textContent = config.sending;
    form.setAttribute('aria-busy', 'true');
    // Freeze fields until the current request completes; preserve them on failure.
    const editable = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea'));
    editable.forEach((input) => { input.disabled = true; });
    try {
      const result = await deliverVisitRequest(request, config.endpoint);
      if (result === 'preview') {
        status.textContent = config.previewValid;
      } else {
        status.textContent = config.success;
        measure(config.measurementEnabled, 'visit_request_submit');
        if (revision === sentRevision) form.reset();
        date.min = chicagoDate();
      }
      status.focus();
    } catch (error) {
      status.textContent = config.failure;
      measure(config.measurementEnabled, 'visit_request_error', error instanceof DeliveryError ? error.category : 'network');
      status.focus();
    } finally {
      sending = false;
      editable.forEach((input) => { input.disabled = false; });
      button.disabled = false;
      button.textContent = idleLabel;
      form.removeAttribute('aria-busy');
    }
  });
}
initHomeValue();
