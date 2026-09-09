import { createFileRoute } from "@tanstack/react-router";
import { VinsPage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/vins")({
  head: () => ({
    ...seo(
      "Syrah de Saulcet — Achat direct",
      "Syrah 2023 et 2024 à Saulcet, dans l’Allier : découvrez les cuvées du Roty et demandez au domaine les tarifs, disponibilités et modalités d’achat.",
      "/vins/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([{ name: "Syrah de Saulcet — Achat direct", path: "/vins/" }]),
      ),
    ],
  }),
  component: VinsPage,
});
