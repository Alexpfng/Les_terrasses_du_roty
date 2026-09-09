# Google Analytics et Search Console — état réel

Configuration effectuée le 9 septembre 2026 dans la session Google autorisée du propriétaire. Les propriétés des autres projets n’ont pas été modifiées.

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

Le tableau de bord indique **aucune donnée reçue** lors de ce contrôle. La création du flux n’est pas une preuve de collecte. Aucun trafic de préproduction n’est volontairement envoyé à cette propriété.

## Installation dans le site

Le serveur expose `/api/analytics-config` sans cache. Il n’autorise la mesure que si `ROTY_GA_ENABLED=1`, `ROTY_GA_MEASUREMENT_ID=G-L2PJT90F4Y`, le mode preview est désactivé et l’URL est sur le domaine canonique HTTPS. Le client exige aussi cette origine exacte et un consentement valable avant de charger Google.

Refuser/accepter sont présentés de façon équivalente. Le choix expire après 180 jours ; le pied de page permet de le changer. Le retrait bloque les événements, active l’interrupteur officiel `ga-disable-*`, retire le tag et efface les cookies Analytics. Il ne recharge pas la page et préserve la saisie du formulaire. Aucun ping de consentement refusé n’est intentionnellement émis.

Événements applicatifs : `page_view`, `form_start`, `generate_lead`. Le dernier correspond exclusivement à la réponse serveur `accepted`, jamais à un simple clic, une erreur ou une soumission invalide. Il **ne prouve ni réception d’e-mail ni vente**. Paramètres catégoriels autorisés : `visitor_profile` et `cuvee`. Ni coordonnées, ni texte libre, ni query string, ni fragment, ni référent externe ne sont transmis par le code. Les pages sont limitées à la liste des routes publiques.

Le serveur reste désactivé en préproduction. Les essais automatisés interceptent Google ; leurs événements ne constituent pas des visiteurs ou conversions réels.

## Search Console préparée, propriété non vérifiée

Une propriété de préfixe URL a été ajoutée pour **`https://www.les-terrasses-du-roty.fr/`**. La fenêtre de vérification Google a fourni cette balise publique, intégrée au rendu HTML serveur :

```html
<meta name="google-site-verification" content="85RkIRx_0r7ElaMnrtFrwymUhGG2kCusNroF9-TvVaA" />
```

Ce jeton provient directement de la nouvelle propriété, pas de l’ancien site ni d’un exemple. Il peut être remplacé par `VITE_GOOGLE_SITE_VERIFICATION` à la construction.

La propriété n’est **pas encore vérifiée** : le domaine public sert encore Shopify. Après publication sur le domaine, contrôler le jeton dans le HTML public, valider la propriété, soumettre `https://www.les-terrasses-du-roty.fr/sitemap.xml` et inspecter l’accueil, les vins et les professionnels. Aucun sitemap de préproduction ne doit être soumis. Une soumission à Google ne garantit pas l’indexation.

## Références officielles

- [Configuration de la collecte GA4](https://support.google.com/analytics/answer/9304153?hl=fr).
- [Conservation des données Analytics](https://support.google.com/analytics/answer/7667196?hl=fr).
- [Paramètres de la balise GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
- [Vérification de propriété Search Console](https://support.google.com/webmasters/answer/9008080?hl=fr).
- [CNIL : cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi).
