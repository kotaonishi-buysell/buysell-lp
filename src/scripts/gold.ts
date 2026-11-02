/*
 * Behaviour of the Gold LP (/gold), ported from the designer's static page (Reworth_LP_金_案2_2026-11-01).
 * The shared scripts (main.ts) handle the phone and "free appraisal" buttons, the FAQ events and the contact form.
 * Here: the desktop zoom, the comparison tabs, the carousels (buttons, dots, slow auto-advance), the pause of
 * off-screen animations, the mobile sticky bar and the menu.
 */

const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** On wide screens the whole page is scaled up a little (--pc-zoom, read by gold.css). */
const initZoom = (): void => {
  const zoom = (): void => {
    const root = document.documentElement;
    if (innerWidth < 1024) {
      root.style.removeProperty('--pc-zoom');
      return;
    }
    const z = Math.min(1.6, Math.max(1, innerWidth / 940));
    root.style.setProperty('--pc-zoom', z.toFixed(2));
  };
  zoom();
  addEventListener('resize', zoom);
};

/** "Reworth vs. pawn or gold shop / mail-in buyer": a tablist with arrow-key support. */
const initTabs = (): void => {
  const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
  const select = (tab: HTMLElement): void => {
    tabs.forEach((other) => {
      const on = other === tab;
      other.setAttribute('aria-selected', String(on));
      other.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(other.getAttribute('aria-controls') ?? '');
      if (panel) panel.hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const next = tabs[(i + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next);
      next.focus();
    });
  });
};

/** Horizontal scroll-snap carousels: previous/next buttons, slow auto-advance while visible, and optional dots. */
const initCarousels = (): void => {
  document.querySelectorAll<HTMLElement>('.car').forEach((car) => {
    const viewport = car.querySelector<HTMLElement>('.car-vp');
    if (!viewport) return;
    const buttons = car.querySelectorAll<HTMLButtonElement>('.car-nav button');
    const step = (): number => {
      const first = viewport.children[0];
      return first ? first.getBoundingClientRect().width + 12 : 300;
    };
    const update = (): void => {
      const max = viewport.scrollWidth - viewport.clientWidth - 2;
      if (buttons[0]) buttons[0].disabled = viewport.scrollLeft <= 2;
      if (buttons[1]) buttons[1].disabled = viewport.scrollLeft >= max;
    };

    let timer: number | null = null;
    let touched = false;
    let seen = false;
    const interval = Number(car.dataset.auto) || 0;
    const halt = (): void => {
      if (timer !== null) clearInterval(timer);
      timer = null;
    };
    const stop = (): void => {
      touched = true;
      halt();
    };
    const run = (): void => {
      if (!interval || reduceMotion || touched || !seen || timer !== null) return;
      timer = window.setInterval(() => {
        const max = viewport.scrollWidth - viewport.clientWidth - 2;
        viewport.scrollTo({ left: viewport.scrollLeft >= max ? 0 : viewport.scrollLeft + step(), behavior: 'smooth' });
      }, interval);
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        stop();
        viewport.scrollBy({ left: step() * Number(button.dataset.dir), behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
    viewport.addEventListener('scroll', update, { passive: true });
    update();

    (['pointerdown', 'touchstart', 'wheel', 'focusin'] as const).forEach((name) =>
      viewport.addEventListener(name, stop, { passive: true }),
    );
    car.addEventListener('mouseenter', halt);
    car.addEventListener('mouseleave', run);
    if (interval && 'IntersectionObserver' in window) {
      new IntersectionObserver(
        ([entry]) => {
          seen = entry.isIntersecting;
          if (seen) run();
          else halt();
        },
        { threshold: 0.5 },
      ).observe(car);
    }

    // Dots under the carousel.
    const dotBox = car.querySelector<HTMLElement>('.dots');
    if (car.hasAttribute('data-dots') && dotBox) {
      const cards = Array.from(viewport.children) as HTMLElement[];
      const dots = cards.map((card, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to ${i + 1}`);
        dot.innerHTML = '<i></i>';
        dot.addEventListener('click', () => {
          stop();
          viewport.scrollTo({ left: card.offsetLeft - viewport.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        dotBox.appendChild(dot);
        return dot;
      });
      const markCurrent = (): void => {
        let best = 0;
        let bestDistance = Infinity;
        cards.forEach((card, i) => {
          const distance = Math.abs(card.offsetLeft - viewport.offsetLeft - viewport.scrollLeft);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        });
        dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === best)));
      };
      viewport.addEventListener('scroll', markCurrent, { passive: true });
      markCurrent();
    }
  });
};

/** The item marquee and the four-step animation run only while they are on screen. */
const initPausedAnimations = (): void => {
  if (!('IntersectionObserver' in window)) return;
  document.querySelectorAll<HTMLElement>('.mq, .fm').forEach((el) => {
    new IntersectionObserver(([entry]) => el.classList.toggle('paused', !entry.isIntersecting), { threshold: 0 }).observe(el);
  });
};

/** The mobile bar (appraisal + phone) hides while the hero's buttons or the final request section are on screen. */
const initStickyBar = (): void => {
  const callBox = document.querySelector('.lp-callbox');
  const book = document.querySelector('#book');
  const bar = document.querySelector<HTMLElement>('.sticky');
  if (!callBox || !bar || !('IntersectionObserver' in window)) return;
  const visible: Element[] = [];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const i = visible.indexOf(entry.target);
      if (entry.isIntersecting) {
        if (i < 0) visible.push(entry.target);
      } else if (i >= 0) {
        visible.splice(i, 1);
      }
    });
    bar.classList.toggle('hide', visible.length > 0);
  });
  observer.observe(callBox);
  if (book) observer.observe(book);
};

/** The small-screen menu. */
const initMenu = (): void => {
  const button = document.querySelector<HTMLElement>('.hd-menu');
  const drawer = document.getElementById('drawer');
  if (!button || !drawer) return;
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    drawer.hidden = !open;
  });
  drawer.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      button.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
    }
  });
};

initZoom();
initTabs();
initCarousels();
initPausedAnimations();
initStickyBar();
initMenu();
