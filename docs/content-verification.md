# Vérification éditoriale du 9 septembre 2026

## Périmètre et résultat

Les cinq articles de `mission/roty-refonte-noir-or/articles.json` ont été lus intégralement, puis rapprochés des cinq fichiers Markdown. Le contrôle automatisé avant conversion a confirmé l’identité du corps des articles JSON et Markdown. Le fichier de production `src/content/articles.ts` contient les cinq textes complets, les métadonnées utiles au lecteur et les sources. Les consignes de publication, mots-clés d’étude, volumes supposés, auteur proposé et date de préparation ne sont pas des éléments publiés.

Les corps HTML sont construits à partir de texte échappé, avec des paragraphes, H2/H3, emphases et liens. Aucun H1 dupliqué, script, iframe ou attribut d’événement. Les notes `[1]`, `[2]`, etc. deviennent des liens de référence accessibles vers une liste de sources. Le temps de lecture est une estimation de présentation calculée à 200 mots/minute, arrondie au supérieur ; ce n’est pas une mesure d’audience.

Aucun auteur, `datePublished` ou `dateModified` n’est inventé. La date de préparation des fichiers sources ne représente pas une publication effective. Les URLs canoniques correspondent à la cible de production définie par le propriétaire ; leur présence dans ces données ne prouve pas un déploiement.

## Relecture et modifications précises

| Article | Intervention |
|---|---|
| Acheter du vin en direct dans l’Allier | Texte complet conservé, y compris distinction entre demande, réservation et achat. Source de cuvée renvoyée vers `/vins/cuvee-2024/`. |
| Vin bio près de Saint-Pourçain | Texte complet conservé après vérification des sources européennes et du cahier des charges. Aucune certification attribuée aux cuvées du Roty. Source de présentation du domaine renvoyée vers `/domaine/`. |
| Vignes en terrasses et pierre sèche | Texte complet conservé. Ajout d’un appel de source et d’un lien UNESCO à la définition de la pierre sèche. Le récit de 2021 reste attribué au récit historique du domaine ; il ne transforme pas les noms cités en rôles actuels. Source historique renvoyée vers `/domaine/`. |
| Une Syrah à Saulcet | Texte complet conservé après vérification de l’encépagement rouge de l’AOC. Aucune appellation ni dénomination alternative supposée. Source de cuvée renvoyée vers `/vins/cuvee-2024/`. |
| Cavistes et restaurateurs | Texte complet conservé, sans remise, allocation, réassort, dégustation ni échantillon promis. Source de cuvée renvoyée vers `/vins/cuvee-2024/`. |

Les autres liens fournis pointaient déjà vers `/vins/`, `/demande/`, `/professionnels/`, `/terrasses-pierre-seche/` et `/journal/syrah-saulcet-allier/`. Les anciennes URLs documentaires consultées restent ci-dessous pour assurer la traçabilité après migration ; elles ne sont pas exposées comme liens de boutique dans les nouveaux articles.

## Sources primaires consultées

Toutes les sources suivantes ont été lues le 9 septembre 2026. Les pages du domaine représentent ses propres déclarations, pas une preuve indépendante de stock, de certification ou d’offre actuelle.

- [Site public du domaine](https://www.les-terrasses-du-roty.fr/) : Saulcet, terrasses et Syrah corroborés par sa présentation. Ses affirmations bio, son tarif et ses modalités commerciales historiques ne sont pas reconduits dans les cinq articles.
- [Fiche historique de la cuvée 2024](https://www.les-terrasses-du-roty.fr/products/cuvee-2024-les-terrasses-du-roty-precommande) : cuvée 2024, 100 % Syrah et sept terrasses présents. La fiche se dit prévisionnelle ; degré estimé, novembre 2025, volume limité et prix ne deviennent pas des promesses actuelles.
- [L’origine des Terrasses du Roty](https://www.les-terrasses-du-roty.fr/blogs/infos/l-origine-des-terrasses-du-roty), billet daté du 7 août 2025 : le récit situe le démarrage en octobre 2021, cite François Ray et Alexandre Pinet du Domaine Ray et décrit la découverte puis la restauration de terrasses. Aucun rôle actuel n’en est déduit.
- [Journal de vigne existant](https://www.les-terrasses-du-roty.fr/blogs/infos) : quatre billets historiques repérés (vinification, origine, Syrah, vendanges 2024). Le nouveau billet Syrah constitue l’équivalent éditorial pertinent de l’ancien sujet ; la migration doit éviter deux versions indexables concurrentes.
- [Ministère de l’Agriculture, cahier des charges Saint-Pourçain](https://info.agriculture.gouv.fr/boagri/document_administratif-d6b47c4c-cb0b-4dc6-bbb3-1b43b652eb30/telechargement), homologué par arrêté du 26 mai 2025, publié au BO le 12 juin 2025 : chapitre I, V, page 1, seuls gamay N et pinot noir N sont énumérés pour les vins rouges. Cela étaye la distinction entre localisation à Saulcet et attribution d’AOC à une Syrah ; cela ne révèle pas la dénomination du Roty.
- [Commission européenne, production et produits biologiques](https://agriculture.ec.europa.eu/farming/organic-farming/organic-production-and-products_fr), section sur le vin : règles spécifiques de vinification, restrictions et teneurs en sulfites. Confirme que bio et absence de sulfites ne sont pas synonymes. Aucun certificat opérateur/cuvée du Roty n’a été consulté.
- [UNESCO, art de la construction en pierre sèche](https://ich.unesco.org/fr/RL/l-art-de-la-construction-en-pierre-seche-savoir-faire-et-techniques-02106) : confirme la définition générale d’une construction sans liant. Aucune protection, inscription UNESCO ou ancienneté n’est attribuée aux terrasses du Roty.

## Lecture des fichiers d’étiquette fournis

Lecture PDF avec le skill PDF, extraction `pypdf` puis rendu de toutes les pages avec Poppler et inspection visuelle. Sources originales préservées ; aucun de ces fichiers n’a été retouché ou incorporé comme nouvelle photographie de produit.

| Source locale, 1 page par PDF | Mentions effectivement visibles | Limite |
|---|---|---|
| `/Users/maxcorre/Desktop/DMERX/CDR/ETIQUETTE/LES TERRASSES DU ROTY  etiquette_01.pdf` | Face noire, symbole or, nom Les Terrasses du Roty, Syrah. | Pas de millésime, degré, contenance, dénomination réglementaire, opérateur, adresse ou certification. |
| `/Users/maxcorre/Desktop/DMERX/CDR/ETIQUETTE/LES TERRASSES DU ROTY  etiquette_02.pdf` | Fond noir avec repères techniques d’impression. | Séparation technique sans mentions produit exploitables. |
| `/Users/maxcorre/Desktop/DMERX/CDR/ETIQUETTE/LES TERRASSES DU ROTY  etiquette_03.pdf` | Symbole or et chiffre 7 avec repères techniques. | Séparation technique sans mentions produit exploitables. |
| `/Users/maxcorre/Desktop/DMERX/CDR/LES TERRASSES DU ROTY mep.pdf` | Planche de variantes du logo ; « Syrah » sur deux variantes, « 2024 » sur plusieurs autres. | Planche de création graphique, pas une contre-étiquette légale finalisée. Aucune donnée réglementaire supplémentaire validée. |

## Visuels associés aux articles

Les associations utilisent uniquement les fichiers déjà présents dans le dépôt. Les légendes décrivent la scène, sans date ou millésime non lisibles : bouteilles dans leur carton (`img-2855`), travail dans les vignes (`img-9683`), chantier de restauration vu d’en haut (`dji-0086`). Les fichiers `mockup-coffret` ne sont pas utilisés pour promettre un coffret commercialisé. Le logo original est conservé par le site ; aucune modification d’image n’est réalisée dans cette sous-tâche.

## Limites à maintenir jusqu’à preuve nouvelle

Pas de prix courant, stock garanti, certificat biologique, AOC attribuée à la Syrah, dénomination de remplacement, médaille, note d’avis, volume de recherches, horaires d’accueil ou modalités de transport supposés. L’état réel du formulaire et de l’envoi d’e-mail doit être rapporté par les tests du serveur, distinctement du présent contrôle de contenu.

## Contrôles exécutés sur les données éditoriales

- Concordance du texte intégral JSON et Markdown des cinq sources : **5/5**.
- Unicité des slugs, cohérence des canoniques, présence des photographies locales : **5/5**.
- Liens internes limités aux routes prévues et notes renvoyant à une ancre présente : **5/5**.
- Absence de H1, script, iframe, gestionnaire d’événement et anciennes routes de boutique dans les corps d’articles : **5/5**.
- ESLint et TypeScript ciblés sur `src/content/articles.ts` et `src/content/site-facts.ts` : **réussis**.
- Le premier essai d’import TypeScript avec Node système 20 a échoué (extension `.ts` inconnue) ; les mêmes contrôles ont ensuite réellement réussi avec le Node du runtime Codex. Ce n’était pas un échec du contenu applicatif.

Les contrôles de rendu serveur, responsive, formulaire et déploiement relèvent de la recette de l’application complète, pas de ces seuls fichiers de données.

## Préservation de deux billets historiques

`src/content/historical-articles.ts` ajoute deux archives distinctes des cinq textes demandés, avec le même contrat de présentation :

- `/journal/vinification-vendanges-maceration-elevage/` reprend les étapes décrites dans [le billet du 11 août 2025](https://www.les-terrasses-du-roty.fr/blogs/infos/l-art-de-la-vinification-vendanges-maceration-et-elevage). Les données de macération/élevage sont attribuées au récit daté, sans généralisation à tous les millésimes. L’allégation « aucun soufre » et la garantie de vin « naturel et pur » ont été retirées faute de fiche propre aux cuvées.
- `/journal/vendanges-2024/` conserve le récit du 5 octobre 2024 publié dans [le billet du 7 août 2025](https://www.les-terrasses-du-roty.fr/blogs/infos/vendanges-2024-une-cuvee-qui-s-annonce-exceptionnelle-%F0%9F%8D%87). Les précommandes, le succès commercial, le stock épuisé, la supériorité du millésime et les conditions climatiques idéales n’ont pas été reconduits ; le nombre de participants n’est pas répété sans contextualisation de la parcelle.

Les textes originaux ont été conservés par l’inventaire de migration `hosting-evidence/old-public-pages.json`, lecture HTTP 200 datée du 9 septembre 2026. Les deux archives exposent leur date de publication historique sous `originalPublishedAt`, explicitement distincte d’une date de publication de la refonte ; les cinq nouveaux articles restent sans date de publication inventée. `allArticles` réunit les sept entrées pour le journal et le sitemap.

ESLint et TypeScript ciblés sur les trois modules éditoriaux passent après ajout des archives. Ces archives sont des adaptations prudentes des billets du domaine, pas une retranscription littérale des promesses commerciales anciennes.
