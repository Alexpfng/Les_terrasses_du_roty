import { createFileRoute } from "@tanstack/react-router";
import { JournalPage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/journal")({
  head: () => ({
    ...seo(
      "Journal — Syrah, vigne et achat direct",
      "Nos guides sur l’achat de vin en direct dans l’Allier, la Syrah à Saulcet et les demandes des cavistes et restaurateurs, avec les archives du domaine.",
      "/journal/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([{ name: "Journal — Syrah, vigne et achat direct", path: "/journal/" }]),
      ),
    ],
  }),
  component: JournalPage,
});
