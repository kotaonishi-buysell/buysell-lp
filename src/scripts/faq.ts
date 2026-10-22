import { track } from './analytics';

export const initFaq = (): void => {
  document.querySelectorAll<HTMLDetailsElement>('details[data-faq-id]').forEach((details) => {
    details.querySelector('summary')?.addEventListener('click', () => {
      // The click runs before the toggle, so a closed item is about to open.
      if (!details.open) track('faq_open', { question_id: details.dataset.faqId });
    });
  });
};
