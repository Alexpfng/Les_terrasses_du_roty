# Livraison — 9 septembre 2026

**Le site complet est publié sur https://www.les-terrasses-du-roty.fr/ et le formulaire a livré un vrai e-mail au serveur Gmail.** Cette livraison documente le commit `bf7957241ede2b144480b8f781eb35d5db8644b0`, déploiement Cloudflare Pages `a934ec80-a7b4-4a8f-b2e7-a83150b60f0f`. La nouvelle interface inspirée d’Apple, demandée ensuite par le propriétaire, a passé sa recette locale et attend sa préproduction : elle ne doit pas être confondue avec la version publique et les preuves ci-dessous.

## Site et parcours

- Branche dédiée : `codex/refonte-noir-or-2026-09-09`. React 18, TanStack Start, Router, Vite et configuration Lovable conservés ; publication avec le preset Nitro `cloudflare-pages` et compatibilité Node.
- 19 pages : accueil, domaine, terrasses, index vins, cuvées 2024 et 2023, professionnels, demande, journal, cinq nouveaux articles, deux archives et trois pages légales. Contenus rendus côté serveur et consultables sans JavaScript ; polices et photographies locales.
- Logo officiel documenté dans `logo-provenance.md`, informations vérifiées et absence de vert d’interface conservés. Après la version ivoire/or, la nouvelle direction demandée emploie blancs, gris doux, Inter, espaces généreux et accents or. Son build et sa recette restent distincts des résultats historiques.
- Panier, checkout, compte et paiement retirés. Anciennes routes commerciales en 410, inconnues en 404 et redirections vers les équivalents documentés. Aucun prix, stock, avis ou certification inventé.
- Formulaire réel à destinataire fixe, profils particulier/caviste/restaurateur/autre professionnel, contexte cuvée, validation, quotas Redis atomiques et idempotence. Sans configuration ou en cas de panne, vraie erreur, saisie conservée et aucun succès simulé.

## URLs réellement vérifiées

| URL                                                      | État du commit publié `bf79572`                                                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `https://www.les-terrasses-du-roty.fr/`                  | HTTPS 200, nouvelle application SSR, absence de code de vitrine Shopify                                                   |
| `https://www.les-terrasses-du-roty.fr/vins/`             | HTTPS 200, catalogue sans achat en ligne                                                                                  |
| `https://www.les-terrasses-du-roty.fr/professionnels/`   | HTTPS 200, parcours professionnels                                                                                        |
| `https://www.les-terrasses-du-roty.fr/demande/`          | HTTPS 200, envoi serveur opérationnel                                                                                     |
| `https://www.les-terrasses-du-roty.fr/journal/`          | HTTPS 200, cinq articles et deux archives                                                                                 |
| `https://www.les-terrasses-du-roty.fr/sitemap.xml`       | 19 URL canoniques ; sitemap traité par Google                                                                             |
| `https://preproduction.les-terrasses-du-roty.pages.dev/` | 401 sans identifiants ; version `bf79572` testée sous protection, Analytics désactivé                                     |
| `https://les-terrasses-du-roty.pages.dev/`               | 503/noindex volontaire, hôte technique fermé                                                                              |
| `https://les-terrasses-du-roty.fr/`                      | HTTPS 308 vers `www` via Cloudflare Pages, chemin et paramètres conservés, certificat valide |

La préproduction du commit publié est le déploiement `0a55b884-234b-4426-bdd5-70bc31657c33`. `http://127.0.0.1:4173/` est uniquement la recette locale de la prochaine interface, accessible sur le Mac quand le serveur tourne.

## Recette locale de la prochaine interface Apple

La dernière recette locale couvre la version définitive avec **le logo noir officiel complet, conservé octet pour octet dans l’en-tête et le menu**, sept photographies réelles issues des archives du domaine et des photographies d’illustration identifiées. Le build Node passe, ainsi que TypeScript et le lint (**0 erreur, 6 avertissements préexistants**). Les **19 pages**, **95 rendus responsives**, **19 pages sans JavaScript**, **19 contrôles axe sans violation**, **7 scénarios du menu**, **38 contrôles HTTP** et le SEO des **19 pages** passent sur ce build. Les images de couverture, Open Graph, Twitter et JSON-LD des articles concordent.

Les **102 variantes d’images** référencées sont chargées et décodées, sans répétition de la même photographie dans une page. La galerie mobile révèle ses **trois cartes au clavier**, permet le défilement horizontal interne jusqu’à la dernière carte et ne provoque aucun débordement de page. L’effet de flou de l’en-tête est confirmé dans le CSS calculé. Le menu est vérifié pour Tab/Shift+Tab, Escape, retour du focus, blocage du défilement, réouverture immédiate, fermeture par lien et passage au bureau. Le formulaire conserve validation, erreurs réelles, référence et protection contre la répétition d’une demande incertaine.

Les **32 tests serveur dont 9 Redis réels**, **14 scénarios Analytics interceptés** et **37 flux SSR nettoyés** de la précédente recette Apple restent les preuves des logiques inchangées ; ils n’ont pas été présentés comme de nouveaux envois ni relancés pour les seuls changements d’images. Trois mesures locales mobiles configurées donnent un LCP de **1,204 à 1,212 s**, CLS **0** ; ce sont des mesures de laboratoire local, pas les Core Web Vitals de production.

Les rapports définitifs et le manifeste de sources sont dans [verification/photos-local-summary.json](verification/photos-local-summary.json), [images et logo](verification/photos-images.json), [navigateur](verification/photos-browser.json), [SEO](verification/photos-seo.json), [HTTP](verification/photos-http.json) et [performance locale](verification/photos-performance-local.json). Les preuves antérieures `apple-*` sont conservées. **Cette recette ne constitue pas encore une publication distante du nouveau design.** Le preset Cloudflare devra encore confirmer l’exclusion statique `/assets/*` sur le SHA final. Aucun e-mail ni événement GA réel supplémentaire n’a été émis par cette recette.

## Résultats de recette du site publié

- CI du commit `bf79572` réussie : [exécution GitHub Actions](https://github.com/Alexpfng/Les_terrasses_du_roty/actions/runs/34350897604).
- **32 tests serveur** passent, dont **9 avec Redis réel local**, aucun ignoré. Le fournisseur e-mail est doublé dans ces tests ; l’envoi réel est vérifié séparément. Le correctif de transport Cloudflare couvre `fetch` lié au contexte et refus explicite des redirections Redis/Resend.
- **19 pages publiques 200**, un `h1` par page, canoniques exactes et aucune directive `noindex`. **28 ressources** 200 avec cache immutable, **26 liens internes** valides et **11 contrôles supplémentaires** : redirections historiques, 404/410, robots/sitemap, GA serveur et maintien de la protection Preview. Preuve : `verification/cloudflare-production-http.json`.
- Recette navigateur de production : accueil, vins, professionnels, demande et journal aux largeurs 390 et 1440 px ; ressources et images chargées, contexte caviste conservé, zéro exception ni appel Google pendant cette recette. Preuve : `verification/cloudflare-production-browser.json`.
- Recette locale précédente : **19 pages**, **95 rendus responsives**, **19 pages sans JavaScript**, **19 contrôles axe sans violation**, **38 contrôles HTTP**, **37 rendus SSR avec timers nettoyés**, **14 scénarios Analytics interceptés**. Ces contrôles ne sont pas une certification d’accessibilité et ne valident pas automatiquement la nouvelle interface. Voir `verification/browser-seo.json`, `http-seo.json`, `runtime-seo.json`, `analytics-seo.json` et `seo-technical.json`.
- Cloudflare Free : aucune exception ou erreur CPU dans la fenêtre de recette. Les mesures SSR de préproduction comportent des pointes de 39 ms ; les requêtes d’envoi réelles prennent 8 ms en préproduction et 9 ms en production. Cette fenêtre courte ne garantit pas une marge durable du forfait Free. Détails dans `DEPLOYMENT-CLOUDFLARE.md`.

La version ivoire précédente avait obtenu localement Lighthouse 89 en performance, 100 en accessibilité et 100 en bonnes pratiques, LCP 3,5 s et CLS 0 (`verification/lighthouse-ivory.json`). Cette mesure ne décrit ni la production distante ni la nouvelle interface Apple. Les preuves historiques des premiers builds sont conservées dans `verification/` et `qa/`.

## État réel des e-mails

| Étape                                           | État vérifié                                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Formulaire et services                          | Cloudflare Pages → Upstash REST → Resend, réellement configurés                                                         |
| Expéditeur                                      | `site@notifications.les-terrasses-du-roty.fr`, domaine Resend vérifié                                                   |
| Destinataire                                    | Constante serveur `taff.roty@gmail.com`                                                                                 |
| Acceptation production                          | HTTP 200 / `accepted` à **12:34:46.511 UTC**, le 9 septembre 2026                                                       |
| Référence applicative                           | `10ef8bf8-6178-460d-a708-ebcd504a090d`                                                                                  |
| Identifiant Resend                              | `cde5e306-ebd4-4d39-b47e-9ec1bd84c3a1`                                                                                  |
| Livraison                                       | Événements Sent + Delivered observés dans Resend ; serveur Gmail **SMTP 250 2.0.0 OK**                                  |
| Boîte principale, dossier spam, lecture humaine | **Non vérifiés directement** : accès de lecture au compte Gmail exact ou confirmation du destinataire encore nécessaire |

Le message était marqué `TEST TECHNIQUE ROTY PRODUCTION`, sans commande ni prospect réel. La recette de préproduction a également été acceptée et livrée. Aucun événement GA de conversion n’a été créé par ces tests HTTP. [Preuve prestataire](evidence/resend-delivery.json), [réponse production](verification/cloudflare-production-mail.json), [exécution production](verification/cloudflare-production-mail-runtime.json), [contrat et exploitation](FORMULAIRE-SERVEUR.md).

## Analytics, Search Console et acquisition

GA4 réel `G-L2PJT90F4Y`, propriété `553368095`, flux `15746517257`. Une visite consentie a produit un vrai `page_view` reçu en HTTP **204** ; aucun appel Google avant choix/après refus, retrait vérifié. L’interface temps réel a affiché **1 utilisateur actif et 7 `page_view`** sur sa fenêtre agrégée : ces sept événements ne sont pas attribués à la seule visite de recette. `generate_lead` est déclaré événement clé et ne part qu’après acceptation réelle. Dimensions `visitor_profile` et `cuvee`, six mois de préférence, deux mois de conservation GA, mesure améliorée désactivée. [Preuves et configuration](ANALYTICS-SEARCH-CONSOLE.md).

Search Console : propriété du préfixe `https://www.les-terrasses-du-roty.fr/` **vérifiée**. Le détail du sitemap affiche à 13:06 UTC « Traitement du sitemap réussi », dernière lecture le 09/09/2026, **19 pages découvertes**, 0 vidéo. Le test live de l’accueil confirme accès Google et indexabilité. L’index historique de cette URL peut correspondre à Shopify et ne prouve pas que la nouvelle version est déjà indexée. Aucun classement garanti. [Preuve Google](evidence/google-production-ui-2026-09-09.json).

Contenus et maillage ciblent particuliers, cavistes et restaurateurs. Cinq cibles de liens sont qualifiées. Une demande factuelle de correction Vivino a été envoyée par son support, avec confirmation de création d’un dossier ; aucun lien ni correction publique acquis n’est vérifié. Le formulaire Domaine Ray est préparé et bloqué avant envoi par un CAPTCHA. Aucun achat de lien ni adhésion payante. [État acquisition](BACKLINKS.md), [preuves](evidence/backlink-outreach-2026-09-09.json).

## Hébergement et retrait de Shopify

`www` pointe réellement vers Cloudflare Pages Free depuis la modification OVH du 9 septembre à 12:30:17 UTC. Aucun forfait payant activé. La vitrine Shopify est privée et ses deux produits ont été placés en brouillon dans tous les canaux. Les données produit, commandes et clients sont conservées ; le compte n’a pas été supprimé. L’abonnement était déjà résilié avec désactivation annoncée le 8 décembre 2026. L’export du thème a été demandé, mais sa réception n’est pas confirmée. [Retrait de vitrine](evidence/shopify-retirement.json), [catalogue retiré](evidence/shopify-catalogue-retired.json).

La délégation vers `desi.ns.cloudflare.com` et `rodrigo.ns.cloudflare.com` est confirmée sur les trois serveurs autoritatifs `.fr` depuis le 9 septembre à **13:34:09 UTC**. L’apex et `www` sont **Active / SSL enabled** dans Pages. L’apex renvoie **308** vers `www`, en conservant chemin et paramètres ; les 7 contrôles HTTPS passent et les 9 enregistrements DNS sont présents, avec MX et Resend préservés. La signature DNSSEC Cloudflare est préparée, mais le nouveau DS n’est pas encore publié chez OVH. Sa publication et le retrait des anciens alias Shopify restent différés jusqu’à **15:34:09 UTC**, puis soumis à un nouveau contrôle des caches et du DNS. Ces alias servent temporairement les clients utilisant encore l’ancienne délégation. [État DNS](evidence/dns-transition.json), [preuves apex](evidence/cloudflare-apex-transition.json), [contrôles HTTPS](verification/cloudflare-apex-http.json).

## Retour arrière et prochaine publication

Le point de retour fonctionnel est **`bf79572`**, déploiement Pages **`a934ec80-a7b4-4a8f-b2e7-a83150b60f0f`**. Le bundle et le worktree isolé restent conservés. La prochaine interface doit être testée sur un nouveau SHA en préproduction, puis publier le même artefact après validation visuelle, sans modifier les secrets ni les namespaces. Procédure dans `DEPLOYMENT-CLOUDFLARE.md`.

Un rollback Pages conserve les états Redis et les identifiants d’envoi en cours. Ne pas relancer une demande incertaine avec une nouvelle clé. Le commit initial `c56ec8d465d71399c9def39a696c133caa9a2f4f` et l’archive Git sont conservés. Un retour DNS vers Shopify ne suffirait plus à rouvrir son catalogue : vitrine privée et produits en brouillon ont été volontairement retirés. La recette de la nouvelle interface et le contrôle direct de la boîte Gmail demeurent des états distincts à documenter.
