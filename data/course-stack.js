// Complément fondé sur les supports et le code du dépôt de formation OQuiz.
// Les exemples de révision illustrent le cours ; ils n'attestent pas d'une contribution personnelle.
export const courseSections = [
  {
    cp: 'cp1', technology: 'docker',
    section: {
      title: 'Docker · image, conteneur et diagnostic',
      body: 'Une image est un modèle construit avec ses dépendances. Un conteneur est une instance de cette image, avec un processus et une couche de fichiers modifiable. Il partage le noyau Linux de son environnement ; sur macOS, Docker Desktop utilise une VM Linux. Un conteneur arrêté existe encore et peut redémarrer.',
      bullets: [
        'docker build fabrique une image ; docker run crée et démarre un conteneur ; docker start redémarre un conteneur existant.',
        'docker ps montre les conteneurs actifs ; docker ps -a montre aussi ceux qui sont arrêtés. Lire le statut et le code de sortie avant de chercher la panne.',
        'docker logs montre stdout/stderr ; docker exec exécute une commande dans un conteneur actif. Les images Alpine ont souvent sh, sans bash.',
        '-p 5433:5432 publie le port 5432 du conteneur sur le port 5433 de l’hôte. EXPOSE documente un port sans le publier.',
      ],
      code: `# Dans un projet avec un fichier Compose
docker compose ps
docker compose logs --tail=50 api
docker compose exec api sh
docker compose exec database pg_isready
# Pour un conteneur individuel
docker ps -a
docker logs --tail=50 nom-du-conteneur`,
    },
  },
  {
    cp: 'cp1', technology: 'docker',
    section: {
      title: 'Docker · Dockerfile, cache et configuration',
      body: 'Le Dockerfile décrit la fabrication de l’image. RUN exécute une commande pendant le build ; CMD définit la commande de démarrage. Le Dockerfile API du cours compile TypeScript ; celui du client construit avec Vite puis copie dist dans Nginx. Les extraits ci-dessous sont des modèles de révision à adapter à la configuration Prisma du projet.',
      bullets: [
        'FROM choisit une image de base ; WORKDIR définit le répertoire courant ; COPY ajoute des fichiers du contexte de build.',
        'Copier package.json et package-lock.json puis installer avant de copier les sources permet de réutiliser l’installation si seul le code change. npm ci utilise le lockfile et échoue s’il est incohérent.',
        '.dockerignore exclut notamment node_modules, .git et .env du contexte envoyé au build.',
        'ARG sert au build ; environment dans Compose configure l’exécution. Les valeurs VITE_* sont intégrées au JavaScript du navigateur lors du build et sont publiques.',
        'Une build multi-stage conserve dans l’image finale les fichiers nécessaires à l’exécution. Les secrets ne se placent pas dans ARG, ENV ou le code client.',
      ],
      code: `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Ajouter la génération Prisma si le projet en utilise
RUN npm run build
CMD ["node", "dist/index.js"]`,
    },
  },
  {
    cp: 'cp10', technology: 'docker',
    section: {
      title: 'Docker · Compose, réseau, volumes et disponibilité',
      body: 'Compose décrit plusieurs services, leurs réseaux, volumes et variables. Deux services d’un même réseau se joignent par leur nom de service et leur port interne. Une API dans Docker contacte database:5432 ; localhost désigne le conteneur lui-même. Le navigateur, lui, utilise une adresse accessible depuis la machine de l’utilisateur.',
      bullets: [
        'Un volume nommé conserve les données PostgreSQL après la suppression du conteneur. Un bind mount expose un chemin de l’hôte, utile pour les sources en développement.',
        'docker compose up -d --build construit et démarre ; docker compose down supprime les conteneurs et réseaux du projet, en conservant normalement les volumes nommés. down -v supprime aussi ces volumes et leurs données.',
        'depends_on sous forme simple impose un ordre de démarrage, sans prouver que la BDD accepte les connexions. Un healthcheck et condition: service_healthy attendent sa disponibilité initiale.',
        'Une BDD prête peut encore manquer de tables : appliquer les migrations avant les requêtes. Prévoir aussi des reprises de connexion si elle devient indisponible ensuite.',
      ],
      code: `services:
  database:
    image: postgres:17
    environment:
      POSTGRES_USER: oquiz
      POSTGRES_DB: oquiz
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - oquiz_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U oquiz -d oquiz"]
      interval: 5s
      timeout: 5s
      retries: 5
  api:
    build: ./api
    depends_on:
      database:
        condition: service_healthy
volumes:
  oquiz_data:`,
    },
  },
  {
    cp: 'cp9', technology: 'tests',
    section: {
      title: 'Tests JavaScript · node:test, assertions et AAA',
      body: 'Le cours SC02E03 pratique node:test et node:assert côté API, puis Vitest côté client. Le runner lance les tests ; la bibliothèque d’assertions vérifie les résultats. Organise chaque test en Arrange (préparer), Act (agir), Assert (vérifier), avec un comportement observable et un attendu défini indépendamment du résultat.',
      bullets: [
        'Un test unitaire vérifie une fonction ou unité isolée ; un test d’intégration vérifie plusieurs composants ensemble ; un E2E déroule un scénario utilisateur complet.',
        'assert.strictEqual compare des primitives ou l’identité d’objets ; assert.deepStrictEqual compare leur structure. assert.ok contrôle une condition.',
        'assert.throws attend une exception synchrone ; await assert.rejects attend le rejet d’une promesse. Ne pas oublier await dans un test asynchrone.',
        'Tester le cas valide, les limites et les erreurs. assert.strictEqual(data.length, data.length) réussit toujours et ne valide aucune exigence.',
      ],
      code: `import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isValidPassword } from './validators.ts';

describe('isValidPassword', () => {
  it('refuse un mot de passe sans majuscule', () => {
    const password = 'mot2passe!'; // Arrange
    const result = isValidPassword(password); // Act
    assert.strictEqual(result, false); // Assert
  });
});`,
    },
  },
  {
    cp: 'cp9', technology: 'tests',
    section: {
      title: 'Tests JavaScript · mocks, injection et asynchronisme',
      body: 'Pour tester une unité sans lancer PostgreSQL ou une API externe, remplace ses dépendances par des doubles contrôlables. L’injection de dépendances passe explicitement un repository ou une fonction au code testé. Un mock peut contrôler le résultat et enregistrer les appels ; il ne prouve pas que la vraie dépendance fonctionne.',
      bullets: [
        'Dans node:test, t.mock.fn crée un double de fonction ; t.mock.method remplace une méthode d’objet. Les mocks liés au contexte du test sont restaurés à sa fin.',
        'Vérifier les arguments et le résultat : « le service cherche le niveau 7 puis renvoie son nom ». Un compteur d’appels seul ne suffit pas.',
        'Configurer une promesse résolue pour le succès et rejetée pour l’erreur. Le callback du test doit retourner ou attendre le travail asynchrone.',
        'Réduire les mocks aux frontières pertinentes. Un test qui recopie toutes les étapes internes devient fragile lors d’une refactorisation.',
      ],
      code: `import { it } from 'node:test';
import assert from 'node:assert/strict';

const makeService = repo => async id => {
  const level = await repo.findById(id);
  if (!level) throw new Error('Level absent');
  return level.name;
};

it('transmet l’id et renvoie le nom', async t => {
  const findById = t.mock.fn(async () => ({ id: 7, name: 'Facile' }));
  const getName = makeService({ findById });
  assert.strictEqual(await getName(7), 'Facile');
  assert.deepStrictEqual(findById.mock.calls[0].arguments, [7]);
  assert.strictEqual(findById.mock.callCount(), 1);
});`,
    },
  },
  {
    cp: 'cp9', technology: 'tests',
    section: {
      title: 'Tests JavaScript · intégration HTTP, Axios et BDD dédiée',
      body: 'Les tests de spécification du dépôt démarrent Express et un conteneur PostgreSQL oquiztest, appliquent les migrations, réinitialisent les tables entre les tests, puis ferment serveur et connexion. Le script npm run test:specs charge une configuration de test. Ce setup efface ses données : vérifier avant toute exécution qu’il cible exclusivement la base de test.',
      bullets: [
        'before prépare le contexte commun ; beforeEach prépare un état connu ; afterEach nettoie si nécessaire ; after libère les ressources. Attendre leur fin évite des processus ouverts.',
        'Le requester Axios du cours utilise validateStatus: () => true : une réponse 404 ou 403 devient une valeur dont on vérifie le statut, pas un rejet de promesse.',
        'Créer uniquement les fixtures utiles. Une BDD vidée entre les tests évite qu’un résultat dépende de l’ordre d’exécution.',
        'Contrôler le statut, le corps et, pour une écriture, l’état en BDD. Pour une route protégée, couvrir jeton absent, rôle refusé et rôle autorisé.',
        'Une attente fixe d’une seconde peut rendre le setup instable ; attendre réellement que PostgreSQL soit prêt. Ne pas paralléliser des tests qui tronquent les mêmes tables sans isolation adaptée.',
      ],
      code: `// Extrait à placer dans l’environnement de test du dépôt OQuiz
it('retourne 404 pour un niveau absent', async () => {
  const response = await adminRequester.get('/levels/99999');
  assert.strictEqual(response.status, 404);
});

it('interdit la création à un author', async () => {
  const response = await authorRequester.post('/levels', { name: 'Facile' });
  assert.strictEqual(response.status, 403);
});`,
    },
  },
  {
    cp: 'cp9', technology: 'tests',
    section: {
      title: 'Tests JavaScript · Vitest, TDD et tests qui apportent une preuve',
      body: 'Le client OQuiz utilise Vitest et un exercice TDD sur toReadableDate. Le cycle est Red (le nouveau test échoue pour la raison attendue), Green (implémentation suffisante), Refactor (amélioration avec les tests toujours verts). Les noms de fichiers unit/spec sont une convention du projet, pas une garantie du niveau du test.',
      bullets: [
        'expect(result).toBe(expected) compare une primitive ou une identité ; toEqual compare aussi la structure d’objets ; toThrow contrôle une exception.',
        'npm run test dans le client lance Vitest ; npm run test -- --run effectue une exécution unique. Les commandes API sont npm run test:unit et npm run test:specs.',
        'Pour les dates, préciser locale et fuseau ou construire une date locale maîtrisée. Un test doit éviter de dépendre du fuseau de la machine ou de l’heure courante.',
        'Un test de non-régression reproduit un bug et vérifie le résultat attendu après correction. La couverture indique du code exécuté, sans garantir la pertinence des assertions.',
        'Jest et Mocha apparaissent dans la comparaison « culture générale » du cours ; les exercices du dépôt utilisent node:test et Vitest.',
      ],
      code: `import { describe, it, expect } from 'vitest';
import { toReadableDate } from './utils';

describe('toReadableDate', () => {
  it('formate une date locale en français', () => {
    const date = new Date(2025, 11, 10, 12, 0);
    expect(toReadableDate(date)).toBe('mercredi 10 décembre 2025');
  });
});`,
    },
  },
  {
    cp: 'cp3', technology: 'backend',
    section: {
      title: 'Backend · Node, Express, routes et middlewares',
      body: 'Node exécute JavaScript côté serveur. Express reçoit une requête HTTP et traverse une chaîne de middlewares dans l’ordre déclaré. Le router associe méthode et chemin à un traitement ; le contrôleur orchestre les données de la requête, la logique applicative et la réponse. L’API du cours utilise Express 5.',
      bullets: [
        'req.params contient les segments du chemin, req.query les paramètres d’URL et req.body le corps décodé. Ces valeurs viennent du client et sont à valider.',
        'express.json() doit précéder les routes qui lisent un corps JSON ; cookieParser() précède les traitements qui lisent req.cookies.',
        'next() passe au middleware suivant ; res.json()/res.send() envoie une réponse. Utiliser return pour éviter de continuer vers une seconde réponse.',
        'Placer les routes avant le traitement 404 puis le middleware d’erreur à quatre arguments (err, req, res, next).',
        'Express 5 transmet les rejets des promesses retournées par les handlers à la gestion d’erreur. Une tâche asynchrone détachée ou un callback doit transmettre son erreur explicitement.',
      ],
      code: `app.use(express.json());
app.use('/api', router);

router.get('/levels/:id', checkRoles(['admin']), async (req, res) => {
  const id = await z.coerce.number().int().min(1).parseAsync(req.params.id);
  const level = await prisma.level.findUnique({ where: { id } });
  if (!level) throw new NotFoundError('Niveau absent');
  return res.json(level);
});

app.use(notFoundMW);
app.use(globalErrorHandler);`,
    },
  },
  {
    cp: 'cp3', technology: 'backend',
    section: {
      title: 'Backend · Zod, codes HTTP et contrôle d’accès',
      body: 'TypeScript vérifie le code avant son exécution ; il ne valide pas le JSON reçu. Zod vérifie les données au moment de la requête. L’authentification vérifie l’identité ; l’autorisation contrôle une permission, un rôle ou la propriété de la ressource. Les exemples du cours combinent Zod, argon2, JWT et middlewares checkRoles.',
      bullets: [
        'parse/parseAsync renvoie les données validées ou lève une ZodError ; safeParse renvoie un résultat success/data ou success/error. Exploiter les données validées.',
        'Dans l’API du cours, la validation Zod aboutit à 422 ; 401 signale une authentification absente ou invalide ; 403 une permission refusée ; 404 une ressource absente ; 409 un conflit.',
        'argon2.hash stocke un hash du mot de passe ; argon2.verify compare une tentative au hash. Ne renvoyer ni mot de passe ni hash au client.',
        'jwt.verify contrôle la signature et l’expiration ; jwt.decode lit le contenu sans authentifier le jeton. Un JWT signé reste lisible, donc ne contient pas de secret.',
        'Les cookies HttpOnly empêchent leur lecture par JavaScript ; Secure impose HTTPS. Les cookies envoyés automatiquement exigent une défense CSRF adaptée. CORS seul n’est ni authentification ni protection CSRF complète.',
        'Un rôle autorisé ne suffit pas toujours : vérifier aussi que la ressource appartient à l’utilisateur si la règle métier l’exige.',
      ],
      code: `const schema = z.object({ name: z.string().trim().min(1) });
const data = await schema.parseAsync(req.body);
// data.name est vérifié à l’exécution

const payload = jwt.verify(token, JWT_SECRET);
// Vérifier aussi la forme du payload et les options attendues
// avant d’utiliser userId ou role pour autoriser l’accès.`,
    },
  },
  {
    cp: 'cp8', technology: 'backend',
    section: {
      title: 'Backend · Prisma, filtre, relation et pagination',
      body: 'Prisma fournit un client typé qui transforme les opérations sur les modèles en requêtes vers la BDD. Le schéma OQuiz relie notamment User, Quiz, Question, Level et Tag. Savoir lire la requête et expliquer son effet SQL est plus utile que réciter une méthode.',
      bullets: [
        'findMany renvoie un tableau, éventuellement vide ; findUnique cherche une clé unique et renvoie un enregistrement ou null ; create/update/delete écrivent des données.',
        'where filtre, orderBy trie, select choisit les champs, include charge une relation. Par défaut, les relations ne sont pas toutes renvoyées automatiquement.',
        'skip/take expriment une pagination par décalage ; utiliser un tri déterministe. La pagination par curseur est adaptée aux parcours volumineux, avec une clé unique et un ordre cohérent.',
        'Le filtre dépend des règles métier : where: { author_id: userId } limite les quiz de l’auteur. Ne pas laisser le client choisir arbitrairement un propriétaire à autoriser.',
        'Prisma évite de construire soi-même le SQL des opérations courantes. Une requête raw construite par concaténation de saisies peut réintroduire une injection ; un sanitizer HTML ne la bloque pas.',
      ],
      code: `const quizzes = await prisma.quiz.findMany({
  where: { author_id: userId },
  orderBy: { id: 'asc' },
  skip: (page - 1) * pageSize,
  take: pageSize,
  include: { author: { select: { id: true, firstname: true } } },
});
// Valider page et borner pageSize avant cette requête.`,
    },
  },
  {
    cp: 'cp8', technology: 'backend',
    section: {
      title: 'Backend · migrations, contraintes et transactions',
      body: 'Le schéma décrit la structure désirée ; les migrations versionnent les changements SQL ; le client généré fournit l’API typée. Le dépôt utilise Prisma 6.19 : les commandes et chemins se lisent dans ses scripts npm et sa configuration. Une modification du schéma ne modifie pas automatiquement une base déjà déployée.',
      bullets: [
        'prisma migrate dev prépare et applique les migrations en développement ; prisma migrate deploy applique les migrations existantes dans un environnement de déploiement.',
        'prisma generate produit le client à partir du schéma ; cette génération n’applique pas de changement à la BDD. Le seed ajoute un jeu de données.',
        'Une vérification « le nom existe-t-il ? » améliore le message, mais deux requêtes concurrentes peuvent passer ensemble. Une contrainte UNIQUE en base reste nécessaire.',
        'Une transaction regroupe des écritures qui doivent toutes réussir ou être annulées. Elle évite un état partiel quand une étape échoue.',
        'Les resets et les TRUNCATE des tests effacent des données : ils appartiennent à une base dédiée et contrôlée. Lire DATABASE_URL et le contexte du script avant de les exécuter.',
      ],
      code: `// Exemple : ces deux écritures sont validées ensemble
await prisma.$transaction([
  prisma.level.create({ data: { name: 'Facile' } }),
  prisma.level.create({ data: { name: 'Difficile' } }),
]);

// Scripts du dépôt API, selon l’environnement
// npm run db:generate       -> génère le client
// npm run db:migrate:dev    -> développement
// npm run db:migrate:deploy -> migrations existantes`,
    },
  },
];

export const courseCards = [
  { id: 'course-docker-01', cp: 'cp1', technology: 'docker', question: 'Docker : quelle différence entre une image et un conteneur ?', answer: 'Une image est le modèle construit ; un conteneur est une instance créée à partir de ce modèle, avec son processus et sa couche modifiable.', detail: 'Une même image peut lancer plusieurs conteneurs. Supprimer un conteneur ne supprime pas l’image.', tags: ['Docker', 'Image'] },
  { id: 'course-docker-02', cp: 'cp1', technology: 'docker', question: 'Quelle différence entre docker run et docker start ?', answer: 'run crée et démarre un nouveau conteneur ; start démarre un conteneur existant qui est arrêté.', detail: 'Pour reconstruire l’image, utiliser docker build ; redémarrer un conteneur ne reconstruit pas son image.', tags: ['Docker', 'CLI'] },
  { id: 'course-docker-03', cp: 'cp1', technology: 'docker', question: 'Une API Docker s’arrête au démarrage : quelles commandes lis-tu en premier ?', answer: 'docker ps -a pour le statut et le code de sortie, puis docker logs du conteneur ; avec Compose : docker compose ps puis docker compose logs api.', detail: 'Vérifier ensuite la commande de démarrage, les variables, le port et la disponibilité de la BDD.', tags: ['Docker', 'Diagnostic'] },
  { id: 'course-docker-04', cp: 'cp1', technology: 'docker', question: 'Que signifie -p 5433:5432 et est-ce la même chose que EXPOSE ?', answer: 'Le port 5433 de l’hôte est lié au port 5432 du conteneur. EXPOSE documente un port et ne le publie pas à lui seul.', detail: 'Un client sur l’hôte se connecte à localhost:5433. Un autre service du même réseau utilise le nom du service et 5432.', tags: ['Docker', 'Réseau'] },
  { id: 'course-docker-05', cp: 'cp1', technology: 'docker', question: 'Dockerfile : quelle différence entre RUN et CMD ?', answer: 'RUN exécute une commande pendant la construction de l’image ; CMD définit la commande par défaut exécutée au démarrage du conteneur.', detail: 'RUN npm ci installe les dépendances au build ; CMD ["node", "dist/index.js"] démarre l’application.', tags: ['Docker', 'Dockerfile'] },
  { id: 'course-docker-06', cp: 'cp1', technology: 'docker', question: 'Pourquoi copier package*.json puis installer avant de copier les sources ?', answer: 'Pour réutiliser le cache de l’installation des dépendances quand seuls les fichiers de code changent.', detail: 'Si package.json ou le lockfile change, la couche d’installation doit être reconstruite.', tags: ['Docker', 'Cache'] },
  { id: 'course-docker-07', cp: 'cp1', technology: 'docker', question: 'Quel est le rôle de .dockerignore ?', answer: 'Il exclut des fichiers du contexte de build, par exemple node_modules, .git et .env.', detail: 'Cela réduit les fichiers envoyés au build et évite d’ajouter des dépendances locales ou secrets par COPY.', tags: ['Docker', 'Dockerfile'] },
  { id: 'course-docker-08', cp: 'cp1', technology: 'docker', question: 'ARG, variable au démarrage et VITE_API_BASE_URL : quand servent-ils ?', answer: 'ARG fournit une valeur au build ; une variable environment de Compose configure le conteneur à l’exécution ; VITE_API_BASE_URL est intégrée au code client lors du build Vite.', detail: 'Modifier seulement la variable du conteneur Nginx ne modifie pas un bundle client déjà construit. Une variable VITE_* est publique.', tags: ['Docker', 'Vite'] },
  { id: 'course-docker-09', cp: 'cp10', technology: 'docker', question: 'Pourquoi une API conteneurisée ne doit-elle pas joindre PostgreSQL sur localhost ?', answer: 'Dans l’API, localhost désigne ce conteneur. Il faut joindre le nom du service BDD sur le réseau Compose, par exemple database:5432.', detail: 'Le nom interne Docker n’est généralement pas accessible depuis le navigateur de l’utilisateur.', tags: ['Docker', 'Compose'] },
  { id: 'course-docker-10', cp: 'cp10', technology: 'docker', question: 'Docker : quelle différence entre un volume nommé et un bind mount ?', answer: 'Le volume nommé est géré par Docker, adapté aux données persistantes ; le bind mount lie directement un chemin de l’hôte au conteneur.', detail: 'Le cours utilise des volumes pour PostgreSQL et des bind mounts pour le code en développement.', tags: ['Docker', 'Volumes'] },
  { id: 'course-docker-11', cp: 'cp10', technology: 'docker', question: 'docker compose down supprime-t-il les données du volume PostgreSQL ?', answer: 'Les volumes nommés sont normalement conservés. down -v supprime aussi les volumes du projet et donc leurs données.', detail: 'Un fichier situé uniquement dans la couche du conteneur supprimé est perdu. Toujours identifier où la BDD stocke ses fichiers.', tags: ['Docker', 'Persistance'] },
  { id: 'course-docker-12', cp: 'cp10', technology: 'docker', question: 'depends_on: [database] garantit-il que PostgreSQL est prêt ?', answer: 'Non. Il impose un ordre de démarrage. Un healthcheck et condition: service_healthy attendent la disponibilité initiale de la BDD.', detail: 'Une BDD prête peut encore nécessiter des migrations ; prévoir aussi les erreurs de connexion en cours d’exécution.', tags: ['Docker', 'Healthcheck'] },

  { id: 'course-tests-01', cp: 'cp9', technology: 'tests', question: 'Quels outils de tests sont réellement pratiqués dans le dépôt OQuiz ?', answer: 'Côté API : node:test et node:assert. Côté client : Vitest. Jest et Mocha sont cités pour comparaison dans le cours.', detail: 'SC02E03, api/package.json et client/package.json permettent de justifier ce choix.', tags: ['Tests JS', 'node:test', 'Vitest'] },
  { id: 'course-tests-02', cp: 'cp9', technology: 'tests', question: 'Quelle différence entre test runner et bibliothèque d’assertions ?', answer: 'Le runner découvre et exécute les tests ; les assertions vérifient les valeurs et comportements attendus.', detail: 'node:test orchestre les tests ; node:assert fournit strictEqual, deepStrictEqual, throws et rejects.', tags: ['Tests JS', 'node:test'] },
  { id: 'course-tests-03', cp: 'cp9', technology: 'tests', question: 'Que signifie AAA dans un test JavaScript ?', answer: 'Arrange : préparer les entrées et le contexte. Act : exécuter le code testé. Assert : vérifier le résultat attendu.', detail: 'Un test nommé « refuse un mot de passe sans majuscule » prépare une telle valeur puis attend false.', tags: ['Tests JS', 'AAA'] },
  { id: 'course-tests-04', cp: 'cp9', technology: 'tests', question: 'Quelle différence entre un test unitaire, d’intégration et E2E ?', answer: 'Unitaire : une unité isolée. Intégration : plusieurs composants reliés. E2E : un scénario utilisateur complet sur le système.', detail: 'Valider isValidPassword est unitaire ; appeler une route avec vraie BDD est une intégration ; se connecter via le navigateur est un E2E.', tags: ['Tests JS', 'Niveaux'] },
  { id: 'course-tests-05', cp: 'cp9', technology: 'tests', question: 'Quand choisir assert.strictEqual plutôt que assert.deepStrictEqual ?', answer: 'strictEqual compare une primitive ou l’identité d’un objet ; deepStrictEqual compare récursivement la structure des objets et tableaux.', detail: 'Deux objets { id: 7 } distincts ne sont pas identiques, mais ont la même structure.', tags: ['Tests JS', 'node:assert'] },
  { id: 'course-tests-06', cp: 'cp9', technology: 'tests', question: 'Comment tester une exception synchrone et un rejet asynchrone ?', answer: 'assert.throws(() => operation()) pour une exception synchrone ; await assert.rejects(() => operationAsync()) pour une promesse rejetée.', detail: 'Passer une fonction pour ne pas lancer l’opération avant que l’assertion l’observe.', tags: ['Tests JS', 'Asynchrone'] },
  { id: 'course-tests-07', cp: 'cp9', technology: 'tests', question: 'Pourquoi un test async sans await peut-il donner une fausse confiance ?', answer: 'Le runner peut considérer le test terminé avant que la promesse et ses assertions finissent.', detail: 'Déclarer un callback async et await les appels ou retourner la promesse attendue.', tags: ['Tests JS', 'Asynchrone'] },
  { id: 'course-tests-08', cp: 'cp9', technology: 'tests', question: 'Comment un mock aide-t-il à tester un service qui appelle Prisma ?', answer: 'Il remplace l’accès à la BDD par une dépendance contrôlée, pour observer la réaction du service à un résultat ou à une erreur.', detail: 'Cela teste la logique du service ; il faut d’autres tests pour vérifier la vraie requête et le schéma BDD.', tags: ['Tests JS', 'Mock'] },
  { id: 'course-tests-09', cp: 'cp9', technology: 'tests', question: 'Qu’est-ce que l’injection de dépendances dans un test JS ?', answer: 'Passer explicitement au code une dépendance, par exemple un repository, que le test peut remplacer par un double.', detail: 'makeService({ findById }) utilise un vrai repository en application et un fake contrôlé dans le test.', tags: ['Tests JS', 'Injection'] },
  { id: 'course-tests-10', cp: 'cp9', technology: 'tests', question: 'Avec node:test, comment observer les arguments reçus par une fonction mockée ?', answer: 'Créer le double avec t.mock.fn(), puis lire fn.mock.calls et fn.mock.callCount().', detail: 'assert.deepStrictEqual(fn.mock.calls[0].arguments, [7]) vérifie l’id transmis ; vérifier aussi le résultat métier.', tags: ['Tests JS', 'node:test', 'Mock'] },
  { id: 'course-tests-11', cp: 'cp9', technology: 'tests', question: 'Pourquoi les tests d’intégration doivent-ils avoir une BDD dédiée ?', answer: 'Ils écrivent et réinitialisent leurs données. Une BDD dédiée évite d’effacer la base de développement ou de production et rend l’état initial maîtrisable.', detail: 'Le setup OQuiz crée oquiztest et tronque les tables entre les tests. Vérifier le contexte et DATABASE_URL avant de l’exécuter.', tags: ['Tests JS', 'BDD'] },
  { id: 'course-tests-12', cp: 'cp9', technology: 'tests', question: 'À quoi servent beforeEach et after dans les tests de spécification API ?', answer: 'beforeEach prépare un état connu avant chaque test ; after libère les ressources communes après les tests.', detail: 'OQuiz réinitialise les tables, puis ferme Express, Prisma et le conteneur de test. Attendre le nettoyage évite des ressources ouvertes.', tags: ['Tests JS', 'Hooks'] },
  { id: 'course-tests-13', cp: 'cp9', technology: 'tests', question: 'Avec validateStatus: () => true dans Axios, comment vérifier un 404 ?', answer: 'La requête se résout avec une réponse : vérifier response.status === 404 et le corps attendu.', detail: 'Elle ne rejette pas à cause du statut HTTP. Les erreurs de transport peuvent toujours provoquer un rejet.', tags: ['Tests JS', 'Axios'] },
  { id: 'course-tests-14', cp: 'cp9', technology: 'tests', question: 'Pourquoi assert.strictEqual(data.length, data.length) ne teste-t-il rien ?', answer: 'La valeur est comparée à elle-même : l’assertion réussit indépendamment de l’exigence métier.', detail: 'Comparer à un attendu indépendant, comme le nombre de fixtures créées, puis vérifier les valeurs réellement retournées.', tags: ['Tests JS', 'Qualité'] },
  { id: 'course-tests-15', cp: 'cp9', technology: 'tests', question: 'Dans Vitest, que font toBe et toEqual ?', answer: 'toBe compare une primitive ou l’identité ; toEqual compare aussi la structure des objets et tableaux.', detail: 'expect({ id: 7 }).toEqual({ id: 7 }) réussit ; les deux objets restent distincts.', tags: ['Tests JS', 'Vitest'] },
  { id: 'course-tests-16', cp: 'cp9', technology: 'tests', question: 'Que signifie Red → Green → Refactor dans l’exercice TDD du client ?', answer: 'Écrire un test qui échoue pour le bon besoin ; coder pour le faire réussir ; améliorer le code en gardant les tests verts.', detail: 'Pour toReadableDate, utiliser une date maîtrisée et un attendu français précis. La couverture seule ne prouve pas que l’assertion est utile.', tags: ['Tests JS', 'TDD', 'Vitest'] },

  { id: 'course-backend-01', cp: 'cp3', technology: 'backend', question: 'Dans une API Node/Express, quels rôles ont le router et le contrôleur ?', answer: 'Le router associe méthode et chemin aux handlers ; le contrôleur orchestre validation, logique et réponse HTTP.', detail: 'Un service peut porter la règle métier et un repository l’accès aux données lorsque cette séparation aide le projet.', tags: ['Backend', 'Express'] },
  { id: 'course-backend-02', cp: 'cp3', technology: 'backend', question: 'Express : où lire /levels/7, ?page=2 et un JSON envoyé par le client ?', answer: '7 dans req.params.id ; 2 dans req.query.page ; le JSON décodé dans req.body après express.json().', detail: 'Les valeurs de params et query nécessitent conversion et validation ; aucune entrée client n’est fiable par défaut.', tags: ['Backend', 'Express'] },
  { id: 'course-backend-03', cp: 'cp3', technology: 'backend', question: 'Que fait next() et pourquoi l’ordre des middlewares compte-t-il ?', answer: 'next() transmet le contrôle au handler suivant. Chaque middleware doit pouvoir exploiter ce que les précédents ont préparé.', detail: 'Placer express.json avant les routes, la 404 après les routes et le middleware d’erreur en dernier.', tags: ['Backend', 'Middleware'] },
  { id: 'course-backend-04', cp: 'cp3', technology: 'backend', question: 'Express 5 : que devient une erreur dans un contrôleur async ?', answer: 'Le rejet de la promesse retournée est transmis à la gestion d’erreur. Un callback ou une tâche détachée exige une transmission explicite adaptée.', detail: 'Le middleware d’erreur a quatre arguments : err, req, res, next. Éviter d’envoyer deux réponses.', tags: ['Backend', 'Express', 'Erreurs'] },
  { id: 'course-backend-05', cp: 'cp3', technology: 'backend', question: 'Pourquoi valider req.body avec Zod si le projet utilise TypeScript ?', answer: 'TypeScript vérifie le code à la compilation, mais les données HTTP arrivent à l’exécution. Zod vérifie alors leur forme et leurs contraintes.', detail: 'Un client peut envoyer { name: 123 } même si le type attendu indique string.', tags: ['Backend', 'Zod'] },
  { id: 'course-backend-06', cp: 'cp3', technology: 'backend', question: 'Zod : quelle différence entre parse et safeParse ?', answer: 'parse retourne les données validées ou lève une ZodError ; safeParse retourne un objet indiquant success, avec data ou error.', detail: 'Utiliser parseAsync si les validations sont asynchrones. Dans l’API du cours, le middleware global transforme ZodError en 422.', tags: ['Backend', 'Zod'] },
  { id: 'course-backend-07', cp: 'cp3', technology: 'backend', question: 'Comment distinguer 401, 403, 404, 409 et 422 dans l’API du cours ?', answer: '401 : authentification absente/invalide ; 403 : permission refusée ; 404 : ressource absente ; 409 : conflit ; 422 : validation des données échouée.', detail: 'Le contrat API doit documenter les statuts et permettre aux tests de vérifier chaque cas.', tags: ['Backend', 'HTTP'] },
  { id: 'course-backend-08', cp: 'cp3', technology: 'backend', question: 'OQuiz : un author connecté peut-il créer un Level réservé aux admins ?', answer: 'Non. Son authentification établit son identité, mais l’autorisation exige le rôle admin sur cette route.', detail: 'Le middleware checkRoles refuse avec 403 un jeton valide dont le rôle est author. Vérifier aussi la propriété si la règle métier l’exige.', tags: ['Backend', 'Sécurité'] },
  { id: 'course-backend-09', cp: 'cp3', technology: 'backend', question: 'Pourquoi jwt.decode ne suffit-il pas pour authentifier une requête ?', answer: 'decode lit le contenu sans vérifier sa signature. verify contrôle la signature et, selon les options, notamment l’expiration.', detail: 'Vérifier aussi la forme du payload et les critères attendus avant de faire confiance à userId/role. Un JWT signé reste lisible.', tags: ['Backend', 'JWT'] },
  { id: 'course-backend-10', cp: 'cp3', technology: 'backend', question: 'Pourquoi stocker un hash argon2 plutôt que le mot de passe et que protège HttpOnly ?', answer: 'Le hash sert à vérifier une tentative sans stocker le mot de passe en clair. HttpOnly empêche JavaScript de lire le cookie.', detail: 'Le hash ne se renvoie pas au client. HttpOnly ne bloque pas à lui seul toutes les attaques XSS ou CSRF.', tags: ['Backend', 'Argon2', 'Cookies'] },
  { id: 'course-backend-11', cp: 'cp8', technology: 'backend', question: 'Prisma : que renvoient findMany et findUnique si rien ne correspond ?', answer: 'findMany retourne un tableau vide ; findUnique retourne null. Les variantes OrThrow lèvent une erreur.', detail: 'Le contrôleur décide ensuite du contrat HTTP, par exemple liste vide ou 404 pour une ressource ciblée.', tags: ['Backend', 'Prisma'] },
  { id: 'course-backend-12', cp: 'cp8', technology: 'backend', question: 'Prisma : à quoi servent where, select et include ?', answer: 'where filtre les enregistrements ; select choisit des champs ; include charge une relation associée.', detail: 'include: { author: { select: { id: true } } } charge seulement l’id de l’auteur dans cette relation.', tags: ['Backend', 'Prisma'] },
  { id: 'course-backend-13', cp: 'cp8', technology: 'backend', question: 'Comment paginer une liste avec Prisma et éviter un ordre variable ?', answer: 'Valider et borner page/pageSize, utiliser skip et take, puis un orderBy déterministe, par exemple id asc.', detail: 'skip = (page - 1) * pageSize. Pour de grands parcours, considérer une pagination par curseur avec une clé unique cohérente.', tags: ['Backend', 'Prisma', 'Pagination'] },
  { id: 'course-backend-14', cp: 'cp8', technology: 'backend', question: 'Quelle différence entre prisma generate, migrate dev et migrate deploy ?', answer: 'generate produit le client ; migrate dev prépare et applique les migrations en développement ; migrate deploy applique les migrations existantes dans l’environnement cible.', detail: 'Générer le client ne crée pas les tables. Le seed ajoute des données et ne remplace pas une migration.', tags: ['Backend', 'Prisma', 'Migrations'] },
  { id: 'course-backend-15', cp: 'cp8', technology: 'backend', question: 'Pourquoi vérifier un doublon dans le code ne remplace-t-il pas une contrainte UNIQUE ?', answer: 'Deux requêtes concurrentes peuvent vérifier simultanément que la valeur est libre. La contrainte en BDD impose l’unicité au moment de l’écriture.', detail: 'Gérer ensuite l’erreur de contrainte pour fournir une réponse claire, souvent 409 selon le contrat.', tags: ['Backend', 'Prisma', 'Contraintes'] },
  { id: 'course-backend-16', cp: 'cp8', technology: 'backend', question: 'Que garantit une transaction et un sanitizer HTML bloque-t-il une injection SQL ?', answer: 'La transaction valide ensemble ses opérations ou les annule en cas d’échec. Un sanitizer HTML ne sécurise pas une requête SQL construite par concaténation.', detail: 'Employer les opérations Prisma et, pour du SQL brut, une API paramétrée. Ne pas incorporer directement les saisies dans une chaîne SQL.', tags: ['Backend', 'Prisma', 'Transaction'] },
];

export const courseSources = [
  { label: 'Cours SC02E01 · Conteneurisation Docker', technology: 'docker', path: 'SC01234-OQUIZ-Zer0absolute/docs/cours/SC02/SC02E01.md' },
  { label: 'Fiche de cours Docker', technology: 'docker', path: 'SC01234-OQUIZ-Zer0absolute/docs/fiches/docker.md' },
  { label: 'OQuiz · Dockerfile API', technology: 'docker', path: 'SC01234-OQUIZ-Zer0absolute/api/Dockerfile' },
  { label: 'OQuiz · Dockerfile client multi-stage', technology: 'docker', path: 'SC01234-OQUIZ-Zer0absolute/client/Dockerfile' },
  { label: 'OQuiz · Compose de production', technology: 'docker', path: 'SC01234-OQUIZ-Zer0absolute/docker-compose.prod.yml' },
  { label: 'OQuiz · Compose de développement et healthchecks', technology: 'docker', path: 'SC01234-OQUIZ-Zer0absolute/docker-compose.yml' },
  { label: 'Docker · ordre de démarrage et disponibilité', technology: 'docker', url: 'https://docs.docker.com/compose/how-tos/startup-order/' },
  { label: 'Docker · optimiser le cache de build', technology: 'docker', url: 'https://docs.docker.com/build/cache/optimize/' },
  { label: 'Cours SC02E03 · Tests automatisés', technology: 'tests', path: 'SC01234-OQUIZ-Zer0absolute/docs/cours/SC02/SC02E03.md' },
  { label: 'OQuiz · scripts et dépendances API', technology: 'tests', path: 'SC01234-OQUIZ-Zer0absolute/api/package.json' },
  { label: 'OQuiz · tests unitaires node:test', technology: 'tests', path: 'SC01234-OQUIZ-Zer0absolute/api/src/utils/validators.unit.test.ts' },
  { label: 'OQuiz · tests HTTP des niveaux', technology: 'tests', path: 'SC01234-OQUIZ-Zer0absolute/api/src/controllers/level.controller.spec.test.ts' },
  { label: 'OQuiz · environnement des tests et BDD dédiée', technology: 'tests', path: 'SC01234-OQUIZ-Zer0absolute/api/src/test/config/global-setup.ts' },
  { label: 'OQuiz · requester Axios des tests', technology: 'tests', path: 'SC01234-OQUIZ-Zer0absolute/api/src/test/axios.ts' },
  { label: 'OQuiz · scripts Vitest client', technology: 'tests', path: 'SC01234-OQUIZ-Zer0absolute/client/package.json' },
  { label: 'OQuiz · exercice TDD Vitest sur les dates', technology: 'tests', path: 'SC01234-OQUIZ-Zer0absolute/client/src/lib/utils.unit.test.ts' },
  { label: 'Node · runner et mocks natifs', technology: 'tests', url: 'https://nodejs.org/api/test.html' },
  { label: 'Vitest · assertions expect', technology: 'tests', url: 'https://vitest.dev/api/expect.html' },
  { label: 'OQuiz · ordre des middlewares Express', technology: 'backend', path: 'SC01234-OQUIZ-Zer0absolute/api/src/app.ts' },
  { label: 'OQuiz · route et contrôle des rôles', technology: 'backend', path: 'SC01234-OQUIZ-Zer0absolute/api/src/routers/level.router.ts' },
  { label: 'OQuiz · contrôleur, Zod et requêtes Prisma', technology: 'backend', path: 'SC01234-OQUIZ-Zer0absolute/api/src/controllers/level.controller.ts' },
  { label: 'OQuiz · argon2, connexion et rotation des jetons', technology: 'backend', path: 'SC01234-OQUIZ-Zer0absolute/api/src/controllers/auth.controller.ts' },
  { label: 'OQuiz · middleware JWT et autorisation', technology: 'backend', path: 'SC01234-OQUIZ-Zer0absolute/api/src/middlewares/accessControl.middleware.ts' },
  { label: 'OQuiz · gestion globale des erreurs', technology: 'backend', path: 'SC01234-OQUIZ-Zer0absolute/api/src/middlewares/globalError.middleware.ts' },
  { label: 'OQuiz · modèles Prisma et contraintes', technology: 'backend', path: 'SC01234-OQUIZ-Zer0absolute/api/prisma/schema.prisma' },
  { label: 'Express · gestion des erreurs et handlers async', technology: 'backend', url: 'https://expressjs.com/en/guide/error-handling/' },
  { label: 'Zod · validation à l’exécution', technology: 'backend', url: 'https://zod.dev/basics' },
  { label: 'Prisma · lecture des données et pagination', technology: 'backend', url: 'https://www.prisma.io/docs/orm/fundamentals/reading-data' },
  { label: 'jsonwebtoken · verify et decode', technology: 'backend', url: 'https://github.com/auth0/node-jsonwebtoken' },
];
