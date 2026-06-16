import { useEffect, useRef } from 'react';
import { gsap } from '@/terrasse/lib/gsapSetup';
import { prefersReducedMotion } from '@/terrasse/hooks/useReducedMotion';

/** Curseur or : point qui devient anneau sur les éléments [data-hover]. */
export const Cursor = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = ref.current;
    if (!cur) return;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (touch || prefersReducedMotion()) {
      cur.style.display = 'none';
      return;
    }
    const qx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
    const qy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    const onMove = (e: MouseEvent) => {
      cur.style.opacity = '0.9';
      qx(e.clientX);
      qy(e.clientY);
    };
    const ring = (size: number, dashed = false) => {
      const h = size / 2;
      cur.style.width = `${size}px`;
      cur.style.height = `${size}px`;
      cur.style.margin = `-${h}px 0 0 -${h}px`;
      cur.style.background = 'transparent';
      cur.style.border = `1px ${dashed ? 'dashed' : 'solid'} #C9A227`;
    };
    const dot = () => {
      cur.style.width = '8px';
      cur.style.height = '8px';
      cur.style.margin = '-4px 0 0 -4px';
      cur.style.background = '#C9A227';
      cur.style.border = 'none';
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest?.('[data-cursor="drag"]')) ring(46, true); // inspection bouteille
      else if (t.closest?.('[data-hover]')) ring(26);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest?.('[data-hover], [data-cursor]')) dot();
    };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 8,
        height: 8,
        margin: '-4px 0 0 -4px',
        borderRadius: '50%',
        background: 'var(--ltdr-gold)',
        zIndex: 'var(--z-cursor)' as unknown as number,
        pointerEvents: 'none',
        opacity: 0,
        transition: 'width .25s, height .25s, margin .25s, opacity .3s',
      }}
    />
  );
};
