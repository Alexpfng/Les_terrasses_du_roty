# Livraison — 9 septembre 2026

**Site complet, refonte ivoire/or, SEO ciblé et intégration Analytics réalisés et testés localement.** Le compte Analytics dédié est réellement créé. Search Console attend la publication du jeton sur le domaine. La préproduction Netlify est en préparation ; le site public reste Shopify. Aucun e-mail réel envoyé ou reçu n’est revendiqué.

## SEO, Analytics et acquisition

- Pages et maillage ciblant particuliers, cavistes et restaurateurs ; formulaire avec ces trois profils et « autre professionnel ». Intention d’achat direct, recherche de fiche cuvée, tarif professionnel et carte des vins distinguées sans inventer prix, stocks ou volumes de recherche. Recherche sourcée dans `SEO-INTENTIONS.md`.
- Métadonnées et contenu serveur, schémas Organization/WebSite/BreadcrumbList/BlogPosting, canoniques et sitemap contrôlés sur les 19 pages. Jeton GSC réel présent dans le HTML initial.
- GA4 créé : compte `407381204`, propriété `553368095`, flux `15746517257`, mesure `G-L2PJT90F4Y`. Consentement préalable, refus/retrait, six mois de préférence, aucune mesure en préproduction, filtrage des données personnelles. `generate_lead` déclaré événement clé sans valeur financière ; dimensions `visitor_profile` et `cuvee` créées. Détails et limites dans `ANALYTICS-SEARCH-CONSOLE.md`.
- Cinq cibles de liens partenaires qualifiées, kit et trois modèles rédigés dans `BACKLINKS.md`. **Zéro message externe envoyé et zéro nouveau backlink acquis.** Diffusion des nouvelles routes après leur publication réelle ; aucun achat de lien ou adhésion payante.

## Ajustement visuel demandé par le propriétaire

Après sa remarque « trop tout noir » et sa nouvelle référence imprimeur : fonds de lecture ivoire, image d’accueil panoramique, navigation équilibrée autour du logo officiel, cuvées et journal sans cadres noirs, formulaire clair. Sur mobile, les champs précèdent les coordonnées dans le rendu et dans l’ordre clavier. Les sources vectorielles du logo sont documentées dans `logo-provenance.md`.

## Résultat implémenté

- Branche dédiée : `codex/refonte-noir-or-2026-09-09`.
- React 18, TanStack Start, Router, Vite et configuration Lovable conservés. Aucune mise à niveau globale de dépendances. Ajout de Playwright et axe uniquement pour la recette.
- Direction affinée à la demande du propriétaire : ivoire `#F7F4ED`, encre `#29241F`, or lisible `#745619`, accents dorés `#B59551` ; aucun vert d’interface. Logo officiel fin or/blanc sur le pied de page sombre et or/noir sur l’en-tête ivoire, copiés sans modification depuis les SVG de la charte. Or du logo inchangé `#D7AB0E`. Photographies originales conservées. Voir `logo-provenance.md`.
- 19 pages : accueil, domaine, terrasses, index vins, cuvées 2024 et 2023, professionnels, demande, journal, cinq nouveaux articles, deux archives et trois pages légales.
- Contenu présent dans le HTML initial. Aucun écran de préchargement, obligation de 3D ou verrouillage du défilement. Polices et images locales.
- Panier, checkout, compte et paiement retirés des parcours publics. URLs supprimées en 410, inconnues en 404 ; redirections vers les seuls équivalents documentés. Archives commerciales Shopify intactes.
- Titres/descriptions/canoniques propres, sitemap de 19 URLs, Organization, BreadcrumbList et BlogPosting conformes au visible. Pas de faux prix/stock/certification/avis/dates de publication.
- Formulaire serveur avec destinataire fixe, validation stricte, origine, limitation 16 Kio, honeypot, quotas Redis atomiques multi-instance, idempotence et gestion d’erreurs/incertitudes. Sans prestataire configuré : 503, aucun succès simulé. Formulaire sans JavaScript explicitement non envoyable, sans données personnelles placées dans l’URL.

## URLs vérifiées

- `http://127.0.0.1:4173/` : build de production **local**, rendu complet vérifié. Cette adresse n’est accessible que sur le Mac pendant que le serveur reste démarré.
- `http://127.0.0.1:4173/demande/` : formulaire réel connecté au endpoint local, échec 503 vérifié faute de configuration.
- `https://www.les-terrasses-du-roty.fr/` : HTTPS 200, **ancien site Shopify**, pas la refonte.
- `https://les-terrasses-du-roty.fr/` : redirection vers la version canonique `www`.
- Aucune URL distante de préproduction de la refonte ni aucun déploiement public de celle-ci.

Le commit et l’URL de la PR sont fournis dans la remise et par l’historique Git, afin de ne pas inscrire dans son propre contenu un hash de commit impossible à prédéterminer.

## Recette après SEO et Analytics

Build Node, lint et TypeScript passent (six avertissements Fast Refresh préexistants, zéro erreur). Résultats sur le build mis à jour :

- **31 tests serveur** réussis, dont **9 avec Redis réel local**. Le prestataire e-mail est doublé dans ces tests.
- **14 scénarios Analytics navigateur** réussis, Google totalement intercepté : consentement, refus, retrait, courses de chargement, filtrage des paramètres, démarrage réel de saisie et demande acceptée uniquement (`verification/analytics-seo.json`).
- **19 pages**, **95 rendus responsives**, **19 contrôles sans JavaScript**, **19 contrôles axe sans violation**, aucune erreur navigateur (`verification/browser-seo.json`).
- **38 contrôles HTTP** réussis et **37 rendus SSR** dont les timers sont correctement libérés (`verification/http-seo.json`, `verification/runtime-seo.json`).
- **19 pages SEO SSR** : titres/descriptions/canoniques uniques, données structurées cohérentes, robots et sitemap valides, token GSC réel (`verification/seo-technical.json`).

Ces contrôles locaux ne prouvent ni la réception d’un e-mail, ni une collecte GA réelle, ni l’indexation Google.

## Recette initiale et visuelle conservée

| Contrôle                    | Résultat                                                                                                        | Preuve                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `npm run build`             | Réussi                                                                                                          | `verification/build.log`            |
| `npm run build:local`       | Réussi, serveur Node exécutable                                                                                 | `verification/build-local.log`      |
| `npm run typecheck`         | Réussi                                                                                                          | `verification/typecheck.log`        |
| `npm run lint`              | 0 erreur ; 6 avertissements Fast Refresh préexistants dans les composants UI inutilisés                         | `verification/lint.log`             |
| Tests serveur               | 24/24, dont 9 tests avec Redis réel local isolé ; aucun test sauté                                              | `verification/server-tests.tap`     |
| HTTP, routes, SEO, bundle   | 38 contrôles passés ; redirections, 404/410, SSR, robots/sitemap et secrets                                     | `verification/http.json`            |
| Responsive                  | 95/95 : 19 pages × 360, 390, 768, 1280, 1440 px ; aucun débordement ni vert calculé                             | `verification/browser.json`         |
| Sans JavaScript             | 19/19 pages avec contenu principal dans le HTML                                                                 | `verification/browser.json`         |
| Accessibilité axe WCAG A/AA | 19 pages, zéro violation détectée ; ne vaut pas certification d’accessibilité                                   | `verification/browser.json`         |
| Interactions                | Contexte cuvée/pro, validation/focus, saisie conservée après 503, clavier et mouvement réduit                   | `verification/browser.json`         |
| Recette indépendante        | 30 combinaisons responsive supplémentaires, clavier, menu, formulaire                                           | `qa/README.md`                      |
| Flux serveur                | 37 timers SSR créés et nettoyés, aucun restant ni expiration ; 30 HEAD concurrents, GET et erreurs/redirections | `verification/runtime.json`         |
| Identité graphique          | Photos/anciens assets préservés ; nouveaux SVG identiques à la charte fournie                                   | `verification/original-assets.json` |

Le lint initial échouait sur 752 erreurs de formatage. Le commit isolé `042a3c7` formate les composants immersifs archivés sans modifier leur comportement ; ils ne sont plus importés dans le site public. Les fichiers générés de tests sont exclus du lint.

La dernière revue a également sécurisé le réessai d’une demande incertaine : une réponse temporaire 429/503 ne permet pas de créer une nouvelle clé, la référence reste affichée et une reprise au-delà de 23 heures est bloquée. Le parcours est couvert par une séquence HTTP doublée côté navigateur, distincte du test du véritable endpoint 503.

Un défaut de nettoyage des flux HEAD a été détecté dans les journaux de recette, corrigé, puis couvert par un test sur le vrai build React/TanStack. Les rapports ci-dessus sont ceux de la version corrigée ; les premières exécutions ayant révélé le défaut ne sont pas présentées comme une validation serveur complète.

## Performance de la version ivoire

Lighthouse 12.8.2, build local de production, mobile simulé : **89/100 en performance**, **100/100 en accessibilité**, **100/100 en bonnes pratiques**. FCP 2,0 s, LCP 3,5 s, TBT 0 ms, CLS 0. SEO local 69/100, avec `noindex` volontaire. Preuve : `verification/lighthouse-ivory.json`. Cette mesure est locale et ne décrit pas le site Shopify public.

La recette de cette version reprend les 19 pages, 95 largeurs/page, 19 contrôles sans JavaScript et 19 contrôles axe (aucune violation), ainsi que les 38 contrôles HTTP et les parcours du formulaire. Le build Node, TypeScript et le lint sont vérifiés à nouveau (`verification/ivory-*.log`). La revue indépendante est dans `qa/ivory-review.md`.

## Performance historique avant l’ajustement ivoire

Mesure historique de la première version noire, avant les ajustements visuels demandés par le propriétaire. Lighthouse 12.8.2, accueil du build local, mobile simulé : performance **85/100**, accessibilité **100/100**, bonnes pratiques **100/100**. FCP 2,0 s, LCP 4,1 s, TBT 0 ms, CLS 0. Le score SEO local est **69/100**, affecté par le blocage d’indexation volontaire de la préproduction. Ce résultat n’est ni une mesure du domaine Shopify ni une garantie sur le futur hébergement. Le LCP mobile pourra encore bénéficier d’images de diffusion plus légères et doit être remesuré après déploiement.

La compression statique native Nitro a fait passer cette mesure de performance de 72 à 85 ; les fichiers originaux du logo et des photographies restent inchangés. Preuves avant/après dans `verification/lighthouse-before-compression.json` et `verification/lighthouse-summary.json`.

## État réel des e-mails

| Étape                                | État                                                             |
| ------------------------------------ | ---------------------------------------------------------------- |
| Validation et interface              | Testées et opérationnelles                                       |
| Endpoint réel local                  | Testé ; réponse 503 sans configuration                           |
| Intégration prestataire              | Implémentée ; tests HTTP avec doublure du prestataire uniquement |
| Acceptation d’un e-mail réel         | **Non effectuée : accès/expéditeur non configurés**              |
| Livraison prestataire                | **Non vérifiée**                                                 |
| Réception dans `taff.roty@gmail.com` | **Non vérifiée : cette boîte n’est pas connectée**               |

La réception ne peut être remplacée par un événement de test ou un HTTP 200. Les demandes techniques de recette sont clairement identifiées et n’utilisent aucune donnée de prospect réel.

## Ce qui bloque la production

Les étapes sont détaillées dans `DEPLOYMENT.md`. Le projet Netlify dédié existe et ses accès sont disponibles ; Lovable n’est plus un accès nécessaire. Il manque la connexion à la zone OVH pour la bascule Web et les trois enregistrements Resend (`evidence/resend-domain.md`), puis la validation du domaine d’envoi, la clé Resend dédiée et la preuve de réception dans `taff.roty@gmail.com`. La préparation Redis est suivie dans le dossier de déploiement. L’administration Shopify permettrait l’export complet du thème ; le thème public actuel reste intact. Aucun abonnement payant n’a été souscrit.

La cible choisie permettra aussi de finaliser les mentions d’hébergement et les prestataires de confidentialité. La durée de conservation/purge réelle des messages dans Gmail doit être documentée par le responsable ; le code ne prétend pas supprimer automatiquement ces e-mails.

## Retour arrière

Commit initial conservé : `c56ec8d465d71399c9def39a696c133caa9a2f4f`. Archive Git locale créée et inventoriée (180 entrées). DNS et thème Shopify inchangés : `www → shops.myshopify.com.`, apex `23.227.38.65`, thème `183360323928`. Détails, limites et procédure dans `DEPLOYMENT.md` ; le retour DNS vers Shopify rétablirait son ancien parcours marchand.
