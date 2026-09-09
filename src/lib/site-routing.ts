import { allArticles } from "../content/historical-articles";
export const publishedPaths = [
  "/",
  "/domaine/",
  "/terrasses-pierre-seche/",
  "/vins/",
  "/vins/cuvee-2024/",
  "/vins/cuvee-2023/",
  "/professionnels/",
  "/demande/",
  "/journal/",
  "/mentions-legales/",
  "/confidentialite/",
  "/conditions-de-vente/",
  ...allArticles.map((article) => `/journal/${article.slug}/`),
];
export const legacyRedirects: Record<string, string> = {
  "/products/les-terrasses-du-roty-cuvee-2023": "/vins/cuvee-2023/",
  "/products/cuvee-2024-les-terrasses-du-roty-precommande": "/vins/cuvee-2024/",
  "/collections/all": "/vins/",
  "/collections/cuvees-2023": "/vins/cuvee-2023/",
  "/collections/frontpage": "/vins/cuvee-2023/",
  "/pages/contact": "/demande/",
  "/blogs/infos": "/journal/",
  "/blogs/infos/l-origine-des-terrasses-du-roty": "/domaine/",
  "/blogs/infos/la-syrah-un-cepage-noble-du-sud-qui-s-epanouit-au-coeur-du-bourbonnais":
    "/journal/syrah-saulcet-allier/",
  "/blogs/infos/vendanges-2024-une-cuvee-qui-s-annonce-exceptionnelle-🍇":
    "/journal/vendanges-2024/",
  "/blogs/infos/l-art-de-la-vinification-vendanges-maceration-et-elevage":
    "/journal/vinification-vendanges-maceration-elevage/",
  "/blogs/vendanges-2024": "/journal/vendanges-2024/",
  "/policies/legal-notice": "/mentions-legales/",
  "/policies/privacy-policy": "/confidentialite/",
  "/policies/contact-information": "/demande/",
  "/pages/data-sharing-opt-out": "/confidentialite/",
  "/policies/terms-of-service": "/mentions-legales/",
};
export const retiredPolicyPaths = [
  "/policies/refund-policy",
  "/policies/shipping-policy",
  "/policies/terms-of-sale",
];
