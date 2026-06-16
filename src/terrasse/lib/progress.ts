/**
 * Progression de scroll partagée entre ScrollTrigger (écriture)
 * et les scènes three.js (lecture dans useFrame).
 * Objet mutable volontairement hors React : aucune re-render par frame.
 */
export const progressState = {
  /** progression du pin de l'Acte I (0..1) */
  hero: 0,
  /** progression du pin de l'Acte IV (0..1) */
  terraces: 0,
  /** progression du pin de l'Acte VI (0..1) */
  bottle: 0,
  /** rotation libre de la bouteille (drag), en radians cible */
  bottleUserRot: 0,
};

/** smoothstep utilisé partout pour les fondus pilotés par progress */
export const smoothstep = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
