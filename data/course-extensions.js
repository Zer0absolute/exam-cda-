/**
 * Compléments fondés sur les exercices de formation présents dans le workspace.
 * Ces supports décrivent ce qui a été étudié ; ils ne prouvent pas l'auteur du
 * code, une maîtrise complète ou un déploiement personnel en production.
 * Les extraits courts sont des exemples pédagogiques adaptés aux exercices.
 */
export const courseSections = [
  {
    cp: "cp2", technology: "react",
    section: {
      title: "React · props, état et formulaires",
      body: "Dans les challenges OConverter et Blog, l'interface est découpée en composants et son affichage dépend de l'état.",
      bullets: [
        "Une prop est fournie par le parent ; useState conserve une valeur du composant et fournit sa fonction de mise à jour.",
        "Pour un champ contrôlé, relier value à l'état et onChange à sa mise à jour. Le formulaire peut ensuite lire cette même valeur.",
        "Si plusieurs composants partagent une information, placer l'état dans leur ancêtre commun puis transmettre valeurs et callbacks.",
        "Éviter de modifier directement un tableau ou un objet d'état : produire une nouvelle valeur. Pour une mise à jour fondée sur la précédente, utiliser un updater."
      ],
      code: "const [search, setSearch] = useState('');\n<input\n  value={search}\n  onChange={(event) => setSearch(event.target.value)}\n/>\n// Le filtre affiché peut être calculé à partir de search."
    }
  },
  {
    cp: "cp2", technology: "react",
    section: {
      title: "React · appels d'API et navigation",
      body: "Le Blog SC06E04 travaille fetch/useEffect ; SC07E01 introduit BrowserRouter, Routes et les paramètres d'URL.",
      bullets: [
        "Prévoir chargement, succès, résultat vide et erreur. Avec fetch, vérifier response.ok avant de lire le résultat attendu.",
        "useEffect synchronise avec un système extérieur. Déclarer les valeurs réactives utilisées et nettoyer les abonnements ou requêtes devenus inutiles.",
        "BrowserRouter fournit le contexte de navigation ; Routes sélectionne une Route. useParams lit par exemple le slug de /post/:slug.",
        "Un slug absent ou inconnu exige un traitement explicite. Dans l'exercice, Navigate redirige vers l'accueil avec replace. Le routage client ne protège pas les données de l'API."
      ],
      code: "<Routes>\n  <Route path=\"/post/:slug\" element={<PostPage posts={posts} />} />\n</Routes>\n// Dans PostPage :\nconst { slug } = useParams<{ slug: string }>();"
    }
  },
  {
    cp: "cp6", technology: "mongodb",
    section: {
      title: "Microservices · logs et service de fichiers",
      body: "La saison SC04 sépare l'API métier, un service de logs MongoDB et un service de fichiers Express.",
      bullets: [
        "Un service possède une responsabilité et un contrat. Le découpage ajoute des appels réseau, des configurations et des pannes à traiter.",
        "Winston associe niveau, date, message et contexte. Ses transports peuvent écrire un fichier ou transmettre les logs par HTTP au service dédié.",
        "Un log utile identifie le service et la requête ; il évite mots de passe, tokens et données personnelles inutiles. Prévoir rotation, conservation et droits d'accès.",
        "Formidable parse multipart/form-data ; le service fichiers stocke les fichiers et leurs métadonnées. Vérifier taille, type réel, nom, accès et erreurs : renommer un fichier ne suffit pas à le sécuriser."
      ],
      code: "// Exemple adapté au logger OQuiz\nlogger.error('Échec du traitement', {\n  service: 'oquiz-api',\n  requestId: 'requete-exemple'\n});\n// Ne pas ajouter de token ni de mot de passe."
    }
  },
  {
    cp: "cp8", technology: "mongodb",
    section: {
      title: "MongoDB · documents, filtres et agrégations",
      body: "Le service de logs manipule une collection logs avec le pilote MongoDB et valide ses entrées avec Zod.",
      bullets: [
        "Collection ≈ ensemble de documents ; un document contient des champs et peut imbriquer objets ou tableaux. Un schéma flexible conserve des règles de validation.",
        "findOne recherche un document ; find retourne un curseur ; toArray matérialise les résultats. Valider l'identifiant avant new ObjectId(id).",
        "Un filtre peut combiner service, niveau et bornes de dates ($gte/$lte). Ajouter tri, limite et pagination ; choisir les index selon les requêtes observées.",
        "Un pipeline aggregate transforme les données par étapes : $match filtre puis $group agrège. MongoDB propose aussi $lookup ; le choix imbrication/référence dépend du besoin."
      ],
      code: "// Exemple pédagogique : erreurs et dates à adapter\nconst logs = await collection.find({ level: 'error' })\n  .sort({ timestamp: -1 })\n  .limit(20)\n  .toArray();"
    }
  },
  {
    cp: "cp3", technology: "graphql",
    section: {
      title: "GraphQL · schéma Apollo et resolvers",
      body: "OResto associe Apollo Server, des fichiers de schéma .gql et des fonctions de résolution.",
      bullets: [
        "Le schéma expose des types et des champs. Query décrit les lectures ; Mutation les opérations de modification.",
        "Le client sélectionne les champs utiles. Restaurant peut exposer name et une city imbriquée ; le serveur résout les champs demandés.",
        "Un resolver reçoit notamment parent et args : parent relie les champs imbriqués, args contient les arguments de la requête.",
        "GraphQL valide la requête contre son schéma, mais les règles métier et les permissions restent à implémenter. Dans la copie OResto observée, les resolvers travaillent sur des tableaux en mémoire."
      ],
      code: "query Restaurant($id: Int!) {\n  restaurant(id: $id) {\n    name\n    city { name }\n  }\n}\n// Variables séparées : { \"id\": 1 }"
    }
  },
  {
    cp: "cp8", technology: "graphql",
    section: {
      title: "OResto · accès PostgreSQL avec pg",
      body: "Le dépôt contient également des datamappers et un Pool pg ; leur présence ne prouve pas qu'ils sont reliés à tous les resolvers.",
      bullets: [
        "Un datamapper regroupe les opérations d'accès aux données. Il sépare la requête SQL du traitement exposé à l'API.",
        "Avec pg, transmettre text et values : $1 représente une valeur. Le résultat contient rows, à distinguer du résultat GraphQL.",
        "Les paramètres protègent les valeurs, pas les noms de tables/colonnes. Un nom dynamique doit venir d'une liste autorisée.",
        "Prévoir absence, contrainte, panne et permissions. Si chaque restaurant déclenche une requête pour sa ville, surveiller le problème N+1 et regrouper les accès quand nécessaire."
      ],
      code: "const result = await pool.query({\n  text: 'SELECT id, name FROM restaurant WHERE id = $1',\n  values: [validatedId]\n});\nconst restaurant = result.rows[0] ?? null;"
    }
  },
  {
    cp: "cp2", technology: "realtime",
    section: {
      title: "Socket.IO · événements de l'interface",
      body: "L'atelier CollabScript transmet le texte de l'éditeur avec updateScript et affiche userCount.",
      bullets: [
        "io() ouvre une connexion Socket.IO au serveur ; socket.emit émet un événement et socket.on enregistre son écouteur.",
        "L'événement input transmet le texte courant ; l'écouteur updateScript met à jour éditeur et aperçu. Éviter qu'une mise à jour distante déclenche une boucle d'émissions.",
        "Afficher une donnée reçue avec textContent quand on attend du texte. Un message temps réel reste une entrée non fiable à valider côté serveur.",
        "Nettoyer les écouteurs lors de la destruction de l'interface : socket.off avec la même fonction. Prévoir état de connexion, déconnexion et resynchronisation."
      ],
      code: "const socket = io();\nconst onUpdate = (text) => { preview.textContent = text; };\nsocket.on('updateScript', onUpdate);\nsocket.emit('updateScript', editor.value);\n// À la destruction de l'interface :\nsocket.off('updateScript', onUpdate);"
    }
  },
  {
    cp: "cp6", technology: "realtime",
    section: {
      title: "Socket.IO · diffusion et cohérence",
      body: "CollabScript conserve un currentScript en mémoire et diffuse les modifications aux autres connexions.",
      bullets: [
        "socket.emit cible la connexion courante ; socket.broadcast.emit cible les autres ; io.emit cible toutes les connexions concernées du serveur.",
        "Le serveur envoie currentScript au nouvel arrivant. Une variable en mémoire est perdue au redémarrage et n'est pas une persistance en base.",
        "Deux utilisateurs peuvent écraser leurs modifications. Une vraie édition collaborative exige une stratégie de versions, de conflits ou de fusion adaptée.",
        "Socket.IO ajoute un protocole d'événements au transport : il n'est pas interchangeable avec un client WebSocket brut. Authentifier la connexion et autoriser chaque action ou document."
      ],
      code: "// Extrait pédagogique adapté à CollabScript\nio.on('connection', (socket) => {\n  socket.emit('updateScript', currentScript);\n  socket.on('updateScript', (text) => {\n    // Valider le texte et vérifier l'autorisation avant modification.\n    currentScript = text;\n    socket.broadcast.emit('updateScript', text);\n  });\n});"
    }
  },
  {
    cp: "cp2", technology: "i18n",
    section: {
      title: "i18next · clés et langue de la requête",
      body: "L'atelier Express charge des dictionnaires français/anglais et traduit welcome avec req.t.",
      bullets: [
        "i18n prépare l'application à plusieurs langues ; la localisation fournit traductions et conventions d'une langue/région.",
        "Conserver une clé stable, par exemple welcome, dans locales/fr/translation.json et locales/en/translation.json.",
        "i18next-fs-backend charge les fichiers ; LanguageDetector détecte la langue ; middleware.handle rend la traduction disponible sur la requête Express.",
        "Tester ?lng=fr et ?lng=en. fallbackLng fournit une langue de repli lorsqu'une traduction manque ; il ne remplace pas le contrôle des traductions."
      ],
      code: "// Après initialisation i18next et installation du middleware\napp.get('/', (req, res) => {\n  res.send(req.t('welcome'));\n});\n// fr : { \"welcome\": \"Bienvenue !\" }\n// en : { \"welcome\": \"Welcome!\" }"
    }
  },
  {
    cp: "cp2", technology: "i18n",
    section: {
      title: "Localisation · variables et cas à vérifier",
      body: "Les prolongements de l'atelier portent sur interpolation, pluriels et formatage des données.",
      bullets: [
        "Traduire une phrase complète et injecter les variables ; concaténer des morceaux français impose un ordre de mots qui peut être faux ailleurs.",
        "Les pluriels dépendent de la langue. Passer count à i18next et prévoir les formes attendues dans le dictionnaire.",
        "Le format d'une date, d'un nombre ou d'une devise dépend aussi de la région : utiliser Intl avec une locale explicite adaptée au besoin.",
        "Vérifier langue détectée, clé absente, zéro/un/plusieurs, texte long et valeurs interpolées. Pour du HTML, conserver une protection adaptée au contexte contre l'injection."
      ],
      code: "// Dictionnaire : { \"greeting\": \"Bonjour {{name}} !\" }\ni18next.t('greeting', { name: 'Alex' });\n// Exemple de formatage complémentaire\nnew Intl.NumberFormat('fr-FR').format(1234.5);"
    }
  }
];

export const courseCards = [
  { id: "course-react-01", cp: "cp2", technology: "react", question: "React : quelle différence entre props et state ?", answer: "Les props viennent du parent ; le state est une valeur conservée et mise à jour par le composant.", detail: "Dans le Blog, App conserve searchText et le transmet à Posts avec un callback de modification.", tags: ["React", "props", "state"] },
  { id: "course-react-02", cp: "cp2", technology: "react", question: "Comment rendre un input contrôlé en React ?", answer: "Relier value à l'état et onChange à la fonction qui met cet état à jour.", detail: "Exemple : value={search} et onChange={e => setSearch(e.target.value)}. L'état devient la source de la valeur affichée.", tags: ["React", "formulaires"] },
  { id: "course-react-03", cp: "cp2", technology: "react", question: "Deux composants ont besoin du même filtre : où placer l'état ?", answer: "Dans leur ancêtre commun, puis transmettre la valeur et les callbacks par props.", detail: "C'est le principe utilisé dans les challenges Blog pour partager le mode zen et la recherche.", tags: ["React", "architecture"] },
  { id: "course-react-04", cp: "cp2", technology: "react", question: "Pourquoi éviter items.push(...) directement sur un tableau d'état React ?", answer: "Il faut produire une nouvelle valeur pour exprimer la mise à jour sans modifier l'état existant.", detail: "Utiliser setItems(previous => [...previous, item]) plutôt que muter previous.", tags: ["React", "immutabilité"] },
  { id: "course-react-05", cp: "cp2", technology: "react", question: "Quel rôle remplit useEffect dans le Blog qui charge des articles ?", answer: "Synchroniser le composant avec l'API extérieure et mettre à jour les états de chargement, résultat ou erreur.", detail: "Déclarer les dépendances utilisées et prévoir un nettoyage pour les opérations devenues inutiles. Un filtre calculable pendant le rendu ne nécessite pas forcément un effet.", tags: ["React", "useEffect", "API"] },
  { id: "course-react-06", cp: "cp2", technology: "react", question: "Quels états d'interface prévoir autour d'un fetch ?", answer: "Chargement, résultat disponible, résultat vide et erreur.", detail: "Vérifier response.ok : une réponse HTTP 404 ou 500 ne fait pas automatiquement rejeter la promesse fetch.", tags: ["React", "fetch", "erreurs"] },
  { id: "course-react-07", cp: "cp2", technology: "react", question: "Dans /post/:slug, comment le composant récupère-t-il le slug ?", answer: "Avec useParams dans le contexte du routeur.", detail: "Le challenge déclare une Route /post/:slug et utilise const { slug } = useParams<{ slug: string }>() dans PostPage.", tags: ["React", "React Router"] },
  { id: "course-react-08", cp: "cp2", technology: "react", question: "Que fait <Navigate to=\"/\" replace /> dans le Blog ?", answer: "Il redirige vers l'accueil en remplaçant l'entrée courante de l'historique.", detail: "L'exercice l'utilise si le slug ne correspond à aucun article. Une redirection côté client ne remplace pas une autorisation côté API.", tags: ["React", "navigation", "sécurité"] },

  { id: "course-mongodb-01", cp: "cp8", technology: "mongodb", question: "MongoDB : qu'est-ce qu'une collection et un document ?", answer: "Une collection regroupe des documents contenant des champs et éventuellement des objets ou tableaux imbriqués.", detail: "Dans le service OQuiz, la collection logs conserve des documents avec niveau, message, service et date.", tags: ["MongoDB", "NoSQL"] },
  { id: "course-mongodb-02", cp: "cp8", technology: "mongodb", question: "Un schéma MongoDB flexible dispense-t-il de valider les entrées ?", answer: "Non : les types, valeurs admises, tailles et permissions restent à contrôler.", detail: "Le service de logs utilise des schémas Zod pour les niveaux de log, les dates, les limites et les identifiants.", tags: ["MongoDB", "Zod", "validation"] },
  { id: "course-mongodb-03", cp: "cp8", technology: "mongodb", question: "Quelle différence entre findOne et find(...).toArray() ?", answer: "findOne cherche un document ; find produit un curseur et toArray récupère les résultats dans un tableau.", detail: "Ajouter filtre, tri et limite avant toArray pour éviter de charger toute une collection sans besoin.", tags: ["MongoDB", "requêtes"] },
  { id: "course-mongodb-04", cp: "cp8", technology: "mongodb", question: "À quoi sert $match suivi de $group dans une agrégation MongoDB ?", answer: "$match filtre les documents ; $group les regroupe et calcule des résultats agrégés.", detail: "Le service de logs compte les événements par niveau avec $group: { _id: '$level', count: { $sum: 1 } }.", tags: ["MongoDB", "agrégation"] },
  { id: "course-mongodb-05", cp: "cp8", technology: "mongodb", question: "MongoDB interdit-il toute jointure entre collections ?", answer: "Non : l'étape d'agrégation $lookup permet notamment de joindre des données d'une autre collection.", detail: "L'imbrication peut convenir à certains accès, mais le choix doit tenir compte du partage des données, des volumes et des mises à jour.", tags: ["MongoDB", "modélisation", "$lookup"] },
  { id: "course-mongodb-06", cp: "cp6", technology: "mongodb", question: "Dans Winston, quel est le rôle d'un transport ?", answer: "Acheminer un log vers une destination, par exemple console, fichier ou service HTTP.", detail: "Le logger OQuiz possède des transports fichier et un transport HTTP vers log-api, avec niveau et métadonnées.", tags: ["Winston", "logs", "microservices"] },
  { id: "course-mongodb-07", cp: "cp6", technology: "mongodb", question: "Quel coût apporte le découpage d'une API en microservices ?", answer: "Il ajoute des contrats réseau, des configurations et des défaillances à gérer entre services.", detail: "L'API métier, le service logs et le service fichiers peuvent évoluer séparément ; leur intégration exige erreurs, timeouts et suivi adaptés.", tags: ["microservices", "architecture"] },
  { id: "course-mongodb-08", cp: "cp6", technology: "mongodb", question: "Formidable sécurise-t-il automatiquement un fichier envoyé ?", answer: "Non : il parse multipart/form-data ; l'application doit contrôler le fichier et les droits d'accès.", detail: "Vérifier taille, type réel, nom/chemin et autorisation ; gérer erreurs et fichiers orphelins. L'extension fournie par le client n'est pas une preuve du type réel.", tags: ["Formidable", "upload", "sécurité"] },

  { id: "course-graphql-01", cp: "cp3", technology: "graphql", question: "Dans GraphQL, que définit le schéma ?", answer: "Les types, champs, arguments et opérations disponibles pour les clients.", detail: "Apollo Server reçoit typeDefs et resolvers. Le schéma constitue un contrat ; il n'implémente pas à lui seul les règles métier.", tags: ["GraphQL", "Apollo", "contrat"] },
  { id: "course-graphql-02", cp: "cp3", technology: "graphql", question: "Quelle différence entre Query et Mutation dans OResto ?", answer: "Query expose des lectures ; Mutation expose des opérations destinées à modifier les données.", detail: "Exemples du schéma : restaurant(id: Int!) et createRestaurant(input: CreateRestaurant!). Les autorisations restent à vérifier.", tags: ["GraphQL", "Query", "Mutation"] },
  { id: "course-graphql-03", cp: "cp3", technology: "graphql", question: "Que représentent parent et args dans un resolver GraphQL ?", answer: "parent est le résultat du champ parent ; args contient les arguments fournis au champ courant.", detail: "restaurant lit args.id ; Restaurant.city utilise parent.city_id pour résoudre la ville associée.", tags: ["GraphQL", "resolver"] },
  { id: "course-graphql-04", cp: "cp3", technology: "graphql", question: "Que signifie le ! dans name: String! et [Restaurant!]! ?", answer: "Il impose une valeur non nulle ; dans [Restaurant!]!, la liste et chacun de ses éléments sont non nuls.", detail: "Cela ne signifie pas que la liste contient au moins un élément : une liste vide reste possible.", tags: ["GraphQL", "types", "null"] },
  { id: "course-graphql-05", cp: "cp3", technology: "graphql", question: "Les mutations OResto observées garantissent-elles une persistance PostgreSQL ?", answer: "Non : les resolvers de cette copie modifient des tableaux en mémoire.", detail: "Le dépôt possède aussi des datamappers pg. Il faut vérifier leurs appels effectifs avant d'affirmer qu'une route persiste ses données en base.", tags: ["GraphQL", "OResto", "preuves"] },
  { id: "course-graphql-06", cp: "cp8", technology: "graphql", question: "Avec pg, comment transmettre l'id d'un restaurant sans le concaténer au SQL ?", answer: "Utiliser WHERE id = $1 et fournir l'id dans values: [validatedId].", detail: "Le datamapper OResto transmet un objet { text, values }. Une valeur paramétrée ne devient pas une portion de code SQL.", tags: ["pg", "SQL", "paramètres"] },
  { id: "course-graphql-07", cp: "cp8", technology: "graphql", question: "Quel est le rôle du datamapper et de result.rows ?", answer: "Le datamapper centralise l'accès aux données ; result.rows contient les lignes retournées par pg.", detail: "findByPk retourne rows[0] ou null. Le traitement exposé à l'API décide ensuite comment présenter une absence ou une erreur.", tags: ["pg", "datamapper", "architecture"] },
  { id: "course-graphql-08", cp: "cp8", technology: "graphql", question: "Qu'appelle-t-on le problème N+1 avec des champs GraphQL imbriqués ?", answer: "Une requête initiale est suivie d'une requête supplémentaire pour chacun des N éléments.", detail: "Lister N restaurants puis rechercher séparément chaque ville peut produire N+1 accès. Mesurer les appels et envisager regroupement ou cache adapté.", tags: ["GraphQL", "performances", "N+1"] },

  { id: "course-realtime-01", cp: "cp2", technology: "realtime", question: "Que font socket.emit et socket.on dans CollabScript ?", answer: "emit envoie un événement ; on enregistre une fonction qui réagit à sa réception.", detail: "Le client émet updateScript à la saisie et écoute updateScript pour afficher le texte reçu.", tags: ["Socket.IO", "événements"] },
  { id: "course-realtime-02", cp: "cp6", technology: "realtime", question: "Quelle différence entre socket.emit, socket.broadcast.emit et io.emit côté serveur ?", answer: "Ils ciblent respectivement la connexion courante, les autres connexions et toutes les connexions concernées.", detail: "CollabScript envoie l'état initial au nouveau client, diffuse une modification aux autres et transmet le compteur à tous.", tags: ["Socket.IO", "broadcast"] },
  { id: "course-realtime-03", cp: "cp6", technology: "realtime", question: "Pourquoi envoyer currentScript dès la connexion d'un utilisateur ?", answer: "Pour synchroniser le nouvel utilisateur avec le texte déjà connu du serveur.", detail: "Sans état initial, il n'observerait que les modifications reçues après sa connexion.", tags: ["Socket.IO", "synchronisation"] },
  { id: "course-realtime-04", cp: "cp6", technology: "realtime", question: "Le texte conservé dans currentScript survit-il au redémarrage du serveur ?", answer: "Non : une variable en mémoire est perdue au redémarrage.", detail: "Une persistance exige un stockage distinct et une politique de restauration ; le compteur de clients ne prouve pas cette persistance.", tags: ["Socket.IO", "persistance"] },
  { id: "course-realtime-05", cp: "cp6", technology: "realtime", question: "Un client WebSocket brut peut-il parler directement au protocole Socket.IO ?", answer: "Non : Socket.IO ajoute son propre protocole au transport et requiert un client compatible.", detail: "Il peut utiliser WebSocket ou HTTP long-polling, mais Socket.IO et WebSocket ne sont pas synonymes.", tags: ["Socket.IO", "WebSocket", "protocole"] },
  { id: "course-realtime-06", cp: "cp2", technology: "realtime", question: "Pourquoi nettoyer un écouteur Socket.IO lorsque son composant disparaît ?", answer: "Pour éviter les abonnements inutiles, les traitements doublés et les mises à jour d'une interface supprimée.", detail: "Utiliser socket.off('updateScript', onUpdate) avec la même fonction qu'à l'inscription ; déconnecter aussi une connexion dont le composant est propriétaire si nécessaire.", tags: ["Socket.IO", "cycle de vie"] },
  { id: "course-realtime-07", cp: "cp6", technology: "realtime", question: "Deux scénaristes saisissent en même temps : le simple broadcast fusionne-t-il leurs textes ?", answer: "Non : remplacer le texte entier peut écraser une modification concurrente.", detail: "Le prototype CollabScript ne démontre pas une fusion collaborative. Une solution doit traiter versions, conflits ou opérations concurrentes.", tags: ["Socket.IO", "concurrence"] },
  { id: "course-realtime-08", cp: "cp2", technology: "realtime", question: "Un message reçu par socket mérite-t-il moins de validation qu'une requête HTTP ?", answer: "Non : contrôler contenu, taille, identité et permission pour chaque action concernée.", detail: "Pour afficher du texte, utiliser textContent. L'authentification de la connexion ne suffit pas à autoriser tous les documents.", tags: ["Socket.IO", "validation", "sécurité"] },

  { id: "course-i18n-01", cp: "cp2", technology: "i18n", question: "Quelle différence entre internationalisation et localisation ?", answer: "L'internationalisation prépare l'application à plusieurs langues ; la localisation l'adapte à une langue et une région.", detail: "Extraire les textes en clés est une préparation ; fournir les traductions françaises et conventions fr-FR est une adaptation.", tags: ["i18n", "localisation"] },
  { id: "course-i18n-02", cp: "cp2", technology: "i18n", question: "Pourquoi utiliser la même clé welcome dans les dictionnaires fr et en ?", answer: "Pour demander le même message logique quelle que soit la langue choisie.", detail: "req.t('welcome') recherche la traduction adaptée ; le code métier ne contient pas une condition pour chaque phrase et langue.", tags: ["i18next", "clés"] },
  { id: "course-i18n-03", cp: "cp2", technology: "i18n", question: "À quoi sert i18next-fs-backend dans l'atelier ?", answer: "À charger les dictionnaires de traduction depuis des fichiers du système.", detail: "Le loadPath pointe vers locales/{{lng}}/translation.json ; ce module ne remplace pas Express ni le détecteur de langue.", tags: ["i18next", "configuration"] },
  { id: "course-i18n-04", cp: "cp2", technology: "i18n", question: "Comment req.t devient-il disponible dans une route Express ?", answer: "Le middleware i18next est installé avant les routes avec middleware.handle(i18next).", detail: "Le détecteur détermine la langue de la requête ; l'atelier propose de tester /?lng=fr puis /?lng=en.", tags: ["i18next", "Express", "middleware"] },
  { id: "course-i18n-05", cp: "cp2", technology: "i18n", question: "Que signifie fallbackLng: 'en' ?", answer: "L'anglais sert de langue de repli lorsqu'une traduction recherchée n'est pas disponible dans la langue résolue.", detail: "La langue peut être détectée sur la requête ; fallbackLng ne veut pas dire que toutes les requêtes utilisent toujours l'anglais.", tags: ["i18next", "fallback"] },
  { id: "course-i18n-06", cp: "cp2", technology: "i18n", question: "Pourquoi interpoler name dans une phrase traduite plutôt que concaténer plusieurs fragments ?", answer: "Chaque langue peut placer la variable dans l'ordre qui lui convient.", detail: "Exemple : t('greeting', { name: 'Alex' }) et une traduction contenant {{name}}. Préserver une protection adaptée au contexte d'affichage.", tags: ["i18next", "interpolation"] },
  { id: "course-i18n-07", cp: "cp2", technology: "i18n", question: "Comment i18next choisit-il une forme plurielle ?", answer: "On lui transmet count et on fournit les formes correspondant aux règles de la langue.", detail: "Vérifier zéro, un et plusieurs. Ajouter simplement un s à une chaîne ne couvre pas toutes les langues ni tous les messages.", tags: ["i18next", "pluriels"] },
  { id: "course-i18n-08", cp: "cp2", technology: "i18n", question: "Traduire les textes suffit-il à localiser une date ou un prix ?", answer: "Non : il faut aussi choisir les formats de date, nombre et devise adaptés à la région.", detail: "Intl.DateTimeFormat et Intl.NumberFormat permettent de préciser une locale ; un fuseau horaire ou une devise peut aussi être nécessaire.", tags: ["i18n", "Intl", "formatage"] }
];

export const courseSources = [
  { label: "Cours · React : appels d'API et useEffect", path: "SC06E04-React-Blog-Formulaires-Zer0absolute/README.md" },
  { label: "Exercice · Blog React : état et chargement", path: "SC06E04-React-Blog-Formulaires-Zer0absolute/src/components/App/App.tsx" },
  { label: "Exercice · Blog : routes React Router", path: "SC07E01-React-Blog-Router-Zer0absolute/src/components/App/App.tsx" },
  { label: "Exercice · Article : useParams et Navigate", path: "SC07E01-React-Blog-Router-Zer0absolute/src/components/PostPage/PostPage.tsx" },
  { label: "Cours · Microservice logs et MongoDB", path: "SC01234-OQUIZ-Zer0absolute/docs/cours/SC04/SC04E02.md" },
  { label: "Exercice · MongoDB : filtres et agrégations des logs", path: "SC01234-OQUIZ-Zer0absolute/log-service/src/log.service.ts" },
  { label: "Exercice · Winston : transports du logger", path: "SC01234-OQUIZ-Zer0absolute/api/src/lib/logger.ts" },
  { label: "Exercice · Service fichiers : Formidable", path: "SC01234-OQUIZ-Zer0absolute/file-service/src/utils/uploader.ts" },
  { label: "Exercice · OResto : schéma GraphQL", path: "SC05-OResto-LoicBrassart-Zer0absolute/ORESTO/src/app/schemas/query.gql" },
  { label: "Exercice · OResto : resolvers sur données en mémoire", path: "SC05-OResto-LoicBrassart-Zer0absolute/ORESTO/src/app/resolvers/query.ts" },
  { label: "Exercice · OResto : datamapper SQL", path: "SC05-OResto-LoicBrassart-Zer0absolute/ORESTO/src/app/datasources/restoDB/coreDataMapper.ts" },
  { label: "Exercice · CollabScript : serveur Socket.IO", path: "E21-Atelier-Socket.IO-CollabScript-Zer0absolute/collabscript.js" },
  { label: "Exercice · CollabScript : événements de l'éditeur", path: "E21-Atelier-Socket.IO-CollabScript-Zer0absolute/public/app.js" },
  { label: "Cours · Atelier i18next", path: "E22-Atelier-Internationalition-i18n-Zer0absolute/README.md" },
  { label: "Exercice · i18next et middleware Express", path: "E22-Atelier-Internationalition-i18n-Zer0absolute/node-i18n-workshop/index.js" },
  { label: "React · Référence useEffect", url: "https://react.dev/reference/react/useEffect" },
  { label: "Apollo Server · Resolvers", url: "https://www.apollographql.com/docs/apollo-server/data/resolvers" },
  { label: "Apollo Server · Schéma et types non nuls", url: "https://www.apollographql.com/docs/apollo-server/schema/schema" },
  { label: "MongoDB · Agrégation $lookup", url: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/" },
  { label: "Socket.IO · Introduction et protocole", url: "https://socket.io/docs/v4/" },
  { label: "i18next · Fonction de traduction", url: "https://www.i18next.com/translation-function/essentials" },
  { label: "i18next · Interpolation", url: "https://www.i18next.com/translation-function/interpolation" },
  { label: "i18next · Pluriels et count", url: "https://www.i18next.com/translation-function/plurals" },
  { label: "MDN · Intl.NumberFormat", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat" }
];
