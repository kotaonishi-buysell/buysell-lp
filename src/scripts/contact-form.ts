/*
 * Browser behaviour of the shared contact form.
 * No analytics here: the form announces what happened with a `cf:event`
 * CustomEvent on document, and each LP decides what to do with it.
 *   detail: { name: 'start' | 'submit' | 'error', lp: string, category?: string }
 */
import {
  DeliveryError,
  FIELD_ORDER,
  buildRequest,
  deliverContactRequest,
  messageRemaining,
  readUtm,
  validate,
  type ContactFormValues,
  type FieldIssue,
  type FieldName,
} from '../lib/contact-form';

interface FormConfig {
  lp: string;
  endpoint: string | null;
  idPrefix: string;
  consentText: string;
  copy: {
    errors: Record<string, Record<string, string>>;
    summary: string;
    summaryOne: string;
    remaining: string;
    remainingOne: string;
    sending: string;
    failure: string;
  };
}

type FormEventName = 'start' | 'submit' | 'error';

const announce = (name: FormEventName, lp: string, category?: string): void => {
  document.dispatchEvent(new CustomEvent('cf:event', { detail: { name, lp, ...(category ? { category } : {}) } }));
};

function initForm(form: HTMLFormElement): void {
  const configNode = form.querySelector('[data-cf-config]');
  if (!configNode?.textContent) return;
  const config = JSON.parse(configNode.textContent) as FormConfig;
  const { copy } = config;

  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
  const smsBox = field('smsConsent') as HTMLInputElement;
  const submitButton = form.querySelector<HTMLButtonElement>('[data-cf-submit]')!;
  const status = form.querySelector<HTMLElement>('[data-cf-status]')!;
  const counter = form.querySelector<HTMLElement>('[data-cf-count]')!;
  const success = form.nextElementSibling as HTMLElement | null;
  const previewResult = success?.querySelector<HTMLElement>('[data-cf-preview-result]');
  const previewLabel = success?.querySelector<HTMLElement>('[data-cf-preview-label]');
  const editButton = success?.querySelector<HTMLButtonElement>('[data-cf-edit]');

  let attempted = false;
  let started = false;
  let sending = false;
  let smsConsentAt: string | null = null;

  // ---------- UTM ----------
  const utm = readUtm(window.location.search);
  form.querySelectorAll<HTMLInputElement>('[data-cf-utm]').forEach((input) => {
    input.value = utm[input.dataset.cfUtm ?? ''] ?? '';
  });

  // ---------- helpers ----------
  const values = (): ContactFormValues => ({
    firstName: field('firstName').value,
    lastName: field('lastName').value,
    zip: field('zip').value,
    phone: field('phone').value,
    email: field('email').value,
    message: field('message').value,
  });

  const wrapperOf = (name: FieldName) => form.querySelector<HTMLElement>(`[data-cf-field="${name}"]`)!;

  const messageFor = (issue: FieldIssue): string => copy.errors[issue.field]?.[issue.code] ?? '';

  /** Shows or clears the error of every field. Returns the issues. */
  const render = (): FieldIssue[] => {
    const issues = validate(values());
    for (const name of FIELD_ORDER) {
      const issue = issues.find((item) => item.field === name);
      const error = wrapperOf(name).querySelector<HTMLElement>('[data-cf-error]')!;
      error.textContent = issue ? messageFor(issue) : '';
      error.hidden = !issue;
      if (issue) field(name).setAttribute('aria-invalid', 'true');
      else field(name).removeAttribute('aria-invalid');
    }
    return issues;
  };

  const clearErrors = (): void => {
    for (const name of FIELD_ORDER) {
      const error = wrapperOf(name).querySelector<HTMLElement>('[data-cf-error]')!;
      error.textContent = '';
      error.hidden = true;
      field(name).removeAttribute('aria-invalid');
    }
  };

  const summaryFor = (count: number): string =>
    count === 1 ? copy.summaryOne : copy.summary.replace('{count}', String(count));

  const updateCounter = (): void => {
    const left = messageRemaining(field('message').value);
    counter.textContent =
      left === 1 ? copy.remainingOne : copy.remaining.replace('{count}', left.toLocaleString('en-US'));
  };

  // ---------- events ----------
  form.addEventListener('input', () => {
    if (!started) {
      started = true;
      announce('start', config.lp);
    }
    if (status.textContent) status.textContent = '';
    if (attempted && !sending) render();
  });
  form.addEventListener('focusout', () => {
    if (attempted && !sending) render();
  });
  field('message').addEventListener('input', updateCounter);
  smsBox.addEventListener('change', () => {
    smsConsentAt = smsBox.checked ? new Date().toISOString() : null;
    if (!started) {
      started = true;
      announce('start', config.lp);
    }
  });

  editButton?.addEventListener('click', () => {
    if (!success) return;
    success.hidden = true;
    form.hidden = false;
    status.textContent = '';
    field('firstName').focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    attempted = true;

    const issues = render();
    if (issues.length > 0) {
      status.textContent = summaryFor(issues.length);
      field(issues[0].field).focus();
      return;
    }

    sending = true;
    const idleLabel = submitButton.textContent ?? '';
    submitButton.disabled = true;
    submitButton.textContent = copy.sending;
    form.setAttribute('aria-busy', 'true');

    try {
      const request = buildRequest(values(), {
        lp: config.lp,
        smsConsent: smsBox.checked,
        smsConsentAt,
        smsConsentText: config.consentText,
        utm,
      });
      const result = await deliverContactRequest(request, config.endpoint);

      form.hidden = true;
      if (result === 'accepted') {
        announce('submit', config.lp);
        form.reset();
        smsConsentAt = null;
        attempted = false;
        started = false;
        updateCounter();
        clearErrors();
        if (previewResult) previewResult.hidden = true;
        if (previewLabel) previewLabel.hidden = true;
        if (editButton) editButton.hidden = true;
      } else {
        // Preview: nothing was sent. Show the thank-you design with a clear notice.
        if (previewResult) previewResult.hidden = false;
        if (previewLabel) previewLabel.hidden = false;
        if (editButton) editButton.hidden = false;
      }
      if (success) {
        success.hidden = false;
        success.focus();
      }
    } catch (error) {
      status.textContent = copy.failure;
      status.focus();
      announce('error', config.lp, error instanceof DeliveryError ? error.category : 'network');
    } finally {
      sending = false;
      submitButton.disabled = false;
      submitButton.textContent = idleLabel;
      form.removeAttribute('aria-busy');
    }
  });

  // The server-rendered counter assumes an empty box; browsers may restore text on reload.
  updateCounter();
}

export function initContactForms(): void {
  document.querySelectorAll<HTMLFormElement>('[data-cf]').forEach(initForm);
}
