import { createFileRoute } from "@tanstack/react-router";
import { VinsPage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/vins")({
  head: () => ({
    ...seo(
      "Vin de Syrah — Achat direct producteur",
      "Vin de Syrah à Saulcet dans l’Allier : découvrez les cuvées 2023 et 2024, puis demandez au producteur les tarifs, disponibilités et modalités d’achat.",
      "/vins/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([{ name: "Vin de Syrah — Achat direct producteur", path: "/vins/" }]),
      ),
    ],
  }),
  component: VinsPage,
});
