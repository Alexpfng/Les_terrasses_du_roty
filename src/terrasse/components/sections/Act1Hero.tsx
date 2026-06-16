import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/terrasse/lib/gsapSetup';
import { ANIM } from '@/terrasse/lib/animConfig';
import { progressState } from '@/terrasse/lib/progress';
import { useLtdrStore } from '@/terrasse/lib/store';
import { useScrollScene } from '@/terrasse/hooks/useScrollScene';
import { prefersReducedMotion } from '@/terrasse/hooks/useReducedMotion';
import { LOGOS } from '@/terrasse/lib/assets';

const STRIPS = 10;

/** Acte I — L'éveil. Logo-soleil dessiné strip par strip, titre géant, pin + dissolution. */
export const Act1Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const ready = useLtdrStore((s) => s.ready);
  const ageOk = useLtdrStore((s) => s.ageOk);
  // pas de champ de particules animé en reduced-motion
  useScrollScene(ref, 1, prefersReducedMotion() ? undefined : 'showDust', 290);

  // Intro au chargement (après preloader + age-gate), puis pin + dissolution.
  // useGSAP scope les sélecteurs à la section et révoque tout automatiquement.
  // Le scrub est créé en onComplete (après l'intro) — donc via contextSafe,
  // pour qu'il soit rattaché au contexte et nettoyé comme le reste.
  // (le header et l'indicateur se révèlent eux-mêmes : voir Nav/ScrollProgress.)
  useGSAP(
    (_ctx, contextSafe) => {
      if (!ready || !ageOk) return;
      const root = ref.current;
      if (!root) return;
      const I = ANIM.intro;

      if (prefersReducedMotion()) {
        gsap.set(['[data-strip]', '#ltdr-title', '#ltdr-sub', '#ltdr-hint', '#ltdr-glow'], { opacity: 1 });
        return;
      }

      const buildScrub = contextSafe!(() => {
        const scrub = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: `+=${ANIM.hero.pinLength}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            refreshPriority: 3, // les pins recalculent leurs spacers avant les triggers en aval
            onUpdate: (self) => {
              progressState.hero = self.progress;
            },
          },
        });
        scrub.fromTo('#ltdr-sun', { scale: 1, opacity: 1 }, { scale: ANIM.hero.sunScaleOut, opacity: 0, ease: 'none', immediateRender: false }, 0);
        scrub.fromTo('#ltdr-title', { yPercent: 0 }, { yPercent: -50, opacity: 0, ease: 'none', immediateRender: false }, 0);
        scrub.fromTo('#ltdr-sub', { opacity: 1 }, { opacity: 0, ease: 'none', immediateRender: false }, 0);
        scrub.fromTo('#ltdr-hint', { opacity: 1 }, { opacity: 0, ease: 'none', immediateRender: false }, 0);
        scrub.fromTo('#ltdr-glow', { opacity: 1 }, { opacity: 0, ease: 'none', immediateRender: false }, 0.2);
        ScrollTrigger.refresh();
      });

      const tl = gsap.timeline({ delay: I.delay, onComplete: buildScrub });
      tl.to('[data-strip]', { opacity: 1, duration: I.stripDuration, ease: 'power1.inOut', stagger: { each: I.stripStagger, from: 'end' } }, 0);
      tl.to('#ltdr-glow', { opacity: 1, duration: I.glowDuration, ease: 'power2.out' }, I.glowAt);
      tl.fromTo('#ltdr-title', { opacity: 0, y: I.titleY }, { opacity: 1, y: 0, duration: I.titleDuration, ease: 'power3.out' }, I.titleAt);
      tl.to('#ltdr-sub', { opacity: 1, duration: 1.1, ease: 'power2.out' }, I.subAt);
      tl.to('#ltdr-hint', { opacity: 1, duration: 1, ease: 'power2.out' }, I.hintAt);
    },
    { scope: ref, dependencies: [ready, ageOk] },
  );

  return (
    <section
      ref={ref}
      id="acte-1"
      aria-label="Acte I — L'éveil"
      style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'grid', placeItems: 'center' }}
    >
      <div
        id="ltdr-glow"
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          width: '70vmin',
          height: '70vmin',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,162,39,0.16) 0%, rgba(201,162,39,0.05) 40%, transparent 70%)',
          opacity: 0,
        }}
      />
      <div style={{ position: 'relative', display: 'grid', justifyItems: 'center', padding: '0 24px', textAlign: 'center' }}>
        <div
          id="ltdr-sun"
          aria-hidden="true"
          style={{
            position: 'relative',
            width: 'clamp(170px, 24vmin, 300px)',
            aspectRatio: '784 / 592',
            filter: 'drop-shadow(0 0 24px rgba(201,162,39,0.25))',
          }}
        >
          {Array.from({ length: STRIPS }, (_, s) => (
            <div
              key={s}
              data-strip={STRIPS - 1 - s}
              style={{
                position: 'absolute',
                left: 0,
                width: '100%',
                height: '10%',
                top: `${s * 10}%`,
                backgroundImage: `url(${LOGOS.sunGold})`,
                backgroundSize: '100% 1000%',
                backgroundPosition: `0 ${(s / (STRIPS - 1)) * 100}%`,
                opacity: 0,
              }}
            />
          ))}
        </div>
        <h1
          id="ltdr-title"
          className="display"
          style={{
            margin: 'clamp(28px, 5vh, 52px) 0 0',
            fontSize: 'var(--fs-hero)',
            lineHeight: 0.98,
            letterSpacing: '-0.015em',
            color: 'var(--ltdr-ivory)',
            opacity: 0,
          }}
        >
          Né sur des terres
          <br />
          oubliées.
        </h1>
        <p
          id="ltdr-sub"
          style={{
            margin: 'clamp(22px, 4vh, 40px) 0 0',
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'var(--ltdr-ivory-60)',
            opacity: 0,
          }}
        >
          Les Terrasses du Roty&nbsp;&nbsp;·&nbsp;&nbsp;Syrah&nbsp;&nbsp;·&nbsp;&nbsp;Saint-Pourçain&nbsp;&nbsp;·&nbsp;&nbsp;Agriculture
          biologique
        </p>
      </div>
      <div
        id="ltdr-hint"
        style={{
          position: 'absolute',
          bottom: 34,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'grid',
          justifyItems: 'center',
          gap: 12,
          opacity: 0,
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--ltdr-ivory-45)' }}>Défiler</span>
        <span
          style={{
            display: 'block',
            width: 1,
            height: 42,
            background: 'linear-gradient(rgba(201,162,39,0.9), transparent)',
            animation: 'ltdr-hint 2.4s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
};
