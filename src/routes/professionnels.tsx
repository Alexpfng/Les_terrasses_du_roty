import { createFileRoute } from "@tanstack/react-router";
import { ProfessionnelsPage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/professionnels")({
  head: () => ({
    ...seo(
      "Cavistes et restaurateurs — Contact professionnel",
      "Contactez Les Terrasses du Roty pour une fiche cuvée, les disponibilités ou un projet de référencement pour votre cave ou restaurant.",
      "/professionnels/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([
          { name: "Cavistes et restaurateurs — Contact professionnel", path: "/professionnels/" },
        ]),
      ),
    ],
  }),
  component: ProfessionnelsPage,
});
