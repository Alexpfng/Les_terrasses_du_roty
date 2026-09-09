import { createFileRoute } from "@tanstack/react-router";
import { DomainePage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/domaine")({
  head: () => ({
    ...seo(
      "Le domaine — Saulcet, Allier",
      "Découvrez l’histoire des Terrasses du Roty : la rencontre, la restauration des terrasses en pierre sèche et le choix de la Syrah à Saulcet.",
      "/domaine/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([{ name: "Le domaine — Saulcet, Allier", path: "/domaine/" }]),
      ),
    ],
  }),
  component: DomainePage,
});
