import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '@/terrasse/lib/gsapSetup';
import { ANIM } from '@/terrasse/lib/animConfig';
import { progressState, smoothstep } from '@/terrasse/lib/progress';
import { useScrollScene } from '@/terrasse/hooks/useScrollScene';
import { prefersReducedMotion } from '@/terrasse/hooks/useReducedMotion';
import { Pic } from '@/terrasse/components/ui/Pic';
import { PHOTOS } from '@/terrasse/lib/assets';
import { useLtdrStore } from '@/terrasse/lib/store';

const captions = [
  { id: 'cap1', text: 'Sol argilo-calcaire.', pos: { left: 'clamp(24px, 9vw, 140px)', top: '32%' } },
  { id: 'cap2', text: 'Exposition plein sud.', pos: { right: 'clamp(24px, 9vw, 140px)', top: '40%' } },
  { id: 'cap3', text: 'La pierre sèche restitue la nuit la chaleur du jour.', pos: { left: 'clamp(24px, 11vw, 180px)', bottom: '24%' } },
];

/**
 * Acte IV — La terre. Scène 3D signature : la caméra monte les 7 terrasses.
 * Le texte est en vrai DOM (SEO), fondu aux seuils de progression.
 * En tier low / reduced-motion : remplacé par une séquence d'images statique.
 */
export const Act4Terre = () => {
  const ref = useRef<HTMLElement>(null);
  const capRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tier = useLtdrStore((s) => s.tier);
  const reduced = prefersReducedMotion();
  const fallback = tier === 'low' || reduced;
  useScrollScene(ref, 4, fallback ? undefined : 'showTerraces', 460); // pin terrasses 280%

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || fallback) return;
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: `+=${ANIM.terraces.pinLength}`,
        pin: true,
        anticipatePin: 1,
        scrub: true,
        refreshPriority: 2, // recalcule son spacer avant les triggers situés plus bas
        onUpdate: (self) => {
          progressState.terraces = self.progress;
          ANIM.terraces.captions.forEach((c, i) => {
            const el = capRefs.current[i];
            if (!el) return;
            const o = smoothstep(c.at, c.at + 0.06, self.progress) * (1 - smoothstep(c.out - 0.06, c.out, self.progress));
            el.style.opacity = o.toFixed(3);
            el.style.transform = `translateY(${((1 - o) * 16).toFixed(1)}px)`;
          });
        },
      });
    },
    { scope: ref, dependencies: [fallback] },
  );

  return (
    <section
      ref={ref}
      id="acte-4"
      aria-label="Acte IV — La terre"
      style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: fallback ? 'var(--ltdr-black)' : 'transparent' }}
    >
      {fallback && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Pic
            photo={PHOTOS.drone}
            sizes="100vw"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, filter: 'saturate(0.7) brightness(0.7)' }}
          />
        </div>
      )}
      <h2
        className="acte-kicker"
        style={{ position: 'absolute', top: '12vh', left: 0, right: 0, textAlign: 'center', margin: 0, fontWeight: 300 }}
      >
        Acte IV — La terre
      </h2>
      {captions.map((c, i) => (
        <div
          key={c.id}
          className="scene-caption"
          ref={(el) => {
            capRefs.current[i] = el;
          }}
          style={{ position: 'absolute', maxWidth: i === 2 ? 380 : 340, opacity: fallback ? 1 : 0, ...c.pos }}
        >
          <div style={{ width: 42, height: 1, background: 'var(--ltdr-gold)', marginBottom: 18 }} />
          <p className="display" style={{ margin: 0, fontSize: 'var(--fs-caption-3d)', lineHeight: 1.25, color: 'var(--ltdr-ivory)' }}>
            {c.text}
          </p>
        </div>
      ))}
    </section>
  );
};
