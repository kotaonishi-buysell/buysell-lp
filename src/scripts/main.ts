import { track } from './analytics';
import { initContactForms } from './contact-form';
import { initCtas } from './cta';
import { initFaq } from './faq';
import { initSticky } from './sticky';
import { initZipChecks } from './zip-check';

initCtas();
initFaq();
initSticky();
initContactForms();
initZipChecks();

// The shared contact form announces what happened; this LP reports it to the dataLayer.
document.addEventListener('cf:event', (event) => {
  const { name, lp } = (event as CustomEvent<{ name: string; lp: string }>).detail;
  if (name === 'start') track('form_start', { lp });
  if (name === 'submit') track('form_submit', { lp });
});
