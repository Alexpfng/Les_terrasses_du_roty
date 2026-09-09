# Bascule et retour arrière

La publication est autorisée par la demande utilisateur. Le 9 septembre 2026, un projet Netlify dédié a été créé sur le compte Free accessible. Aucun artefact n’y a encore été déployé au moment de ce relevé ; la bascule du domaine et la recette des e-mails restent à réaliser.

## Cible réelle et accès manquants

Le domaine public répond toujours sur Shopify (`vwpjn4-w0.myshopify.com`) ; OVH gère la zone DNS. DNS et réponse HTTPS Shopify ont été revérifiés le 9 septembre 2026 à 11:17 UTC. Le dépôt TanStack ne peut pas être téléversé tel quel comme thème Liquid. Le projet Netlify ci-dessous constitue désormais la cible SSR disponible ; un accès Lovable n’est plus nécessaire pour préparer son déploiement. Les sessions Shopify et OVH n’étaient pas accessibles lors de l’inventaire initial.

- Projet : `les-terrasses-du-roty`, ID `b5b6a14e-3b07-4f89-8016-af1740b20192`.
- Compte : `maxclubcomptable`, plan `Free`, sans achat ni changement de plan.
- Administration vérifiée par API : <https://app.netlify.com/projects/les-terrasses-du-roty>.
- Adresse attribuée : `https://les-terrasses-du-roty.netlify.app` ; elle n’est pas une preuve de site livré tant qu’un déploiement n’est pas validé.
- Projet vide créé sans connexion Git ni intégration CI. La liaison locale `.netlify/state.json` sert uniquement à cibler ce projet avec la CLI et reste ignorée par Git.
- Six variables de préproduction sont confirmées via la CLI : `ROTY_PREVIEW_MODE`, `ROTY_PREVIEW_USER`, `ROTY_PREVIEW_PASSWORD`, `ROTY_FORM_HASH_SECRET`, `ROTY_FORM_NAMESPACE`, `ROTY_ALLOWED_ORIGINS`. Le mot de passe et la clé de hachage ont été générés pour ce projet et déclarés secrets. Leur copie locale est dans `test-results/deployment/netlify-preview.env`, ignorée par Git, permissions `0600`. Aucune valeur secrète ne figure dans cette documentation.
- L’alias prévu est `preproduction--les-terrasses-du-roty.netlify.app`. Il n’est pas encore une URL de recette vérifiée.

La documentation officielle autorise les projets commerciaux sur [Netlify Free](https://www.netlify.com/blog/introducing-netlify-free-plan/). Le [plan Free actuel](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) comprend 300 crédits mensuels avec limite stricte sans recharge automatique ; les projets peuvent être suspendus si cette limite est atteinte. Aucun autre projet du compte n’est réutilisé. Le [preset Nitro `netlify`](https://nitro.build/deploy/providers/netlify) conserve SSR et routes serveur avec publication dans `dist` ; le code du Nitro installé confirme la fonction générée dans `.netlify/functions-internal/server/server.mjs`.

Il faut :

1. Un artefact Netlify du commit final, testé avant téléversement. Les accès de création du projet et de configuration des variables serveur sont disponibles ; aucun nouvel accès d’hébergement n’est demandé pour cette étape.
2. L’accès à la zone DNS OVH `les-terrasses-du-roty.fr`, pour les seuls enregistrements web si une bascule hors Shopify est nécessaire. Les valeurs nouvelles seront celles de la cible réellement créée/identifiée ; aucune IP de destination n’est inventée ici.
3. Pour exporter les réglages et conserver un retour vers la boutique : accès administrateur/collaborateur à `vwpjn4-w0.myshopify.com`. Le thème actuel reste intact.
4. Un compte d’envoi autorisé avec expéditeur authentifié et un Redis HTTP partagé pour les protections : `RESEND_API_KEY`, `ROTY_MAIL_FROM`, `ROTY_REDIS_REST_URL`, `ROTY_REDIS_REST_TOKEN`. Aucun de ces accès n’est présent dans l’environnement du processus ni dans un fichier `.env` du projet. Aucun connecteur d’envoi Resend/SMTP ou Redis/Upstash n’est callable dans cette session. Les variables internes de protection et d’origine ont déjà été créées pour la préproduction ; ne pas réutiliser les secrets d’un autre projet.
5. Accès de lecture à `taff.roty@gmail.com` ou confirmation explicite de réception du message technique par son titulaire. Les comptes Gmail connectés ne sont pas cette boîte.

## Préproduction

- Construire le commit final avec `ROTY_BUILD_TARGET=netlify npm run build`. Le fichier `netlify.toml` fixe le même preset lors d’un build Netlify. Vérifier la présence de `dist` et `.netlify/functions-internal/server/server.mjs` et conserver le SHA du commit avec les résultats du build.
- Après validation de cet artefact, déployer uniquement une preview : `netlify deploy --no-build --context deploy-preview --dir dist --site b5b6a14e-3b07-4f89-8016-af1740b20192 --alias preproduction --json`. Ne pas ajouter `--prod` à cette étape. La CLI découvre la fonction interne générée par Nitro ; vérifier sa présence dans le résultat du déploiement.
- Configurer `ROTY_PREVIEW_MODE=1`, `ROTY_PREVIEW_USER`, `ROTY_PREVIEW_PASSWORD` via les secrets de l’hébergeur. Tout hôte de préproduction distant sans mot de passe est refusé en 503. En local, le serveur est lié à `127.0.0.1`.
- Les six variables préparées s’appliquent actuellement aussi au contexte production afin de le laisser fermé pendant la préparation. Au moment de publier la version validée, supprimer le mot de passe dans le seul contexte production, mettre `ROTY_PREVIEW_MODE=0` dans ce contexte et définir namespace/origines/secrets de production. Conserver la protection des previews. Les variables runtime doivent être définies avec la CLI/API, car [les variables dans `netlify.toml` ne sont pas transmises aux fonctions](https://docs.netlify.com/build/functions/environment-variables/).
- Employer un namespace Redis propre à la préproduction ; autoriser seulement son origine HTTPS exacte, avec celle de production ajoutée au moment approprié. Ne jamais employer `*`.
- Exécuter les mêmes contrôles HTTP/navigateur sur la préproduction avec une recette adaptée à cette URL et aux accès ; les scripts de soumission fournis sont volontairement limités à localhost.
- Exécuter une demande technique explicitement marquée, adressée uniquement à la boîte autorisée. Noter séparément identifiant demande, acceptation prestataire, éventuel événement de livraison, réception effective et dossier (boîte principale/indésirable). Un 200 ne prouve pas cette réception.
- Tester une panne d’envoi et vérifier qu’aucun succès n’apparaît.

## Informations à finaliser avec la cible réelle

`LegalPages.tsx` décrit l’hébergement du domaine public constaté au 9 septembre 2026. Remplacer ce paragraphe par l’identité du nouvel hébergeur lors de la bascule. La page de confidentialité décrit le fonctionnement effectivement implémenté (pas d’analytics, TTL technique 48 h, pas de suppression automatique dans Gmail). Avant collecte en production, documenter les prestataires réellement retenus, leurs éventuels transferts, et la durée/règle de purge de la messagerie que le responsable appliquera. Ne pas annoncer une suppression automatique qui n’existe pas.

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

- `www` : CNAME `shops.myshopify.com.`, TTL 3600.
- Apex : A `23.227.38.65`, TTL 3600.
- Thème Shopify principal conservé : `183360323928`.

Les MX, NS et TXT ne sont pas concernés. Vérifier HTTPS, canonique et affichage après propagation. **Ce retour DNS rétablirait aussi l’ancien commerce Shopify** ; pour une panne d’envoi seule, préférer conserver les pages et le formulaire en erreur explicite plutôt que rouvrir involontairement un parcours de paiement retiré.

À la date de ce relevé, aucun DNS, thème Shopify ni donnée commerciale n’a été modifié. Seuls le projet Netlify dédié et ses variables de préproduction ont été créés ; aucun envoi d’e-mail réel ni réception n’a été validé.
