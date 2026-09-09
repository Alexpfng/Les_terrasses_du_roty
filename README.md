# Les Terrasses du Roty

Refonte React 18 / TanStack Start / Vite : noir et or, logo original, 19 pages rendues côté serveur, cinq nouveaux articles et deux archives, demande sans commerce en ligne.

**État de livraison : code implémenté, publication bloquée par les accès d’hébergement/DNS et l’absence de configuration d’envoi.** Le domaine public reste sur Shopify. Le build local ne constitue pas un déploiement public.

## Démarrer

```sh
npx --yes bun@1.3.9 install --frozen-lockfile
npm run dev -- --host 127.0.0.1 --port 5173
```

Build de production exécutable en local :

```sh
npm run build:local
npm run start:local
```

Ouvrir http://127.0.0.1:4173. Le serveur reste lié à l’interface locale et les réponses portent `noindex`. Le build habituel `npm run build` conserve la configuration Lovable existante. `ROTY_BUILD_TARGET=node-server` est seulement l’adaptateur utilisé pour la recette locale ; aucun nouveau fournisseur n’a été créé.

## Formulaire

`POST /api/demandes` impose `taff.roty@gmail.com` côté serveur. L’implémentation Resend + Redis HTTP reste fermée avec HTTP 503 si la configuration manque. Aucun secret n’est distribué au navigateur, aucun succès n’est affiché sans acceptation réelle par le prestataire.

Voir [FORMULAIRE-SERVEUR.md](docs/FORMULAIRE-SERVEUR.md) et `.env.example`. Configurer seulement un compte d’envoi autorisé, un expéditeur vérifié et un stockage Redis partagé. Le domaine actuel annonce SPF `-all` : aucune capacité d’expédition n’en a été déduite.

## Vérifier

```sh
npm run lint
npm run typecheck
npm run test:server
npm run build:local
# Laisser npm run start:local ouvert dans un autre terminal.
npm run test:http
npm run test:browser
npm run test:runtime
```

Les tests Redis d’intégration nécessitent `redis-server` et `redis-cli` : renseigner `ROTY_TEST_REDIS_SERVER` et `ROTY_TEST_REDIS_CLI` si absents du PATH. Sans ces binaires, les cas Redis sont explicitement sautés ; cela ne constitue pas une validation de ces cas. Aucun e-mail réel n’est envoyé par les tests.

Le navigateur automatisé utilise Chrome installé. Pour Chromium Playwright : `npx playwright install chromium`, puis `ROTY_TEST_CHROMIUM=1 npm run test:browser`. Le test impose une cible locale afin de ne pas envoyer de données de recette à un vrai domaine par inadvertance.

Le workflow GitHub `Verify Roty site` répète les contrôles avec Redis réel et Chromium. Il ne déploie pas.

## Exploitation et migration

- [Livraison et résultats](docs/DELIVERY.md)
- [Hébergement constaté, accès et retour arrière](docs/hosting-evidence.md)
- [Recette indépendante et captures](docs/qa/README.md)
- [Sources et contenus](docs/content-verification.md)
- [Procédure de bascule](docs/DEPLOYMENT.md)

Le parcours immersif initial est conservé dans `src/terrasse/` pour l’historique ; aucune route publique ne l’importe. Ses composants commerciaux et 3D ne font pas partie du bundle de la refonte. Les données et contrats Shopify n’ont pas été supprimés.
