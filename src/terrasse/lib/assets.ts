/**
 * Manifest centralisé des assets.
 * Pour remplacer un visuel : déposer le fichier source dans `asset-src/`,
 * relancer `npm run assets`, puis mettre à jour l'entrée ici.
 * Les photos existent en AVIF/WebP/JPEG aux largeurs 800 et 1600
 * (suffixe `-800` / `-1600`), les logos restent en PNG transparent.
 */
const IMG = "/assets/img";

export interface PhotoAsset {
  /** base du nom de fichier, sans suffixe de largeur ni extension */
  base: string;
  width: number;
  height: number;
  alt: string;
}

export const PHOTOS = {
  /** Acte II — chantier des terrasses vu au drone */
  drone: {
    base: `${IMG}/dji-0086`,
    width: 2400,
    height: 1797,
    alt: "Les sept terrasses en cours de réhabilitation, vues du ciel, à Saulcet",
  },
  /** Acte III — plantation sur les terrasses, vue sur la plaine */
  mains: {
    base: `${IMG}/img-9683`,
    width: 2400,
    height: 1800,
    alt: "Plantation des ceps à la main sur les terrasses en pierre sèche, Saulcet en contrebas",
  },
  /** Acte VII — cuvée 2023, caisse de bouteilles */
  cuvee2023: {
    base: `${IMG}/img-2855`,
    width: 2400,
    height: 1800,
    alt: "Caisse de bouteilles de la cuvée 2023 Les Terrasses du Roty",
  },
  /** Acte VII — coffret cuvée 2024 */
  coffret2024: {
    base: `${IMG}/mockup-coffret`,
    width: 1200,
    height: 1824,
    alt: "Coffret noir et bouteille papier de soie de la cuvée 2024 Les Terrasses du Roty",
  },
} satisfies Record<string, PhotoAsset>;

/** Logos et marquages (PNG transparents, non redimensionnés). */
export const LOGOS = {
  sunGold: `${IMG}/sun-gold.png`,
  sunIvory: `${IMG}/sun-ivory.png`,
  logoGold: `${IMG}/logo-gold.png`,
  logoWhite: `${IMG}/logo-white.png`,
  logoBlack: `${IMG}/logo-black.png`,
} as const;

/**
 * Étiquette pour la bouteille 3D (extraite du PDF imprimeur, optimisée écran).
 * `LABEL_TEXTURE` : version lisible (contraste/chaleur rehaussés) pour le `map`.
 * `LABEL_EMISSIVE` : marquages clairs isolés sur noir, pour l'`emissiveMap` —
 * garantit la lisibilité des traits or/ivoire même dans l'éclairage sombre.
 */
export const LABEL_TEXTURE = `${IMG}/label-3d-1600.jpg`;
export const LABEL_EMISSIVE = `${IMG}/label-3d-emissive-1600.jpg`;

/** Vidéo des terrasses (CDN Shopify existant — reste hébergée là-bas). */
export const TERRACE_VIDEO = {
  src: "https://www.les-terrasses-du-roty.fr/cdn/shop/videos/c/vp/42d3117825c7489aa74d1c5d59400ffe/42d3117825c7489aa74d1c5d59400ffe.HD-720p-3.0Mbps-54502328.mp4?v=0",
  poster:
    "https://www.les-terrasses-du-roty.fr/cdn/shop/files/preview_images/42d3117825c7489aa74d1c5d59400ffe.thumbnail.0000000000.jpg?v=1754602426&width=1600",
} as const;

/** Liens d'achat — le checkout reste sur le Shopify existant. */
export const SHOP = {
  cuvee2024:
    "https://www.les-terrasses-du-roty.fr/products/cuvee-2024-les-terrasses-du-roty-precommande",
  cuvee2023: "https://www.les-terrasses-du-roty.fr/products/les-terrasses-du-roty-cuvee-2023",
  policies: {
    privacy: "https://www.les-terrasses-du-roty.fr/policies/privacy-policy",
    refund: "https://www.les-terrasses-du-roty.fr/policies/refund-policy",
    terms: "https://www.les-terrasses-du-roty.fr/policies/terms-of-service",
    shipping: "https://www.les-terrasses-du-roty.fr/policies/shipping-policy",
    sale: "https://www.les-terrasses-du-roty.fr/policies/terms-of-sale",
    legal: "https://www.les-terrasses-du-roty.fr/policies/legal-notice",
    contact: "https://www.les-terrasses-du-roty.fr/policies/contact-information",
  },
} as const;

/** srcset/source helpers pour le composant <Pic>. */
export const photoSources = (p: PhotoAsset) => {
  const widths = [800, 1600];
  const set = (ext: string) => widths.map((w) => `${p.base}-${w}.${ext} ${w}w`).join(", ");
  return {
    avif: set("avif"),
    webp: set("webp"),
    jpg: set("jpg"),
    fallback: `${p.base}-1600.jpg`,
  };
};
