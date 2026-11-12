/* The opt-out control on the Do Not Sell or Share page (components/PrivacyChoice.astro). */
import { clearTrackingCookies, clearTrackingStorage, gpcOn, optedOut, setOptOut } from '../lib/privacy-choice';

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

  /** Removes what the tools stored in this browser: their cookies and local-storage keys (such as _gcl_ls). */
  const clearTracking = (): void => {
    clearTrackingCookies(document, window.location.hostname);
    clearTrackingStorage(storage);
  };

  // Someone who already opted out, or sends Global Privacy Control, should not keep what a tool stored earlier.
  if (gpcOn(navigator) || optedOut(storage)) clearTracking();

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
    if (next) clearTracking();
    render();
    status.focus();
  });

  if (!storage) copy.on = copy.noStorage ?? copy.on;
  render();
}
