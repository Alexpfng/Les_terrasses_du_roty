# Logo officiel — provenance des SVG web

Contrôle du 9 septembre 2026. Les fichiers Illustrator/PDF ont été rendus avec Poppler et inspectés visuellement ; les variantes SVG ont ensuite été rendues dans Chrome sur fond sombre et clair. Aucun dessin, filtre de couleur ou remplacement typographique n’a été réalisé.

## Sources fournies par le propriétaire

- `LES TERRASSES DU ROTY  etiquette imprimeur.ai` : PDF Illustrator compatible, une page de 240,945 × 212,598 points. L’étiquette montre le symbole des terrasses et le chiffre 7 en or, le nom de marque en blanc, puis « Syrah » sous le logo. Le fond imprimé est noir.
- `LES TERRASSES DU ROTY  etiquette imprimeur copie.ai` : fichier strictement identique au précédent. SHA-256 commun : `bd62d3567f751128750a961ab33b7510dfe48424cabe8bb7d78b8ebe5d12589e`.
- `CHARTE GRAPHIQUE/Les Terrasses du Roty pésentation logo.pdf` : confirme les déclinaisons officielles doré-blanc et doré-noir, ainsi que les typographies et couleurs.
- Les SVG originaux proviennent de `CHARTE GRAPHIQUE/LES TERRASSES DU ROTY format vecto/`, exportés par Adobe Illustrator 28.1.0.

Le logo de marque des SVG correspond au symbole et au nom utilisés dans l’étiquette. La mention de cépage « Syrah », séparée sous le logo dans l’AI imprimeur, ne fait pas partie de ces SVG de marque ; elle n’a pas été recréée ni ajoutée.

## Assets prêts pour le site

| Asset web                                    | Source originale exacte                | Usage conforme                              |
| -------------------------------------------- | -------------------------------------- | ------------------------------------------- |
| `public/assets/img/logo-etiquette.svg`       | `LES TERRASSES DU ROTY doré-blanc.svg` | Symbole/7 or, lettrage blanc ; fond sombre. |
| `public/assets/img/logo-etiquette-light.svg` | `LES TERRASSES DU ROTY doré-noir.svg`  | Symbole/7 or, lettrage noir ; fond clair.   |

Ces deux assets sont des copies octet pour octet des exports officiels. Ils sont transparents : aucun rectangle de fond n’a été ajouté. Leur `viewBox` commun est `0 0 211.9 259.9`. Les 19 tracés possèdent exactement les mêmes commandes et coordonnées dans les deux variantes ; seuls les couleurs et certains espaces de sérialisation SVG diffèrent. Aucun changement de géométrie, de proportions ou d’espacement n’a été introduit.

| Asset                      | SHA-256                                                            | Taille        |
| -------------------------- | ------------------------------------------------------------------ | ------------- |
| `logo-etiquette.svg`       | `02a481cc077e19d81b0295ce372caf2b6f7b118333897f8d19d394041eeda9e4` | 10 099 octets |
| `logo-etiquette-light.svg` | `d14cc1505026b820bd59aafd3feedfc9fb07259bc993f9188092fb76aa474310` | 9 874 octets  |

## Couleurs et typographies de la charte

- Or : `#D7AB0E` ; CMJN indiqué dans la présentation : C16 M30 J97 N4.
- Blanc : `#FFFFFF`.
- Noir : `#000000`.
- Nom de marque : **Milky Walky Regular**, selon la charte.
- Mention de cépage : **Brolimo Regular**, selon la charte.

Dans les SVG, les caractères sont déjà vectorisés. Leur affichage ne nécessite donc aucun chargement de police et conserve le dessin d’origine. La mention des familles ici ne signifie pas qu’une licence de diffusion web de ces polices a été fournie.

## Contrôles effectués

- Comparaison du hash des deux AI : identité exacte.
- Comparaison source/destination des deux SVG : identité exacte.
- Comparaison des 19 tracés : commandes et coordonnées identiques entre variantes.
- Inspection XML : uniquement `svg`, `g`, `style`, `path` ; aucun script, texte dynamique, image raster, lien externe ni gestionnaire d’événement.
- Vérification visuelle des deux variantes sur fond sombre et clair : emblème, nom et chiffre 7 cohérents avec la charte et l’étiquette.

Les composants, le CSS, les autres assets et les documents sources n’ont pas été modifiés dans cette extraction.

## Favicon issu du symbole exact

Le fichier existant `public/assets/img/sun-gold.png` a été inspecté : raster transparent de 784 × 592 px, dont l’or dominant est `#C9A227` (61 352 pixels entièrement opaques). Il présente le même motif visuel, mais sa couleur diffère de l’or `#D7AB0E` défini par la charte. Le PNG existant a été conservé intact.

`public/assets/img/favicon-etiquette.svg` reprend exclusivement le 19e tracé (`path` index 18) du SVG officiel doré-blanc, correspondant à l’emblème des terrasses. Le lettrage et le chiffre 7 du nom sont exclus. L’attribut `d` du tracé est identique au source : aucun redessin, épaississement, transformation ou réinterprétation. La couleur reste `#D7AB0E` et aucun fond n’est ajouté.

Les bornes du tracé mesurées par `getBBox()` dans Chrome sont environ x=8,2, y=9,9, largeur=195,6, hauteur=143,3. Le cadrage carré `viewBox="0 -24.5 212 212"` conserve une marge horizontale de 8,2 unités et centre verticalement le symbole, avec ses proportions intactes. Dimensions intrinsèques : 64 × 64 ; redimensionnement vectoriel par le navigateur.

SHA-256 du favicon extrait : `f9840d0c213c59ef1830e7a79b6a4a5038bf477a1406e3ad6b8386f774c360bb`.

Le rendu a été inspecté dans Chrome à 240, 32 et 16 px sur fonds sombre et clair ; les tracés fins d’origine sont conservés, sans épaississement artificiel.

Le branchement du favicon dans le document HTML est réalisé séparément ; cette sous-tâche n’a modifié ni `__root.tsx` ni le CSS.
