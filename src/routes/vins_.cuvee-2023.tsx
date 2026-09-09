import { createFileRoute } from "@tanstack/react-router";
import { CuveePage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/vins_/cuvee-2023")({
  head: () => ({
    ...seo(
      "Cuvée 2023 — Syrah du Roty",
      "Découvrez la cuvée 2023 des Terrasses du Roty. Demandez sa fiche, son prix et sa disponibilité directement au domaine, sans paiement en ligne.",
      "/vins/cuvee-2023/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([
          { name: "Les cuvées", path: "/vins/" },
          { name: "Cuvée 2023", path: "/vins/cuvee-2023/" },
        ]),
      ),
    ],
  }),
  component: () => <CuveePage year="2023" />,
});
