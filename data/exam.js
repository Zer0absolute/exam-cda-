// Contenu d'entraînement créé à partir des dossiers locaux. Les réponses sont
// des trames à reformuler avec ses mots, pas des déclarations à réciter.
const slides = 'dossier projet/travail_diaporama/contenu_diaporama.json';
const conception = 'dossier projet/travail_dossier/conception.json';
const contributions = 'dossier projet/travail_dossier/contributions.json';
const realisations = 'dossier projet/travail_dossier/realisations.json';
const relecture = 'dossier projet/output/dossier_cda/Relecture_avant_soutenance.txt';
const dp = 'dossier-professionnel-cda/travail/contenu-fiches.json';
const referentiel = 'dossier-professionnel-cda/travail/referentiel.txt';

export const oralQuestions = [
  {
    id: 'o001', cp: 'cp1', kind: 'technique', project: 'GamerChallenge',
    question: 'Comment reconstitueriez-vous votre environnement Gamer Challenges sur un nouveau poste ?',
    answer: 'Je pars du dépôt et de la documentation, je vérifie les versions de Bun, les dépendances et Docker. Je configure séparément les valeurs nécessaires à Supabase et IGDB, sans les publier. Je lance les services prévus puis vérifie le typage, le build et un parcours simple. Je distingue un environnement local reproductible d’une recette avec les vrais fournisseurs externes.',
    expected: ['Dépôt et documentation', 'Versions et dépendances', 'Configuration extérieure au code', 'Services et contrôles après lancement'],
    followup: 'Quel contrôle vous permettrait de distinguer une API indisponible d’une mauvaise configuration IGDB ?',
    source: `${slides}, Q4 et QA1 ; REAC p. 19`
  },
  {
    id: 'o002', cp: 'cp1', kind: 'technique', project: 'Transversal',
    question: 'Qu’apportent un fichier de verrouillage des dépendances et des images versionnées ?',
    answer: 'Ils aident à retrouver les mêmes versions et à comprendre un écart entre deux postes. Le fichier de verrouillage concerne les dépendances du projet ; le tag ou l’identifiant de l’image concerne le conteneur. Pour Gamer Challenges, fixer les versions fait partie des priorités de livraison. Je ne présente pas cette amélioration comme déjà réalisée partout.',
    expected: ['Reproductibilité', 'Dépendances du projet', 'Versions des images', 'Limite actuelle du projet'],
    followup: 'Pourquoi une image appelée latest peut-elle compliquer un retour arrière ?',
    source: `${slides}, Q5 ; REAC p. 19 et 37`
  },
  {
    id: 'o003', cp: 'cp1', kind: 'final', project: 'Transversal',
    question: 'Dans le DP, que démontre votre migration du jeu météo vers TypeScript ?',
    answer: 'J’ai installé TypeScript et tsx, créé tsconfig.json avec le mode strict et adapté le démarrage. J’ai typé les réponses attendues et renforcé la gestion des erreurs HTTP. Les valeurs de repli permettent au jeu de continuer ; elles ne représentent pas une météo réellement mesurée. Les versions exactes de mon environnement restent à compléter dans le DP.',
    expected: ['Configuration TypeScript', 'Démarrage avec tsx', 'Contrôles HTTP', 'Valeurs de repli et limites du DP'],
    followup: 'Une interface TypeScript valide-t-elle automatiquement le JSON reçu d’un service ?',
    source: `${dp}, fiche « Jeu météo » ; REAC p. 19`
  },
  {
    id: 'o004', cp: 'cp2', kind: 'projet', project: 'GamerChallenge',
    question: 'Expliquez le fonctionnement de votre recherche de jeux pendant la frappe.',
    answer: 'À partir de deux caractères, un effet React attend 300 ms avant la recherche. Son nettoyage supprime le délai précédent et annule la requête associée si la saisie évolue. Je distingue chargement, absence de résultat et erreur. La sélection conserve l’identifiant du jeu pour la création. Cette réduction des appels n’est pas une performance chiffrée mesurée.',
    expected: ['Seuil de deux caractères', 'Délai de 300 ms', 'Nettoyage et annulation', 'États et sélection du jeu'],
    followup: 'Que pourrait afficher l’interface si une ancienne réponse arrivait après une recherche plus récente ?',
    source: `${slides}, R01 ; REAC p. 21-22`
  },
  {
    id: 'o005', cp: 'cp2', kind: 'technique', project: 'GamerChallenge',
    question: 'Comment évitez-vous de laisser croire qu’une action d’administration a réussi ?',
    answer: 'La console affiche un état de traitement et attend le résultat HTTP. Après une réponse réussie, elle actualise la participation affichée et recharge les statistiques. Une erreur conserve un message compréhensible. Les informations détaillées d’un membre se chargent séparément des données générales. L’interface facilite l’usage, mais le serveur contrôle les droits.',
    expected: ['État de traitement', 'Résultat de la requête', 'Actualisation après succès', 'Message d’erreur et droits serveur'],
    followup: 'Quels problèmes surveilleriez-vous si l’administrateur change rapidement de membre sélectionné ?',
    source: `${slides}, R09 ; REAC p. 21-22`
  },
  {
    id: 'o006', cp: 'cp2', kind: 'projet', project: 'GamerChallenge',
    question: 'Qu’avez-vous personnellement apporté à la refonte et aux langues de l’interface ?',
    answer: 'J’ai proposé la refonte comme décision produit et participé à son intégration dans React. Les maquettes, wireframes et la charte sont collectifs. J’ai centralisé les traductions français et anglais ainsi que les formats de dates et de nombres dans un contexte React. Je distingue les interfaces exécutées et les détails décoratifs des maquettes qui restent à développer.',
    expected: ['Décision produit', 'Intégration personnelle', 'Conception collective', 'Traductions et formats partagés'],
    followup: 'Donnez un exemple de fonction visible dans une maquette mais absente de l’application actuelle.',
    source: `${slides}, C3, C5 et R01 ; ${conception}, E.4`
  },
  {
    id: 'o007', cp: 'cp2', kind: 'final', project: 'IACrea',
    question: 'Comment le parcours IACrea conduit-il au bon plan dans l’éditeur web ?',
    answer: 'Les écrans SwiftUI conservent les identifiants du projet et du plan. La construction du lien contrôle leur présence, retire les espaces inutiles et choisit la langue. L’écran propose l’ouverture lorsque le lien est disponible ; sinon il invite à exporter le plan. Les tests couvrent les liens français et anglais et l’absence d’un identifiant. Je complète les interlocuteurs et les retours réels plutôt que de les inventer.',
    expected: ['Identifiants transmis', 'Contrôle des données', 'Écran d’accompagnement', 'Tests du lien et contexte réel'],
    followup: 'Comment expliqueriez-vous à un utilisateur pourquoi le bouton d’ouverture est indisponible ?',
    source: `${dp}, fiche « Relier l’application IACrea à l’éditeur de plans »`
  },
  {
    id: 'o008', cp: 'cp3', kind: 'projet', project: 'GamerChallenge',
    question: 'Pourquoi le dépôt d’une preuve ne crédite-t-il pas immédiatement des points ?',
    answer: 'Rejoindre le défi est un abonnement, et déposer un lien crée une participation pending. Aucun de ces événements ne signifie que les règles du défi ont été respectées. La validation est administrative dans le code actuel. Entrer dans validated ajoute la récompense ; en sortir la retire. Les votes mettent à jour des compteurs, sans validation automatique.',
    expected: ['Abonnement distinct de la preuve', 'Statut pending', 'Décision administrative', 'Transition vers ou hors validated'],
    followup: 'Quelle différence avec le diagramme de séquence de conception initial ?',
    source: `${slides}, C2, R06 et R10 ; ${conception}, C.6 ; REAC p. 23`
  },
  {
    id: 'o009', cp: 'cp3', kind: 'technique', project: 'GamerChallenge',
    question: 'Quel utilisateur le serveur enregistre-t-il comme créateur d’un défi ?',
    answer: 'Le créateur vient de l’identité vérifiée dans le contexte Hono, pas d’un identifiant librement envoyé par le navigateur. Pour modifier ou supprimer, canManageChallenge autorise le créateur ou un administrateur. Un identifiant invalide, une ressource absente et un refus de droits doivent produire des réponses distinctes. Le parcours d’édition côté interface reste à raccorder.',
    expected: ['Identité issue de la session', 'Créateur ou administrateur', 'Validation des entrées', 'Limite de l’interface actuelle'],
    followup: 'Pourquoi un bouton masqué ne suffit-il pas à empêcher la modification du défi d’un autre membre ?',
    source: `${slides}, R05 ; ${realisations} ; REAC p. 23-24`
  },
  {
    id: 'o010', cp: 'cp3', kind: 'technique', project: 'GamerChallenge',
    question: 'Pourquoi la révision limite-t-elle explicitement les champs modifiables d’un profil ?',
    answer: 'Accepter tout le corps JSON risquait de laisser modifier des champs métier sensibles. La révision autorise username, avatarUrl et bio et refuse notamment role et points avec 400. Sur la base locale, un essai conserve user et 100 points ; un pseudonyme déjà utilisé produit 409. Je distingue cette correction actuelle du risque recensé dans l’analyse historique des contributions.',
    expected: ['Risque de modification de champs sensibles', 'Liste de champs autorisés', 'Refus role et points', 'Résultat réel et version concernée'],
    followup: 'TypeScript suffirait-il à empêcher un client de transmettre role: admin dans une requête HTTP ?',
    source: `${slides}, Q1 ; ${contributions}, limites de la version historique`
  },
  {
    id: 'o011', cp: 'cp3', kind: 'final', project: 'Oddit',
    question: 'Expliquez le parcours d’authentification que vous présentez pour Oddit.',
    answer: 'À l’inscription, le mot de passe est haché avec bcrypt. À la connexion, je compare le mot de passe reçu au hachage. Si les identifiants et la configuration sont valides, un JWT valable une heure est signé. Le middleware vérifie ce jeton ; les traitements des publications utilisent l’utilisateur authentifié et vérifient l’auteur pour modifier ou supprimer.',
    expected: ['Hachage bcrypt', 'Comparaison à la connexion', 'Signature et expiration du JWT', 'Vérification de l’auteur'],
    followup: 'Que devez-vous éviter de renvoyer dans la réponse contenant les données de l’utilisateur ?',
    source: `${dp}, fiche « Gérer les comptes et les publications avec Oddit »`
  },
  {
    id: 'o012', cp: 'cp4', kind: 'projet', project: 'GamerChallenge',
    question: 'Comment répartissiez-vous les responsabilités dans l’équipe ?',
    answer: 'Nous étions quatre : j’étais Product Owner et référent backend, Samy Scrum Master, Marco Git Master et Gwendal référent frontend. Le cahier des charges, les modèles et les maquettes sont collectifs. Mes exemples détaillent identité, données, défis, classements et administration. Les votes sont de Samy ; Marco a notamment développé l’autre soumission, les badges et requireAdmin.',
    expected: ['Quatre rôles documentés', 'Conception collective', 'Exemples personnels', 'Contributions des collègues'],
    followup: 'Comment prouver votre contribution sans réduire le travail de l’équipe à un nombre de commits ?',
    source: `${slides}, C3 ; ${contributions}, limites d’attribution ; REAC p. 25-26`
  },
  {
    id: 'o013', cp: 'cp4', kind: 'projet', project: 'GamerChallenge',
    question: 'Donnez une décision concrète prise dans votre rôle de Product Owner.',
    answer: 'J’ai proposé la refonte parce que la présentation précédente me semblait peu attirante. Nous avons aussi choisi des fils centrés sur chaque défi, inspirés de Reddit, plutôt qu’un forum général. Je relie ces décisions au parcours des joueurs. Les preuves et votes existent ; les commentaires restent à développer. Je décris les échanges dont je me souviens réellement, sans inventer de planning ou de métrique.',
    expected: ['Besoin observé', 'Refonte proposée', 'Fils par défi', 'État réel et arbitrage collectif'],
    followup: 'Quel critère d’acceptation proposeriez-vous pour la future fonction de commentaires ?',
    source: `${slides}, C3 ; ${relecture} ; REAC p. 25-26`
  },
  {
    id: 'o014', cp: 'cp4', kind: 'technique', project: 'Transversal',
    question: 'Comment traiteriez-vous un conflit Git sur une règle métier partagée ?',
    answer: 'Je commence par comprendre les deux intentions et l’état attendu du produit. J’échange avec les auteurs, résous le conflit en conservant une règle cohérente, puis vérifie le diff et les tests concernés. Je fais relire si le changement touche les droits ou les points. Cette réponse décrit une méthode ; je ne la transforme pas en événement historique sans exemple réel.',
    expected: ['Comprendre les deux changements', 'Échange avec les auteurs', 'Résolution et lecture du diff', 'Vérifications ciblées et relecture'],
    followup: 'Pourquoi choisir automatiquement toutes les lignes d’une seule branche peut-il casser le projet ?',
    source: `${contributions}, travail collectif ; REAC p. 25-26`
  },
  {
    id: 'o015', cp: 'cp4', kind: 'final', project: 'IACrea',
    question: 'Comment compléter la preuve de gestion de projet de votre fiche IACrea ?',
    answer: 'Le DP décrit une réalisation technique, mais laisse à compléter la demande initiale, le suivi de tâche, les échanges et les retours. Je dois apporter un exemple réel : besoin reçu, priorité, interlocuteurs, étape de validation et adaptation éventuelle. Je peux anonymiser une information confidentielle. L’existence du code ou de tests ne suffit pas à démontrer toute l’organisation de la tâche.',
    expected: ['Demande initiale réelle', 'Suivi et priorité', 'Interlocuteurs et retours', 'Validation et confidentialité'],
    followup: 'Racontez un retour reçu qui vous a conduit à modifier votre solution.',
    source: `${dp}, fiche IACrea CP 2 et CP 4 ; REAC p. 25-26`
  },
  {
    id: 'o016', cp: 'cp5', kind: 'projet', project: 'GamerChallenge',
    question: 'Comment passez-vous d’un besoin utilisateur à un critère d’acceptation vérifiable ?',
    answer: 'Pour publier une preuve, le membre veut montrer sa réussite. Je précise la situation de départ et les règles : identité valide, défi actif, abonnement existant et lien vidéo admis. Le résultat attendu est une participation pending attribuée au membre ; sans abonnement, on attend 400 et aucune ligne. Le critère relie ainsi le besoin à un résultat observable.',
    expected: ['Intention de l’utilisateur', 'Préconditions', 'Résultat attendu', 'Cas de refus observable'],
    followup: 'Quel critère vous manque pour vérifier une vidéo réellement accessible et pertinente ?',
    source: `${conception}, C.5-C.7 ; ${slides}, R06 et Q2 ; REAC p. 27-28`
  },
  {
    id: 'o017', cp: 'cp5', kind: 'technique', project: 'GamerChallenge',
    question: 'Quelle différence faites-vous entre wireframe, maquette et écran implémenté ?',
    answer: 'Le wireframe organise le contenu et les actions. La maquette précise la direction graphique et les états visuels. L’écran implémenté doit gérer les vraies données et les interactions. Dans Gamer Challenges, notifications, échéances et certains éléments du compte figurent dans la conception mais ne sont pas complètement réalisés. Les documents de conception sont collectifs ; je présente mon intégration personnelle.',
    expected: ['Structure du wireframe', 'Habillage de la maquette', 'Données et interactions réelles', 'Écarts de périmètre'],
    followup: 'Comment testeriez-vous la lisibilité du formulaire sur un petit écran et au clavier ?',
    source: `${conception}, E.3-E.4 ; ${slides}, C5 ; REAC p. 27-28`
  },
  {
    id: 'o018', cp: 'cp5', kind: 'final', project: 'OQuiz',
    question: 'Quels choix de besoin structurent OQuiz dans votre DP ?',
    answer: 'Le support distingue visiteur, membre, auteur et administrateur. Une question n’a qu’une bonne réponse, une bonne réponse vaut un point et les scores sont conservés. Ces décisions influencent parcours, droits et données. La fiche laisse à compléter les écrans réellement maquettés, l’outil, l’adaptation aux petits écrans et les retours ; je ne prétends pas disposer d’une maquette personnelle non documentée.',
    expected: ['Quatre rôles', 'Une bonne réponse', 'Points et conservation des scores', 'Preuves de maquettage à compléter'],
    followup: 'Quel écran et quel état d’erreur faudrait-il prévoir pendant une tentative de quiz ?',
    source: `${dp}, fiche « Analyser les besoins et les écrans d’OQuiz »`
  },
  {
    id: 'o019', cp: 'cp6', kind: 'projet', project: 'GamerChallenge',
    question: 'Suivez une requête de création depuis React jusqu’à PostgreSQL.',
    answer: 'React recueille les valeurs et appelle l’API HTTP. La route Hono et les middlewares vérifient l’identité et les conditions d’accès. Le contrôleur valide les entrées et coordonne le traitement ; un service peut résoudre le jeu IGDB. Drizzle réalise l’accès à PostgreSQL, dont les contraintes protègent les données. La réponse revient à l’interface pour afficher succès ou erreur.',
    expected: ['Interface et HTTP', 'Route et middlewares', 'Contrôleur et services', 'Drizzle, contraintes et réponse'],
    followup: 'Quelle règle doit rester sur le serveur même si le formulaire la contrôle déjà ?',
    source: `${slides}, C6, R02 et R05 ; REAC p. 29`
  },
  {
    id: 'o020', cp: 'cp6', kind: 'technique', project: 'GamerChallenge',
    question: 'Pourquoi l’accès à IGDB est-il situé côté serveur ?',
    answer: 'Le navigateur appelle notre API ; le serveur utilise les identifiants du service et normalise les résultats. Le jeton applicatif Twitch est conservé en mémoire jusqu’à son expiration, avec une marge de renouvellement d’une minute. Il sert au catalogue IGDB, pas à la connexion OAuth d’un joueur. Le cache appartient au processus et n’est pas partagé entre toutes les instances.',
    expected: ['Identifiants conservés côté serveur', 'Résultats normalisés', 'Jeton applicatif distinct de l’identité', 'Expiration et cache local au processus'],
    followup: 'Quelle conséquence aurait l’exécution de deux instances de votre API sur ce cache ?',
    source: `${slides}, R02 ; REAC p. 29`
  },
  {
    id: 'o021', cp: 'cp6', kind: 'technique', project: 'GamerChallenge',
    question: 'Comment raisonnez-vous sur disponibilité, intégrité et confidentialité dans cette architecture ?',
    answer: 'La disponibilité dépend de l’API et aussi de Supabase et IGDB : l’interface doit distinguer leurs erreurs. L’intégrité des points repose sur droits, contraintes et transactions. La confidentialité impose de garder les secrets côté serveur et de limiter l’exposition des informations. Je ne présente ni une disponibilité garantie ni une sécurité exhaustive : les fournisseurs réels restent à recetter.',
    expected: ['Dépendances et erreurs', 'Intégrité des données', 'Protection des secrets et accès', 'Limites vérifiées'],
    followup: 'Quel journal permettrait de diagnostiquer un échec sans enregistrer de jeton sensible ?',
    source: `${slides}, C6, Q1-Q4 ; REAC p. 29`
  },
  {
    id: 'o022', cp: 'cp6', kind: 'technique', project: 'Transversal',
    question: 'Quelles améliorations d’éco-conception pouvez-vous justifier sans inventer des gains ?',
    answer: 'Je peux limiter les appels pendant la frappe, paginer les listes et calculer les agrégations en base au lieu de transférer toutes les participations au navigateur. Réutiliser un jeton IGDB valide évite un échange inutile. Pour chiffrer un gain, je mesurerais requêtes, volumes et temps sur un scénario reproductible. Le projet n’a pas de gain de performance chiffré établi.',
    expected: ['Réduction des appels', 'Pagination et données nécessaires', 'Réutilisation du jeton', 'Mesure avant affirmation'],
    followup: 'Quelle mesure compareriez-vous avant et après une modification du classement ?',
    source: `${slides}, R01, R02 et R07 ; REAC p. 29`
  },
  {
    id: 'o023', cp: 'cp7', kind: 'projet', project: 'GamerChallenge',
    question: 'Pourquoi distinguer auth.users et profiles ?',
    answer: 'Supabase possède l’identité de connexion. profiles conserve pseudonyme, avatar, bio, rôle, points, karma et bannissement. Son UUID référence l’utilisateur authentifié. Cette séparation évite de recréer la gestion des mots de passe dans les tables métier. Le libellé encrypted_password d’un schéma Supabase ne signifie pas que nous avons développé un chiffrement réversible des mots de passe.',
    expected: ['Identité Supabase', 'Données métier du profil', 'UUID et relation', 'Gestion des mots de passe déléguée'],
    followup: 'Que doit faire la synchronisation lorsque l’identité existe mais que son profil métier manque ?',
    source: `${conception}, E.1 ; ${slides}, R03 ; REAC p. 31-32`
  },
  {
    id: 'o024', cp: 'cp7', kind: 'technique', project: 'GamerChallenge',
    question: 'Expliquez les cardinalités entre profil, abonnement et participation.',
    answer: 'Un profil peut exister sans abonnement et sans preuve : ses relations sont donc 0,N. Chaque abonnement et chaque participation référencent un profil et un défi. Les abonnements sont uniques par couple profil-défi, mais plusieurs preuves du même membre sur un défi restent possibles. Le MCD initial indiquait 1,N pour les preuves ; la synthèse actuelle corrige cet écart.',
    expected: ['Profil sans preuve possible', 'Clés étrangères', 'Unicité des abonnements', 'Preuves multiples et écart du MCD'],
    followup: 'Existe-t-il une clé étrangère directe entre abonnement et participation ?',
    source: `${slides}, R04 ; ${conception}, E.1-E.2 ; REAC p. 31-32`
  },
  {
    id: 'o025', cp: 'cp7', kind: 'technique', project: 'GamerChallenge',
    question: 'Pourquoi placer aussi des contraintes dans la base ?',
    answer: 'Le contrôleur améliore la réponse HTTP, mais deux requêtes peuvent passer en même temps avant l’écriture. La contrainte d’unicité protège durablement le couple profil-défi d’un abonnement et profil-participation d’un vote. Les clés étrangères et les contrôles de valeurs empêchent aussi des états incohérents. La validation dans l’interface reste complémentaire.',
    expected: ['Concurrence entre requêtes', 'Unicité en base', 'Clés étrangères et valeurs autorisées', 'Complémentarité des validations'],
    followup: 'Quel résultat doit produire une deuxième demande d’abonnement sur le parcours actuel ?',
    source: `${slides}, R04 et R06 ; ${conception}, E.2`
  },
  {
    id: 'o026', cp: 'cp7', kind: 'technique', project: 'GamerChallenge',
    question: 'Quels effets de suppression et d’unicité devez-vous expliquer dans votre schéma ?',
    answer: 'Un jeu référencé est protégé par restrict ; plusieurs dépendances de profils ou défis utilisent cascade. Pour les badges, challenge_id peut être nul : deux index uniques partiels distinguent badge global et badge lié à un défi. Après suppression d’un compte, ses votes sont supprimés, tandis que les compteurs déjà reçus sur les preuves des autres restent conservés, selon le choix produit actuel.',
    expected: ['restrict et cascade', 'Contexte nullable des badges', 'Deux index uniques partiels', 'Choix produit concernant les compteurs'],
    followup: 'Pourquoi faut-il étudier les dépendances avant de supprimer un profil ?',
    source: `${conception}, E.2 ; ${relecture} ; REAC p. 31-32`
  },
  {
    id: 'o027', cp: 'cp8', kind: 'projet', project: 'GamerChallenge',
    question: 'Comment le classement filtré est-il construit ?',
    answer: 'La requête joint profils, participations, défis et jeux. Elle retient les participations validated et les profils non bannis. Elle additionne les récompenses des défis et calcule les votes positifs moins négatifs. coalesce donne zéro si nécessaire. Le regroupement reste par joueur et jeu ; sans filtre de jeu, un joueur peut donc apparaître sur plusieurs lignes.',
    expected: ['Jointures', 'Filtres métier', 'Agrégations et coalesce', 'Regroupement actuel et sa limite'],
    followup: 'Quelle modification faut-il envisager pour obtenir une seule ligne par joueur dans le classement mensuel ?',
    source: `${slides}, R07 ; REAC p. 33-34`
  },
  {
    id: 'o028', cp: 'cp8', kind: 'technique', project: 'GamerChallenge',
    question: 'Quelle date détermine actuellement le classement mensuel et quelle limite présente-t-elle ?',
    answer: 'Le mois commence au premier jour à minuit UTC. La date retenue est updatedAt, ou createdAt si updatedAt manque, avec le statut validated. Une preuve déposée en avril et mise à jour lors d’une validation en mai peut entrer en mai. Mais updatedAt représente toute modification ; une date validatedAt dédiée donnerait une règle plus stable fondée sur la validation.',
    expected: ['Début de mois UTC', 'coalesce updatedAt/createdAt', 'Exemple avril-mai', 'Limite et validatedAt envisagé'],
    followup: 'Une modification de description en juin doit-elle déplacer une récompense gagnée en mai ?',
    source: `${slides}, R08 ; REAC p. 33-34`
  },
  {
    id: 'o029', cp: 'cp8', kind: 'final', project: 'OQuiz',
    question: 'Quel exemple SQL et quel exemple NoSQL apportez-vous avec OQuiz ?',
    answer: 'Pour les fichiers, j’ai travaillé sur les métadonnées PostgreSQL avec Prisma : chemin, nom d’origine, type MIME, taille, création et recherche avec réponse 404. Le service de logs étudié en cours utilise MongoDB, une validation Zod, des filtres, de la pagination et des agrégations. Je précise ma manipulation personnelle NoSQL et son résultat, car la fiche laisse ce point à compléter et Gamer Challenges est relationnel.',
    expected: ['Métadonnées SQL des fichiers', 'Accès Prisma', 'Documents et requêtes MongoDB', 'Périmètre personnel NoSQL honnête'],
    followup: 'Donnez un filtre de logs par niveau et période que vous sauriez expliquer ligne par ligne.',
    source: `${dp}, fiche « Accéder aux données SQL et NoSQL avec OQuiz » ; REAC p. 33-34`
  },
  {
    id: 'o030', cp: 'cp8', kind: 'final', project: 'Oddit',
    question: 'Comment la pagination d’Oddit évite-t-elle de charger toutes les publications ?',
    answer: 'L’accès Sequelize utilise findAndCountAll avec limit et offset. La limite fixe le nombre de lignes renvoyées, le décalage situe la page, et le total aide à construire la navigation. Je contrôle les valeurs de pagination et choisis un tri stable. Le DP cite le code présent, mais laisse à compléter la vérification des contraintes et certains choix de conception.',
    expected: ['findAndCountAll', 'limit et offset', 'Total et tri stable', 'Validation des paramètres et limites du DP'],
    followup: 'Que risque-t-on avec un offset négatif ou une limite excessivement élevée ?',
    source: `${dp}, fiche « Organiser les données et les couches d’Oddit »`
  },
  {
    id: 'o031', cp: 'cp9', kind: 'projet', project: 'GamerChallenge',
    question: 'Quels tests sont effectivement réussis et que ne prouvent-ils pas ?',
    answer: 'La version révisée annonce 127 tests backend réussis, zéro échec et 365 assertions dans neuf fichiers, avec données et identité simulées. Les autres campagnes couvrent 19 vérifications PostgreSQL, six scénarios de cookies, les interactions React, les images et Nginx. La base et les transactions de la recette PostgreSQL sont réelles. Ces résultats ne prouvent pas une connexion Google/Twitch réelle ni un accès IGDB externe.',
    expected: ['127 tests et périmètre', 'PostgreSQL et autres campagnes', 'Simulations identifiées', 'Fournisseurs réels à recetter'],
    followup: 'Pourquoi présenter un cas concret attendu-obtenu en plus du nombre de tests ?',
    source: `${slides}, Q2-Q3 ; ${relecture} ; REAC p. 35-36`
  },
  {
    id: 'o032', cp: 'cp9', kind: 'technique', project: 'GamerChallenge',
    question: 'Présentez le jeu d’essai de soumission sans abonnement.',
    answer: 'Je pars d’un membre authentifié, d’un défi actif et d’un lien recevable, mais sans abonnement. J’envoie la soumission au parcours principal. Le résultat attendu est 400 et aucune participation créée. Le test de contrôleur et la campagne PostgreSQL confirment le refus. La recette en base apporte la vérification de persistance que le test avec doubles ne couvre pas seul.',
    expected: ['Préconditions précises', 'Action envoyée', '400 attendu et obtenu', 'Absence de ligne en base'],
    followup: 'Quel autre test limite distingue une soumission refusée d’une preuve pending correctement enregistrée ?',
    source: `${slides}, R06, Q2-Q3 ; REAC p. 35-36`
  },
  {
    id: 'o033', cp: 'cp9', kind: 'technique', project: 'GamerChallenge',
    question: 'Comment avez-vous vérifié l’absence de double crédit des points ?',
    answer: 'Le membre commence avec 100 points et la récompense vaut 50. Valider donne 150 ; répéter laisse 150. Retirer donne 100 ; répéter laisse 100. Deux demandes simultanées, avec un délai réservé au test, ont produit une attente de verrou observée et un total final de 150. Un échec forcé du crédit a laissé pending et 100 : la transaction a annulé le statut.',
    expected: ['100 → 150 → 150', '150 → 100 → 100', 'Concurrence et verrou observé', 'Échec forcé et rollback'],
    followup: 'Un test de répétition séquentielle suffit-il à prouver la sécurité de deux requêtes simultanées ?',
    source: `${slides}, R10 et Q3 ; REAC p. 35-36`
  },
  {
    id: 'o034', cp: 'cp9', kind: 'technique', project: 'GamerChallenge',
    question: 'Quel plan de tests compléterait les vérifications locales déjà réalisées ?',
    answer: 'Je relie chaque parcours à ses cas nominaux, refus, erreurs et frontières. Je complète la recette OAuth et IGDB réels sur une instance dédiée, les transitions des deux entrées de soumission et les états de l’interface. Je prévois aussi accessibilité, charge et acceptation utilisateur selon les risques. Pour chaque campagne, je note qui, quand, environnement, entrée, attendu, obtenu et écart ; les tests envisagés ne sont pas des résultats acquis.',
    expected: ['Couverture des parcours et risques', 'Fournisseurs réels', 'Sécurité, charge et acceptation', 'Traçabilité attendu-obtenu'],
    followup: 'Quel serait votre premier test après avoir harmonisé les deux routes de soumission ?',
    source: `${slides}, Q2 et Q5 ; REAC p. 35-36`
  },
  {
    id: 'o035', cp: 'cp9', kind: 'final', project: 'IACrea',
    question: 'Que démontre le rapport de géométrie IACrea et quelle prudence gardez-vous ?',
    answer: 'Le rapport Xcode conservé du 7 septembre 2026 indique 52 tests réussis de FloorPlanGeometryTests. Ils concernent notamment longueurs, surfaces, projection, orientation et matrices invalides, avec des tolérances numériques. J’ai contribué à des évolutions et des cas en août. Je dois préciser la répartition et la personne ayant exécuté la campagne ; ce rapport n’est pas une recette complète de l’application.',
    expected: ['52 tests et suite précise', 'Géométrie et tolérances', 'Contribution personnelle à préciser', 'Périmètre du rapport'],
    followup: 'Pourquoi une comparaison stricte à zéro peut-elle être fragile pour un résultat géométrique ?',
    source: `${dp}, fiche « Tester la géométrie des plans dans IACrea HDR »`
  },
  {
    id: 'o036', cp: 'cp10', kind: 'projet', project: 'GamerChallenge',
    question: 'Quels éléments de livraison avez-vous réellement vérifiés ?',
    answer: 'Les images backend et frontend ont été construites et le frontend Nginx a été lancé en isolation. nginx -t réussit et les liens directs React renvoient 200. Le proxy a été testé avec un serveur Bun local : chemin, méthode, corps, hôte, protocole et cookies. Compose a été validé sans fichier .env. Ce sont des preuves locales de préparation ; l’hébergement et les fournisseurs réels restent distincts.',
    expected: ['Images construites', 'Nginx et routes React', 'Transmission par le proxy', 'Préparation locale et étape externe'],
    followup: 'Pourquoi /leaderboard doit-il pouvoir être ouvert directement dans le navigateur ?',
    source: `${slides}, Q4 ; REAC p. 37`
  },
  {
    id: 'o037', cp: 'cp10', kind: 'technique', project: 'GamerChallenge',
    question: 'Que doit contenir une procédure de déploiement utilisable par un collègue ?',
    answer: 'Je précise cible, versions, dépendances et configuration, puis les étapes de sauvegarde, migration, lancement et contrôle. Les secrets doivent être fournis par le mécanisme choisi pour l’environnement. Je définis une vérification métier après démarrage et le retour arrière compatible avec la base. Dans le projet, versions fixées et migrations séparées du lancement restent des priorités à formaliser.',
    expected: ['Cible, versions et configuration', 'Sauvegarde et migration', 'Contrôles après lancement', 'Retour arrière compatible avec les données'],
    followup: 'Pourquoi revenir à une ancienne image ne suffit-il pas toujours après une migration destructive ?',
    source: `${slides}, Q4-Q5 ; REAC p. 37`
  },
  {
    id: 'o038', cp: 'cp10', kind: 'technique', project: 'GamerChallenge',
    question: 'Quelle preuve de sauvegarde et restauration pouvez-vous présenter ?',
    answer: 'Le jeu de la recette PostgreSQL a été sauvegardé puis restauré dans une seconde base. Les comptes des tables et les valeurs métier comparées sont identiques. C’est un contrôle local concret de restauration. Il ne prouve pas une politique de sauvegarde de production, une fréquence automatisée ou un délai de reprise garanti ; ces points doivent être définis pour l’hébergement choisi.',
    expected: ['Sauvegarde du jeu local', 'Restauration dans une autre base', 'Comparaisons de valeurs et comptes', 'Limite face à la production'],
    followup: 'Qu’ajouteriez-vous pour tester une reprise après perte complète du serveur ?',
    source: `${slides}, Q3 ; ${relecture} ; REAC p. 37`
  },
  {
    id: 'o039', cp: 'cp10', kind: 'final', project: 'OQuiz',
    question: 'Quelle différence existe entre vos supports Docker OQuiz et un déploiement démontré ?',
    answer: 'Le DP décrit Dockerfile, Compose, PostgreSQL, API, client, Nginx, réseau et volume. Ils expliquent le démarrage prévu et la persistance. La fiche laisse à compléter mes commandes, la procédure adaptée, la cible, le contrôle après installation et le retour arrière. Je présente ces supports comme préparation et n’affirme une exécution qu’avec son résultat et son environnement.',
    expected: ['Services et réseau', 'Volume PostgreSQL', 'Procédure et cible', 'Preuve d’exécution à compléter'],
    followup: 'Quelle différence pratique faites-vous entre un volume de données et une image Docker ?',
    source: `${dp}, fiche « Préparer et documenter un déploiement »`
  },
  {
    id: 'o040', cp: 'cp11', kind: 'projet', project: 'GamerChallenge',
    question: 'Que vérifie votre chaîne d’intégration et quel livrable produit-elle réellement ?',
    answer: 'Le workflow vérifie les types, exécute les tests et construit le frontend avant la synchronisation Git. Ces commandes ont aussi été exécutées localement sur la révision. Je distingue ce résultat local du journal d’une exécution sur un serveur d’automatisation. La synchronisation du dépôt ne publie pas à elle seule les images et ne démarre pas une application chez un hébergeur.',
    expected: ['Typage, tests et build', 'Synchronisation après contrôles', 'Local versus serveur CI', 'Publication et déploiement distincts'],
    followup: 'Que doit-il se passer si les tests échouent avant la synchronisation ?',
    source: `${slides}, Q4 ; REAC p. 39-40`
  },
  {
    id: 'o041', cp: 'cp11', kind: 'technique', project: 'Transversal',
    question: 'Comment analysez-vous un pipeline qui échoue à l’étape des tests ?',
    answer: 'Je repère la première étape en échec et lis le message ainsi que l’environnement. Je distingue installation, typage, test métier et dépendance externe. Je reproduis avec les versions et données comparables, corrige la cause puis relance les contrôles concernés. Je n’ignore pas un test pour rendre l’indicateur vert ; je documente une vraie modification du périmètre si elle est nécessaire.',
    expected: ['Première erreur pertinente', 'Environnement et catégorie de panne', 'Reproduction', 'Correction et nouvelle vérification'],
    followup: 'Si le test passe sur votre poste mais échoue en CI, quelles différences examinez-vous ?',
    source: `${dp}, fiche OQuiz intégration continue ; REAC p. 39-40`
  },
  {
    id: 'o042', cp: 'cp11', kind: 'final', project: 'OQuiz',
    question: 'Comment décrivez-vous honnêtement le workflow OQuiz présent dans votre DP ?',
    answer: 'Le support api-ci-cours.yml prévoit push ou demande de fusion vers main, Ubuntu, Node.js 22, installation des dépendances, génération Prisma et tests de l’API. Je peux expliquer ces étapes. L’exécution conservée, l’interprétation de ses résultats et un problème personnellement corrigé restent à compléter dans la fiche. La présence du YAML ne suffit pas à dire que le pipeline a réussi.',
    expected: ['Déclencheurs', 'Environnement et dépendances', 'Prisma puis tests', 'Preuves d’exécution à compléter'],
    followup: 'Pourquoi générer le client Prisma avant de lancer des tests qui l’importent ?',
    source: `${dp}, fiche « Contribuer à une intégration continue »`
  },
  {
    id: 'o043', cp: 'cp11', kind: 'technique', project: 'Transversal',
    question: 'Comment organiseriez-vous votre veille sécurité pour qu’elle produise des actions ?',
    answer: 'Je suis les avis des éditeurs et les recommandations techniques utiles à ma pile, puis je relie chaque alerte à une dépendance ou un usage réel. Je note version touchée, exposition, priorité et correction ou mesure proposée. Je teste la mise à jour et conserve son résultat. Cette organisation est une proposition d’amélioration : je présente une veille effectuée seulement avec une trace réelle.',
    expected: ['Sources techniques pertinentes', 'Version et exposition du projet', 'Priorité et action', 'Test et trace de décision'],
    followup: 'Quelle différence faites-vous entre une dépendance vulnérable et un scénario exploitable dans votre application ?',
    source: `${slides}, Q5 ; REAC p. 39-40`
  },
  {
    id: 'o044', cp: 'cp4', kind: 'final', project: 'Transversal',
    question: 'À quoi servent respectivement votre dossier de projet et votre dossier professionnel ?',
    answer: 'Le dossier de projet explique le besoin, la conception, mes réalisations et les vérifications du projet présenté. Le DP illustre ma pratique à travers plusieurs situations, dont Oddit, OQuiz et IACrea. L’entretien technique part du dossier de projet et peut compléter des compétences ; l’entretien final inclut le DP et ma vision du métier. Une zone « à compléter » reste une action à faire, pas une preuve acquise.',
    expected: ['Rôle du dossier de projet', 'Situations du DP', 'Technique et entretien final', 'Éléments incomplets identifiés'],
    followup: 'Quelle situation du DP complète une compétence moins visible dans Gamer Challenges ?',
    source: `${dp} ; ${referentiel}, RE p. 4 et 39`
  },
  {
    id: 'o045', cp: 'cp9', kind: 'final', project: 'GamerChallenge',
    question: 'Quelle difficulté et quel apprentissage technique retenez-vous du parcours de preuve ?',
    answer: 'Je peux choisir la cohérence entre statut et points comme fil conducteur : des validations répétées ou concurrentes ne doivent pas multiplier la récompense. J’explique la transaction, le verrou et les essais attendus-obtenus. Je distingue mon développement initial des corrections de la révision, ainsi que les campagnes de vérification de la conception collective. Je reformule ce bilan avec un épisode réellement vécu.',
    expected: ['Difficulté concrète', 'Risque métier', 'Solution et vérification', 'Périmètre personnel honnête'],
    followup: 'Quelle décision prendriez-vous différemment en recommençant le projet ?',
    source: `${slides}, R10, Q3 et Q6 ; ${contributions}`
  },
  {
    id: 'o046', cp: 'cp8', kind: 'final', project: 'Transversal',
    question: 'Comment répondez-vous si le jury vous demande un point peu pratiqué, par exemple NoSQL ?',
    answer: 'Je situe ce que j’ai réellement manipulé : Gamer Challenges utilise PostgreSQL, et le service de logs MongoDB a été étudié avec OQuiz. J’explique une validation, une opération ou un filtre que je maîtrise, puis sa limite. Si je ne connais pas un détail, je le dis et décris comment je vérifierais. Je complète avant l’examen la manipulation personnelle laissée ouverte dans le DP.',
    expected: ['Périmètre connu', 'Exemple expliqué', 'Limite reconnue', 'Méthode de vérification et préparation'],
    followup: 'Que change l’utilisation de documents MongoDB dans la façon de modéliser des logs ?',
    source: `${dp}, fiche OQuiz SQL et NoSQL ; REAC p. 33-34`
  },
  {
    id: 'o047', cp: 'cp3', kind: 'final', project: 'GamerChallenge',
    question: 'Quelles limites produit faut-il annoncer clairement au jury ?',
    answer: 'Google et Twitch sont raccordés ; le parcours email/mot de passe est incomplet. Les commentaires, notifications et parcours supplémentaires restent des évolutions. Deux soumissions coexistent avec des contrôles différents ; le badge de première participation ne se déclenche pas sur le parcours principal. Le compte affiche des défis actifs généraux. Je présente l’existant et une priorité concrète plutôt que tout le périmètre initial comme terminé.',
    expected: ['Authentification réellement raccordée', 'Fonctions futures', 'Deux soumissions et badges', 'Compte et priorité d’évolution'],
    followup: 'Quelle harmonisation apporterait le plus de cohérence au parcours d’un membre ?',
    source: `${slides}, R05-R06 et Q5 ; ${conception}, C.4`
  },
  {
    id: 'o048', cp: 'cp10', kind: 'final', project: 'Transversal',
    question: 'Comment conclure votre présentation sans surestimer l’état de livraison ?',
    answer: 'Je rappelle le besoin, le travail collectif et mes réalisations, puis les résultats locaux obtenus. Je cite un cas significatif, comme l’absence de double crédit, et une limite encore ouverte. La prochaine étape est la recette réelle d’OAuth, IGDB et de l’environnement de publication, avec une procédure de livraison maîtrisée. Je n’annonce pas une production dont je n’ai pas la preuve.',
    expected: ['Besoin et rôle', 'Réalisation concrète', 'Résultat vérifié et limite', 'Prochaine étape de livraison'],
    followup: 'Quel critère vous ferait accepter ou refuser l’ouverture au public ?',
    source: `${slides}, Q4-Q6 ; ${relecture}`
  }
];

// Les extraits ci-dessous sont des supports pédagogiques originaux, pas des
// copies de documentations éditeurs. QCU FR + réponses ouvertes EN reproduisent
// les types de questions du RE ; les deux rédactions FR sont des bonus.
export const writtenExercises = [
  {
    id: 'w001', language: 'fr', format: 'qcu', cp: 'cp1',
    prompt: 'Quelle action permet de retrouver les dépendances prévues par le projet sur un nouveau poste ?',
    context: 'Setup guide: Install the required runtime version. Use the project lockfile when installing dependencies. Do not update all packages during the first setup. Then run the type checks and the tests.',
    choices: ['Installer les dépendances en respectant le fichier de verrouillage du projet.', 'Mettre à jour toutes les dépendances avant le premier démarrage.', 'Copier uniquement les fichiers générés depuis un autre poste.', 'Ignorer la version du moteur si le code est en TypeScript.'],
    correctIndex: 0,
    explanation: 'Le support demande de respecter la version du moteur et le fichier de verrouillage, puis de vérifier le projet.',
    sample: 'Je choisis l’installation avec le fichier de verrouillage. Elle permet de retrouver les versions prévues ; je lance ensuite le typage et les tests.',
    criteria: ['Repérer lockfile', 'Distinguer installation et mise à jour', 'Respecter le support'],
    vocabulary: [{ term: 'lockfile', translation: 'fichier de verrouillage' }, { term: 'runtime', translation: 'moteur d’exécution' }]
  },
  {
    id: 'w002', language: 'fr', format: 'qcu', cp: 'cp1',
    prompt: 'Où faut-il fournir la clé du service distant selon ce guide ?',
    context: 'Configuration guide: The backend needs an API secret. Provide this secret through the server environment. Never include it in browser code or commit it to the repository. Restart the service after changing its configuration.',
    choices: ['Dans un composant React pour faciliter les appels.', 'Dans une capture jointe à la documentation publique.', 'Dans l’environnement du serveur, hors du dépôt.', 'Dans le nom du conteneur pour le retrouver facilement.'],
    correctIndex: 2,
    explanation: 'Le secret doit être disponible pour le backend, sans être distribué dans le navigateur ou le dépôt.',
    sample: 'Je fournis la clé dans l’environnement du serveur. Le navigateur et le dépôt ne doivent pas contenir cette valeur sensible.',
    criteria: ['Identifier backend', 'Protection du secret', 'Comprendre la configuration'],
    vocabulary: [{ term: 'secret', translation: 'valeur secrète' }, { term: 'repository', translation: 'dépôt' }]
  },
  {
    id: 'w003', language: 'fr', format: 'qcu', cp: 'cp7',
    prompt: 'Quelle garantie empêche deux abonnements identiques lorsque deux demandes arrivent en même temps ?',
    context: 'Database design note: Each subscription links one profile to one challenge. The database has a unique constraint on the pair profile_id and challenge_id. The controller also checks existing subscriptions to return a useful response.',
    choices: ['Le texte du bouton dans le formulaire.', 'La contrainte d’unicité du couple dans la base.', 'Le format JSON de la réponse HTTP.', 'Le tri par date des abonnements.'],
    correctIndex: 1,
    explanation: 'La contrainte protège les écritures, même si deux demandes passent un contrôle applicatif au même moment.',
    sample: 'La contrainte d’unicité en base empêche deux lignes ayant le même profil et le même défi.',
    criteria: ['Identifier unique constraint', 'Comprendre le couple', 'Distinguer base et interface'],
    vocabulary: [{ term: 'unique constraint', translation: 'contrainte d’unicité' }, { term: 'pair', translation: 'couple' }]
  },
  {
    id: 'w004', language: 'fr', format: 'qcu', cp: 'cp7',
    prompt: 'Quel résultat attend-on si l’écriture des points échoue dans cette transaction ?',
    context: 'Transaction note: Updating a participation status and crediting its reward are part of the same transaction. If one statement fails, roll back the transaction. A successful commit makes both changes permanent.',
    choices: ['Conserver le nouveau statut et supprimer le profil.', 'Valider le statut mais différer les points sans contrôle.', 'Exécuter de nouveau uniquement la lecture.', 'Annuler les changements de statut et de points de la transaction.'],
    correctIndex: 3,
    explanation: 'Le rollback annule les changements effectués dans la transaction pour préserver la cohérence.',
    sample: 'Les deux opérations sont annulées. Une preuve ne doit pas rester validée par cette transaction si son crédit a échoué.',
    criteria: ['Comprendre same transaction', 'Identifier rollback', 'Relier au résultat métier'],
    vocabulary: [{ term: 'roll back', translation: 'annuler la transaction' }, { term: 'commit', translation: 'valider la transaction' }]
  },
  {
    id: 'w005', language: 'fr', format: 'qcu', cp: 'cp7',
    prompt: 'Que signifie RESTRICT sur la suppression d’un jeu encore référencé ?',
    context: 'Foreign key note: A challenge refers to a game. The game relation uses ON DELETE RESTRICT. You cannot remove a game while existing challenges still refer to it. Review the related records before changing this rule.',
    choices: ['La suppression est refusée tant que des défis référencent ce jeu.', 'Les défis sont automatiquement convertis en profils.', 'La base supprime tous les jeux à chaque fermeture de défi.', 'La clé étrangère est ignorée lors de la suppression.'],
    correctIndex: 0,
    explanation: 'La règle protège la relation en refusant une suppression qui laisserait des références incohérentes.',
    sample: 'La suppression du jeu est refusée si des défis le référencent encore.',
    criteria: ['Comprendre refers to', 'Identifier la suppression refusée', 'Respecter la relation'],
    vocabulary: [{ term: 'foreign key', translation: 'clé étrangère' }, { term: 'record', translation: 'enregistrement' }]
  },
  {
    id: 'w006', language: 'fr', format: 'qcu', cp: 'cp11',
    prompt: 'Que doit faire ce pipeline lorsqu’un test échoue ?',
    context: 'Pipeline guide: Run type checks, tests and the frontend build before syncing the code. Stop the pipeline if a required step fails. Read the first useful error and fix the cause before running the pipeline again.',
    choices: ['Continuer la synchronisation puis lire l’erreur plus tard.', 'Supprimer tous les tests du dépôt.', 'Arrêter la chaîne et corriger la cause avant de relancer.', 'Déclarer la livraison réussie si le dépôt reste accessible.'],
    correctIndex: 2,
    explanation: 'La synchronisation suit les contrôles obligatoires ; un échec doit bloquer la suite prévue.',
    sample: 'Le pipeline doit s’arrêter. J’analyse l’erreur, corrige sa cause puis relance les vérifications.',
    criteria: ['Ordre des étapes', 'Échec bloquant', 'Lecture des erreurs'],
    vocabulary: [{ term: 'required step', translation: 'étape obligatoire' }, { term: 'fails', translation: 'échoue' }]
  },
  {
    id: 'w007', language: 'fr', format: 'qcu', cp: 'cp11',
    prompt: 'Quelle conclusion est justifiée par les résultats décrits ?',
    context: 'Test report: The local controller tests use fake identities and fake catalogue responses. The PostgreSQL tests use a real local database. All listed checks pass. Login with the real external providers has not been tested in this campaign.',
    choices: ['Les fournisseurs OAuth réels sont tous validés.', 'Les contrôles locaux passent, mais la connexion aux fournisseurs réels reste à vérifier.', 'Aucune base de données n’a été utilisée.', 'Le site est forcément déjà publié en production.'],
    correctIndex: 1,
    explanation: 'Le rapport distingue clairement simulation des services, base locale réelle et recette externe absente.',
    sample: 'La campagne valide son périmètre local. Elle ne prouve pas la connexion avec les vrais fournisseurs externes.',
    criteria: ['Lire fake et real', 'Distinguer les périmètres', 'Éviter une conclusion excessive'],
    vocabulary: [{ term: 'fake identity', translation: 'identité simulée' }, { term: 'provider', translation: 'fournisseur' }]
  },
  {
    id: 'w008', language: 'fr', format: 'qcu', cp: 'cp11',
    prompt: 'Quel élément supplémentaire manque pour conclure à une mise en production ?',
    context: 'Release note: The CI workflow checks the code and builds the frontend. It then syncs the repository. It does not publish container images or start services on the hosting platform. These actions belong to a separate deployment procedure.',
    choices: ['Renommer le dossier contenant les captures.', 'Ajouter un commentaire dans le fichier de verrouillage.', 'Conserver uniquement les maquettes du produit.', 'Exécuter et vérifier la procédure de déploiement sur la plateforme cible.'],
    correctIndex: 3,
    explanation: 'Un build et une synchronisation préparent la livraison ; l’exécution sur la cible doit être démontrée séparément.',
    sample: 'Il faut déployer les livrables sur la cible et vérifier les services et les parcours après le lancement.',
    criteria: ['Distinguer CI et déploiement', 'Identifier la cible', 'Vérification après lancement'],
    vocabulary: [{ term: 'hosting platform', translation: 'plateforme d’hébergement' }, { term: 'deployment', translation: 'déploiement' }]
  },
  {
    id: 'w009', language: 'en', format: 'writing', cp: 'cp1',
    prompt: 'Explain why the backend needs a separate environment configuration. Write three short sentences.',
    context: 'Setup note: The backend connects to the database and the game catalogue. Each environment has its own connection settings. Secret values must stay on the server and outside the Git repository.',
    sample: 'The backend needs connection settings for the database and the game catalogue. Development and production can use different values. I keep secret values on the server and outside the Git repository.',
    criteria: ['Réponse en anglais', 'Deux dépendances citées', 'Différence des environnements', 'Secrets côté serveur'],
    vocabulary: [{ term: 'connection settings', translation: 'paramètres de connexion' }, { term: 'outside', translation: 'à l’extérieur de' }]
  },
  {
    id: 'w010', language: 'en', format: 'writing', cp: 'cp1',
    prompt: 'Describe the first checks you would run after installing the project. Use the guide and write three short sentences.',
    context: 'Installation guide: Check the runtime version. Install dependencies using the lockfile. Run type checks and tests. Start the application and check that a public page and the API respond.',
    sample: 'First, I check the runtime version and install the dependencies using the lockfile. Then I run the type checks and the tests. Finally, I start the application and check the public page and the API.',
    criteria: ['Réponse en anglais', 'Ordre cohérent', 'Version et dépendances', 'Contrôles après démarrage'],
    vocabulary: [{ term: 'dependencies', translation: 'dépendances' }, { term: 'type checks', translation: 'vérifications du typage' }]
  },
  {
    id: 'w011', language: 'en', format: 'writing', cp: 'cp7',
    prompt: 'Explain the difference between a subscription and a participation. Write two to four short sentences.',
    context: 'Data model note: A subscription means that a member joins a challenge. A participation contains a video link and a status. A new participation is pending. Reward points are added only when an administrator validates it.',
    sample: 'A subscription means that a member joins a challenge. A participation contains the video proof and its status. A new proof is pending and does not give points. An administrator must validate it before the reward is added.',
    criteria: ['Réponse en anglais', 'Abonnement et preuve distingués', 'Statut initial', 'Validation et points'],
    vocabulary: [{ term: 'pending', translation: 'en attente' }, { term: 'reward', translation: 'récompense' }]
  },
  {
    id: 'w012', language: 'en', format: 'writing', cp: 'cp7',
    prompt: 'Why must status and reward changes use the same transaction? Write three short sentences.',
    context: 'Database note: The server updates the participation status and the profile points in one transaction. If the points update fails, both changes are rolled back. Repeating a successful validation must not add the reward again.',
    sample: 'The status and the points must stay consistent. If the points update fails, the transaction rolls back both changes. Repeating the validation must not add the reward a second time.',
    criteria: ['Réponse en anglais', 'Cohérence métier', 'Rollback des deux opérations', 'Absence de double crédit'],
    vocabulary: [{ term: 'consistent', translation: 'cohérent' }, { term: 'a second time', translation: 'une deuxième fois' }]
  },
  {
    id: 'w013', language: 'en', format: 'writing', cp: 'cp11',
    prompt: 'Summarise this test result and name one remaining check. Write three or four short sentences.',
    context: 'Local test report: A member starts with 100 points. Validating a proof worth 50 points gives 150 points. Repeating the validation keeps 150 points. OAuth identities are simulated, so login with a real provider still needs a separate test.',
    sample: 'The first validation increases the total from 100 to 150 points. The second validation keeps the total at 150 points. This checks that the reward is not added twice. We still need to test login with a real OAuth provider.',
    criteria: ['Réponse en anglais', '100 et 150 correctement utilisés', 'Répétition expliquée', 'Limite OAuth citée'],
    vocabulary: [{ term: 'increases', translation: 'augmente' }, { term: 'separate test', translation: 'test distinct' }]
  },
  {
    id: 'w014', language: 'en', format: 'writing', cp: 'cp11',
    prompt: 'A pipeline fails during the test step. Describe your next actions in three short sentences.',
    context: 'CI guide: Stop when a required check fails. Read the first useful error message. Compare the CI environment with your local setup. Reproduce the issue, fix the cause and run the checks again before releasing.',
    sample: 'I stop the release and read the first useful error message. I compare the CI environment with my local setup and reproduce the issue. Then I fix the cause and run the checks again.',
    criteria: ['Réponse en anglais', 'Arrêt et lecture du message', 'Comparaison des environnements', 'Correction puis vérification'],
    vocabulary: [{ term: 'issue', translation: 'problème' }, { term: 'release', translation: 'livraison' }]
  },
  {
    id: 'w015', language: 'en', format: 'writing', cp: 'cp11',
    prompt: 'Explain why building an image is not enough to prove a successful deployment. Write three short sentences.',
    context: 'Deployment checklist: Build the image, provide the target configuration and start the service. Check the health endpoint and a useful user action. Keep a rollback procedure ready. A successful local build only proves that the image can be created.',
    sample: 'A local build proves that the image can be created. We also need to start the service with the target configuration. Then we check its health and a useful user action, and keep a rollback procedure ready.',
    criteria: ['Réponse en anglais', 'Build distinct du démarrage', 'Configuration cible', 'Contrôle et retour arrière'],
    vocabulary: [{ term: 'health endpoint', translation: 'point de contrôle de disponibilité' }, { term: 'rollback procedure', translation: 'procédure de retour arrière' }]
  },
  {
    id: 'w016', language: 'en', format: 'writing', cp: 'cp11',
    prompt: 'What should you check before updating a vulnerable dependency? Write three or four short sentences.',
    context: 'Security update note: Read the advisory and identify the affected versions. Check whether your application uses the affected feature. Choose a supported fix and test it in a separate environment. Keep the test result and the deployment plan.',
    sample: 'I read the advisory and check the affected versions. Then I check whether my application uses the affected feature. I test a supported fix in a separate environment. I keep the test result and prepare the deployment plan.',
    criteria: ['Réponse en anglais', 'Versions concernées', 'Exposition réelle de l’application', 'Test et trace du résultat'],
    vocabulary: [{ term: 'advisory', translation: 'avis de sécurité' }, { term: 'affected versions', translation: 'versions concernées' }]
  },
  {
    id: 'w017', language: 'fr', format: 'writing', bonus: true, cp: 'cp9',
    prompt: 'Bonus rédaction : présentez en cinq lignes un test de soumission sans abonnement, avec entrée, attendu, obtenu et limite.',
    context: 'Support pédagogique : un membre authentifié utilise un défi actif et une vidéo admissible, mais n’est pas abonné. Le parcours principal refuse avec 400. La campagne PostgreSQL vérifie qu’aucune participation n’est créée. Les identités sont préparées pour le test.',
    sample: 'Le membre est authentifié et le défi est actif, mais aucun abonnement n’existe. J’envoie une preuve vidéo admissible au parcours principal. J’attends 400 et aucune nouvelle participation. La recette locale PostgreSQL obtient ce refus et confirme l’absence de ligne. Ce résultat ne valide pas une connexion OAuth réelle.',
    criteria: ['Préconditions', 'Entrée et action', 'Attendu et obtenu', 'Limite du test'],
    vocabulary: [{ term: 'expected result', translation: 'résultat attendu' }, { term: 'actual result', translation: 'résultat obtenu' }]
  },
  {
    id: 'w018', language: 'fr', format: 'writing', bonus: true, cp: 'cp10',
    prompt: 'Bonus rédaction : rédigez une courte note de livraison distinguant vérifications locales et actions encore nécessaires.',
    context: 'Support pédagogique : images construites, nginx -t réussi, routes React et proxy testés localement. Fournisseurs OAuth et catalogue externe simulés dans les essais. Hébergement, domaine et configuration réelle restent à recetter.',
    sample: 'Les images sont construites et Nginx est validé localement. Les liens directs React et la transmission par le proxy ont été vérifiés. Les essais utilisent des identités OAuth et des réponses de catalogue simulées. Avant publication, il faut configurer l’environnement cible et recetter les fournisseurs réels. Les contrôles après démarrage et le retour arrière doivent être documentés.',
    criteria: ['Résultats locaux précis', 'Simulations mentionnées', 'Cible et recette réelle', 'Contrôle et retour arrière'],
    vocabulary: [{ term: 'deployment target', translation: 'cible de déploiement' }, { term: 'release notes', translation: 'notes de livraison' }]
  }
];

// Adaptation pédagogique du diaporama existant : les dix séquences totalisent
// exactement 40 minutes. Ajuster son rythme par une répétition à voix haute.
export const presentationPlan = [
  { title: 'Ouvrir et annoncer le fil conducteur', minutes: 1, objective: 'Présenter le projet, son auteur et le parcours de preuve.', prompts: ['Quel besoin satisfait Gamer Challenges ?', 'Pourquoi suivre une preuve jusqu’à ses points ?'], evidence: 'COUV et PLAN : travail à quatre, besoin, conception puis réalisations et vérifications.' },
  { title: 'Expliquer le besoin et la conception collective', minutes: 6, objective: 'Situer acteurs, périmètre, rôle personnel et architecture.', prompts: ['Visiteur, membre ou administrateur : qui fait quoi ?', 'Quelles décisions produit avez-vous proposées ?', 'Quels documents sont collectifs et quels écarts ont évolué ?'], evidence: 'C1 à C6 : acteurs, équipe, chronologie, wireframe, maquette et architecture actuelle.' },
  { title: 'Montrer les interfaces et le catalogue IGDB', minutes: 5, objective: 'Relier expérience utilisateur, appels asynchrones et service serveur.', prompts: ['Expliquez deux caractères, 300 ms et annulation.', 'Pourquoi distinguer erreur et aucun résultat ?', 'Quel jeton sert au catalogue et où est-il conservé ?'], evidence: 'R01 et R02 : formulaire React, contexte FR/EN, cache du jeton applicatif et résultats normalisés.' },
  { title: 'Relier identité et modèle de données', minutes: 4, objective: 'Montrer où commencent les droits et les garanties de persistance.', prompts: ['Pourquoi auth.users et profiles ?', 'Comment la session et le bannissement sont-ils vérifiés ?', 'Abonnement, preuve et vote : quelles relations et unicités ?'], evidence: 'R03 et R04 : requireAuth, requireAdmin de Marco, schéma actuel et 0,N.' },
  { title: 'Suivre les droits et le dépôt de preuve', minutes: 4, objective: 'Faire comprendre les règles métier et les limites du parcours.', prompts: ['Qui peut modifier le défi ?', 'Que vérifie la soumission principale ?', 'Pourquoi pending ne donne pas de points ?', 'Quelles différences avec /participations ?'], evidence: 'R05 et R06 : canManageChallenge, abonnement, domaines vidéo, auteurs et badge de première participation.' },
  { title: 'Expliquer classements et console', minutes: 4, objective: 'Relier données agrégées, filtres et actions visibles.', prompts: ['Quelles participations entrent dans le classement ?', 'Quelle date fait entrer une preuve dans le mois ?', 'Pourquoi un joueur peut-il avoir plusieurs lignes ?', 'Quel retour voit l’administrateur ?'], evidence: 'R07 à R09 : jointures, agrégations, updatedAt/createdAt et chargements de la console.' },
  { title: 'Démontrer la cohérence des points', minutes: 4, objective: 'Expliquer transaction, verrou et répétition sans double crédit.', prompts: ['À quel moment ajoute-t-on ou retire-t-on la récompense ?', 'Pourquoi FOR UPDATE ?', 'Que doit produire une erreur pendant le crédit ?'], evidence: 'R10 : traitement commun des statuts, transaction et séquences 100→150→150 puis 150→100→100.' },
  { title: 'Présenter sécurité et résultats obtenus', minutes: 7, objective: 'Distinguer contrôles, simulations et essais réellement exécutés.', prompts: ['Comment le profil refuse-t-il role et points ?', 'Que prouvent les 127 tests ?', 'Quel cas attendu-obtenu illustre la soumission ?', 'Que montrent concurrence, rollback et restauration ?'], evidence: 'Q1 à Q3 : contrôles de profil et cookies, 19 vérifications PostgreSQL et limites OAuth/IGDB.' },
  { title: 'Situer la préparation de livraison', minutes: 3, objective: 'Présenter images, Nginx, proxy et chaîne de validation.', prompts: ['Quels éléments ont été exécutés localement ?', 'Que vérifie le workflow avant synchronisation ?', 'Quelles opérations restent sur la cible ?'], evidence: 'Q4 : images et proxy locaux, typage/tests/build, configuration externe et publication à réaliser.' },
  { title: 'Conclure et prioriser', minutes: 2, objective: 'Faire ressortir une réalisation, un apprentissage et les prochaines étapes.', prompts: ['Quel résultat concret retenez-vous ?', 'Quelle limite faut-il traiter en priorité ?', 'Quelle recette externe prépare la suite ?'], evidence: 'Q5 et Q6 : harmonisation des parcours, fournisseurs réels, versions/migrations et bilan personnel honnête.' }
];

export const projectFacts = [
  { title: 'Deux dossiers, deux usages', body: 'Le dossier de projet présente Gamer Challenges, sa conception, les réalisations et les vérifications. Le DP rassemble des situations de pratique dans Oddit, OQuiz et IACrea, notamment pour compléter des compétences moins visibles dans ce projet. L’entretien final inclut le DP.', source: `${dp} ; ${referentiel}, RE p. 4 et 39` },
  { title: 'Le format exact du questionnaire', body: 'Le RE CDA millésime 04 indique une documentation technique en anglais, deux questions fermées à choix unique posées en français et deux questions ouvertes posées en anglais avec réponses courtes en anglais. La session dure 30 minutes. Les rédactions FR de ce site sont des bonus ; la simulation choisit deux QCU FR et deux ouvertes EN.', source: `${referentiel}, RE p. 4 (page extraite 54)` },
  { title: 'Conception collective, réalisations attribuées', body: 'Cahier des charges, modèles et maquettes sont collectifs. Maël présente identité, données, défis, classements, interfaces et administration. Samy a développé les votes ; Marco a notamment développé badges, requireAdmin et la soumission alternative. Un auteur Git ou un commit de documentation ne prouve pas seul qui a imaginé une décision.', source: `${slides}, C3 ; ${contributions}, method et collective_boundaries` },
  { title: 'Conception initiale et fonctionnement actuel', body: 'Le seuil de votes prévu initialement ne valide pas automatiquement les preuves actuelles : la décision est administrative. Rejoindre est un abonnement ; déposer crée une participation pending ; valider fait évoluer les points. Le MCD initial indiquait 1,N côté profil ; le modèle courant autorise 0,N.', source: `${conception}, C.6 et E.1 ; ${slides}, R04 et R10` },
  { title: 'Attention aux dates des preuves', body: 'L’analyse historique des contributions mentionne 91 cas déclarés et un risque de mise à jour du profil. La révision d’octobre décrit la liste de champs autorisés, des statuts harmonisés et 127 tests backend réussis. Pour expliquer l’état actuel, privilégier les réalisations, le diaporama et la relecture révisés, sans transformer tous les travaux de révision en contributions historiques personnelles.', source: `${contributions}, statistics et material_limits_for_dossier ; ${slides}, Q1-Q3 ; ${relecture}` },
  { title: 'Ce qui a été réellement vérifié', body: 'Les campagnes des 3 et 4 octobre recensent 127 tests backend, 19 vérifications PostgreSQL, six scénarios de cookies, des interactions React, les images et Nginx. La base et les transactions sont réelles. Les identités OAuth et les réponses IGDB sont simulées. La recette des fournisseurs et de l’hébergement réels reste à effectuer.', source: `${relecture} ; ${slides}, Q2-Q4` },
  { title: 'Les limites produit à savoir expliquer', body: 'Deux routes de soumission subsistent avec des contrôles différents ; le badge de première participation se déclenche sur l’alternative. Les commentaires et notifications restent des évolutions, et email/mot de passe est incomplet. L’auto-vote est autorisé. Après suppression d’un compte, les votes sont supprimés mais les compteurs déjà reçus sur les autres preuves sont conservés selon le choix produit.', source: `${slides}, R06 et Q5 ; ${conception}, C.4 et E.2 ; ${relecture}` },
  { title: 'Le DP conserve des éléments à compléter', body: 'Les fiches signalent explicitement des précisions à apporter : contexte et suivi IACrea, preuve personnelle NoSQL, maquettage OQuiz, procédure de déploiement et exécution CI. Le rapport IACrea de 52 tests de géométrie réussis ne constitue pas une recette complète et n’établit pas seul qui a lancé la campagne.', source: `${dp}, fiches IACrea, OQuiz et DevOps` }
];

export const examFormat = [
  { id: 'presentation', title: 'Présentation du projet', minutes: 40, description: 'Présenter les projets avec le dossier et le diaporama. Le plan proposé ici est une adaptation pédagogique en dix séquences de 40 minutes au total. Source : O’clock transmis par l’utilisateur, confirmé par le RE CDA millésime 04, p. 4.' },
  { id: 'technique', title: 'Entretien technique', minutes: 45, description: 'Le jury questionne à partir du dossier et de la présentation et peut compléter les compétences peu couvertes par le projet. Source : O’clock transmis par l’utilisateur et RE CDA p. 4.' },
  { id: 'written', title: 'Questionnaire professionnel', minutes: 30, description: 'Étudier une documentation technique en anglais, répondre à deux QCU en français et à deux questions ouvertes en anglais avec réponses courtes en anglais. Les rédactions FR sont des bonus d’entraînement. Source précise : RE CDA millésime 04, p. 4.' },
  { id: 'final', title: 'Entretien final', minutes: 20, description: 'Échanger sur le dossier professionnel, les situations de travail et la compréhension globale du métier. Source : O’clock transmis par l’utilisateur et RE CDA p. 4 et 39. Le titre complet totalise 2 h 15.' }
];

export const examSources = [
  { label: 'Référentiel CDA : REAC p. 19–40 et RE p. 4', path: referentiel },
  { label: 'Diaporama actuel : notes, preuves et durées', path: slides },
  { label: 'Conception collective et écarts avec la version actuelle', path: conception },
  { label: 'Réalisations personnelles du dossier de projet', path: realisations },
  { label: 'Analyse historique des contributions et limites d’attribution', path: contributions },
  { label: 'Relecture révisée avant soutenance : résultats et limites', path: relecture },
  { label: 'Situations du dossier professionnel et éléments à compléter', path: dp }
];
