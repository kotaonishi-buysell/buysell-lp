/*
 * Mobile sticky phone bar: visible once the hero has scrolled out of view,
 * hidden again from the final CTA section onwards. The bar is hidden by CSS
 * at 720px and up, so this only matters on small screens.
 */
export const initSticky = (): void => {
  const bar = document.querySelector<HTMLElement>('[data-sticky-cta]');
  const hero = document.querySelector('[data-hero]');
  const final = document.querySelector('[data-final-cta]');
  if (!bar || !hero || !final || !('IntersectionObserver' in window)) return;

  let heroPassed = false;
  let finalReached = false;

  const update = () => {
    bar.dataset.visible = String(heroPassed && !finalReached);
  };

  new IntersectionObserver(([entry]) => {
    heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    update();
  }).observe(hero);

  new IntersectionObserver(([entry]) => {
    finalReached = entry.isIntersecting || entry.boundingClientRect.top < 0;
    update();
  }).observe(final);
};
