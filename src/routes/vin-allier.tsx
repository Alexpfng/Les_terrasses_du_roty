import { createFileRoute } from "@tanstack/react-router";
import { VinAllierPage } from "@/components/roty/SearchLandingPages";
import { breadcrumbsSchema, seo, structuredData } from "@/content/seo";

const faq = [
  {
    question: "Peut-on acheter du vin directement au domaine dans l’Allier ?",
    answer:
      "Vous pouvez demander des bouteilles directement aux Terrasses du Roty. Le domaine confirme ensuite le millésime disponible, le prix et les modalités possibles.",
  },
  {
    question: "Le domaine est-il près de Saint-Pourçain-sur-Sioule ?",
    answer:
      "Les vignes et l’adresse publique du domaine se trouvent à Saulcet, dans l’Allier. Cette proximité géographique ne constitue pas une revendication d’appellation pour la Syrah du Roty.",
  },
  {
    question: "Faut-il prendre rendez-vous avant de venir ?",
    answer:
      "Prenez contact avant tout déplacement afin de vérifier la présence du domaine et les modalités adaptées à votre demande.",
  },
];

export const Route = createFileRoute("/vin-allier")({
  head: () => ({
    ...seo(
      "Vin de l’Allier — Producteur à Saulcet",
      "Découvrez la Syrah des Terrasses du Roty à Saulcet : vin de l’Allier, cuvées et demande de bouteilles en direct du producteur.",
      "/vin-allier/",
    ),
    scripts: [
      structuredData(breadcrumbsSchema([{ name: "Vin de l’Allier", path: "/vin-allier/" }])),
      structuredData({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      }),
    ],
  }),
  component: VinAllierPage,
});
