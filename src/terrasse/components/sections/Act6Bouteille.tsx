import { useEffect, useRef } from 'react';
import { ScrollTrigger, useGSAP } from '@/terrasse/lib/gsapSetup';
import { ANIM } from '@/terrasse/lib/animConfig';
import { progressState, smoothstep } from '@/terrasse/lib/progress';
import { useScrollScene } from '@/terrasse/hooks/useScrollScene';
import { prefersReducedMotion } from '@/terrasse/hooks/useReducedMotion';
import { useLtdrStore } from '@/terrasse/lib/store';
import { Pic } from '@/terrasse/components/ui/Pic';
import { PHOTOS } from '@/terrasse/lib/assets';

const captions = [
  {
    pos: { left: 'clamp(24px, 8vw, 130px)', top: '38%' },
    main: 'Cuvée 2024',
    mainSize: 'clamp(34px, 4vw, 58px)',
    sub: 'Syrah 100 %',
    align: 'left' as const,
  },
  { pos: { right: 'clamp(24px, 8vw, 130px)', top: '42%' }, main: 'Récoltée à la main.', align: 'right' as const },
  { pos: { left: 'clamp(24px, 8vw, 130px)', top: '46%' }, main: 'Vinifiée et mise en bouteille à la propriété.', align: 'left' as const },
  {
    pos: { right: 'clamp(24px, 8vw, 130px)', top: '44%' },
    main: 'Édition limitée.',
    sub: '25 € — Précommande',
    align: 'right' as const,
  },
];

/**
 * Acte VI — La bouteille. Climax 3D : silhouette → lumière → étiquette → orbite,
 * puis rotation libre au drag (Y uniquement) une fois la séquence finie.
 * Tier low / reduced-motion : rendu statique (photo réelle de la bouteille).
 */
export const Act6Bouteille = () => {
  const ref = useRef<HTMLElement>(null);
  const capRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragHintRef = useRef<HTMLDivElement>(null);
  const dragLayerRef = useRef<HTMLDivElement>(null);
  const tier = useLtdrStore((s) => s.tier);
  const reduced = prefersReducedMotion();
  const fallback = tier === 'low' || reduced;
  useScrollScene(ref, 6, fallback ? undefined : 'showBottle', 540); // pin bouteille 360%

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || fallback) return;
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: `+=${ANIM.bottle.pinLength}`,
        pin: true,
        anticipatePin: 1,
        scrub: true,
        refreshPriority: 1, // recalcule son spacer avant le trigger de thème du header (Acte VII)
        onUpdate: (self) => {
          const p = self.progress;
          progressState.bottle = p;
          ANIM.bottle.captions.forEach((c, i) => {
            const el = capRefs.current[i];
            if (!el) return;
            const o = smoothstep(c.at, c.at + 0.05, p) * (1 - smoothstep(c.out - 0.05, c.out, p));
            el.style.opacity = o.toFixed(3);
            el.style.transform = `translateY(${((1 - o) * 16).toFixed(1)}px)`;
          });
          const hintOn = smoothstep(ANIM.bottle.dragHintAt, ANIM.bottle.dragHintAt + 0.1, p);
          if (dragHintRef.current) dragHintRef.current.style.opacity = (hintOn * 0.9).toFixed(3);
          if (dragLayerRef.current) dragLayerRef.current.style.pointerEvents = hintOn > 0.5 ? 'auto' : 'none';
        },
      });
    },
    { scope: ref, dependencies: [fallback] },
  );

  // drag → rotation Y libre (axe unique), avec inertie au relâchement (sans GSAP → useEffect)
  useEffect(() => {
    const layer = dragLayerRef.current;
    if (!layer || fallback) return;
    let dragging = false;
    let lastX = 0;
    let velocity = 0; // rad/frame estimés
    let raf = 0;

    const decay = () => {
      if (Math.abs(velocity) < 0.0002) {
        velocity = 0;
        return;
      }
      progressState.bottleUserRot += velocity;
      velocity *= 0.94; // friction
      raf = requestAnimationFrame(decay);
    };
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      cancelAnimationFrame(raf);
      layer.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const delta = (e.clientX - lastX) * 0.011;
      progressState.bottleUserRot += delta;
      velocity = delta; // dernière vitesse échantillonnée
      lastX = e.clientX;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      layer.style.cursor = 'grab';
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(decay); // glisse inertielle
    };
    layer.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      layer.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [fallback]);

  return (
    <section
      ref={ref}
      id="acte-6"
      aria-label="Acte VI — La bouteille"
      style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: fallback ? 'var(--ltdr-black-bottle)' : 'transparent' }}
    >
      {fallback && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '14vh 24px' }}>
          <Pic
            photo={PHOTOS.cuvee2023}
            sizes="(max-width: 900px) 90vw, 60vw"
            style={{ maxHeight: '72vh', width: 'auto', objectFit: 'contain', filter: 'brightness(0.9)' }}
          />
        </div>
      )}
      <h2
        className="acte-kicker"
        style={{ position: 'absolute', top: '12vh', left: 0, right: 0, textAlign: 'center', margin: 0, fontWeight: 300, pointerEvents: 'none' }}
      >
        Acte VI — La bouteille
      </h2>
      {captions.map((c, i) => (
        <div
          key={c.main}
          className="scene-caption"
          ref={(el) => {
            capRefs.current[i] = el;
          }}
          style={{
            position: 'absolute',
            maxWidth: 380,
            opacity: fallback ? 1 : 0,
            pointerEvents: 'none',
            textAlign: c.align,
            ...c.pos,
          }}
        >
          <p className="display" style={{ margin: 0, fontSize: c.mainSize ?? 'clamp(26px, 2.8vw, 40px)', lineHeight: 1.15, color: 'var(--ltdr-ivory)' }}>
            {c.main}
          </p>
          {c.sub && (
            <p style={{ margin: '14px 0 0', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ltdr-gold)' }}>
              {c.sub}
            </p>
          )}
        </div>
      ))}
      <div
        ref={dragLayerRef}
        aria-hidden="true"
        data-cursor="drag"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', cursor: 'grab', touchAction: 'pan-y' }}
      />
      <div
        ref={dragHintRef}
        style={{
          position: 'absolute',
          bottom: '7vh',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--ltdr-ivory-45)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        — Glisser pour tourner la bouteille —
      </div>
    </section>
  );
};
