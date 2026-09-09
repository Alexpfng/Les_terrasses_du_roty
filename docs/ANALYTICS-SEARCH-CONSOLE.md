# Google Analytics et Search Console — état réel

Configuration et recette de production effectuées le 9 septembre 2026 dans la session Google autorisée du propriétaire, pour le commit `bf7957241ede2b144480b8f781eb35d5db8644b0`. Les propriétés des autres projets n’ont pas été modifiées. Les preuves ci-dessous portent sur cette version déjà publiée ; elles ne valent pas recette de la nouvelle interface en préparation.

## Analytics réellement créé

- Compte dédié : **Les Terrasses du Roty**, ID `407381204`.
- Propriété : **Les Terrasses du Roty — site web**, ID `553368095`.
- [Administration de la propriété](https://analytics.google.com/analytics/web/#/a407381204p553368095/admin).
- Flux Web : **Site officiel — Les Terrasses du Roty**, ID `15746517257`.
- URL déclarée : `https://www.les-terrasses-du-roty.fr`.
- ID de mesure réel affiché par Google : **`G-L2PJT90F4Y`**.
- France, fuseau français, euro ; objectifs leads et trafic Web.
- Partages facultatifs du compte désactivés ; mesures améliorées désactivées lors de la création du flux.
- Signaux Google et données fournies par les utilisateurs non activés. Collecte précise appareil/géographie désactivée. Personnalisation publicitaire autorisée dans **0 des 307 régions** après enregistrement.
- Conservation des événements et des utilisateurs réglée à **2 mois**, réinitialisation sur nouvelle activité désactivée. Google indique que les changements de conservation prennent effet après 24 heures et ne concernent pas la plupart des rapports agrégés.
- Dimensions personnalisées créées et retrouvées dans la liste : **Profil visiteur** (`visitor_profile`) et **Cuvée demandée** (`cuvee`), portée événement.
- `generate_lead` créé comme **événement clé**, déclenché par le code, comptage une fois par événement, sans valeur monétaire par défaut. Aucun événement fondé sur une simple URL de contact n’a été créé.

La collecte réelle est maintenant **vérifiée en production** : après un accord explicite, une visite technique a chargé la balise pour `G-L2PJT90F4Y` puis envoyé `page_view` à `region1.google-analytics.com/g/collect`, avec réponse **HTTP 204**. L’URL transmise ne contient ni query string ni fragment et le référent est vide. Aucun appel Google n’a eu lieu avant le choix ni après refus. Le retrait supprime les cookies Analytics et arrête la collecte lors de la navigation suivante. Cette visite n’a soumis aucun formulaire et n’a produit aucun `generate_lead`. [Preuve réseau réelle](verification/production-analytics.json).

Le tableau de bord temps réel a ensuite affiché **1 utilisateur actif** et **7 événements `page_view`** dans sa fenêtre agrégée. Ces sept événements ne sont pas attribués à la visite de recette : leur origine individuelle n’a pas été établie. Ce relevé confirme une activité visible dans la propriété, sans démontrer sept visites distinctes, des prospects ou une évolution du trafic. [Observation de l’interface Google par la tâche principale](evidence/google-production-ui-2026-09-09.json). Aucun trafic de préproduction n’est volontairement envoyé à cette propriété.

## Installation dans le site

Le serveur expose `/api/analytics-config` sans cache. Il n’autorise la mesure que si `ROTY_GA_ENABLED=1`, `ROTY_GA_MEASUREMENT_ID=G-L2PJT90F4Y`, le mode preview est désactivé et l’URL est sur le domaine canonique HTTPS. Le client exige aussi cette origine exacte et un consentement valable avant de charger Google.

Refuser/accepter sont présentés de façon équivalente. Le choix expire après 180 jours ; le pied de page permet de le changer. Le retrait bloque les événements, active l’interrupteur officiel `ga-disable-*`, retire le tag et efface les cookies Analytics. Il ne recharge pas la page et préserve la saisie du formulaire. Aucun ping de consentement refusé n’est intentionnellement émis.

Événements applicatifs : `page_view`, `form_start`, `generate_lead`. Le dernier correspond exclusivement à la réponse serveur `accepted`, jamais à un simple clic, une erreur ou une soumission invalide. Il **ne prouve ni réception d’e-mail ni vente**. Paramètres catégoriels autorisés : `visitor_profile` et `cuvee`. Ni coordonnées, ni texte libre, ni query string, ni fragment, ni référent externe ne sont transmis par le code. Les pages sont limitées à la liste des routes publiques.

Le serveur reste désactivé en préproduction. Les suites automatisées locales interceptent Google ; leurs événements ne constituent pas des visiteurs ou conversions réels. La visite consentie réelle décrite plus haut est un contrôle de production distinct.

## Search Console vérifiée et sitemap traité

Une propriété de préfixe URL a été ajoutée pour **`https://www.les-terrasses-du-roty.fr/`**. La fenêtre de vérification Google a fourni cette balise publique, intégrée au rendu HTML serveur :

```html
<meta name="google-site-verification" content="85RkIRx_0r7ElaMnrtFrwymUhGG2kCusNroF9-TvVaA" />
```

Ce jeton provient directement de la nouvelle propriété, pas de l’ancien site ni d’un exemple. Il peut être remplacé par `VITE_GOOGLE_SITE_VERIFICATION` à la construction.

La propriété de préfixe URL est **vérifiée dans l’interface Search Console** après publication de la balise dans le HTML public. Le sitemap **`https://www.les-terrasses-du-roty.fr/sitemap.xml` a été soumis depuis cette interface** par la tâche principale. Le contrôle HTTP de production confirme 19 URL canoniques et un `robots.txt` ouvert annonçant ce sitemap. [État Google observé](evidence/google-production-ui-2026-09-09.json), [contrôle public des pages et du sitemap](verification/cloudflare-production-http.json).

La validation porte sur ce préfixe HTTPS `www`, pas sur une propriété Domaine englobant tous les sous-domaines. Le détail du sitemap, rouvert à 13:06 UTC, affiche « Traitement du sitemap réussi », dernière lecture le 09/09/2026, **19 pages découvertes et 0 vidéo**. Le test de l’URL active de l’accueil à 15:06 heure de Paris affiche « Google a accès à cette URL » et « La page peut être indexée ». L’index historique de l’accueil peut correspondre au contenu Shopify précédent : il ne prouve pas l’indexation de cette nouvelle version. Aucun classement n’est revendiqué. Aucun sitemap de préproduction n’a été soumis.

L’association de cette propriété Search Console au flux GA4 `15746517257` est **créée et vérifiée** dans l’interface Google Analytics à 13:11 UTC. La ligne persistée reprend le préfixe `www` et le flux du site officiel. Cette association ne prouve pas encore la présence de métriques de recherche dans les rapports. [Preuve de l’association](evidence/google-search-console-association.json).

## Formulaire et mesure des demandes

Le test technique du formulaire public a été accepté par le serveur puis déclaré **sent + delivered** par Resend : identifiant fournisseur `cde5e306-ebd4-4d39-b47e-9ec1bd84c3a1`, référence de demande `10ef8bf8-6178-460d-a708-ebcd504a090d`, acquittement SMTP Gmail `250 2.0.0 OK`. La boîte `taff.roty@gmail.com` n’a pas été consultée directement et sa réception par le propriétaire reste non vérifiée. Cet essai HTTP n’a chargé aucune balise Google et ne représente pas une conversion GA. [Preuve de livraison fournisseur](evidence/resend-delivery.json).

## Références officielles

- [Configuration de la collecte GA4](https://support.google.com/analytics/answer/9304153?hl=fr).
- [Conservation des données Analytics](https://support.google.com/analytics/answer/7667196?hl=fr).
- [Paramètres de la balise GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
- [Vérification de propriété Search Console](https://support.google.com/webmasters/answer/9008080?hl=fr).
- [CNIL : cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi).

## Contrôle après publication du design et des photos

Le commit `296198b69ac45a416807210b3c77593447aacc0e` est publié sur le domaine canonique. La recette navigateur de cette version confirme zéro appel/cookie GA après refus. Un vrai test de formulaire, accepté puis livré, n’a créé aucune conversion Google car le consentement avait été refusé.

Après publication, trois demandes distinctes dans Search Console ont reçu la confirmation « Indexation demandée » : accueil, `/vins/` et `/professionnels/`. Les URL ont été ajoutées à la file d’exploration prioritaire. Avant demande, les vins étaient détectés mais non indexés et Google ne reconnaissait pas encore la page professionnels. Il s’agit de demandes acceptées, pas d’une preuve d’indexation du nouveau site ou de classement. Voir `evidence/google-indexing-apple-2026-09-09.json` et `verification/photos-production-form-ui.json`.
