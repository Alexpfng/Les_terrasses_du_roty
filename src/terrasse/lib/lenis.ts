import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsapSetup';
import { ANIM } from './animConfig';

let lenis: Lenis | null = null;

/** Initialise le smooth scroll (désactivé en reduced-motion et au tactile). */
export const initLenis = (): Lenis | null => {
  if (lenis) return lenis;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(pointer: coarse)').matches;
  if (reduced || touch) return null;
  lenis = new Lenis({ duration: ANIM.lenis.duration, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => {
    lenis?.raf(t * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  return lenis;
};

export const getLenis = (): Lenis | null => lenis;

export const scrollLock = (locked: boolean): void => {
  if (locked) {
    lenis?.stop();
    document.documentElement.setAttribute('data-locked', '');
  } else {
    lenis?.start();
    document.documentElement.removeAttribute('data-locked');
  }
};

export const scrollToSection = (selector: string): void => {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: ANIM.lenis.scrollToDuration });
  } else {
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY,
      behavior: 'smooth',
    });
  }
};
