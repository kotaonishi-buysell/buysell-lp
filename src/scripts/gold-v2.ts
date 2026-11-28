/*
 * Behaviour of the second Gold LP (/gold-v2): the menu drawer, the previous/next buttons of the "what we buy" carousel,
 * and the sticky bar at the bottom (the bar and the carousel buttons are mobile only; from 960px up the layout is rearranged in CSS). The shared scripts (main.ts) handle the phone and "free appraisal" buttons, the FAQ
 * events and the contact form. Nothing moves by itself: there is no auto-advance and no animation to pause.
 */

// Makes this file a module, so its helper names do not clash with the other LPs' scripts (gold.ts has the same ones).
export {};

const initMenu = (): void => {
  const button = document.querySelector<HTMLElement>('.g2-menu');
  const drawer = document.getElementById('g2-drawer');
  if (!button || !drawer) return;
  const close = (): void => {
    button.setAttribute('aria-expanded', 'false');
    drawer.hidden = true;
  };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    drawer.hidden = !open;
  });
  drawer.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !drawer.hidden) {
      close();
      button.focus();
    }
  });
};

/** Horizontal scroll-snap carousel: the buttons move by one card and are disabled at the ends. */
const initCarousel = (): void => {
  document.querySelectorAll<HTMLElement>('.g2-car').forEach((car) => {
    const viewport = car.querySelector<HTMLElement>('.g2-car-vp');
    const buttons = car.querySelectorAll<HTMLButtonElement>('.g2-car-nav button');
    if (!viewport) return;
    const step = (): number => {
      const first = viewport.children[0];
      return first ? first.getBoundingClientRect().width + 16 : 240;
    };
    const update = (): void => {
      const max = viewport.scrollWidth - viewport.clientWidth - 2;
      if (buttons[0]) buttons[0].disabled = viewport.scrollLeft <= 2;
      if (buttons[1]) buttons[1].disabled = viewport.scrollLeft >= max;
    };
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const direction = Number(button.dataset.dir ?? '1');
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        viewport.scrollBy({ left: direction * step(), behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    viewport.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
    // On wide screens (gold-v2.css, 960px and up) the cards are a grid and nothing scrolls: the box is then not a keyboard stop.
    const wide = window.matchMedia?.('(min-width: 960px)');
    const sync = (): void => {
      if (wide?.matches) viewport.removeAttribute('tabindex');
      else viewport.setAttribute('tabindex', '0');
    };
    wide?.addEventListener('change', sync);
    sync();
  });
};

/** The bar is hidden while the hero's own buttons or the request form are on screen, and shown otherwise. */
const initStickyBar = (): void => {
  const bar = document.querySelector<HTMLElement>('.g2-sticky');
  const callBox = document.querySelector('.g2-callbox');
  const form = document.querySelector('#book');
  if (!bar || !callBox || !form || !('IntersectionObserver' in window)) return;
  let heroVisible = true;
  let formVisible = false;
  const update = (): void => {
    bar.dataset.hide = String(heroVisible || formVisible);
  };
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    update();
  }).observe(callBox);
  new IntersectionObserver(([entry]) => {
    formVisible = entry.isIntersecting;
    update();
  }).observe(form);
};

initMenu();
initCarousel();
initStickyBar();
