import { createFileRoute } from "@tanstack/react-router";
import { ProfessionnelsPage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/professionnels")({
  head: () => ({
    ...seo(
      "Syrah pour cavistes et restaurants",
      "Cavistes et restaurateurs : découvrez la Syrah de Saulcet et demandez fiche cuvée, tarif professionnel et modalités d’approvisionnement au domaine.",
      "/professionnels/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([
          { name: "Syrah pour cavistes et restaurants", path: "/professionnels/" },
        ]),
      ),
    ],
  }),
  component: ProfessionnelsPage,
});
