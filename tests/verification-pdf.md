# Vérification des PDF de révision

Vérification effectuée le 9 octobre 2026 sur les documents produits par `scripts/build-revision-pdfs.py` à partir de `data/printable-revisions.json`.

## Contenu

- Sept matières : Merise, TypeScript, SQL, Docker, tests JavaScript, backend/API et React.
- Cours : 24 leçons, 24 exercices avec corrigés séparés ; 39 pages avec sommaire et références.
- Cheatsheets : 9 fiches, dont 3 Merise ; 13 pages avec références.
- Aucun exemple ne suppose de connaître les projets personnels. Les règles, jeux de données et résultats attendus sont fournis.
- MongoDB, GraphQL, temps réel et internationalisation sont absents des deux documents.
- Merise : cardinalités, associations binaires et ternaires, MCD, MLD, MPD, dépendances fonctionnelles, clés candidates, 1NF, 2NF, 3NF, BCNF et cas d’utilisation UML.
- Relecture croisée des définitions, exercices et corrections. Précisions vérifiées sur les ports Docker, les erreurs JSON d’Express et les options de vérification des JWT.

## Mise en page et structure

- Génération ReportLab en A4, avec polices incorporées et schémas vectoriels.
- Rendu de toutes les pages avec `pdftoppm`, puis inspection visuelle des 52 pages en planches et de pages détaillées : schémas Merise/Docker, tableaux, SQL, tests HTTP, backend et React.
- Aucun texte hors des marges, coupé ou empiétant sur le pied de page ; les blocs de code ne sont pas repliés automatiquement.
- Extraction avec `pdfplumber` et `pypdf` : accents lisibles, aucune page vide, aucun caractère de remplacement, tous les exercices et corrigés présents.
- Sommaire vérifié contre les pages réelles, pagination contrôlée dans chaque pied de page.
- Signets : sept matières et références dans les deux PDF ; corrigés dans le cours.
- Liens incorporés : 71 références distinctes dans le cours et 42 dans les mémos. Toutes les URL utilisées par le contenu sont présentes dans les annotations du PDF et les notices bibliographiques.

## Exemples de code

Les exemples Node de test unitaire, de réponse HTTP 200 et de réponse HTTP 404 ont été exécutés avec succès (3/3). Les snippets Docker, Express, Zod, Prisma, TypeScript, SQL, Vitest et React ont été relus ; leurs environnements complets n’ont pas tous été exécutés. Les fragments à lire indiquent leur contexte et leurs dépendances.

Pour reproduire le rendu visuel après modification, régénérer les PDF puis utiliser :

```sh
pdftoppm -scale-to 900 -png output/pdf/CDA-cours-progressif.pdf tmp/pdfs/course
pdftoppm -scale-to 1000 -png output/pdf/CDA-cheatsheets.pdf tmp/pdfs/cheat
```

Les captures et manifestes de pages sont des intermédiaires locaux ignorés par Git. La régénération ne modifie ni le contenu interactif du site ni la progression du navigateur.
