/*
 * Silver LP behaviour: the category ribbon, scroll reveals, FAQ animation, appraiser
 * arrows and dialog closing. Ported from the Codex mock-up's app.js (logic unchanged).
 * What the mock-up did for calls, booking, the form, the ZIP box and the policy links is
 * shared now: scripts/cta.ts, contact-form.ts, zip-check.ts and real links.
 */
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

// ---------- dialogs ----------
const initDialogs = (): void => {
  document.querySelectorAll<HTMLElement>('[data-close]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });
  // A click on the backdrop lands on the <dialog> itself, outside its box.
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        dialog.close();
      }
    });
  });
};

// ---------- category ribbon ----------
// Keep touch/wheel scrolling native; loop only at visually identical boundaries.
const initCategoryRibbon = (): void => {
  const viewport = document.querySelector<HTMLElement>('.category-viewport');
  const track = viewport?.querySelector<HTMLElement>('.category-track');
  const group = track?.querySelector<HTMLElement>('.category-group');
  const motionButton = document.querySelector<HTMLButtonElement>('.category-motion');
  if (!viewport || !track || !group || !motionButton) return;

  for (const side of ['before', 'after']) {
    const copy = group.cloneNode(true) as HTMLElement;
    copy.setAttribute('aria-hidden', 'true');
    if (side === 'before') track.prepend(copy);
    else track.append(copy);
  }

  let cycle = 0;
  let paused = reducedMotionQuery.matches;
  let hovering = false;
  let touching = false;
  let focused = false;
  let visible = false;
  let resumeAt = 0;
  let lastTime = 0;
  let distance = 0;
  let drag: { x: number; scroll: number } | null = null;

  const updateButton = () => {
    motionButton.setAttribute('aria-label', paused ? 'Play automatic scrolling' : 'Pause automatic scrolling');
    const label = motionButton.querySelector('.motion-label');
    const symbol = motionButton.querySelector('.motion-symbol');
    if (label) label.textContent = paused ? 'Play' : 'Pause';
    if (symbol) symbol.textContent = paused ? '▷' : 'Ⅱ';
  };

  const measure = () => {
    const item = group.firstElementChild;
    if (!item) return;
    const gap = parseFloat(getComputedStyle(track).gap);
    cycle = group.getBoundingClientRect().width + gap;
    const itemWidth = item.getBoundingClientRect().width;
    const offset = window.matchMedia('(max-width:760px)').matches
      ? itemWidth + gap - (viewport.clientWidth - itemWidth) / 2
      : 0;
    viewport.scrollLeft = cycle + offset;
    distance = 0;
  };

  const normalize = () => {
    if (!cycle) return;
    if (viewport.scrollLeft >= cycle * 2) viewport.scrollLeft -= cycle;
    else if (viewport.scrollLeft < cycle * 0.5) viewport.scrollLeft += cycle;
  };

  motionButton.addEventListener('click', () => {
    paused = !paused;
    updateButton();
  });
  reducedMotionQuery.addEventListener('change', () => {
    paused = reducedMotionQuery.matches;
    updateButton();
  });
  viewport.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') hovering = true;
  });
  viewport.addEventListener('pointerleave', () => {
    hovering = false;
  });
  viewport.addEventListener('focus', () => {
    focused = viewport.matches(':focus-visible');
  });
  viewport.addEventListener('blur', () => {
    focused = false;
  });
  viewport.addEventListener(
    'wheel',
    () => {
      resumeAt = performance.now() + 4000;
    },
    { passive: true },
  );
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      focused = true;
      event.preventDefault();
      viewport.scrollLeft += (event.key === 'ArrowRight' ? 1 : -1) * (cycle / 6);
      normalize();
    }
  });
  viewport.addEventListener('pointerdown', (event) => {
    focused = false;
    touching = true;
    if (event.pointerType === 'mouse' && event.button === 0) {
      drag = { x: event.clientX, scroll: viewport.scrollLeft };
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    }
  });
  viewport.addEventListener('pointermove', (event) => {
    if (drag) viewport.scrollLeft = drag.scroll + drag.x - event.clientX;
  });
  const release = () => {
    touching = false;
    drag = null;
    resumeAt = performance.now() + 4000;
    viewport.classList.remove('is-dragging');
  };
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('lostpointercapture', release);

  new ResizeObserver(measure).observe(viewport);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  }).observe(viewport);

  const animate = (time: number) => {
    const elapsed = Math.min(time - lastTime, 50);
    lastTime = time;
    if (!touching && time > resumeAt) normalize();
    if (visible && !document.hidden && !paused && !hovering && !touching && !focused && time > resumeAt) {
      distance += elapsed * 0.018; // 18 CSS pixels per second, right to left.
      if (distance >= 1) {
        const pixels = Math.floor(distance);
        viewport.scrollLeft += pixels;
        distance -= pixels;
        normalize();
      }
    }
    requestAnimationFrame(animate);
  };
  updateButton();
  measure();
  requestAnimationFrame(animate);
};

// ---------- scroll reveals ----------
const initReveals = (): void => {
  if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-pending');
    observer.observe(element);
  });
};

// ---------- editorial motion layer ----------
// Content stays fully visible when JavaScript is unavailable or when the visitor has
// asked for reduced motion.
const initMotion = (): void => {
  if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) return;

  const root = document.documentElement;
  root.classList.add('motion-ready');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.add('motion-started'));
  });

  const motionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-motion-pending');
        entry.target.classList.add('is-motion-visible');
        motionObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
  );

  const stage = (element: HTMLElement | null, delay = 0, kind = 'rise') => {
    if (!element) return;
    element.classList.add('motion-item', `motion-${kind}`);
    element.style.setProperty('--motion-delay', `${delay}ms`);
    if (element.getBoundingClientRect().top > window.innerHeight * 0.88) {
      element.classList.add('is-motion-pending');
    }
    motionObserver.observe(element);
  };

  const stageAll = (selector: string, step = 80, kind = 'rise', start = 0) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
      stage(element, start + index * step, kind);
    });
  };

  const heroPhoto = document.querySelector<HTMLElement>('.hero-photo');
  stage(heroPhoto, 120, 'hero-photo');
  if (heroPhoto && window.innerWidth <= 760 && heroPhoto.getBoundingClientRect().top > window.innerHeight * 0.55) {
    heroPhoto.classList.add('is-motion-pending');
  }

  // Section introductions: label, headline, then supporting copy.
  stageAll('#silver .category-heading > *, #silver .polish', 85);
  stageAll('.how .section-top, .how > .wrap > h2', 100);
  stageAll('.value-copy > .eyebrow, .value-copy > h2, .value-copy > p, .value-copy > .price', 90);
  stage(document.querySelector<HTMLElement>('.value-image'), 130, 'mask-left');
  stage(document.querySelector<HTMLElement>('.value-copy .formula'), 180, 'formula');
  stageAll('.benefits > div:first-child > *', 85);
  stageAll('.benefit-list article', 75, 'benefit');
  stageAll('.people .section-top, .people-heading > *', 90);
  stageAll('.appraisers article', 110, 'portrait');
  stageAll('.voices-heading > *', 85);
  stageAll('.voices article', 105, 'testimonial');
  stageAll('.comparison > .eyebrow, .comparison > .section-top', 90);
  stageAll('.comparison tbody tr', 55, 'row');
  stageAll('.areas-grid > *', 90);
  stageAll('.about > .eyebrow, .about > h2, .about-bottom > *', 90);
  stageAll('.faq-intro > *', 85);
  stageAll('.final-cta .wrap > *', 110);

  stage(document.querySelector<HTMLElement>('.comparison table'), 80, 'table');

  // A restrained vertical drift gives the hero photograph depth while it is in view.
  if (heroPhoto) {
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = heroPhoto.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const range = window.innerWidth <= 760 ? 5 : 10;
      const shift = Math.max(-range, Math.min(range, (progress - 0.5) * range * 2));
      heroPhoto.style.setProperty('--hero-shift', `${shift.toFixed(2)}px`);
    };
    const requestUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
  }

  // One gentle scroll cue on mobile says that more content sits off-canvas.
  const nudgeScroller = (scroller: HTMLElement | null, distance = 12) => {
    if (!scroller) return;
    let interacted = false;
    let played = false;
    const stop = () => {
      interacted = true;
    };
    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((eventName) => {
      scroller.addEventListener(eventName, stop, { passive: true, once: true });
    });
    const nudgeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played || interacted || window.innerWidth > 760) return;
          played = true;
          nudgeObserver.disconnect();
          const started = performance.now();
          const duration = 1050;
          const animate = (now: number) => {
            if (interacted) return;
            const progress = Math.min(1, (now - started) / duration);
            scroller.scrollLeft = Math.sin(progress * Math.PI) * distance;
            if (progress < 1) requestAnimationFrame(animate);
            else scroller.scrollLeft = 0;
          };
          window.setTimeout(() => requestAnimationFrame(animate), 350);
        });
      },
      { threshold: 0.45 },
    );
    nudgeObserver.observe(scroller);
  };
  nudgeScroller(document.querySelector<HTMLElement>('.table-scroll'), 16);

  // Native details remain semantic; only the open and close transition is enhanced.
  document.querySelectorAll<HTMLDetailsElement>('.faq-list details').forEach((details) => {
    const summary = details.querySelector('summary');
    const answer = details.querySelector('p');
    if (!summary || !answer) return;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (details.dataset.animating === 'true') return;
      details.dataset.animating = 'true';

      if (details.open) {
        const animation = answer.animate(
          [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-6px)' },
          ],
          { duration: 190, easing: 'ease-out' },
        );
        animation.finished.finally(() => {
          details.open = false;
          details.dataset.animating = 'false';
        });
      } else {
        details.open = true;
        const animation = answer.animate(
          [
            { opacity: 0, transform: 'translateY(-6px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 280, easing: 'cubic-bezier(.2,.75,.2,1)' },
        );
        animation.finished.finally(() => {
          details.dataset.animating = 'false';
        });
      }
    });
  });
};

// ---------- appraiser carousel (mobile) ----------
// Buttons appear only when more content remains in their direction; touch scrolling stays native.
const initAppraiserArrows = (): void => {
  const scroller = document.querySelector<HTMLElement>('.appraisers');
  const previous = document.querySelector<HTMLButtonElement>('.profile-arrow-prev');
  const next = document.querySelector<HTMLButtonElement>('.profile-arrow-next');
  if (!scroller || !previous || !next) return;

  const updateArrows = () => {
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    previous.hidden = !mobile || scroller.scrollLeft <= 3;
    next.hidden = !mobile || scroller.scrollLeft >= maxScroll - 3;
  };

  const move = (direction: number) => {
    const firstCard = scroller.querySelector('article');
    if (!firstCard) return;
    const gap = parseFloat(getComputedStyle(scroller).columnGap) || 0;
    scroller.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  scroller.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows, { passive: true });
  new ResizeObserver(updateArrows).observe(scroller);
  updateArrows();
};

initDialogs();
initCategoryRibbon();
initReveals();
initMotion();
initAppraiserArrows();
