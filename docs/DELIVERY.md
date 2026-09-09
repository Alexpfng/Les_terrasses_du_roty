# Livraison — 9 septembre 2026

**Le nouveau site est publié et vérifié sur [www.les-terrasses-du-roty.fr](https://www.les-terrasses-du-roty.fr/)**, avec le logo noir complet et compact demandé, l’écriture officielle et les photographies du travail au domaine. Un vrai message envoyé depuis le formulaire public a été accepté puis livré au serveur Gmail.

- Commit applicatif déployé : **`296198b69ac45a416807210b3c77593447aacc0e`**.
- Branche : `codex/refonte-noir-or-2026-09-09` ; [PR de la refonte](https://github.com/Alexpfng/Les_terrasses_du_roty/pull/2).
- Production Pages : **`9b2c15f8-283b-493b-89d7-0d61b9111e93`**.
- Préproduction Pages : **`8072ae85-4dba-4fe3-b042-be5ee3ed8114`**.
- Même artefact testé puis publié, SHA-256 **`48d35c4b46c1cd53ab0bae002ca660647fa656aaca04e2fb9e5cc9e18a9c3a8a`**.

Les preuves documentaires et la correction du helper de test de navigation sont ajoutées après le commit applicatif ; elles ne modifient pas le site déployé. [Publication vérifiée](verification/photos-cloudflare-release.json), [procédure d’hébergement](DEPLOYMENT-CLOUDFLARE.md).

## Site et parcours livrés

React 18, TanStack Start/Router, Vite et la configuration Lovable sont conservés. Cloudflare Pages sert le site avec le preset Nitro `cloudflare-pages` et compatibilité Node ; les images, polices et scripts passent directement par le CDN statique, avec deux règles de routage seulement.

Les **19 pages** comprennent l’accueil, le domaine, les terrasses, les vins et deux cuvées, les professionnels, la demande, le journal, les cinq nouveaux articles, deux archives et trois pages légales. Les contenus sont rendus côté serveur et consultables sans JavaScript. Le formulaire indique honnêtement que son envoi sécurisé nécessite JavaScript et conserve un contact téléphonique utilisable.

L’interface emploie des fonds blancs/gris clair, une navigation translucide, des accents or et des animations discrètes qui respectent la réduction du mouvement. Le header et le menu mobile utilisent le **SVG noir officiel complet**, symbole au-dessus du nom, copié sans changement depuis la charte. Largeur : 74 px sur ordinateur, 68 px sur mobile ; proportions et lettrage conservés. [Provenance du logo](logo-provenance.md).

Les photos montrent notamment la restauration des terrasses, la plantation, la récolte, les vignes et l’équipe. Six illustrations fournies par le propriétaire complètent les archives du domaine. Aucune photo ne se répète sur une même page ; sept couvertures distinctes illustrent le journal et ses articles, avec textes alternatifs et métadonnées cohérents. Les illustrations et la retouche de présentation de la bouteille sont signalées dans les mentions légales. [Design](DESIGN-UX-2026-09-09.md), [photos du domaine](evidence/domain-photos.json), [illustrations](evidence/editorial-photo-sources.json).

Panier, checkout, compte et paiement en ligne sont retirés. Les anciennes routes commerciales répondent 410, les inconnues 404 et les redirections utiles sont conservées. Aucun prix, stock, avis ou certification n’est inventé.

## URLs réellement vérifiées

| URL                                                                         | Résultat sur la version publiée                               |
| --------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Accueil](https://www.les-terrasses-du-roty.fr/)                            | HTTPS 200, nouveau rendu, logo noir officiel                  |
| [Domaine](https://www.les-terrasses-du-roty.fr/domaine/)                    | HTTPS 200, archives photographiques du domaine                |
| [Vins](https://www.les-terrasses-du-roty.fr/vins/)                          | HTTPS 200, catalogue sans paiement                            |
| [Professionnels](https://www.les-terrasses-du-roty.fr/professionnels/)      | HTTPS 200, parcours cavistes/restaurateurs                    |
| [Formulaire](https://www.les-terrasses-du-roty.fr/demande/)                 | HTTPS 200, envoi serveur réellement testé                     |
| [Journal](https://www.les-terrasses-du-roty.fr/journal/)                    | HTTPS 200, sept articles illustrés                            |
| [Sitemap](https://www.les-terrasses-du-roty.fr/sitemap.xml)                 | 19 URL canoniques ; sitemap traité par Google                 |
| [Domaine sans www](https://les-terrasses-du-roty.fr/)                       | HTTPS 308 vers www ; chemin et paramètres conservés           |
| [Préproduction](https://preproduction.les-terrasses-du-roty.pages.dev/)     | 401 sans identifiants ; version finale testée sous protection |
| [Préproduction immuable](https://8072ae85.les-terrasses-du-roty.pages.dev/) | Même version, protégée ; Analytics désactivé                  |

Les hôtes techniques `https://les-terrasses-du-roty.pages.dev` et `https://9b2c15f8.les-terrasses-du-roty.pages.dev` répondent volontairement **503/noindex** : le domaine canonique est le point d’accès public. Le serveur de travail `http://127.0.0.1:4323/` est uniquement local au Mac.

## Tests et vérifications

La [CI du commit déployé](https://github.com/Alexpfng/Les_terrasses_du_roty/actions/runs/34360953436) est **réussie** : installation verrouillée, lint, TypeScript, tests serveur, deux builds, HTTP, SEO, Analytics, navigateur, photos et nettoyage du rendu SSR. [Preuve CI](verification/photos-ci.json).

- **32 tests serveur**, dont **9 avec Redis réel**, aucun ignoré. Le fournisseur e-mail est doublé dans ces tests ; la livraison réelle est vérifiée séparément.
- **14 scénarios Analytics**, 19 pages, **95 rendus responsives**, 19 pages sans JavaScript, **19 audits axe sans violation**, 7 scénarios de menu, 38 contrôles HTTP et 37 flux SSR nettoyés. Ces contrôles ne constituent pas une certification d’accessibilité.
- **102 variantes d’image décodées**, absence de doublon photographique sur les 19 pages, couverture/OG/Twitter/JSON-LD cohérents et galerie mobile entièrement révélée au clavier. Le SVG du header est identique au fichier noir officiel. [Recette locale finale](verification/photos-local-summary.json).
- Préproduction distante : **19 pages, 112 ressources**, 60 contrôles GET/HEAD répétés et 13 contrôles supplémentaires de protection/routage ; navigation sur cinq pages à 390 et 1440 px, sept scénarios de menu. Aucun e-mail émis par cette recette.
- Production distante : **19 pages, 112 ressources, 26 liens et 11 contrôles HTTP** ; cinq pages à deux largeurs, sept scénarios de menu, images chargées, zéro erreur navigateur et aucun appel/cookie GA après refus. [HTTP](verification/photos-cloudflare-production-http.json), [navigateur](verification/photos-cloudflare-production-browser.json).

Le helper du menu attend maintenant l’activation du bouton après chaque nouvelle navigation : le test précédent pouvait presser Entrée avant hydratation sur le réseau distant. La lecture des `srcSet` par le helper HTTP est insensible à la casse pour couvrir effectivement AVIF/WebP. Ces corrections concernent les outils de vérification ; aucun défaut applicatif correspondant n’a été masqué.

La mesure de performance locale est une mesure de laboratoire, pas une statistique Core Web Vitals des visiteurs. Dans la fenêtre Cloudflare de préproduction, les 93 événements ont tous `outcome: ok`, sans exception ; CPU médian 6 ms, p95 31 ms, maximum 34 ms. Cette recette courte **ne démontre pas une marge durable sous charge sur le forfait Free**. Aucun forfait payant n’a été activé. [Mesure locale](verification/photos-performance-local.json), [runtime distant](verification/photos-cloudflare-preview-runtime.json).

## État réel des e-mails

Le formulaire passe par Cloudflare Pages → Upstash Redis → Resend. Destinataire fixé côté serveur : **taff.roty@gmail.com**. Expéditeur : **site@notifications.les-terrasses-du-roty.fr**, domaine Resend vérifié. Validation, quotas atomiques, idempotence et conservation de la saisie en cas d’erreur sont opérationnels ; aucun mailto ni succès simulé.

| Étape                           | Observation du test final                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Parcours                        | Vrai formulaire public, profil restaurateur, cuvée 2024 ; marqueur TEST TECHNIQUE, aucune commande              |
| Acceptation                     | HTTP 200 / accepted, 9 septembre vers **14:10 UTC**                                                             |
| Référence serveur               | **9fc7567f-f26d-490d-8fc2-e9117465471e**                                                                        |
| Identifiant Resend              | **c980063e-d972-408e-a4b5-cc3571673d5c**                                                                        |
| Livraison                       | **Sent + Delivered**, acquittement serveur Gmail **250 2.0.0 OK**                                               |
| Écran de confirmation           | Message Merci et référence réellement observés ; focus positionné sur la confirmation                           |
| Réessai identique               | Même contenu et même clé à 14:12 UTC : même référence retournée ; un seul message Resend observé, aucun doublon |
| Analytics                       | Refus exprimé dans le navigateur ; zéro appel Google et aucune conversion de test                               |
| Boîte principale, spam, lecture | **Non vérifiés directement** : accès de lecture au Gmail exact ou confirmation du destinataire nécessaire       |

Le premier helper de recette confondait par erreur `request_id` et clé d’idempotence, deux identifiants distincts dans le contrat serveur. La correction du helper a validé la confirmation à travers un réessai strictement identique, sans nouvel e-mail. [Parcours navigateur et rejeu](verification/photos-production-form-ui.json), [preuve indépendante Resend/Gmail](evidence/resend-apple-ui-delivery.json), [contrat et exploitation](FORMULAIRE-SERVEUR.md). Les preuves des deux e-mails historiques restent conservées.

## Analytics, Search Console et acquisition

GA4 réel **G-L2PJT90F4Y**, propriété **553368095**, flux **15746517257**. Une visite consentie de production a reçu un vrai `page_view` en HTTP 204. La préférence de consentement dure six mois ; GA conserve les événements deux mois, sans mesure améliorée ni personnalisation publicitaire. `generate_lead` est un événement clé déclenché seulement après acceptation réelle. La nouvelle recette confirme l’absence de collecte après refus. [Configuration et preuves](ANALYTICS-SEARCH-CONSOLE.md).

Search Console : propriété **https://www.les-terrasses-du-roty.fr/** vérifiée et associée au flux GA4. Le détail du sitemap affiche « Traitement du sitemap réussi », dernière lecture le 9 septembre, **19 pages découvertes**. Le test live de l’accueil confirme accès Google et indexabilité. Après publication, Google a accepté les demandes d’indexation de **l’accueil, des vins et des professionnels**, avec confirmation « Indexation demandée » et ajout à la file d’exploration prioritaire. Avant ces demandes, les vins étaient détectés mais non indexés et la page professionnels n’était pas encore reconnue. [Preuves des trois demandes](evidence/google-indexing-apple-2026-09-09.json). Ni la demande d’indexation ni l’index historique de l’accueil ne prouvent l’indexation du nouveau rendu ; aucun classement n’est garanti.

Les contenus et le maillage ciblent particuliers, cavistes et restaurateurs. **Aucun nouveau backlink publié n’est vérifié.** Une demande de correction a été envoyée au support Vivino, qui confirme la création d’un dossier. Le formulaire Domaine Ray reste devant un CAPTCHA ; le message destiné à Saulcet est préparé. Le choix du compte expéditeur reste attendu pour les demandes par e-mail : `taff.roty@gmail.com` n’est pas connecté. Aucun achat de lien ni adhésion payante. [État acquisition](BACKLINKS.md), [preuves](evidence/backlink-outreach-2026-09-09.json).

## Hébergement, DNS et retrait de Shopify

L’hébergement réellement actif est **Cloudflare Pages Free** ; le registrar reste OVH. La délégation vers **desi.ns.cloudflare.com** et **rodrigo.ns.cloudflare.com** est confirmée sur trois serveurs `.fr` depuis **13:34:09 UTC**. L’apex et www sont actifs avec SSL ; les neuf enregistrements DNS sont conservés, dont les MX et Resend. L’apex redirige en 308 vers www, en conservant chemin et paramètres.

La vitrine Shopify est privée et ses deux produits ont été mis en brouillon sur tous les canaux. Données commerciales conservées ; compte non supprimé. L’abonnement était **déjà résilié**, avec désactivation annoncée le **8 décembre 2026** ; il n’a pas été réactivé. L’export du thème a été demandé, mais sa réception n’est pas confirmée. [Vitrine](evidence/shopify-retirement.json), [produits](evidence/shopify-catalogue-retired.json).

**Opérations encore différées au moment de cette livraison :** publication du nouveau DS DNSSEC chez OVH et retrait des anciens alias Shopify après expiration conservatrice des caches, **pas avant le 9 septembre à 15:34:09 UTC / 17:34:09 Paris**, puis nouveaux contrôles DNS. Ces anciens alias servent temporairement les clients qui utilisent encore l’ancienne délégation ; le nouveau site public fonctionne déjà sur Cloudflare. Aucun nouveau DS n’a été publié avant cette échéance et les alias ne sont pas présentés comme supprimés. [État DNS exact](evidence/dns-transition.json), [suite des opérations](evidence/apex-cloudflare-next-step.md).

## Retour arrière

Point de retour opérationnel : commit **bf7957241ede2b144480b8f781eb35d5db8644b0**, déploiement **a934ec80-a7b4-4a8f-b2e7-a83150b60f0f**. Son checkout et son bundle restent conservés. La procédure republie cet artefact dans le même projet Pages en conservant secrets, namespace et états Redis ; elle ne relance pas les demandes incertaines avec de nouvelles clés. [Procédure](DEPLOYMENT-CLOUDFLARE.md).

L’ancien commit initial et l’archive Git restent également conservés. Un simple retour DNS vers Shopify ne rouvrirait pas automatiquement son catalogue, volontairement privé et en brouillon. Les opérations DNS finales, la consultation directe de la boîte Gmail et l’acquisition de liens externes restent des états distincts de la publication accomplie.
