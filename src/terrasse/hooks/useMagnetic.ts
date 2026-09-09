import { useEffect, useRef } from "react";
import { gsap } from "@/terrasse/lib/gsapSetup";
import { prefersReducedMotion } from "./useReducedMotion";

/**
 * Bouton magnétique : l'élément suit légèrement le curseur quand il s'en
 * approche, créant une attraction tactile « premium ». Désactivé au tactile
 * et en reduced-motion.
 */
export const useMagnetic = <T extends HTMLElement>(strength = 0.35, radius = 90) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius + Math.max(r.width, r.height) / 2) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, radius]);

  return ref;
};
