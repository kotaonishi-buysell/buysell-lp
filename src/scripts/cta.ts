import { track } from './analytics';

/** Scrolls to the request form and focuses its first field (or the thank-you message once sent). */
export const openConsultForm = (): void => {
  const panel = document.getElementById('consult');
  if (!panel) return;

  const success = panel.querySelector<HTMLElement>('[data-form-success]');
  const target =
    success && !success.hidden
      ? success
      : panel.querySelector<HTMLElement>('input:not([type="hidden"]), select, textarea');

  panel.scrollIntoView({ block: 'start' });
  target?.focus({ preventScroll: true });
};

export const initCtas = (): void => {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const cta = event.target.closest<HTMLElement>('[data-cta]');
    if (cta) {
      track('cta_click', { location: cta.dataset.cta, method: cta.dataset.ctaMethod });
    }

    if (event.target.closest('[data-booking]')) {
      event.preventDefault();
      openConsultForm();
    }
  });
};
