/** Stable facts only. Evidence and limitations: docs/content-verification.md. */
export const siteFacts = {
  name: "Les Terrasses du Roty",
  canonicalOrigin: "https://www.les-terrasses-du-roty.fr",
  location: { locality: "Saulcet", department: "Allier", country: "France" },
  grape: "Syrah",
  terraceCount: 7,
  projectStarted: "octobre 2021",
  documentedVintages: [2024, 2023],
  alcoholWarning: "L’abus d’alcool est dangereux pour la santé. À consommer avec modération.",
} as const;
