# Vérification de CDA Studio

Vérification manuelle réalisée le 4 octobre 2026 dans le navigateur intégré, sur le serveur local `http://127.0.0.1:4173`. Les saisies et imports ont utilisé `?test`, avec un stockage distinct de la progression personnelle.

## Parcours vérifiés

- Tableau de bord initial : 118 cartes disponibles, aucune activité personnelle préremplie.
- Fiche CP 8 : contenu SQL/NoSQL, note personnelle, validation de la lecture du jour et navigation vers les cartes CP 8. Le filtre CP 8 est conservé lors de cette navigation.
- Carte CP 8 : démarrage de session, `Espace` pour révéler, `3` pour noter « Bien ». La carte passe à une échéance future et le total à réviser diminue de 118 à 117.
- Tableau de bord de test : lecture et carte travaillée comptées, série quotidienne affichée et rituel mis à jour.
- Entraînement oral : brouillon enregistré, réponse guidée et attentes visibles, autoévaluation « Réponse solide ». Le brouillon reste présent après rechargement.
- Simulation écrite : deux QCU français et deux réponses ouvertes anglaises. Deux réponses françaises correctes donnent 2/2 ; quatre grilles de correction apparaissent après validation.
- Brouillon anglais : la réponse de l’exercice w009 revient en rouvrant l’exercice individuel après rechargement.
- Soutenance complète : passage 40 → 45 → 30 minutes. Le bouton du questionnaire ouvre quatre questions et transfère le temps restant au questionnaire, sans maintenir deux minuteurs pour l’écrit.
- Import d’une sauvegarde valide : objectif de dix cartes restauré et message d’import affiché. La sauvegarde importée est un fichier de test, sans données personnelles.
- Déclenchement de l’export JSON : le message de téléchargement est affiché. Le navigateur intégré n’a pas retourné d’événement de téléchargement utilisable ; la validation du fichier exporté dans ce navigateur précis n’est pas couverte. Le format complet est couvert par un test aller-retour JSON. Le deck TSV est aussi livré comme fichier réel dans `exports/CDA-Studio-Anki.tsv`.
- Contrôle des erreurs navigateur : aucun avertissement ni erreur capturé lors des parcours vérifiés.

## Mise en page

La largeur utile de 390 pixels a été contrôlée pour le tableau de bord, les fiches, l’oral, l’écrit, la soutenance et les réglages. Aucun débordement horizontal de page observé. Le menu principal peut défiler horizontalement sur mobile.

La taille du navigateur a été rétablie après contrôle. La capture du tableau de bord personnel initial est conservée dans `apercu-desktop.jpg`. Le site est laissé ouvert sur son adresse normale, sans mode de test.

## Tests automatisés

`npm test` : 30 tests réussis. Les tests couvrent la répétition espacée, les jours locaux, les séries, la validation des imports, l’export TSV, la couverture des 11 compétences, les QCU, les supports anglais, la somme des durées et l’existence des documents locaux.

Le JavaScript du site et du serveur, ainsi que le script Zsh de lancement, passent leurs vérifications syntaxiques.


## Complément : technologies du cours

Deuxième vérification le 4 octobre 2026, après ajout du contenu issu des supports O’clock. Le navigateur personnel n’a pas été rechargé et les interactions ont uniquement utilisé le stockage `?test`.

- Ouverture des 11 sujets : Merise, TypeScript, SQL/PostgreSQL, Docker, tests JavaScript, backend/API, React, MongoDB/services, GraphQL, Socket.IO et internationalisation. Les 31 sections pratiques sont visibles.
- « Réviser TypeScript » ouvre les cartes avec le filtre TypeScript et 16 cartes disponibles. Une session affiche une question TypeScript puis sa réponse. Le filtre Tests JavaScript sélectionne les cartes dédiées à ce sujet.
- Recherche « middleware » : les sujets correspondants apparaissent, y compris lorsque le terme est dans le contenu d’une section.
- Notes TypeScript et marqueur « Relue aujourd’hui » restaurés après rechargement. Le bouton CP 3 ouvre la fiche « Développer des composants métier ».
- Vue d’ensemble et fiche TypeScript vérifiées aux largeurs utiles de 390 et 780 pixels. Aucun débordement horizontal de page après correction du minimum de largeur des colonnes. Les exemples de code défilent dans leur propre bloc. La taille du navigateur est rétablie.
- Aucun avertissement ni erreur JavaScript capturé. Capture du nouvel onglet : `apercu-technos.jpg`.
- `npm test` : 36 tests réussis, dont la couverture des technologies, les sources locales, le filtrage des cartes et la conservation des anciennes sauvegardes. L’export livré contient désormais 242 cartes.


## Complément : exemples Merise et recueil des besoins

Vérification le 4 octobre 2026 dans un nouvel onglet `?test`, sans interaction avec la progression personnelle.

- La fiche Merise commence par trois user stories complètes : visiteur, membre (utilisateur connecté), administrateur. Chaque exemple affiche les critères d’acceptation proposés. La consigne de travail décrit désormais le passage du besoin aux règles et aux cardinalités.
- Le cas Oquiz relie historique des scores, tentatives répétées, règles, données, entités, cardinalités, MLD et fragment PostgreSQL. Deux exercices affichent leur correction uniquement à l’ouverture du contrôle prévu.
- Les mêmes exemples et exercices sont accessibles dans la fiche CP 7, via le lien de la fiche Merise.
- À 390 pixels utiles, les trois exemples restent lisibles et la page ne déborde pas horizontalement. La taille normale a été rétablie.
- Aucun avertissement ni erreur JavaScript capturé. Capture du début de la fiche : `apercu-merise.jpg`.
- Les 36 tests existants passent. Les identifiants des 12 cartes Merise précédentes sont conservés ; 6 cartes supplémentaires portent le total à 18 cartes Merise et 248 cartes dans le deck. L’export Anki livré est actualisé.


## Préparation du dépôt GitHub — 5 octobre 2026

- Les 36 tests de contenu et de répétition sont autonomes et passent dans une copie contenant uniquement les fichiers versionnés, sans les cours et dossiers voisins.
- `npm run test:sources` vérifie séparément les 54 sources locales et les 4 documents personnels. Cette vérification réussit dans le workspace d’origine.
- Lancement de la copie sur le port de test 4174 : la page et les modules répondent en HTTP 200. Les documents facultatifs absents et les fichiers Git répondent en HTTP 404.
- `CDA_WORKSPACE` permet au serveur et à la vérification des sources de retrouver les documents depuis un clone situé ailleurs. Le lancement local d’origine garde son dossier parent par défaut.
- La progression reste stockée dans le navigateur ; aucune sauvegarde personnelle ni PDF d’origine n’est ajouté au dépôt. Les fixtures JSON sont fictives, les captures de vérification restent locales.
