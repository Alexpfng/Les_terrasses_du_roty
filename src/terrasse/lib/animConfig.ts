/**
 * Toutes les durées et seuils d'animation du site.
 * Une seule source de vérité — pas de valeurs magiques dispersées.
 */
export const ANIM = {
  /* Acte I — intro au chargement */
  intro: {
    delay: 0.3,
    stripDuration: 0.5,
    stripStagger: 0.16,
    glowAt: 0.6,
    glowDuration: 2.2,
    titleAt: 1.5,
    titleDuration: 1.4,
    titleY: 46,
    subAt: 2.2,
    hintAt: 2.6,
    headerAt: 2.4,
  },
  /* Acte I — pin + dissolution au scroll (en % de viewport) */
  hero: {
    pinLength: "110%",
    sunScaleOut: 1.35,
  },
  /* Textes révélés mot à mot */
  split: {
    start: "top 78%",
    end: "top 26%",
    fromOpacity: 0.08,
    stagger: 0.06,
  },
  /* Parallaxe multi-plans (amplitude de base en %, mise à l'échelle responsive) */
  parallax: { amplitude: 60, scrub: 0.8 },
  /* Acte III — désaturation pilotée par le scroll */
  desat: { start: "top 65%", end: "center 40%" },
  /* Compteurs */
  counter: { start: "top 82%", duration: 1.8 },
  /* Acte IV — terrasses 3D */
  terraces: {
    pinLength: "280%",
    captions: [
      { at: 0.06, out: 0.32 },
      { at: 0.38, out: 0.6 },
      { at: 0.66, out: 0.97 },
    ],
    sunRevealStart: 0.4,
    sunRevealEnd: 0.82,
  },
  /* Acte VI — bouteille 3D */
  bottle: {
    pinLength: "360%",
    riseEnd: 0.12,
    lightStart: 0.04,
    lightEnd: 0.3,
    /* beat « bouteille entière centrée », bien éclairée, avant le détail */
    holdStart: 0.12,
    holdEnd: 0.34,
    /* un tour complet, étiquette face caméra à rotAEnd */
    rotAStart: 0.04,
    rotAEnd: 0.6,
    rotBStart: 0.74,
    /* dolly caméra : recul studio → gros plan étiquette → recul */
    pushInStart: 0.46,
    pushInEnd: 0.7,
    pushOutStart: 0.8,
    pushOutEnd: 0.94,
    dragHintAt: 0.9,
    captions: [
      { at: 0.12, out: 0.32 },
      { at: 0.38, out: 0.54 },
      { at: 0.56, out: 0.72 },
      { at: 0.8, out: 1.01 },
    ],
  },
  /* Menu plein écran */
  menu: { open: 0.8, close: 0.7, linkStagger: 0.07, linkDelay: 0.35 },
  /* FAQ */
  faq: { duration: 0.5 },
  /* Lenis */
  lenis: { duration: 1.15, scrollToDuration: 1.6 },
} as const;

/** Nombre de particules par tier de performance. */
export const PARTICLES = { high: 2200, mid: 1100, low: 550 } as const;
