import { createFileRoute } from "@tanstack/react-router";
import { TerrassesPage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/terrasses-pierre-seche")({
  head: () => ({
    ...seo(
      "Terrasses en pierre sèche à Saulcet",
      "Sept terrasses en pierre sèche à Saulcet, dans l’Allier : découvrez leur restauration et le retour de la vigne au Roty, avec les photographies du domaine.",
      "/terrasses-pierre-seche/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([
          {
            name: "Terrasses en pierre sèche à Saulcet",
            path: "/terrasses-pierre-seche/",
          },
        ]),
      ),
    ],
  }),
  component: TerrassesPage,
});
