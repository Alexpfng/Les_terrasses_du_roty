# Recherche SEO et GEO — 3 octobre 2026

## Décision éditoriale

Le travail reprend la méthode publique de PushRank sans abonnement ni copie de son produit : partir des données Search Console, renforcer les pages proches du haut des résultats, couvrir les intentions à valeur réelle, consolider les anciennes URL et mesurer les résultats. Aucune première place ne peut être garantie.

Deux pages distinctes sont ajoutées :

- `/vin-allier/` répond à l’intention locale et commerciale « vin de l’Allier / producteur à Saulcet » ;
- `/vin-syrah/` répond à l’intention nationale et informationnelle « vin Syrah / région / choix / accord ».

Les pages existantes `/vins/`, `/domaine/`, `/professionnels/` et les articles restent les destinations principales pour leurs intentions respectives. Cette séparation évite de créer une série de pages locales quasi identiques.

## Search Console — propriété HTTPS www vérifiée

Fenêtre visible du 8 au 29 septembre 2026, relevée le 3 octobre : **24 clics, 175 impressions, CTR 13,7 %, position moyenne 8,4**.

Pages prioritaires observées :

| Page                                           | Clics | Impressions | Position moyenne |
| ---------------------------------------------- | ----: | ----------: | ---------------: |
| `/`                                            |    21 |          80 |              5,2 |
| `/journal/vin-bio-pres-saint-pourcain/`        |     2 |          32 |             10,2 |
| ancienne fiche Shopify 2024                    |     1 |          19 |              3,6 |
| `/journal/vignes-terrasses-pierre-seche-roty/` |     0 |          35 |              6,4 |
| `/domaine/`                                    |     0 |          22 |              8,0 |
| `/journal/syrah-saulcet-allier/`               |     0 |          19 |              5,9 |
| ancienne fiche Shopify 2023                    |     0 |          16 |              4,0 |
| `/vins/`                                       |     0 |          14 |              3,3 |
| `/vins/cuvee-2024/`                            |     0 |          12 |              3,3 |
| `/professionnels/`                             |     0 |           4 |             13,5 |

Les anciennes fiches Shopify, collections, contact et blog redirigent déjà définitivement vers leurs équivalents canoniques. Les requêtes visibles sont limitées par les règles de confidentialité de Search Console ; le total des clics dépasse donc les lignes de requêtes affichées.

## Keyword Planner — France, français, Google, septembre 2025 à août 2026

Le compte donne des fourchettes, car aucune campagne active ne fournit les statistiques détaillées.

| Mot-clé fourni              | Recherches mensuelles | Variation 3 mois | Variation annuelle | Concurrence Ads |
| --------------------------- | --------------------: | ---------------: | -----------------: | --------------- |
| vin syrah                   |              1 k–10 k |              0 % |                0 % | moyenne         |
| vin bio                     |               100–1 k |              0 % |              -90 % | moyenne         |
| vin allier                  |                10–100 |              0 % |                0 % | faible          |
| vin saint pourçain          |              1 k–10 k |              0 % |                0 % | moyenne         |
| achat vin direct producteur |                10–100 |              0 % |                0 % | moyenne         |
| vin caviste                 |                10–100 |              0 % |                0 % | faible          |

## Ubersuggest — recherche gratuite, France

| Mot-clé                     | Volume estimé | Intention                                       |               Difficulté SEO |
| --------------------------- | ------------: | ----------------------------------------------- | ---------------------------: |
| vin syrah                   |         1 900 | transactionnelle                                |                           12 |
| vin syrah rouge             |           880 | transactionnelle                                |                           12 |
| meilleur vin syrah          |           110 | commerciale, informationnelle, transactionnelle |                           11 |
| achat direct producteur     |           110 | commerciale                                     |                           22 |
| achat vin direct producteur |            90 | navigationnelle, commerciale                    |                           37 |
| vin de l allier             |            70 | informationnelle                                |                           16 |
| vin syrah region            |            50 | non détaillée                                   |                           16 |
| vin allier                  |            40 | non détaillée                                   | 22, donnée signalée ancienne |

Le site ne revendique pas « meilleur vin ». L’intention est couverte par un guide de choix factuel, sans superlatif trompeur.

## AnswerThePublic et Google Trends

AnswerThePublic fait ressortir les formulations « vin syrah quelle région », « quel vin syrah », « quel vin avec syrah », « quoi manger avec vin syrah » et « syrah vin c’est quoi ». La page `/vin-syrah/` répond directement à ces questions, sans généraliser les caractéristiques d’un millésime à un autre.

Sur Google Trends France, cinq dernières années, les indices moyens comparés sont : **vin bio 65**, **vin syrah 21**, **vin saint pourçain 2**, **achat vin direct producteur 0**. Les recherches associées à « vin bio » en progression comprennent « vin nature » (+60 %), mais le site n’emploie pas cette promesse faute de preuve produit actuelle. La requête commerciale longue traîne n’a pas assez de données Trends ; elle reste retenue grâce aux données Keyword Planner et Ubersuggest.

## Contrôles Google et présence locale

- PageSpeed Insights mobile de la page d’accueil : performance **97**, accessibilité **100**, bonnes pratiques **100**, SEO **100** ; FCP 1,5 s, LCP 2,0 s, TBT 0 ms, CLS 0. L’optimisation d’images restante est estimée à 250 Kio et le JavaScript inutilisé à 41 Kio.
- Rich Results Test de la page d’accueil : **1 élément Organization valide**, exploration réussie le 3 octobre 2026 à 13:28.
- Google Business Profile visible : « Les Terrasses du Roty », catégorie établissement vinicole, 5,0/5 sur 3 avis, site correct, téléphone +33 6 21 56 01 17 et adresse 8 Rue Louis Neillot, 03500 Saulcet. Le compte Google ouvert propose « Vous êtes le propriétaire de cet établissement ? » : la fiche n’est donc pas administrable depuis ce compte sans revendication ou ajout d’accès.
- Screaming Frog n’est pas installé sur le poste. Les contrôles du dépôt assurent le même périmètre technique utile : crawl du sitemap, statuts et redirections, titres, descriptions, canoniques, H1, JSON-LD, liens, images, 404/410 et rendu sans JavaScript.
- Yoast est un plugin WordPress et ne s’applique pas à la stack TanStack. Ses contrôles utiles sont couverts par les tests SEO du dépôt et les métadonnées rendues côté serveur.

## Mesure attendue

Conserver un relevé avant/après dans Search Console à 30, 60 et 90 jours : clics, impressions, CTR, position et demandes reçues pour `/`, `/vins/`, `/vin-allier/`, `/vin-syrah/`, `/professionnels/` et les deux articles déjà visibles. Les positions varient selon le lieu, l’appareil et la personnalisation ; aucune place fixe n’est promise.
