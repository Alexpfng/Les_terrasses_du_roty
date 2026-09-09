import { createFileRoute } from "@tanstack/react-router";
import { DomainePage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/domaine")({
  head: () => ({
    ...seo(
      "Domaine de Syrah à Saulcet, Allier",
      "À Saulcet dans l’Allier, découvrez Les Terrasses du Roty : l’histoire du domaine, le choix de la Syrah et la restauration de sept terrasses en pierre sèche.",
      "/domaine/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([{ name: "Domaine de Syrah à Saulcet, Allier", path: "/domaine/" }]),
      ),
    ],
  }),
  component: DomainePage,
});
