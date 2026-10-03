import { createFileRoute } from "@tanstack/react-router";
import { DomainePage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/domaine")({
  head: () => ({
    ...seo(
      "Producteur de vin dans l’Allier — Saulcet",
      "À Saulcet dans l’Allier, découvrez Les Terrasses du Roty : un domaine de Syrah, son histoire et la restauration de sept terrasses en pierre sèche.",
      "/domaine/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([{ name: "Producteur de vin dans l’Allier", path: "/domaine/" }]),
      ),
    ],
  }),
  component: DomainePage,
});
