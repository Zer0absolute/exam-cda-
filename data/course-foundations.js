/**
 * Cours autonomes : explications originales, exemples fictifs et exercices corrigés.
 * Les sources primaires sont liées sur chaque fiche et carte.
 * Merise est une méthode documentée par ses auteurs et l'enseignement académique :
 * ces références ne sont pas présentées comme une spécification officielle unique.
 */
const references = {
  meriseBook: { label: "Nanci et Espinasse · Merise, deuxième génération (ouvrage des auteurs)", url: "https://pageperso.lis-lab.fr/bernard.espinasse/wp-content/uploads/2021/12/LivreMerisePDF-total-12sept14.pdf", kind: "academic" },
  meriseCourse: { label: "Pierre Gérard · Modélisation des systèmes d'information, cours universitaire", url: "https://lipn.univ-paris13.fr/~gerard/docs/cours/merise-slides.pdf", kind: "academic" },
  mocodo: { label: "Mocodo · Manuel de référence de l'auteur", url: "https://laowantong.github.io/mocodo/doc/fr_refman.html", kind: "official" },
  normal: { label: "Stéphane Crozat · Théorie de la normalisation relationnelle", url: "https://stph.scenari-community.org/bdd/nor1.pdf", kind: "academic" },
  decomposition: { label: "Sibel Adali, RPI · Dépendances, formes normales et décomposition", url: "https://cs.rpi.edu/~sibel/csci4380/fall2020/course_notes/normalization.html", kind: "academic" },
  uml: { label: "OMG · UML 2.5.1, standard et document normatif, chapitre 18", url: "https://www.omg.org/spec/UML/2.5.1", kind: "standard" },
  stories: { label: "Agile Alliance · Modèle de user story", url: "https://agilealliance.org/glossary/user-story-template/", kind: "official" },
  pgSelect: { label: "PostgreSQL · Interroger une table", url: "https://www.postgresql.org/docs/current/tutorial-select.html", kind: "official" },
  pgConstraints: { label: "PostgreSQL · Contraintes", url: "https://www.postgresql.org/docs/current/ddl-constraints.html", kind: "official" },
  pgJoin: { label: "PostgreSQL · Jointures", url: "https://www.postgresql.org/docs/current/tutorial-join.html", kind: "official" },
  pgAggregate: { label: "PostgreSQL · Agrégats", url: "https://www.postgresql.org/docs/current/tutorial-agg.html", kind: "official" },
  pgNull: { label: "PostgreSQL · Comparaisons et NULL", url: "https://www.postgresql.org/docs/current/functions-comparison.html", kind: "official" },
  pgSubquery: { label: "PostgreSQL · Sous-requêtes", url: "https://www.postgresql.org/docs/current/functions-subquery.html", kind: "official" },
  pgTransaction: { label: "PostgreSQL · Transactions", url: "https://www.postgresql.org/docs/current/tutorial-transactions.html", kind: "official" },
  pgReturning: { label: "PostgreSQL · RETURNING", url: "https://www.postgresql.org/docs/current/dml-returning.html", kind: "official" },
  pgPrepare: { label: "PostgreSQL · PREPARE et paramètres", url: "https://www.postgresql.org/docs/current/sql-prepare.html", kind: "official" },
  pgOrder: { label: "PostgreSQL · ORDER BY", url: "https://www.postgresql.org/docs/current/queries-order.html", kind: "official" },
  pgLimit: { label: "PostgreSQL · LIMIT et OFFSET", url: "https://www.postgresql.org/docs/current/queries-limit.html", kind: "official" },
  pgIndexes: { label: "PostgreSQL · Index", url: "https://www.postgresql.org/docs/current/indexes.html", kind: "official" },
  pgConditional: { label: "PostgreSQL · COALESCE et expressions conditionnelles", url: "https://www.postgresql.org/docs/current/functions-conditional.html", kind: "official" },
  pgUpdate: { label: "PostgreSQL · UPDATE", url: "https://www.postgresql.org/docs/current/tutorial-update.html", kind: "official" },
  pgDelete: { label: "PostgreSQL · DELETE", url: "https://www.postgresql.org/docs/current/tutorial-delete.html", kind: "official" },
  pgPopulate: { label: "PostgreSQL · INSERT et données d'exemple", url: "https://www.postgresql.org/docs/current/tutorial-populate.html", kind: "official" },
  pgExplain: { label: "PostgreSQL · EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html", kind: "official" },
  tsBasics: { label: "TypeScript · Bases et compilateur", url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html", kind: "official" },
  tsEveryday: { label: "TypeScript · Types courants", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html", kind: "official" },
  tsFunctions: { label: "TypeScript · Fonctions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html", kind: "official" },
  tsNarrowing: { label: "TypeScript · Narrowing et unions discriminées", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html", kind: "official" },
  tsObjects: { label: "TypeScript · Types d'objets et tuples", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html", kind: "official" },
  tsGenerics: { label: "TypeScript · Génériques", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html", kind: "official" },
  tsUtility: { label: "TypeScript · Types utilitaires", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html", kind: "official" },
  tsModules: { label: "TypeScript · Modules et imports de types", url: "https://www.typescriptlang.org/docs/handbook/2/modules.html", kind: "official" },
  tsConfig: { label: "TypeScript · Référence tsconfig", url: "https://www.typescriptlang.org/tsconfig/", kind: "official" },
  tsx: { label: "tsx · Exécution et vérification des types", url: "https://tsx.is/typescript", kind: "official" }
};

const sources = (...keys) => keys.map(key => references[key]);
function lesson(technology, cp, title, body, bullets, keys, extra = {}) {
  return { cp, technology, section: { title, body, bullets, ...extra, sources: sources(...keys) } };
}

const meriseSections = [
  lesson("merise", "cp7", "Merise · Comprendre le chemin de conception",
    "Merise aide à analyser un système d'information. Pour apprendre les données, on part de règles compréhensibles, puis on construit trois modèles : conceptuel, logique et physique. Tous les exemples ci-dessous sont fictifs et complets ; aucun dépôt de projet n'est nécessaire.",
    [
      "MCD, modèle conceptuel de données : quels objets métier et quels liens faut-il représenter ? Exemple : un client passe une commande.",
      "MLD, modèle logique de données : comment traduire ces objets et liens en relations ? Exemple : COMMANDE contient la référence de CLIENT.",
      "MPD, modèle physique de données : comment les créer dans un moteur précis ? Exemple : PostgreSQL utilise INTEGER, NUMERIC et FOREIGN KEY.",
      "Merise traite aussi les traitements et l'organisation, avec notamment MCT et MOT. Une user story ou un cas d'utilisation décrit un besoin et alimente l'analyse ; ces documents ne remplacent pas le MCD.",
      "Routine : lis la règle, donne un exemple concret, dessine, puis cherche un cas qui contredit ton modèle. Corrige avant de coder."
    ], ["meriseBook", "meriseCourse"],
    { exercise: { prompt: "Où places-tu « une commande possède un seul client », la référence client_id et le type INTEGER de cette référence ?", answer: "La règle guide le MCD. La référence client_id apparaît dans le MLD relationnel. Son type INTEGER et sa contrainte FOREIGN KEY sont des choix du MPD PostgreSQL." } }),

  lesson("merise", "cp7", "Merise · User stories et critères d'acceptation",
    "Exemple autonome : une bibliothèque propose un catalogue et des prêts. Une user story exprime un besoin depuis le point de vue d'un acteur. Elle sert à discuter le résultat attendu avant de concevoir les données.",
    [
      "Formule : « En tant que [acteur], je souhaite [besoin], afin de [bénéfice]. » Elle n'impose pas une technologie.",
      "L'acteur est un rôle dans l'utilisation du système. Une même personne peut être lectrice et administratrice ; cela n'impose pas deux entités.",
      "Un critère d'acceptation permet de vérifier le résultat avec des données et une situation précises. « La recherche est agréable » demande encore une définition vérifiable.",
      "La règle de gestion décrit une obligation métier, par exemple « un exemplaire ne possède qu'un prêt actif à la fois ». Elle précise la story et influence ensuite le modèle.",
      "Les histoires ci-dessous fixent les besoins de notre exemple ; les critères ne prétendent décrire aucune application existante."
    ], ["stories", "meriseCourse"],
    {
      examples: [
        { role: "visiteur", need: "rechercher un livre par son titre", goal: "savoir si la bibliothèque le possède", criteria: ["Avec les titres « Le Phare » et « Les Jardins », la recherche « Phare » affiche « Le Phare ».", "Une recherche sans correspondance affiche un résultat vide expliqué.", "Le catalogue est consultable sans compte."] },
        { role: "lecteur inscrit", need: "voir mes prêts en cours", goal: "connaître les livres que je dois rendre", criteria: ["Avec deux prêts actifs et un prêt rendu, ma liste affiche les deux prêts actifs.", "Chaque ligne affiche le titre, le numéro d'exemplaire et la date prévue de retour.", "Un autre lecteur ne peut pas consulter ma liste privée."] },
        { role: "administrateur", need: "ajouter un exemplaire à un livre du catalogue", goal: "rendre la nouvelle copie disponible au prêt", criteria: ["L'ajout d'un numéro d'inventaire nouveau crée un exemplaire relié au livre choisi.", "Un numéro d'inventaire déjà utilisé est refusé.", "Un lecteur sans ce droit ne peut pas effectuer l'ajout."] }
      ],
      exercise: { prompt: "Écris une story pour demander le renouvellement d'un prêt et un critère d'acceptation. Quelle règle métier manque avant de dessiner ?", answer: "Exemple : en tant que lecteur inscrit, je souhaite renouveler mon prêt, afin de terminer ma lecture. Critère : un prêt admissible reçoit une nouvelle date de retour. Il faut préciser les conditions : nombre de renouvellements, durée et éventuelle réservation par un autre lecteur. On ne devine pas ces règles à partir de la phrase." }
    }),

  lesson("merise", "cp5", "UML · Cas d'utilisation, acteurs et scénario",
    "Un cas d'utilisation décrit un service du système qui apporte un résultat à un acteur. UML est un langage de modélisation défini par l'OMG ; le diagramme de cas d'utilisation et le MCD Merise répondent à des questions différentes.",
    [
      "Un acteur représente un rôle extérieur au système étudié ; ce peut être une personne ou un autre système. Le rectangle délimite le système, les ovales ses services.",
      "« Emprunter un exemplaire » est un cas d'utilisation. « Lecteur » est un acteur. « Prêt » est une donnée métier susceptible de devenir une entité du MCD.",
      "Scénario proposé : le bibliothécaire identifie le lecteur, choisit l'exemplaire, vérifie les conditions du prêt, enregistre le prêt puis annonce sa date de retour.",
      "Documenter préconditions, étapes, alternatives et résultat. Exemple : carte expirée → prêt refusé, aucun nouveau prêt enregistré.",
      "Le diagramme montre qui demande quoi ; il ne donne ni l'ordre complet des étapes ni les tables. Une description textuelle complète le dessin."
    ], ["uml"],
    {
      code: "Système étudié : gestion des prêts de la bibliothèque\nActeur principal : bibliothécaire\nCas : enregistrer un prêt\nPréconditions : lecteur identifié, exemplaire connu\nSuccès : prêt créé et date de retour annoncée\nAlternative : exemplaire déjà prêté → refus, aucune création",
      exercise: { prompt: "Dans « le bibliothécaire enregistre un prêt pour un lecteur », dois-tu dessiner le prêt comme acteur du diagramme ?", answer: "Non. Le bibliothécaire est un acteur qui interagit avec le système. Le prêt est un résultat et une donnée métier. Le lecteur peut également être acteur dans d'autres cas d'utilisation ; son statut dépend de son interaction avec le système étudié." }
    }),

  lesson("merise", "cp5", "UML · include et extend sans inverser les flèches",
    "Les relations include et extend relient des cas d'utilisation. Elles expriment une réutilisation ou une extension de comportement ; elles ne décrivent pas des clés étrangères.",
    [
      "include : le cas de base incorpore le comportement du cas inclus. Dans notre scénario d'emprunt, « Enregistrer un prêt » inclut « Vérifier le droit d'emprunter », nécessaire pour ce scénario.",
      "La flèche en pointillés marquée « include » part du cas qui inclut vers le cas inclus.",
      "extend : un cas ajoute du comportement au cas de base à un point d'extension, sous une condition définie si applicable. Le cas de base reste compréhensible et complet sans cette extension.",
      "Exemple : « Imprimer un reçu » étend « Enregistrer un prêt » au point « confirmation », si le lecteur demande un reçu. La flèche « extend » part de l'extension vers le cas étendu.",
      "Une authentification peut être une précondition déjà satisfaite ; dessiner automatiquement « Se connecter » en include de tous les cas peut représenter le mauvais scénario."
    ], ["uml"],
    {
      code: "Enregistrer un prêt --«include»--> Vérifier le droit d'emprunter\nImprimer un reçu    --«extend»---> Enregistrer un prêt\nCondition du reçu : demande du lecteur\nPoint d'extension : après l'enregistrement du prêt",
      exercise: { prompt: "Un paiement peut réussir sans coupon. L'application propose un comportement « Appliquer un coupon » pendant le paiement si le client en fournit un. Quelle relation convient à cet exemple ?", answer: "extend peut convenir : « Appliquer un coupon » étend « Payer », au point d'extension et sous la condition indiqués. La flèche va de l'extension vers le paiement. Il faut toujours vérifier le scénario réel ; un simple mot « facultatif » ne remplace pas sa description." }
    }),

  lesson("merise", "cp7", "Merise · Recueil et dictionnaire de données",
    "Exemple : une bibliothèque enregistre des lecteurs et des prêts. Le recueil inventorie les informations utiles et les questions ouvertes. Le dictionnaire donne un sens commun aux données retenues.",
    [
      "Pour chaque donnée : nom, définition, domaine de valeurs, unité ou format, caractère obligatoire, règle, exemple et origine si utile.",
      "Un domaine métier précède le type SQL : « date de retour d'un livre » a un sens avant de devenir DATE ou TIMESTAMPTZ.",
      "Éviter les synonymes ambigus : retour_prevu est une échéance ; retour_effectif est l'instant où la copie revient.",
      "Un âge est calculable depuis une date de naissance et une date de référence ; stocker un âge courant peut le rendre faux sans aucune modification de ligne.",
      "Le dictionnaire sert à vérifier les modèles et le code. Ajouter une donnée personnelle demande un besoin précis, pas simplement une colonne disponible."
    ], ["meriseBook", "mocodo"],
    {
      code: "Donnée             Sens                     Domaine / règle\nnumero_inventaire  Identifie une copie      Texte, requis, unique\nretour_prevu       Échéance du prêt         Date, requise\nretour_effectif    Fin effective du prêt    Date, absente avant retour\nnom_lecteur        Nom d'usage du lecteur   Texte, requis\n\nExemples : EX-0042 ; 20/11/2030 ; absence ; Lina",
      exercise: { prompt: "Décris quantite pour une ligne de commande : sens, type logique, règle et exemple.", answer: "Nombre d'unités commandées du produit sur cette ligne ; entier ; obligatoire et strictement supérieur à zéro ; exemple 3. INTEGER NOT NULL CHECK (quantite > 0) sera une traduction physique possible." }
    }),

  lesson("merise", "cp7", "Merise · Entité, occurrence, attribut et identifiant",
    "Une entité-type représente une catégorie d'objets métier. Une occurrence est un objet concret de cette catégorie. Un attribut décrit une propriété ; un identifiant permet de distinguer les occurrences.",
    [
      "Entité-type LECTEUR : tous les lecteurs. Occurrence : lecteur numéro 17, nommé Lina. Attribut nom : la propriété ; « Lina » : sa valeur.",
      "Deux lecteurs peuvent avoir le même nom. Un identifiant doit rester unique dans le périmètre retenu ; nom seul ne suffit donc pas.",
      "Un identifiant peut être naturel, comme un numéro d'inventaire stable, ou technique, comme un entier généré. Une clé technique n'interdit pas tous les doublons métier.",
      "Distinguer LIVRE, qui décrit un titre ou une édition selon la règle choisie, et EXEMPLAIRE, qui décrit une copie physique. Trois copies d'un titre sont trois occurrences d'EXEMPLAIRE.",
      "Une entité possède une identité et des propriétés propres. Une valeur comme une date peut rester un attribut ; on ne transforme pas chaque nom rencontré en entité."
    ], ["meriseCourse", "mocodo"],
    {
      code: "LIVRE : id_livre, titre\nEXEMPLAIRE : numero_inventaire, etat\nLECTEUR : id_lecteur, nom\n\nOccurrences :\nLIVRE(8, « Le Phare »)\nEXEMPLAIRE(EX-01, bon état)\nEXEMPLAIRE(EX-02, usé)\nLes deux exemplaires concernent le livre 8.",
      exercise: { prompt: "Pourquoi un ISBN ne permet-il pas d'identifier chacune des trois copies physiques d'une même édition ?", answer: "Les trois copies partagent l'ISBN de l'édition. Leur numéro d'inventaire doit les distinguer. On représente l'édition ou le livre d'une part, les exemplaires physiques d'autre part." }
    }),

  lesson("merise", "cp7", "Merise · Association binaire et attribut du lien",
    "Une association représente un lien métier entre occurrences. Une association binaire relie deux types d'entités. Certains faits décrivent le lien lui-même plutôt que l'un de ses participants.",
    [
      "CLIENT — passer — COMMANDE : l'association relie un client à ses commandes. Elle n'est pas encore une jointure SQL.",
      "COMMANDE — contenir — PRODUIT porte quantite. La quantité 3 concerne ce produit dans cette commande, et non toutes les commandes du produit.",
      "Si un même couple commande/produit ne doit apparaître qu'une fois, ce couple identifie la ligne. Si plusieurs lignes identiques sont autorisées, choisir une identification qui les distingue.",
      "Une association peut être réflexive : EMPLOYE — encadrer — EMPLOYE. Nommer les rôles encadrant et encadré évite de confondre les deux participations.",
      "Un événement répété, comme un emprunt du même exemplaire par le même lecteur à deux dates, mérite souvent une entité EMPRUNT avec sa propre identité."
    ], ["mocodo", "meriseCourse"],
    {
      code: "COMMANDE : numero_commande, date\nPRODUIT : reference_produit, libelle\nCONTENIR : quantité pour un couple commande/produit\n\nFait : commande 10 contient produit P7 en quantité 3.",
      exercise: { prompt: "Une école enregistre la note d'un élève pour chaque examen. Où placer la note ?", answer: "Sur le lien entre l'élève et l'examen, ou dans une entité RESULTAT qui représente cette participation. La note ne décrit ni l'élève en général ni l'examen en général." }
    }),

  lesson("merise", "cp7", "Merise · Lire les quatre cardinalités",
    "Une cardinalité Merise se lit à partir d'une occurrence de l'entité située du côté où elle est écrite. Le minimum exprime une obligation de participation ; le maximum fixe la limite.",
    [
      "0,1 : aucun lien ou un seul. Exemple : un lecteur peut avoir zéro ou une carte active dans le modèle choisi.",
      "1,1 : exactement un lien. Exemple : chaque commande appartient à un seul client.",
      "0,n : zéro, un ou plusieurs liens. Exemple : un client peut n'avoir aucune commande ou en passer plusieurs.",
      "1,n : au moins un lien. Exemple : une commande validée contient au moins une ligne.",
      "CLIENT (0,n) — passer — COMMANDE (1,1) se lit avec deux phrases : pour un client, combien de commandes ? Pour une commande, combien de clients ?",
      "La règle peut dépendre du cycle de vie : un panier brouillon peut être vide, une commande validée non. Expliciter cet état plutôt que dessiner une obligation impossible pendant la création."
    ], ["meriseCourse", "mocodo"],
    {
      code: "CLIENT (0,n) — PASSER — COMMANDE (1,1)\nClient Alice : commandes 10 et 11\nClient Bilal : aucune commande\nCommande 10 : appartient à Alice\n\nLecture : la cardinalité 1,1 côté COMMANDE décrit une commande,\npas le nombre de commandes d'Alice.",
      exercise: { prompt: "Une équipe a au moins un joueur. Un joueur appartient à au plus une équipe et peut être sans équipe. Écris les deux cardinalités.", answer: "EQUIPE (1,n) — appartenir — JOUEUR (0,1). Pour une équipe, au moins un joueur ; pour un joueur, zéro ou une équipe. Au MLD, la référence facultative d'équipe sera portée par JOUEUR." }
    }),

  lesson("merise", "cp7", "Merise · Association ternaire et liens inventés",
    "Une ternaire relie trois types d'entités dans un même fait. Exemple : un enseignant enseigne une matière à une classe. Trois liens par paires ne conservent pas nécessairement le sens du triplet.",
    [
      "Le fait « Alice enseigne SQL à C1 » porte simultanément enseignant, matière et classe. Savoir qu'Alice enseigne SQL et travaille avec C2 ne prouve pas qu'elle enseigne SQL à C2.",
      "Dans les trois lignes fournies, chacun des couples du triplet Alice–SQL–C2 existe quelque part. Pourtant ce triplet complet n'existe pas.",
      "Projeter en Enseignant/Matière, Enseignant/Classe et Matière/Classe puis réunir ces couples peut donc produire une ligne fausse : la décomposition a perdu une contrainte de liaison.",
      "Conserver AFFECTATION(enseignant, matiere, classe), ou une entité associative reliée aux trois participants. Une identité technique peut être accompagnée d'un UNIQUE sur le triplet si celui-ci ne doit pas se répéter.",
      "Les cardinalités d'une ternaire décrivent les participations de chaque occurrence aux faits ternaires ; les règles portant sur un couple, comme « pour une classe et une matière, un enseignant », demandent une contrainte supplémentaire explicite."
    ], ["mocodo", "decomposition"],
    {
      code: "AFFECTATION(enseignant, matière, classe)\nAlice | SQL        | C1\nAlice | JavaScript | C2\nBob   | SQL        | C2\n\nTrois couples existent :\nAlice–SQL ; Alice–C2 ; SQL–C2\nMais Alice–SQL–C2 n'est PAS un fait enregistré.",
      exercise: { prompt: "Quel faux triplet peut-on reconstruire après remplacement par trois associations indépendantes ? Comment garder l'information correcte ?", answer: "Alice–SQL–C2. Garder le triplet dans AFFECTATION ou dans une entité associative qui référence les trois participants. Une décomposition est acceptable seulement si les règles garantissent que la reconstruction ne produit aucun faux fait." }
    }),

  lesson("merise", "cp7", "Merise · Construire un MCD autonome",
    "Cas bibliothèque : on connaît les titres, leurs copies physiques, les lecteurs et l'historique des emprunts. Chaque copie concerne un livre ; un emprunt concerne exactement un lecteur et un exemplaire.",
    [
      "Étape 1 : isoler les objets LIVRE, EXEMPLAIRE, LECTEUR et EMPRUNT. Étape 2 : choisir leurs identifiants et attributs. Étape 3 : poser les associations et lire leurs cardinalités.",
      "LIVRE (0,n) — posséder — EXEMPLAIRE (1,1) : on autorise un titre de catalogue sans copie. Chaque copie décrit un seul titre.",
      "LECTEUR (0,n) — effectuer — EMPRUNT (1,1), et EXEMPLAIRE (0,n) — concerner — EMPRUNT (1,1). L'historique peut contenir plusieurs prêts successifs d'une copie.",
      "L'interdiction de deux prêts actifs simultanés sur une copie n'est pas la même règle que « une copie a au plus un emprunt dans tout l'historique ». La contrainte temporelle doit être décrite séparément.",
      "Le MCD ne nécessite pas de PostgreSQL ni de classe TypeScript. Vérifier trois histoires : titre sans copie, lecteur sans emprunt, copie empruntée deux fois à des dates différentes."
    ], ["mocodo", "meriseCourse"],
    {
      code: "LIVRE : id_livre, titre\nEXEMPLAIRE : id_exemplaire, etat\nLECTEUR : id_lecteur, nom\nEMPRUNT : id_emprunt, debut, retour_prevu, retour_effectif\n\nLIVRE (0,n) — posséder — EXEMPLAIRE (1,1)\nLECTEUR (0,n) — effectuer — EMPRUNT (1,1)\nEXEMPLAIRE (0,n) — concerner — EMPRUNT (1,1)",
      exercise: { prompt: "Pourquoi la cardinalité EXEMPLAIRE (0,1) vers EMPRUNT ne convient-elle pas à l'historique ?", answer: "Elle limiterait une copie à un seul emprunt pour toute sa vie. Pour l'historique, une copie a zéro ou plusieurs emprunts ; une règle séparée limite ceux qui sont actifs simultanément." }
    }),

  lesson("merise", "cp7", "Merise · MLD : traduire une relation 1:n",
    "Le MLD relationnel traduit le modèle en relations, colonnes et clés. Pour CLIENT (0,n) — passer — COMMANDE (1,1), chaque commande contient la référence du client auquel elle appartient.",
    [
      "Une entité devient généralement une relation. Son identifiant fournit une clé candidate ; on choisit une clé primaire pour l'implantation.",
      "La FK est portée par COMMANDE, car une commande pointe vers un seul client. Plusieurs commandes peuvent conserver le même client_id.",
      "Le minimum 1 sur le lien de la commande conduit ici à une référence obligatoire. Si une commande pouvait être sans client, il faudrait représenter cette absence.",
      "La FK vérifie que le client référencé existe ; elle ne garantit pas qu'un client possède au moins une commande.",
      "Ajouter une liste d'identifiants de commandes dans CLIENT serait une mauvaise traduction relationnelle de ce lien."
    ], ["mocodo", "pgConstraints"],
    {
      code: "CLIENT(id_client, nom)\nCOMMANDE(id_commande, date, #id_client → CLIENT.id_client)\n\nCLIENT : 1 Alice ; 2 Bilal\nCOMMANDE : 10 → client 1 ; 11 → client 1\nBilal peut exister sans commande.",
      exercise: { prompt: "Département (0,n) — employer — Employé (1,1). Quelle relation porte la référence ?", answer: "EMPLOYE contient id_departement, référence obligatoire vers DEPARTEMENT. Plusieurs employés peuvent référencer le même département." }
    }),

  lesson("merise", "cp7", "Merise · MLD : traduire n:n et n-aire",
    "Quand chaque côté peut participer plusieurs fois, on conserve les faits dans une relation d'association. Pour les commandes, cette relation devient LIGNE_COMMANDE.",
    [
      "COMMANDE (1,n) — contenir — PRODUIT (0,n) devient LIGNE_COMMANDE(id_commande, id_produit, quantite). Les deux identifiants référencent leurs relations.",
      "Si une ligne par couple est la règle, la clé composée (id_commande, id_produit) interdit de répéter ce couple. quantite décrit le couple complet.",
      "Une association ternaire devient une relation avec les trois références et ses attributs. La clé dépend des règles : triplet entier ou combinaison plus petite si une dépendance est établie.",
      "Une clé technique id_ligne n'empêche pas deux lignes portant le même couple. Ajouter UNIQUE(id_commande, id_produit) seulement si la règle l'exige.",
      "Une FK depuis LIGNE_COMMANDE vers COMMANDE n'impose pas qu'une commande possède une ligne. Le minimum 1 côté commande demande aussi une vérification de validation."
    ], ["mocodo", "pgConstraints"],
    {
      code: "LIGNE_COMMANDE(\n  #id_commande → COMMANDE.id_commande,\n  #id_produit → PRODUIT.id_produit,\n  quantite\n)\nClé : (id_commande, id_produit)\n\nAFFECTATION(#id_enseignant, #id_matiere, #id_classe)\nClé choisie dans cet exemple : les trois références.",
      exercise: { prompt: "Un étudiant suit plusieurs modules et un module accueille plusieurs étudiants. Où stocker sa date d'inscription au module ?", answer: "Dans INSCRIPTION(id_etudiant, id_module, date_inscription), qui représente ce lien. Le couple peut être clé si une seule inscription par étudiant/module est autorisée ; sinon préciser l'année ou l'occurrence d'inscription." }
    }),

  lesson("merise", "cp7", "Merise · MLD : traduire une relation 1:1",
    "Exemple : une personne possède zéro ou un dossier confidentiel ; chaque dossier appartient exactement à une personne. Deux tables séparées peuvent convenir si leurs usages et droits sont distincts.",
    [
      "DOSSIER porte personne_id : FK pour le parent existant, NOT NULL pour le propriétaire obligatoire, UNIQUE pour au plus un dossier par personne.",
      "PERSONNE peut exister sans dossier : ce modèle respecte son minimum zéro.",
      "Un 1:1 obligatoire des deux côtés est plus exigeant. La seule FK obligatoire de DOSSIER vers PERSONNE n'impose pas qu'une personne possède un dossier.",
      "Fusionner peut être pertinent si les deux objets ont la même identité, les mêmes droits et le même cycle de vie. Deux FK circulaires ne sont pas un réflexe obligatoire.",
      "Une clé primaire partagée est une autre traduction possible : DOSSIER.personne_id sert à la fois de PK et de FK."
    ], ["mocodo", "pgConstraints"],
    {
      code: "PERSONNE(id_personne, nom)\nDOSSIER(id_dossier, contenu, #personne_id)\nContraintes sur personne_id : FK + NOT NULL + UNIQUE\n\nPERSONNE (0,1) — posséder — DOSSIER (1,1)",
      exercise: { prompt: "La FK est NOT NULL mais pas UNIQUE. Quelle règle est encore violable ?", answer: "Deux dossiers peuvent pointer vers la même personne. NOT NULL rend chaque propriétaire obligatoire ; UNIQUE limite à un dossier par personne." }
    }),

  lesson("merise", "cp7", "Merise · MPD : types et contraintes concrets",
    "Le MPD applique les choix d'un SGBD. Voici un fragment PostgreSQL autonome : une commande possède un client existant et un total positif ou nul.",
    [
      "PRIMARY KEY identifie une ligne, UNIQUE protège une autre unicité métier, NOT NULL interdit l'absence, FOREIGN KEY protège la référence, CHECK vérifie une condition sur les valeurs.",
      "Choisir NUMERIC pour un montant décimal exact dans cet exercice ; INTEGER convient aux quantités entières. Le type doit correspondre au domaine.",
      "CHECK(total >= 0) seul laisse passer NULL dans PostgreSQL. Ajouter NOT NULL si le montant est obligatoire.",
      "Une suppression du parent impose un choix : refus, cascade ou mise à NULL compatible avec la règle. Ne pas choisir CASCADE uniquement pour faire disparaître une erreur.",
      "Une contrainte du schéma s'applique aussi aux écritures qui contournent le formulaire. Les contrôles d'autorisation restent également côté serveur."
    ], ["pgConstraints"],
    {
      code: "CREATE TEMP TABLE client_demo (\n  id INTEGER PRIMARY KEY,\n  nom TEXT NOT NULL\n);\nCREATE TEMP TABLE commande_demo (\n  id INTEGER PRIMARY KEY,\n  client_id INTEGER NOT NULL REFERENCES client_demo(id),\n  total NUMERIC(10,2) NOT NULL CHECK (total >= 0)\n);\nINSERT INTO client_demo VALUES (1, 'Alice');\nINSERT INTO commande_demo VALUES (10, 1, 30.00);\n-- À lire : (11, 999, 20) est refusé ; le client 999 n'existe pas.",
      exercise: { prompt: "Comment traduire « chaque produit a une référence unique et une quantité entière strictement positive » ?", answer: "reference TEXT NOT NULL UNIQUE et quantite INTEGER NOT NULL CHECK (quantite > 0), avec une PRIMARY KEY adaptée. UNIQUE ne rend pas automatiquement un champ obligatoire." }
    }),

  lesson("merise", "cp7", "Normalisation · Dépendance fonctionnelle et clés",
    "Une dépendance fonctionnelle X → Y signifie : si deux lignes ont les mêmes valeurs de X, elles ont aussi les mêmes valeurs de Y. Elle exprime une règle sur toutes les données valides, pas une coïncidence dans trois exemples.",
    [
      "Dans PRODUIT(reference, libelle, prix), la règle reference → libelle, prix dit qu'une référence détermine ces informations.",
      "Le sens inverse n'est pas garanti : deux produits peuvent coûter le même prix, donc prix ne détermine pas forcément reference.",
      "Une superclé détermine tous les attributs de la relation. Une clé candidate est une superclé minimale : aucun attribut ne peut être retiré sans perdre ce pouvoir.",
      "La clé primaire est une clé candidate choisie pour l'implantation. Un attribut premier appartient à au moins une clé candidate.",
      "Les dépendances se déduisent des règles métier. Ajouter un id technique ne fait pas disparaître les dépendances entre les autres colonnes."
    ], ["normal", "decomposition"],
    {
      code: "PRODUIT(reference, libelle, prix)\nRègle : reference → libelle, prix\nClé candidate : {reference}\nSuperclé : {reference, libelle}\nprix → reference ? NON, sauf règle supplémentaire.\n\nUne clé candidate est minimale ; une superclé peut contenir trop d'attributs.",
      exercise: { prompt: "ETUDIANT(numero, email, nom) : numero et email sont chacun uniques et obligatoires. Quelles sont les clés candidates ?", answer: "{numero} et {email}, si ces unicités sont garanties pour toutes les données valides. {numero, email} est une superclé mais n'est pas minimale. numero peut être choisi comme clé primaire sans retirer le caractère de clé candidate à email." }
    }),

  lesson("merise", "cp7", "Normalisation · 1NF et valeurs atomiques",
    "La première forme normale organise les données en valeurs atomiques pour le domaine retenu. On évite les listes de faits indépendants dans une cellule et les colonnes répétées produit1, produit2, produit3.",
    [
      "Commande 10 avec produits « P1,P2 » et quantités « 2,3 » mélange plusieurs faits. Une ligne par produit permet de relier chaque quantité au bon produit.",
      "L'atomicité dépend de l'usage : une date peut être une valeur unique même si elle possède jour, mois et année.",
      "Séparer le fait dans LIGNE(commande_id, produit_id, quantite). Choisir ensuite une identification compatible avec les répétitions permises.",
      "Un tableau JSON peut avoir un intérêt technique, mais il ne remplace pas automatiquement un modèle relationnel adapté aux faits, contraintes et requêtes.",
      "La 1NF seule ne retire pas les répétitions du libellé ou du prix du produit : les autres formes normales analysent les dépendances."
    ], ["normal"],
    {
      code: "À améliorer :\nCommande | Produits | Quantités\n10       | P1,P2    | 2,3\n\nAprès séparation :\nCommande | Produit | Quantité\n10       | P1      | 2\n10       | P2      | 3",
      exercise: { prompt: "CONTACT(id, telephone1, telephone2, telephone3) accepte au maximum trois téléphones. Quel modèle autorise une liste variable ?", answer: "CONTACT(id, ...) et TELEPHONE(id_telephone, contact_id, numero, ...), ou une relation dont le couple contact_id/numero est clé si la règle d'unicité convient. Chaque téléphone devient un fait séparé." }
    }),

  lesson("merise", "cp7", "Normalisation · 2NF et dépendance partielle",
    "La deuxième forme normale retire les dépendances partielles d'attributs non premiers envers une clé candidate composée. On examine toutes les clés candidates, pas uniquement la clé primaire choisie.",
    [
      "Supposons LIGNE(commande_id, produit_id, libelle_produit, quantite), avec clé (commande_id, produit_id). quantite dépend du couple ; libelle_produit dépend de produit_id seul.",
      "Séparer PRODUIT(produit_id, libelle_produit) et LIGNE(commande_id, produit_id, quantite). Le libellé ne doit plus être corrigé dans chaque commande.",
      "La règle formelle : être en 1NF et ne pas avoir d'attribut non premier dépendant d'une partie stricte d'une clé candidate.",
      "Si toutes les clés candidates sont simples, il n'existe pas de partie propre non vide de clé à l'origine de ce problème.",
      "Ajouter id_ligne comme PK ne suffit pas à corriger le schéma si le couple commande_id/produit_id reste une clé candidate et porte la dépendance partielle."
    ], ["normal", "decomposition"],
    {
      code: "Clé : (commande_id, produit_id)\n(commande_id, produit_id) → quantite\nproduit_id → libelle_produit\n\nDécomposition :\nPRODUIT(produit_id, libelle_produit)\nLIGNE(commande_id, produit_id, quantite)",
      exercise: { prompt: "INSCRIPTION(etudiant_id, module_id, nom_module, date_inscription), clé (etudiant_id, module_id). Quelle colonne déplacer ?", answer: "nom_module dépend de module_id seul : la déplacer dans MODULE(module_id, nom_module). date_inscription reste dans INSCRIPTION si elle décrit l'inscription de cet étudiant à ce module." }
    }),

  lesson("merise", "cp7", "Normalisation · 3NF et dépendance transitive",
    "La troisième forme normale réduit les répétitions provoquées par des dépendances transitives entre attributs non premiers. Exemple : l'employé détermine son département ; le département détermine son nom.",
    [
      "EMPLOYE(id, nom, departement_id, nom_departement) avec id → departement_id et departement_id → nom_departement répète le nom du département pour chaque employé.",
      "Séparer DEPARTEMENT(departement_id, nom_departement) et EMPLOYE(id, nom, departement_id). Un changement de nom concerne désormais un fait du département.",
      "Définition formelle : pour chaque dépendance non triviale X → A, X est une superclé ou A est premier, c'est-à-dire appartient à une clé candidate.",
      "L'intuition « chaque fait à sa place » aide à comprendre, mais la définition précise et les règles métier restent nécessaires pour les cas à plusieurs clés.",
      "La normalisation cherche à limiter anomalies d'insertion, modification et suppression. Une dénormalisation se justifie par un besoin mesuré et une stratégie de cohérence."
    ], ["normal", "decomposition"],
    {
      code: "Avant :\n1 | Lina | D1 | Support\n2 | Sami | D1 | Support\n\nAprès :\nDEPARTEMENT : D1 | Support\nEMPLOYE : 1 | Lina | D1 ; 2 | Sami | D1\nModifier le nom de D1 ne demande plus de corriger deux employés.",
      exercise: { prompt: "LIVRE(id_livre, titre, editeur_id, nom_editeur) : un éditeur conserve un nom unique pour ses livres. Que proposes-tu ?", answer: "EDITEUR(editeur_id, nom_editeur) et LIVRE(id_livre, titre, editeur_id). Le nom courant décrit l'éditeur. Si l'on veut conserver le nom au moment d'une édition, il faut expliciter ce besoin d'historisation au lieu de le confondre avec le nom courant." }
    }),

  lesson("merise", "cp7", "Normalisation · BCNF, décomposition et reconstruction",
    "BCNF renforce la 3NF : tout déterminant d'une dépendance fonctionnelle non triviale doit être une superclé. Une décomposition doit aussi permettre de reconstruire les faits sans en inventer.",
    [
      "Considérons AFFECTATION(etudiant, matiere, professeur). Règles : un couple étudiant/matière détermine le professeur ; chaque professeur enseigne une seule matière.",
      "Les clés candidates sont (etudiant, matiere) et (etudiant, professeur). professeur → matiere respecte la 3NF car matiere est première, mais viole BCNF car professeur seul ne détermine pas l'étudiant.",
      "Séparer PROF_MATIERE(professeur, matiere) et ETUDIANT_PROF(etudiant, professeur) peut retirer cette redondance avec une reconstruction sans perte dans ce cas.",
      "Préserver les dépendances est une autre propriété : cette décomposition ne permet pas de vérifier la règle étudiant/matière → professeur dans une seule table.",
      "Sans perte signifie retrouver exactement les tuples d'origine par jointure. Les faux triplets de l'exemple ternaire montrent l'inverse. On choisit une décomposition avec ses règles et compromis, pas seulement le nombre de tables."
    ], ["decomposition"],
    {
      code: "Règles :\n(etudiant, matiere) → professeur\nprofesseur → matiere\n\nClés candidates :\n(etudiant, matiere) ; (etudiant, professeur)\n\nDécomposition proposée :\nPROF_MATIERE(professeur, matiere)\nETUDIANT_PROF(etudiant, professeur)",
      exercise: { prompt: "Dans X → A, quelle condition exige BCNF ? Est-ce forcément une clé candidate ?", answer: "X doit être une superclé. X peut donc contenir des attributs superflus et ne pas être une clé candidate minimale. Vérifier également reconstruction sans perte et conservation des dépendances après décomposition." }
    })
];

// VALUES déclare toutes les données des exemples de lecture : aucune table à créer.
const customerData = "WITH client(id, nom, email) AS (\n  VALUES (1, 'Alice', 'alice@example.test'),\n         (2, 'Bilal', NULL),\n         (3, 'Chloe', 'chloe@example.test')\n), commande(id, client_id, total) AS (\n  VALUES (10, 1, 30.00), (11, 1, 20.00), (12, 2, 15.00)\n)\n";

const sqlSections = [
  lesson("sql", "cp8", "SQL · Relations, tables et jeu de données",
    "SQL sert à définir, lire et modifier les données d'un SGBD relationnel. Dans notre exemple, trois clients existent ; Alice a deux commandes, Bilal une et Chloe aucune. Tous les extraits de lecture redéclarent ces données avec VALUES.",
    [
      "Une table contient des lignes et des colonnes. Son schéma précise les colonnes, types et contraintes ; son contenu change avec les écritures.",
      "id identifie le client ; client_id relie une commande à son client. Un nom lisible peut être partagé par plusieurs personnes : utiliser l'identifiant pour le lien.",
      "Prérequis d'exécution : une connexion PostgreSQL ouverte. WITH ... VALUES définit ici un petit jeu de lignes valable uniquement pour la requête ; aucune base personnelle n'est nécessaire.",
      "Les exemples de création utilisent des tables temporaires, propres à la session. Exécuter chaque exemple de création dans une nouvelle session pour éviter les noms déjà créés.",
      "Un ORM traduit des appels du langage applicatif en accès aux données ; SQL reste le langage relationnel exécuté. La forme d'un objet en JavaScript ne détermine pas à elle seule le schéma SQL."
    ], ["pgSelect", "pgPopulate", "pgConstraints"],
    {
      code: customerData + "SELECT id, nom, email FROM client ORDER BY id;\n-- Alice, Bilal, Chloe ; email de Bilal = NULL.",
      exercise: { prompt: "Pourquoi la table commande contient-elle client_id plutôt qu'une liste de noms de clients ?", answer: "Chaque commande de cet exemple appartient à un seul client ; la référence identifie ce client sans dépendre d'un nom modifiable ou partagé. Plusieurs commandes peuvent utiliser le même client_id." }
    }),

  lesson("sql", "cp8", "SQL · SELECT, WHERE, tri et pagination",
    "Lecture autonome : le jeu de données est fourni dans l'extrait. On recherche les commandes d'au moins vingt euros et on les trie avant de limiter le résultat.",
    [
      "SELECT choisit les colonnes ou expressions à afficher ; FROM fournit les lignes ; WHERE conserve celles dont la condition vaut vrai.",
      "AND combine des conditions toutes requises ; OR exprime une alternative. Des parenthèses rendent l'intention explicite lorsqu'on les mélange.",
      "ORDER BY total DESC classe du plus grand au plus petit. Un deuxième critère id départage les égalités.",
      "Sans ORDER BY, l'ordre des lignes n'est pas garanti. LIMIT n'implique pas « les premières créées ».",
      "DISTINCT retire les doublons du résultat sélectionné. Ce n'est pas une correction universelle d'une jointure incorrecte."
    ], ["pgSelect", "pgOrder", "pgLimit"],
    {
      code: customerData + "SELECT id, client_id, total\nFROM commande\nWHERE total >= 20\nORDER BY total DESC, id\nLIMIT 2;\n-- Résultat : commande 10 (30), puis 11 (20).",
      exercise: { prompt: "Remplace le filtre par client_id = 1 AND total > 20. Quelle commande reste ?", answer: "La commande 10 d'Alice, total 30. La commande 11 est égale à 20 et ne passe donc pas le filtre strict > 20." }
    }),

  lesson("sql", "cp8", "SQL · INNER JOIN et LEFT JOIN",
    "Une jointure combine les lignes qui satisfont une condition. Notre jeu déclare tous les clients et toutes les commandes : on peut prévoir exactement le résultat avant de l'exécuter.",
    [
      "INNER JOIN conserve les correspondances. Alice produit deux lignes, Bilal une, Chloe aucune : trois lignes.",
      "LEFT JOIN garde aussi les lignes de gauche sans correspondance. Chloe produit une ligne avec les colonnes commande à NULL : quatre lignes.",
      "ON exprime le lien entre les tables. Les alias c et co précisent l'origine des colonnes, par exemple c.id et co.client_id.",
      "Une commande peut multiplier les lignes si elle possède plusieurs produits. Le résultat doit être interprété à la bonne échelle : une ligne par correspondance, pas automatiquement par client.",
      "Avec LEFT JOIN, placer une condition sur les commandes dans ON permet de garder tous les clients ; la placer dans WHERE peut retirer ceux sans correspondance."
    ], ["pgJoin"],
    {
      code: customerData + "SELECT c.nom, co.id AS commande, co.total\nFROM client AS c\nLEFT JOIN commande AS co ON co.client_id = c.id\nORDER BY c.id, co.id;\n-- Alice/10/30 ; Alice/11/20 ; Bilal/12/15 ; Chloe/NULL/NULL.",
      exercise: { prompt: "Ajoute AND co.total >= 25 dans ON. Combien de lignes reste-t-il ? Et si le même filtre est placé dans WHERE ?", answer: "Dans ON : trois lignes, Alice avec la commande 10, Bilal et Chloe avec les colonnes commande à NULL. Dans WHERE : une ligne, Alice avec la commande 10, car les autres lignes ne satisfont pas la condition." }
    }),

  lesson("sql", "cp8", "SQL · NULL et logique à trois valeurs",
    "NULL représente une absence ou une valeur inconnue selon le domaine. Il se distingue de zéro, d'une chaîne vide et du mot « NULL » stocké comme texte.",
    [
      "Une comparaison ordinaire avec NULL donne généralement inconnu, pas vrai ou faux. WHERE ne conserve que les conditions vraies.",
      "Tester l'absence avec IS NULL et la présence avec IS NOT NULL. email = NULL ne sélectionne pas les clients sans email.",
      "COALESCE(email, 'Non fourni') prend la première valeur non NULL pour l'affichage. Elle ne transforme pas la donnée stockée.",
      "COALESCE(0, 10) vaut 0 ; une valeur nulle au sens mathématique n'est pas NULL en SQL.",
      "AVG ignore les NULL. Avec 10, NULL et 20, AVG vaut 15 ; remplacer l'absence par zéro avant AVG donne 10. Le choix traduit une règle, pas seulement une astuce."
    ], ["pgNull", "pgConditional", "pgAggregate"],
    {
      code: customerData + "SELECT nom, COALESCE(email, 'Non fourni') AS contact\nFROM client\nWHERE email IS NULL;\n-- Résultat : Bilal | Non fourni.",
      exercise: { prompt: "Que vaut NULL = NULL ? Comment écrire une comparaison qui traite deux absences comme égales ?", answer: "NULL = NULL donne inconnu. Dans PostgreSQL, IS NOT DISTINCT FROM permet une comparaison qui traite deux NULL comme égaux. Pour rechercher simplement une absence, employer IS NULL." }
    }),

  lesson("sql", "cp8", "SQL · Agrégats, GROUP BY et HAVING",
    "Un agrégat produit une valeur à partir de plusieurs lignes. Avec GROUP BY, chaque client peut devenir un groupe dont on calcule le nombre de commandes et le total.",
    [
      "COUNT(*) compte les lignes. COUNT(co.id) compte les identifiants non NULL : après LEFT JOIN, il donne zéro pour Chloe, tandis que COUNT(*) compterait sa ligne conservée.",
      "SUM additionne les montants ; AVG calcule une moyenne. Sans valeur à additionner, SUM renvoie NULL : COALESCE rend ici zéro pour le client sans commande.",
      "WHERE filtre les lignes avant le calcul des groupes ; HAVING filtre les groupes après ce calcul.",
      "Joindre plusieurs relations 1:n peut multiplier les faits et gonfler un SUM. Compter DISTINCT peut aider pour les identifiants, mais SUM(DISTINCT total) peut supprimer deux vrais montants égaux.",
      "Avant d'agréger, définir ce que doit représenter une ligne : commande, ligne de commande, client ou événement."
    ], ["pgAggregate", "pgJoin", "pgConditional"],
    {
      code: customerData + "SELECT c.id, c.nom, COUNT(co.id) AS nombre,\n       COALESCE(SUM(co.total), 0) AS montant\nFROM client c\nLEFT JOIN commande co ON co.client_id = c.id\nGROUP BY c.id, c.nom\nORDER BY c.id;\n-- Alice : 2 / 50 ; Bilal : 1 / 15 ; Chloe : 0 / 0.",
      exercise: { prompt: "Ajoute HAVING COUNT(co.id) >= 2 avant ORDER BY. Quel groupe reste ?", answer: "Alice uniquement : elle possède deux commandes. Un WHERE COUNT(co.id) >= 2 ne convient pas ; ce nombre est calculé au niveau du groupe." }
    }),

  lesson("sql", "cp8", "SQL · Sous-requête, EXISTS et NOT EXISTS",
    "Une sous-requête utilise le résultat d'une autre requête. EXISTS est pratique pour demander s'il existe une relation sans retourner chaque ligne de cette relation.",
    [
      "La sous-requête est corrélée quand elle utilise une valeur de la requête extérieure, ici c.id pour chercher les commandes de ce client.",
      "EXISTS vaut vrai si au moins une ligne est trouvée ; NOT EXISTS exprime l'absence. SELECT 1 n'est pas un compteur.",
      "Notre exemple renvoie les clients sans commande. Alice et Bilal sont exclus ; Chloe reste une seule fois.",
      "IN exprime l'appartenance à un ensemble de valeurs. NOT IN présente un piège si cet ensemble contient NULL : la condition peut devenir inconnue.",
      "Une sous-requête scalaire doit retourner au plus une ligne et une colonne ; plusieurs lignes provoquent une erreur dans le contexte qui attend une valeur."
    ], ["pgSubquery"],
    {
      code: customerData + "SELECT c.id, c.nom\nFROM client c\nWHERE NOT EXISTS (\n  SELECT 1 FROM commande co WHERE co.client_id = c.id\n);\n-- Résultat : 3 | Chloe.",
      exercise: { prompt: "Remplace NOT EXISTS par EXISTS. Combien de clients sont retournés ? Alice apparaît-elle deux fois ?", answer: "Deux clients : Alice et Bilal. Alice apparaît une seule fois, car EXISTS décide si la condition est vraie pour sa ligne ; il n'ajoute pas une ligne par commande." }
    }),

  lesson("sql", "cp8", "SQL · INSERT, UPDATE, DELETE et paramètres",
    "Exemple complet à exécuter dans une nouvelle session PostgreSQL : une table temporaire produit_demo reçoit un produit, son prix change, puis il est lu avec un paramètre.",
    [
      "INSERT crée une ligne ; UPDATE modifie les lignes retenues ; DELETE les supprime. Sans WHERE, UPDATE ou DELETE peut concerner toute la table.",
      "RETURNING récupère les colonnes des lignes effectivement écrites. Ne pas rechercher « la dernière ligne » avec MAX(id) pour deviner l'identifiant de sa propre insertion.",
      "Les paramètres séparent les valeurs de la structure SQL. PREPARE utilise ici $1 ; un client applicatif dispose généralement de son API de requête paramétrée.",
      "Un nom de colonne ou une direction de tri n'est pas une valeur ordinaire. Choisir ces éléments dans une liste autorisée plutôt que concaténer une entrée libre.",
      "Une écriture qui touche zéro ligne n'est pas automatiquement une erreur SQL. Si l'absence viole la règle métier, le programme doit la détecter."
    ], ["pgPopulate", "pgUpdate", "pgDelete", "pgReturning", "pgPrepare"],
    {
      code: "CREATE TEMP TABLE produit_demo (\n  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  nom TEXT NOT NULL,\n  prix NUMERIC(10,2) NOT NULL CHECK (prix >= 0)\n);\nINSERT INTO produit_demo(nom, prix)\nVALUES ('Cahier', 5.50) RETURNING id;\nUPDATE produit_demo SET prix = 6.00 WHERE id = 1 RETURNING *;\nPREPARE chercher_produit(INTEGER) AS\n  SELECT nom, prix FROM produit_demo WHERE id = $1;\nEXECUTE chercher_produit(1);\n-- Cahier | 6.00\nDEALLOCATE chercher_produit;",
      exercise: { prompt: "Que signifie un résultat vide après UPDATE ... WHERE id = 999 RETURNING id ?", answer: "Aucune ligne n'a été modifiée parce que cet identifiant n'existait pas. Si le cas d'usage exige un produit existant, traiter cette absence ; une transaction ne transforme pas à elle seule ce cas en erreur." }
    }),

  lesson("sql", "cp8", "SQL · Transactions et opération métier",
    "Exemple autonome dans une nouvelle session PostgreSQL : réserver une unité doit réduire le stock et enregistrer la réservation ensemble. Une transaction regroupe ces écritures.",
    [
      "BEGIN commence ; COMMIT valide ; ROLLBACK annule les écritures non validées. Les opérations doivent appartenir à la même connexion ou au contexte transactionnel de l'ORM.",
      "Atomicité : toutes les écritures du groupe sont validées ou aucune. Une erreur à l'enregistrement doit conduire à annuler aussi la diminution de stock.",
      "Utiliser quantite = quantite - 1 évite de calculer la nouvelle valeur depuis une ancienne lecture applicative. La condition quantite >= 1 empêche cette écriture de retirer un stock absent.",
      "Dans une application, si l'UPDATE ne retourne aucune ligne, ne pas enregistrer la réservation : traiter le refus et annuler. Le fragment montre le cas réussi avec un stock initial de 3.",
      "Une transaction ne rend pas tous les effets externes annulables : un email déjà envoyé ne disparaît pas avec ROLLBACK. Les opérations externes demandent une organisation adaptée."
    ], ["pgTransaction", "pgUpdate", "pgReturning"],
    {
      code: "CREATE TEMP TABLE stock_demo (\n  produit_id INTEGER PRIMARY KEY,\n  quantite INTEGER NOT NULL CHECK (quantite >= 0)\n);\nCREATE TEMP TABLE reservation_demo (\n  id INTEGER PRIMARY KEY,\n  produit_id INTEGER NOT NULL REFERENCES stock_demo(produit_id)\n);\nINSERT INTO stock_demo VALUES (1, 3);\nBEGIN;\nUPDATE stock_demo SET quantite = quantite - 1\nWHERE produit_id = 1 AND quantite >= 1 RETURNING quantite;\n-- Retourne 2 : on peut poursuivre dans ce cas d'exemple.\nINSERT INTO reservation_demo VALUES (10, 1);\nCOMMIT;\n-- En cas d'erreur avant COMMIT : ROLLBACK.",
      exercise: { prompt: "L'INSERT échoue avant COMMIT. Que dois-tu faire et quel stock doit être retrouvé ?", answer: "Exécuter ROLLBACK sur cette transaction ; le stock redevient 3 et aucune réservation n'est validée. Dans un programme, intercepter l'erreur, annuler et libérer la connexion." }
    }),

  lesson("sql", "cp8", "SQL · Index et EXPLAIN",
    "Un index est une structure supplémentaire qui peut accélérer des accès. Pour décider, on observe une requête réelle et son plan. Un petit jeu de trois lignes ne suffit pas à prouver un gain.",
    [
      "Un index sur client_id peut aider à rechercher les commandes d'un client. Le choix dépend de la taille, de la répartition des valeurs et des requêtes.",
      "Il occupe de la place et demande du travail lors des écritures. Indexer chaque colonne n'est pas une stratégie gratuite.",
      "EXPLAIN présente le plan estimé ; EXPLAIN ANALYZE exécute la requête et fournit des mesures. Une écriture accompagnée d'ANALYZE conserve ses effets normaux.",
      "Un parcours séquentiel peut être rationnel pour une petite table ou une requête qui retourne presque tout.",
      "L'exemple est exécutable, mais ne constitue pas un benchmark. Pour comparer, documenter volume, conditions, requête et mesures."
    ], ["pgIndexes", "pgExplain"],
    {
      code: "CREATE TEMP TABLE commande_index_demo (\n  id INTEGER PRIMARY KEY, client_id INTEGER NOT NULL, total NUMERIC\n);\nINSERT INTO commande_index_demo VALUES (10, 1, 30), (11, 1, 20), (12, 2, 15);\nCREATE INDEX ON commande_index_demo(client_id);\nEXPLAIN SELECT * FROM commande_index_demo WHERE client_id = 1;\n-- Le moteur peut préférer lire les trois lignes directement.",
      exercise: { prompt: "Pourquoi « l'index existe » ne prouve-t-il pas que la requête est plus rapide ?", answer: "Le plan peut ne pas l'utiliser, son coût peut dépasser le gain et le jeu peut être trop petit. Mesurer dans des conditions représentatives ; comparer également le coût des écritures." }
    })
];

const typescriptSections = [
  lesson("typescript", "cp1", "TypeScript · Installer, vérifier et exécuter",
    "TypeScript ajoute une analyse statique au JavaScript. Pour essayer les exemples, il faut Node.js, npm et un dossier d'exercice vide. Le paquet typescript fournit le compilateur tsc ; tsx est un outil d'exécution distinct.",
    [
      "Écris exemple.ts avec console.log('Bonjour');. tsc vérifie les types et produit du JavaScript ; Node exécute ce JavaScript.",
      "tsc --noEmit vérifie sans générer les fichiers. tsx exécute le TypeScript, mais ne remplace pas cette vérification complète.",
      "tsconfig.json réunit les options du projet : strict pour les contrôles, target pour la syntaxe cible, module pour le format, rootDir et outDir pour les dossiers.",
      "Le format des modules et leur résolution doivent correspondre au runtime. Pour notre script isolé, les commandes choisissent explicitement CommonJS.",
      "Les annotations et interfaces sont effacées. Le typage statique ne valide pas un JSON reçu au runtime et ne prouve pas la logique métier."
    ], ["tsBasics", "tsConfig", "tsx"],
    {
      code: "# Dans un dossier d'exercice vide, avec Node.js et npm installés :\nnpm init -y\nnpm install --save-dev typescript tsx\n# Crée exemple.ts contenant : console.log('Bonjour');\nnpx tsc exemple.ts --strict --target ES2022 --module commonjs --outDir dist\nnode dist/exemple.js\nnpx tsc exemple.ts --strict --target ES2022 --noEmit\nnpx tsx exemple.ts",
      exercise: { prompt: "Ton script tourne avec tsx mais tsc signale une erreur de type. Les types ont-ils été vérifiés par son exécution ?", answer: "Non. L'exécution et le contrôle statique sont des étapes distinctes. Corriger le contrat ou le code signalé et garder une commande tsc de contrôle dans le projet." }
    }),

  lesson("typescript", "cp3", "TypeScript · Types primitifs, inférence et fonctions",
    "Une annotation précise les valeurs autorisées. L'inférence déduit le type à partir du code. Le petit exemple calcule le prix de plusieurs exemplaires d'un produit.",
    [
      "string, number et boolean sont des types courants. let quantite = 2 est inféré number ; lui affecter ensuite une chaîne viole ce contrat.",
      "Une fonction décrit ses paramètres et son retour : prixTotal(prix: number, quantite: number): number.",
      "Un paramètre facultatif quantite?: number peut être undefined. Une valeur par défaut, comme quantite = 1, définit le comportement lorsqu'il est absent.",
      "void indique un contrat de retour dont la valeur n'est pas utilisée ; never représente un chemin qui ne fournit aucune valeur normale, par exemple une fonction qui lance toujours une erreur.",
      "number inclut les décimaux et NaN ; pour une quantité métier entière positive, il faut également des contrôles à l'exécution."
    ], ["tsEveryday", "tsFunctions"],
    {
      code: "function prixTotal(prix: number, quantite: number = 1): number {\n  if (!Number.isFinite(prix) || prix < 0) throw new Error('Prix invalide');\n  if (!Number.isInteger(quantite) || quantite < 1) throw new Error('Quantité invalide');\n  return prix * quantite;\n}\nconst total = prixTotal(5, 3); // number, valeur 15\n// prixTotal('5', 3); // erreur de type si décommenté",
      exercise: { prompt: "Quel est le type de total ? Que renvoie prixTotal(5) ? Pourquoi prixTotal(5, -1) exige-t-il encore un contrôle ?", answer: "total est inféré number. prixTotal(5) vaut 5 grâce à la quantité par défaut 1. -1 est bien un number, mais ne satisfait pas la règle métier : le contrôle lève une erreur." }
    }),

  lesson("typescript", "cp3", "TypeScript · Tableaux, tuples et readonly",
    "Un tableau décrit une collection d'éléments ; un tuple donne un type à chaque position. readonly décrit ce que l'on peut modifier à travers le contrat.",
    [
      "number[] et Array<number> expriment un tableau de nombres. push('trois') ne correspond pas à son type.",
      "[string, number] décrit deux positions attendues : un nom puis une quantité. L'ordre a un sens ; ce n'est pas seulement un tableau de chaînes ou nombres.",
      "Un accès à une position absente peut donner undefined à l'exécution. noUncheckedIndexedAccess aide à rendre cette possibilité visible dans les types de tableaux.",
      "readonly number[] interdit les méthodes mutantes à travers cette référence. Il ne gèle pas l'objet JavaScript et n'interdit pas toute mutation par une autre référence mutable.",
      "Pour apprendre, distingue le contrat statique d'une opération runtime comme Object.freeze."
    ], ["tsObjects", "tsConfig"],
    {
      code: "const quantites: number[] = [2, 3];\nquantites.push(4);\nconst ligne: [string, number] = ['Cahier', 2];\nconst lectureSeule: readonly number[] = quantites;\n// lectureSeule.push(5); // interdit par le type\nquantites.push(5); // la même collection peut encore changer\nconst [nom, quantite] = ligne;",
      exercise: { prompt: "Pourquoi ['Cahier', 2] typé [string, number] apporte-t-il plus d'information que (string | number)[] ?", answer: "Le tuple impose les types par position et la structure attendue : nom en première position, quantité en seconde. Le tableau union permettrait aussi [2, 'Cahier', 3] et n'exprime pas ces rôles." }
    }),

  lesson("typescript", "cp3", "TypeScript · unknown, guards et validation",
    "Les valeurs reçues de l'extérieur sont incertaines. unknown demande de vérifier avant une opération spécifique ; any laisse passer des opérations sans ce contrôle utile.",
    [
      "Le narrowing affine le type dans une branche, avec typeof, instanceof, une présence de propriété ou un discriminant.",
      "typeof null vaut 'object'. Avant de lire une propriété d'une valeur inconnue, écarter null et vérifier la structure utile.",
      "Une garde de type possède un retour value is Livre. Sa condition runtime doit réellement correspondre au contrat annoncé.",
      "Une assertion as Livre ne vérifie rien à l'exécution. Les contrôles de format et les règles métier restent explicites.",
      "L'exemple reçoit son JSON dans l'extrait : id doit être un entier positif et titre une chaîne non vide. Il valide ces champs, sans affirmer que tout objet externe est fiable."
    ], ["tsNarrowing", "tsFunctions"],
    {
      code: "interface Livre { id: number; titre: string }\nfunction estLivre(value: unknown): value is Livre {\n  return typeof value === 'object' && value !== null\n    && 'id' in value && typeof value.id === 'number'\n    && Number.isInteger(value.id) && value.id > 0\n    && 'titre' in value && typeof value.titre === 'string'\n    && value.titre.trim().length > 0;\n}\nconst data: unknown = JSON.parse('{\"id\":1,\"titre\":\"Le Phare\"}');\nif (estLivre(data)) console.log(data.titre.toUpperCase());",
      exercise: { prompt: "La valeur { id: '1', titre: 'Le Phare' } passe-t-elle la garde ? Pourquoi ne pas seulement écrire as Livre ?", answer: "Non, id est une chaîne. L'assertion ne convertirait ni ne vérifierait cette valeur. La garde exécute des contrôles et permet d'utiliser le type seulement dans la branche validée." }
    }),

  lesson("typescript", "cp3", "TypeScript · Objets, interface et type",
    "Un contrat d'objet précise ses propriétés. interface et type peuvent tous deux nommer ce contrat ; type peut aussi nommer une union ou un tuple.",
    [
      "interface Lecteur { id: number; nom: string } décrit la structure nécessaire, sans obliger à construire une instance d'une classe.",
      "interface s'étend avec extends ; type peut combiner des objets par intersection avec & et exprimer des unions avec |.",
      "email?: string permet l'absence de propriété ; à la lecture, il faut considérer undefined. email: string | null exige la propriété mais autorise la valeur null.",
      "Une interface peut participer à la fusion de déclarations ; un alias type ne se redéclare pas de la même manière.",
      "La structure typée n'est pas un filtre runtime de propriétés et ne remplace pas les permissions, la validation ou la sélection des champs exposés."
    ], ["tsEveryday", "tsObjects"],
    {
      code: "interface Lecteur {\n  readonly id: number;\n  nom: string;\n  email?: string;\n}\ninterface LecteurInscrit extends Lecteur { actif: boolean }\ntype Role = 'lecteur' | 'administrateur';\nconst lecteur: LecteurInscrit = { id: 1, nom: 'Lina', actif: true };\nconst contact = lecteur.email ?? 'Non fourni';",
      exercise: { prompt: "Peut-on omettre email dans { email: string | null } ? Comment exprimer cette possibilité ?", answer: "Non, cette propriété est requise même si null est permis. Ajouter ? pour autoriser l'absence, par exemple email?: string ou email?: string | null selon le contrat." }
    }),

  lesson("typescript", "cp3", "TypeScript · Unions discriminées et exhaustivité",
    "Une union peut représenter les différents états d'une opération. Le discriminant relie chaque état aux données qui lui appartiennent.",
    [
      "status: 'success' accompagne data ; status: 'error' accompagne error ; status: 'loading' peut ne porter ni l'un ni l'autre.",
      "Tester status restreint la variante : dans la branche succès, data existe avec le type prévu.",
      "Cela évite un contrat où data? et error? autorisent des combinaisons difficiles à interpréter.",
      "Un contrôle never peut faire signaler une variante oubliée lorsqu'on ajoute un nouvel état au type.",
      "Un rôle ou un état typé reste un contrat de développement ; une chaîne reçue du réseau doit encore être validée."
    ], ["tsNarrowing"],
    {
      code: "type Resultat =\n  | { status: 'loading' }\n  | { status: 'success'; data: string[] }\n  | { status: 'error'; error: string };\nfunction afficher(resultat: Resultat): string {\n  switch (resultat.status) {\n    case 'loading': return 'Chargement';\n    case 'success': return resultat.data.join(', ');\n    case 'error': return resultat.error;\n    default: {\n      const impossible: never = resultat;\n      return impossible;\n    }\n  }\n}",
      exercise: { prompt: "Ajoute { status: 'empty' } au type sans ajouter de case. Quel contrôle doit échouer ?", answer: "L'affectation à never dans default : resultat pourrait encore être la variante empty. Ajouter une branche qui décrit son comportement rétablit l'exhaustivité." }
    }),

  lesson("typescript", "cp3", "TypeScript · Génériques et types utilitaires",
    "Un générique conserve une relation entre les types. Les types utilitaires dérivent un contrat à partir d'un autre sans copier toutes ses propriétés.",
    [
      "premier<T>(items: T[]): T | undefined relie le type d'un élément de la liste au type du résultat.",
      "T extends { id: number } exige une propriété utile tout en conservant le type concret reçu. Il ne s'agit pas nécessairement d'héritage entre classes.",
      "Pick choisit des propriétés ; Omit en exclut ; Partial rend les propriétés facultatives ; Readonly interdit les réaffectations à travers ce contrat.",
      "Partial<Pick<Produit, 'nom' | 'prix'>> décrit les champs possibles d'une modification limitée. Il ne supprime pas des propriétés du JSON reçu.",
      "keyof T désigne les noms de propriétés de T. Une contrainte K extends keyof T permet un accès dont la clé est connue du type."
    ], ["tsGenerics", "tsUtility"],
    {
      code: "interface Produit { id: number; nom: string; prix: number }\nfunction premier<T>(items: T[]): T | undefined { return items[0]; }\nfunction lireChamp<T, K extends keyof T>(objet: T, cle: K): T[K] {\n  return objet[cle];\n}\ntype ModificationProduit = Partial<Pick<Produit, 'nom' | 'prix'>>;\nconst produit: Produit = { id: 1, nom: 'Cahier', prix: 5 };\nconst prix = lireChamp(produit, 'prix'); // number\nconst premierProduit = premier([produit]); // Produit | undefined",
      exercise: { prompt: "lireChamp(produit, 'stock') est-il accepté ? Partial<Produit> retirerait-il id d'un objet reçu ?", answer: "stock n'appartient pas aux clés de Produit : l'appel est refusé par le type. Partial ne retire rien au runtime ; pour exclure id du contrat, utiliser Omit ou Pick et contrôler les champs réellement admis." }
    }),

  lesson("typescript", "cp3", "TypeScript · async, erreurs et modules",
    "Une fonction async retourne une promesse. Un module exporte des valeurs ou des types ; un import de type est destiné au compilateur et disparaît à l'exécution.",
    [
      "Promise<number> décrit une réussite qui produit un nombre. Avant await, on possède une promesse ; après await réussi, on possède ce nombre.",
      "try/catch autour d'un await traite un rejet. Sans attendre une promesse, on ne récupère pas son résultat immédiat comme une valeur ordinaire.",
      "Une erreur attrapée peut être unknown : vérifier error instanceof Error avant de lire message.",
      "import type { Produit } from './types' distingue un type d'une valeur runtime. Les extensions et formats d'import doivent suivre la configuration des modules.",
      "L'exemple async ci-dessous est autonome : il simule un calcul réussi sans appeler un serveur."
    ], ["tsEveryday", "tsFunctions", "tsModules", "tsConfig"],
    {
      code: "async function calculerPrix(prix: number): Promise<number> {\n  if (!Number.isFinite(prix) || prix < 0) throw new Error('Prix invalide');\n  return prix * 2;\n}\nasync function afficherPrix(): Promise<string> {\n  try {\n    const resultat = await calculerPrix(5);\n    return String(resultat); // '10'\n  } catch (error: unknown) {\n    return error instanceof Error ? error.message : 'Erreur inconnue';\n  }\n}\nconst promesse = afficherPrix(); // Promise<string>",
      exercise: { prompt: "Pourquoi const resultat = calculerPrix(5); ne donne-t-il pas directement le nombre 10 ?", answer: "La fonction async retourne Promise<number>. Il faut await dans un contexte adapté ou un traitement de promesse pour obtenir le nombre en cas de réussite et traiter l'échec éventuel." }
    })
];
function cards(technology, cp, rows, tag) {
  return rows.map(([question, answer, detail, keys], index) => ({
    id: "course-" + technology + "-" + String(index + 1).padStart(2, "0"),
    cp: typeof cp === "function" ? cp(index) : cp,
    technology, question, answer, detail, tags: [tag], sources: sources(...keys)
  }));
}

// Les 18 premiers identifiants Merise gardent leurs notions initiales.
const meriseCards = cards("merise", index => index >= 40 && index <= 42 ? "cp5" : "cp7", [
  ["Qu'indique un dictionnaire de données pour chaque donnée ?", "Son sens, son domaine, ses règles et un exemple.", "Pour quantite : nombre d'unités d'un produit sur une ligne de commande, entier obligatoire strictement positif, exemple 3. Le type SQL est ensuite un choix physique.", ["meriseBook", "mocodo"]],
  ["Comment lire 0,1 en cardinalité Merise ?", "Une occurrence participe à zéro ou un lien.", "Un lecteur peut n'avoir aucune carte active, ou en avoir une seule. Le minimum indique l'obligation ; le maximum fixe la limite.", ["meriseCourse"]],
  ["Une FK ligne.commande_id impose-t-elle une ligne dans chaque commande ?", "Non. Elle contrôle le parent de chaque ligne, pas l'existence d'une ligne par commande.", "Pour « une commande validée contient au moins une ligne », vérifier ce minimum lors de la validation ou par un mécanisme adapté. La FK seule ne l'exprime pas.", ["mocodo", "pgConstraints"]],
  ["CLIENT (0,n) — passer — COMMANDE (1,1) : qui porte la référence ?", "COMMANDE porte client_id, référence vers CLIENT.", "Une commande appartient à un seul client ; plusieurs commandes peuvent référencer le même client. Lire les deux sens avant de traduire.", ["mocodo"]],
  ["Quelles contraintes rendent le client d'une commande obligatoire et existant ?", "Une FK sur client_id avec NOT NULL.", "La FK contrôle l'existence du parent ; NOT NULL interdit l'absence. Ni l'une ni l'autre n'impose des commandes à tous les clients.", ["pgConstraints"]],
  ["Quelle contrainte limite à un dossier par personne quand DOSSIER porte personne_id ?", "UNIQUE sur la FK personne_id.", "NOT NULL décide séparément si le propriétaire est obligatoire. PERSONNE peut rester sans dossier dans une relation 0,1 côté personne.", ["mocodo", "pgConstraints"]],
  ["Pourquoi la quantité commandée n'appartient-elle pas simplement à PRODUIT ?", "Elle décrit un produit dans une commande précise.", "La quantité 3 est portée par le lien ou la ligne COMMANDE/PRODUIT. Le même produit peut être commandé en une autre quantité dans une autre commande.", ["mocodo"]],
  ["Pourquoi le couple lecteur/exemplaire peut-il ne pas identifier un emprunt ?", "Le même lecteur peut emprunter le même exemplaire plusieurs fois.", "Un id_emprunt propre ou une identification d'occurrence adaptée distingue les événements. Le couple seul interdirait le second emprunt.", ["mocodo"]],
  ["Quel risque présente le stockage d'un résultat déjà calculable depuis d'autres données ?", "Les versions stockées peuvent devenir incohérentes.", "Stocker quantité, prix courant et total calculé impose de synchroniser les modifications. Un prix au moment de la commande peut en revanche être un fait historique voulu : expliciter le besoin.", ["meriseBook"]],
  ["Pourquoi éviter une cellule produits = 'P1,P2' pour une commande ?", "Elle rassemble plusieurs faits qui doivent être reliés et contrôlés séparément.", "LIGNE_COMMANDE conserve une ligne par produit avec sa quantité. On peut alors identifier, référencer et interroger chaque fait.", ["normal"]],
  ["EMPLOYE(id, departement_id, nom_departement) : quelle donnée séparer ?", "nom_departement dans DEPARTEMENT, s'il dépend du département.", "La dépendance departement_id → nom_departement répète le même fait sur chaque employé. Garder la référence dans EMPLOYE.", ["normal"]],
  ["Donne une anomalie de mise à jour provoquée par une donnée répétée.", "Un département change de nom dans une ligne d'employé mais conserve son ancien nom dans les autres.", "Stocker le nom courant dans DEPARTEMENT permet de modifier le fait à un endroit adapté, au lieu de corriger chaque répétition.", ["normal"]],
  ["Quels éléments composent « En tant que… je souhaite… afin de… » ?", "Acteur, besoin ou action, objectif ou bénéfice.", "Exemple : en tant que lecteur inscrit, je souhaite voir mes prêts en cours, afin de savoir quels livres rendre. L'action n'est pas une liste de technologies.", ["stories"]],
  ["Quel critère rend la recherche d'un livre vérifiable ?", "Avec un catalogue connu, une requête précise renvoie les titres attendus.", "Avec « Le Phare » et « Les Jardins », rechercher « Phare » doit renvoyer « Le Phare ». Prévoir aussi aucun résultat. « La recherche est bien faite » ne suffit pas.", ["stories"]],
  ["Comment préciser le besoin « retrouver mes anciens emprunts » en règle de gestion ?", "Chaque nouvel emprunt conserve un événement distinct dans l'historique.", "Le besoin donne l'utilité ; la règle décide comment les faits doivent rester disponibles. Le modèle peut ensuite introduire EMPRUNT avec identité, dates et références.", ["meriseCourse"]],
  ["Lecteur et administrateur imposent-ils deux entités Merise ?", "Non. Ce sont d'abord des rôles d'utilisation.", "Une même personne peut jouer plusieurs rôles. Le modèle des données dépend des informations et identités à conserver, pas du nombre d'acteurs dessinés.", ["meriseCourse", "uml"]],
  ["Une user story suffit-elle pour choisir toutes les cardinalités ?", "Non. Il faut préciser obligations, absences et répétitions.", "« Emprunter un livre » ne dit pas si plusieurs copies existent, ni comment conserver les emprunts successifs. Poser ces questions avant de dessiner.", ["stories", "meriseCourse"]],
  ["Quel chemin relie un besoin à son stockage ?", "Besoins et règles → données → MCD → MLD → MPD.", "Pour des prêts : identifier lecteurs, copies et événements ; lire les cardinalités ; traduire les références ; choisir les types et contraintes du SGBD.", ["meriseBook", "mocodo"]],
  ["Qu'est-ce qu'une entité-type ?", "Une catégorie d'objets métier ayant une identité et des propriétés.", "LECTEUR décrit la catégorie ; le lecteur numéro 17 nommé Lina en est une occurrence. Une entité-type n'est pas encore une table physique.", ["meriseCourse"]],
  ["Dans LECTEUR(id, nom), distingue attribut et valeur.", "nom est l'attribut ; « Lina » est une valeur pour une occurrence.", "id et nom décrivent les propriétés. Une occurrence concrète peut être LECTEUR(17, Lina).", ["meriseCourse"]],
  ["Un id technique interdit-il deux exemplaires avec le même numéro d'inventaire ?", "Non. Une unicité métier supplémentaire peut être nécessaire.", "Deux lignes peuvent posséder des id différents et le même numero_inventaire. UNIQUE sur ce numéro exprime l'interdiction de doublon métier.", ["pgConstraints", "mocodo"]],
  ["Que représentent le minimum et le maximum d'une cardinalité ?", "L'obligation de participer et la limite des participations d'une occurrence.", "0,n autorise aucune participation ; 1,n impose au moins une. Lire la cardinalité à partir de l'entité du côté où elle est écrite.", ["meriseCourse"]],
  ["Que signifie COMMANDE (1,1) vers CLIENT ?", "Chaque commande est liée à exactement un client.", "Cela ne dit pas qu'un client possède une seule commande : sa propre cardinalité doit être lue séparément.", ["mocodo"]],
  ["Que permet CLIENT (0,n) vers COMMANDE ?", "Un client peut avoir zéro, une ou plusieurs commandes.", "Un client nouvellement inscrit sans achat est valide. Cette cardinalité ne fixe pas le nombre de clients d'une commande.", ["mocodo"]],
  ["Que signifie COMMANDE_VALIDEE (1,n) vers LIGNE ?", "Toute commande validée possède au moins une ligne.", "Un brouillon vide peut exiger un autre état ou une règle de validation. Une FK depuis LIGNE ne garantit pas ce minimum côté commande.", ["meriseCourse", "pgConstraints"]],
  ["Quelle différence entre association binaire et ternaire ?", "Elles relient respectivement deux et trois types d'entités dans un même fait.", "Une affectation enseignant/matière/classe précise les trois participants simultanément. Elle ne se réduit pas automatiquement à des liens par paires.", ["mocodo"]],
  ["Pourquoi trois associations binaires peuvent-elles remplacer incorrectement une ternaire ?", "Leur reconstruction peut inventer un triplet absent.", "Avec Alice–SQL–C1, Alice–JS–C2 et Bob–SQL–C2, les couples autorisent aussi Alice–SQL–C2, qui n'était pas enregistré. Conserver le triplet ou démontrer une décomposition sans perte.", ["decomposition", "mocodo"]],
  ["Pourquoi une copie de livre peut-elle avoir cardinalité 0,n vers EMPRUNT malgré un seul prêt actif ?", "Le modèle conserve plusieurs emprunts successifs dans l'historique.", "Limiter les prêts actifs simultanés est une contrainte temporelle distincte. 0,1 sur tout l'historique interdirait le deuxième prêt de la copie.", ["meriseCourse"]],
  ["Que doit montrer un MCD de bibliothèque minimal ?", "Objets métier, attributs, identifiants, associations et cardinalités.", "LIVRE, EXEMPLAIRE, LECTEUR et EMPRUNT permettent de distinguer un titre, ses copies et les événements de prêt. Le MCD précède le choix des types PostgreSQL.", ["mocodo"]],
  ["Qu'ajoute le MLD relationnel par rapport au MCD ?", "La traduction en relations avec clés et références.", "Une relation 1:n CLIENT/COMMANDE devient notamment client_id dans COMMANDE. Le MLD donne une structure logique prête à être implantée.", ["mocodo"]],
  ["Qu'est-ce qui appartient au MPD ?", "Les choix concrets du SGBD : tables, types, contraintes et index.", "INTEGER, NUMERIC, NOT NULL et FOREIGN KEY font partie d'une implantation PostgreSQL. Ils ne sont pas la définition du besoin utilisateur.", ["mocodo", "pgConstraints"]],
  ["Comment traduire COMMANDE/PRODUIT en n:n avec quantité ?", "Créer LIGNE_COMMANDE avec les deux références et quantite.", "Une clé (commande_id, produit_id) convient si un produit apparaît une seule fois par commande. Sinon préciser l'identification des lignes.", ["mocodo"]],
  ["Que signifie X → Y en dépendance fonctionnelle ?", "Deux lignes égales sur X doivent être égales sur Y.", "reference_produit → libelle vient d'une règle métier valable pour toutes les données admissibles, pas seulement des exemples actuels.", ["normal"]],
  ["reference → prix implique-t-il prix → reference ?", "Non.", "Deux produits peuvent avoir le même prix. La dépendance a un sens ; sa réciproque demande une règle supplémentaire.", ["normal"]],
  ["Quelle différence entre superclé et clé candidate ?", "Une clé candidate est une superclé minimale.", "{id} peut identifier toute la ligne ; {id, nom} aussi, mais nom est superflu. La seconde combinaison n'est pas minimale.", ["normal", "decomposition"]],
  ["Une table est en 1NF et toutes ses clés candidates sont simples : peut-elle violer la 2NF par dépendance partielle ?", "Non, il n'existe pas de partie propre non vide de ces clés.", "Examiner toutes les clés candidates. Une PK simple ajoutée à une table ne prouve pas que les autres clés candidates soient elles aussi simples.", ["normal", "decomposition"]],
  ["Quelle transformation aide à obtenir la 1NF pour une liste de produits ?", "Conserver un fait de ligne séparé pour chaque produit.", "Éviter Produits = P1,P2 et Quantités = 2,3. Deux lignes relient clairement P1 à 2 et P2 à 3.", ["normal"]],
  ["Quelle dépendance viole la 2NF avec une clé (commande_id, produit_id) ?", "Un attribut non premier déterminé par une partie stricte de cette clé.", "produit_id → libelle_produit est partielle ; déplacer le libellé dans PRODUIT. quantite dépend du couple et reste dans LIGNE.", ["normal"]],
  ["Quelle est l'intuition de la 3NF dans EMPLOYE/DÉPARTEMENT ?", "Éviter de répéter un fait non clé déterminé transitivement.", "id_employe → departement_id → nom_departement : placer le nom dans DEPARTEMENT. Formellement, chaque DF non triviale X → A exige X superclé ou A premier.", ["normal", "decomposition"]],
  ["Quelle condition impose BCNF à une DF non triviale X → A ?", "X doit être une superclé.", "La 3NF autorise aussi un attribut A premier lorsque X n'est pas superclé. BCNF retire cette possibilité ; superclé ne signifie pas forcément clé minimale.", ["decomposition"]],
  ["Quel est le sens de la flèche « include » entre cas d'utilisation ?", "Du cas qui inclut vers le cas inclus.", "Dans notre scénario : Enregistrer un prêt → Vérifier le droit d'emprunter. Le comportement de vérification est incorporé à celui du prêt.", ["uml"]],
  ["Quel est le sens de la flèche « extend » et le rôle du cas de base ?", "De l'extension vers le cas étendu ; le cas de base reste complet sans elle.", "Imprimer un reçu → Enregistrer un prêt, au point confirmation si le reçu est demandé. Préciser point d'extension et condition de l'exemple.", ["uml"]],
  ["Un diagramme de cas d'utilisation remplace-t-il le MCD ?", "Non. Il décrit les services et acteurs, tandis que le MCD décrit les données métier.", "Bibliothécaire → Enregistrer un prêt exprime une interaction. LECTEUR, EXEMPLAIRE et EMPRUNT avec cardinalités expriment le modèle de données.", ["uml", "meriseCourse"]],
  ["Que signifie une décomposition relationnelle sans perte ?", "La jointure des relations obtenues reconstitue exactement les tuples initiaux.", "Elle ne doit ni supprimer des faits ni inventer des combinaisons. Préserver les dépendances est une autre propriété à examiner.", ["decomposition"]]
], "Merise");

// Les 12 premiers identifiants SQL gardent leurs notions initiales.
const sqlCards = cards("sql", "cp8", [
  ["Un client possède trois commandes : combien de lignes produit sa jointure avec commande ?", "Trois lignes si chaque commande correspond une fois.", "Une ligne représente ici un couple client/commande. Le nom du client peut apparaître trois fois sans être un doublon erroné.", ["pgJoin"]],
  ["Après LEFT JOIN, où filtrer les commandes pour garder les clients sans correspondance ?", "Dans ON, si cette conservation est le comportement souhaité.", "ON co.client_id = c.id AND co.total >= 25 garde tous les clients. WHERE co.total >= 25 retire les lignes dont la condition n'est pas vraie, dont les colonnes NULL.", ["pgJoin"]],
  ["Quel compteur donne zéro pour un client sans commande après LEFT JOIN ?", "COUNT(co.id), si id est non NULL pour les commandes existantes.", "COUNT(*) compte sa ligne conservée et donnerait un. COUNT(colonne) ignore les NULL.", ["pgAggregate"]],
  ["Pourquoi deux commandes jointes à trois étiquettes peuvent-elles gonfler COUNT ?", "Les correspondances peuvent multiplier les lignes.", "COUNT(DISTINCT commande_id) peut compter les commandes distinctes. Un SUM exige une analyse séparée : DISTINCT sur le montant peut retirer deux vrais montants égaux.", ["pgJoin", "pgAggregate"]],
  ["Pourquoi email = NULL ne trouve-t-il pas les absences ?", "La comparaison donne inconnu ; utiliser IS NULL.", "WHERE conserve les conditions vraies. Pour les valeurs présentes, employer IS NOT NULL.", ["pgNull"]],
  ["Que vaut COALESCE(0, 10) ?", "0.", "COALESCE choisit la première valeur non NULL ; zéro n'est pas une absence SQL.", ["pgConditional"]],
  ["Quel mot-clé teste l'existence d'au moins une commande d'un client ?", "EXISTS avec une sous-requête liée au client.", "WHERE EXISTS (SELECT 1 FROM commande co WHERE co.client_id = c.id). Le client apparaît une fois, même avec plusieurs commandes.", ["pgSubquery"]],
  ["Quel piège présente NOT IN lorsque la sous-requête peut contenir NULL ?", "La condition peut devenir inconnue.", "Pour chercher les clients sans commande, NOT EXISTS avec la condition de lien exprime l'absence sans ce piège de comparaison.", ["pgSubquery"]],
  ["Quel risque présente UPDATE produit SET prix = 10 sans WHERE ?", "Modifier le prix de tous les produits.", "Préciser les lignes visées et vérifier leur nombre. Zéro ligne modifiée n'est pas automatiquement une erreur SQL.", ["pgUpdate"]],
  ["Pourquoi les opérations d'une transaction doivent-elles utiliser la même connexion ?", "La transaction est attachée à cette connexion.", "Un pool peut fournir plusieurs connexions indépendantes. Utiliser le client transactionnel fourni par la bibliothèque ou l'ORM pour le groupe d'opérations.", ["pgTransaction"]],
  ["Pourquoi LIMIT 10 seul ne fixe-t-il pas dix lignes prévisibles ?", "Sans ORDER BY, l'ordre n'est pas garanti.", "Un tri stable départage les égalités, par exemple date puis id. LIMIT réduit ensuite ce résultat.", ["pgOrder", "pgLimit"]],
  ["Comment récupérer l'id de sa ligne insérée dans PostgreSQL ?", "INSERT ... RETURNING id.", "MAX(id) peut correspondre à une autre insertion. RETURNING récupère une valeur de la ligne effectivement créée par cette instruction.", ["pgReturning"]],
  ["Quelle est la différence entre schéma et contenu d'une table ?", "Le schéma définit colonnes, types et contraintes ; le contenu est l'ensemble des lignes.", "CLIENT(id, nom) décrit une structure ; CLIENT(1, Alice) est une ligne concrète.", ["pgConstraints", "pgPopulate"]],
  ["À quoi sert WHERE ?", "À conserver les lignes dont la condition vaut vrai.", "WHERE total >= 20 retient les commandes de 20 et 30, pas celle de 15. Une condition inconnue liée à NULL n'est pas retenue.", ["pgSelect"]],
  ["Quelle différence entre WHERE et HAVING ?", "WHERE filtre les lignes avant les groupes ; HAVING filtre les groupes calculés.", "HAVING COUNT(co.id) >= 2 permet de sélectionner les clients ayant au moins deux commandes.", ["pgAggregate"]],
  ["Que donne AVG sur les valeurs 10, NULL et 20 ?", "15, car l'absence est ignorée.", "AVG(COALESCE(valeur, 0)) donne 10 sur ces trois lignes. Ces requêtes expriment des règles différentes.", ["pgAggregate", "pgConditional"]],
  ["Une FK sur commande.client_id empêche-t-elle une référence à un client inexistant ?", "Oui, pour une valeur de référence non NULL et une contrainte valide.", "Ajouter NOT NULL si aucune absence n'est admise. La FK exprime l'intégrité référentielle, pas une permission d'utilisateur.", ["pgConstraints"]],
  ["CHECK (prix >= 0) interdit-il NULL dans PostgreSQL ?", "Non.", "CHECK accepte une expression vraie ou inconnue. Ajouter NOT NULL pour rendre le prix obligatoire.", ["pgConstraints"]],
  ["Pourquoi les valeurs d'entrée doivent-elles passer dans des paramètres SQL ?", "Pour séparer les valeurs de la structure de la requête.", "PREPARE ... WHERE id = $1 reçoit un identifiant comme valeur. Les noms de colonnes dynamiques exigent une sélection autorisée, pas la même paramétrisation.", ["pgPrepare"]],
  ["Que fait ROLLBACK avant COMMIT ?", "Il annule les modifications non validées de la transaction.", "Il ne retire pas un email déjà envoyé ni un effet externe. En cas de réservation échouée, le stock et la réservation doivent être traités comme un groupe.", ["pgTransaction"]],
  ["Quel coût ajoute un index ?", "Du stockage et du travail supplémentaire lors des écritures.", "Il peut accélérer un accès ciblé, mais le moteur peut préférer un parcours séquentiel sur une petite table.", ["pgIndexes"]],
  ["Quelle différence entre EXPLAIN et EXPLAIN ANALYZE ?", "Le premier expose un plan estimé ; le second exécute et mesure.", "ANALYZE sur une instruction d'écriture ne neutralise pas ses effets. Prévoir le contexte d'exécution adapté.", ["pgExplain"]]
], "SQL");

// Les 16 premiers identifiants TypeScript gardent leurs notions initiales.
const typescriptCards = cards("typescript", index => index < 3 || index === 15 ? "cp1" : "cp3", [
  ["Que deviennent les annotations et interfaces après compilation TypeScript ?", "Elles sont effacées du JavaScript exécuté.", "Le contrôle statique ne valide pas les entrées externes au runtime. Une règle comme quantité entière positive exige un contrôle réel.", ["tsBasics"]],
  ["Quelle commande complète tsx pour vérifier les types sans produire les fichiers ?", "npx tsc --noEmit, avec la configuration du projet.", "tsx exécute rapidement le TypeScript ; il ne fait pas la vérification complète des types à lui seul.", ["tsx", "tsConfig"]],
  ["À quoi sert strict: true dans tsconfig ?", "À activer une famille de contrôles de types plus stricts.", "Cela renforce notamment les contrôles d'absences et de any implicites. Ce n'est ni une preuve de test ni une validation métier.", ["tsConfig"]],
  ["Avec let quantite = 2, peut-on ensuite affecter 'trois' ?", "Non : quantite est inférée number.", "L'inférence évite des annotations évidentes sans rendre la variable sans type. Une union doit être intentionnelle et traitée correctement.", ["tsEveryday"]],
  ["Quelle différence entre any et unknown ?", "unknown oblige à vérifier avant une opération spécifique ; any retire ces contrôles utiles.", "Une valeur unknown peut contenir une chaîne, un objet ou autre chose. typeof value === 'string' autorise les méthodes de chaîne dans cette branche.", ["tsFunctions", "tsNarrowing"]],
  ["typeof value === 'object' exclut-il null ?", "Non. typeof null vaut 'object'.", "Tester value !== null avant de lire une propriété. Un tableau est aussi un objet et demande un contrôle adapté si sa structure importe.", ["tsNarrowing"]],
  ["Comment appeler une méthode de Date sur un paramètre string | Date ?", "Restreindre le type, par exemple avec instanceof Date.", "La branche Date autorise les méthodes de Date ; l'autre branche peut traiter la chaîne. Une union n'autorise pas toutes les méthodes de tous ses membres sans contrôle.", ["tsNarrowing"]],
  ["Pour nommer 'lecteur' | 'administrateur', utilise-t-on directement une interface ou type ?", "Un alias type, qui peut nommer une union.", "Une interface décrit notamment un contrat d'objet. Les deux outils peuvent nommer des structures d'objets, avec des capacités différentes.", ["tsEveryday"]],
  ["Que faut-il prévoir à la lecture de email?: string ?", "La possibilité d'obtenir undefined.", "email: string | null exige la propriété et autorise null ; la propriété facultative exprime une autre absence.", ["tsObjects"]],
  ["Comment restreindre une union success / error ?", "Tester son discriminant, par exemple status.", "Si status vaut success, TypeScript donne accès à data dans cette variante. La variante error peut porter error sans rendre tous les champs facultatifs.", ["tsNarrowing"]],
  ["Quel lien conserve premier<T>(items: T[]): T | undefined ?", "Le type de l'élément reçu et celui du résultat.", "Une liste de Produit donne Produit | undefined ; une liste de nombres donne number | undefined. any ne conserverait pas ce contrat.", ["tsGenerics"]],
  ["Que signifie T extends { id: number } ?", "Le type fourni doit posséder un id numérique.", "La fonction peut utiliser ce champ tout en conservant les autres informations du type concret. Il s'agit d'une contrainte générique, pas forcément d'héritage de classe.", ["tsGenerics"]],
  ["Quelle différence entre Partial<Produit> et Pick<Produit, 'nom'> ?", "Partial rend les propriétés facultatives ; Pick sélectionne les propriétés nommées.", "Partial<Pick<Produit, 'nom'>> décrit un nom facultatif. Aucun de ces types ne retire des propriétés à un objet reçu au runtime.", ["tsUtility"]],
  ["Quel retour déclare une fonction async qui produit une liste de livres ?", "Promise<Livre[]>.", "Avant await, on possède une promesse. Après réussite, await fournit Livre[]. Une erreur peut rejeter cette promesse.", ["tsEveryday"]],
  ["Comment lire message sur une erreur unknown dans catch ?", "Vérifier error instanceof Error.", "On peut lancer une autre valeur qu'une instance d'Error. Prévoir une branche générique plutôt qu'une assertion aveugle.", ["tsFunctions", "tsNarrowing"]],
  ["Pourquoi écrire import type pour un type avec verbatimModuleSyntax ?", "Pour marquer un import destiné au typage et effacé à l'exécution.", "Une interface ne fournit pas une valeur runtime. Les formats et extensions d'import suivent aussi la configuration des modules.", ["tsModules", "tsConfig"]],
  ["Que garantit number[] sur les éléments du tableau ?", "Le contrat attend des nombres.", "Il n'impose ni une longueur fixe ni des valeurs métier positives. Un accès hors du tableau peut donner undefined à l'exécution.", ["tsObjects"]],
  ["Quelle information apporte [string, number] par rapport à (string | number)[] ?", "Des types précis pour les deux positions attendues.", "Dans ['Cahier', 2], la première position est le nom et la deuxième la quantité. Le tableau union ne fixe pas cet ordre ni cette structure.", ["tsObjects"]],
  ["readonly gèle-t-il automatiquement un objet JavaScript ?", "Non.", "Il limite les écritures à travers le contrat statique. Une autre référence mutable peut encore modifier l'objet ; le comportement runtime est distinct.", ["tsObjects"]],
  ["Pourquoi -1 peut-il satisfaire number mais être une quantité invalide ?", "Le type numérique est plus large que la règle métier.", "Contrôler Number.isInteger(quantite) et quantite >= 1 si les unités positives sont requises. Les types ne contiennent pas automatiquement toutes ces bornes.", ["tsEveryday"]],
  ["Que signifie un retour de garde value is Livre ?", "Le contrôle affirme qu'une valeur validée satisfait le contrat Livre.", "Sa condition runtime doit réellement contrôler les propriétés et règles annoncées. Une annotation de prédicat incorrecte peut tromper le compilateur.", ["tsNarrowing"]],
  ["À quoi sert never dans la branche par défaut d'une union discriminée ?", "À faire vérifier qu'aucune variante ne reste possible.", "Si un nouvel état empty est ajouté sans traitement, l'affectation à never échoue et révèle la branche oubliée.", ["tsNarrowing"]],
  ["Que décrit keyof Produit ?", "L'union des noms de propriétés de Produit.", "Avec id, nom et prix, une clé stock n'appartient pas au contrat. K extends keyof T permet un accès de propriété cohérent.", ["tsGenerics"]],
  ["Une assertion as Livre convertit-elle un id chaîne en nombre ?", "Non. Elle n'exécute aucune conversion ni validation.", "Pour une entrée { id: '1' }, décider d'une conversion explicite ou refuser la donnée, puis vérifier les règles attendues.", ["tsEveryday"]]
], "TypeScript");

// Position de la fiche dans les sections de la technologie, par numéro de carte.
// Les groupes ci-dessous suivent les identifiants stables course-<techno>-01, etc.
const lessonIndexes = {
  merise: [
    4, 7, 11, 10, 13, 12, 6, 6, 4, 15, 17, 17,
    1, 1, 9, 1, 1, 0,
    5, 5, 5, 7, 7, 7, 7, 8, 8, 9, 9, 10, 13, 11,
    14, 14, 14, 16, 15, 16, 17, 18, 3, 3, 2, 18
  ],
  sql: [
    2, 2, 4, 4, 3, 3, 5, 5, 6, 7, 1, 6,
    0, 1, 4, 3, 7, 6, 6, 7, 8, 8
  ],
  typescript: [
    0, 0, 0, 1, 3, 3, 3, 4, 4, 5, 6, 6, 6, 7, 7, 7,
    2, 2, 2, 1, 3, 5, 6, 3
  ]
};

function linkLesson(card) {
  const number = Number(card.id.split("-").at(-1));
  return { ...card, lessonIndex: lessonIndexes[card.technology][number - 1] };
}

export const courseSections = [...meriseSections, ...sqlSections, ...typescriptSections];
export const courseCards = [...meriseCards, ...sqlCards, ...typescriptCards].map(linkLesson);
export const courseSources = Object.values(references);
