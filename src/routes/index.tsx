import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

// Styles globaux + design tokens + @font-face du site (chemins /assets servis depuis public/).
import "@/terrasse/styles/global.css";

// Le récit immersif (three.js, GSAP, Lenis) est strictement client : pas de SSR possible.
const App = lazy(() => import("@/terrasse/app/App"));

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Les Terrasses du Roty",
      url: "https://www.les-terrasses-du-roty.fr/",
      logo: "https://www.les-terrasses-du-roty.fr/assets/img/logo-gold.png",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Saulcet",
        addressRegion: "Allier",
        addressCountry: "FR",
      },
    },
    {
      "@type": "Product",
      name: "Les Terrasses du Roty — Cuvée 2024",
      description:
        "Syrah 100 % issue de sept terrasses en pierre sèche à Saulcet, vignoble de Saint-Pourçain. Agriculture biologique certifiée Ecocert®. Livraison à la mise en bouteille, novembre 2025.",
      image:
        "https://www.les-terrasses-du-roty.fr/assets/img/mockup-coffret-1600.jpg",
      brand: { "@type": "Brand", name: "Les Terrasses du Roty" },
      offers: {
        "@type": "Offer",
        url: "https://www.les-terrasses-du-roty.fr/products/cuvee-2024-les-terrasses-du-roty-precommande",
        priceCurrency: "EUR",
        price: "25.00",
        availability: "https://schema.org/PreOrder",
      },
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Les Terrasses du Roty — Syrah née sur 7 terrasses de pierre sèche · Saint-Pourçain",
      },
      {
        name: "description",
        content:
          "Un vin rare, Syrah 100 %, né sur sept terrasses en pierre sèche réhabilitées à la main à Saulcet, vignoble de Saint-Pourçain. Agriculture biologique, cuvée 2024 certifiée Ecocert® en précommande.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      {
        property: "og:title",
        content: "Les Terrasses du Roty — Né sur des terres oubliées",
      },
      {
        property: "og:description",
        content:
          "Syrah 100 %, sept terrasses de pierre sèche rouvertes à la main à Saulcet. Cuvée 2024 certifiée Ecocert®, en précommande — 25 €.",
      },
      {
        property: "og:image",
        content: "/assets/img/mockup-coffret-1600.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/assets/img/sun-gold.png" },
      { rel: "canonical", href: "https://www.les-terrasses-du-roty.fr/" },
      {
        rel: "preload",
        href: "/assets/fonts/cormorant-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/assets/fonts/inter-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "preload", href: "/assets/img/sun-gold.png", as: "image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(JSON_LD),
      },
    ],
  }),
  component: Index,
});

function Index() {
  // Monté uniquement après hydratation : l'arbre three.js/GSAP ne touche jamais le serveur.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}
