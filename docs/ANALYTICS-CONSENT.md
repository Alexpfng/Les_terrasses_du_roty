# Mesure d’audience et consentement

## Activation

Le site utilise un consentement préalable : le fichier Google n’est pas demandé avant un accord explicite. L’accord et le refus sont conservés pendant 180 jours, dans `localStorage` sous `roty-audience-choice-v1`. Ils ont la même durée et la même présentation. Une absence de choix, un choix expiré ou illisible ne vaut jamais accord.

L’autorisation du navigateur ne suffit pas. Le serveur doit répondre à `GET /api/analytics-config` avec `enabled: true` et un identifiant GA4 valide. Le serveur n’autorise cette réponse que pour une requête HTTPS à `www.les-terrasses-du-roty.fr`, avec `ROTY_GA_ENABLED=1`, `ROTY_PREVIEW_MODE` différent de `1` et `ROTY_GA_MEASUREMENT_ID` valide. Un hôte de préproduction, une erreur réseau, une réponse invalide ou une panne désactive la mesure. La réponse est `no-store`; l’identifiant GA4 est public et n’est pas un secret.

`AnalyticsConsent` reçoit le chemin de navigation du routeur et la liste des chemins publiés. `AnalyticsPreferencesButton` ouvre les préférences depuis le pied de page. Le CSS se trouve dans `src/analytics.css`. Le helper SSR `googleSiteVerificationMeta` ne renvoie une balise GSC que pour une valeur syntaxiquement valide; cette balise ne charge aucun outil de mesure. Sa présence ne prouve pas la validation de propriété par Google.

## Données envoyées

| Événement       | Déclenchement                                                                                         | Paramètres métier autorisés |
| --------------- | ----------------------------------------------------------------------------------------------------- | --------------------------- |
| `page_view`     | Première page autorisée, puis changement de page SPA après accord                                     | Aucun                       |
| `form_start`    | Première modification réelle du formulaire pendant que la mesure est active                           | `visitor_profile`, `cuvee`  |
| `generate_lead` | Réponse réelle de `/api/demandes` avec statut HTTP réussi, `status: accepted` et `request_id` présent | `visitor_profile`, `cuvee`  |

Les catégories `visitor_profile` sont limitées à `particulier`, `caviste`, `restaurateur` et `professionnel`. Les catégories `cuvee` sont limitées à `2023`, `2024` et `a_conseiller`. Les dimensions GA4 correspondantes doivent être de portée événement. Aucun nom, adresse, téléphone, e-mail, établissement, message, quantité, identifiant de demande ou autre champ libre n’est transmis par l’instrumentation.

Les URL sont reconstruites depuis l’origine canonique et une liste de chemins publics. Paramètres de requête et fragments sont retirés. Un chemin inconnu ne déclenche pas la mesure. Le titre est construit depuis ce chemin public, jamais depuis le titre libre du document. Le référent initial est vide; le référent des navigations suivantes est uniquement la précédente URL nettoyée. Le chargement du tag utilise `referrerPolicy: no-referrer`.

L’envoi automatique de pages est désactivé (`send_page_view: false`). Les mesures améliorées, notamment le suivi automatique des formulaires et changements d’historique, doivent rester **désactivées dans le flux GA4** : ce réglage de propriété ne peut pas être remplacé par nos seules commandes client. Google Signals et les fonctions publicitaires sont désactivés dans le code. Le code ne définit ni identifiant utilisateur, ni valeur monétaire, ni événement de paiement ou de livraison d’e-mail. Une demande acceptée ne prouve pas que l’e-mail est reçu : cette réception doit être contrôlée séparément.

## Retrait de l’accord

Le bouton « Gérer les cookies » permet de retirer l’accord sans recharger la page ni perdre la saisie du formulaire. Le retrait active immédiatement `window['ga-disable-' + measurementId]`, arrête nos événements, retire le tag du DOM, vide notre file de commandes, supprime les cookies GA accessibles sur les domaines du site et mémorise un refus. Il n’envoie pas de commande de consentement refusé susceptible de produire des pings sans cookie.

Un script déjà exécuté reste en mémoire jusqu’au prochain chargement de document; retirer sa balise ne décharge pas JavaScript. Le mécanisme documenté `ga-disable` empêche ses nouvelles mesures. Un retrait ne peut pas rappeler une requête déjà partie avant le clic. Au chargement suivant, le refus bloque tout nouveau chargement de Google. Les retours tardifs de configuration ou de script sont contrôlés avant toute initialisation.

Le consentement ne protège pas une information qui serait ajoutée ultérieurement par un autre tag ou dans un chemin public autorisé. Toute évolution de l’instrumentation doit conserver la liste fermée de champs et les tests de confidentialité.

## Vérification

`npm run test:server` couvre notamment le rendu SSR, les dates de consentement, la validation des identifiants, les URL nettoyées, les catégories fermées et l’autorisation serveur. `npm run test:analytics` exécute le vrai contrôleur et les vrais composants React dans Chromium : absence de Google avant choix, refus, navigation SPA, retrait, conservation de saisie, courses réseau, panne de configuration, préproduction, accessibilité clavier et conditions strictes de conversion.

Tous les appels externes des tests navigateur sont interceptés, y compris le tag Google et sa collecte. Le fournisseur de mesure est un **mock**. Les tests de formulaire utilisent également un fournisseur d’e-mail **mock**. Le rapport `test-results/analytics.json` établit le comportement du code, pas la réception d’événements par une propriété GA4 réelle ni la livraison d’e-mails. Pour utiliser Chromium installé par Playwright en CI, définir `ROTY_TEST_CHROMIUM=1`; localement le script utilise Chrome installé.

## Références officielles consultées

- [Google — paramètres GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) : remplacement explicite de `page_location`, `page_referrer`, pages automatiques et durée des cookies.
- [Google — confidentialité et désactivation de la collecte](https://developers.google.com/tag-platform/security/guides/privacy) : indicateur `ga-disable`, Google Signals et personnalisation publicitaire.
- [Google — modes de consentement](https://support.google.com/analytics/answer/10000067?hl=en) : le mode de consentement préalable bloque les tags en l’absence d’accord; le mode avancé peut envoyer des pings sans cookie.
- [Google — mesures améliorées](https://support.google.com/analytics/answer/9216061?hl=en) : réglages des événements automatiques, dont les interactions avec les formulaires.
- [Google — éviter les données personnelles](https://support.google.com/analytics/answer/6366371?hl=en) : vigilance sur les URL et les champs saisis.
- [Google — applications à navigation SPA](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications) : événements de page lors des navigations virtuelles.
- [CNIL — questions fréquentes sur les cookies](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ) : accord positif, refus aussi accessible et retrait à tout moment.
- [CNIL — recommandation consolidée, janvier 2026](https://www.cnil.fr/sites/default/files/2026-01/recommandation_cookies_consolidee.pdf) : durée raisonnable commune pour mémoriser l’accord ou le refus, par exemple six mois.
