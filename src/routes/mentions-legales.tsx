import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/roty/LegalPages";
import { seo } from "@/content/seo";
export const Route = createFileRoute("/mentions-legales")({
  head: () =>
    seo(
      "Mentions légales",
      "Éditeur et coordonnées des Terrasses du Roty, immatriculation et informations sur le site.",
      "/mentions-legales/",
    ),
  component: () => <LegalPage kind="mentions" />,
});
