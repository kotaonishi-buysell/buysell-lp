/* Behaviour of the service-area ZIP box (src/components/ZipCheck.astro). */
import { normalizeZip } from '../lib/contact-form';
import { zipAreaStatus, type ZipConfig } from '../lib/zip-area';
import { openConsultForm } from './cta';

/**
 * Fills the ZIP field of the page's contact form. The form owns the field, so it is asked by an event
 * (src/scripts/contact-form.ts); nothing is sent and no form_start is announced.
 */
const prefillContactForm = (zip: string): void => {
  const form = document.querySelector<HTMLFormElement>('#consult [data-cf]') ?? document.querySelector<HTMLFormElement>('[data-cf]');
  form?.dispatchEvent(new CustomEvent('cf:prefill', { detail: { zip } }));
};

export const initZipChecks = (): void => {
  document.querySelectorAll<HTMLFormElement>('[data-zip-form]').forEach((form) => {
    const configElement = form.querySelector('[data-zip-config]');
    const input = form.querySelector<HTMLInputElement>('input[name="zip"]');
    const result = form.querySelector<HTMLElement>('.zip-result');
    const request = form.querySelector<HTMLButtonElement>('[data-zip-request]');
    if (!configElement?.textContent || !input || !result) return;

    const config = JSON.parse(configElement.textContent) as ZipConfig & { prompt: string };
    /** The ZIP code the visible answer is about; the button carries exactly this one to the form. */
    let checkedZip: string | null = null;

    const showRequest = (zip: string | null): void => {
      checkedZip = zip;
      if (request) request.hidden = !zip;
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = zipAreaStatus(input.value, config);
      if (status === 'invalid') {
        result.innerHTML = config.prompt;
        showRequest(null);
        input.focus();
        return;
      }
      result.innerHTML = config.zipMessages[status];
      showRequest(status === 'inArea' ? normalizeZip(input.value) : null);
    });

    // An answer belongs to the ZIP code that was checked: once the entry changes, the button goes away.
    input.addEventListener('input', () => {
      if (checkedZip && normalizeZip(input.value) !== checkedZip) showRequest(null);
    });

    request?.addEventListener('click', () => {
      if (!checkedZip) return;
      prefillContactForm(checkedZip);
      openConsultForm();
    });
  });
};
