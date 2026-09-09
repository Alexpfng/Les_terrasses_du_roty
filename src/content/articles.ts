/**
 * Editorial copy supplied in the mission, reviewed against the primary sources.
 * HTML is static, escaped at authoring time, and contains no executable markup.
 * Do not add a publication date or author until an actual publication records it.
 * Verification and historical source URLs: docs/content-verification.md.
 */
export interface ArticleSource {
  label: string;
  url: string;
}

export interface Article {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  category: string;
  bodyHtml: string;
  readingMinutes: number;
  relatedPath: string;
  relatedLabel: string;
  image: string;
  imageAlt: string;
  sources: ArticleSource[];
  canonical: string;
}

export const articles: Article[] = [
  {
    slug: "acheter-vin-direct-producteur-allier",
    title: "Acheter du vin en direct dans l’Allier : comment faire sa demande au domaine ?",
    seoTitle: "Achat de vin en direct dans l’Allier",
    description:
      "Cuvée, quantité, tarif et livraison : les informations à préparer pour demander du vin directement aux Terrasses du Roty, à Saulcet.",
    excerpt:
      "Cuvée, quantité, tarif et livraison : les informations à préparer pour demander du vin directement aux Terrasses du Roty, à Saulcet.",
    category: "Achat direct",
    bodyHtml:
      '<p>Pour acheter du vin directement auprès des Terrasses du Roty, le premier pas est une demande au domaine. Vous indiquez la cuvée qui vous intéresse, une quantité estimée et vos coordonnées. Cet échange permet de préciser les disponibilités, le tarif et les modalités possibles. <strong>L’envoi du formulaire ne confirme pas un achat et ne déclenche aucun paiement.</strong></p>\n<h2>Commencer par le vin que l’on recherche</h2>\n<p>Une demande peut être très précise : un millésime déjà découvert, un nombre de bouteilles souhaité, une destination. Elle peut aussi partir d’une simple envie de connaître le domaine. Il n’est pas nécessaire de maîtriser le vocabulaire de la dégustation pour prendre contact.</p>\n<p>Les Terrasses du Roty présentent une Syrah cultivée à Saulcet, dans l’Allier, sur sept terrasses en pierre sèche. <sup><a href="#source-1" aria-label="Source 1">[1]</a></sup> Cette identité donne un premier repère. Pour choisir un millésime, mieux vaut ensuite s’appuyer sur sa fiche et sur les informations du domaine plutôt que supposer que deux années seront identiques.</p>\n<p>Dans votre message, vous pouvez préciser que vous avez déjà goûté un millésime ou, au contraire, que vous souhaitez découvrir la cuvée. Une demande de conseil est aussi légitime qu’une demande portant sur une référence exacte.</p>\n<h2>Indiquer une quantité sans présumer du stock</h2>\n<p>Mentionner une quantité estimée aide le domaine à répondre utilement. Cela ne signifie pas que les bouteilles sont mises de côté dès l’envoi du formulaire. La disponibilité doit être confirmée lors de l’échange.</p>\n<p>De même, ne partez pas du principe qu’un conditionnement particulier est imposé ou qu’un coffret existe. Pour une demande précise, décrivez simplement ce dont vous avez besoin. Le domaine pourra alors vous indiquer ce qui est possible, sans vous faire parcourir un catalogue d’options qui ne vous concernent pas.</p>\n<h2>Vérifier le montant et les modalités avant de confirmer</h2>\n<p>Le prix d’une bouteille ne suffit pas toujours à comprendre le montant final d’un achat. Avant d’accepter une proposition, demandez un récapitulatif clair : cuvée, millésime, quantité, prix applicable et éventuels frais de transport.</p>\n<p>Une demande d’expédition doit aussi être confirmée. Le pays et le code postal permettent de commencer l’échange sans communiquer immédiatement une adresse complète. Pour un retrait, prenez contact avant de vous déplacer : la présence d’un domaine dans une commune ne constitue pas un horaire d’ouverture ni une réservation de rendez-vous.</p>\n<p>Cette étape n’a pas besoin d’être compliquée. Elle sert simplement à éviter les malentendus entre une disponibilité envisagée et une proposition effectivement acceptée.</p>\n<h2>Un exemple de message utile</h2>\n<p>« Bonjour, je souhaite découvrir votre Syrah. Pourriez-vous me préciser les millésimes disponibles et les conditions pour quelques bouteilles ? Une expédition serait à envisager en France. Je peux vous communiquer mon code postal pour étudier cette possibilité. »</p>\n<p>Vous pouvez remplacer cette demande de découverte par le nom d’une cuvée déjà choisie. Inutile de transmettre des informations de paiement dans le formulaire ou dans un premier message.</p>\n<h2>Questions fréquentes</h2>\n<h3>Dois-je créer un compte pour me renseigner ?</h3>\n<p>Non. Le parcours de demande est conçu pour échanger directement avec le domaine, sans compte client ni passage par un panier.</p>\n<h3>Le formulaire réserve-t-il automatiquement les bouteilles ?</h3>\n<p>Non. Il transmet votre intérêt et les informations nécessaires à une réponse. Les disponibilités et les conditions restent à confirmer avec le domaine.</p>\n<h3>Puis-je demander un conseil sans choisir de millésime ?</h3>\n<p>Oui. Indiquez simplement que vous souhaitez être conseillé. Vous pourrez choisir après avoir reçu les informations utiles.</p>\n<p>Pour comparer les références présentées, consultez la <a href="/vins/cuvee-2024/">cuvée 2024</a> et la <a href="/vins/cuvee-2023/">cuvée 2023</a>. Leur présentation ne préjuge pas du stock actuel. Vous pourrez ensuite <a href="/demande/?profil=particulier&amp;objet=bouteilles">adresser votre demande au domaine</a>.</p>\n<p><em>L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</em></p>\n<section aria-labelledby="article-sources"><h2 id="article-sources">Sources et références</h2><ol>\n<li id="source-1"><a href="/vins/cuvee-2024/">Présentation des cuvées des Terrasses du Roty</a></li>\n</ol></section>',
    readingMinutes: 3,
    relatedPath: "/demande/",
    relatedLabel: "Adresser une demande au domaine",
    image: "/assets/img/img-2855-1600.jpg",
    imageAlt: "Bouteilles des Terrasses du Roty dans leur carton",
    sources: [
      {
        label: "Présentation des cuvées des Terrasses du Roty",
        url: "/vins/cuvee-2024/",
      },
    ],
    canonical: "https://www.les-terrasses-du-roty.fr/journal/acheter-vin-direct-producteur-allier/",
  },
  {
    slug: "vin-bio-pres-saint-pourcain",
    title: "Vin bio près de Saint-Pourçain : les repères pour choisir sans confusion",
    seoTitle: "Vin bio près de Saint-Pourçain : les repères utiles",
    description:
      "Origine, certification, cépage et millésime : les points à vérifier pour choisir un vin bio près de Saint-Pourçain sans confondre lieu et appellation.",
    excerpt:
      "Origine, certification, cépage et millésime : les points à vérifier pour choisir un vin bio près de Saint-Pourçain sans confondre lieu et appellation.",
    category: "Comprendre le vin",
    bodyHtml:
      '<p>Chercher un vin bio près de Saint-Pourçain revient à croiser plusieurs critères. <strong>Le lieu de production, la certification biologique et le cépage sont trois informations distinctes.</strong> Les vérifier séparément permet de choisir une bouteille pour ce qu’elle est réellement, plutôt que pour l’impression donnée par une formule publicitaire.</p>\n<h2>Le bio concerne une méthode de production</h2>\n<p>La production biologique européenne repose sur des règles encadrant les pratiques et les substances autorisées. Des dispositions spécifiques concernent aussi la vinification. Le mot « bio » ne signifie donc pas automatiquement « sans aucun traitement » ou « sans sulfites ». <sup><a href="#source-1" aria-label="Source 1">[1]</a></sup></p>\n<p>Pour comparer deux vins, partez de la cuvée exacte. Quel produit est concerné ? Quel millésime ? Quelles indications figurent sur l’étiquette et dans les documents du domaine ? Un engagement présenté à l’échelle d’un vignoble ne doit pas conduire à attribuer soi-même une certification à toutes les bouteilles qui portent son nom.</p>\n<p>Le bon réflexe est simple : demander le justificatif correspondant au vin envisagé lorsqu’il s’agit d’un critère important de votre achat. Cette question ne remet pas en cause le travail du vigneron ; elle permet de comprendre précisément ce qui est annoncé.</p>\n<h2>Le lieu ne suffit pas à attribuer une appellation</h2>\n<p>Saint-Pourçain désigne notamment une appellation dont les règles ne se limitent pas à une position sur une carte. Pour ses vins rouges, le cahier des charges consulté prévoit le gamay et le pinot noir. <sup><a href="#source-2" aria-label="Source 2">[2]</a></sup></p>\n<p>Il faut donc distinguer une vigne située dans ce secteur et un vin bénéficiant effectivement de cette appellation. Le cépage et la dénomination indiqués sur la bouteille apportent un éclairage que le seul nom d’une commune ne donne pas.</p>\n<p>Aux Terrasses du Roty, la présentation du projet met en avant la Syrah et le lieu de Saulcet, dans l’Allier. <sup><a href="#source-3" aria-label="Source 3">[3]</a></sup> Pour connaître la dénomination précise et les justificatifs d’une cuvée, référez-vous à ses informations propres plutôt que de lui attribuer une catégorie par proximité géographique.</p>\n<h2>Le label ne décrit pas à lui seul le goût</h2>\n<p>Un critère de production peut orienter votre choix sans répondre à toutes vos questions de dégustation. Deux vins recherchés pour leur démarche biologique ne sont pas nécessairement faits pour le même usage ou pour les mêmes préférences.</p>\n<p>Expliquez au domaine ce que vous cherchez. Avez-vous déjà apprécié un de ses millésimes ? Souhaitez-vous connaître les caractéristiques d’une nouvelle cuvée ? Avez-vous besoin de conseils de service ? Ces questions complètent la lecture d’un certificat ; elles ne la remplacent pas.</p>\n<p>La fiche du millésime doit servir de point de départ. Elle évite de transposer une description ancienne à une bouteille différente ou de reprendre des arômes supposés à partir du seul cépage.</p>\n<h2>Préparer un échange précis avec le domaine</h2>\n<p>Vous pouvez demander, dans un même message, le millésime disponible, sa dénomination, les informations relatives à sa certification et les modalités d’achat. Il n’est pas nécessaire de demander un dossier technique exhaustif pour quelques bouteilles : indiquez simplement les critères décisifs pour vous.</p>\n<p>La réponse la plus utile est celle qui vous permet de relier les informations reçues à une cuvée identifiable. Une photographie d’étiquette et une fiche à jour valent mieux qu’une série de qualificatifs généraux.</p>\n<h2>Questions fréquentes</h2>\n<h3>« Bio » et « sans sulfites » veulent-ils dire la même chose ?</h3>\n<p>Non. La réglementation biologique encadre notamment les pratiques de vinification ; elle ne se résume pas à une absence de sulfites. <sup><a href="#source-1" aria-label="Source 1">[1]</a></sup></p>\n<h3>Une Syrah de Saulcet est-elle automatiquement une AOC Saint-Pourçain ?</h3>\n<p>Non. Il faut distinguer le lieu des vignes et la dénomination réglementaire du vin. Pour aller plus loin, consultez notre <a href="/journal/syrah-saulcet-allier/">article sur la Syrah à Saulcet</a>.</p>\n<p><a href="/vins/">Découvrir les cuvées du Roty</a> et <a href="/demande/">demander leurs informations au domaine</a>.</p>\n<p><em>L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</em></p>\n<section aria-labelledby="article-sources"><h2 id="article-sources">Sources et références</h2><ol>\n<li id="source-1"><a href="https://agriculture.ec.europa.eu/farming/organic-farming/organic-production-and-products_fr">Commission européenne : production et produits biologiques</a></li>\n<li id="source-2"><a href="https://info.agriculture.gouv.fr/boagri/document_administratif-d6b47c4c-cb0b-4dc6-bbb3-1b43b652eb30/telechargement">Cahier des charges AOC Saint-Pourçain, mai 2025</a></li>\n<li id="source-3"><a href="/domaine/">Présentation du domaine</a></li>\n</ol></section>',
    readingMinutes: 4,
    relatedPath: "/vins/",
    relatedLabel: "Découvrir les cuvées",
    image: "/assets/img/img-9683-1600.jpg",
    imageAlt: "Travail dans les vignes des Terrasses du Roty",
    sources: [
      {
        label: "Commission européenne : production et produits biologiques",
        url: "https://agriculture.ec.europa.eu/farming/organic-farming/organic-production-and-products_fr",
      },
      {
        label: "Cahier des charges AOC Saint-Pourçain, mai 2025",
        url: "https://info.agriculture.gouv.fr/boagri/document_administratif-d6b47c4c-cb0b-4dc6-bbb3-1b43b652eb30/telechargement",
      },
      {
        label: "Présentation du domaine",
        url: "/domaine/",
      },
    ],
    canonical: "https://www.les-terrasses-du-roty.fr/journal/vin-bio-pres-saint-pourcain/",
  },
  {
    slug: "vignes-terrasses-pierre-seche-roty",
    title: "Vignes en terrasses et pierre sèche : comprendre le paysage du Roty",
    seoTitle: "Vignes en terrasses et pierre sèche | Les Terrasses du Roty",
    description:
      "À Saulcet, les terrasses du Roty donnent son nom au projet viticole. Découvrez le lien entre ce paysage, sa restauration et le choix de la Syrah.",
    excerpt:
      "À Saulcet, les terrasses du Roty donnent son nom au projet viticole. Découvrez le lien entre ce paysage, sa restauration et le choix de la Syrah.",
    category: "Le lieu",
    bodyHtml:
      '<p>Au Roty, les terrasses ne sont pas un simple motif de communication : elles donnent son nom au projet et un point de départ à son histoire. Le domaine présente sept terrasses en pierre sèche, à Saulcet, dans l’Allier. <sup><a href="#source-2" aria-label="Source 2">[2]</a></sup> Pour comprendre le vin, on peut commencer par regarder ce paysage et la place que la vigne y occupe.</p>\n<h2>Une pente organisée en surfaces cultivées</h2>\n<p>Une terrasse viticole forme un niveau de culture aménagé dans une pente. Le terme « pierre sèche » désigne un assemblage de pierres sans mortier. <sup><a href="#source-3" aria-label="Source 3">[3]</a></sup> Le mur, la surface cultivée et les passages composent ensemble un espace de travail, pas seulement une vue.</p>\n<p>Cela explique l’intérêt de regarder les terrasses à plusieurs échelles. Une vue d’ensemble montre leur disposition. Une photographie rapprochée permet de distinguer la matière du mur. Une image prise au niveau des vignes rend la hauteur, l’accès et les circulations plus compréhensibles.</p>\n<p>Ces observations ne décrivent pas, à elles seules, les qualités d’un vin. Elles aident en revanche à comprendre pourquoi ce lieu mérite d’être présenté autrement qu’à travers une photographie de bouteille.</p>\n<h2>Le Roty : remettre un lieu en culture</h2>\n<p>Le récit publié par le domaine situe le début du projet en octobre 2021. Il évoque la rencontre d’un passionné avec François Ray et Alexandre Pinet, du Domaine Ray, puis la découverte de terrasses gagnées par la végétation. La restauration du lieu et la plantation de vigne deviennent le fil conducteur de cette aventure. <sup><a href="#source-1" aria-label="Source 1">[1]</a></sup></p>\n<p>Cette histoire donne un sens concret au nom Les Terrasses du Roty. Le sujet n’est pas seulement de produire un vin dans une région viticole : il est aussi de redonner une fonction à un paysage délaissé.</p>\n<p>Pour raconter ce travail, les images documentaires sont précieuses. Un état ancien, un détail de mur et une vue du lieu cultivé permettent de suivre une transformation sans la remplacer par des superlatifs. Chaque photographie gagne à être accompagnée de son contexte et, lorsqu’elle est connue, de sa date.</p>\n<h2>Pourquoi le choix de la Syrah compte</h2>\n<p>Les Terrasses du Roty présentent une cuvée 100 % Syrah. <sup><a href="#source-2" aria-label="Source 2">[2]</a></sup> Ce choix ajoute une seconde porte d’entrée au récit : après le lieu, le cépage. Les deux informations se complètent sans se confondre.</p>\n<p>Dire « sept terrasses » renseigne sur l’identité du projet. Dire « Syrah » renseigne sur le raisin mis en avant. Pour connaître un millésime, il faut encore regarder ses informations propres et les choix de vinification communiqués par le domaine.</p>\n<p>Il serait trop rapide de transformer la présence d’un mur en explication automatique d’un arôme. Une présentation précise distingue ce que l’on voit dans le paysage, ce qui est documenté dans le travail de la vigne et ce qui est décrit pour la bouteille.</p>\n<h2>Lire le paysage sans lui ajouter de légende</h2>\n<p>La pierre sèche invite facilement aux grands récits. Pourtant, une histoire exacte est souvent plus intéressante qu’une ancienneté supposée. La date d’un mur, l’origine de ses pierres ou l’étendue d’une restauration doivent être documentées avant d’être affirmées.</p>\n<p>Au Roty, le point de départ suffit déjà : un lieu identifié, des terrasses et un projet viticole qui leur donne une nouvelle place. Ce sont ces éléments concrets que le journal du domaine peut montrer au fil de ses publications.</p>\n<h2>Questions fréquentes</h2>\n<h3>Toutes les terrasses correspondent-elles à une cuvée différente ?</h3>\n<p>La présentation de sept terrasses ne signifie pas qu’il existe sept vins commercialisés séparément. Les références disponibles sont celles annoncées par le domaine.</p>\n<h3>Peut-on venir voir les terrasses ?</h3>\n<p>Une présentation du paysage ne constitue pas une offre de visite. Prenez contact avec le domaine pour savoir si un accueil peut être envisagé, avant tout déplacement.</p>\n<p><a href="/terrasses-pierre-seche/">Découvrir le lieu et son histoire</a> puis <a href="/vins/">les cuvées des Terrasses du Roty</a>.</p>\n<p><em>L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</em></p>\n<section aria-labelledby="article-sources"><h2 id="article-sources">Sources et références</h2><ol>\n<li id="source-1"><a href="/domaine/">L’origine des Terrasses du Roty, récit publié par le domaine</a></li>\n<li id="source-2"><a href="/vins/cuvee-2024/">Présentation des cuvées et des sept terrasses</a></li>\n<li id="source-3"><a href="https://ich.unesco.org/fr/RL/l-art-de-la-construction-en-pierre-seche-savoir-faire-et-techniques-02106">UNESCO : l’art de la construction en pierre sèche, savoir-faire et techniques</a></li>\n</ol></section>',
    readingMinutes: 4,
    relatedPath: "/terrasses-pierre-seche/",
    relatedLabel: "Découvrir les terrasses",
    image: "/assets/img/dji-0086-1600.jpg",
    imageAlt: "Vue du chantier de restauration des terrasses du Roty",
    sources: [
      {
        label: "L’origine des Terrasses du Roty, récit publié par le domaine",
        url: "/domaine/",
      },
      {
        label: "Présentation des cuvées et des sept terrasses",
        url: "/vins/cuvee-2024/",
      },
      {
        label: "UNESCO : l’art de la construction en pierre sèche, savoir-faire et techniques",
        url: "https://ich.unesco.org/fr/RL/l-art-de-la-construction-en-pierre-seche-savoir-faire-et-techniques-02106",
      },
    ],
    canonical: "https://www.les-terrasses-du-roty.fr/journal/vignes-terrasses-pierre-seche-roty/",
  },
  {
    slug: "syrah-saulcet-allier",
    title: "Une Syrah à Saulcet : comprendre le choix des Terrasses du Roty",
    seoTitle: "Syrah à Saulcet, dans l’Allier | Les Terrasses du Roty",
    description:
      "Un lieu, un cépage, un millésime : découvrez les repères pour comprendre la Syrah des Terrasses du Roty sans confondre localisation et appellation.",
    excerpt:
      "Un lieu, un cépage, un millésime : découvrez les repères pour comprendre la Syrah des Terrasses du Roty sans confondre localisation et appellation.",
    category: "La Syrah",
    bodyHtml:
      '<p>Les Terrasses du Roty présentent une cuvée 100 % Syrah issue de vignes situées à Saulcet, dans l’Allier. <sup><a href="#source-1" aria-label="Source 1">[1]</a></sup> Pour la découvrir, trois repères sont utiles : <strong>le lieu des vignes, le cépage et le millésime</strong>. Ils permettent de poser les bonnes questions, sans attribuer au vin des caractéristiques que sa fiche ne confirme pas.</p>\n<h2>Une identité qui commence par le lieu</h2>\n<p>Le Roty s’appuie sur un paysage de terrasses en pierre sèche. Ce nom invite à regarder d’abord la parcelle et le projet viticole, avant de chercher une catégorie dans un catalogue.</p>\n<p>Cette manière de présenter le vin offre une lecture concrète : où se trouvent les vignes, quel raisin est cultivé, quelle cuvée est proposée ? Le récit du lieu apporte du contexte. La fiche du vin doit, elle, apporter les informations propres à la bouteille.</p>\n<p>Les deux niveaux sont complémentaires. Une page sur l’histoire des terrasses ne doit pas remplacer les informations pratiques d’une cuvée ; une fiche technique ne raconte pas à elle seule pourquoi ce lieu a été remis en culture.</p>\n<h2>Ce que signifie « 100 % Syrah »</h2>\n<p>Dans la présentation du Roty, cette expression indique un vin élaboré à partir de ce seul cépage. <sup><a href="#source-1" aria-label="Source 1">[1]</a></sup> C’est un repère utile pour un amateur qui cherche une Syrah, mais ce n’est pas une description complète du résultat en bouteille.</p>\n<p>Pour aller plus loin, demandez les informations du millésime qui vous intéresse : caractéristiques présentées par le domaine, mode d’élevage, degré acquis et conseils de service lorsqu’ils sont disponibles. Évitez de reprendre automatiquement les notes d’une autre cuvée ou d’un autre producteur.</p>\n<p>Un cépage peut être le point de départ de votre curiosité. La décision d’achat gagne ensuite à porter sur une référence précise plutôt que sur une réputation générale.</p>\n<h2>Saulcet et Saint-Pourçain : une distinction à connaître</h2>\n<p>La localisation des vignes et l’appellation d’un vin ne sont pas interchangeables. Le cahier des charges de l’AOC Saint-Pourçain prévoit le gamay et le pinot noir pour les vins rouges. <sup><a href="#source-2" aria-label="Source 2">[2]</a></sup> La mention d’une Syrah à Saulcet ne doit donc pas être lue comme une attribution de cette appellation.</p>\n<p>La bonne information à consulter est la dénomination figurant réellement sur l’étiquette et sur la fiche correspondante. Il n’est pas nécessaire de deviner : le domaine peut préciser les informations de la cuvée envisagée.</p>\n<p>Cette distinction ne constitue pas un classement de qualité. Elle permet simplement de nommer correctement le vin. Un choix personnel peut ensuite porter sur le cépage, le travail présenté ou le millésime, en connaissance de cause.</p>\n<h2>Choisir une cuvée, pas une ancienne annonce</h2>\n<p>Une page consacrée à un millésime peut rester utile après sa commercialisation. Elle devient alors un repère documentaire et ne prouve plus, à elle seule, que des bouteilles sont disponibles.</p>\n<p>Avant de faire votre choix, demandez quelle référence est proposée actuellement. Une annonce ancienne de précommande ou une description d’une récolte passée ne remplace pas cette confirmation. Vous pourrez ainsi relier le récit du domaine à une proposition précise.</p>\n<h2>Questions fréquentes</h2>\n<h3>Les cuvées 2023 et 2024 sont-elles nécessairement identiques ?</h3>\n<p>Il ne faut pas transposer automatiquement les informations d’un millésime à l’autre. Consultez la fiche correspondante et demandez les précisions utiles au domaine.</p>\n<h3>Puis-je demander la fiche avant de décider ?</h3>\n<p>Oui. Le formulaire permet de commencer par une demande d’information. Aucun paiement en ligne n’est nécessaire pour prendre contact.</p>\n<p><a href="/vins/">Voir les cuvées</a> ou <a href="/demande/">demander les informations du millésime qui vous intéresse</a>.</p>\n<p><em>L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</em></p>\n<section aria-labelledby="article-sources"><h2 id="article-sources">Sources et références</h2><ol>\n<li id="source-1"><a href="/vins/cuvee-2024/">Présentation de la cuvée du Roty</a></li>\n<li id="source-2"><a href="https://info.agriculture.gouv.fr/boagri/document_administratif-d6b47c4c-cb0b-4dc6-bbb3-1b43b652eb30/telechargement">Cahier des charges AOC Saint-Pourçain, mai 2025</a></li>\n</ol></section>',
    readingMinutes: 3,
    relatedPath: "/vins/",
    relatedLabel: "Consulter les cuvées",
    image: "/assets/img/img-2855-1600.jpg",
    imageAlt: "Bouteilles des Terrasses du Roty dans leur carton",
    sources: [
      {
        label: "Présentation de la cuvée du Roty",
        url: "/vins/cuvee-2024/",
      },
      {
        label: "Cahier des charges AOC Saint-Pourçain, mai 2025",
        url: "https://info.agriculture.gouv.fr/boagri/document_administratif-d6b47c4c-cb0b-4dc6-bbb3-1b43b652eb30/telechargement",
      },
    ],
    canonical: "https://www.les-terrasses-du-roty.fr/journal/syrah-saulcet-allier/",
  },
  {
    slug: "cavistes-restaurateurs-syrah-roty",
    title: "Cavistes et restaurateurs : préparer une demande pour la Syrah du Roty",
    seoTitle: "Référencer une Syrah : le guide pro",
    description:
      "Caviste ou restaurateur : préparez votre demande de fiche cuvée, tarif et approvisionnement en Syrah auprès des Terrasses du Roty, dans l’Allier.",
    excerpt:
      "Caviste ou restaurateur : préparez votre demande de fiche cuvée, tarif et approvisionnement en Syrah auprès des Terrasses du Roty, dans l’Allier.",
    category: "Professionnels",
    bodyHtml:
      '<p>Vous êtes caviste ou restaurateur et souhaitez vous renseigner sur Les Terrasses du Roty ? Une demande professionnelle utile commence par votre établissement, la référence qui vous intéresse et un ordre de grandeur de votre besoin. <strong>Elle ouvre un échange : elle ne vaut ni allocation de bouteilles, ni accord sur un tarif ou une exclusivité.</strong></p>\n<h2>Partir d’une référence identifiable</h2>\n<p>Le domaine présente une Syrah cultivée à Saulcet, dans l’Allier, sur un ensemble de sept terrasses en pierre sèche. <sup><a href="#source-1" aria-label="Source 1">[1]</a></sup> Ce sont des premiers éléments de présentation. Pour étudier un référencement, il faut les compléter par les informations de la cuvée et du millésime envisagés.</p>\n<p>Demandez une fiche à jour : dénomination exacte, composition annoncée, contenance, degré acquis, éléments de vinification et caractéristiques décrites par le domaine. Les justificatifs d’une certification doivent correspondre au produit que vous pourriez proposer à vos clients.</p>\n<p>Ce travail évite de transformer un récit de domaine en argument technique approximatif. Il permet aussi de préparer une présentation cohérente entre la carte, la fiche de rayon et les informations reçues du producteur.</p>\n<h2>Expliquer votre besoin plutôt que demander seulement un prix</h2>\n<p>Le nom de l’établissement, son activité et sa localisation donnent un premier contexte. Vous pouvez ensuite préciser s’il s’agit d’une découverte, d’un référencement envisagé ou d’une demande portant sur un millésime déjà connu.</p>\n<p>Une quantité estimée et un horizon de besoin permettent d’engager une discussion concrète. Ces indications n’obligent pas à annoncer un volume annuel irréaliste. Une première prise de contact peut rester exploratoire, à condition que cela soit clair.</p>\n<p>Il n’est pas nécessaire de transmettre des informations sensibles au premier message. Les données nécessaires à une éventuelle facturation pourront être demandées au moment approprié.</p>\n<h2>Caviste : situer le vin dans votre sélection</h2>\n<p>Expliquez ce que vous cherchez à compléter dans votre cave : une origine de l’Allier, un cépage ou un millésime découvert auparavant. Précisez votre besoin initial, votre code postal et les informations nécessaires à la présentation en rayon. Notre <a href="/professionnels/#cavistes">espace cavistes</a> rassemble les points utiles pour ce premier échange en direct avec le domaine.</p>\n<h2>Restaurateur : partir de votre carte et du service</h2>\n<p>Présentez votre cuisine, les plats concernés et le service envisagé au verre ou à la bouteille. Demandez les repères de dégustation et de service propres au millésime, sans déduire un accord précis du seul cépage Syrah. Indiquez la période de votre carte et une quantité estimative : les possibilités de livraison et de réassort restent à discuter. Retrouvez ces repères dans notre <a href="/professionnels/#restaurateurs">espace restaurateurs</a>.</p>\n<h2>Comparer une proposition complète</h2>\n<p>Un prix isolé ne permet pas toujours de comparer deux propositions. Demandez sur quelle base il est exprimé, pour quel conditionnement et quelles quantités. Faites préciser les éventuels frais de transport, les modalités de règlement et les délais réellement envisageables.</p>\n<p>Aucun minimum de commande, tarif professionnel ou avantage particulier ne doit être supposé avant la réponse du domaine. De même, une possibilité d’approvisionnement à une date donnée ne constitue pas une garantie de réassort permanent.</p>\n<p>Pour une carte de restaurant ou un assortiment de cave, cette distinction peut compter autant que le prix : la manière de présenter et de renouveler une référence dépend des disponibilités effectivement confirmées.</p>\n<h2>Préparer la présentation à vos clients</h2>\n<p>Lorsque vous disposez de la fiche et de la dénomination exactes, reprenez les informations validées sans les amplifier. Le lieu de Saulcet, la Syrah et le récit des terrasses offrent déjà une matière précise. Inutile d’y ajouter une appellation, une médaille ou une pratique non documentée.</p>\n<p>Une photographie adaptée et un texte bref peuvent ensuite présenter la référence de manière cohérente. Demandez au domaine quels visuels et informations peuvent être utilisés, notamment pour éviter de représenter un ancien millésime comme celui qui sera proposé.</p>\n<h2>Un premier message efficace</h2>\n<p>« Bonjour, nous sommes un établissement professionnel et souhaitons nous renseigner sur votre Syrah. Pourriez-vous nous indiquer le millésime disponible, sa fiche et les modalités envisageables pour un premier approvisionnement ? Nous pouvons vous préciser notre localisation, la quantité estimée et la date souhaitée. »</p>\n<p>Ce message ouvre la discussion sans présumer de conditions commerciales qui n’ont pas encore été établies.</p>\n<h2>Questions fréquentes</h2>\n<h3>Une demande professionnelle garantit-elle un tarif particulier ?</h3>\n<p>Non. Les conditions doivent être précisées directement avec le domaine en fonction de la demande et de l’offre réelle.</p>\n<h3>Peut-on demander une dégustation ou un échantillon ?</h3>\n<p>Vous pouvez poser la question. Leur possibilité, leur organisation et leurs éventuels coûts ne sont pas acquis avant la réponse du domaine.</p>\n<p><a href="/professionnels/">Présenter votre établissement au domaine</a> ou <a href="/vins/">consulter les cuvées</a>.</p>\n<p><em>L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</em></p>\n<section aria-labelledby="article-sources"><h2 id="article-sources">Sources et références</h2><ol>\n<li id="source-1"><a href="/vins/cuvee-2024/">Présentation du vin et du lieu par Les Terrasses du Roty</a></li>\n</ol></section>',
    readingMinutes: 4,
    relatedPath: "/professionnels/",
    relatedLabel: "Présenter votre établissement",
    image: "/assets/img/img-2855-1600.jpg",
    imageAlt: "Bouteilles des Terrasses du Roty dans leur carton",
    sources: [
      {
        label: "Présentation du vin et du lieu par Les Terrasses du Roty",
        url: "/vins/cuvee-2024/",
      },
    ],
    canonical: "https://www.les-terrasses-du-roty.fr/journal/cavistes-restaurateurs-syrah-roty/",
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
