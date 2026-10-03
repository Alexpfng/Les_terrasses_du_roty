# Bascule et retour arrière

La publication est autorisée par la demande utilisateur. La préproduction Netlify a été redéployée le 9 septembre 2026 avec le commit `2ae3351792acf7aa1c74afbc8d98eb00166b898c` et la clé Resend renouvelée : [préproduction protégée](https://preproduction--les-terrasses-du-roty.netlify.app), déploiement `6aa14e0f2aa93a27d5114874`. Les contrôles détaillés ci-dessous ont été réalisés sur le premier déploiement `8b799b2`. La cible de production retenue est désormais **Cloudflare Pages Free**, car les crédits Netlify du cycle ne permettent pas de publier en production. Voir [la procédure Cloudflare](DEPLOYMENT-CLOUDFLARE.md) pour le déploiement, la bascule et leur état courant.

## Cible réelle et accès manquants

Le domaine public répond toujours sur Shopify (`vwpjn4-w0.myshopify.com`) ; OVH gère la zone DNS. DNS et réponse HTTPS Shopify ont été revérifiés le 9 septembre 2026 à 11:17 UTC. Le dépôt TanStack ne peut pas être téléversé tel quel comme thème Liquid. Le projet Netlify ci-dessous est une préproduction SSR dédiée ; un accès Lovable n’est pas nécessaire. Les sessions OVH et Shopify ont été connectées pendant l’intervention. La zone DNS, le domaine Resend et la préparation Shopify sont suivis par l’agent principal.

- Projet : `les-terrasses-du-roty`, ID `b5b6a14e-3b07-4f89-8016-af1740b20192`.
- Compte : `maxclubcomptable`, plan `Free`, sans achat ni changement de plan.
- Administration vérifiée par API : <https://app.netlify.com/projects/les-terrasses-du-roty>.
- Adresse attribuée : `https://les-terrasses-du-roty.netlify.app` ; elle n’est pas une preuve de site livré tant qu’un déploiement n’est pas validé.
- Projet créé sans connexion Git ni intégration CI. La liaison locale `.netlify/state.json` sert uniquement à cibler ce projet avec la CLI et reste ignorée par Git.
- Six variables de préproduction sont confirmées via la CLI : `ROTY_PREVIEW_MODE`, `ROTY_PREVIEW_USER`, `ROTY_PREVIEW_PASSWORD`, `ROTY_FORM_HASH_SECRET`, `ROTY_FORM_NAMESPACE`, `ROTY_ALLOWED_ORIGINS`. Le mot de passe et la clé de hachage ont été générés pour ce projet et déclarés secrets. Leur copie locale est dans `test-results/deployment/netlify-preview.env`, ignorée par Git, permissions `0600`. Aucune valeur secrète ne figure dans cette documentation.
- L’alias `preproduction--les-terrasses-du-roty.netlify.app` est vérifié en HTTPS : 401 sans authentification, 19 pages SSR en 200 avec authentification, `noindex, nofollow`. L’API Netlify classe ce déploiement avec alias en `branch-deploy` ; `published_at` est nul. La fonction Nitro `server` est présente et le déploiement est `ready`.
- `ROTY_GA_MEASUREMENT_ID=G-L2PJT90F4Y` et `ROTY_GA_ENABLED=0` sont définis dans tous les contextes. L’endpoint distant renvoie `{ "enabled": false, "measurementId": null }` ; aucune requête Analytics n’a été observée en préproduction.
- Base Upstash durable dédiée `les-terrasses-du-roty`, ID `55feadbc-b506-46a2-9240-d15ea0629209`, Free, AWS Francfort (`eu-central-1`), éviction désactivée, TLS actif. URL REST et token secret sont configurés sur le seul projet Roty. Le token a été transféré entre les interfaces Upstash et Netlify, puis retiré du presse-papiers ; aucune valeur n’a été exposée dans les rapports.

La documentation officielle autorise les projets commerciaux sur [Netlify Free](https://www.netlify.com/blog/introducing-netlify-free-plan/). Le [plan Free actuel](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) comprend 300 crédits mensuels avec limite stricte sans recharge automatique ; les projets peuvent être suspendus si cette limite est atteinte. Aucun autre projet du compte n’est réutilisé. Le [preset Nitro `netlify`](https://nitro.build/deploy/providers/netlify) conserve SSR et routes serveur avec publication dans `dist` ; le code du Nitro installé confirme la fonction générée dans `.netlify/functions-internal/server/server.mjs`.

État des accès et des services au 9 septembre 2026 :

1. La préproduction Netlify fonctionne, mais les crédits du cycle sont épuisés et les crédits de fonctionnement ne permettent pas une publication de production. Aucun achat ni changement de plan. Le projet Cloudflare Pages dédié est créé et sa préproduction protégée est déployée ; la preuve et la recette courante figurent dans `DEPLOYMENT-CLOUDFLARE.md`.
2. OVH : session accessible, sauvegarde DNS réalisée, trois enregistrements Resend publiés puis vérifiés par l’agent principal. `www` reste dirigé vers Shopify jusqu’au feu vert de recette ; son TTL a été abaissé à 300 secondes.
3. Shopify : session administrateur accessible pour la boutique `vwpjn4-w0`. L’agent principal prend en charge les réglages et la conservation du retour arrière.
4. Resend : domaine `notifications.les-terrasses-du-roty.fr` vérifié, ID `e8a63e6e-74ad-4236-b83c-17a929c63027`, région Irlande. Clé d’envoi limitée à ce seul domaine configurée comme secret sur Netlify et Cloudflare Preview/Production. Rotation achevée et ancienne clé révoquée après redéploiements. L’expéditeur serveur est l’adresse seule `site@notifications.les-terrasses-du-roty.fr` ; ne pas ajouter un nom d’affichage dans cette variable validée comme e-mail.
5. Upstash : token de la base dédiée configuré comme secret sur Netlify et Cloudflare Preview/Production ; espaces de noms distincts. Aucun secret d’un autre projet n’est employé.
6. La boîte `taff.roty@gmail.com` n’est pas directement connectée. La livraison prestataire et la réception confirmée par le titulaire sont deux preuves distinctes. Une confirmation utilisateur reste nécessaire pour attester la présence du test dans sa boîte ou ses indésirables.

## Préproduction

- Construire le commit final avec `ROTY_BUILD_TARGET=netlify npm run build`. Le fichier `netlify.toml` fixe le même preset lors d’un build Netlify. Vérifier la présence de `dist` et `.netlify/functions-internal/server/server.mjs` et conserver le SHA du commit avec les résultats du build.
- Après validation de cet artefact, déployer uniquement une preview : `netlify deploy --context deploy-preview --dir dist --site b5b6a14e-3b07-4f89-8016-af1740b20192 --alias preproduction --json`. La CLI 26.1 refuse `--context` avec `--no-build` : cette commande reconstruit le même commit en contexte preview. Ne pas ajouter `--prod` à cette étape. La CLI découvre la fonction interne générée par Nitro ; sa présence a été confirmée dans le déploiement ci-dessus.
- Configurer `ROTY_PREVIEW_MODE=1`, `ROTY_PREVIEW_USER`, `ROTY_PREVIEW_PASSWORD` via les secrets de l’hébergeur. Tout hôte de préproduction distant sans mot de passe est refusé en 503. En local, le serveur est lié à `127.0.0.1`.
- Les six variables préparées s’appliquent actuellement aussi au contexte production afin de le laisser fermé pendant la préparation. Au moment de publier la version validée, supprimer le mot de passe dans le seul contexte production, mettre `ROTY_PREVIEW_MODE=0` dans ce contexte et définir namespace/origines/secrets de production. Conserver la protection des previews. Les variables runtime doivent être définies avec la CLI/API, car [les variables dans `netlify.toml` ne sont pas transmises aux fonctions](https://docs.netlify.com/build/functions/environment-variables/).
- Employer un namespace Redis propre à la préproduction ; autoriser seulement son origine HTTPS exacte, avec celle de production ajoutée au moment approprié. Ne jamais employer `*`.
- Exécuter les mêmes contrôles HTTP/navigateur sur la préproduction avec une recette adaptée à cette URL et aux accès ; les scripts de soumission fournis sont volontairement limités à localhost.
- Exécuter une demande technique explicitement marquée, adressée uniquement à la boîte autorisée. Noter séparément identifiant demande, acceptation prestataire, éventuel événement de livraison, réception effective et dossier (boîte principale/indésirable). Un 200 ne prouve pas cette réception.
- Tester une panne d’envoi et vérifier qu’aucun succès n’apparaît.

Recette distante effectuée : 27 contrôles HTTP réussis et deux vues navigateur (accueil 1440 px, demande 390 px), sans débordement, image cassée ni erreur JavaScript. Une saisie fictive explicitement marquée « TEST TECHNIQUE ROTY » a produit un vrai POST 503, car Resend n’était pas encore configuré lors de ce premier test ; message d’échec affiché et champs conservés. Aucun message n’a été transmis. Rapports : `docs/verification/netlify-preview-http.json` et `docs/verification/netlify-preview-browser.json`.

## Informations à finaliser avec la cible réelle

`LegalPages.tsx` décrit l’hébergement du domaine public constaté au 9 septembre 2026. Remplacer ce paragraphe par l’identité du nouvel hébergeur lors de la bascule. GA4 est implémenté avec consentement préalable et reste désactivé en préproduction ; voir `docs/ANALYTICS-CONSENT.md`. Les données techniques Redis expirent après 48 h ; aucune suppression automatique dans Gmail n’est annoncée. Avant collecte en production, documenter les prestataires réellement retenus, leurs éventuels transferts, et la durée/règle de purge de la messagerie que le responsable appliquera.

Les fiches ne promettent ni prix, ni stock, ni certification, ni appellation non prouvés. Ces données pourront être enrichies à partir de justificatifs du domaine. Le site ne conclut aucune vente ; les contrats commerciaux antérieurs restent chez Shopify et les modalités d’une vente ultérieure doivent être communiquées avant son acceptation.

## Contrôles de bascule

- Archiver l’ID du déploiement validé et le thème Shopify avec ses réglages. L’inventaire public n’est pas un export de clients/commandes.
- Relever à nouveau les DNS et sauvegarder la zone ; `docs/evidence/dns-before.txt` décrit le relevé de cette intervention.
- Configurer certificat HTTPS et domaine canonique `www` sur la cible ; enregistrer les valeurs web précises fournies. Ne pas modifier NS/MX/TXT de messagerie.
- Ne retirer la protection de préproduction que sur la version de production validée. La production sert un robots ouvert et un sitemap de 19 URLs ; les previews restent `noindex`.
- Vérifier les 19 pages, assets, redirections précises, 404/410, absence de parcours marchand et demande réelle depuis le domaine HTTPS.
- Noter commit, ID de déploiement, DNS avant/après, heure et preuve d’envoi/réception. Conserver le déploiement stable précédent et la commande de restauration fournie par l’hébergeur.

## Retour arrière disponible

Référence du dépôt avant refonte : `c56ec8d465d71399c9def39a696c133caa9a2f4f`. Archive Git locale `../rollback-c56ec8d.tar.gz`, inventaire 180 entrées vérifié. Le commit `042a3c7` n’effectue que le formatage des composants immersifs archivés selon le lint existant.

Sur la future cible SSR, revenir au déploiement immuable précédemment validé, selon la commande du fournisseur ; aucun ID de déploiement inexistant n’est indiqué ici.

Pour revenir au domaine Shopify après une future bascule, restaurer les valeurs vérifiées juste avant celle-ci. Valeurs observées pendant cette mission :

- `www` : CNAME `shops.myshopify.com.` ; TTL initial 3600, abaissé à 300 pendant la préparation OVH.
- Apex : A `23.227.38.65`, TTL 3600.
- Thème Shopify principal conservé : `183360323928`.

Les MX, NS et TXT ne sont pas concernés. Vérifier HTTPS, canonique et affichage après propagation. **Ce retour DNS rétablirait aussi l’ancien commerce Shopify** ; pour une panne d’envoi seule, préférer conserver les pages et le formulaire en erreur explicite plutôt que rouvrir involontairement un parcours de paiement retiré.

Cette sous-tâche a créé la préproduction Netlify et la base Upstash dédiées, configuré les secrets d’envoi puis effectué leur rotation. La publication Cloudflare, les opérations DNS et Shopify et la recette réelle d’envoi sont suivies dans leurs rapports séparés. Aucun test positif supplémentaire n’a été envoyé depuis Netlify.
