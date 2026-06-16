import { useRef, type MouseEvent } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/terrasse/lib/gsapSetup';
import { scrollToSection } from '@/terrasse/lib/lenis';
import { useLtdrStore } from '@/terrasse/lib/store';
import { LOGOS } from '@/terrasse/lib/assets';

const linkStyle = (gold: boolean) =>
  ({
    color: gold ? 'var(--ltdr-gold)' : 'var(--ltdr-ivory)',
    textDecoration: 'none',
    fontSize: 11,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    opacity: gold ? 1 : 0.8,
  }) as const;

/** Header fixe — bascule en encre sombre au-dessus de l'Acte VII (fond clair). */
export const Nav = () => {
  const setMenuOpen = useLtdrStore((s) => s.setMenuOpen);
  const ready = useLtdrStore((s) => s.ready);
  const ageOk = useLtdrStore((s) => s.ageOk);
  const ref = useRef<HTMLElement>(null);

  const go = (e: MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    scrollToSection(target);
  };

  // useGSAP : nettoyage automatique des animations et du ScrollTrigger,
  // sélecteurs scopés au header. Apparition propre via autoAlpha
  // (cache `visibility` → pas de liens cliquables tant que le header est masqué).
  useGSAP(
    () => {
      const hdr = ref.current;
      if (!hdr) return;

      if (ready && ageOk) {
        gsap.to(hdr, { autoAlpha: 1, duration: 1, ease: 'power2.out', delay: 0.15 });
      }

      const setDark = (dark: boolean) => {
        hdr.querySelectorAll<HTMLElement>('[data-hdrtxt]').forEach((a, i) => {
          a.style.color = dark ? (i === 2 ? '#A8861D' : '#0A0908') : i === 2 ? '#C9A227' : '#F4F0E6';
        });
        hdr.querySelectorAll<HTMLElement>('[data-hdrbar]').forEach((b) => {
          b.style.background = dark ? '#0A0908' : '#F4F0E6';
        });
      };
      // 4 callbacks directionnels + onRefresh : plus robuste qu'onToggle seul.
      const apply = (self: ScrollTrigger) => setDark(self.isActive);
      ScrollTrigger.create({
        trigger: '#ltdr-light',
        start: 'top 64px',
        end: 'bottom 64px',
        onEnter: apply,
        onLeave: apply,
        onEnterBack: apply,
        onLeaveBack: apply,
        onRefresh: apply,
      });
    },
    { scope: ref, dependencies: [ready, ageOk] },
  );

  return (
    <header
      ref={ref}
      id="ltdr-hdr"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-header)' as unknown as number,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '22px var(--pad-hdr)',
        opacity: 0,
        visibility: 'hidden',
      }}
    >
      <a href="#acte-1" onClick={(e) => go(e, '#acte-1')} data-hover="1" style={{ display: 'block', lineHeight: 0 }}>
        <img src={LOGOS.sunGold} alt="Les Terrasses du Roty — accueil" style={{ height: 34, width: 'auto', display: 'block' }} />
      </a>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px, 2.6vw, 40px)' }} aria-label="Navigation principale">
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px, 2.6vw, 40px)' }}>
          <a href="#acte-4" onClick={(e) => go(e, '#acte-4')} data-hover="1" data-hdrtxt="1" data-underline="1" style={linkStyle(false)}>
            La terre
          </a>
          <a href="#acte-6" onClick={(e) => go(e, '#acte-6')} data-hover="1" data-hdrtxt="1" data-underline="1" style={linkStyle(false)}>
            Le vin
          </a>
          <a href="#acte-7" onClick={(e) => go(e, '#acte-7')} data-hover="1" data-hdrtxt="1" data-underline="1" style={linkStyle(true)}>
            Précommander
          </a>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          data-hover="1"
          aria-label="Ouvrir le menu"
          style={{ background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', display: 'grid', gap: 6, width: 30 }}
        >
          <span data-hdrbar="1" style={{ display: 'block', height: 1, background: 'var(--ltdr-ivory)', width: '100%' }} />
          <span data-hdrbar="1" style={{ display: 'block', height: 1, background: 'var(--ltdr-ivory)', width: '66%', justifySelf: 'end' }} />
        </button>
      </nav>
    </header>
  );
};
