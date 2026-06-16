import { useRef, type CSSProperties } from 'react';
import { gsap, useGSAP } from '@/terrasse/lib/gsapSetup';
import { ANIM } from '@/terrasse/lib/animConfig';
import { prefersReducedMotion } from '@/terrasse/hooks/useReducedMotion';

interface SectionTextProps {
  children: string;
  style?: CSSProperties;
}

/**
 * Texte narratif révélé mot à mot au scroll (scrub doux, split maison).
 * Le texte reste du vrai DOM : le <p> garde son contenu pour le SEO,
 * le split en <span> est purement présentationnel.
 */
export const SectionText = ({ children, style }: SectionTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);

  // Révélation mot à mot pilotée au scroll — useGSAP révoque tween + ScrollTrigger
  // automatiquement (et restaure le DOM via la fonction de nettoyage).
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const words = children.split(' ');
      el.textContent = '';
      const spans: HTMLSpanElement[] = [];
      words.forEach((w, i) => {
        const s = document.createElement('span');
        s.textContent = w;
        s.style.display = 'inline-block';
        s.style.opacity = String(ANIM.split.fromOpacity);
        s.style.clipPath = 'inset(0 100% 0 0)';
        el.appendChild(s);
        spans.push(s);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
      // chaque mot se « remplit » (clip-path) en plus du fondu — sensation premium
      gsap.to(spans, {
        opacity: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.5,
        ease: 'power2.out',
        stagger: ANIM.split.stagger,
        scrollTrigger: { trigger: el, start: ANIM.split.start, end: ANIM.split.end, scrub: true },
      });
      return () => {
        el.textContent = children;
      };
    },
    { scope: ref, dependencies: [children] },
  );

  return (
    <p
      ref={ref}
      className="display"
      data-skew="1"
      style={{
        margin: 0,
        fontSize: 'var(--fs-acte)',
        lineHeight: 1.22,
        color: 'var(--ltdr-ivory)',
        ...style,
      }}
    >
      {children}
    </p>
  );
};
