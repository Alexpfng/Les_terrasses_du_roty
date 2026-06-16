/**
 * Pilote de frames DEV uniquement (jamais inclus en prod, voir main.tsx).
 * Les environnements de test headless gardent l'onglet `hidden` : rAF ne tire
 * plus, GSAP et R3F gèlent. Ce module expose de quoi avancer le temps et le
 * scroll de façon déterministe pour vérifier les scènes hors navigateur réel.
 */
import { gsap, ScrollTrigger } from './gsapSetup';
import { advance } from '@react-three/fiber';
import { getLenis } from './lenis';

declare global {
  interface Window {
    __ltdr?: {
      tick: (frames?: number) => void;
      advance: () => void;
      refresh: () => void;
      scrollTo: (y: number) => void;
    };
  }
}

export const installDevDriver = (): void => {
  let detached = false;
  let synthetic = 0;
  window.__ltdr = {
    /** avance l'horloge GSAP de `frames` pas de 16,7 ms (temps synthétique) */
    tick: (frames = 1) => {
      if (!detached) {
        gsap.ticker.remove(gsap.updateRoot);
        synthetic = gsap.ticker.time;
        detached = true;
      }
      const step = 1 / 60;
      for (let i = 0; i < frames; i++) {
        synthetic += step;
        gsap.updateRoot(synthetic);
      }
    },
    /** force un rendu R3F immédiat */
    advance: () => advance(performance.now(), true),
    refresh: () => ScrollTrigger.refresh(),
    /** positionne le scroll en pilotant Lenis (sinon ScrollTrigger ignore window.scrollTo) */
    scrollTo: (y: number) => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
      ScrollTrigger.update();
    },
  };
};
