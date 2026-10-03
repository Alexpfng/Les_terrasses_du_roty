import { useEffect } from "react";
import { gsap } from "@/terrasse/lib/gsapSetup";
import { getLenis } from "@/terrasse/lib/lenis";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Cisaillement (skew) léger des grands textes piloté par la VITESSE de scroll —
 * signature « momentum » haut de gamme. Écrit une variable CSS `--vskew` sur
 * <html>, consommée par les éléments `[data-skew]` (cf. global.css). Désactivé
 * en reduced-motion. Une seule instance (montée par App).
 */
export const useScrollVelocity = (): void => {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    let last = window.scrollY;
    let skew = 0;
    const MAX = 1.4; // degrés

    const tick = () => {
      const lenis = getLenis();
      const y = lenis ? lenis.scroll : window.scrollY;
      // vitesse normalisée par frame ; lenis.velocity dispo mais on reste robuste
      const v = y - last;
      last = y;
      const target = gsap.utils.clamp(-MAX, MAX, v * 0.06);
      skew += (target - skew) * 0.18; // lissage + retour à 0 quand v→0
      root.style.setProperty("--vskew", `${skew.toFixed(3)}deg`);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      root.style.setProperty("--vskew", "0deg");
    };
  }, []);
};
