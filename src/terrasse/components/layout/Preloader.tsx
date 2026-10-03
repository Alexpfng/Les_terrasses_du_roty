import { useEffect, useRef, useState } from "react";
import { gsap } from "@/terrasse/lib/gsapSetup";
import { useLtdrStore } from "@/terrasse/lib/store";
import { LOGOS, LABEL_TEXTURE, PHOTOS } from "@/terrasse/lib/assets";

/** Assets réellement préchargés — la barre de progression ne ment pas. */
const CRITICAL: string[] = [
  LOGOS.sunGold,
  LOGOS.logoWhite,
  LABEL_TEXTURE,
  `${PHOTOS.drone.base}-800.jpg`,
  `${PHOTOS.mains.base}-800.jpg`,
  `${PHOTOS.coffret2024.base}-800.jpg`,
];

const STRIPS = 10;
const MIN_SHOW_MS = 700;

/**
 * Preloader réel : précharge images + polices (document.fonts.ready).
 * La progression = le soleil du logo qui se dessine, terrasse par terrasse.
 */
export const Preloader = () => {
  const setReady = useLtdrStore((s) => s.setReady);
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let loaded = 0;
    const total = CRITICAL.length + 1; // +1 pour les polices
    const started = performance.now();
    let cancelled = false;

    const bump = () => {
      loaded += 1;
      if (!cancelled) setProgress(loaded / total);
    };

    const imgPromises = CRITICAL.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => {
            bump();
            resolve();
          };
          img.src = src;
        }),
    );
    const fontPromise = (document.fonts?.ready ?? Promise.resolve()).then(() => bump());

    Promise.all([...imgPromises, fontPromise]).then(() => {
      const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - started));
      setTimeout(() => {
        if (cancelled) return;
        const el = ref.current;
        if (el) {
          gsap.to(el, {
            opacity: 0,
            duration: 0.7,
            ease: "power2.inOut",
            onComplete: () => {
              setGone(true);
              setReady(true);
            },
          });
        } else {
          setGone(true);
          setReady(true);
        }
      }, wait);
    });

    return () => {
      cancelled = true;
    };
  }, [setReady]);

  if (gone) return null;

  const visible = Math.round(progress * STRIPS);

  return (
    <div
      ref={ref}
      aria-label="Chargement"
      role="status"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-preloader)" as unknown as number,
        background: "var(--ltdr-black)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ display: "grid", justifyItems: "center", gap: 26 }}>
        <div
          style={{
            position: "relative",
            width: "clamp(110px, 16vmin, 180px)",
            aspectRatio: "784 / 592",
          }}
        >
          {Array.from({ length: STRIPS }, (_, s) => (
            <div
              key={s}
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
                height: "10%",
                top: `${s * 10}%`,
                backgroundImage: `url(${LOGOS.sunGold})`,
                backgroundSize: "100% 1000%",
                backgroundPosition: `0 ${(s / (STRIPS - 1)) * 100}%`,
                opacity: STRIPS - 1 - s < visible ? 1 : 0.06,
                transition: "opacity .4s",
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--ltdr-ivory-45)",
          }}
        >
          {Math.round(progress * 100)} %
        </span>
      </div>
    </div>
  );
};
