/*
 * Consultation request form: validation, ZIP service-area check, UTM capture
 * and submission. Validates on submit, then on blur once a submit was tried.
 */
import { track } from './analytics';
import { submitConsultation, type ConsultationRequest } from './submit';

interface FormConfig {
  zipPrefixes: string[];
  zipMessages: { inArea: string; outOfArea: string; notConfigured: string };
  errors: {
    summaryOne: string;
    summaryMany: string;
    name: string;
    contactMissing: string;
    phoneInvalid: string;
    emailInvalid: string;
    zipMissing: string;
    zipInvalid: string;
    privacy: string;
  };
  sendingLabel: string;
  failure: string;
}

type FieldName = 'name' | 'contact' | 'zip' | 'privacy';

const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** US numbers: 10 digits, optionally with a leading country code 1. */
const isValidPhone = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
};

export const initForm = (): void => {
  const form = document.querySelector<HTMLFormElement>('[data-consult-form]');
  const configElement = form?.querySelector('[data-consult-config]');
  if (!form || !configElement?.textContent) return;

  const config = JSON.parse(configElement.textContent) as FormConfig;
  const summary = form.querySelector<HTMLElement>('[data-error-summary]');
  const submitButton = form.querySelector<HTMLButtonElement>('[data-submit]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const zipStatus = form.querySelector<HTMLElement>('[data-zip-status]');

  const control = <T extends HTMLElement = HTMLInputElement>(name: string) =>
    form.elements.namedItem(name) as T | null;
  const nameInput = control('name');
  const phoneInput = control('phone');
  const emailInput = control('email');
  const zipInput = control('zip');
  const privacyInput = control('privacy');
  const tcpaInput = control('tcpa_consent');
  if (!nameInput || !phoneInput || !emailInput || !zipInput || !privacyInput) return;

  let submitted = false;
  let started = false;
  let sending = false;

  // ---------- UTM capture ----------
  const params = new URLSearchParams(window.location.search);
  form.querySelectorAll<HTMLInputElement>('[data-utm]').forEach((input) => {
    input.value = params.get(input.name) ?? '';
  });

  // ---------- validation ----------
  /** Returns the error message and the controls it applies to, or null when valid. */
  const check = (field: FieldName): { message: string; controls: HTMLInputElement[] } | null => {
    switch (field) {
      case 'name':
        return nameInput.value.trim() ? null : { message: config.errors.name, controls: [nameInput] };
      case 'contact': {
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        if (!phone && !email) {
          return { message: config.errors.contactMissing, controls: [phoneInput, emailInput] };
        }
        const messages: string[] = [];
        const controls: HTMLInputElement[] = [];
        if (phone && !isValidPhone(phone)) {
          messages.push(config.errors.phoneInvalid);
          controls.push(phoneInput);
        }
        if (email && !EMAIL_PATTERN.test(email)) {
          messages.push(config.errors.emailInvalid);
          controls.push(emailInput);
        }
        return messages.length ? { message: messages.join(' '), controls } : null;
      }
      case 'zip': {
        const zip = zipInput.value.trim();
        if (!zip) return { message: config.errors.zipMissing, controls: [zipInput] };
        return ZIP_PATTERN.test(zip) ? null : { message: config.errors.zipInvalid, controls: [zipInput] };
      }
      case 'privacy':
        return privacyInput.checked ? null : { message: config.errors.privacy, controls: [privacyInput] };
    }
  };

  const fieldControls: Record<FieldName, HTMLInputElement[]> = {
    name: [nameInput],
    contact: [phoneInput, emailInput],
    zip: [zipInput],
    privacy: [privacyInput],
  };
  const fields = Object.keys(fieldControls) as FieldName[];

  /** Shows or clears the error for one field; returns true when the field is valid. */
  const validate = (field: FieldName): boolean => {
    const wrapper = form.querySelector<HTMLElement>(`[data-field="${field}"]`);
    const errorElement = wrapper?.querySelector<HTMLElement>('[data-error]');
    const result = check(field);

    fieldControls[field].forEach((input) => {
      if (result?.controls.includes(input)) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    });
    if (errorElement) {
      errorElement.textContent = result?.message ?? '';
      errorElement.hidden = !result;
    }
    return !result;
  };

  const setSummary = (invalidCount: number) => {
    if (!summary) return;
    if (invalidCount === 0) summary.textContent = '';
    else if (invalidCount === 1) summary.textContent = config.errors.summaryOne;
    else summary.textContent = config.errors.summaryMany.replace('{count}', String(invalidCount));
  };

  // Once a submit was tried: re-check a field when the reader leaves it, and
  // clear its error as soon as the answer becomes valid. Clearing while typing
  // keeps the layout still at blur, so a click on the next field lands where
  // the reader aimed.
  const recheck = (field: FieldName, onlyIfValid: boolean) => {
    if (!submitted) return;
    if (onlyIfValid && check(field)) return;
    validate(field);
    setSummary(fields.filter((name) => check(name)).length);
  };
  fields.forEach((field) => {
    const wrapper = form.querySelector<HTMLElement>(`[data-field="${field}"]`);
    wrapper?.addEventListener('input', () => recheck(field, true));
    wrapper?.addEventListener('change', () => recheck(field, field !== 'privacy'));
    if (field !== 'privacy') wrapper?.addEventListener('focusout', () => recheck(field, false));
  });

  // ---------- ZIP service-area check ----------
  const updateZipStatus = () => {
    if (!zipStatus) return;
    const zip = zipInput.value.trim();
    if (!ZIP_PATTERN.test(zip)) {
      zipStatus.innerHTML = '';
      return;
    }
    if (config.zipPrefixes.length === 0) {
      zipStatus.innerHTML = config.zipMessages.notConfigured;
      return;
    }
    const inArea = config.zipPrefixes.some((prefix) => zip.startsWith(prefix));
    zipStatus.innerHTML = inArea ? config.zipMessages.inArea : config.zipMessages.outOfArea;
  };
  zipInput.addEventListener('input', updateZipStatus);

  // ---------- form_start ----------
  const markStarted = () => {
    if (started) return;
    started = true;
    track('form_start');
  };
  form.addEventListener('input', markStarted);
  form.addEventListener('change', markStarted);

  // ---------- submit ----------
  const collect = (): ConsultationRequest => {
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? '').trim();
    const utm: Record<string, string> = {};
    form.querySelectorAll<HTMLInputElement>('[data-utm]').forEach((input) => {
      if (input.value) utm[input.name] = input.value;
    });
    return {
      lp: text('lp'),
      name: text('name'),
      phone: text('phone'),
      email: text('email'),
      zip: text('zip'),
      items: data.getAll('items').map(String),
      amount: text('amount'),
      timing: text('timing'),
      notes: text('notes'),
      privacyConsent: privacyInput.checked,
      tcpaConsent: tcpaInput?.checked ?? false,
      utm,
    };
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    submitted = true;

    const invalid = fields.filter((field) => !validate(field));
    setSummary(invalid.length);
    if (invalid.length > 0) {
      fieldControls[invalid[0]].find((input) => input.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }

    sending = true;
    const idleLabel = submitButton?.textContent ?? '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      submitButton.textContent = config.sendingLabel;
    }

    try {
      const request = collect();
      await submitConsultation(request);
      track('form_submit', { lp: request.lp });
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    } catch (error) {
      console.error('[consult form] submit failed', error);
      if (summary) summary.innerHTML = config.failure;
    } finally {
      sending = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.textContent = idleLabel;
      }
    }
  });
};
