# Vérification des PDF de révision

Vérification effectuée le 10 octobre 2026 sur les documents produits par `scripts/build-revision-pdfs.py` à partir de `data/printable-revisions.json`.

## Relecture pédagogique

La première version condensait trop de notions sur chaque page, utilisait des syntaxes avant de les expliquer et donnait parfois une correction sans les étapes du raisonnement. Les sept matières ont été reprises avec de petits exemples autonomes et une progression explicite.

- Repères JavaScript en introduction : valeurs, variables, fonctions, conditions, objets, tableaux, `map`, fonctions fléchées et imports. Les fragments sont distingués des programmes complets.
- Merise : lecture d’une cardinalité depuis un objet précis, données avant/après, différence entre paires et triplets, justification des références et clés, normalisation avec dépendances explicites. Les notions UML sont distinguées des modèles Merise.
- TypeScript : annotations et opérateurs expliqués avant les exemples, distinction entre vérification des types et validation à l’exécution.
- SQL : jeux de données fournis et résultats intermédiaires pour filtrer, joindre et regrouper. Les exercices précisent l’état initial à utiliser.
- Docker : image, conteneur, ports, réseau et volume expliqués à partir des commandes. La reconstruction d’une image est suivie de la création d’un nouveau conteneur.
- Tests : attendu avant assertion, explication de `fn` et `p`, distinction entre exception immédiate et rejet asynchrone, précision sur `toStrictEqual`.
- Backend : HTTP, rôles des couches, validation, identité, permissions et transactions sont enseignés séparément.
- React : trajet d’une saisie, rendu, état, effets et nettoyage expliqués ; les résultats asynchrones sont situés sur une chronologie cohérente.
- Relecture croisée des définitions, exemples, exercices et corrigés ; les corrections expliquent les étapes et les erreurs possibles.

## Contenu

- Sept matières : Merise, TypeScript, SQL, Docker, tests JavaScript, backend/API et React.
- Cours : 34 leçons et 34 exercices avec corrigés séparés ; 114 pages avec introduction, sommaire et références.
- Cheatsheets : 9 fiches de deux pages, dont 3 Merise ; 23 pages avec références.
- Aucun exemple ne suppose de connaître les projets personnels. Les règles, jeux de données et résultats attendus sont fournis.
- MongoDB, GraphQL, temps réel et internationalisation sont absents des deux documents.
- Merise : cardinalités, associations binaires et ternaires, MCD, MLD, MPD, dépendances fonctionnelles, clés candidates, 1NF, 2NF, 3NF, BCNF et cas d’utilisation UML.

## Mise en page et structure

- Génération ReportLab en A4, avec polices incorporées et schémas vectoriels.
- Texte du cours à 11,3 points, code à 9,3 points en Courier New Bold, références courtes à 8,6 points. Aucun rétrécissement automatique des pages.
- Les blocs pédagogiques sont répartis sur plusieurs pages. Les tableaux et blocs de code restent entiers ; les pages de suite conservent le titre de la leçon.
- Rendu des 137 pages avec `pdftoppm`, puis inspection de toutes les pages en planches et de pages détaillées pour les schémas, tableaux et blocs de code.
- Aucun texte hors des marges, coupé ou empiétant sur le pied de page ; aucun retour automatique au milieu des lignes de code.
- Extraction avec `pdfplumber` et `pypdf` : accents lisibles, aucune page vide, aucun caractère de remplacement, tous les exercices et corrigés présents.
- Sommaire vérifié contre les pages réelles, pagination contrôlée dans chaque pied de page.
- Signets du cours : guide de lecture, repères JavaScript, sommaire, sept matières, leçons, corrigés et références.
- 75 liens internes vérifiés dans le cours, dont les liens exercice–corrigé et retour à la leçon.
- 80 références distinctes dans le cours et 56 dans les mémos, pour respectivement 391 et 174 liens externes. Toutes les URL utilisées par le contenu sont présentes dans les annotations du PDF et les notices bibliographiques.

## Exemples de code

Les exemples Node de test unitaire, de réponse HTTP 200 et 404, d’exception immédiate et de rejet asynchrone ont été exécutés avec succès. Les autres extraits Docker, Express, Zod, Prisma, TypeScript, SQL, Vitest et React ont été relus ; leurs environnements complets n’ont pas tous été exécutés. Les fragments indiquent leur contexte et leurs dépendances. Les blocs restent courts, jusqu’à 14 lignes et 75 caractères par ligne.

Pour reproduire le rendu visuel après modification, régénérer les PDF puis utiliser :

```sh
pdftoppm -scale-to 900 -png output/pdf/CDA-cours-progressif.pdf tmp/pdfs/course
pdftoppm -scale-to 1000 -png output/pdf/CDA-cheatsheets.pdf tmp/pdfs/cheat
```

Les captures et manifestes de pages sont des intermédiaires locaux ignorés par Git. La régénération ne modifie ni le contenu interactif du site ni la progression du navigateur.
