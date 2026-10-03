import { createFileRoute } from "@tanstack/react-router";
import { VinSyrahPage } from "@/components/roty/SearchLandingPages";
import { breadcrumbsSchema, seo, structuredData } from "@/content/seo";

const faq = [
  {
    question: "La Syrah est-elle toujours un vin rouge identique ?",
    answer:
      "Non. Le nom du cépage ne remplace pas la fiche d’un vin. L’origine, le millésime et les choix d’élaboration permettent de comprendre la cuvée précise.",
  },
  {
    question: "Comment choisir un vin de Syrah ?",
    answer:
      "Vérifiez le producteur, l’origine, le millésime, la composition annoncée et les informations de service. Pour le Roty, les fiches des cuvées et le contact direct donnent ces repères sans supposer un stock.",
  },
  {
    question: "Où acheter la Syrah des Terrasses du Roty ?",
    answer:
      "Adressez une demande au domaine à Saulcet. Le prix, la disponibilité et les modalités sont confirmés lors de l’échange.",
  },
];

export const Route = createFileRoute("/vin-syrah")({
  head: () => ({
    ...seo(
      "Vin Syrah — Guide, origine et achat direct",
      "Comment choisir un vin de Syrah ? Région, millésime, accords et achat direct : les repères essentiels et la Syrah des Terrasses du Roty.",
      "/vin-syrah/",
      "website",
      {
        path: "/assets/img/wine-motion-1600.jpg",
        alt: "Photographie d’illustration de vin rouge en mouvement dans un verre",
      },
    ),
    scripts: [
      structuredData(breadcrumbsSchema([{ name: "Guide de la Syrah", path: "/vin-syrah/" }])),
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
  component: VinSyrahPage,
});
