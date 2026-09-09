import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/roty/LegalPages";
import { seo } from "@/content/seo";
export const Route = createFileRoute("/conditions-de-vente")({
  head: () =>
    seo(
      "Modalités de demande et d’achat",
      "Comment demander des bouteilles au domaine : informations, disponibilité, prix et confirmation des modalités avant tout achat.",
      "/conditions-de-vente/",
    ),
  component: () => <LegalPage kind="conditions" />,
});
