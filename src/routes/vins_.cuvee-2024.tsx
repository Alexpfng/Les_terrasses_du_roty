import { createFileRoute } from "@tanstack/react-router";
import { CuveePage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/vins_/cuvee-2024")({
  head: () => ({
    ...seo(
      "Cuvée 2024 — Syrah du Roty",
      "Découvrez la cuvée 2024 des Terrasses du Roty. Demandez sa fiche, son prix et sa disponibilité directement au domaine, sans paiement en ligne.",
      "/vins/cuvee-2024/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([
          { name: "Les cuvées", path: "/vins/" },
          { name: "Cuvée 2024", path: "/vins/cuvee-2024/" },
        ]),
      ),
    ],
  }),
  component: () => <CuveePage year="2024" />,
});
