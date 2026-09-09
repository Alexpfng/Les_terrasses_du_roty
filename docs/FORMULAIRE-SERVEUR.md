# Formulaire serveur — configuration et preuve d’envoi

État au 9 septembre 2026 : le formulaire est **en production sur Cloudflare Pages**, commit `bf7957241ede2b144480b8f781eb35d5db8644b0`, avec Resend et Upstash configurés. Le test technique envoyé depuis `https://www.les-terrasses-du-roty.fr/api/demandes` a été accepté à **12:34:46.511 UTC**, puis marqué **Delivered** par Resend avec réponse du serveur Gmail **SMTP 250 2.0.0 OK**. La consultation directe de la boîte `taff.roty@gmail.com`, son dossier de classement et la lecture humaine restent **non vérifiées**.

Référence applicative : `10ef8bf8-6178-460d-a708-ebcd504a090d`. Identifiant Resend : `cde5e306-ebd4-4d39-b47e-9ec1bd84c3a1`. Le test portait la mention `TEST TECHNIQUE ROTY PRODUCTION`, sans prospect ni achat réel. Les preuves sont dans [le rapport HTTP](verification/cloudflare-production-mail.json), [le journal d’exécution](verification/cloudflare-production-mail-runtime.json) et [la confirmation Resend](evidence/resend-delivery.json). Ce contrôle ne chargeait pas Google et n’a créé aucune conversion Analytics.

L’expéditeur `site@notifications.les-terrasses-du-roty.fr` appartient au sous-domaine réellement vérifié chez Resend. Les MX et le SPF existants du domaine racine ont été préservés. Les clés Resend et Redis de Preview et Production sont enregistrées comme secrets chiffrés. L’intégration réelle Redis REST et l’envoi ont aussi été vérifiés en préproduction sous namespace distinct, avant la bascule.

La nouvelle interface inspirée d’Apple a passé la recette locale et attend la préproduction ; les preuves d’envoi réel concernent la version publique précédente. Les changements de présentation conservent le contrat, l’idempotence, les erreurs et l’instrumentation du formulaire.

## Intégration

Le serveur délègue `/api/demandes` à `handleDemande(request)` de `src/lib/demandes.server.ts`. L’export est un handler `Request → Promise<Response>`. Les variables d’environnement sont lues à chaque requête, dans le module serveur. Aucun secret n’est déclaré sous un nom `VITE_*` ni importé par le formulaire React.

Le client envoie du JSON selon `demandeSchema` (`src/lib/demande-schema.ts`), avec un `idempotency_key` UUID créé une seule fois par demande et un champ anti-robot `website` vide. La source est un chemin de la liste autorisée ; les paramètres de campagne sont limités à des valeurs éditoriales explicites, sans URL ni identifiant personnel. Les champs facultatifs numériques ou à choix sont omis lorsqu’ils sont vides.

Le bouton est « Envoyer ma demande ». Afficher une confirmation uniquement si la réponse HTTP est 200 **et** si `status` vaut `accepted` et qu’une référence `request_id` non vide est présente. Conserver les champs et la clé pendant les erreurs et nouvelles tentatives. Une erreur réseau ou un statut `uncertain` ne justifie pas la création automatique d’une nouvelle clé : le prestataire peut avoir accepté le premier envoi. Une réponse 409 `processing` demande d’attendre ; `review_required` demande un contrôle technique. Les erreurs de validation 422 contiennent `field_errors`, à associer aux champs accessibles. Rien ne confirme une commande ou un paiement.

Les réponses sont privées (`Cache-Control: no-store`). Aucun en-tête CORS n’ouvre le formulaire à un autre site. L’origine exacte est exigée ; cela complète les quotas, sans prétendre authentifier une personne. Les en-têtes d’IP de proxy ne sont jamais utilisés comme identité de confiance.

## Variables serveur indispensables

Configurer ces valeurs uniquement dans le gestionnaire de secrets de l’hébergement autorisé. Ne pas les transmettre dans une URL, une discussion publique ou un fichier versionné.

| Variable                | Valeur attendue                                                                                                                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`        | Clé d’envoi d’un compte Resend autorisé, limitée au domaine d’expédition si possible.                                                                                                                                                                                                 |
| `ROTY_MAIL_FROM`        | Adresse seule, sur un domaine d’expédition **effectivement vérifié** chez le prestataire. Ni adresse du visiteur ni adresse d’essai Resend.                                                                                                                                           |
| `ROTY_ALLOWED_ORIGINS`  | Liste séparée par virgules d’origines HTTPS exactes, sans `/` terminal, chemin ou joker. Production : `https://www.les-terrasses-du-roty.fr`. Préproduction : son origine exacte dans la configuration de préproduction. HTTP localhost accepté seulement hors `NODE_ENV=production`. |
| `ROTY_REDIS_REST_URL`   | Racine HTTPS de l’API REST Redis compatible Upstash, avec écriture et `EVAL`, reliée à une base autorisée. Toutes les instances d’un environnement doivent utiliser la même base et le même point d’écriture.                                                                         |
| `ROTY_REDIS_REST_TOKEN` | Jeton Redis serveur permettant les commandes du handler, protégé et limité à la base concernée.                                                                                                                                                                                       |
| `ROTY_FORM_HASH_SECRET` | Secret aléatoire d’au moins 32 caractères pour HMAC-SHA-256. Utiliser une génération cryptographique dans le gestionnaire de secrets.                                                                                                                                                 |
| `ROTY_FORM_NAMESPACE`   | Nom stable de 3 à 40 caractères minuscules, chiffres ou tirets, par exemple `roty-production` ou `roty-preproduction`.                                                                                                                                                                |

Sans configuration complète et valide, l’endpoint retourne 503, aucun e-mail n’est demandé et aucun succès n’est présenté. Une panne Redis empêche l’appel au prestataire. La production canonique utilise réellement Resend et Redis ; les instances sans configuration continuent à échouer explicitement. Remplacer un prestataire implique d’adapter l’envoi et ses garanties d’idempotence avant activation.

Le destinataire `taff.roty@gmail.com` est une constante serveur non modifiable par la requête. Le visiteur est uniquement en `Reply-To`. L’objet provient de choix contrôlés ; le corps est du texte brut et n’exécute ni HTML ni script fourni par le visiteur. Le code n’envoie aucun accusé de réception automatique au visiteur et n’abonne personne à une liste.

## Protection et durée de conservation technique

Le corps est limité à 16 384 octets réellement lus, indépendamment de `Content-Length`, avec un délai maximal de lecture de 5 secondes. Les champs, types, valeurs autorisées, majorité déclarée et caractères de contrôle sont validés côté serveur. Les champs inconnus sont rejetés. Un anti-robot rempli provoque un refus explicite, jamais un faux succès.

Une réservation Lua atomique associe les quotas et l’idempotence dans Redis : 30 tentatives d’envoi par fenêtre globale de 10 minutes, 120 par fenêtre globale de 24 heures et 3 par adresse normalisée sur 15 minutes. Ces fenêtres débutent au premier événement compté. Les appels prestataire répétés après incertitude consomment aussi les quotas. Les doublons déjà acceptés ne déclenchent plus d’envoi. Ces limites bornent l’abus de l’envoi ; le contrôle de charge réseau et les protections de l’hébergement restent nécessaires. Le quota par adresse n’est pas une preuve de propriété de l’adresse, et un attaquant peut épuiser un quota global : surveiller les 429 et ajuster les contrôles en fonction du trafic réel.

Redis contient exclusivement les empreintes HMAC de l’adresse et du contenu, les identifiants techniques, dates, état, compteur de tentatives et identifiant prestataire. **Ces empreintes restent des données pseudonymes**, pas des données anonymes. Le corps et les coordonnées en clair ne sont pas copiés dans Redis. Les compteurs expirent automatiquement en 10 minutes, 15 minutes ou 24 heures ; les états de demande expirent au plus tard 48 heures après leur création, sans prolongation lors des nouvelles tentatives. Les logs de l’application ne contiennent que des événements et identifiants techniques, jamais le contenu, l’adresse, la clé client ou les réponses brutes des services. La conservation du contenu chez Resend est documentée séparément dans la politique de confidentialité (30 jours). Le handler ne purge pas automatiquement la boîte Gmail ; ses accès, classement et conservation relèvent du responsable.

La clé d’idempotence Resend et le corps du message restent identiques pendant une nouvelle tentative. Le handler conserve l’identifiant et la date originaux en Redis. Une réservation concurrente est verrouillée 30 secondes ; les appels Redis expirent après 4 secondes et l’envoi après 8 secondes. Une erreur de réseau, une réponse de serveur ambiguë ou un 2xx sans identifiant valide est signalé `uncertain`. Une acceptation réelle reste signalée comme telle même si sa finalisation Redis échoue ; la réservation initiale et la clé du prestataire permettent de reprendre sans réenvoyer pendant la fenêtre prévue. Un événement technique `demande_storage_finalize_failed` impose de vérifier le stockage.

Les clés d’idempotence du prestataire expirent après 24 heures. Le handler interdit automatiquement les nouvelles tentatives d’une demande non résolue après 23 heures ou après cinq tentatives. Un technicien doit alors rapprocher son identifiant des journaux du prestataire et de la boîte de réception. Ne pas supprimer manuellement les états, changer le secret HMAC, le namespace ou l’expéditeur pendant des demandes en cours. La prévention serveur couvre 48 heures ; une même clé présentée après la purge peut constituer une nouvelle demande. Une interruption prolongée nécessite un contrôle avant reprise. La garantie ne couvre ni les demandes volontairement créées avec de nouvelles clés ni la perte complète de Redis.

Références de protocole vérifiées : [envoi Resend](https://resend.com/docs/api-reference/emails/send-email), [idempotence Resend](https://resend.com/docs/dashboard/emails/idempotency-keys), [API REST Redis Upstash](https://upstash.com/docs/redis/features/restapi).

## Tests reproductibles

Les tests unitaires emploient des réponses de stockage prédéfinies et un **prestataire mock**. Ils ne prouvent aucun e-mail envoyé. Les tests d’intégration utilisent les scripts Lua de production sur un vrai processus Redis local isolé, sans port réseau, sans sauvegarde et détruit en fin de suite. Le transport REST y est adapté au socket Redis local ; l’API REST distante est vérifiée séparément par les recettes réelles de préproduction et de production. Le prestataire e-mail demeure mock dans tous les tests.

```sh
npm run test:server
```

Les tests Redis sont explicitement ignorés si les deux chemins de binaires ne sont pas fournis. Pour les exécuter également, avec des binaires Redis disponibles localement :

```sh
ROTY_TEST_REDIS_SERVER=/chemin/redis-server ROTY_TEST_REDIS_CLI=/chemin/redis-cli npm run test:server
```

Exécution du 9 septembre 2026 : Node 20.20.2, Redis 8.10.1 compilé depuis la source officielle dans `/tmp/roty-redis-verification`, suite complète passée. Les contrôles couvrent validation, rejet des relais et injections, origine, octets UTF-8, panne des services, incertitude, confidentialité technique, délai de purge, idempotence concurrente et limites globales. Aucun service externe n’a été créé pour cette vérification.

## Protocole de vérification lors d’une modification d’envoi

1. Vérifier les accès au projet Pages dédié, au service transactionnel et à la base Redis existants. Contrôler le domaine d’expédition sans altérer les MX existants ni créer de service supplémentaire.
2. Configurer une préproduction avec origine et namespace distincts. Vérifier que les secrets sont absents du bundle navigateur et que les pannes produisent de vraies erreurs accessibles sans vider la saisie.
3. Envoyer une unique demande explicitement nommée `TEST TECHNIQUE — NE PAS TRAITER`, avec une adresse contrôlée et aucune donnée de prospect. L’envoi de cette demande technique entre dans la mission autorisée. Conserver l’URL exacte, l’heure, le statut HTTP et `request_id`.
4. Vérifier dans le compte du prestataire l’identifiant retourné, l’acceptation et le destinataire constant. Rejouer la même requête et vérifier l’absence d’un second envoi. Consigner séparément le statut de livraison fourni par le prestataire, les éventuels rebonds et les contrôles SPF/DKIM/DMARC réellement disponibles.
5. Rechercher le message dans **la boîte `taff.roty@gmail.com`**, avec un accès de lecture à ce compte exact ou une preuve du destinataire. Relever l’identifiant et le dossier où il est arrivé. La réponse API 200 et l’événement de livraison ne prouvent pas une arrivée en boîte principale. Vérifier `Reply-To` dans les en-têtes du message reçu.
6. La recette réelle de production décrite en tête a déjà été effectuée. Une refonte visuelle seule ne justifie pas de renvoyer automatiquement un e-mail. Pour une nouvelle vérification autorisée, conserver le consentement Analytics refusé et documenter séparément acceptation, livraison SMTP et contrôle de boîte. L’accès de lecture au compte Gmail exact ou une confirmation du destinataire manque encore pour cette dernière étape.

## Retour arrière

Le rétablissement du déploiement serveur précédent conserve le namespace, les secrets HMAC et les états Redis encore valides. Garder les identifiants d’envoi en cours et vérifier leur état avant toute relance. Couper temporairement la configuration d’envoi fait échouer les nouvelles tentatives sans produire de succès ; cela n’annule aucun e-mail déjà accepté. Ne pas supprimer Redis, les clés, les journaux utiles ou les messages reçus comme moyen de rollback. Le point de retour Pages est le déploiement `a934ec80-a7b4-4a8f-b2e7-a83150b60f0f` (`bf79572`), décrit dans `DEPLOYMENT-CLOUDFLARE.md`. La vitrine Shopify est privée et ses produits sont en brouillon ; un simple retour DNS ne restituerait donc pas son ancien catalogue public.
