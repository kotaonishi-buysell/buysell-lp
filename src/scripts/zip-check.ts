/* Behaviour of the service-area ZIP box (src/components/ZipCheck.astro). */
import { zipAreaMessage, type ZipConfig } from '../lib/zip-area';

export const initZipChecks = (): void => {
  document.querySelectorAll<HTMLFormElement>('[data-zip-form]').forEach((form) => {
    const configElement = form.querySelector('[data-zip-config]');
    const input = form.querySelector<HTMLInputElement>('input[name="zip"]');
    const result = form.querySelector<HTMLElement>('.zip-result');
    if (!configElement?.textContent || !input || !result) return;

    const config = JSON.parse(configElement.textContent) as ZipConfig & { prompt: string };
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = zipAreaMessage(input.value, config);
      result.innerHTML = message || config.prompt;
      if (!message) input.focus();
    });
  });
};
