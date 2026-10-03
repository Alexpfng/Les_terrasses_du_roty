import { articles, type Article } from "./articles";

/** Original publication dates come from the historical public journal. */
export interface HistoricalArticle extends Article {
  originalPublishedAt: string;
  isArchive: true;
}

export const historicalArticles: HistoricalArticle[] = [
  {
    slug: "vinification-vendanges-maceration-elevage",
    title: "Vinification : vendanges, macération et élevage",
    seoTitle: "Vendanges, macération et élevage | Archives du Roty",
    description:
      "Les étapes de vinification décrites dans le journal des Terrasses du Roty en août 2025 : vendange manuelle, macération et élevage.",
    excerpt:
      "De la récolte à l’élevage, retrouver les étapes présentées par le domaine dans son journal du 11 août 2025.",
    category: "Archives du domaine",
    originalPublishedAt: "2025-08-11",
    isArchive: true,
    readingMinutes: 2,
    relatedPath: "/vins/",
    relatedLabel: "Consulter les fiches des cuvées",
    image: "/assets/img/img-9683-1600.jpg",
    imageAlt: "Travail dans les vignes des Terrasses du Roty",
    canonical:
      "https://www.les-terrasses-du-roty.fr/journal/vinification-vendanges-maceration-elevage/",
    sources: [],
    bodyHtml: `<p>Le journal du domaine du 11 août 2025 présentait les étapes de vinification des Terrasses du Roty. Ce récit permet de suivre le travail depuis la récolte jusqu’à l’élevage. Les choix et les durées décrits doivent être rapprochés de la fiche du millésime qui vous intéresse.</p>
<h2>Une vendange manuelle</h2>
<p>Le domaine décrivait une récolte effectuée à la main pour préserver les grappes. Selon le millésime, l’égrappage pouvait être partiel ou total : les raisins étaient séparés de tout ou partie de leur rafle avant la suite du travail.</p>
<p>Cette première étape fait le lien entre la vigne et le chai. Le tri et le soin apporté au transport accompagnent les choix effectués pendant la culture.</p>
<h2>La macération et les remontages</h2>
<p>Le billet mentionnait une macération de trois à quatre semaines, accompagnée de remontages doux quotidiens. Ces opérations participent à l’extraction des composés présents dans les peaux et les pépins.</p>
<p>Ce sont les paramètres décrits à la date du récit ; ils ne remplacent pas les informations techniques propres à chaque cuvée. Pour connaître les choix d’une année précise, vous pouvez demander sa fiche au domaine.</p>
<h2>Les contenants et la durée d’élevage</h2>
<p>L’élevage présenté dans cet article se répartissait entre trois types de contenants : un tiers en fûts neufs, un tiers en fûts d’un an et un tiers en cuve ovoïde en béton. Sa durée annoncée était de neuf à douze mois.</p>
<p>Les contenants, leur usage et la durée d’élevage sont des repères techniques à relier à un millésime identifié. Ils ne permettent pas, à eux seuls, de déduire les arômes d’une autre bouteille.</p>
<h2>Retrouver les informations d’un millésime</h2>
<p>Les fiches des <a href="/vins/cuvee-2023/">cuvées 2023</a> et <a href="/vins/cuvee-2024/">2024</a> prolongent ce récit. Pour une précision sur la vinification ou la disponibilité, <a href="/demande/">adressez une demande au domaine</a>.</p>
<p><em>L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</em></p>`,
  },
  {
    slug: "vendanges-2024",
    title: "Vendanges 2024 : la récolte du Roty",
    seoTitle: "Vendanges 2024 au Roty | Archives du domaine",
    description:
      "Retour sur la récolte manuelle de la parcelle du Roty à Saulcet, décrite dans le journal du domaine : les vendanges du 5 octobre 2024.",
    excerpt:
      "Le 5 octobre 2024, la récolte manuelle de la parcelle du Roty clôturait les vendanges racontées par le domaine.",
    category: "Archives du domaine",
    originalPublishedAt: "2025-08-07",
    isArchive: true,
    readingMinutes: 2,
    relatedPath: "/vins/cuvee-2024/",
    relatedLabel: "Découvrir la cuvée 2024",
    image: "/assets/img/img-9683-1600.jpg",
    imageAlt: "Travail dans les vignes des Terrasses du Roty",
    canonical: "https://www.les-terrasses-du-roty.fr/journal/vendanges-2024/",
    sources: [],
    bodyHtml: `<p>Le 5 octobre 2024, la récolte manuelle de la parcelle du Roty, à Saulcet, clôturait les vendanges racontées par le domaine dans son journal du 7 août 2025. Ce billet conserve le récit de cette récolte destinée à la cuvée 2024, présentée comme une 100 % Syrah.</p>
<h2>La récolte sur les terrasses</h2>
<p>Le récit décrivait une vendange commencée à l’aube, avec une attention portée à la fraîcheur des raisins. L’équipe avançait dans les rangs et sélectionnait les grappes, en laissant de côté les fruits abîmés ou insuffisamment mûrs.</p>
<p>Les raisins étaient déposés dans des seaux ou des cagettes, puis transportés au chai. Ces gestes constituaient la première étape du travail de la cuvée, avant la macération et l’élevage.</p>
<h2>Une parcelle remise en culture</h2>
<p>Au Roty, la récolte s’inscrit dans le projet de restauration des terrasses en pierre sèche. Elle relie le travail de remise en état du lieu à sa nouvelle fonction viticole : entretenir la parcelle, suivre la vigne et récolter son raisin.</p>
<p>Pour retrouver le point de départ de cette aventure et la place du lieu dans le projet, découvrez <a href="/domaine/">l’histoire du domaine</a> et <a href="/terrasses-pierre-seche/">les terrasses en pierre sèche</a>.</p>
<h2>Le millésime 2024, dans la suite de 2023</h2>
<p>La cuvée 2024 succède au premier millésime 2023 présenté par le domaine. Chaque récolte possède son contexte et ses choix propres. Le récit des vendanges ne permet pas de transposer automatiquement les caractéristiques d’un millésime à l’autre.</p>
<p>Cette archive raconte une récolte passée. Elle ne constitue pas une indication de stock ni une annonce de précommande. Pour connaître les références proposées et leurs modalités, consultez <a href="/vins/">les cuvées</a> puis <a href="/demande/">demandez les informations au domaine</a>.</p>
<p><em>L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</em></p>`,
  },
];

/** The five supplied articles stay distinct from the two preserved archives. */
export const allArticles: Article[] = [...articles, ...historicalArticles];

export function getJournalArticle(slug: string): Article | undefined {
  return allArticles.find((article) => article.slug === slug);
}
