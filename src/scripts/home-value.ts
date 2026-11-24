import { initContactForms } from './contact-form';
import type { DeliveryCategory } from '../lib/contact-form';

type EventName = 'phone_click' | 'visit_request_open' | 'visit_request_submit' | 'visit_request_error';
export function measure(enabled: boolean, event: EventName, category?: DeliveryCategory): void {
  if (!enabled) return;
  // Local, allowlisted payload only. No external tracker, form data or query string.
  window.dispatchEvent(new CustomEvent('buysell:measurement', {
    detail: { event, lp: 'home-value', ...(category ? { category } : {}) },
  }));
}

function initHomeValue(): void {
  const configNode = document.querySelector('[data-hv-config]');
  const enabled = configNode?.textContent ? (JSON.parse(configNode.textContent) as { measurementEnabled: boolean }).measurementEnabled : false;

  document.querySelectorAll<HTMLAnchorElement>('[data-visit-open]').forEach((link) => {
    link.addEventListener('click', () => {
      measure(enabled, 'visit_request_open');
      document.querySelector<HTMLElement>('#visit-title')?.focus({ preventScroll: true });
    });
  });
  document.querySelectorAll('[data-phone-call]').forEach((link) => {
    link.addEventListener('click', () => measure(enabled, 'phone_click'));
  });

  // The shared contact form announces what happened; only an acknowledged request counts as a submit.
  document.addEventListener('cf:event', (event) => {
    const { name, category } = (event as CustomEvent<{ name: string; category?: DeliveryCategory }>).detail;
    if (name === 'submit') measure(enabled, 'visit_request_submit');
    if (name === 'error') measure(enabled, 'visit_request_error', category ?? 'network');
  });

  initStickyBar();
  initContactForms();
}

// The phone bar shows once the hero has scrolled away and hides while the request form section is on screen.
function initStickyBar(): void {
  const bar = document.querySelector<HTMLElement>('[data-hv-sticky]');
  const hero = document.querySelector('#top');
  const end = document.querySelector('#get-started');
  if (!bar || !hero || !end || !('IntersectionObserver' in window)) return;
  let heroInView = true;
  let endInView = false;
  const update = () => { bar.dataset.visible = String(!heroInView && !endInView); };
  new IntersectionObserver((entries) => { heroInView = entries[entries.length - 1].isIntersecting; update(); }).observe(hero);
  new IntersectionObserver((entries) => { endInView = entries[entries.length - 1].isIntersecting; update(); }).observe(end);
}
initHomeValue();
