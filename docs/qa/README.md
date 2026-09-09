# Recette navigateur indépendante — 9 septembre 2026

Contrôles réels réalisés sur `http://127.0.0.1:5173`, avec le serveur Vite du dépôt, dans une session Chromium isolée `roty-qa` d’agent-browser. Il s’agit d’une recette locale de la refonte en cours ; aucune publication sur le domaine public n’est attestée par ce rapport. Aucun code applicatif n’a été modifié par l’agent de recette.

## Résultat

**30 combinaisons page/largeur passent les contrôles de structure et de débordement.** Les deux défauts observés pendant la recette ont été corrigés par l’agent d’implémentation et les cas concernés ont été rejoués avec succès. Aucun défaut bloquant d’interface ne reste constaté dans le périmètre testé.

L’envoi réel reste **indisponible**, ce que le formulaire annonce correctement : un POST local avec des données techniques fictives a reçu HTTP **503**, sans succès simulé et avec conservation des champs. Aucune acceptation d’e-mail par un prestataire ni réception dans la boîte destinataire n’a été observée.

## Responsive et lecture visuelle

Six routes ont été ouvertes à chacune des largeurs **360, 390, 768, 1280 et 1440 px**, avec une hauteur de 900 px :

- `/`
- `/domaine/`
- `/vins/cuvee-2024/`
- `/demande/`
- `/journal/`
- `/journal/syrah-saulcet-allier/`

Sur les 30 ouvertures : aucun débordement horizontal, aucun élément visible hors de la largeur, aucune image chargée en échec et aucun overlay d’erreur Vite. Chaque page comporte un seul H1 et du contenu textuel substantiel. Aucun vert n’a été détecté dans les couleurs calculées de texte, fond ou bordure de l’interface ; le vert naturel des photographies est exclu de ce contrôle.

Les captures d’accueil mobile, domaine mobile/tablette, cuvée mobile/desktop, formulaire mobile/desktop, journal desktop et article mobile ont également été examinées visuellement. Aucun texte coupé ni chevauchement n’a été observé dans ces vues. Le logo noir et or reste visible, sans recoloration CSS constatée.

Mesures détaillées : [responsive-results.json](responsive-results.json). Les 30 captures complètes de viewport sont conservées localement dans `test-results/qa/` (répertoire ignoré par Git, environ 8 Mo). Quatre preuves sont incluses dans ce dossier :

- [Accueil, 360 px](captures/home-360.png)
- [Accueil, 1440 px](captures/home-1440.png)
- [Menu au clavier, 360 px](captures/menu-keyboard-360.png)
- [Formulaire indisponible, 390 px](captures/demande-unavailable-390.png)

## Clavier et réduction des animations

- Premier `Tab` : lien « Aller au contenu », visible, contour or `rgb(201, 162, 39) solid 2px`.
- `Entrée` sur ce lien : focus réellement déplacé vers `main#contenu`.
- Quatrième `Tab` depuis une nouvelle page mobile : bouton Menu.
- `Espace` ouvre le menu ; `aria-expanded="true"`, navigation mobile visible, largeur toujours 360 px.
- Navigation au clavier jusqu’à « Les cuvées », contour or visible ; `Entrée` ouvre `/vins/` et le menu est fermé dans la nouvelle page.
- Après une soumission vide, focus sur la synthèse `role="alert"`. `Tab`, puis `Entrée` sur l’erreur Nom place le focus dans `input#name`, lié à `name-error` par `aria-describedby`.
- Préférence `prefers-reduced-motion: reduce` réellement activée : aucun élément avec durée d’animation ou de transition différente de `0s`, et `scroll-behavior: auto`.

Mesures détaillées : [keyboard-results.json](keyboard-results.json) et [interactions-results.json](interactions-results.json).

## Formulaire et erreurs

- `/demande/?cuvee=2024` sélectionne bien Cuvée 2024.
- Le profil Professionnel fait apparaître le champ Établissement.
- La demande de renseignement sur une expédition fait apparaître Pays et Code postal.
- Soumission vide : nom, e-mail et majorité marqués invalides, textes français et synthèse d’erreurs focalisée.
- Quantité `0` : rejet avec « Indiquez au moins une bouteille. », champ et synthèse associés.
- Une soumission valide fictive, explicitement nommée `TEST TECHNIQUE CODEX`, avec `test-technique@example.com`, quantité 12 et message de recette, déclenche un vrai appel `POST /api/demandes`.
- Réponse observée : HTTP 503, annonce « Votre demande n’a pas été transmise », aucune `.form-success`, synthèse focalisée et conservation du nom, e-mail, établissement, quantité et message.

Une première tentative a coïncidé avec une mise à jour HMR du développement ; elle n’a pas servi à conclure sur la conservation. Le scénario a été rejoué sur un chargement neuf après la correction, avec conservation effectivement constatée. Deux POST 503 sont présents dans l’historique local de cette session. Aucun envoi externe n’a été réalisé.

## Défauts corrigés et rejoués

1. React 18 signalait la prop DOM `fetchPriority` dans `Photo`. Après remplacement par l’attribut HTML approprié, nouveau chargement de l’accueil : **zéro erreur console**, aucune erreur de page.
2. Une quantité inférieure au minimum affichait un message Zod en anglais. Après ajout des messages français des bornes, la saisie `0` affiche **« Indiquez au moins une bouteille. »** et reste rejetée.

Les autres assertions HTTP, SEO, build, tests serveur et couverture sans JavaScript sont documentées par la recette principale ; ce rapport n’en revendique pas les résultats. La session navigateur de recette a été fermée à l’issue des contrôles.
