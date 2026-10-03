export type EditorialImage = {
  imageName: string;
  alt: string;
  credit?: string;
  focalPoint?: string;
};

/** Photos supplied for the project; illustrative images do not depict the Roty estate. */
export const editorialImages: Record<string, EditorialImage> = {
  "acheter-vin-direct-producteur-allier": {
    imageName: "wine-cork",
    alt: "Photographie d’illustration : détail d’un goulot de bouteille de vin",
    credit: "Illustration · Unsplash",
    focalPoint: "50% 26%",
  },
  "vin-bio-pres-saint-pourcain": {
    imageName: "wine-reflections",
    alt: "Photographie d’illustration : un verre de vin et des reflets de feuillage",
    credit: "Illustration · Unsplash",
    focalPoint: "50% 64%",
  },
  "vignes-terrasses-pierre-seche-roty": {
    imageName: "dji-0086",
    alt: "Le chantier de remise en état des terrasses du Roty à Saulcet",
    credit: "Archives du domaine",
  },
  "syrah-saulcet-allier": {
    imageName: "wine-motion",
    alt: "Photographie d’illustration : du vin rouge en mouvement dans un verre",
    credit: "Illustration · Unsplash",
    focalPoint: "50% 42%",
  },
  "cavistes-restaurateurs-syrah-roty": {
    imageName: "wine-table",
    alt: "Photographie d’illustration : un verre de vin rouge sur une table de restaurant",
    credit: "Illustration · Unsplash",
    focalPoint: "50% 46%",
  },
  "vinification-vendanges-maceration-elevage": {
    imageName: "wine-silhouette",
    alt: "Photographie d’illustration : une bouteille et un verre de vin sur fond sombre",
    credit: "Illustration · Unsplash",
  },
  "vendanges-2024": {
    imageName: "roty-harvest-2024",
    alt: "Deux personnes récoltent des grappes dans les rangs de vigne",
    credit: "Archives du domaine",
    focalPoint: "50% 40%",
  },
};
