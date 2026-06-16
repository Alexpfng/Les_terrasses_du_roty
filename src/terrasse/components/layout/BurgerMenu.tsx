import { useRef, type MouseEvent } from 'react';
import { gsap, useGSAP } from '@/terrasse/lib/gsapSetup';
import { getLenis, scrollToSection } from '@/terrasse/lib/lenis';
import { ANIM } from '@/terrasse/lib/animConfig';
import { useLtdrStore } from '@/terrasse/lib/store';

const links = [
  { label: "L'histoire", target: '#acte-2', gold: false },
  { label: 'La terre', target: '#acte-4', gold: false },
  { label: 'Le vin', target: '#acte-6', gold: false },
  { label: 'Précommander', target: '#acte-7', gold: true },
];

/** Menu plein écran, rideau noir descendu au GSAP. */
export const BurgerMenu = () => {
  const menuOpen = useLtdrStore((s) => s.menuOpen);
  const setMenuOpen = useLtdrStore((s) => s.setMenuOpen);
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const m = ref.current;
      if (!m) return;
      if (first.current) {
        first.current = false;
        if (!menuOpen) return;
      }
      if (menuOpen) {
        m.style.visibility = 'visible';
        gsap.to(m, { y: '0%', duration: ANIM.menu.open, ease: 'power4.inOut' });
        gsap.fromTo(
          m.querySelectorAll('[data-menulink]'),
          { opacity: 0, y: 38, rotationX: -70, transformOrigin: 'left top' },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            transformPerspective: 900,
            duration: 0.8,
            stagger: ANIM.menu.linkStagger,
            delay: ANIM.menu.linkDelay,
            ease: 'power3.out',
          },
        );
        getLenis()?.stop();
      } else {
        gsap.to(m, {
          y: '-102%',
          duration: ANIM.menu.close,
          ease: 'power4.inOut',
          onComplete: () => {
            m.style.visibility = 'hidden';
          },
        });
        getLenis()?.start();
      }
    },
    { scope: ref, dependencies: [menuOpen] },
  );

  const go = (e: MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(target);
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-menu)' as unknown as number,
        background: 'var(--ltdr-black-deep)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(24px, 8vw, 120px)',
        transform: 'translateY(-102%)',
        visibility: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setMenuOpen(false)}
        data-hover="1"
        aria-label="Fermer le menu"
        style={{
          position: 'absolute',
          top: 26,
          right: 'var(--pad-hdr)',
          background: 'none',
          border: 'none',
          color: 'var(--ltdr-ivory)',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          opacity: 0.7,
        }}
      >
        Fermer
      </button>
      <nav style={{ display: 'grid', gap: 'clamp(10px, 2.5vh, 26px)' }} aria-label="Menu plein écran">
        {links.map((l) => (
          <a
            key={l.target}
            href={l.target}
            onClick={(e) => go(e, l.target)}
            data-hover="1"
            data-menulink="1"
            className="display"
            style={{
              color: l.gold ? 'var(--ltdr-gold)' : 'var(--ltdr-ivory)',
              textDecoration: 'none',
              fontSize: 'var(--fs-menu)',
              lineHeight: 1.02,
              letterSpacing: '-0.01em',
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div style={{ marginTop: 'clamp(30px, 7vh, 70px)', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.45 }}>
        Saulcet · Vignoble de Saint-Pourçain · Allier
      </div>
    </div>
  );
};
