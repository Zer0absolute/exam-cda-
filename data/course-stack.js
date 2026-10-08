// Leçons autonomes : exemples originaux, documentations primaires consultées le 8 octobre 2026.
// Les 44 identifiants de cartes restent stables pour conserver la progression.
export const courseSections = [
  {
    "cp": "cp1",
    "technology": "docker",
    "section": {
      "title": "Docker 1 · comprendre image et conteneur",
      "body": "Docker lance une application dans un environnement isolé appelé conteneur. Une image est le paquet de fichiers et de réglages utilisé pour créer cet environnement. Pense à une recette déjà préparée (image) et à une exécution de cette recette (conteneur). Ici, on lance un petit serveur web Nginx, sans application préalable.",
      "bullets": [
        "Prérequis : Docker installé et démarré, connexion pour télécharger l’image et port 8088 disponible. Les commandes vont dans un terminal.",
        "docker run crée puis démarre ; docker stop arrête ; docker start redémarre le même conteneur. Un conteneur arrêté existe encore.",
        "Le port est un numéro de point d’accès réseau. -p 127.0.0.1:8088:80 relie le port 8088 de ta machine au port 80 du conteneur, uniquement en local.",
        "docker ps -a indique les états ; docker logs montre les messages du programme ; docker exec lance une commande dans un conteneur actif.",
        "Résultat attendu : http://127.0.0.1:8088 affiche la page d’accueil Nginx. Sur macOS, les conteneurs Linux tournent dans l’environnement Linux de Docker Desktop."
      ],
      "code": "docker run -d --name atelier-web -p 127.0.0.1:8088:80 nginx:alpine\n# Ouvre http://127.0.0.1:8088 dans ton navigateur.\ndocker ps -a\ndocker logs --tail=10 atelier-web\ndocker exec atelier-web nginx -v\ndocker stop atelier-web\ndocker start atelier-web\n# Nettoyage facultatif de CET atelier :\n# docker stop atelier-web\n# docker rm atelier-web",
      "exercise": {
        "prompt": "Après docker stop atelier-web, faut-il refaire docker run ? Explique ce qui existe encore.",
        "answer": "Non : docker start atelier-web relance le conteneur conservé. run tenterait de créer un autre conteneur avec le même nom et échouerait. L’image nginx:alpine est également conservée."
      },
      "sources": [
        {
          "label": "Docker · définition d’une image",
          "url": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/",
          "kind": "official"
        },
        {
          "label": "Docker · définition d’un conteneur",
          "url": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/",
          "kind": "official"
        },
        {
          "label": "Docker · créer et démarrer un conteneur",
          "url": "https://docs.docker.com/reference/cli/docker/container/run/",
          "kind": "official"
        }
      ]
    }
  },
  {
    "cp": "cp1",
    "technology": "docker",
    "section": {
      "title": "Docker 2 · fabriquer une image avec un Dockerfile",
      "body": "Un Dockerfile est un fichier texte qui décrit comment fabriquer une image. Le build est cette fabrication. L’exemple crée une API minuscule : un serveur qui répond en JSON, un format texte pour échanger des objets. Tout le code est fourni ; aucune bibliothèque à installer.",
      "bullets": [
        "Prérequis : Docker démarré. Crée un dossier vide ; enregistre les trois fichiers ci-dessous, puis lance les commandes depuis ce dossier.",
        "FROM choisit la base ; WORKDIR choisit le dossier de travail ; COPY ajoute un fichier. CMD définit ce qui démarre quand le conteneur est lancé.",
        "RUN exécute une commande pendant la fabrication, par exemple installer des dépendances. Ici il n’en faut aucune. EXPOSE documenterait un port sans le publier.",
        "Le cache réutilise les étapes inchangées. Avec des dépendances npm, copier package.json et le lockfile (fichier verrouillant leurs versions), exécuter npm ci, puis copier les sources évite de réinstaller pour un simple changement de code.",
        "Une variable d’environnement configure le programme au démarrage. ARG configure le build. .dockerignore exclut des fichiers de ce build ; un secret ne doit pas être copié dans l’image.",
        "curl envoie une requête HTTP depuis le terminal. Résultat attendu : il renvoie {\"title\":\"Lire\"}. Changer TITLE au lancement change le titre sans reconstruire le code."
      ],
      "code": "# Fichier server.mjs\nimport { createServer } from 'node:http';\nconst server = createServer((_req, res) => {\n  res.writeHead(200, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ title: process.env.TITLE ?? 'Lire' }));\n});\nserver.listen(3000, '0.0.0.0');\n\n# Fichier Dockerfile\nFROM node:24-alpine\nWORKDIR /app\nCOPY server.mjs ./\nCMD [\"node\", \"server.mjs\"]\n\n# Fichier .dockerignore\n.env\nnode_modules\n.git\n\n# Terminal, dans le dossier de ces fichiers\ndocker build -t atelier-api .\ndocker run -d --name atelier-api-run -p 127.0.0.1:8089:3000 -e TITLE=Lire atelier-api\ncurl http://127.0.0.1:8089\n# Arrêt facultatif : docker stop atelier-api-run",
      "exercise": {
        "prompt": "Tu modifies server.mjs, puis redémarres le conteneur. Le nouveau code est-il automatiquement présent ?",
        "answer": "Non : COPY a enregistré l’ancien fichier dans l’image. Il faut reconstruire l’image puis recréer le conteneur avec cette image. Un redémarrage du conteneur existant ne remplace pas ses fichiers."
      },
      "sources": [
        {
          "label": "Docker · instructions du Dockerfile",
          "url": "https://docs.docker.com/reference/dockerfile/",
          "kind": "official"
        },
        {
          "label": "Docker · réutilisation du cache",
          "url": "https://docs.docker.com/get-started/docker-concepts/building-images/using-the-build-cache/",
          "kind": "official"
        },
        {
          "label": "npm · installation depuis un lockfile",
          "url": "https://docs.npmjs.com/cli/v11/commands/npm-ci/",
          "kind": "official"
        },
        {
          "label": "Node.js · créer un serveur HTTP",
          "url": "https://nodejs.org/api/http.html",
          "kind": "official"
        }
      ]
    }
  },
  {
    "cp": "cp10",
    "technology": "docker",
    "section": {
      "title": "Docker 3 · relier des services avec Compose",
      "body": "Compose lit un fichier YAML qui décrit plusieurs services, c’est-à-dire plusieurs programmes à lancer. Il crée un réseau pour qu’ils puissent communiquer par leur nom. L’exemple lance un serveur web et un deuxième conteneur qui lui demande sa page : il montre la différence entre une adresse interne et une adresse accessible depuis ton navigateur.",
      "bullets": [
        "Prérequis : Docker avec Compose, dossier vide et port 8090 disponible. Enregistre le YAML sous compose.yaml, puis lance les commandes indiquées.",
        "Entre services, http://web:80 utilise le nom web et son port interne. Depuis ton navigateur, http://127.0.0.1:8090 utilise le port publié sur la machine.",
        "localhost désigne l’environnement où le programme s’exécute. Dans le client conteneurisé, localhost ne désigne pas le service web.",
        "Un healthcheck est une commande qui vérifie la disponibilité. depends_on avec service_healthy attend sa réussite initiale ; la forme simple de depends_on attend seulement le démarrage.",
        "Résultat attendu : les logs de client contiennent une page HTML Nginx, puis client s’arrête normalement. web continue à servir la page."
      ],
      "code": "# Fichier compose.yaml\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - \"127.0.0.1:8090:80\"\n    healthcheck:\n      test: [\"CMD-SHELL\", \"wget -q -O /dev/null http://127.0.0.1:80\"]\n      interval: 2s\n      timeout: 2s\n      retries: 10\n  client:\n    image: alpine:3.22\n    command: [\"wget\", \"-q\", \"-O\", \"-\", \"http://web:80\"]\n    depends_on:\n      web:\n        condition: service_healthy\n\n# Terminal, dans le dossier du YAML\ndocker compose up -d\ndocker compose ps -a\ndocker compose logs client\n# Arrêt de cet atelier : docker compose down",
      "exercise": {
        "prompt": "Le conteneur client peut-il utiliser http://localhost:8090 pour joindre web ? Quelle adresse doit-il utiliser ?",
        "answer": "Il utilise http://web:80. localhost dans client viserait client lui-même ; 8090 est le port publié pour ta machine, alors que web écoute sur 80 dans le réseau Compose."
      },
      "sources": [
        {
          "label": "Docker Compose · réseau et noms de services",
          "url": "https://docs.docker.com/compose/how-tos/networking/",
          "kind": "official"
        },
        {
          "label": "Docker Compose · démarrage et disponibilité",
          "url": "https://docs.docker.com/compose/how-tos/startup-order/",
          "kind": "official"
        },
        {
          "label": "Docker Compose · arrêt et suppression",
          "url": "https://docs.docker.com/reference/cli/docker/compose/down/",
          "kind": "official"
        }
      ]
    }
  },
  {
    "cp": "cp10",
    "technology": "docker",
    "section": {
      "title": "Docker 4 · conserver les données avec un volume",
      "body": "Un fichier écrit dans un conteneur appartient normalement à ce conteneur et disparaît si celui-ci est supprimé. Un volume est un espace de stockage géré par Docker, que plusieurs conteneurs successifs peuvent retrouver. Un bind mount lie plutôt un dossier précis de ta machine à un dossier du conteneur.",
      "bullets": [
        "Prérequis : Docker démarré. Ici, on écrit une seule tâche dans un volume nommé atelier-notes ; aucun serveur de base de données n’est nécessaire.",
        "Dans -v atelier-notes:/data, la partie gauche est le volume, la partie droite son emplacement visible dans le conteneur.",
        "--rm supprime ce conteneur après sa commande, mais laisse le volume nommé. Le deuxième conteneur retrouve donc le fichier du premier.",
        "Résultat attendu : la dernière commande affiche Lire. La persistance concerne les fichiers réellement placés dans le volume, pas tous les fichiers du conteneur.",
        "Avec Compose, down conserve normalement les volumes nommés ; down -v les supprime aussi. Ne pas utiliser -v si ces données doivent rester."
      ],
      "code": "docker volume create atelier-notes\n# Premier conteneur : écrire puis se supprimer.\ndocker run --rm -v atelier-notes:/data alpine:3.22 sh -c 'echo Lire > /data/tache.txt'\n# Deuxième conteneur : lire le même volume.\ndocker run --rm -v atelier-notes:/data alpine:3.22 cat /data/tache.txt\n# Résultat : Lire",
      "exercise": {
        "prompt": "Pourquoi peut-on lire tache.txt alors que le conteneur qui l’a créé a été supprimé ?",
        "answer": "Parce que le fichier est dans atelier-notes, un volume distinct du conteneur. Le nouveau conteneur monte ce volume au même emplacement /data et retrouve les données."
      },
      "sources": [
        {
          "label": "Docker · volumes persistants",
          "url": "https://docs.docker.com/engine/storage/volumes/",
          "kind": "official"
        },
        {
          "label": "Docker · créer et démarrer un conteneur",
          "url": "https://docs.docker.com/reference/cli/docker/container/run/",
          "kind": "official"
        },
        {
          "label": "Docker Compose · arrêt et suppression",
          "url": "https://docs.docker.com/reference/cli/docker/compose/down/",
          "kind": "official"
        }
      ]
    }
  },
  {
    "cp": "cp9",
    "technology": "tests",
    "section": {
      "title": "Tests 1 · vérifier une fonction avec node:test",
      "body": "Un test automatisé exécute du code et compare le résultat à ce qu’on attend. Le test runner lance les tests ; une assertion est la vérification qui échoue si le résultat est incorrect. Node possède ces outils : node:test pour lancer, node:assert pour vérifier. Le premier exemple compte des tâches terminées.",
      "bullets": [
        "Prérequis : Node 22 ou plus récent. Copie tout le JavaScript dans compte.test.mjs et lance node --test compte.test.mjs ; aucun package à installer.",
        "Arrange : préparer les entrées. Act : appeler la fonction. Assert : vérifier une valeur attendue choisie à l’avance.",
        "strictEqual compare une valeur simple ou l’identité d’un objet ; deepStrictEqual compare aussi la structure des objets et tableaux. ok attend une condition vraie.",
        "Résultat attendu : deux tests réussissent. La liste contient une tâche done: true et une done: false : le total attendu est donc 1.",
        "Un test unitaire vérifie une unité comme cette fonction. Un test d’intégration relie plusieurs composants. Un E2E parcourt un scénario utilisateur complet."
      ],
      "code": "import test from 'node:test';\nimport assert from 'node:assert/strict';\n\nconst countDone = tasks => tasks.filter(task => task.done).length;\n\ntest('compte uniquement les tâches terminées', () => {\n  const tasks = [\n    { title: 'Lire', done: true },\n    { title: 'Marcher', done: false },\n  ]; // Arrange\n  const result = countDone(tasks); // Act\n  assert.strictEqual(result, 1); // Assert\n});\n\ntest('une liste vide donne zéro', () => {\n  assert.strictEqual(countDone([]), 0);\n});",
      "exercise": {
        "prompt": "Remplace le corps de countDone par tasks.length. Quel test détecte l’erreur et pourquoi ?",
        "answer": "Le premier échoue : la mauvaise fonction compte les deux tâches et renvoie 2, alors que 1 seule est terminée. Le test de liste vide reste vert ; il ne suffisait donc pas à prouver le filtrage."
      },
      "sources": [
        {
          "label": "Node.js · exécuter des tests",
          "url": "https://nodejs.org/api/test.html",
          "kind": "official"
        },
        {
          "label": "Node.js · vérifier un résultat avec assert",
          "url": "https://nodejs.org/api/assert.html",
          "kind": "official"
        },
        {
          "label": "Microsoft Learn · organiser des tests unitaires avec Arrange, Act, Assert",
          "url": "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices",
          "kind": "official"
        },
        {
          "label": "Playwright · tests de scénarios dans le navigateur",
          "url": "https://playwright.dev/docs/intro",
          "kind": "official"
        }
      ]
    }
  },
  {
    "cp": "cp9",
    "technology": "tests",
    "section": {
      "title": "Tests 2 · attendre une promesse et remplacer une dépendance",
      "body": "Une promesse représente un résultat qui arrivera plus tard. await attend ce résultat. Une dépendance est un outil appelé par la fonction, par exemple l’accès à une base. Pour vérifier la logique sans vraie base, on fournit une fonction de remplacement contrôlée : un double de test. L’injection consiste à passer explicitement cette dépendance en argument.",
      "bullets": [
        "Prérequis : Node 22+. Copie l’exemple dans service.test.mjs et lance node --test service.test.mjs. Deux tests doivent réussir.",
        "Le service reçoit readTask, l’appelle avec l’identifiant demandé, puis renvoie le titre. Son double renvoie une tâche connue ; il ne vérifie pas une vraie base.",
        "t.mock.fn crée le double et enregistre ses appels. Vérifier le résultat ET les arguments prouve ici que l’identifiant 7 a été transmis.",
        "assert.throws vérifie une exception immédiate ; await assert.rejects vérifie une promesse rejetée. Oublier await peut terminer le test avant le résultat.",
        "Un mock de méthode via t.mock.method est utile pour remplacer une méthode existante. Les doubles associés au contexte du test sont restaurés à sa fin."
      ],
      "code": "import test from 'node:test';\nimport assert from 'node:assert/strict';\n\nconst makeService = readTask => async id => {\n  const task = await readTask(id);\n  if (!task) throw new Error('Tâche absente');\n  return task.title;\n};\n\ntest('renvoie le titre et transmet l’identifiant', async t => {\n  const readTask = t.mock.fn(async () => ({ id: 7, title: 'Lire' }));\n  const getTitle = makeService(readTask);\n  assert.strictEqual(await getTitle(7), 'Lire');\n  assert.deepStrictEqual(readTask.mock.calls[0].arguments, [7]);\n  assert.strictEqual(readTask.mock.callCount(), 1);\n});\n\ntest('refuse une tâche absente', async () => {\n  const getTitle = makeService(async () => null);\n  await assert.rejects(() => getTitle(99), /Tâche absente/);\n});",
      "exercise": {
        "prompt": "Le premier test prouve-t-il que PostgreSQL est correctement configuré ? Quelle partie prouve-t-il ?",
        "answer": "Non : la base est remplacée. Il prouve que le service appelle la dépendance avec 7 et renvoie son titre. Un test d’intégration supplémentaire vérifierait la vraie connexion et les requêtes."
      },
      "sources": [
        {
          "label": "Node.js · exécuter des tests",
          "url": "https://nodejs.org/api/test.html",
          "kind": "official"
        },
        {
          "label": "Node.js · vérifier un résultat avec assert",
          "url": "https://nodejs.org/api/assert.html",
          "kind": "official"
        }
      ]
    }
  },
  {
    "cp": "cp9",
    "technology": "tests",
    "section": {
      "title": "Tests 3 · tester une réponse HTTP et nettoyer le serveur",
      "body": "HTTP est le protocole par lequel un client demande une ressource à un serveur. Une réponse contient un code de statut et souvent un corps. Ce test lance un vrai serveur local, envoie une requête, puis vérifie la réponse : il relie le serveur et le client HTTP. Toute sa petite liste de tâches est fournie.",
      "bullets": [
        "Prérequis : Node 22+. Copie dans http.test.mjs puis lance node --test http.test.mjs. Aucun package ni base externe nécessaire.",
        "listen(0) demande un port libre ; once(..., \"listening\") attend réellement le démarrage. Le test ne dépend pas d’un délai arbitraire.",
        "GET /tasks/1 doit renvoyer 200 et { id: 1, title: \"Lire\" }. Une autre adresse renvoie 404. fetch ne rejette pas seulement parce que le statut est 404 : il faut vérifier response.status.",
        "t.after ferme le serveur à la fin du test. beforeEach peut réinitialiser les données avant chaque test ; after peut fermer une ressource commune.",
        "Avec une vraie BDD, utiliser une base de test dédiée et un jeu d’essai connu. Ne pas laisser un test nettoyer des données de production.",
        "Avec Axios, validateStatus: () => true rend tous les statuts HTTP vérifiables dans une réponse ; une panne réseau peut toujours rejeter la promesse."
      ],
      "code": "import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { createServer } from 'node:http';\nimport { once } from 'node:events';\n\ntest('GET /tasks/1 renvoie une tâche', async t => {\n  const task = { id: 1, title: 'Lire' };\n  const server = createServer((req, res) => {\n    const found = req.method === 'GET' && req.url === '/tasks/1';\n    res.writeHead(found ? 200 : 404, { 'Content-Type': 'application/json' });\n    res.end(JSON.stringify(found ? task : { error: 'Absente' }));\n  });\n  t.after(() => new Promise((resolve, reject) => {\n    server.close(error => error ? reject(error) : resolve());\n  }));\n  server.listen(0, '127.0.0.1');\n  await once(server, 'listening');\n  const url = 'http://127.0.0.1:' + server.address().port;\n  const response = await fetch(url + '/tasks/1');\n  assert.strictEqual(response.status, 200);\n  assert.deepStrictEqual(await response.json(), task);\n});",
      "exercise": {
        "prompt": "Modifie la requête en /tasks/99. Quels résultats faut-il attendre ? Pourquoi une assertion sur le statut seul serait-elle incomplète ?",
        "answer": "Attendre 404 et { error: \"Absente\" }. Le statut seul ne prouve pas le contenu de l’erreur ; une réponse pourrait avoir le bon statut et un corps incorrect."
      },
      "sources": [
        {
          "label": "Node.js · créer un serveur HTTP",
          "url": "https://nodejs.org/api/http.html",
          "kind": "official"
        },
        {
          "label": "Node.js · exécuter des tests",
          "url": "https://nodejs.org/api/test.html",
          "kind": "official"
        },
        {
          "label": "Node.js · vérifier un résultat avec assert",
          "url": "https://nodejs.org/api/assert.html",
          "kind": "official"
        },
        {
          "label": "MDN · requête et réponse avec fetch",
          "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
          "kind": "official"
        },
        {
          "label": "Axios · statuts HTTP et erreurs",
          "url": "https://axios-http.com/docs/handling_errors",
          "kind": "official"
        }
      ]
    }
  },
  {
    "cp": "cp9",
    "technology": "tests",
    "section": {
      "title": "Tests 4 · Vitest et écrire un test avant le code",
      "body": "Vitest est un autre outil pour lancer des tests JavaScript, avec ses assertions expect. Le TDD est une façon de développer : écrire d’abord un test qui révèle le besoin, coder pour le faire réussir, puis améliorer le code en gardant les tests verts. On veut ici obtenir les titres des tâches encore à faire.",
      "bullets": [
        "Prérequis : Node 22+ et npm. Dans un dossier vide : npm init -y, puis npm install -D vitest@4. Enregistre le JavaScript sous titres.test.mjs ; lance npx vitest run.",
        "Red : commence avec getPendingTitles = tasks => [] ; le test échoue car il attend [\"Marcher\"]. Green : ajoute le filtrage et la transformation fournis.",
        "Refactor : améliore la lisibilité sans changer le résultat. Ne remplace pas l’attendu par la valeur réellement obtenue pour rendre un test vert.",
        "toBe compare une valeur simple ou une identité ; toEqual compare une structure ; toThrow vérifie une exception. Le résultat est ici un tableau, donc toEqual convient.",
        "Un test de non-régression garde la reproduction d’un bug corrigé. La couverture mesure les lignes exécutées, pas la qualité du résultat attendu."
      ],
      "code": "import { test, expect } from 'vitest';\n\nconst getPendingTitles = tasks => tasks\n  .filter(task => !task.done)\n  .map(task => task.title);\n\ntest('garde les titres des tâches à faire', () => {\n  const tasks = [\n    { title: 'Lire', done: true },\n    { title: 'Marcher', done: false },\n  ];\n  expect(getPendingTitles(tasks)).toEqual(['Marcher']);\n});",
      "exercise": {
        "prompt": "Ajoute le cas de liste vide. Quelle assertion écris-tu et quelle limite de ton premier test couvre-t-elle ?",
        "answer": "expect(getPendingTitles([])).toEqual([]). Ce deuxième cas vérifie que l’absence de données produit une liste vide sans erreur ; le premier vérifie le filtrage et les titres."
      },
      "sources": [
        {
          "label": "Vitest · installer et lancer des tests",
          "url": "https://vitest.dev/guide/",
          "kind": "official"
        },
        {
          "label": "Vitest · comparer les résultats",
          "url": "https://vitest.dev/api/expect.html",
          "kind": "official"
        },
        {
          "label": "Microsoft Learn · organiser des tests unitaires avec Arrange, Act, Assert",
          "url": "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices",
          "kind": "official"
        },
        {
          "label": "Microsoft Learn · cycle Red, Green, Refactor",
          "url": "https://learn.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/contact-manager/iteration-6-use-test-driven-development-cs",
          "kind": "official"
        }
      ]
    }
  },
  {
    "cp": "cp3",
    "technology": "backend",
    "section": {
      "title": "Backend 1 · une requête, une route et une réponse",
      "body": "Le backend est le programme côté serveur. Une API offre des points d’accès pour demander ou modifier des données. Node exécute JavaScript ; Express facilite la création d’une API HTTP. Une route associe une méthode, comme GET, à un chemin, comme /tasks/1. Ce serveur lit deux tâches stockées en mémoire.",
      "bullets": [
        "Prérequis : Node 22+ et npm. Dans un dossier vide : npm init -y puis npm install express@5. Enregistre le code sous api.mjs et lance node api.mjs.",
        "req représente la requête reçue, res permet d’envoyer la réponse. Dans /tasks/:id, :id est une partie variable du chemin ; req.params.id est sa valeur texte.",
        "GET lit une ressource. POST sert notamment à créer ; PUT remplace ; PATCH modifie partiellement ; DELETE supprime selon le contrat de l’API.",
        "Résultat attendu : ouvrir http://127.0.0.1:3000/tasks/1 renvoie { id: 1, title: \"Lire\" }. /tasks/99 renvoie 404 ; /tasks/abc renvoie 400.",
        "Les tâches sont dans un tableau : arrêter le serveur fait perdre ses changements. La persistance en base est une étape distincte."
      ],
      "code": "import express from 'express';\nconst app = express();\nconst tasks = [\n  { id: 1, title: 'Lire' },\n  { id: 2, title: 'Marcher' },\n];\n\napp.get('/tasks/:id', (req, res) => {\n  const id = Number(req.params.id);\n  if (!Number.isInteger(id) || id < 1) {\n    return res.status(400).json({ error: 'Identifiant invalide' });\n  }\n  const task = tasks.find(item => item.id === id);\n  if (!task) return res.status(404).json({ error: 'Tâche absente' });\n  return res.json(task);\n});\napp.listen(3000, '127.0.0.1');",
      "exercise": {
        "prompt": "Pour GET /tasks/2, quelle méthode, quelle valeur de req.params.id et quelle réponse attends-tu ?",
        "answer": "La méthode est GET. req.params.id vaut la chaîne \"2\" ; Number la convertit en 2. La réponse est 200 avec { id: 2, title: \"Marcher\" }."
      },
      "sources": [
        {
          "label": "Express 5 · premier serveur",
          "url": "https://expressjs.com/en/starter/hello-world/",
          "kind": "official"
        },
        {
          "label": "RFC 9110 · codes de réponse HTTP",
          "url": "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes",
          "kind": "standard"
        }
      ]
    }
  },
  {
    "cp": "cp3",
    "technology": "backend",
    "section": {
      "title": "Backend 2 · comprendre la chaîne de middlewares",
      "body": "Un middleware est une fonction exécutée pendant le traitement d’une requête. Il peut lire les données, en ajouter, répondre ou transmettre le travail au suivant avec next(). L’ordre est donc utile : décoder le JSON avant de le lire, placer les routes avant la réponse 404 et traiter les erreurs à la fin.",
      "bullets": [
        "Prérequis : Node 22+, npm init -y et npm install express@5 dans un dossier vide. Copie sous chaine.mjs et lance node chaine.mjs.",
        "express.json décode un corps JSON. Un Content-Type: application/json annonce ce format. req.body, req.params et req.query viennent du client et restent à valider.",
        "res.json envoie la réponse ; return quitte la fonction pour éviter d’envoyer une deuxième réponse. Un middleware sans réponse ni next laisse la requête en attente.",
        "Le middleware d’erreur a quatre paramètres, dont error en premier. En Express 5, le rejet de la promesse retournée par un handler async lui est transmis.",
        "Résultat attendu : POST /echo renvoie le corps fourni ; GET /fail renvoie 500 et une erreur générique. Les détails techniques restent dans les logs du serveur."
      ],
      "code": "import express from 'express';\nconst app = express();\napp.use(express.json());\napp.use((req, _res, next) => {\n  console.log(req.method, req.path);\n  next();\n});\napp.post('/echo', (req, res) => res.json(req.body));\napp.get('/fail', async () => { throw new Error('Erreur de démonstration'); });\napp.use((_req, res) => res.status(404).json({ error: 'Route absente' }));\napp.use((error, _req, res, _next) => {\n  console.error(error.message);\n  const status = error.status === 400 ? 400 : 500;\n  res.status(status).json({ error: status === 400 ? 'JSON invalide' : 'Erreur serveur' });\n});\napp.listen(3001, '127.0.0.1');\n// Autre terminal :\n// curl -X POST http://127.0.0.1:3001/echo -H 'Content-Type: application/json' -d '{\"title\":\"Lire\"}'\n// curl -i http://127.0.0.1:3001/fail",
      "exercise": {
        "prompt": "Que se passe-t-il si la réponse 404 est placée avant les routes et n’appelle pas next() ?",
        "answer": "Elle répond à toutes les requêtes qui la traversent ; les routes suivantes ne sont jamais atteintes. Il faut chercher une route avant de conclure qu’elle est absente."
      },
      "sources": [
        {
          "label": "Express 5 · chaîne de middlewares",
          "url": "https://expressjs.com/en/guide/using-middleware/",
          "kind": "official"
        },
        {
          "label": "Express 5 · traitement des erreurs",
          "url": "https://expressjs.com/en/guide/error-handling/",
          "kind": "official"
        },
        {
          "label": "RFC 9110 · codes de réponse HTTP",
          "url": "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes",
          "kind": "standard"
        }
      ]
    }
  },
  {
    "cp": "cp3",
    "technology": "backend",
    "section": {
      "title": "Backend 3 · valider le JSON reçu avec Zod",
      "body": "Valider signifie vérifier qu’une donnée respecte une forme et des règles. TypeScript vérifie ton code avant l’exécution ; il n’empêche pas un client d’envoyer un mauvais JSON. Zod décrit les règles et les applique au moment où la requête arrive. Cette API accepte un titre non vide et refuse un nombre à sa place.",
      "bullets": [
        "Prérequis : Node 22+, npm init -y, puis npm install express@5 zod@4. Copie sous validation.mjs et lance node validation.mjs.",
        "z.object décrit un objet ; z.string un texte ; trim retire les espaces autour ; min(1) exige au moins un caractère après ce nettoyage.",
        "safeParse renvoie success: true et data, ou success: false et error. parse renvoie les données validées ou lève une erreur ; leurs variantes Async attendent les règles asynchrones.",
        "Résultat attendu : {\"title\":\"  Lire  \"} produit 201 avec { id: 1, title: \"Lire\" }. {\"title\":123} produit 422 et ne crée rien.",
        "201 signifie qu’une ressource a été créée. 422 convient à un contenu compris mais invalide ; 400 à une requête incorrecte. Le choix précis doit rester cohérent dans le contrat API."
      ],
      "code": "import express from 'express';\nimport { z } from 'zod';\nconst app = express();\nconst tasks = [];\nconst taskInput = z.object({ title: z.string().trim().min(1) });\napp.use(express.json());\n\napp.post('/tasks', (req, res) => {\n  const result = taskInput.safeParse(req.body);\n  if (!result.success) {\n    return res.status(422).json({ error: 'Un titre texte non vide est requis' });\n  }\n  const task = { id: tasks.length + 1, title: result.data.title };\n  tasks.push(task);\n  return res.status(201).json(task);\n});\napp.listen(3002, '127.0.0.1');\n// curl -X POST http://127.0.0.1:3002/tasks -H 'Content-Type: application/json' -d '{\"title\":\"  Lire  \"}'\n// curl -X POST http://127.0.0.1:3002/tasks -H 'Content-Type: application/json' -d '{\"title\":123}'",
      "exercise": {
        "prompt": "Pour {\"title\":\"   \"}, safeParse réussit-il ? Explique dans quel ordre les règles agissent.",
        "answer": "Non : trim transforme les espaces en chaîne vide, puis min(1) échoue. La route renvoie 422 sans ajouter de tâche, car elle utilise uniquement result.data après une validation réussie."
      },
      "sources": [
        {
          "label": "Zod · validation des données à l’exécution",
          "url": "https://zod.dev/basics",
          "kind": "official"
        },
        {
          "label": "RFC 9110 · codes de réponse HTTP",
          "url": "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes",
          "kind": "standard"
        }
      ]
    }
  },
  {
    "cp": "cp3",
    "technology": "backend",
    "section": {
      "title": "Backend 4 · identité, permissions et jeton signé",
      "body": "L’authentification vérifie qui fait la demande ; l’autorisation vérifie ce que cette personne peut faire. Un jeton est une preuve présentée au serveur. Un JWT signé contient des informations lisibles et une signature permettant de détecter une modification. L’exemple sépare une identité vérifiée et une règle simple : seul le propriétaire peut modifier sa tâche.",
      "bullets": [
        "Prérequis : Node 22+, npm init -y puis npm install jsonwebtoken@9. Copie sous permissions.mjs et lance node permissions.mjs. La clé fournie sert uniquement à cette démonstration locale.",
        "sign crée un jeton ; verify vérifie sa signature et son expiration avec les options attendues. decode lit seulement le contenu : il ne prouve pas l’identité.",
        "Le serveur choisit la clé, les algorithmes acceptés et les règles de permission. Ne pas faire confiance à un ownerId ou un rôle simplement envoyé dans le corps de la requête.",
        "Sans identité valable, une route protégée répond généralement 401 ; avec une identité valable mais sans permission, 403. Un 401 comporte aussi le défi WWW-Authenticate approprié.",
        "Pour un mot de passe, conserver un hash adapté comme Argon2id et vérifier la tentative ; ne pas stocker le texte ni renvoyer le hash au client.",
        "Un cookie HttpOnly bloque sa lecture par JavaScript ; Secure exige HTTPS. Les cookies envoyés automatiquement nécessitent aussi une protection contre les requêtes forgées (CSRF).",
        "Résultat attendu : utilisateur 7 peut modifier la tâche dont ownerId vaut 7, mais pas celle dont ownerId vaut 8."
      ],
      "code": "import jwt from 'jsonwebtoken';\nconst secret = 'cle-fictive-utilisee-seulement-dans-cet-atelier';\nconst token = jwt.sign({ userId: 7 }, secret, {\n  algorithm: 'HS256', expiresIn: '5m',\n});\nconst identity = jwt.verify(token, secret, { algorithms: ['HS256'] });\nif (typeof identity !== 'object' || !Number.isInteger(identity.userId)) {\n  throw new Error('Identité invalide');\n}\nconst canEdit = task => task.ownerId === identity.userId;\nconsole.log(canEdit({ id: 1, ownerId: 7 })); // true\nconsole.log(canEdit({ id: 2, ownerId: 8 })); // false",
      "exercise": {
        "prompt": "Un client envoie { ownerId: 7 } dans sa demande pour une tâche appartenant à 8. Cela lui donne-t-il le droit de la modifier ?",
        "answer": "Non : le serveur doit lire le propriétaire réel de la tâche dans ses données fiables et comparer avec l’identité vérifiée. Un propriétaire déclaré par le client ne prouve aucun droit."
      },
      "sources": [
        {
          "label": "OWASP · vérifier les permissions",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
          "kind": "official"
        },
        {
          "label": "jsonwebtoken · signature, verify et decode",
          "url": "https://github.com/auth0/node-jsonwebtoken",
          "kind": "official"
        },
        {
          "label": "OWASP · stockage des mots de passe",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
          "kind": "official"
        },
        {
          "label": "MDN · propriétés d’un cookie HTTP",
          "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie",
          "kind": "official"
        },
        {
          "label": "RFC 9110 · codes de réponse HTTP",
          "url": "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes",
          "kind": "standard"
        }
      ]
    }
  },
  {
    "cp": "cp8",
    "technology": "backend",
    "section": {
      "title": "Backend 5 · lire une base avec Prisma : atelier autonome",
      "body": "Une base de données conserve des informations après l’arrêt du serveur. Un ORM est un outil qui permet de manipuler ces données avec des objets et des méthodes ; Prisma en est un. Le schéma décrit les tables et leurs relations. Cet atelier utilise SQLite, un fichier local, et Prisma 6.19 explicitement : il enseigne l’API findMany sans nécessiter un serveur de BDD.",
      "bullets": [
        "Prérequis : Node 22+, npm et un dossier vide. L’exemple contient les commandes, le schéma et le programme. Les versions Prisma sont fixées car les nouvelles versions peuvent avoir une configuration différente.",
        "Task est une tâche avec id, title, done ; Board est une liste de tâches. boardId relie une tâche à sa liste. @id identifie une ligne ; @unique interdit les doublons ; @default donne une valeur initiale.",
        "findMany renvoie un tableau, éventuellement vide ; findUnique cherche une valeur unique et renvoie une ligne ou null. create ajoute, update modifie, delete supprime.",
        "Le fichier SQLite atelier.db est créé vide avec touch, puis la migration y crée les tables. Ces commandes de terminal sont destinées à macOS/Linux ; sous Windows, créer le fichier vide avec l’outil équivalent.",
        "where filtre ; orderBy trie ; skip ignore des lignes ; take limite leur nombre ; select choisit les champs ; include ajoute une relation. Ne pas utiliser select et include au même niveau.",
        "Résultat attendu : seule Lire est encore à faire. La sortie JSON vaut [{\"title\":\"Lire\",\"board\":{\"name\":\"Maison\"}}]. Le deuxième titre est terminé et donc exclu."
      ],
      "code": "# Terminal : crée un dossier vide puis travaille dedans\nmkdir atelier-prisma\ncd atelier-prisma\nnpm init -y\nnpm install -D prisma@6.19.0\nnpm install @prisma/client@6.19.0\nmkdir prisma\n\n# Fichier prisma/schema.prisma\n# Copier ce contenu dans le fichier, sans les lignes du terminal.\ngenerator client {\n  provider = \"prisma-client-js\"\n}\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./atelier.db\"\n}\nmodel Board {\n  id    Int    @id @default(autoincrement())\n  name  String @unique\n  tasks Task[]\n}\nmodel Task {\n  id      Int     @id @default(autoincrement())\n  title   String\n  done    Boolean @default(false)\n  boardId Int\n  board   Board   @relation(fields: [boardId], references: [id])\n}\n\n# Terminal : crée les tables et le client\ntouch prisma/atelier.db\nnpx prisma migrate dev --name init\nnpx prisma generate\n\n# Fichier lecture.mjs\nimport { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\ntry {\n  const board = await prisma.board.upsert({\n    where: { name: 'Maison' }, update: {}, create: { name: 'Maison' },\n  });\n  for (const [id, title, done] of [[1, 'Lire', false], [2, 'Marcher', true]]) {\n    const data = { title, done, boardId: board.id };\n    await prisma.task.upsert({ where: { id }, update: data, create: { id, ...data } });\n  }\n  const tasks = await prisma.task.findMany({\n    where: { done: false }, orderBy: { id: 'asc' }, skip: 0, take: 1,\n    select: { title: true, board: { select: { name: true } } },\n  });\n  console.log(JSON.stringify(tasks));\n} finally {\n  await prisma.$disconnect();\n}\n\n# Terminal : exécute le programme\nnode lecture.mjs",
      "exercise": {
        "prompt": "Avec les deux tâches fournies, remplace where: { done: false } par where: { done: true }. Quel résultat obtiens-tu ?",
        "answer": "La sortie devient [{\"title\":\"Marcher\",\"board\":{\"name\":\"Maison\"}}]. where choisit la tâche terminée ; select conserve son titre et le nom de sa liste, sans renvoyer les autres champs."
      },
      "sources": [
        {
          "label": "Prisma ORM 6 · méthodes du client",
          "url": "https://www.prisma.io/docs/orm/v6/reference/prisma-client-reference",
          "kind": "official"
        },
        {
          "label": "Prisma ORM 6 · lire les relations",
          "url": "https://www.prisma.io/docs/orm/v6/prisma-client/queries/relation-queries",
          "kind": "official"
        },
        {
          "label": "Prisma ORM 6 · générer un client",
          "url": "https://www.prisma.io/docs/orm/v6/prisma-schema/overview/generators",
          "kind": "official"
        },
        {
          "label": "Prisma ORM 6 · configurer la source de données",
          "url": "https://www.prisma.io/docs/orm/v6/prisma-schema/overview/data-sources",
          "kind": "official"
        }
      ]
    }
  },
  {
    "cp": "cp8",
    "technology": "backend",
    "section": {
      "title": "Backend 6 · migrations, unicité et transaction",
      "body": "Une migration est un changement versionné de la structure de la BDD, comme ajouter une colonne. Générer le client est différent : cela fabrique le code des méthodes disponibles. Une transaction regroupe des opérations qui doivent réussir ensemble ou être annulées ensemble. Le scénario ci-dessous explique ce que ces outils protègent, sans dépendre d’une application existante.",
      "bullets": [
        "Dans Prisma 6, migrate dev crée et applique des migrations pendant le développement ; migrate deploy applique les migrations déjà écrites. generate produit le client sans créer les tables.",
        "Un seed est un jeu de données initial. Un test peut avoir ses propres données connues, dans une base dédiée. Reset et TRUNCATE effacent des données et n’ont pas leur place dans une base à conserver.",
        "Une contrainte UNIQUE en BDD reste nécessaire : deux demandes simultanées peuvent toutes deux croire qu’un nom est libre. Une simple recherche préalable ne protège pas de cette concurrence.",
        "Dans une transaction, l’échec d’une écriture annule les autres écritures de ce groupe. Cela empêche une mise à jour partielle ; il faut encore choisir une isolation adaptée aux règles concurrentes.",
        "Une injection SQL se produit lorsqu’une saisie change le sens d’une requête construite par concaténation. Utiliser des paramètres et les API adaptées ; nettoyer du HTML ne protège pas du SQL.",
        "Le schéma et le déroulé ci-dessous sont un exercice de raisonnement : ils ne constituent pas un script prêt à exécuter. L’atelier précédent fournit un environnement Prisma complet pour pratiquer."
      ],
      "code": "État initial de deux lignes Account :\n  { id: 1, balance: 100 }\n  { id: 2, balance: 20 }\n\nTransaction « transférer 10 » :\n  1. Modifier le solde du compte 1 : 100 -> 90.\n  2. Modifier le solde du compte 2 : 20 -> 30.\n  3. Valider le groupe seulement si les deux écritures réussissent.\n\nSi les deux réussissent : soldes 90 et 30.\nSi la deuxième échoue : soldes 100 et 20.\nSans transaction, la première écriture pourrait rester seule.",
      "exercise": {
        "prompt": "Un transfert retire 10 au premier compte, puis l’ajout au deuxième échoue. Quels soldes restent avec une transaction ? Pourquoi ?",
        "answer": "100 et 20 : le groupe est annulé, y compris le retrait pourtant déjà exécuté. La transaction protège l’atomicité : aucune partie du transfert ne reste seule. Elle ne vérifie pas automatiquement les autres règles, comme un solde suffisant."
      },
      "sources": [
        {
          "label": "Prisma ORM 6 · migrations en développement et déploiement",
          "url": "https://www.prisma.io/docs/orm/v6/prisma-migrate/workflows/development-and-production",
          "kind": "official"
        },
        {
          "label": "Prisma ORM 6 · générer un client",
          "url": "https://www.prisma.io/docs/orm/v6/prisma-schema/overview/generators",
          "kind": "official"
        },
        {
          "label": "Prisma ORM 6 · transactions",
          "url": "https://www.prisma.io/docs/orm/v6/prisma-client/queries/transactions",
          "kind": "official"
        },
        {
          "label": "OWASP · prévention des injections SQL",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
          "kind": "official"
        }
      ]
    }
  }
];

export const courseCards = [
  {
    "id": "course-docker-01",
    "cp": "cp1",
    "technology": "docker",
    "question": "Docker : qu’est-ce qu’une image et qu’est-ce qu’un conteneur ?",
    "answer": "Une image est le paquet de fichiers et de réglages servant à créer un conteneur ; le conteneur est l’environnement d’exécution créé à partir de ce paquet.",
    "detail": "La même image peut servir à plusieurs conteneurs, chacun avec son état.",
    "tags": [
      "Docker",
      "Bases"
    ],
    "sources": [
      {
        "label": "Docker · définition d’une image",
        "url": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/",
        "kind": "official"
      },
      {
        "label": "Docker · définition d’un conteneur",
        "url": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-02",
    "cp": "cp1",
    "technology": "docker",
    "question": "Docker : après avoir arrêté un conteneur, run ou start ?",
    "answer": "start redémarre le conteneur conservé. run crée un nouveau conteneur puis le démarre.",
    "detail": "docker stop ne supprime pas le conteneur ; un nouveau run avec le même nom peut échouer.",
    "tags": [
      "Docker",
      "Commandes"
    ],
    "sources": [
      {
        "label": "Docker · créer et démarrer un conteneur",
        "url": "https://docs.docker.com/reference/cli/docker/container/run/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-03",
    "cp": "cp1",
    "technology": "docker",
    "question": "Un conteneur s’arrête immédiatement : quelles informations regarder ?",
    "answer": "Son état et code de sortie avec docker ps -a, puis les messages du programme avec docker logs.",
    "detail": "Un arrêt normal après une commande courte n’est pas une panne. Le code de sortie et les logs permettent de distinguer les cas.",
    "tags": [
      "Docker",
      "Diagnostic"
    ],
    "sources": [
      {
        "label": "Docker · créer et démarrer un conteneur",
        "url": "https://docs.docker.com/reference/cli/docker/container/run/",
        "kind": "official"
      },
      {
        "label": "Docker · définition d’un conteneur",
        "url": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-04",
    "cp": "cp1",
    "technology": "docker",
    "question": "Que relie -p 127.0.0.1:8088:80 ?",
    "answer": "Le port 8088 de ta machine au port 80 du conteneur, avec un accès limité à la boucle locale.",
    "detail": "Le navigateur utilise http://127.0.0.1:8088. EXPOSE seul ne crée pas cette publication.",
    "tags": [
      "Docker",
      "Ports"
    ],
    "sources": [
      {
        "label": "Docker · créer et démarrer un conteneur",
        "url": "https://docs.docker.com/reference/cli/docker/container/run/",
        "kind": "official"
      },
      {
        "label": "Docker · instructions du Dockerfile",
        "url": "https://docs.docker.com/reference/dockerfile/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-05",
    "cp": "cp1",
    "technology": "docker",
    "question": "Dockerfile : quand sont exécutés RUN et CMD ?",
    "answer": "RUN agit pendant la fabrication de l’image. CMD indique le programme par défaut à démarrer dans le conteneur.",
    "detail": "Installer des dépendances est une étape de build ; lancer le serveur est une étape d’exécution.",
    "tags": [
      "Docker",
      "Dockerfile"
    ],
    "sources": [
      {
        "label": "Docker · instructions du Dockerfile",
        "url": "https://docs.docker.com/reference/dockerfile/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-06",
    "cp": "cp1",
    "technology": "docker",
    "question": "Pourquoi installer les dépendances avant de copier les fichiers de code ?",
    "answer": "Pour réutiliser le cache de cette installation si les fichiers décrivant les dépendances n’ont pas changé.",
    "detail": "Copier package.json et le lockfile, lancer npm ci, puis copier les sources limite les réinstallations inutiles.",
    "tags": [
      "Docker",
      "Cache"
    ],
    "sources": [
      {
        "label": "Docker · réutilisation du cache",
        "url": "https://docs.docker.com/get-started/docker-concepts/building-images/using-the-build-cache/",
        "kind": "official"
      },
      {
        "label": "npm · installation depuis un lockfile",
        "url": "https://docs.npmjs.com/cli/v11/commands/npm-ci/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-07",
    "cp": "cp1",
    "technology": "docker",
    "question": "Que fait .dockerignore dans un build ?",
    "answer": "Il exclut des fichiers du contexte envoyé au build, par exemple .env, .git ou node_modules.",
    "detail": "COPY ne doit pas emporter des secrets ou des dépendances installées sur une autre machine.",
    "tags": [
      "Docker",
      "Dockerfile"
    ],
    "sources": [
      {
        "label": "Docker · instructions du Dockerfile",
        "url": "https://docs.docker.com/reference/dockerfile/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-08",
    "cp": "cp1",
    "technology": "docker",
    "question": "Comment distinguer un argument de build et une variable au démarrage ?",
    "answer": "ARG configure la fabrication de l’image ; une variable donnée avec docker run -e configure le programme lancé.",
    "detail": "Changer TITLE=Lire en TITLE=Marcher ne nécessite pas de rebuild si le programme lit cette variable au démarrage. Ne pas placer de secrets dans l’image.",
    "tags": [
      "Docker",
      "Configuration"
    ],
    "sources": [
      {
        "label": "Docker · instructions du Dockerfile",
        "url": "https://docs.docker.com/reference/dockerfile/",
        "kind": "official"
      },
      {
        "label": "Docker · créer et démarrer un conteneur",
        "url": "https://docs.docker.com/reference/cli/docker/container/run/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-09",
    "cp": "cp10",
    "technology": "docker",
    "question": "Deux services Compose web et client : quelle adresse client utilise-t-il pour web ?",
    "answer": "Le nom du service et son port interne, par exemple http://web:80.",
    "detail": "localhost dans client désigne client lui-même. Le navigateur de ta machine utilise le port publié, par exemple 8090.",
    "tags": [
      "Docker",
      "Compose",
      "Réseau"
    ],
    "sources": [
      {
        "label": "Docker Compose · réseau et noms de services",
        "url": "https://docs.docker.com/compose/how-tos/networking/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-10",
    "cp": "cp10",
    "technology": "docker",
    "question": "Volume nommé ou bind mount : quelle différence ?",
    "answer": "Le volume nommé est un stockage géré par Docker ; le bind mount expose un chemin précis de ta machine dans le conteneur.",
    "detail": "Un volume convient aux données persistantes ; un bind mount peut partager le code en développement.",
    "tags": [
      "Docker",
      "Stockage"
    ],
    "sources": [
      {
        "label": "Docker · volumes persistants",
        "url": "https://docs.docker.com/engine/storage/volumes/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-11",
    "cp": "cp10",
    "technology": "docker",
    "question": "docker compose down et down -v : quelle conséquence sur les données ?",
    "answer": "down conserve normalement les volumes nommés ; down -v supprime aussi ces volumes et les données qui y sont stockées.",
    "detail": "Les données uniquement présentes dans la couche du conteneur supprimé sont perdues même sans -v.",
    "tags": [
      "Docker",
      "Persistance"
    ],
    "sources": [
      {
        "label": "Docker Compose · arrêt et suppression",
        "url": "https://docs.docker.com/reference/cli/docker/compose/down/",
        "kind": "official"
      },
      {
        "label": "Docker · volumes persistants",
        "url": "https://docs.docker.com/engine/storage/volumes/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-docker-12",
    "cp": "cp10",
    "technology": "docker",
    "question": "Un service démarré est-il forcément prêt à répondre ?",
    "answer": "Non : le programme peut encore s’initialiser. Un healthcheck vérifie sa disponibilité ; service_healthy peut attendre sa réussite initiale.",
    "detail": "depends_on sous forme simple impose un ordre, pas la disponibilité complète. Un service peut aussi tomber en panne plus tard.",
    "tags": [
      "Docker",
      "Disponibilité"
    ],
    "sources": [
      {
        "label": "Docker Compose · démarrage et disponibilité",
        "url": "https://docs.docker.com/compose/how-tos/startup-order/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-01",
    "cp": "cp9",
    "technology": "tests",
    "question": "Qu’apportent node:test et Vitest pour tester du JavaScript ?",
    "answer": "Ils exécutent des tests et signalent ceux qui réussissent ou échouent. node:test est intégré à Node ; Vitest est un package à installer.",
    "detail": "node:assert fournit des assertions côté Node ; Vitest fournit notamment expect.",
    "tags": [
      "Tests JS",
      "node:test",
      "Vitest"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      },
      {
        "label": "Vitest · installer et lancer des tests",
        "url": "https://vitest.dev/guide/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-02",
    "cp": "cp9",
    "technology": "tests",
    "question": "Dans un test, quel rôle a une assertion ?",
    "answer": "Elle compare un résultat observé à une attente ou vérifie une condition, et échoue si cette vérification n’est pas satisfaite.",
    "detail": "Le runner lance le test ; l’assertion décide si son observation respecte le besoin.",
    "tags": [
      "Tests JS",
      "Bases"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      },
      {
        "label": "Node.js · vérifier un résultat avec assert",
        "url": "https://nodejs.org/api/assert.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-03",
    "cp": "cp9",
    "technology": "tests",
    "question": "Comment lire Arrange, Act et Assert sur un exemple de compteur ?",
    "answer": "Préparer la liste de tâches ; appeler countDone(liste) ; vérifier que le nombre vaut le total de tâches terminées attendu.",
    "detail": "Une liste avec une tâche terminée et une à faire doit donner 1. L’attendu doit être choisi indépendamment du résultat.",
    "tags": [
      "Tests JS",
      "AAA"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      },
      {
        "label": "Node.js · vérifier un résultat avec assert",
        "url": "https://nodejs.org/api/assert.html",
        "kind": "official"
      },
      {
        "label": "Microsoft Learn · organiser des tests unitaires avec Arrange, Act, Assert",
        "url": "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-04",
    "cp": "cp9",
    "technology": "tests",
    "question": "Quelles parties vérifient les tests unitaire, d’intégration et E2E ?",
    "answer": "Unitaire : une unité isolée. Intégration : plusieurs composants reliés. E2E : un scénario utilisateur complet.",
    "detail": "Une fonction de filtrage est unitaire ; une requête vers un serveur est une intégration ; créer une tâche via un navigateur est un E2E.",
    "tags": [
      "Tests JS",
      "Niveaux"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      },
      {
        "label": "Vitest · installer et lancer des tests",
        "url": "https://vitest.dev/guide/",
        "kind": "official"
      },
      {
        "label": "Microsoft Learn · organiser des tests unitaires avec Arrange, Act, Assert",
        "url": "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices",
        "kind": "official"
      },
      {
        "label": "Playwright · tests de scénarios dans le navigateur",
        "url": "https://playwright.dev/docs/intro",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-05",
    "cp": "cp9",
    "technology": "tests",
    "question": "Deux objets { id: 7 } créés séparément : strictEqual ou deepStrictEqual ?",
    "answer": "deepStrictEqual pour comparer leur contenu. strictEqual vérifierait qu’il s’agit du même objet.",
    "detail": "Les deux objets peuvent contenir les mêmes champs sans être la même référence en mémoire.",
    "tags": [
      "Tests JS",
      "node:assert"
    ],
    "sources": [
      {
        "label": "Node.js · vérifier un résultat avec assert",
        "url": "https://nodejs.org/api/assert.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-06",
    "cp": "cp9",
    "technology": "tests",
    "question": "Quelle assertion distingue une exception immédiate d’une promesse rejetée ?",
    "answer": "assert.throws attend une exception synchrone ; await assert.rejects attend le rejet d’une promesse.",
    "detail": "Passer une fonction pour que l’assertion observe l’opération. Ne pas oublier await pour rejects.",
    "tags": [
      "Tests JS",
      "Erreurs"
    ],
    "sources": [
      {
        "label": "Node.js · vérifier un résultat avec assert",
        "url": "https://nodejs.org/api/assert.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-07",
    "cp": "cp9",
    "technology": "tests",
    "question": "Pourquoi faut-il attendre une requête asynchrone dans le test ?",
    "answer": "Pour que le test ne se termine pas avant son résultat et ses assertions.",
    "detail": "Retourner la promesse ou utiliser async avec await relie son achèvement à celui du test.",
    "tags": [
      "Tests JS",
      "Asynchrone"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-08",
    "cp": "cp9",
    "technology": "tests",
    "question": "Qu’est-ce qu’un double de test pour une lecture en BDD ?",
    "answer": "Une fonction de remplacement qui renvoie des données ou une erreur contrôlée sans joindre la vraie BDD.",
    "detail": "Il permet de vérifier la logique appelante ; il ne démontre pas que la connexion réelle fonctionne.",
    "tags": [
      "Tests JS",
      "Mock"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-09",
    "cp": "cp9",
    "technology": "tests",
    "question": "Que veut dire injecter une dépendance dans une fonction ?",
    "answer": "La passer explicitement en argument, pour pouvoir fournir la vraie implémentation ou une version de test.",
    "detail": "makeService(readTask) peut recevoir une vraie lecture BDD en application et une fonction renvoyant { id: 7, title: \"Lire\" } dans un test.",
    "tags": [
      "Tests JS",
      "Injection"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-10",
    "cp": "cp9",
    "technology": "tests",
    "question": "Comment vérifier les arguments reçus par un double node:test ?",
    "answer": "Créer le double avec t.mock.fn, puis lire fn.mock.calls et fn.mock.callCount().",
    "detail": "Comparer calls[0].arguments à [7] prouve l’identifiant transmis ; vérifier aussi le résultat renvoyé.",
    "tags": [
      "Tests JS",
      "node:test",
      "Mock"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-11",
    "cp": "cp9",
    "technology": "tests",
    "question": "Pourquoi réserver une base distincte aux tests qui écrivent des données ?",
    "answer": "Pour préparer et nettoyer un état connu sans effacer les données à conserver et sans dépendre des autres tests.",
    "detail": "Une suppression de fixtures doit viser la base dédiée ; la configuration de connexion fait partie du contexte de test.",
    "tags": [
      "Tests JS",
      "Données"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      },
      {
        "label": "Prisma ORM 6 · transactions",
        "url": "https://www.prisma.io/docs/orm/v6/prisma-client/queries/transactions",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-12",
    "cp": "cp9",
    "technology": "tests",
    "question": "Que peuvent faire beforeEach et after dans une suite de tests ?",
    "answer": "beforeEach prépare le contexte avant chaque test ; after libère les ressources communes à la fin.",
    "detail": "Réinitialiser les données empêche une dépendance à l’ordre ; fermer le serveur et la connexion évite un processus qui reste ouvert.",
    "tags": [
      "Tests JS",
      "Hooks"
    ],
    "sources": [
      {
        "label": "Node.js · exécuter des tests",
        "url": "https://nodejs.org/api/test.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-13",
    "cp": "cp9",
    "technology": "tests",
    "question": "Avec Axios et validateStatus: () => true, comment tester un 404 ?",
    "answer": "Attendre la réponse puis comparer response.status à 404 et vérifier le corps.",
    "detail": "Cette option accepte les statuts HTTP ; une erreur réseau peut encore rejeter la promesse.",
    "tags": [
      "Tests JS",
      "Axios"
    ],
    "sources": [
      {
        "label": "Axios · statuts HTTP et erreurs",
        "url": "https://axios-http.com/docs/handling_errors",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-14",
    "cp": "cp9",
    "technology": "tests",
    "question": "Pourquoi comparer result.length à result.length ne prouve-t-il pas le résultat attendu ?",
    "answer": "On compare une valeur à elle-même : le test passe même si le résultat métier est faux.",
    "detail": "Il faut une attente indépendante, par exemple 1 tâche terminée parmi les données du test.",
    "tags": [
      "Tests JS",
      "Assertions"
    ],
    "sources": [
      {
        "label": "Node.js · vérifier un résultat avec assert",
        "url": "https://nodejs.org/api/assert.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-15",
    "cp": "cp9",
    "technology": "tests",
    "question": "Dans Vitest, quel matcher choisir pour un tableau de titres ?",
    "answer": "toEqual compare la structure et le contenu du tableau ; toBe comparerait son identité.",
    "detail": "expect([\"Lire\"]).toEqual([\"Lire\"]) réussit ; les tableaux restent deux objets distincts.",
    "tags": [
      "Tests JS",
      "Vitest"
    ],
    "sources": [
      {
        "label": "Vitest · comparer les résultats",
        "url": "https://vitest.dev/api/expect.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-tests-16",
    "cp": "cp9",
    "technology": "tests",
    "question": "Que signifie Red → Green → Refactor sur une fonction nouvelle ?",
    "answer": "Écrire un test qui échoue pour le besoin ; implémenter pour le rendre vert ; améliorer le code en gardant les tests verts.",
    "detail": "Un test qui attend [\"Marcher\"] doit échouer si la fonction renvoie toujours []. Il guide ensuite le filtrage et la transformation.",
    "tags": [
      "Tests JS",
      "TDD"
    ],
    "sources": [
      {
        "label": "Vitest · installer et lancer des tests",
        "url": "https://vitest.dev/guide/",
        "kind": "official"
      },
      {
        "label": "Vitest · comparer les résultats",
        "url": "https://vitest.dev/api/expect.html",
        "kind": "official"
      },
      {
        "label": "Microsoft Learn · cycle Red, Green, Refactor",
        "url": "https://learn.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/contact-manager/iteration-6-use-test-driven-development-cs",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-01",
    "cp": "cp3",
    "technology": "backend",
    "question": "Qu’est-ce qu’une route dans une API Express ?",
    "answer": "L’association d’une méthode HTTP et d’un chemin à une fonction qui traite la demande.",
    "detail": "GET /tasks/1 sert à lire la tâche 1 ; le handler ou contrôleur organise son traitement et sa réponse.",
    "tags": [
      "Backend",
      "Express",
      "Bases"
    ],
    "sources": [
      {
        "label": "Express 5 · premier serveur",
        "url": "https://expressjs.com/en/starter/hello-world/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-02",
    "cp": "cp3",
    "technology": "backend",
    "question": "Dans /tasks/7?page=2 avec un JSON envoyé, où lire ces trois données ?",
    "answer": "7 dans req.params.id ; 2 dans req.query.page ; le JSON décodé dans req.body après express.json.",
    "detail": "Params et query peuvent être du texte ; convertir puis valider. Toutes ces données viennent du client.",
    "tags": [
      "Backend",
      "Requête"
    ],
    "sources": [
      {
        "label": "Express 5 · chaîne de middlewares",
        "url": "https://expressjs.com/en/guide/using-middleware/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-03",
    "cp": "cp3",
    "technology": "backend",
    "question": "À quoi sert next() dans une chaîne de middlewares ?",
    "answer": "À transmettre le traitement au middleware suivant lorsque la fonction ne termine pas la réponse.",
    "detail": "Un middleware qui ne répond pas et n’appelle pas next laisse la requête en attente. Leur ordre suit les besoins du traitement.",
    "tags": [
      "Backend",
      "Middleware"
    ],
    "sources": [
      {
        "label": "Express 5 · chaîne de middlewares",
        "url": "https://expressjs.com/en/guide/using-middleware/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-04",
    "cp": "cp3",
    "technology": "backend",
    "question": "Express 5 : comment un rejet de handler async rejoint-il la gestion d’erreur ?",
    "answer": "Express transmet automatiquement le rejet de la promesse retournée au traitement des erreurs.",
    "detail": "Le middleware d’erreur reçoit error, req, res, next. Une opération détachée ou un callback exige une gestion explicite adaptée.",
    "tags": [
      "Backend",
      "Erreurs"
    ],
    "sources": [
      {
        "label": "Express 5 · traitement des erreurs",
        "url": "https://expressjs.com/en/guide/error-handling/",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-05",
    "cp": "cp3",
    "technology": "backend",
    "question": "Pourquoi vérifier le JSON à l’exécution même si le code utilise TypeScript ?",
    "answer": "Parce que le type du code ne contrôle pas ce qu’un client envoie réellement. Une validation comme Zod vérifie les valeurs reçues.",
    "detail": "Un client peut envoyer { title: 123 } alors que le programme attend un titre texte.",
    "tags": [
      "Backend",
      "Zod",
      "Validation"
    ],
    "sources": [
      {
        "label": "Zod · validation des données à l’exécution",
        "url": "https://zod.dev/basics",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-06",
    "cp": "cp3",
    "technology": "backend",
    "question": "Zod : que renvoient parse et safeParse pour une entrée invalide ?",
    "answer": "parse lève une ZodError ; safeParse retourne success: false et error.",
    "detail": "En cas de succès, parse renvoie les données validées ; safeParse fournit success: true et data.",
    "tags": [
      "Backend",
      "Zod"
    ],
    "sources": [
      {
        "label": "Zod · validation des données à l’exécution",
        "url": "https://zod.dev/basics",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-07",
    "cp": "cp3",
    "technology": "backend",
    "question": "Comment distinguer 401, 403, 404, 409 et 422 ?",
    "answer": "401 : authentification nécessaire ou invalide ; 403 : refus d’accès ; 404 : ressource non trouvée ; 409 : conflit ; 422 : contenu compris mais non traitable.",
    "detail": "Un titre déjà pris peut produire 409 ; un titre de mauvais type peut produire 422 selon le contrat choisi.",
    "tags": [
      "Backend",
      "HTTP"
    ],
    "sources": [
      {
        "label": "RFC 9110 · codes de réponse HTTP",
        "url": "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes",
        "kind": "standard"
      }
    ]
  },
  {
    "id": "course-backend-08",
    "cp": "cp3",
    "technology": "backend",
    "question": "Une personne connectée peut-elle modifier toutes les tâches ?",
    "answer": "Non : le serveur doit vérifier la permission sur la tâche, par exemple comparer son propriétaire à l’identité authentifiée.",
    "detail": "L’identité répond « qui ? » ; la permission répond « a-t-il le droit sur cette ressource ? ».",
    "tags": [
      "Backend",
      "Permissions"
    ],
    "sources": [
      {
        "label": "OWASP · vérifier les permissions",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-09",
    "cp": "cp3",
    "technology": "backend",
    "question": "Pourquoi lire un JWT avec decode ne suffit-il pas pour accepter l’identité ?",
    "answer": "decode ne vérifie pas la signature. verify contrôle le jeton avec la clé et les options attendues, notamment l’expiration.",
    "detail": "Vérifier ensuite la forme et les informations attendues du contenu ; une signature ne transforme pas le contenu en secret.",
    "tags": [
      "Backend",
      "JWT"
    ],
    "sources": [
      {
        "label": "jsonwebtoken · signature, verify et decode",
        "url": "https://github.com/auth0/node-jsonwebtoken",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-10",
    "cp": "cp3",
    "technology": "backend",
    "question": "Que protègent un hash de mot de passe et un cookie HttpOnly ?",
    "answer": "Le hash adapté permet de vérifier le mot de passe sans conserver le texte. HttpOnly empêche JavaScript de lire le cookie.",
    "detail": "Ce sont deux mécanismes différents : ni le hash ni HttpOnly ne remplacent les permissions ; HttpOnly ne suffit pas contre une requête CSRF.",
    "tags": [
      "Backend",
      "Mot de passe",
      "Cookies"
    ],
    "sources": [
      {
        "label": "OWASP · stockage des mots de passe",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
        "kind": "official"
      },
      {
        "label": "MDN · propriétés d’un cookie HTTP",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-11",
    "cp": "cp8",
    "technology": "backend",
    "question": "Prisma 6 : que renvoient findMany et findUnique quand aucune donnée ne correspond ?",
    "answer": "findMany renvoie un tableau vide ; findUnique renvoie null.",
    "detail": "Une liste vide peut être une réponse normale ; une route visant un identifiant absent peut traduire null en 404 selon son contrat.",
    "tags": [
      "Backend",
      "Prisma"
    ],
    "sources": [
      {
        "label": "Prisma ORM 6 · méthodes du client",
        "url": "https://www.prisma.io/docs/orm/v6/reference/prisma-client-reference",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-12",
    "cp": "cp8",
    "technology": "backend",
    "question": "Prisma 6 : que font where, select et include sur une lecture de tâches ?",
    "answer": "where filtre les lignes ; select choisit les champs renvoyés ; include ajoute les données d’une relation.",
    "detail": "include: { board: true } permet de lire la liste liée à la tâche. select et include ne se combinent pas au même niveau.",
    "tags": [
      "Backend",
      "Prisma"
    ],
    "sources": [
      {
        "label": "Prisma ORM 6 · méthodes du client",
        "url": "https://www.prisma.io/docs/orm/v6/reference/prisma-client-reference",
        "kind": "official"
      },
      {
        "label": "Prisma ORM 6 · lire les relations",
        "url": "https://www.prisma.io/docs/orm/v6/prisma-client/queries/relation-queries",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-13",
    "cp": "cp8",
    "technology": "backend",
    "question": "Pourquoi une pagination doit-elle avoir une taille bornée et un tri stable ?",
    "answer": "Pour limiter le volume lu et retrouver un ordre déterminé entre pages. skip ignore un nombre de lignes ; take limite les résultats.",
    "detail": "Prisma 6 : orderBy: { id: \"asc\" }, skip: (page - 1) * pageSize, take: pageSize ; valider page et pageSize avant.",
    "tags": [
      "Backend",
      "Pagination"
    ],
    "sources": [
      {
        "label": "Prisma ORM 6 · méthodes du client",
        "url": "https://www.prisma.io/docs/orm/v6/reference/prisma-client-reference",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-14",
    "cp": "cp8",
    "technology": "backend",
    "question": "Prisma 6 : que différencient generate, migrate dev et migrate deploy ?",
    "answer": "generate produit le client ; migrate dev prépare et applique des migrations en développement ; migrate deploy applique les migrations existantes.",
    "detail": "Une migration change la structure de la base ; un seed ajoute des données. Générer les méthodes ne crée pas les tables.",
    "tags": [
      "Backend",
      "Migrations"
    ],
    "sources": [
      {
        "label": "Prisma ORM 6 · générer un client",
        "url": "https://www.prisma.io/docs/orm/v6/prisma-schema/overview/generators",
        "kind": "official"
      },
      {
        "label": "Prisma ORM 6 · migrations en développement et déploiement",
        "url": "https://www.prisma.io/docs/orm/v6/prisma-migrate/workflows/development-and-production",
        "kind": "official"
      }
    ]
  },
  {
    "id": "course-backend-15",
    "cp": "cp8",
    "technology": "backend",
    "question": "Deux demandes peuvent-elles créer le même nom malgré une vérification préalable ?",
    "answer": "Oui : chacune peut voir le nom libre avant que l’autre écrive. Une contrainte UNIQUE en BDD impose l’unicité au moment de l’écriture.",
    "detail": "Traiter l’erreur de contrainte pour fournir une réponse cohérente, par exemple 409 si le contrat utilise ce statut.",
    "tags": [
      "Backend",
      "Contraintes"
    ],
    "sources": [
      {
        "label": "Prisma ORM 6 · méthodes du client",
        "url": "https://www.prisma.io/docs/orm/v6/reference/prisma-client-reference",
        "kind": "official"
      },
      {
        "label": "RFC 9110 · codes de réponse HTTP",
        "url": "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes",
        "kind": "standard"
      }
    ]
  },
  {
    "id": "course-backend-16",
    "cp": "cp8",
    "technology": "backend",
    "question": "Pourquoi une transaction et une requête SQL paramétrée protègent-elles deux problèmes différents ?",
    "answer": "La transaction évite un groupe d’écritures partiellement validé ; les paramètres évitent qu’une saisie soit interprétée comme une instruction SQL.",
    "detail": "Si le deuxième compte du transfert ne peut être mis à jour, le premier reste inchangé. Un sanitizer HTML ne protège pas une concaténation SQL.",
    "tags": [
      "Backend",
      "Transaction",
      "SQL"
    ],
    "sources": [
      {
        "label": "Prisma ORM 6 · transactions",
        "url": "https://www.prisma.io/docs/orm/v6/prisma-client/queries/transactions",
        "kind": "official"
      },
      {
        "label": "OWASP · prévention des injections SQL",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
        "kind": "official"
      }
    ]
  }
];

export const courseSources = [
  {
    "label": "Docker · définition d’une image",
    "url": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "Docker · définition d’un conteneur",
    "url": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "Docker · créer et démarrer un conteneur",
    "url": "https://docs.docker.com/reference/cli/docker/container/run/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "Docker · instructions du Dockerfile",
    "url": "https://docs.docker.com/reference/dockerfile/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "Docker · réutilisation du cache",
    "url": "https://docs.docker.com/get-started/docker-concepts/building-images/using-the-build-cache/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "Docker Compose · réseau et noms de services",
    "url": "https://docs.docker.com/compose/how-tos/networking/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "Docker Compose · démarrage et disponibilité",
    "url": "https://docs.docker.com/compose/how-tos/startup-order/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "Docker · volumes persistants",
    "url": "https://docs.docker.com/engine/storage/volumes/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "Docker Compose · arrêt et suppression",
    "url": "https://docs.docker.com/reference/cli/docker/compose/down/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "npm · installation depuis un lockfile",
    "url": "https://docs.npmjs.com/cli/v11/commands/npm-ci/",
    "kind": "official",
    "technology": "docker"
  },
  {
    "label": "Node.js · exécuter des tests",
    "url": "https://nodejs.org/api/test.html",
    "kind": "official",
    "technology": "tests"
  },
  {
    "label": "Node.js · vérifier un résultat avec assert",
    "url": "https://nodejs.org/api/assert.html",
    "kind": "official",
    "technology": "tests"
  },
  {
    "label": "Node.js · créer un serveur HTTP",
    "url": "https://nodejs.org/api/http.html",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "MDN · requête et réponse avec fetch",
    "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
    "kind": "official",
    "technology": "tests"
  },
  {
    "label": "Axios · statuts HTTP et erreurs",
    "url": "https://axios-http.com/docs/handling_errors",
    "kind": "official",
    "technology": "tests"
  },
  {
    "label": "Vitest · installer et lancer des tests",
    "url": "https://vitest.dev/guide/",
    "kind": "official",
    "technology": "tests"
  },
  {
    "label": "Vitest · comparer les résultats",
    "url": "https://vitest.dev/api/expect.html",
    "kind": "official",
    "technology": "tests"
  },
  {
    "label": "Express 5 · premier serveur",
    "url": "https://expressjs.com/en/starter/hello-world/",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "Express 5 · chaîne de middlewares",
    "url": "https://expressjs.com/en/guide/using-middleware/",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "Express 5 · traitement des erreurs",
    "url": "https://expressjs.com/en/guide/error-handling/",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "Zod · validation des données à l’exécution",
    "url": "https://zod.dev/basics",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "RFC 9110 · codes de réponse HTTP",
    "url": "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes",
    "kind": "standard",
    "technology": "backend"
  },
  {
    "label": "OWASP · vérifier les permissions",
    "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "OWASP · stockage des mots de passe",
    "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "jsonwebtoken · signature, verify et decode",
    "url": "https://github.com/auth0/node-jsonwebtoken",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "MDN · propriétés d’un cookie HTTP",
    "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "Prisma ORM 6 · méthodes du client",
    "url": "https://www.prisma.io/docs/orm/v6/reference/prisma-client-reference",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "Prisma ORM 6 · lire les relations",
    "url": "https://www.prisma.io/docs/orm/v6/prisma-client/queries/relation-queries",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "Prisma ORM 6 · générer un client",
    "url": "https://www.prisma.io/docs/orm/v6/prisma-schema/overview/generators",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "Prisma ORM 6 · migrations en développement et déploiement",
    "url": "https://www.prisma.io/docs/orm/v6/prisma-migrate/workflows/development-and-production",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "Prisma ORM 6 · transactions",
    "url": "https://www.prisma.io/docs/orm/v6/prisma-client/queries/transactions",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "OWASP · prévention des injections SQL",
    "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
    "kind": "official",
    "technology": "backend"
  },
  {
    "label": "Microsoft Learn · organiser des tests unitaires avec Arrange, Act, Assert",
    "url": "https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices",
    "kind": "official",
    "technology": "tests"
  },
  {
    "label": "Microsoft Learn · cycle Red, Green, Refactor",
    "url": "https://learn.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/contact-manager/iteration-6-use-test-driven-development-cs",
    "kind": "official",
    "technology": "tests"
  },
  {
    "label": "Playwright · tests de scénarios dans le navigateur",
    "url": "https://playwright.dev/docs/intro",
    "kind": "official",
    "technology": "tests"
  },
  {
    "label": "Prisma ORM 6 · configurer la source de données",
    "url": "https://www.prisma.io/docs/orm/v6/prisma-schema/overview/data-sources",
    "kind": "official",
    "technology": "backend"
  }
];
