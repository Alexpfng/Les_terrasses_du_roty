import { createFileRoute } from "@tanstack/react-router";
import { JournalPage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/journal")({
  head: () => ({
    ...seo(
      "Le journal du Roty — Vigne, Syrah et pierre sèche",
      "Les articles du Roty : achat en direct, Syrah à Saulcet, terrasses en pierre sèche, repères sur le bio et demandes professionnelles.",
      "/journal/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([
          { name: "Le journal du Roty — Vigne, Syrah et pierre sèche", path: "/journal/" },
        ]),
      ),
    ],
  }),
  component: JournalPage,
});
