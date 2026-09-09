export const SITE_URL = "https://www.les-terrasses-du-roty.fr";
export function seo(title: string, description: string, path: string, type = "website") {
  const fullTitle = title.includes("Les Terrasses du Roty")
    ? title
    : `${title} | Les Terrasses du Roty`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "Les Terrasses du Roty" },
      { property: "og:url", content: SITE_URL + path },
      { property: "og:image", content: SITE_URL + "/assets/img/img-9683-1600.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + path }],
  };
}
export function breadcrumbsSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: SITE_URL + item.path,
    })),
  };
}
export function structuredData(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data).replace(/</g, "\\u003c") };
}
