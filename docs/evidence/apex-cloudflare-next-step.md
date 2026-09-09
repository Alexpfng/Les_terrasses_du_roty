# Domaine sans www — raccordement terminé

Vérifié le 9 septembre 2026 à 13:38:46 UTC. Les domaines `les-terrasses-du-roty.fr` et `www.les-terrasses-du-roty.fr` sont **Active / SSL enabled** dans le projet Cloudflare Pages `les-terrasses-du-roty`. La délégation Cloudflare a été observée sur les trois serveurs autoritatifs `.fr` à **13:34:09.224392 UTC**, après la demande OVH acceptée à 13:27:46 UTC.

L’ancien A apex `23.227.38.65` a été remplacé par le CNAME `les-terrasses-du-roty.pages.dev`, avec proxy Cloudflare et TTL Auto. L’association Pages a été créée avant son activation DNS. Le CNAME `www` reste inchangé, DNS only, TTL 1 h. L’interface contient toujours **9 enregistrements** ; les MX OVH, SPF, alias `account` et trois enregistrements Resend ont été conservés. Les 14 comparaisons autoritatives sur les deux NS Cloudflare concordent avec le relevé préalable.

Les **7 contrôles HTTP passent** avec résolution publique normale et validation du certificat : GET et HEAD apex renvoient **308** vers `www` pour `/`, `/domaine/` et `/demande/?profil=caviste&objet=professionnel`, sans perdre le chemin ni les paramètres ; `www` renvoie 200 avec le contenu SSR. La redirection est assurée par le code existant, sans nouvelle règle de redirection Cloudflare.

## Opérations restant différées

La signature DNSSEC Cloudflare est préparée ; DNSKEY et RRSIG sont servis, mais **aucun nouveau DS n’a encore été publié chez OVH**. Les valeurs publiques et leur vérification sont enregistrées dans `cloudflare-dnssec-prepared.json`.

**Ne pas publier le nouveau DS ni retirer les anciens alias/domaines Shopify avant le 9 septembre 2026 à 15:34:09.224392 UTC**, puis contrôler à nouveau l’état DNS. Cette borne conservatrice additionne les anciens TTL NS et A apex (2 × 3600 s) après l’observation de la délégation Cloudflare sur tous les serveurs `.fr`. L’agent principal garde la responsabilité de ces opérations. La boutique ancienne reste protégée et ses deux produits sont en brouillon pendant ce délai.

Conserver la zone OVH et les alias de redirection Shopify durant la propagation permet aux clients utilisant encore l’ancienne délégation de rejoindre `www`. Ne pas recopier les adresses A/AAAA partagées de Cloudflare dans OVH : elles ne constituent pas une adresse d’hébergement réservée au domaine. Le retour applicatif se fait prioritairement via un déploiement Pages précédemment validé ; une restauration DNS doit tenir compte de l’état du DS et de ses caches.

Preuves : `cloudflare-apex-transition.json`, `cloudflare-dnssec-prepared.json`, `dns-transition.json` et `../verification/cloudflare-apex-http.json`. Le relevé initial `cloudflare-zone-ready-2026-09-09.json` reste un historique avant bascule.

Sources primaires consultées : [Pages — domaine apex](https://developers.cloudflare.com/pages/configuration/custom-domains/#add-a-custom-apex-domain), [Cloudflare DNSSEC](https://developers.cloudflare.com/dns/dnssec/), [OVH — DNSSEC](https://docs.ovhcloud.com/en/guides/web-cloud/domains/dns-dnssec).
