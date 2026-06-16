import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/terrasse/lib/gsapSetup';
import { ANIM } from '@/terrasse/lib/animConfig';
import { prefersReducedMotion } from '@/terrasse/hooks/useReducedMotion';

interface CounterProps {
  value: number;
  suffix?: string;
  label: string;
}

/** Compteur animé une seule fois à l'entrée dans le viewport. */
export const Counter = ({ value, suffix = '', label }: CounterProps) => {
  const numRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = numRef.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.textContent = `${value}${suffix}`;
        return;
      }
      ScrollTrigger.create({
        trigger: el,
        start: ANIM.counter.start,
        once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, {
            v: value,
            duration: ANIM.counter.duration,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = `${Math.round(o.v)}${suffix}`;
            },
          });
        },
      });
    },
    { dependencies: [value, suffix] },
  );

  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 14 }}>
      <span
        ref={numRef}
        className="display"
        style={{ fontWeight: 300, fontSize: 'var(--fs-counter)', lineHeight: 1, color: 'var(--ltdr-gold)' }}
      >
        {`${value}${suffix}`}
      </span>
      <span
        style={{
          fontSize: 10,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--ltdr-ivory-55)',
          textAlign: 'center',
        }}
      >
        {label}
      </span>
    </div>
  );
};
