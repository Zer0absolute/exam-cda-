# CDA Studio

Un espace personnel de révision du titre professionnel **Concepteur développeur d’applications**, construit à partir du référentiel CDA 2023, du dossier GamerChallenge et du dossier professionnel présents dans ce workspace.

Dépôt : [Zer0absolute/exam-cda-](https://github.com/Zer0absolute/exam-cda-).

## Lancer le site

Sur macOS, double-cliquer sur **lancer.command**. Une fenêtre Terminal lance le serveur et le navigateur s’ouvre.

Ou, dans un terminal :

```sh
git clone https://github.com/Zer0absolute/exam-cda-.git
cd exam-cda-
npm start
```

Adresse : **http://127.0.0.1:4173**. Garder la fenêtre Terminal ouverte. Pour arrêter, utiliser `Ctrl+C`.

Node.js 20 ou plus récent est nécessaire. **Aucune installation de dépendances ni aucun compte ne sont nécessaires.** Le site ne charge pas de ressources externes. Les liens d’approfondissement vers les documentations officielles nécessitent Internet si on les ouvre.

Si le port est utilisé, vérifier si le site tourne déjà à cette adresse. Pour choisir un autre port : `CDA_PORT=4174 npm start`. La progression dépend de l’adresse du site : exporter sa sauvegarde avant de changer de port ou de navigateur.

## Ce que contient le site

- **Aujourd’hui** : rituel, activité de la semaine, répétitions dues et progression par bloc.
- **Fiches mémo** : les 11 compétences, repères, exemples, checklists et notes personnelles ; recherche, favoris et impression de l’ensemble des fiches.
- **Technos du cours** : 33 sections pratiques issues des supports O’clock : Merise, TypeScript, SQL, Docker, tests JavaScript, backend, React, MongoDB, GraphQL, temps réel et internationalisation. Exemples de code, notes personnelles et cartes dédiées pour chaque sujet. Merise commence par des user stories, des critères d’acceptation et un cas guidé du besoin au modèle ; deux exercices proposent une correction à révéler.
- **Cartes** : 248 questions de rappel actif ; répétition espacée locale avec autoévaluation, filtres par compétence et par technologie, export TSV pour Anki. Les cartes dues passent avant les nouvelles. Le mode « Tout pratiquer » inclut celles programmées dans le futur et modifie leur planning.
- **Questions du jury** : 48 questions techniques, sur GamerChallenge et sur le dossier professionnel ; réponse guidée, attentes, relance et brouillon personnel.
- **Écrit** : 8 QCU français, 8 questions ouvertes anglais B1, 2 rédactions françaises supplémentaires ; simulation de 2 QCU FR + 2 ouvertes EN en 30 minutes.
- **Soutenance blanche** : présentation 40 min, entretien technique 45 min, questionnaire 30 min et entretien final 20 min ; déroulé pédagogique de 40 minutes et repères des dossiers.
- **Réglages** : date de soutenance, objectifs quotidiens, export et import de progression.
- **Référentiel & dossiers** : accès aux documents locaux et aux sources techniques officielles.

Les questions sont des exercices de révision créés pour ce site, pas des sujets officiels. Les réponses orales sont des trames : les reformuler selon son travail réel et les preuves disponibles. L’anglais se corrige avec une grille et un exemple ; le site ne donne pas de note automatique aux réponses ouvertes.

## Routine conseillée

1. Faire la session de cartes du jour (15 par défaut).
2. Répondre à deux questions du jury **à voix haute**, avant de révéler les réponses.
3. Relire une fiche, ajouter un exemple personnel et valider la lecture du jour.
4. Ajouter régulièrement un exercice anglais ou une simulation écrite.
5. Répéter la présentation chronométrée et une soutenance complète avant le jour J.

Dans les cartes : `Espace` révèle la réponse, `1` = à revoir, `2` = difficile, `3` = bien, `4` = facile. Une carte oubliée est rappelée une fois dans la session, puis garde une échéance de dix minutes si elle reste difficile. Le planning est un algorithme simple propre au site, indépendant de celui d’Anki.

« En mémoire » compte les cartes évaluées avec succès et un intervalle de trois jours ou plus. Cet indicateur décrit les autoévaluations, pas un niveau certifié. La validation de lecture du jour fonctionne aussi sur une fiche déjà parcourue.

## Conserver sa progression

Les notes, réponses, évaluations et activités sont stockées dans `localStorage`, dans le navigateur et pour l’adresse utilisée. Le serveur n’écrit pas ces données sur disque. Exporter régulièrement un fichier JSON depuis **Réglages & sauvegarde**. Avant un import, le site télécharge une copie de la progression actuelle, puis valide et remplace l’état.

Les minuteurs et la session en cours restent actifs tant que la page est ouverte ; un rechargement les ferme. Les brouillons restent conservés : rouvrir le même exercice individuel pour retrouver sa réponse. Une nouvelle simulation démarre avec des réponses vides.

Si une sauvegarde locale devient illisible, le site conserve une copie brute accessible depuis Réglages. Ne pas effacer les données du navigateur avant de l’avoir téléchargée.

## Anki

Cliquer sur « Exporter pour Anki », puis importer le fichier `.tsv` dans Anki avec un type de note Recto/Verso. Utiliser la **tabulation** comme séparateur et associer les champs **Recto**, **Verso**, **Tags**. Le fichier contient les directives d’import pour le séparateur et l’HTML. Si la version d’Anki le demande, activer **Autoriser le HTML**. Depuis Cartes, l’export respecte les filtres de compétence et de technologie. Depuis Réglages, il exporte les 248 cartes. Les tags permettent de filtrer les compétences (`CDA::CP1`, etc.) et les sujets du cours. L’export n’inclut pas le planning de révision du site.

## Documents et maintenance

Les documents personnels et les supports de cours sont facultatifs et restent hors du dépôt. Toutes les fiches, cartes et fonctions de révision sont disponibles après un clone. Les quatre liens vers les documents nécessitent les fichiers d’origine, selon les chemins déclarés dans `lib/documents.js`.

Par défaut, le serveur cherche ces fichiers dans le dossier parent du site. L’installation locale `revisions-cda` conserve ainsi ses liens actuels. Pour un clone situé ailleurs, indiquer le dossier contenant `dossier projet`, `dossier-professionnel-cda` et les supports de formation :

```sh
CDA_WORKSPACE="/chemin/vers/oclock" npm start
```

Sans ces fichiers, les liens vers les documents affichent « Document introuvable ». Les sources affichées dans le site indiquent les supports utilisés pour créer le contenu, sans les redistribuer. Les notes et la progression personnelles restent dans le navigateur ; les JSON de `tests` sont des données de test fictives. Les captures de vérification restent locales.

Les contenus pédagogiques se trouvent dans `data/knowledge.js`, `data/exam.js` et les modules `data/course-*.js` assemblés par `data/courses.js`. Ce dernier conserve aussi les chemins des supports de cours utilisés. Ils peuvent être mis à jour sans effacer la progression, à condition de conserver les identifiants des cartes et questions existantes. Le référentiel fourni inclut REAC et RE : le RE précise deux questions fermées à choix unique en français et deux questions ouvertes à réponses courtes en anglais.

## Vérification

```sh
npm test
```

Les 36 tests sont autonomes : planning de répétition, jours locaux et séries d’activité, import validé, export Anki, cohérence du contenu et chemins des sources. Ils fonctionnent sans les dossiers personnels.

Pour vérifier aussi la présence et le format des sources et documents d’origine :

```sh
npm run test:sources
# Ou depuis un clone situé ailleurs :
CDA_WORKSPACE="/chemin/vers/oclock" npm run test:sources
```

Vérifications navigateur documentées dans `tests/verification-navigateur.md`. La query `?test` utilise un stockage distinct pour vérifier les interactions sans modifier la progression personnelle.
