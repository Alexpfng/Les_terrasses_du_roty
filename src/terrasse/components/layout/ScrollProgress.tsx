import { useRef } from 'react';
import { gsap, useGSAP } from '@/terrasse/lib/gsapSetup';
import { useLtdrStore } from '@/terrasse/lib/store';

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

/** Indicateur latéral fixe « Terrasse I → VII » selon l'acte actif. */
export const ScrollProgress = () => {
  const activeAct = useLtdrStore((s) => s.activeAct);
  const ready = useLtdrStore((s) => s.ready);
  const ageOk = useLtdrStore((s) => s.ageOk);
  const ref = useRef<HTMLDivElement>(null);

  // apparition propre, nettoyage auto via useGSAP
  useGSAP(
    () => {
      if (ready && ageOk && ref.current) {
        gsap.to(ref.current, { autoAlpha: 1, duration: 1, ease: 'power2.out', delay: 0.35 });
      }
    },
    { dependencies: [ready, ageOk] },
  );

  return (
    <div
      ref={ref}
      className="terrasse-indicator"
      aria-hidden="true"
      style={{
        position: 'fixed',
        right: 'clamp(16px, 2.4vw, 36px)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 989,
        display: 'grid',
        gap: 14,
        opacity: 0,
        visibility: 'hidden',
      }}
    >
      {NUMERALS.map((n, i) => {
        const on = activeAct === i + 1;
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <span
              className="display"
              style={{ fontSize: 13, color: 'var(--ltdr-gold)', opacity: on ? 1 : 0.25, transition: 'opacity .4s' }}
            >
              {n}
            </span>
            <span
              style={{
                display: 'block',
                width: on ? 30 : 18,
                height: 1,
                background: 'var(--ltdr-gold)',
                opacity: on ? 1 : 0.25,
                transition: 'opacity .4s, width .4s',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
