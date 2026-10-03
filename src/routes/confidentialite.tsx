import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/roty/LegalPages";
import { seo } from "@/content/seo";
export const Route = createFileRoute("/confidentialite")({
  head: () =>
    seo(
      "Confidentialité et données personnelles",
      "Comprendre les données utilisées pour votre demande au domaine, les destinataires et vos droits.",
      "/confidentialite/",
    ),
  component: () => <LegalPage kind="confidentialite" />,
});
