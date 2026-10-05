/**
 * Révision des fondations vues dans les cours Oquiz.
 * Les exemples sont des exercices : ils ne revendiquent pas une réalisation personnelle.
 * Le SQL suit le MPD initial (tables singulières), distinct du mapping Prisma actuel.
 */
export const courseSections = [
  {
    cp: "cp7", technology: "merise",
    section: {
      title: "Merise · Partir du besoin : acteurs et user stories",
      body: "Le point de départ, c'est ce que les personnes veulent faire et pourquoi. Le recueil Oquiz s'appuie sur les besoins du client, les user stories, les maquettes et les échanges. Voici des reformulations de besoins présents dans les supports ; les critères d'acceptation sont proposés pour t'entraîner.",
      bullets: [
        "Formule à retenir : « En tant que [acteur], je souhaite [action ou besoin], afin de [objectif ou bénéfice]. » L'acteur utilise le produit ; l'action exprime ce qu'il attend ; l'objectif explique l'utilité.",
        "Le support Oquiz distingue Visiteur, Membre, Auteur et Administrateur. Un membre est un utilisateur connecté ; l'auteur dispose de droits pour créer les quiz. Identifier les acteurs aide à poser les bonnes questions sur les permissions.",
        "Un critère d'acceptation décrit un résultat observable : avec huit quiz disponibles, l'accueil en présente six, les plus récents. « L'accueil fonctionne bien » est trop vague pour vérifier le besoin.",
        "Besoin utilisateur : « consulter mes anciens scores ». Règle de gestion : « chaque nouvelle partie crée une tentative distincte ». Modèle Merise : Utilisateur et Quiz sont liés à Tentative, qui porte le score et la date. Ces trois formulations se complètent.",
        "Avant de dessiner : demander qui peut agir, quelles données sont utiles, ce qui se passe en cas d'absence ou d'erreur et quelles répétitions sont autorisées. Une user story ouvre la discussion ; elle ne fixe pas toute la base de données."
      ],
      examples: [
        {
          role: "visiteur",
          need: "consulter les six derniers quiz sur la page d'accueil",
          goal: "découvrir le contenu de la plateforme avant de m'inscrire",
          story: "En tant que visiteur, je souhaite consulter les six derniers quiz sur la page d'accueil, afin de découvrir le contenu de la plateforme avant de m'inscrire.",
          criteria: [
            "Avec huit quiz disponibles, l'accueil affiche les six plus récents, dans un ordre défini.",
            "Avec trois quiz disponibles, les trois sont affichés ; avec aucun quiz, un message explique l'absence de contenu.",
            "La consultation de cet accueil est possible sans connexion."
          ]
        },
        {
          role: "membre (utilisateur connecté)",
          need: "consulter mes scores aux quiz auxquels j'ai déjà participé",
          goal: "suivre ma progression",
          story: "En tant que membre (utilisateur connecté), je souhaite consulter mes scores aux quiz auxquels j'ai déjà participé, afin de suivre ma progression.",
          criteria: [
            "Une partie terminée avec huit points sur dix apparaît dans mon historique avec le quiz, la date et le score 8/10.",
            "Deux parties du même quiz restent visibles comme deux tentatives distinctes.",
            "Pour cet exercice, l'historique personnel est privé : un autre membre ne peut pas le consulter en changeant l'identifiant demandé."
          ]
        },
        {
          role: "administrateur",
          need: "modifier le rôle d'un utilisateur",
          goal: "lui attribuer les permissions adaptées à ses responsabilités",
          story: "En tant qu'administrateur, je souhaite modifier le rôle d'un utilisateur, afin de lui attribuer les permissions adaptées à ses responsabilités.",
          criteria: [
            "Un administrateur peut passer un compte de membre à auteur ; le nouveau rôle est conservé et visible après rechargement.",
            "La même demande provenant d'un simple membre est refusée et ne modifie pas le compte.",
            "Un rôle extérieur à la liste autorisée est rejeté."
          ]
        }
      ],
      exercise: {
        prompt: "Transforme « je veux créer des quiz » en une user story Oquiz complète. Quel acteur choisis-tu ? Propose ensuite un critère d'acceptation vérifiable.",
        answer: "En tant qu'auteur, je souhaite créer un quiz, afin de proposer un entraînement aux membres. Critère proposé : connecté comme auteur, je saisis un titre valide et j'enregistre ; un nouveau quiz apparaît dans ma liste et conserve mon compte comme auteur. Le besoin est dans les supports ; le bénéfice et ce critère sont des formulations pédagogiques."
      }
    }
  },
  {
    cp: "cp7", technology: "merise",
    section: {
      title: "Merise · Cas Oquiz : du besoin au stockage des résultats",
      body: "Déroulons le besoin « consulter mes scores aux quiz déjà joués ». Le MLD du cours permet plusieurs participations d'un même utilisateur au même quiz. On s'appuie sur ce cas pour construire un petit modèle cohérent ; les contrôles de score du fragment SQL sont une proposition d'exercice.",
      bullets: [
        "1. Préciser les règles : une tentative concerne exactement un utilisateur et un quiz ; un utilisateur peut retenter un quiz ; une nouvelle tentative conserve un résultat distinct. Pour l'exercice, le score est entier et compris entre zéro et le score maximal.",
        "2. Recueillir les données nécessaires : utilisateur concerné, quiz concerné, date de la tentative, points obtenus et points disponibles. Conserver le maximum de cette tentative permet de comprendre un ancien résultat si le contenu du quiz change ensuite.",
        "3. Repérer les entités : Utilisateur, Quiz et Tentative. La Tentative représente une partie identifiable avec son propre résultat. Membre, Auteur et Administrateur désignent ici des rôles du compte, pas automatiquement trois nouvelles entités ; un visiteur n'exige pas une ligne utilisateur pour consulter l'accueil.",
        "4. Poser les cardinalités : Utilisateur (0,n) — réaliser — Tentative (1,1), et Quiz (0,n) — concerner — Tentative (1,1). Zéro est possible pour un utilisateur qui n'a jamais joué et pour un quiz qui n'a pas encore été joué.",
        "5. Passer au MLD : Tentative possède un identifiant propre, les références vers Utilisateur et Quiz, la date, le score et le maximum. Le couple utilisateur/quiz ne doit pas être unique puisque les nouvelles parties sont autorisées.",
        "6. Passer au MPD PostgreSQL : choisir les types, deux FK NOT NULL et les contraintes de score. La base garantit les liens et les bornes prévues ; le traitement serveur vérifie aussi les permissions et calcule le résultat de la partie."
      ],
      code: "Besoin : retrouver mes résultats précédents\nRègle  : chaque partie conserve un résultat distinct\nMLD    : TENTATIVE(id, #user_id, #quiz_id, date, score, maximum)\n\n-- Fragment pédagogique ; suppose user et quiz déjà créées.\n-- Noms du MPD initial Oquiz ; contrôles de score ajoutés ici.\nCREATE TABLE \"attempt\" (\n  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n  user_id INTEGER NOT NULL REFERENCES \"user\"(id),\n  quiz_id INTEGER NOT NULL REFERENCES \"quiz\"(id),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  user_score INTEGER NOT NULL,\n  max_possible_score INTEGER NOT NULL,\n  CHECK (max_possible_score >= 0),\n  CHECK (user_score >= 0 AND user_score <= max_possible_score)\n);\n-- Aucun UNIQUE(user_id, quiz_id) : on garde les parties répétées.",
      exercise: {
        prompt: "Un compte a déjà une tentative à 8/10 sur le quiz 7. Il rejoue et obtient 6/10. Quelles lignes dois-tu obtenir pour respecter son historique ? Que réponds-tu si l'on propose une clé primaire (user_id, quiz_id) ?",
        answer: "Deux lignes Tentative avec des identifiants distincts : même user_id et même quiz_id, mais résultat et date propres à chaque partie. On conserve 8/10 puis 6/10. Une clé primaire limitée au couple user_id/quiz_id empêcherait la seconde ligne ; ce couple ne convient donc pas à la règle de répétition du cours."
      }
    }
  },
  {
    cp: "cp7", technology: "merise",
    section: {
      title: "Merise · Recueil et dictionnaire de données",
      body: "Avant le schéma, écris les règles du métier et donne un sens précis à chaque donnée. Le cours Oquiz distingue recueil, dictionnaire, MCD, MLD et MPD.",
      bullets: [
        "Recueil : un utilisateur peut créer plusieurs quiz ; chaque quiz possède un seul auteur ; un joueur peut retenter le même quiz.",
        "Dictionnaire : nom, définition, domaine ou type, caractère obligatoire, contraintes et exemple. Distinguer identifiant technique et valeur unique métier, comme l'email.",
        "Séparer donnée saisie et donnée calculée : un pourcentage peut être calculé à partir du score et du score maximal. Stocker les deux versions exige de maintenir leur cohérence.",
        "Exercice : documente email, quiz.title et attempt.user_score. Correction attendue : email texte requis et unique ; titre texte requis ; score entier avec une règle de validité métier explicite.",
        "Ne confonds pas règle voulue et contrainte présente : dans le MPD initial, les scores sont NOT NULL mais aucune contrainte CHECK ne borne leur valeur. Propose la règle, puis son implantation."
      ],
      code: "Donnée            Sens                         Domaine / règle\nemail             Adresse du compte            Texte, requis, unique\nquiz.title        Nom affiché du quiz          Texte, requis\nuser_score        Points obtenus à une partie  Entier, 0 ≤ score ≤ maximum\nmax_possible_score Points disponibles           Entier, maximum ≥ 0\n\nQuestion orale : pourquoi la dernière règle doit-elle être\ncontrôlée même si le formulaire empêche un score négatif ?"
    }
  },
  {
    cp: "cp7", technology: "merise",
    section: {
      title: "Merise · Lire les cardinalités et les associations",
      body: "Une cardinalité se lit pour une occurrence de l'entité à laquelle elle est attachée. Le minimum dit si le lien est obligatoire ; le maximum dit combien de liens sont possibles.",
      bullets: [
        "Utilisateur (0,n) — écrire — Quiz (1,1) : un utilisateur écrit zéro ou plusieurs quiz ; un quiz est écrit par exactement un utilisateur. Dire ces deux phrases avant de choisir une clé étrangère.",
        "0,1 : lien facultatif et au plus un. 1,1 : exactement un. 0,n : aucun ou plusieurs. 1,n : au moins un, potentiellement plusieurs.",
        "Quiz et Tag liés chacun à plusieurs occurrences : une table de liaison porte les deux références. Son couple de clés peut interdire le même lien en double.",
        "Une association peut posséder des attributs : score et date décrivent une tentative, pas le joueur seul ni le quiz seul. Si les tentatives répétées sont autorisées, le couple joueur/quiz ne suffit pas comme identifiant.",
        "Exercice : « tout quiz publié contient au moins une question ». La cardinalité côté Quiz vaut 1,n pour cette règle, mais une FK question.quiz_id ne suffit pas à empêcher un quiz sans question. Prévoir une vérification de publication."
      ],
      code: "Utilisateur (0,n) — écrire — Quiz (1,1)\nQuiz (0,n) — étiqueter — Tag (0,n)\nUtilisateur (0,n) — réaliser — Tentative (1,1)\nQuiz (0,n) — concerner — Tentative (1,1)\n\nÀ expliquer : la FK author_id est dans quiz, car chaque quiz\nréférence un seul auteur. Chaque auteur peut être référencé\npar plusieurs quiz."
    }
  },
  {
    cp: "cp7", technology: "merise",
    section: {
      title: "Merise · MCD → MLD → MPD et normalisation",
      body: "Traduis les règles conceptuelles en relations, puis en types et contraintes propres à PostgreSQL. Chaque passage doit garder le sens métier.",
      bullets: [
        "MCD : entités, attributs, associations et cardinalités sans imposer un SGBD. MLD relationnel : relations, clés primaires, clés étrangères et tables de liaison. MPD : CREATE TABLE, types, contraintes et index du SGBD choisi.",
        "Association 1,n : placer la référence dans la relation où chaque occurrence est liée à au plus un parent ; une cardinalité 1,1 sur ce lien conduit généralement à une FK NOT NULL.",
        "Association 1,1 entre deux tables séparées : une FK UNIQUE peut garantir qu'un parent n'est pas partagé ; NOT NULL rend le lien obligatoire sur la table porteuse. Le choix dépend aussi du cycle de vie des données.",
        "1NF : des valeurs atomiques pour le domaine retenu, sans liste de tags dans un champ. 2NF : avec une clé composée, les attributs non-clés dépendent de toute la clé. 3NF : éviter les dépendances transitives entre attributs non-clés.",
        "Exercice : Quiz(id, title, author_id, author_email). Si author_id détermine author_email, déplacer l'email dans Utilisateur et garder la référence. Sinon, changer l'email impose de modifier tous les quiz et peut laisser des valeurs incohérentes."
      ],
      code: "UTILISATEUR(id, email UNIQUE, nom)\nQUIZ(id, titre, #author_id → UTILISATEUR.id)\nTAG(id, nom)\nQUIZ_TAG(#quiz_id, #tag_id)\n  clé primaire : (quiz_id, tag_id)\nTENTATIVE(id, #user_id, #quiz_id, score, score_max)\n  id propre : le même joueur peut retenter le même quiz\n\nÀ faire sur papier : ajouter Question et Choix, puis expliquer\npourquoi question.quiz_id et choice.question_id sont obligatoires."
    }
  },
  {
    cp: "cp8", technology: "sql",
    section: {
      title: "SQL · Jointures et lecture des résultats",
      body: "Exemples basés sur le MPD initial Oquiz : \"user\", \"quiz\", \"question\", \"attempt\". Le schéma Prisma actuel mappe vers users, quizzes, questions et attempts : adapte les noms au schéma réellement lancé.",
      bullets: [
        "SELECT choisit les colonnes ; FROM choisit les sources ; JOIN ... ON exprime le lien ; WHERE filtre les lignes ; ORDER BY trie. Les alias q, u et qu rendent les colonnes lisibles.",
        "Un quiz avec trois questions produit trois lignes après jointure avec question. Une jointure n'est pas automatiquement une ligne par quiz ; identifier ce que représente chaque ligne du résultat.",
        "LEFT JOIN conserve les quiz sans question. Pour filtrer les questions tout en gardant ces quiz, placer le filtre dans ON ; un WHERE qu.description = ... supprimerait les lignes sans correspondance.",
        "Le SQL décrit les données souhaitées ; Prisma est un ORM qui construit des accès depuis TypeScript. Son include ne dispense pas de comprendre les relations, le nombre de lignes et les requêtes produites.",
        "Exercice : avec deux quiz, dont un sans question et l'autre avec trois questions, prédis le nombre de lignes. Correction : quatre en LEFT JOIN, trois en INNER JOIN."
      ],
      code: "SELECT q.id, q.title, u.firstname AS auteur,\n       qu.description AS question\nFROM \"quiz\" AS q\nJOIN \"user\" AS u ON u.id = q.author_id\nLEFT JOIN \"question\" AS qu ON qu.quiz_id = q.id\nORDER BY q.id, qu.id;\n\n-- Recherche liée uniquement aux questions correspondantes :\n-- LEFT JOIN \"question\" AS qu\n--   ON qu.quiz_id = q.id AND qu.description ILIKE '%HTTP%'"
    }
  },
  {
    cp: "cp8", technology: "sql",
    section: {
      title: "SQL · GROUP BY, agrégats et NULL",
      body: "Une agrégation change l'échelle du résultat : on passe des lignes aux groupes. NULL signifie une valeur absente ou inconnue, avec des règles différentes de zéro et de la chaîne vide.",
      bullets: [
        "COUNT(*) compte les lignes ; COUNT(qu.id) compte les identifiants non nuls. Après un LEFT JOIN, COUNT(qu.id) donne zéro pour un quiz sans question, alors que COUNT(*) compte sa ligne conservée.",
        "GROUP BY regroupe ; HAVING filtre le résultat agrégé. Exemple : HAVING COUNT(qu.id) >= 3 conserve les quiz ayant au moins trois questions. WHERE ne peut pas filtrer ce compteur de groupe.",
        "Utiliser IS NULL ou IS NOT NULL ; = NULL ne donne pas vrai. COALESCE remplace une absence par une valeur explicite ; COALESCE(score, 0) ne change pas un score déjà égal à zéro.",
        "AVG ignore les valeurs NULL. AVG(score) et AVG(COALESCE(score, 0)) expriment donc deux règles différentes : ignorer les absences ou les considérer comme des zéros.",
        "Piège : joindre questions et tags en même temps peut multiplier les lignes. Trois questions et deux tags donnent six lignes. COUNT(DISTINCT qu.id) peut rétablir le compteur de questions, ou on agrège chaque relation séparément."
      ],
      code: "SELECT q.id, q.title, COUNT(qu.id) AS nombre_questions\nFROM \"quiz\" AS q\nLEFT JOIN \"question\" AS qu ON qu.quiz_id = q.id\nGROUP BY q.id, q.title\nORDER BY nombre_questions DESC, q.id;\n\n-- Ajouter avant ORDER BY pour filtrer les groupes :\n-- HAVING COUNT(qu.id) >= 3\n\nSELECT id, COALESCE(description, 'Sans description')\nFROM \"quiz\"\nWHERE description IS NULL;"
    }
  },
  {
    cp: "cp8", technology: "sql",
    section: {
      title: "SQL · Sous-requêtes, écritures et transactions",
      body: "Choisis une sous-requête pour exprimer une condition liée aux données et une transaction pour rendre indivisibles plusieurs écritures qui appartiennent à la même opération métier.",
      bullets: [
        "EXISTS répond à « existe-t-il au moins une ligne correspondante ? ». NOT EXISTS permet par exemple de chercher les quiz sans tentative, sans multiplier les lignes de quiz.",
        "Attention à NOT IN si la sous-requête peut contenir NULL : la comparaison peut devenir inconnue. NOT EXISTS avec une condition de lien est souvent plus explicite pour une absence.",
        "INSERT ajoute, UPDATE modifie, DELETE supprime. Avant une écriture filtrée, vérifier les lignes ciblées et le nombre attendu ; UPDATE sans WHERE peut modifier toute la table.",
        "BEGIN ouvre la transaction ; COMMIT valide ; ROLLBACK annule les écritures non validées. Utiliser la même connexion, ou l'API de transaction de l'ORM, pour toutes les opérations du groupe.",
        "Exercice : le deuxième UPDATE échoue. Correction : annuler la transaction ; le premier ne doit pas rester seul validé. Dans une transaction pilotée par l'application, traiter l'erreur et libérer la connexion.",
        "Avec un client PostgreSQL, les valeurs variables passent dans les paramètres ($1, $2...). RETURNING récupère la ligne écrite. Une limite de résultats demande un ORDER BY stable, par exemple created_at puis id."
      ],
      code: "-- Quiz sans aucune tentative :\nSELECT q.id, q.title\nFROM \"quiz\" AS q\nWHERE NOT EXISTS (\n  SELECT 1 FROM \"attempt\" AS a WHERE a.quiz_id = q.id\n);\n\n-- Exercice de lecture ; suppose que les lignes 7 et 42 existent :\nBEGIN;\nUPDATE \"quiz\" SET title = 'Quiz HTTP' WHERE id = 7;\nUPDATE \"question\" SET description = 'Que fait GET ?'\nWHERE id = 42 AND quiz_id = 7;\nCOMMIT;\n-- Si une erreur survient avant validation : ROLLBACK.\n-- Si zéro ligne modifiée est un échec métier, le programme\n-- doit le détecter : SQL ne le transforme pas seul en erreur."
    }
  },
  {
    cp: "cp1", technology: "typescript",
    section: {
      title: "TypeScript · tsconfig, tsc et tsx",
      body: "L'API Oquiz utilise build: tsc, start: node dist/index.js et dev: tsx watch index.ts. Ces étapes ont des rôles distincts : vérifier les types, produire du JavaScript et exécuter le programme.",
      bullets: [
        "Installer le compilateur depuis le paquet typescript : npm install --save-dev typescript. L'exécutable fourni s'appelle tsc ; ce n'est pas le nom du paquet à installer.",
        "tsc lit tsconfig.json, vérifie les types et peut générer le JavaScript. tsc --noEmit vérifie sans produire les fichiers. tsx exécute rapidement le TypeScript, mais ne fait pas cette vérification complète.",
        "strict renforce les contrôles de types ; rootDir et outDir décrivent les dossiers source et sortie ; target définit la syntaxe JavaScript cible ; module et moduleResolution doivent correspondre au runtime et au format de modules.",
        "Le tsconfig local emploie NodeNext, strict et verbatimModuleSyntax. Les types seuls se chargent avec import type ; ils disparaissent du code exécuté.",
        "Le typage aide avant l'exécution. Une application qui démarre avec tsx peut encore comporter une erreur signalée par tsc ; conserver le contrôle de types dans les vérifications du projet.",
        "Exercice : explique pourquoi une fonction déclarée number peut recevoir un JSON invalide à l'exécution. Les annotations sont effacées ; la frontière réseau demande une validation réelle."
      ],
      code: "# Dans l'API Oquiz, après installation des dépendances\nnpx tsc --noEmit  # contrôle des types\nnpm run dev      # tsx watch index.ts\nnpm run build    # tsc vers dist/\nnpm start        # exécution du JavaScript compilé\n\n# Réglages à savoir expliquer dans tsconfig.json :\n# strict, target, module, moduleResolution, rootDir, outDir"
    }
  },
  {
    cp: "cp3", technology: "typescript",
    section: {
      title: "TypeScript · Annotations, inférence et narrowing",
      body: "Type les contrats des fonctions, puis laisse l'inférence décrire les variables simples. Pour une valeur inconnue, vérifie sa forme avant de l'utiliser.",
      bullets: [
        "function somme(a: number, b: number): number décrit entrées et retour. let score = 0 est inféré number ; inutile de réécrire tous les types évidents.",
        "any autorise des opérations sans contrôle de type utile sur cette valeur. unknown accepte une valeur inconnue mais oblige à la restreindre avant une utilisation spécifique.",
        "Le narrowing affine le type dans une branche : typeof, instanceof, vérification de propriété ou discriminant. Attention : typeof null vaut object ; tester null séparément.",
        "number[] est un tableau de nombres ; [number, string] est un tuple décrivant deux positions. Un paramètre b?: number peut être absent ; le traiter avant le calcul.",
        "Une assertion as MonType demande au compilateur de te croire. Une garde contrôle une condition à l'exécution. Une garde de structure ne remplace pas les règles métier, comme un score maximal.",
        "Exercice : remplace any par unknown dans une fonction qui reçoit un score. Refuse chaîne, NaN, valeur négative et nombre non entier ; explique chaque branche de refus."
      ],
      code: "function lireScore(value: unknown): number {\n  if (typeof value !== 'number' || !Number.isInteger(value)) {\n    throw new Error('Un score entier est requis');\n  }\n  if (value < 0) throw new Error('Le score doit être positif ou nul');\n  return value; // value est ici un number\n}\n\nfunction libellerDate(value: string | Date): string {\n  return value instanceof Date ? value.toISOString() : value;\n}"
    }
  },
  {
    cp: "cp3", technology: "typescript",
    section: {
      title: "TypeScript · interface, type et unions",
      body: "Un type décrit les valeurs autorisées et les opérations possibles. Un bon contrat rend les états du métier lisibles et évite les combinaisons incohérentes.",
      bullets: [
        "interface et type peuvent décrire un objet. interface s'étend avec extends ; type permet aussi les unions, tuples et alias primitifs. Choisir selon le contrat, sans imposer une classe.",
        "Une propriété description?: string peut être absente et se lit comme string | undefined. description: string | null est une propriété requise dont la valeur peut être null.",
        "Une union de littéraux, comme 'member' | 'author' | 'admin', décrit une liste de valeurs attendues pendant le développement ; les entrées externes doivent toujours être contrôlées.",
        "Une union discriminée associe les données aux états : un succès contient data ; un échec contient error. Tester le discriminant donne accès au bon champ.",
        "readonly empêche certaines écritures à travers ce type ; il ne gèle pas automatiquement l'objet JavaScript à l'exécution.",
        "Exercice : ajoute l'état loading sans data ni error au type ci-dessous. Écris un switch qui traite tous les états et donne un exemple de valeur que le compilateur doit refuser."
      ],
      code: "interface Quiz {\n  readonly id: number;\n  title: string;\n  description?: string;\n}\n\ntype Resultat =\n  | { status: 'success'; data: Quiz[] }\n  | { status: 'error'; error: string };\n\nfunction afficher(resultat: Resultat): string {\n  if (resultat.status === 'error') return resultat.error;\n  return resultat.data.map(quiz => quiz.title).join(', ');\n}"
    }
  },
  {
    cp: "cp3", technology: "typescript",
    section: {
      title: "TypeScript · Génériques, types utilitaires et async",
      body: "Les génériques conservent une relation entre les types sans tout remplacer par any. Ils deviennent utiles pour des résultats, listes et contrats réutilisables.",
      bullets: [
        "Dans premier<T>(items: T[]): T | undefined, T représente le type d'un élément. Une liste de Quiz produit un Quiz ou undefined, et une liste de nombres un nombre ou undefined.",
        "Une contrainte T extends { id: number } impose une capacité connue tout en conservant les autres champs du type fourni.",
        "Pick<Quiz, 'title'> sélectionne un champ ; Omit<Quiz, 'id'> l'exclut ; Partial<Quiz> rend les propriétés facultatives. Ces transformations décrivent des types ; elles ne retirent aucun champ d'un objet reçu à l'exécution.",
        "Pour une modification, préférer les champs autorisés : Partial<Pick<Quiz, 'title' | 'description'>>. Contrôler également leur présence et leurs valeurs côté serveur.",
        "Une fonction async retourne une Promise. Promise<Quiz[]> décrit le succès ; une erreur peut rejeter la promesse. await permet de traiter ce rejet avec try/catch.",
        "Sous strict, une erreur attrapée peut être unknown. Vérifier error instanceof Error avant de lire message. Exercice : appelle la fonction sans await, puis explique le type obtenu et pourquoi il n'est pas directement Quiz[]."
      ],
      code: "interface Quiz { id: number; title: string; description?: string }\n\nfunction premier<T>(items: T[]): T | undefined {\n  return items[0];\n}\ntype ModificationQuiz = Partial<Pick<Quiz, 'title' | 'description'>>;\n\nasync function chargerQuiz(\n  repository: { lister(): Promise<Quiz[]> }\n): Promise<Quiz[]> {\n  try {\n    return await repository.lister();\n  } catch (error: unknown) {\n    const message = error instanceof Error ? error.message : 'Erreur inconnue';\n    throw new Error(message);\n  }\n}"
    }
  }
];

const meriseCards = [
  ["Qu'écris-tu pour une donnée dans le dictionnaire ?", "Son sens, son domaine ou type, ses contraintes et un exemple.", "Pour email : adresse du compte, texte, requis, unique. La longueur retenue et la validation doivent être justifiées, pas inventées."],
  ["Comment lis-tu la cardinalité 0,1 ?", "Une occurrence peut ne participer à aucun lien, ou à un seul.", "Le zéro indique le caractère facultatif ; le un indique le maximum, pas une obligation."],
  ["Une FK question.quiz_id suffit-elle à imposer un quiz avec au moins une question ?", "Non. Elle contrôle le lien de chaque question, pas l'existence d'une question pour chaque quiz.", "Une règle de publication peut vérifier la présence des questions. Expliquer la contrainte métier en plus de la cardinalité dessinée."],
  ["Utilisateur (0,n) — écrire — Quiz (1,1) : où place-t-on la FK ?", "Dans Quiz : author_id référence Utilisateur.", "Chaque quiz possède un auteur ; plusieurs quiz peuvent référencer le même utilisateur. Lire les deux sens évite de placer la clé du mauvais côté."],
  ["Quel choix SQL traduit un auteur obligatoire pour chaque quiz ?", "Une clé étrangère author_id avec NOT NULL.", "La FK vérifie l'auteur référencé ; NOT NULL interdit l'absence de référence. Elle n'impose pas que tous les utilisateurs soient auteurs."],
  ["Deux tables sont liées au plus une fois de chaque côté : que peut-on ajouter à la FK ?", "Une contrainte UNIQUE sur la FK.", "Elle interdit que deux lignes porteuses référencent le même parent. NOT NULL décide séparément si le lien est obligatoire sur cette table."],
  ["Pourquoi le score d'une partie n'appartient-il pas simplement à Utilisateur ?", "Il décrit une tentative de cet utilisateur sur un quiz à un moment donné.", "Le mettre dans Tentative conserve plusieurs parties et permet d'associer score, score maximal et date au même fait."],
  ["Pourquoi le couple user_id / quiz_id n'est-il pas la clé de toutes les tentatives Oquiz ?", "Parce qu'un utilisateur peut retenter le même quiz.", "Un identifiant de tentative distingue les occurrences. Le couple quiz_id / tag_id suffit en revanche quand un lien d'étiquette ne doit exister qu'une fois."],
  ["Quel problème crée le stockage du score et de son pourcentage calculable ?", "Il faut maintenir les deux valeurs cohérentes à chaque modification.", "Si aucune exigence ne demande un instantané du pourcentage, le calcul évite cette redondance. Prévoir aussi le cas d'un score maximal égal à zéro."],
  ["Pourquoi éviter tags = 'SQL,Docker,React' dans une colonne d'un quiz ?", "Ces valeurs forment plusieurs liens métier, difficiles à contraindre et à interroger séparément.", "Créer Tag et une table de liaison QuizTag permet de contrôler les références et d'interdire un lien en double."],
  ["Quiz(id, author_id, author_email) : quelle dépendance invite à séparer l'email ?", "author_id détermine author_email ; l'email décrit l'auteur.", "Conserver l'email dans Utilisateur et garder author_id dans Quiz évite de recopier la même donnée dans chaque quiz, sauf besoin d'historisation explicitement conçu."],
  ["Quel exemple montre une anomalie de mise à jour d'un modèle redondant ?", "L'email de l'auteur change dans un quiz mais reste ancien dans ses autres quiz.", "Une seule donnée métier a plusieurs versions incompatibles. La normalisation réduit ce risque en stockant le fait à un endroit adapté."],
  ["Quels trois éléments composent « En tant que… je souhaite… afin de… » ?", "Un acteur, un besoin ou une action, puis un objectif ou bénéfice.", "Exemple : en tant que membre, je souhaite consulter mes anciens scores, afin de suivre ma progression. Le nom d'une technologie ne remplace pas l'objectif utilisateur."],
  ["Quel critère permet de vérifier le besoin de voir les six derniers quiz ?", "Avec huit quiz disponibles, l'accueil montre les six plus récents dans l'ordre défini.", "Ce résultat est observable. Prévoir aussi moins de six quiz et aucun quiz ; « la page est correcte » ne précise pas ce qu'il faut vérifier."],
  ["Comment passer du besoin « retrouver mes anciens scores » à une règle de gestion ?", "Préciser qu'une nouvelle partie conserve une tentative distincte avec son résultat.", "Le besoin exprime l'utilité pour le membre ; la règle précise le comportement des données. Le modèle introduit ensuite Tentative pour représenter ce fait."],
  ["Les acteurs membre, auteur et administrateur imposent-ils trois entités Merise ?", "Non. Dans Oquiz, ils peuvent être représentés par le rôle du compte Utilisateur.", "Une entité décrit un objet métier et les informations à conserver. Les acteurs aident à comprendre les usages et permissions ; chaque acteur ne devient pas automatiquement une table."],
  ["Une user story suffit-elle pour choisir toutes les cardinalités ?", "Non. Il faut préciser les règles, les cas d'absence et les répétitions autorisées.", "« Participer à un quiz » ne dit pas à lui seul si l'on peut rejouer. Le cours autorise plusieurs participations ; cette réponse influence l'identification des tentatives."],
  ["Quel chemin relie un besoin utilisateur à une table cohérente ?", "Besoin et acteurs → règles de gestion → données → entités et cardinalités → MLD → MPD.", "Pour l'historique Oquiz : besoin de retrouver les résultats, règle de tentatives répétées, données de score et de date, entité Tentative puis références et contraintes SQL. Le recueil se nourrit aussi des maquettes et des échanges client."]
];

const sqlCards = [
  ["Un quiz a trois questions : combien de lignes donne sa jointure avec question ?", "Trois lignes, si chaque question correspond une fois.", "La ligne résultante représente ici un couple quiz/question. Le titre du quiz peut donc apparaître trois fois."],
  ["Après LEFT JOIN, où filtrer les questions pour conserver les quiz sans correspondance ?", "Dans la condition ON de la jointure.", "WHERE qu.description = '...' éliminerait aussi les lignes dont les colonnes de question sont NULL. Vérifier l'effet sur un quiz sans question."],
  ["Quel compteur donne zéro pour un quiz sans question après LEFT JOIN ?", "COUNT(qu.id), si qu.id est la clé non nulle des questions.", "COUNT(*) compte la ligne conservée du quiz, donc donne un dans ce cas. COUNT(colonne) ignore les valeurs NULL."],
  ["Trois questions et deux tags joints au même quiz : pourquoi COUNT(qu.id) peut-il donner six ?", "Les correspondances entre les deux relations multiplient les lignes.", "COUNT(DISTINCT qu.id) compte les questions distinctes, ou on agrège les questions séparément avant la jointure avec les tags."],
  ["Pourquoi description = NULL ne sélectionne-t-il pas les descriptions absentes ?", "La comparaison avec NULL donne un résultat inconnu ; employer IS NULL.", "WHERE conserve les conditions vraies. Pour des données renseignées, utiliser IS NOT NULL."],
  ["Que renvoie COALESCE(0, 10) ?", "Zéro.", "COALESCE choisit la première valeur non NULL. Il ne considère ni zéro ni la chaîne vide comme une absence."],
  ["Quel mot-clé exprime « ce quiz possède au moins une tentative » sans joindre toutes les tentatives ?", "EXISTS avec une sous-requête liée au quiz.", "WHERE EXISTS (SELECT 1 FROM attempt a WHERE a.quiz_id = q.id). Le SELECT 1 ne signifie pas qu'on compte une seule tentative."],
  ["Quel piège présente NOT IN avec une liste pouvant contenir NULL ?", "Le résultat peut devenir inconnu même pour une valeur absente de la liste.", "Pour chercher une absence de relation, une sous-requête NOT EXISTS avec condition de lien évite ce piège. Examiner les NULL plutôt que les supprimer sans justification."],
  ["Que faut-il prévoir avant UPDATE quiz SET title = 'Nouveau titre' ?", "Un WHERE adapté si l'on ne veut pas modifier tous les quiz.", "Vérifier les lignes ciblées et le résultat attendu. Un UPDATE qui ne touche aucune ligne n'est pas automatiquement une erreur SQL."],
  ["Pourquoi tous les appels d'une transaction doivent-ils utiliser la même connexion ?", "La transaction appartient à cette connexion, pas à toutes les connexions du pool.", "Avec un ORM, utiliser son API de transaction et le client fourni dans ce contexte pour chaque écriture concernée."],
  ["Pourquoi LIMIT 10 seul ne définit-il pas les dix mêmes lignes ?", "Sans ORDER BY, l'ordre du résultat n'est pas garanti.", "Pour une pagination prévisible, trier avec une clé stable qui départage les égalités, par exemple created_at puis id."],
  ["Quel mot-clé PostgreSQL permet de récupérer l'id d'une ligne insérée ?", "RETURNING id.", "INSERT ... RETURNING évite une recherche séparée hasardeuse de « la dernière ligne ». Les valeurs envoyées par le client restent paramétrées."]
];

const typescriptCards = [
  ["Que deviennent les annotations number et les interfaces après compilation TypeScript ?", "Elles sont effacées du JavaScript exécuté.", "Elles servent au contrôle statique. Les types n'ajoutent pas automatiquement une validation des entrées au runtime."],
  ["Quelle commande complète tsx pour contrôler les types sans générer les fichiers ?", "npx tsc --noEmit.", "tsx exécute le TypeScript rapidement ; son démarrage réussi ne prouve pas que le contrôle de types du projet passe."],
  ["Que demande strict: true dans tsconfig.json ?", "L'activation d'une famille de vérifications de types plus strictes.", "Cela inclut notamment les contrôles autour des absences et des any implicites. Les tests de comportement et les validations métier restent nécessaires."],
  ["Avec let score = 0, TypeScript accepte-t-il score = '10' ?", "Non. Le type de score est inféré number.", "L'inférence permet de garder le code lisible sans annoter chaque variable. Pour autoriser deux types, il faudrait un contrat explicite et des traitements adaptés."],
  ["Quelle différence pratique entre any et unknown ?", "unknown oblige à vérifier le type avant une opération spécifique ; any retire ces contrôles utiles.", "Une valeur unknown peut contenir n'importe quoi. typeof value === 'string' permet ensuite d'utiliser les méthodes de chaîne dans cette branche."],
  ["typeof value === 'object' garantit-il que value n'est pas null ?", "Non : typeof null vaut 'object'.", "Ajouter value !== null avant une lecture de propriété. Un tableau est aussi un objet ; Array.isArray sert à le distinguer."],
  ["Comment utiliser une méthode de Date sur un paramètre string | Date ?", "Restreindre d'abord le type, par exemple avec instanceof Date.", "Dans cette branche, TypeScript autorise les méthodes de Date ; dans l'autre branche, la valeur peut être traitée comme une chaîne."],
  ["Pour exprimer 'member' | 'admin', emploies-tu directement une interface ou un alias type ?", "Un alias type, car il peut représenter une union.", "interface décrit notamment des contrats d'objets ; type peut aussi décrire objets, unions, tuples et alias de types primitifs."],
  ["Que doit-on gérer quand on lit description?: string ?", "La possibilité d'obtenir undefined en plus d'une chaîne.", "description: string | null exige la propriété, mais autorise null. Les deux contrats ne décrivent pas la même absence."],
  ["Quel champ permet de restreindre une union discriminée success / error ?", "Un discriminant commun, par exemple status avec des valeurs littérales distinctes.", "Après status === 'success', on peut lire data si ce champ n'existe que dans la variante succès. La variante erreur peut porter error."],
  ["Que conserve le T de premier<T>(items: T[]): T | undefined ?", "Le lien entre le type des éléments reçus et celui du résultat.", "Une liste de Quiz renvoie un Quiz ou undefined ; une liste de nombres renvoie un nombre ou undefined. any ne préserverait pas ce contrat."],
  ["Que signifie T extends { id: number } dans une fonction générique ?", "Le type fourni doit posséder un id de type number.", "La fonction peut utiliser id tout en conservant les autres informations du type concret. Il s'agit d'une contrainte de type, pas nécessairement d'un héritage de classe."],
  ["Quelle différence entre Partial<Quiz> et Pick<Quiz, 'title'> ?", "Partial rend les propriétés facultatives ; Pick sélectionne les propriétés nommées.", "Partial<Pick<Quiz, 'title'>> ne décrit qu'un titre facultatif. Ces types ne filtrent pas les propriétés d'un JSON à l'exécution."],
  ["Quel est le type de retour d'une fonction async qui produit une liste de Quiz ?", "Promise<Quiz[]>.", "Avant await, la valeur est une promesse. Après await réussi, elle est Quiz[]. Une erreur peut rejeter la promesse et doit être traitée."],
  ["Comment lire message sur une erreur de type unknown dans catch ?", "Vérifier d'abord error instanceof Error.", "Une valeur lancée peut être une chaîne ou un autre objet. Prévoir une branche pour ces cas au lieu d'affirmer sans contrôle qu'il s'agit d'Error."],
  ["Pourquoi utiliser import type pour un type avec verbatimModuleSyntax ?", "Pour déclarer explicitement un import destiné au typage, effacé à l'exécution.", "Un type ou une interface ne fournit pas une valeur runtime. Cette distinction aide à conserver des imports cohérents avec le code réellement exécuté."]
];

function createCards(technology, cp, rows, tag) {
  return rows.map(([question, answer, detail], index) => ({
    id: `course-${technology}-${String(index + 1).padStart(2, "0")}`,
    cp: typeof cp === "function" ? cp(index) : cp,
    technology, question, answer, detail, tags: [tag]
  }));
}

export const courseCards = [
  ...createCards("merise", "cp7", meriseCards, "Merise"),
  ...createCards("sql", "cp8", sqlCards, "SQL"),
  ...createCards("typescript", index => index < 3 || index === 15 ? "cp1" : "cp3", typescriptCards, "TypeScript")
];

export const courseSources = [
  { label: "Agile Alliance · Formule des user stories", url: "https://agilealliance.org/glossary/user-story-template/" },
  { label: "Cours Oquiz · Acteurs et user stories", path: "SC01234-OQUIZ-Zer0absolute/docs/conception/conception/user-stories.md" },
  { label: "Cours Oquiz · Recueil des données à partir des besoins", path: "SC01234-OQUIZ-Zer0absolute/docs/conception/merise/recueil-des-données/recueil-des-données.md" },
  { label: "Cours Oquiz · Dictionnaire des données", path: "SC01234-OQUIZ-Zer0absolute/docs/conception/merise/dictionnaire-des-données/dictionnaire-des-données.md" },
  { label: "Cours Oquiz · Fiche Merise", path: "SC01234-OQUIZ-Zer0absolute/docs/fiches/merise.md" },
  { label: "Cours Oquiz · Modélisation et PostgreSQL", path: "SC01234-OQUIZ-Zer0absolute/docs/cours/SC01/SC01E03.md" },
  { label: "Cours Oquiz · MLD et tentatives répétées", path: "SC01234-OQUIZ-Zer0absolute/docs/conception/merise/mld/mld.md" },
  { label: "Cours Oquiz · MPD initial SQL", path: "SC01234-OQUIZ-Zer0absolute/docs/conception/merise/mpd/create-tables.sql" },
  { label: "Cours Oquiz · Schéma Prisma actuel", path: "SC01234-OQUIZ-Zer0absolute/api/prisma/schema.prisma" },
  { label: "Cours Oquiz · Fiche TypeScript", path: "SC01234-OQUIZ-Zer0absolute/docs/fiches/typescript.md" },
  { label: "Cours Oquiz · TypeScript et architecture", path: "SC01234-OQUIZ-Zer0absolute/docs/cours/SC01/SC01E04.md" },
  { label: "Cours Oquiz · Démonstration des types", path: "SC01234-OQUIZ-Zer0absolute/docs/sandbox/typescript/index.ts" },
  { label: "Cours Oquiz · Configuration TypeScript", path: "SC01234-OQUIZ-Zer0absolute/api/tsconfig.json" },
  { label: "Cours Oquiz · Scripts de développement et de tests", path: "SC01234-OQUIZ-Zer0absolute/api/package.json" },
  { label: "TypeScript · Narrowing", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" },
  { label: "TypeScript · Génériques", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" },
  { label: "TypeScript · Types utilitaires", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" },
  { label: "TypeScript · Configuration du compilateur", url: "https://www.typescriptlang.org/tsconfig/" },
  { label: "tsx · Exécution et contrôle des types", url: "https://tsx.is/typescript" },
  { label: "PostgreSQL · Jointures", url: "https://www.postgresql.org/docs/current/tutorial-join.html" },
  { label: "PostgreSQL · Agrégats", url: "https://www.postgresql.org/docs/current/tutorial-agg.html" },
  { label: "PostgreSQL · Comparaisons et NULL", url: "https://www.postgresql.org/docs/current/functions-comparison.html" },
  { label: "PostgreSQL · Sous-requêtes", url: "https://www.postgresql.org/docs/current/functions-subquery.html" },
  { label: "PostgreSQL · Transactions", url: "https://www.postgresql.org/docs/current/tutorial-transactions.html" }
];
