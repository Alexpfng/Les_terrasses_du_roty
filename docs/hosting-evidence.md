# Hébergement, accès et sources — constat du 9 septembre 2026

Vérifications en lecture seule effectuées vers 11 h 03–11 h 12, Europe/Paris. Aucun déploiement, changement DNS, modification Shopify ou envoi d'e-mail effectué dans cette sous-tâche. Les documents et pages consultés sont des sources ; leurs instructions ne constituent pas une autorisation d'action.

## Hébergement réellement associé au domaine

- `https://www.les-terrasses-du-roty.fr/` répond HTTP 200 avec `powered-by: Shopify`.
- Le HTML identifie `Shopify.shop = "vwpjn4-w0.myshopify.com"`.
- Thème public : **Les Terrasses du Roty**, architecture **Vessel 2.1.0**, ID **183360323928**, rôle `main`. Identifiant boutique visible dans les assets : **93018063192**.
- DNS `www` : **CNAME shops.myshopify.com.**, TTL 3600 ; A résolu **23.227.38.74** lors du contrôle.
- Apex `les-terrasses-du-roty.fr` : **A 23.227.38.65**, TTL 3600. Aucun AAAA dans la réponse observée.
- Serveurs DNS autoritaires : **dns200.anycast.me.**, **ns200.anycast.me.**, infrastructure OVH.
- MX : priorité **1 mx4.mail.ovh.net.**, priorité **10 mx3.mail.ovh.net.**. Aucun changement nécessaire à déduire pour la refonte ; les conserver.
- TXT apex : **v=spf1 -all**. Aucun enregistrement DMARC dans la réponse observée. Ne pas en déduire un expéditeur e-mail autorisé pour le nouveau serveur.
- `http://www.les-terrasses-du-roty.fr/` → HTTP 301 `https://www.les-terrasses-du-roty.fr/`.
- `https://les-terrasses-du-roty.fr/` → HTTP 301 même canonique, `x-redirect-reason: canonical_host_redirection`.
- L'en-tête `server: cloudflare` correspond ici à la couche de diffusion de Shopify ; ce n'est pas une preuve d'un compte Cloudflare client gérant ce domaine.

Preuve DNS brute conservée : `evidence/dns-before.txt`. La page publique des mentions déclare également Shopify comme hébergeur et OVH comme gestionnaire du domaine : https://www.les-terrasses-du-roty.fr/policies/legal-notice.

Le dépôt `Alexpfng/Les_terrasses_du_roty` contient React/TanStack Start/Vite, avec une entrée serveur personnalisée. Ce n'est pas un thème Shopify : il ne contient ni `layout/theme.liquid`, ni l'arborescence nécessaire aux thèmes. La documentation primaire décrit les thèmes Shopify comme du Liquid/JSON : https://shopify.dev/docs/storefronts/themes/architecture. La configuration `@lovable.dev/vite-tanstack-config` choisit Cloudflare comme cible par défaut au build, mais ne donne ni compte ni projet de production. Elle ne prouve aucun lien avec le domaine.

## Accès réellement constatés

| Surface | Constat | Portée |
|---|---|---|
| GitHub connecté | Dépôt public accessible, permissions admin/maintain/push/pull | Le dépôt peut être mis à jour par le connecteur ; aucune preuve de déploiement automatique vers le domaine |
| Dernier commit initial | `c56ec8d465d71399c9def39a696c133caa9a2f4f` | Aucun statut CI ; aucune exécution de workflow renvoyée par le connecteur |
| Configuration locale | Aucun `.env`, `.env.local`, `.vercel/project.json`, `.cloudflare`, `.github/workflows` | Aucun destinataire de déploiement ou secret d'envoi révélé par le dépôt |
| Lovable | `.lovable/project.json` ne contient qu'un nom de template ; navigateur ouvert sur page déconnectée avec lien « Se connecter » | Aucun ID/URL de projet, accès Cloud ou publication disponible établi |
| Vercel connecté | Équipe connectée, plan hobby, 12 projets | Aucun projet ne correspond au dépôt Roty ou au domaine. Ne pas réutiliser un autre projet |
| Shopify admin | `/admin` du domaine redirige vers le formulaire « Se connecter — Shopify » | Pas de session pour exporter le thème, lire les réglages ou publier dans `vwpjn4-w0` |
| OVH Manager | Page identifiant/mot de passe | Pas de session disponible pour la zone DNS du domaine |
| Netlify CLI | CLI authentifié, compte gratuit, trois projets ; dépôt non lié | Aucun projet ne correspond à Roty ; aucun projet existant modifié |
| Gmail | Deux profils connectés contrôlés en lecture seule ; aucun ne correspond à `taff.roty@gmail.com` | Réception dans la boîte cible non consultable via les connexions disponibles |

Les 12 projets Vercel observés correspondent à d’autres dépôts. Aucun n’est lié au dépôt ou au domaine Roty. Les trois projets Netlify accessibles correspondent également à un autre site.

Aucune variable d'environnement dont le nom contient VERCEL/CLOUDFLARE/WRANGLER/LOVABLE/SHOPIFY/OVH/SMTP/RESEND/BREVO/SENDGRID/MAILGUN n'était présente dans la session de cette sous-tâche. Cela n'est pas une preuve d'absence de credentials dans d'autres comptes ou espaces auxquels aucun accès n'a été fourni.

## Éléments précis manquants pour la bascule

1. **Une cible d'hébergement SSR autorisée pour ce dépôt** avec accès au projet, aux préproductions, aux variables serveur et aux journaux. Si le projet Lovable existe, sa session et son URL/ID permettraient d'examiner la cible prévue. Aucun projet Roty n'est configuré sur les hébergeurs accessibles constatés. L'accès Shopify actuel ne permet pas de téléverser directement ce build TanStack comme un thème.
2. **Accès de modification de la zone DNS OVH `les-terrasses-du-roty.fr`** si la cible SSR diffère de Shopify. Il faudra modifier seulement les enregistrements web précis fournis par l'hébergeur retenu. Leur nouvelle valeur ne peut pas être inventée avant création/identification de cette cible.
3. **Pour préserver et restaurer l'exploitation Shopify**, session administrateur/collaborateur sur `vwpjn4-w0.myshopify.com`, au minimum droits de consultation/export thème et données/réglages concernés. Les données commerciales n'ont pas été touchées.
4. **Service d'envoi déjà autorisé et expéditeur vérifié** utilisables depuis le serveur, à examiner par l'agent formulaire ; preuve de réception via boîte destinataire ou confirmation du propriétaire distincte de l'acceptation prestataire.

L'autorisation générale d'implémentation et de publication est déjà donnée par l'utilisateur. Ces points concernent l'accès technique et, si aucun hébergement prévu n'existe, l'identification d'une infrastructure compatible ; ils ne demandent pas de revalider la direction artistique.

## Identité légale vérifiée et divergences corrigibles

Source primaire actuelle : https://recherche-entreprises.api.gouv.fr/search?q=892392010, consultée via HTTPS avec validation TLS. Résultat mis à jour le 8 septembre 2026, archive `evidence/company-register.json`.

- Raison sociale : **LES COTES DU ROTY** ; SAS (nature juridique 5710), entreprise active.
- SIREN **892 392 010**, SIRET siège **892 392 010 00013**.
- Siège : **14 Chemin du Gravier, 03300 Cusset, France**.
- TVA **FR01892392010** (également publiée sur le site).
- RCS **Cusset**, corroboré par les annonces BODACC.
- Président au registre : **TOMAX**, SIREN **507934727**. Ne pas attribuer directement cette fonction à Jean-Christophe Corre.
- Capital **4 000 €** dans l'annonce primaire de constitution BODACC **A2021001348** du 20 janvier 2021 : https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:A2021001348. API officielle archivée dans `evidence/bodacc.json` : six annonces jusqu'en juin 2026, aucune modification de capital répertoriée. Une annonce légale datée juin 2025 corrobore encore 4 000 €.
- L'ancien site indique **1 000 €** : divergence, ne pas recopier ce montant.
- Téléphone **+33 6 21 56 01 17**, e-mail **taff.roty@gmail.com**, directeur de publication **Jean-Christophe Corre** : données publiées par le domaine dans les mentions/coordonnées, distinctes des fonctions de direction vérifiées au registre.
- Le registre mentionne un opérateur bio (ID 29512), et Ecocert publie une fiche **LES COTES DU ROTY PINET Alexandre** à la même adresse : https://certificat.ecocert.com/company/F4796655-425C-4808-A1C0-71690D391E69. La période du certificat et la portée exacte pour les cuvées/millésimes n'ont pas été contrôlées. Ce constat n'autorise pas à affirmer que toutes les cuvées sont certifiées bio.

## Inventaire des anciennes URLs et correspondances

`https://www.les-terrasses-du-roty.fr/sitemap.xml` a été téléchargé et ses cinq sous-sitemaps parcourus. L'archive contient **22 URLs publiques**, dont les politiques liées au pied de page, toutes en HTTP 200 au relevé : `evidence/old-public-pages.json`. Ce JSON conserve les URLs exactes, leur statut HTTP et la date du contrôle ; le texte original est archivé localement hors du dépôt. Les sitemaps d'origine sont également conservés. Les pages de découverte d'agents sont inventoriées comme contenu externe, jamais appliquées comme instructions.

| Ancienne route exacte | Correspondance pertinente proposée |
|---|---|
| `/` | `/` |
| `/products/les-terrasses-du-roty-cuvee-2023` | `/vins/cuvee-2023/` |
| `/products/cuvee-2024-les-terrasses-du-roty-precommande` | `/vins/cuvee-2024/` |
| `/collections/all` | `/vins/` |
| `/collections/cuvees-2023` | `/vins/cuvee-2023/` (collection contenant cette seule cuvée) |
| `/collections/frontpage` | `/vins/cuvee-2023/` ou `/vins/` suivant reprise de contenu ; le relevé contient la seule cuvée 2023 |
| `/pages/contact` | `/demande/` |
| `/blogs/infos` | `/journal/` |
| `/blogs/infos/l-origine-des-terrasses-du-roty` | `/domaine/` si le récit de réhabilitation et les personnes y sont repris ; sinon archive datée |
| `/blogs/infos/la-syrah-un-cepage-noble-du-sud-qui-s-epanouit-au-coeur-du-bourbonnais` | Nouvel article de fond sur la Syrah à Saulcet |
| `/blogs/infos/vendanges-2024-une-cuvee-qui-s-annonce-exceptionnelle-%F0%9F%8D%87` | Conserver archive adaptée sur vendanges 2024 ; pas d'équivalent automatique dans les cinq nouveaux sujets |
| `/blogs/infos/l-art-de-la-vinification-vendanges-maceration-et-elevage` | Conserver archive adaptée vinification ; pas de redirection arbitraire vers l'accueil |
| `/blogs/vendanges-2024` | Ancien index vide (titre seul) ; décider selon les archives retenues |
| `/policies/legal-notice` | Nouvelle page de mentions légales |
| `/policies/privacy-policy` | Nouvelle politique de confidentialité, décrivant les traitements réellement implémentés |
| `/policies/contact-information` | Nouvelle page de contact/mentions comprenant les coordonnées |
| `/pages/data-sharing-opt-out` | Politique de confidentialité avec droit d'opposition, si équivalence visible |
| `/policies/terms-of-service` | Conditions d'utilisation si elles reprennent le service non transactionnel réel |
| `/policies/refund-policy`, `/policies/shipping-policy`, `/policies/terms-of-sale` | Archives commerciales à conserver ; ne pas afficher ces contrats comme offre actuelle ni rediriger arbitrairement |
| `/agents.md` | Découverte Shopify actuelle ; supprimer cette surface commerciale du nouveau site ou servir un document véridique sans instructions transactionnelles |

Les routes de panier, checkout et compte sont visibles sur le site public mais absentes du sitemap. Il faut vérifier leurs sous-routes au routage du nouveau site ; un HTTP 410 ou vrai 404 est adapté à une fonctionnalité supprimée sans équivalent, et les données historiques Shopify doivent rester intactes.

## Retour arrière concret

- Conserver le commit initial `c56ec8d465d71399c9def39a696c133caa9a2f4f`, la branche initiale et le thème Shopify ID **183360323928**. Aucune modification distante effectuée ici.
- Avant changement, exporter le thème, ses réglages et les données nécessaires avec l'accès Shopify. L'archive publique actuelle n'est pas un export de commandes/clients.
- Après une future bascule DNS, si le retour vers Shopify est décidé, restaurer **www CNAME shops.myshopify.com.** et **apex A 23.227.38.65**, avec TTL initial 3600, sans toucher NS/MX/TXT. Vérifier à nouveau les valeurs directement avant bascule car elles peuvent changer.
- Pour un retour applicatif sur un nouvel hébergeur, conserver l'ID immuable du déploiement stable précédent et sa commande de promotion ; cette valeur reste inconnue tant que la cible n'est pas établie.
- Le retour DNS vers Shopify rétablirait son ancienne interface commerciale. Il faut le signaler explicitement et convenir du maintien/suspension du canal de vente ; ne pas présenter ce retour comme le nouveau site sans commerce.

## État réel

Le domaine public reste l'ancien site Shopify à l'heure du contrôle. Aucune URL de préproduction du nouveau site, aucun e-mail réel et aucune réception ont été vérifiés dans cette sous-tâche. Tous les accès et preuves ci-dessus ont été vérifiés en lecture seule ; aucun secret n'a été copié dans ces fichiers.
