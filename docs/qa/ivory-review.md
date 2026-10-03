# Recette visuelle — version ivoire

Vérification indépendante du build local sur `http://127.0.0.1:4173`, le 9 septembre 2026 à 10:44 UTC, dans la session isolée `roty-ivory-independent` (fermée après recette). Aucun défaut bloquant observé dans le périmètre ci-dessous.

## Périmètre et rendu

Dix combinaisons page/largeur contrôlées : accueil et demande à 390, 768 et 1440 px ; journal et domaine à 768 px ; liste des vins à 1440 px ; cuvée 2024 à 390 px. Dans ces dix cas, la largeur du document correspond à celle de la fenêtre, aucune image n’est cassée et aucun recouvrement détecté ne gêne la lecture. Console et erreurs de page : aucune erreur relevée.

L’ivoire, les marges et la photographie panoramique donnent davantage d’espace à l’accueil. Le logo central reste lisible et les textes sombres se détachent nettement du fond clair. L’or du texte a été assombri dans le build final (`#745619`) ; les captures ont été renouvelées après cette correction. Cette appréciation visuelle ne remplace pas l’audit automatisé des contrastes.

Les deux logos affichés sont identiques octet pour octet aux SVG officiels fournis dans la charte : variante doré-noir dans l’en-tête et doré-blanc en pied de page. Aucun filtre ni transformation CSS ne modifie le logo d’en-tête.

## Clavier et formulaire

Les deux problèmes d’ordre DOM signalés pendant la recette sont corrigés et confirmés sur le build final. Sur mobile, l’ordre de tabulation est : lien d’évitement, « Nous écrire », logo, menu, fil d’Ariane, profil puis nom et e-mail. Les coordonnées de l’encart ne passent plus avant les champs.

Le premier champ de saisie du nom commence à **599 px** du haut sur mobile 390 px, à 527 px sur tablette et à 541 px sur ordinateur. Il est visible dans le premier écran mobile testé. Espace ouvre puis ferme le menu ; `aria-expanded` et la visibilité sont cohérents. Tab atteint « Le domaine », Entrée navigue et referme le menu.

## Captures finales

- [Accueil — 1440 px](ivory-home-1440.png)
- [Demande — 390 px](ivory-demande-390.png)
- [Journal — 768 px](ivory-journal-768.png)

Aucun e-mail soumis durant cette recette. Résultats limités au build local ; aucune publication en production ni réception d’e-mail n’est attestée par ce contrôle.
