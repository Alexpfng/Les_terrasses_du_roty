# Livraison — 9 septembre 2026

**Implémentation et recette locale réalisées. Publication sur le domaine non réalisée faute d’accès.** Le site public reste Shopify ; aucune préproduction distante n’a été inventée. Les e-mails n’ont pas été envoyés ni reçus pendant cette intervention.

## Résultat implémenté

- Branche dédiée : `codex/refonte-noir-or-2026-09-09`.
- React 18, TanStack Start, Router, Vite et configuration Lovable conservés. Aucune mise à niveau globale de dépendances. Ajout de Playwright et axe uniquement pour la recette.
- Noir `#0A0908`, noir profond `#060504`, or `#C9A227`, textes `#F4F0E6` ; aucun vert d’interface. Logo et photos identiques aux originaux, vérifiés par SHA-256.
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

## Tests effectivement exécutés

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
| Identité graphique          | Hash des assets identique au commit initial                                                                     | `verification/original-assets.json` |

Le lint initial échouait sur 752 erreurs de formatage. Le commit isolé `042a3c7` formate les composants immersifs archivés sans modifier leur comportement ; ils ne sont plus importés dans le site public. Les fichiers générés de tests sont exclus du lint.

La dernière revue a également sécurisé le réessai d’une demande incertaine : une réponse temporaire 429/503 ne permet pas de créer une nouvelle clé, la référence reste affichée et une reprise au-delà de 23 heures est bloquée. Le parcours est couvert par une séquence HTTP doublée côté navigateur, distincte du test du véritable endpoint 503.

Un défaut de nettoyage des flux HEAD a été détecté dans les journaux de recette, corrigé, puis couvert par un test sur le vrai build React/TanStack. Les rapports ci-dessus sont ceux de la version corrigée ; les premières exécutions ayant révélé le défaut ne sont pas présentées comme une validation serveur complète.

## Performance mesurée

Lighthouse 12.8.2, accueil du build local, mobile simulé : performance **85/100**, accessibilité **100/100**, bonnes pratiques **100/100**. FCP 2,0 s, LCP 4,1 s, TBT 0 ms, CLS 0. Le score SEO local est **69/100**, affecté par le blocage d’indexation volontaire de la préproduction. Ce résultat n’est ni une mesure du domaine Shopify ni une garantie sur le futur hébergement. Le LCP mobile pourra encore bénéficier d’images de diffusion plus légères et doit être remesuré après déploiement.

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

Les accès précis sont détaillés dans `DEPLOYMENT.md` : projet SSR/Lovable lié au dépôt, zone OVH, administration Shopify pour sauvegarde du thème, service d’envoi/expéditeur et Redis partagés, preuve de réception sur la boîte cible. Aucun autre projet d’hébergement n’a été détourné et aucun service payant n’a été créé.

La cible choisie permettra aussi de finaliser les mentions d’hébergement et les prestataires de confidentialité. La durée de conservation/purge réelle des messages dans Gmail doit être documentée par le responsable ; le code ne prétend pas supprimer automatiquement ces e-mails.

## Retour arrière

Commit initial conservé : `c56ec8d465d71399c9def39a696c133caa9a2f4f`. Archive Git locale créée et inventoriée (180 entrées). DNS et thème Shopify inchangés : `www → shops.myshopify.com.`, apex `23.227.38.65`, thème `183360323928`. Détails, limites et procédure dans `DEPLOYMENT.md` ; le retour DNS vers Shopify rétablirait son ancien parcours marchand.
