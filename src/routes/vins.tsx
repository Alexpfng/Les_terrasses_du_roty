import { createFileRoute } from "@tanstack/react-router";
import { VinsPage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/vins")({
  head: () => ({
    ...seo(
      "Les cuvées de Syrah du Roty",
      "Découvrez les cuvées des Terrasses du Roty et demandez directement au domaine les informations et disponibilités de chaque millésime.",
      "/vins/",
    ),
    scripts: [
      structuredData(breadcrumbsSchema([{ name: "Les cuvées de Syrah du Roty", path: "/vins/" }])),
    ],
  }),
  component: VinsPage,
});
