# Bascule et retour arrière

La publication est autorisée par la demande utilisateur. Aucun déploiement public n’est effectué à ce stade : les prérequis techniques ci-dessous restent indisponibles.

## Cible réelle et accès manquants

Le domaine public répond sur Shopify (`vwpjn4-w0.myshopify.com`) ; OVH gère la zone DNS. Le dépôt TanStack ne peut pas être téléversé tel quel comme thème Liquid. Aucun projet Roty n’a été retrouvé sur les comptes Vercel ou Netlify accessibles. Lovable, Shopify et OVH sont déconnectés.

Il faut :

1. L’URL/ID et la session du projet Lovable relié à `Alexpfng/Les_terrasses_du_roty`, ou une cible SSR expressément autorisée, avec droits préproduction, déploiement, variables serveur et journaux. Aucun autre projet existant ne doit être détourné.
2. L’accès à la zone DNS OVH `les-terrasses-du-roty.fr`, pour les seuls enregistrements web si une bascule hors Shopify est nécessaire. Les valeurs nouvelles seront celles de la cible réellement créée/identifiée ; aucune IP de destination n’est inventée ici.
3. Pour exporter les réglages et conserver un retour vers la boutique : accès administrateur/collaborateur à `vwpjn4-w0.myshopify.com`. Le thème actuel reste intact.
4. Un compte d’envoi autorisé, son expéditeur authentifié et Redis HTTP partagé pour les protections. L’implémentation livrée attend `RESEND_API_KEY`, `ROTY_MAIL_FROM`, `ROTY_ALLOWED_ORIGINS`, `ROTY_REDIS_REST_URL`, `ROTY_REDIS_REST_TOKEN`, `ROTY_FORM_HASH_SECRET`, `ROTY_FORM_NAMESPACE`. Aucune de ces valeurs privées n’a été créée ou supposée.
5. Accès de lecture à `taff.roty@gmail.com` ou confirmation explicite de réception du message technique par son titulaire. Les comptes Gmail connectés ne sont pas cette boîte.

## Préproduction

- Déployer le commit de la branche dédiée sur la cible établie, en conservant React/TanStack/Vite et l’adaptateur correspondant.
- Configurer `ROTY_PREVIEW_MODE=1`, `ROTY_PREVIEW_USER`, `ROTY_PREVIEW_PASSWORD` via les secrets de l’hébergeur. Tout hôte de préproduction distant sans mot de passe est refusé en 503. En local, le serveur est lié à `127.0.0.1`.
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

Aucun DNS, thème, secret distant ni donnée commerciale n’a été modifié pendant cette livraison.
