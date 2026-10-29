/* The opt-out control on the Do Not Sell or Share page (components/PrivacyChoice.astro). */
import { clearTrackingCookies, gpcOn, optedOut, setOptOut } from '../lib/privacy-choice';

export function initPrivacyChoice(): void {
  const root = document.querySelector<HTMLElement>('[data-privacy-choice]');
  if (!root) return;
  const status = root.querySelector<HTMLElement>('[data-choice-status]')!;
  const button = root.querySelector<HTMLButtonElement>('[data-choice-button]')!;
  const copy = JSON.parse(root.dataset.copy ?? '{}') as Record<string, string>;

  let storage: Storage | null = null;
  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }

  const render = (): void => {
    if (gpcOn(navigator)) {
      status.textContent = copy.gpc;
      button.hidden = true;
      return;
    }
    const off = optedOut(storage);
    status.textContent = off ? copy.off : copy.on;
    button.textContent = off ? copy.turnOn : copy.optOut;
    button.setAttribute('aria-pressed', String(off));
    button.hidden = false;
  };

  button.addEventListener('click', () => {
    const next = !optedOut(storage);
    setOptOut(storage, next);
    if (next) clearTrackingCookies(document, window.location.hostname);
    render();
    status.focus();
  });

  if (!storage) copy.on = copy.noStorage ?? copy.on;
  render();
}
