import { createFileRoute } from "@tanstack/react-router";
import { TerrassesPage } from "@/components/roty/EditorialPages";
import { seo, breadcrumbsSchema, structuredData } from "@/content/seo";
export const Route = createFileRoute("/terrasses-pierre-seche")({
  head: () => ({
    ...seo(
      "Sept terrasses en pierre sèche à Saulcet",
      "Comprendre le paysage du Roty, ses sept terrasses en pierre sèche et leur remise en culture. Photos documentaires et récit du domaine.",
      "/terrasses-pierre-seche/",
    ),
    scripts: [
      structuredData(
        breadcrumbsSchema([
          { name: "Sept terrasses en pierre sèche à Saulcet", path: "/terrasses-pierre-seche/" },
        ]),
      ),
    ],
  }),
  component: TerrassesPage,
});
