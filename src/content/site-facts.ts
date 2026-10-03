/** Stable facts only. Evidence and limitations: docs/content-verification.md. */
export const siteFacts = {
  name: "Les Terrasses du Roty",
  canonicalOrigin: "https://www.les-terrasses-du-roty.fr",
  location: {
    street: "8 Rue Louis Neillot",
    postalCode: "03500",
    locality: "Saulcet",
    department: "Allier",
    country: "France",
  },
  phone: "+33 6 21 56 01 17",
  instagram: "https://www.instagram.com/terrasses_du_roty/",
  grape: "Syrah",
  terraceCount: 7,
  projectStarted: "octobre 2021",
  documentedVintages: [2024, 2023],
  alcoholWarning: "L’abus d’alcool est dangereux pour la santé. À consommer avec modération.",
} as const;
