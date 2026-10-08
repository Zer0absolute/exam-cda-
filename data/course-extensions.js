/** Notions autonomes et exercices corrigés, fondés sur des sources primaires. */
const official = (label, url) => ({ label, url, kind: 'official' });
const docs = {
  reactStart: official('React · Créer une application', 'https://react.dev/learn/build-a-react-app-from-scratch'),
  vite: official('Vite · Démarrer un projet', 'https://vite.dev/guide/'),
  props: official('React · Transmettre des props', 'https://react.dev/learn/passing-props-to-a-component'),
  state: official('React · useState', 'https://react.dev/reference/react/useState'),
  shared: official('React · Partager un état', 'https://react.dev/learn/sharing-state-between-components'),
  input: official('React · Champs input', 'https://react.dev/reference/react-dom/components/input'),
  arrays: official('React · Mettre à jour un tableau', 'https://react.dev/learn/updating-arrays-in-state'),
  effect: official('React · useEffect et nettoyage', 'https://react.dev/reference/react/useEffect'),
  fetch: official('MDN · Utiliser fetch', 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch'),
  router: official('React Router · BrowserRouter', 'https://reactrouter.com/api/declarative-routers/BrowserRouter'),
  params: official('React Router · useParams', 'https://reactrouter.com/api/hooks/useParams'),
  navigate: official('React Router · Navigate', 'https://reactrouter.com/api/components/Navigate'),
  mongoData: official('MongoDB · Bases et collections', 'https://www.mongodb.com/docs/manual/core/databases-and-collections/'),
  mongoInsert: official('MongoDB · insertMany', 'https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/'),
  mongoFind: official('MongoDB · find et curseurs', 'https://www.mongodb.com/docs/manual/reference/method/db.collection.find/'),
  mongoDriver: official('MongoDB · Rechercher avec Node.js', 'https://www.mongodb.com/docs/drivers/node/current/crud/query/retrieve/'),
  mongoValidation: official('MongoDB · Validation du schéma', 'https://www.mongodb.com/docs/manual/core/schema-validation/'),
  mongoMatch: official('MongoDB · $match', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/'),
  mongoGroup: official('MongoDB · $group', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/'),
  mongoLookup: official('MongoDB · $lookup', 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/'),
  winston: official('Winston · Logger et transports', 'https://github.com/winstonjs/winston'),
  logging: official('OWASP · Contenu et protection des logs', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html'),
  microservices: official('Microsoft · Architecture en microservices', 'https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices'),
  formidable: official('Formidable · Parser un envoi multipart', 'https://github.com/node-formidable/formidable'),
  upload: official('OWASP · Contrôler les fichiers envoyés', 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html'),
  gqlSchema: official('GraphQL · Schéma et types', 'https://graphql.org/learn/schema/'),
  gqlQueries: official('GraphQL · Requêtes et mutations', 'https://graphql.org/learn/queries/'),
  gqlExecution: official('GraphQL · Exécution', 'https://graphql.org/learn/execution/'),
  apollo: official('Apollo Server · Démarrer un serveur', 'https://www.apollographql.com/docs/apollo-server/getting-started'),
  resolvers: official('Apollo Server · Resolvers', 'https://www.apollographql.com/docs/apollo-server/data/resolvers'),
  pgQueries: official('node-postgres · Requêtes paramétrées', 'https://node-postgres.com/features/queries'),
  pgPool: official('node-postgres · Pool de connexions', 'https://node-postgres.com/features/pooling'),
  dataLoader: official('GraphQL DataLoader · Regrouper les accès', 'https://github.com/graphql/dataloader'),
  socketIntro: official('Socket.IO · Protocole et transports', 'https://socket.io/docs/v4/'),
  socketSetup: official('Socket.IO · Initialiser le serveur', 'https://socket.io/docs/v4/server-initialization/'),
  socketEmit: official('Socket.IO · Émettre et confirmer', 'https://socket.io/docs/v4/emitting-events/'),
  socketListen: official('Socket.IO · Écouter et retirer un écouteur', 'https://socket.io/docs/v4/listening-to-events/'),
  socketClient: official('Socket.IO · API du client', 'https://socket.io/docs/v4/client-api/'),
  socketBroadcast: official('Socket.IO · Diffuser', 'https://socket.io/docs/v4/broadcasting-events/'),
  socketRooms: official('Socket.IO · Rooms', 'https://socket.io/docs/v4/rooms/'),
  socketDisconnect: official('Socket.IO · Déconnexions', 'https://socket.io/docs/v4/tutorial/handling-disconnections'),
  socketMiddleware: official('Socket.IO · Middleware de connexion', 'https://socket.io/docs/v4/middlewares/'),
  i18nStart: official('i18next · Initialiser et traduire', 'https://www.i18next.com/overview/getting-started'),
  i18nApi: official('i18next · init et changeLanguage', 'https://www.i18next.com/overview/api'),
  i18nKeys: official('i18next · Fonction t et recherche des clés', 'https://www.i18next.com/translation-function/essentials'),
  i18nFallback: official('i18next · Langues de repli', 'https://www.i18next.com/principles/fallback'),
  i18nInterpolation: official('i18next · Interpolation', 'https://www.i18next.com/translation-function/interpolation'),
  i18nPlural: official('i18next · Pluriels et count', 'https://www.i18next.com/translation-function/plurals'),
  i18nHttp: official('i18next · Middleware HTTP', 'https://github.com/i18next/i18next-http-middleware'),
  i18nFiles: official('i18next · Traductions depuis des fichiers', 'https://github.com/i18next/i18next-fs-backend'),
  intl: { label: 'ECMA-402 · Formatage des nombres', url: 'https://tc39.es/ecma402/#sec-intl-numberformat-constructor', kind: 'standard' },
};
const sources = (...keys) => keys.map(key => docs[key]);
const lesson = (cp, technology, title, body, bullets, code, exercise, sourceKeys) => ({
  cp, technology,
  section: { title, body, bullets, code, exercise, sources: sources(...sourceKeys) },
});

export const courseSections = [
  lesson('cp2', 'react', 'React · Composant, props et état',
    'On veut afficher un compteur de places réservées. Un composant est une fonction qui décrit un morceau d’interface. React réaffiche cette description lorsque son état change. Prérequis de lecture : fonctions JavaScript et HTML ; aucune ancienne application à connaître.', [
      'JSX décrit l’interface dans JavaScript. {count} affiche une valeur JavaScript ; onClick reçoit une fonction à appeler au clic.',
      'Une prop est une entrée fournie par le parent : ici title. Un état est une valeur conservée par React : count. useState(0) donne la valeur initiale et sa fonction de mise à jour.',
      'Pour essayer : avec Node 22.12+ accepté par Vite, lancer npm create vite@latest essai-react -- --template react, puis cd essai-react, npm install et npm run dev. Remplacer src/App.jsx par le code ci-dessous.',
      'Résultat attendu : « Places réservées : 0 », puis 1 et 2 après deux clics. previous => previous + 1 calcule chaque mise à jour à partir de la valeur précédente.',
    ], `// src/App.jsx
import { useState } from 'react';

function Counter({ title }) {
  const [count, setCount] = useState(0);
  return <section>
    <h1>{title} : {count}</h1>
    <button onClick={() => setCount(previous => previous + 1)}>
      Réserver une place
    </button>
  </section>;
}
export default function App() {
  return <Counter title="Places réservées" />;
}`,
    { prompt: 'Identifie la prop, l’état et l’événement. Ajoute un bouton qui remet le compteur à zéro. Quel affichage obtient-on après trois réservations puis ce bouton ?', answer: 'title est la prop, count est l’état et onClick réagit au clic. Ajouter <button onClick={() => setCount(0)}>Repartir de zéro</button>. Après la remise à zéro, le titre affiche « Places réservées : 0 ».' },
    ['reactStart', 'vite', 'props', 'state']),

  lesson('cp2', 'react', 'React · Champ contrôlé et valeur partagée',
    'On veut saisir un prénom et afficher un aperçu. Un champ contrôlé affiche une valeur de l’état ; chaque saisie met cet état à jour. Prérequis : useState. Le composant complet remplace App.jsx dans un petit projet React ; la fiche précédente indique comment en créer un.', [
      'value={name} lit l’état ; onChange récupère le texte avec event.target.value. Sans mise à jour de l’état, un champ contrôlé ne suit pas la saisie.',
      'Le champ et l’aperçu utilisent une seule valeur. S’ils deviennent deux composants, leur parent commun peut posséder l’état puis transmettre valeur et fonction de modification.',
      'Une liste filtrée peut être calculée avec filter pendant le rendu. La copier systématiquement dans un second état peut créer deux valeurs incohérentes.',
      'Résultat attendu : saisir Lina affiche « Bonjour Lina ». Pour ajouter à un tableau d’état, créer une valeur avec [...previous, item] ; push modifie le tableau existant.',
    ], `// src/App.jsx
import { useState } from 'react';
export default function App() {
  const [name, setName] = useState('');
  return <main>
    <label>Prénom
      <input value={name}
        onChange={event => setName(event.target.value)} />
    </label>
    <p>Bonjour {name || 'visiteur'}</p>
  </main>;
}`,
    { prompt: 'Le onChange a été supprimé : quel problème observes-tu ? Ajoute un bouton qui vide le champ et l’aperçu.', answer: 'La saisie ne met plus name à jour, donc le champ contrôlé ne suit pas le texte tapé. Rétablir onChange puis ajouter <button onClick={() => setName(\'\')}>Effacer</button>. Le champ devient vide et l’aperçu affiche « Bonjour visiteur ».' },
    ['input', 'shared', 'arrays']),

  lesson('cp2', 'react', 'React · Chargement de données et useEffect',
    'On veut lire deux activités dans un fichier JSON par HTTP. useEffect organise cette synchronisation après le rendu. Prérequis : un petit projet React, promesses et async/await. Le code définit ses données et ne nécessite aucun serveur métier.', [
      'Créer public/activities.json avec [{"id":1,"title":"Lire"},{"id":2,"title":"Marcher"}]. Le serveur de développement le rend accessible à /activities.json.',
      'Prévoir attente, données, liste vide et erreur. fetch ne rejette pas automatiquement une réponse 404 : vérifier response.ok.',
      'Les dépendances sont les valeurs réactives utilisées par l’effet. Ici l’URL est fixe et aucune valeur réactive n’est lue : []. Le nettoyage annule une requête devenue inutile.',
      'Résultat attendu : « Chargement… », puis Lire et Marcher. En développement, Strict Mode peut vérifier le nettoyage par une exécution supplémentaire.',
    ], `// src/App.jsx
import { useEffect, useState } from 'react';
export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/activities.json', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Fichier indisponible');
        setItems(await response.json());
      } catch (error) {
        if (error.name !== 'AbortError') setError(error.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);
  if (loading) return <p>Chargement…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (items.length === 0) return <p>Aucune activité.</p>;
  return <ul>{items.map(item =>
    <li key={item.id}>{item.title}</li>)}</ul>;
}`,
    { prompt: 'Prédis l’affichage pour un fichier contenant [], puis pour un fichier absent. Pourquoi ne pas lancer directement fetch dans le corps du composant ?', answer: '[] affiche « Aucune activité ». Un fichier absent produit ici « Fichier indisponible ». fetch dans le corps déclencherait une requête à chaque rendu ; un effet ou un outil de chargement dédié organise ce travail extérieur au rendu.' },
    ['effect', 'fetch']),

  lesson('cp2', 'react', 'React Router · URL, paramètres et navigation',
    'On veut un accueil et une page /articles/:slug. Le routeur relie un chemin d’URL à un écran ; :slug est une partie variable. Prérequis : composants React. Dans un petit projet React, installer react-router puis remplacer App.jsx par cet exemple.', [
      'BrowserRouter fournit le contexte de navigation ; Routes choisit une Route selon l’URL. Link permet de changer de chemin dans l’application.',
      'useParams lit le paramètre : /articles/debuter donne slug="debuter". Le paramètre reste une entrée à vérifier.',
      'Navigate redirige lorsque le slug est inconnu. replace remplace l’entrée courante de l’historique au lieu d’en ajouter une.',
      'Résultat attendu : le lien de l’accueil ouvre « Premier article ». Une URL inconnue revient à l’accueil. Le routage client ne remplace pas le contrôle des permissions de l’API.',
    ], `// src/App.jsx — npm install react-router
import {
  BrowserRouter, Routes, Route, Link, useParams, Navigate,
} from 'react-router';
function Article() {
  const { slug } = useParams();
  if (slug !== 'debuter') return <Navigate to="/" replace />;
  return <h1>Premier article</h1>;
}
export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={
      <Link to="/articles/debuter">Lire l’article</Link>} />
    <Route path="/articles/:slug" element={<Article />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}`,
    { prompt: 'Quelle est la valeur de slug pour /articles/debuter ? Que fait /articles/inconnu ? Cacher un lien administrateur protège-t-il l’API associée ?', answer: 'slug vaut "debuter". Pour "inconnu", Article retourne Navigate et l’accueil est affiché. Cacher le lien ne suffit pas : une personne peut envoyer une requête directement ; le serveur doit vérifier identité et permission.' },
    ['router', 'params', 'navigate']),

  lesson('cp8', 'mongodb', 'MongoDB · Documents, collections et recherches',
    'On stocke trois livres. Un document ressemble à un objet JavaScript ; une collection regroupe des documents ; une base contient des collections. Prérequis pour essayer : MongoDB de test et mongosh connecté. Le code utilise une collection dédiée books_basics.', [
      'Chaque document possède un _id unique. Des identifiants numériques sont donnés ici pour lire facilement les résultats ; MongoDB peut aussi créer des ObjectId.',
      'insertMany ajoute plusieurs documents. findOne retourne un document ou null. find produit un curseur, un résultat parcourable ; toArray le charge dans un tableau.',
      '$gte signifie supérieur ou égal. sort({ pages: 1 }) trie du plus petit au plus grand ; limit(1) conserve le premier résultat.',
      'Résultat attendu : le livre Voyager, 220 pages. Insérer une seule fois ces _id dans cette collection : leur duplication est refusée.',
    ], `// Dans mongosh connecté à une base de test
use revisions_demo
db.books_basics.insertMany([
  { _id: 1, title: 'Lire vite', pages: 120 },
  { _id: 2, title: 'Voyager', pages: 220 },
  { _id: 3, title: 'Jardiner', pages: 300 }
]);
db.books_basics.find({ pages: { $gte: 200 } })
  .sort({ pages: 1 }).limit(1).toArray();
// Un document : _id 2, title 'Voyager', pages 220
db.books_basics.findOne({ _id: 99 }); // null`,
    { prompt: 'Quels titres obtient-on avec pages >= 200 sans limit ? Que renvoie findOne pour _id 99 ?', answer: 'Voyager et Jardiner correspondent ; le tri croissant les place dans cet ordre. findOne({ _id: 99 }) renvoie null car aucun des trois documents ne possède cet identifiant.' },
    ['mongoData', 'mongoInsert', 'mongoFind', 'mongoDriver']),

  lesson('cp8', 'mongodb', 'MongoDB · Agréger et conserver des règles',
    'On veut compter les erreurs de chaque service. Une agrégation transforme des documents en un résultat calculé, par étapes. Prérequis : objets JavaScript et mongosh connecté à une base de test. Cette collection events_basics possède ses propres données.', [
      '$match sélectionne ; $group regroupe. _id: "$service" crée un groupe par valeur de service ; $sum: 1 compte chaque document du groupe.',
      'Résultat attendu : api compte deux erreurs ; mail en compte une. Le document info est exclu avant le comptage.',
      'Un schéma flexible autorise des formes différentes, mais MongoDB permet une validation en base. Le serveur contrôle également les entrées et règles métier.',
      'Imbriquer conserve une sous-information dans le document ; référencer conserve l’identifiant d’une autre donnée. $lookup rapproche des collections. Choisir selon le partage, le volume et les accès.',
    ], `// Dans mongosh, collection dédiée à cet exemple
use revisions_demo
db.events_basics.insertMany([
  { level: 'error', service: 'api' },
  { level: 'error', service: 'api' },
  { level: 'info', service: 'api' },
  { level: 'error', service: 'mail' }
]);
db.events_basics.aggregate([
  { $match: { level: 'error' } },
  { $group: { _id: '$service', count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).toArray();
// [{ _id: 'api', count: 2 }, { _id: 'mail', count: 1 }]`,
    { prompt: 'Retire $match : combien de documents compte api ? Si l’application exige pages entier positif, faut-il accepter { pages: "beaucoup" } ?', answer: 'api compte trois documents car info est aussi compté. La donnée "beaucoup" ne respecte pas la règle et doit être refusée. Flexible ne signifie pas sans validation.' },
    ['mongoMatch', 'mongoGroup', 'mongoValidation', 'mongoLookup']),

  lesson('cp6', 'mongodb', 'Logs et microservices · Observer un événement',
    'Un log conserve un événement pour comprendre une application. Un microservice est une partie déployable possédant une responsabilité précise. Ici, on écrit un événement de réservation dans la console. Prérequis : Node.js ; installer winston, créer logger.mjs puis lancer node logger.mjs.', [
      'Le niveau distingue information, avertissement et erreur ; le message explique l’événement ; les métadonnées donnent du contexte.',
      'Un transport est une destination : console, fichier ou HTTP. L’exemple choisit la console et ne requiert ni serveur de logs ni base de données.',
      'Résultat attendu : une ligne JSON avec level="info", message="Réservation acceptée", service="reservations", requestId="demo-7" et un timestamp ; l’ordre des champs peut varier.',
      'Séparer comptes et réservations permet des livraisons distinctes, mais ajoute réseau et pannes entre services. Éviter mots de passe, tokens et données personnelles inutiles dans les logs.',
    ], `// logger.mjs — npm install winston
import { createLogger, format, transports } from 'winston';
const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: 'reservations' },
  transports: [new transports.Console()],
});
logger.info('Réservation acceptée', { requestId: 'demo-7' });`,
    { prompt: 'Quelles informations gardes-tu pour retrouver un incident d’une requête ? Pourquoi ne pas ajouter son mot de passe ou son token ?', answer: 'Date, niveau, service, message, identifiant de requête et contexte technique nécessaire. requestId relie les événements. Un mot de passe ou token exposerait un secret réutilisable sans être nécessaire au diagnostic.' },
    ['winston', 'logging', 'microservices']),

  lesson('cp6', 'mongodb', 'Formidable · Analyser un fichier envoyé',
    'multipart/form-data transporte des champs et fichiers. Formidable découpe cette requête pour le serveur. Prérequis : HTTP et Node.js. L’extrait est une fonction de route appelée avec req et res après vérification des droits ; ce n’est pas un serveur complet.', [
      'Le parseur extrait la requête ; il ne décide pas si le contenu est acceptable ni si l’utilisateur est autorisé.',
      'Le nom, l’extension et le Content-Type viennent du client et ne prouvent pas le type réel du fichier. Une limite de taille ne remplace pas ce contrôle.',
      'Résultat attendu : fields et files sont disponibles après une analyse réussie ; une erreur renvoie ici 400. La conservation finale est volontairement laissée à implémenter après validation.',
      'Contrôler le contenu réel, la taille, la destination et les droits de consultation. Générer un nom côté serveur et nettoyer les fichiers temporaires refusés.',
    ], `// Fragment de route — npm install formidable
import formidable from 'formidable';
export async function receiveUpload(req, res) {
  const form = formidable({ maxFileSize: 2 * 1024 * 1024 });
  try {
    const [fields, files] = await form.parse(req);
    // Contrôler fields, le contenu réel et les fichiers temporaires.
    // Ne conserver qu'après validation ; nettoyer les refus.
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Analyse terminée ; conservation à implémenter.');
  } catch {
    res.writeHead(400);
    res.end('Envoi refusé');
  }
}`,
    { prompt: 'Un exécutable est renommé photo.jpg : peut-on l’accepter sur le seul nom ? Que garantit 2 * 1024 * 1024 ?', answer: 'Non : le contenu réel doit être contrôlé. La valeur vaut 2 097 152 octets, soit une limite de 2 Mio par fichier avec cette option. Elle ne garantit ni le type ni l’innocuité du fichier.' },
    ['formidable', 'upload']),

  lesson('cp3', 'graphql', 'GraphQL · Contrat et forme de réponse',
    'On veut demander le titre d’un livre. GraphQL décrit les données accessibles dans un schéma ; le client sélectionne les champs utiles. Prérequis : lire JSON. Cet exemple se raisonne sur papier : schéma, donnée et résultat sont fournis.', [
      'Book est un type d’objet ; id et title sont des champs ; Query est le point de départ des lectures. book(id: Int!) exige un identifiant entier non nul.',
      'String! interdit une chaîne nulle. Book sans ! autorise null si le livre est absent. [Book!]! interdit liste nulle et éléments nuls, mais autorise [].',
      'GraphQL n’est pas une base de données : le serveur doit trouver les valeurs. Demander seulement title produit seulement ce champ dans book.',
      'Résultat attendu : {"data":{"book":{"title":"Comprendre"}}}. Demander un champ absent du schéma provoque une erreur de validation.',
      'Une variable sépare la valeur du texte de requête : déclarer $id: Int!, employer book(id: $id), puis envoyer {"id":1} comme objet de variables.',
    ], `# Schéma du service
type Book { id: Int!, title: String! }
type Query { book(id: Int!): Book }

# Donnée du serveur : { id: 1, title: "Comprendre" }
# Requête du client :
query {
  book(id: 1) { title }
}
# Résultat : { "data": { "book": { "title": "Comprendre" } } }`,
    { prompt: 'Ajoute id à la sélection. Peut-on demander price, absent du schéma ? Une liste [Book!]! peut-elle être vide ?', answer: 'La réponse devient {"data":{"book":{"id":1,"title":"Comprendre"}}}. price est refusé lors de la validation. [] est permis : non nul ne signifie pas non vide.' },
    ['gqlSchema', 'gqlQueries']),

  lesson('cp3', 'graphql', 'Apollo Server · Lire et modifier avec des resolvers',
    'Un resolver est la fonction qui fournit la valeur d’un champ GraphQL. Ce petit serveur expose un livre et permet de le renommer. Prérequis pour essayer : Node.js 22+, installer @apollo/server graphql, créer server.mjs puis lancer node server.mjs. Ouvrir http://localhost:4000 et envoyer les opérations indiquées.', [
      'Query.book est une lecture ; Mutation.renameBook est une modification. Une mutation ne sauvegarde pas automatiquement : sa fonction doit écrire dans un stockage si nécessaire.',
      'parent est la valeur du champ parent ; args contient les arguments du champ courant. Ici args.title reçoit le titre envoyé.',
      'Résultat attendu : book affiche Comprendre ; la mutation retourne Avancer ; une nouvelle lecture affiche Avancer.',
      'L’objet est en mémoire. Redémarrer ramène le titre à Comprendre. Une application réelle ajoute droits, validation métier et stockage durable.',
    ], `// server.mjs — npm install @apollo/server graphql
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
const book = { id: 1, title: 'Comprendre' };
const server = new ApolloServer({
  typeDefs: [
    'type Book { id: Int!, title: String! }',
    'type Query { book: Book! }',
    'type Mutation { renameBook(title: String!): Book! }',
  ].join(' '),
  resolvers: {
    Query: { book: () => book },
    Mutation: {
      renameBook: (_parent, args) => {
        book.title = args.title;
        return book;
      },
    },
  },
});
await startStandaloneServer(server, { listen: { port: 4000 } });
// Envoyer : { book { title } }
// Puis : mutation { renameBook(title: "Avancer") { title } }`,
    { prompt: 'Pourquoi la lecture retrouve-t-elle Avancer après la mutation, mais pas après redémarrage ? Quel argument contient le nouveau titre ?', answer: 'La mutation change l’objet partagé dans ce processus ; redémarrer recrée l’objet initial. Le titre envoyé est dans args.title. Une écriture dans un stockage durable est nécessaire pour le retrouver après redémarrage.' },
    ['apollo', 'resolvers', 'gqlExecution']),

  lesson('cp8', 'graphql', 'pg · Du traitement aux lignes PostgreSQL',
    'Un resolver peut appeler un accès aux données plutôt que lire la mémoire. pg est un pilote PostgreSQL pour Node.js ; un datamapper regroupe les fonctions d’accès. Prérequis : base PostgreSQL de test accessible avec les variables PG usuelles, npm install pg, puis node lookup.mjs. Une table temporaire définit les données de cet exemple.', [
      'Le Pool gère les connexions. On emprunte un client pour garder la même connexion, puis on le rend avec release dans finally.',
      'text définit le SQL ; values fournit les valeurs ; $1 représente la première. Un nom de table ou colonne dynamique doit être choisi dans une liste autorisée.',
      'Résultat attendu : { id: 2, title: "Marcher" }. result.rows contient les lignes ; rows[0] est la première ou undefined si aucune ne correspond.',
      'N+1 : lister N livres puis chercher séparément chaque auteur peut produire N+1 accès. Mesurer et regrouper certains accès, par exemple avec DataLoader, en respectant les permissions.',
    ], `// lookup.mjs — npm install pg
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool(); // Variables PG dans l'environnement
const client = await pool.connect();
try {
  await client.query('CREATE TEMP TABLE books (id int, title text)');
  await client.query('INSERT INTO books VALUES ($1, $2), ($3, $4)',
    [1, 'Lire', 2, 'Marcher']);
  const result = await client.query({
    text: 'SELECT id, title FROM books WHERE id = $1',
    values: [2],
  });
  console.log(result.rows[0] ?? null);
} finally {
  client.release();
  await pool.end();
}`,
    { prompt: 'Remplace values: [2] par [99] : que produit console.log ? Pourquoi ne pas concaténer directement l’identifiant client au SQL ?', answer: 'Aucune ligne ne correspond ; rows[0] vaut undefined et ?? null affiche null. Le paramètre sépare la valeur du SQL ; une concaténation peut transformer une entrée hostile en structure SQL. Valider le domaine et les permissions reste nécessaire.' },
    ['pgQueries', 'pgPool', 'dataLoader']),

  lesson('cp2', 'realtime', 'Socket.IO · Un événement entre navigateur et serveur',
    'On veut envoyer une question et afficher immédiatement sa réponse. Socket.IO relie un client et un serveur avec des événements nommés. Prérequis : JavaScript et DOM. Installer socket.io, créer les deux fichiers ci-dessous dans le même dossier, lancer node server.mjs puis ouvrir http://localhost:3005.', [
      'Un socket représente une connexion. emit envoie un événement ; on inscrit la fonction appelée quand il arrive. Les noms doivent correspondre des deux côtés.',
      'Résultat attendu : le clic envoie Bonjour et l’écran affiche « Reçu : Bonjour ». textContent affiche le résultat comme du texte.',
      'Socket.IO ajoute un protocole à ses transports. Un client WebSocket brut ne parle pas automatiquement ce protocole.',
      'Le serveur vérifie ici type et longueur. Une application avec des comptes ajoute identité et permissions selon les ressources.',
    ], `// server.mjs — npm install socket.io
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { Server } from 'socket.io';
const page = await readFile(new URL('./index.html', import.meta.url));
const http = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(page);
});
const io = new Server(http);
io.on('connection', socket => {
  socket.on('question', text => {
    if (typeof text !== 'string' || text.length > 100) return;
    socket.emit('answer', 'Reçu : ' + text);
  });
});
http.listen(3005, '127.0.0.1');

<!-- index.html — fichier séparé -->
<!doctype html><html lang="fr"><meta charset="utf-8">
<button id="send">Envoyer</button><p id="output"></p>
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
  const output = document.querySelector('#output');
  document.querySelector('#send').onclick = () =>
    socket.emit('question', 'Bonjour');
  socket.on('answer', text => { output.textContent = text; });
</script></html>`,
    { prompt: 'Le navigateur émet demande au lieu de question, mais le serveur ne change pas : que se passe-t-il ? Que faut-il raccorder ?', answer: 'L’écouteur question ne reçoit pas demande, donc aucune answer n’est envoyée. Il faut une connexion active, le même nom émis/écouté et un format de contenu convenu.' },
    ['socketSetup', 'socketEmit', 'socketIntro']),

  lesson('cp6', 'realtime', 'Socket.IO · Choisir les destinataires',
    'Trois connexions A, B et C sont présentes. A envoie un message et le serveur choisit ses destinataires. Prérequis : emit et on. L’exemple se raisonne sur papier ; socket représente A dans le gestionnaire serveur.', [
      'socket.emit cible A ; socket.broadcast.emit cible B et C ; io.emit cible A, B et C dans le namespace courant.',
      'Une room est un groupe de connexions côté serveur. socket.join("atelier") ajoute la connexion ; une émission vers ce groupe ne concerne que ses membres.',
      'Résultat attendu : confirmation privée pour A, notification aux autres pour B/C, message global pour les trois.',
      'L’appartenance à une room ne prouve pas un droit métier : contrôler si la connexion est autorisée à accéder à cet atelier ou document.',
    ], `// Fragment serveur : socket = A ; B et C sont connectés.
socket.emit('confirmation', 'Accepté');       // A
socket.broadcast.emit('notice', 'A a écrit'); // B et C
io.emit('notice', 'Message global');         // A, B et C

// Si seuls A et B appartiennent à atelier :
io.to('atelier').emit('notice', 'Message du groupe'); // A et B`,
    { prompt: 'Tu veux actualiser A/B/C après une modification de A. Quelle émission ? Puis tu veux répondre à A seulement avec une erreur de validation.', answer: 'io.emit convient aux trois connexions du namespace. socket.emit répond à A seulement. socket.broadcast.emit exclut A, donc ne convient pas au premier besoin.' },
    ['socketBroadcast', 'socketRooms', 'socketMiddleware']),

  lesson('cp6', 'realtime', 'Temps réel · Nettoyage, reconnexion et cohérence',
    'Un événement rapide n’assure ni sauvegarde durable ni résolution des conflits. Prérequis : connexion et variable JavaScript. Le fragment client suppose socket déjà connecté ; la fonction d’affichage onUpdate est définie ici.', [
      'Inscrire plusieurs fois un écouteur peut doubler le traitement. off retire une inscription avec la même fonction que lors du on.',
      'La reconnexion ne garantit pas le rejeu automatique de tous les événements manqués. Prévoir récupération d’état ou une stratégie de reprise adaptée.',
      'Une nouvelle connexion a aussi besoin de l’état actuel autorisé : recevoir seulement les futures modifications ne lui donne pas les données qui existaient avant son arrivée.',
      'Résultat attendu : update appelle onUpdate tant qu’il est inscrit ; après off, il ne l’appelle plus. Un acquittement ne prouve une sauvegarde que si le serveur l’a effectivement terminée avant de répondre.',
      'Une variable en mémoire disparaît au redémarrage. Deux personnes remplaçant simultanément un texte peuvent écraser une version : définir versions, refus de conflit ou fusion.',
    ], `// Fragment client : socket existe déjà.
function onUpdate(text) { console.log('Valeur :', text); }
socket.on('update', onUpdate);
// À la destruction de l'écran :
socket.off('update', onUpdate);

socket.timeout(3000).emit('save', { text: 'Bonjour' }, (error, reply) => {
  console.log(error ? 'Aucune confirmation reçue' : reply);
});
// Nécessite un écouteur serveur save qui appelle le callback.`,
    { prompt: 'A et B lisent Salut. A envoie Salut A ; B envoie ensuite Salut B. Avec un simple remplacement, quelle valeur reste ? Que contrôler après reconnexion ?', answer: 'Dans cet ordre de traitement, Salut B reste et écrase A. Récupérer l’état autorisé actuel ou les événements manquants selon la stratégie ; la connexion revenue ne suffit pas. La sauvegarde exige aussi un stockage durable.' },
    ['socketListen', 'socketClient', 'socketDisconnect', 'socketEmit']),

  lesson('cp2', 'i18n', 'i18next · Clé stable et traduction',
    'Un bouton doit afficher Enregistrer en français et Save en anglais. L’internationalisation prépare plusieurs langues ; la localisation adapte textes et conventions. Prérequis : objets JavaScript. Installer i18next, créer translate.mjs et lancer node translate.mjs.', [
      'save est une clé stable qui désigne le message. Sa traduction change dans chaque dictionnaire ; t("save") lit celle de la langue active.',
      'resources contient ici les dictionnaires ; init configure la bibliothèque ; changeLanguage choisit une autre langue.',
      'fallbackLng est une langue de repli en cas de traduction manquante ; elle ne force pas toutes les requêtes à utiliser cette langue.',
      'Résultat attendu : Enregistrer, puis Save dans la console, avec une seule clé save.',
    ], `// translate.mjs — npm install i18next
import i18next from 'i18next';
await i18next.init({
  lng: 'fr', fallbackLng: 'en',
  resources: {
    fr: { translation: { save: 'Enregistrer' } },
    en: { translation: { save: 'Save' } },
  },
});
console.log(i18next.t('save')); // Enregistrer
await i18next.changeLanguage('en');
console.log(i18next.t('save')); // Save`,
    { prompt: 'Ajoute cancel en français et anglais. Si la valeur française manque avec fallbackLng: "en", qu’affiche-t-on ?', answer: 'Ajouter cancel: "Annuler" dans fr et cancel: "Cancel" dans en. Les affichages attendus sont Annuler et Cancel. Si fr manque, le repli fournit Cancel ; il faut encore compléter la traduction française.' },
    ['i18nStart', 'i18nApi', 'i18nKeys', 'i18nFallback']),

  lesson('cp2', 'i18n', 'Localisation · Variables, pluriels et nombres',
    'On veut saluer une personne et afficher son nombre de messages. Interpoler place une valeur dans une phrase traduite. Prérequis : clé et dictionnaire. L’exemple est complet dans messages.mjs après npm install i18next.', [
      '{{name}} réserve une place ; { name: "Lina" } fournit sa valeur. Une phrase complète permet à chaque langue de choisir l’ordre des mots.',
      'count choisit la forme plurielle. _one et _other sont utilisés ici pour l’anglais ; les catégories varient selon les langues.',
      'Résultat attendu : Hello Lina, 1 message, 2 messages, puis un nombre formaté avec une virgule décimale française.',
      'Intl.NumberFormat formate sans convertir les devises. Les séparateurs peuvent être des espaces Unicode. Préserver une protection adaptée au contexte HTML si la valeur est affichée en HTML.',
    ], `// messages.mjs
import i18next from 'i18next';
await i18next.init({
  lng: 'en',
  resources: { en: { translation: {
    hello: 'Hello {{name}}',
    messages_one: '{{count}} message',
    messages_other: '{{count}} messages',
  } } },
});
console.log(i18next.t('hello', { name: 'Lina' }));
console.log(i18next.t('messages', { count: 1 }));
console.log(i18next.t('messages', { count: 2 }));
console.log(new Intl.NumberFormat('fr-FR').format(1234.5));`,
    { prompt: 'Quelle option choisit le pluriel ? Pourquoi éviter "Hello " + name ? Formater un montant USD en EUR le convertit-il ?', answer: 'Transmettre count. Une phrase traduite avec {{name}} laisse choisir l’ordre des mots dans chaque langue. Intl ne connaît pas le taux de change : il formate la valeur, sans convertir USD en EUR.' },
    ['i18nInterpolation', 'i18nPlural', 'intl']),

  lesson('cp2', 'i18n', 'i18next et Express · Langue de la requête',
    'On veut /?lng=fr en français et /?lng=en en anglais. Le middleware associe une traduction à chaque requête ; fs-backend lit les fichiers. Prérequis : Node, Express et HTTP. Installer express i18next i18next-http-middleware i18next-fs-backend, puis créer les trois fichiers ci-dessous.', [
      'LanguageDetector lit ici lng, puis l’en-tête de langue. supportedLngs limite à fr et en.',
      'middleware.handle précède la route pour rendre req.t disponible. loadPath choisit le fichier correspondant à {{lng}}.',
      'Résultat attendu après node server.mjs : sur http://localhost:3007, /?lng=fr retourne Bienvenue et /?lng=en retourne Welcome.',
      'Vérifier aussi fichiers et clés absents, pluriels et textes longs. La langue de repli ne remplace pas les traductions à compléter.',
    ], `// server.mjs
import express from 'express';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
await i18next.use(Backend).use(middleware.LanguageDetector).init({
  supportedLngs: ['fr', 'en'], fallbackLng: 'en',
  detection: { order: ['querystring', 'header'], lookupQuerystring: 'lng' },
  backend: { loadPath: path.join(root, 'locales/{{lng}}/translation.json') },
});
const app = express();
app.use(middleware.handle(i18next));
app.get('/', (req, res) => res.type('text').send(req.t('welcome')));
app.listen(3007, '127.0.0.1');

// locales/fr/translation.json : { "welcome": "Bienvenue" }
// locales/en/translation.json : { "welcome": "Welcome" }`,
    { prompt: 'Quel module charge les fichiers ? Quel module ajoute req.t ? Pourquoi placer la route avant middleware.handle échouerait-il ?', answer: 'i18next-fs-backend charge les fichiers. i18next-http-middleware prépare la traduction de requête et ajoute req.t. Une route exécutée avant lui ne possède pas encore req.t, donc cet appel ne peut pas fonctionner.' },
    ['i18nFiles', 'i18nHttp', 'i18nFallback']),
];

const card = (id, cp, technology, question, answer, detail, tags, sourceKeys, lessonIndex) => ({
  id, cp, technology, question, answer, detail, tags, sources: sources(...sourceKeys), lessonIndex,
});

export const courseCards = [
  card('course-react-01', 'cp2', 'react', 'React : quelle différence entre props et state ?', 'Une prop est une entrée transmise par un parent ; le state est une valeur conservée par React pour un composant.', 'Un compteur reçoit title="Places" comme prop et conserve count=0 comme état. Son setter demande une autre valeur et un nouvel affichage.', ['React', 'props', 'state'], ['props', 'state'], 0),
  card('course-react-02', 'cp2', 'react', 'Comment rendre un input contrôlé en React ?', 'Relier value à un état et onChange à sa mise à jour.', 'Avec const [name, setName] = useState(\'\'), utiliser value={name} et onChange={e => setName(e.target.value)}. La saisie Lina devient la valeur de name.', ['React', 'formulaires'], ['input'], 1),
  card('course-react-03', 'cp2', 'react', 'Deux composants affichent le même filtre : où placer l’état ?', 'Dans leur ancêtre commun, puis transmettre la valeur et la fonction de modification.', 'Un parent possède search ; le champ reçoit search et setSearch, la liste reçoit search. Les deux composants partagent une seule valeur cohérente.', ['React', 'architecture'], ['shared'], 1),
  card('course-react-04', 'cp2', 'react', 'Pourquoi éviter items.push(...) directement sur un tableau d’état React ?', 'push modifie le tableau existant ; il faut fournir une nouvelle valeur pour exprimer la mise à jour.', 'setItems(previous => [...previous, item]) crée un autre tableau avec les éléments précédents puis item.', ['React', 'immutabilité'], ['arrays'], 1),
  card('course-react-05', 'cp2', 'react', 'À quoi sert useEffect pour charger des données depuis une API ?', 'À synchroniser le composant avec un système extérieur après le rendu.', 'L’effet peut lancer fetch puis mettre à jour données, attente ou erreur. Ses dépendances sont les valeurs réactives utilisées ; son nettoyage évite des opérations inutiles.', ['React', 'useEffect', 'API'], ['effect'], 2),
  card('course-react-06', 'cp2', 'react', 'Quels états prévoir lorsqu’on charge une liste avec fetch ?', 'Chargement, données disponibles, résultat vide et erreur.', 'Une réponse 404 ne fait pas automatiquement rejeter fetch : vérifier response.ok. [] est un succès vide, à distinguer d’une panne.', ['React', 'fetch', 'erreurs'], ['fetch'], 2),
  card('course-react-07', 'cp2', 'react', 'Une Route est /articles/:slug et l’URL /articles/debuter : comment lire debuter ?', 'Avec useParams dans le contexte du routeur ; slug vaut "debuter".', 'const { slug } = useParams() lit le segment correspondant à :slug. Vérifier ensuite si ce slug désigne une ressource connue.', ['React', 'React Router'], ['params'], 3),
  card('course-react-08', 'cp2', 'react', 'Que fait <Navigate to="/" replace /> ?', 'Il redirige vers / en remplaçant l’entrée courante de l’historique.', 'On peut le retourner pour un slug inconnu. replace évite d’ajouter cette redirection comme une entrée supplémentaire.', ['React', 'navigation'], ['navigate'], 3),
  card('course-react-09', 'cp2', 'react', 'Qu’est-ce qu’un composant React et que décrit JSX ?', 'Un composant est une fonction qui décrit une partie d’interface ; JSX exprime cette description dans JavaScript.', 'function Greeting() { return <h1>Bonjour</h1>; } décrit un titre. React transforme cette description en interface affichée.', ['React', 'bases', 'JSX'], ['reactStart', 'props'], 0),
  card('course-react-10', 'cp2', 'react', 'Le compteur vaut 0. On appelle deux fois setCount(previous => previous + 1) : quelle valeur attend-on ?', '2 : chaque updater reçoit le résultat de la mise à jour précédente.', 'Les updaters sont appliqués dans l’ordre : 0 → 1 → 2. Ils conviennent quand la nouvelle valeur dépend de la précédente.', ['React', 'useState'], ['state'], 0),

  card('course-mongodb-01', 'cp8', 'mongodb', 'MongoDB : qu’est-ce qu’une collection et un document ?', 'Un document regroupe des champs ; une collection regroupe des documents.', 'Dans books, { title: "Lire", pages: 120 } est un document. Une base peut contenir books et d’autres collections.', ['MongoDB', 'NoSQL'], ['mongoData'], 0),
  card('course-mongodb-02', 'cp8', 'mongodb', 'Un schéma MongoDB flexible dispense-t-il de valider les données ?', 'Non : l’application peut imposer des types, domaines et règles, et MongoDB propose une validation de schéma.', 'Si pages doit être entier positif, { pages: "beaucoup" } ne respecte pas la règle. Flexible ne veut pas dire sans contraintes.', ['MongoDB', 'validation'], ['mongoValidation'], 1),
  card('course-mongodb-03', 'cp8', 'mongodb', 'Quelle différence entre findOne et find(...).toArray() ?', 'findOne cherche un document ou renvoie null ; find produit un curseur et toArray charge ses résultats dans un tableau.', 'Ajouter filtre, tri et limite avant toArray. Un curseur représente un résultat parcourable, pas directement une liste JavaScript.', ['MongoDB', 'requêtes'], ['mongoDriver', 'mongoFind'], 0),
  card('course-mongodb-04', 'cp8', 'mongodb', 'À quoi servent $match puis $group dans une agrégation ?', '$match garde les documents correspondants ; $group forme des groupes et calcule leurs agrégats.', 'Filtrer level="error", puis grouper par service avec count: { $sum: 1 }, compte les erreurs de chaque service.', ['MongoDB', 'agrégation'], ['mongoMatch', 'mongoGroup'], 1),
  card('course-mongodb-05', 'cp8', 'mongodb', 'MongoDB interdit-il tout rapprochement entre collections ?', 'Non : $lookup permet notamment de joindre des données d’une autre collection.', 'Imbriquer garde des informations ensemble ; référencer garde un lien vers une autre donnée. Choisir selon les accès et le partage.', ['MongoDB', 'modélisation', '$lookup'], ['mongoLookup'], 1),
  card('course-mongodb-06', 'cp6', 'mongodb', 'Dans Winston, qu’est-ce qu’un transport ?', 'Une destination des logs, par exemple la console, un fichier ou un service HTTP.', 'Le logger produit niveau, message et contexte ; le transport décide où envoyer l’événement. Une console n’exige aucune base de logs.', ['Winston', 'logs'], ['winston'], 2),
  card('course-mongodb-07', 'cp6', 'mongodb', 'Quel coût ajoute une architecture en microservices ?', 'Elle ajoute des appels réseau, des contrats, des configurations et des défaillances entre services.', 'Comptes et réservations peuvent être livrés séparément, mais doivent gérer leurs échanges et l’indisponibilité de l’autre.', ['microservices', 'architecture'], ['microservices'], 2),
  card('course-mongodb-08', 'cp6', 'mongodb', 'Formidable garantit-il qu’un fichier envoyé est sûr ?', 'Non : il parse multipart/form-data ; l’application doit contrôler contenu et permissions.', 'Un exécutable renommé photo.jpg reste un exécutable. Vérifier type réel, taille, destination et droits ; nettoyer les fichiers temporaires refusés.', ['Formidable', 'upload', 'sécurité'], ['formidable', 'upload'], 3),
  card('course-mongodb-09', 'cp8', 'mongodb', 'Des livres ont 120, 220 et 300 pages. Que sélectionne { pages: { $gte: 200 } } ?', 'Les livres de 220 et 300 pages.', '$gte signifie supérieur ou égal. Le tri pages: 1 donne 220 puis 300 ; limit(1) ne garde alors que 220.', ['MongoDB', 'filtres'], ['mongoFind'], 0),
  card('course-mongodb-10', 'cp6', 'mongodb', 'Que garder dans un log pour suivre une requête sans publier ses secrets ?', 'Date, niveau, message, service et identifiant de requête, avec le contexte technique nécessaire.', 'requestId relie des événements. Un token ou mot de passe ne sert pas à les relier et pourrait être exploité s’il est exposé.', ['logs', 'diagnostic'], ['logging'], 2),

  card('course-graphql-01', 'cp3', 'graphql', 'Que définit un schéma GraphQL ?', 'Les types, champs, arguments et opérations disponibles pour le client.', 'type Book { title: String! } permet de demander title ; price, absent du schéma, est refusé à la validation.', ['GraphQL', 'contrat'], ['gqlSchema'], 0),
  card('course-graphql-02', 'cp3', 'graphql', 'Quelle différence entre Query et Mutation ?', 'Query expose les lectures ; Mutation expose les opérations destinées à modifier les données.', 'book { title } lit ; renameBook(title:"Avancer") demande une modification. Le traitement vérifie aussi règles et autorisations.', ['GraphQL', 'Query', 'Mutation'], ['gqlQueries'], 1),
  card('course-graphql-03', 'cp3', 'graphql', 'Que représentent parent et args dans un resolver ?', 'parent est le résultat du champ parent ; args contient les arguments du champ courant.', 'Pour book(id: 2), args.id vaut 2. Pour résoudre author dans un livre retourné, parent représente ce livre.', ['GraphQL', 'resolver'], ['resolvers', 'gqlExecution'], 1),
  card('course-graphql-04', 'cp3', 'graphql', 'Que signifie [Book!]! et une liste vide est-elle autorisée ?', 'La liste ne peut pas être nulle et ses éléments ne peuvent pas être nuls ; [] reste autorisé.', 'String! interdit null pour une chaîne, mais ne vérifie pas sa longueur ni toutes les règles métier.', ['GraphQL', 'types', 'null'], ['gqlSchema'], 0),
  card('course-graphql-05', 'cp3', 'graphql', 'Une mutation GraphQL garantit-elle à elle seule une persistance en base ?', 'Non : la persistance dépend du traitement exécuté par son resolver.', 'Modifier un objet en mémoire change les lectures du processus, mais un redémarrage perd la modification. Écrire durablement exige un stockage et un traitement associés.', ['GraphQL', 'persistance'], ['resolvers', 'gqlExecution'], 1),
  card('course-graphql-06', 'cp8', 'graphql', 'Avec pg, comment transmettre l’id d’un livre sans le concaténer au SQL ?', 'Employer WHERE id = $1 et fournir l’id dans values: [id].', 'text contient le SQL ; values contient les valeurs. Un paramètre ne remplace pas un nom de table ou de colonne.', ['pg', 'SQL', 'paramètres'], ['pgQueries'], 2),
  card('course-graphql-07', 'cp8', 'graphql', 'À quoi servent un datamapper et result.rows avec pg ?', 'Un datamapper centralise les accès aux données ; result.rows contient les lignes retournées.', 'Une fonction findBook(id) peut renvoyer rows[0] ?? null. Le resolver décide comment présenter cette valeur au client.', ['pg', 'datamapper', 'architecture'], ['pgQueries'], 2),
  card('course-graphql-08', 'cp8', 'graphql', 'Qu’appelle-t-on N+1 avec des champs GraphQL imbriqués ?', 'Une requête initiale est suivie d’un accès supplémentaire pour chacun des N éléments.', 'Charger 10 livres puis chercher leurs auteurs séparément peut faire 11 accès. Mesurer et regrouper certains accès en respectant les permissions.', ['GraphQL', 'performances', 'N+1'], ['dataLoader'], 2),
  card('course-graphql-09', 'cp3', 'graphql', 'Si le client demande book { title }, reçoit-il tous les champs du livre ?', 'Non : la forme de la réponse suit les champs sélectionnés.', 'Pour { id: 1, title: "Lire" }, la réponse peut être { data: { book: { title: "Lire" } } }. GraphQL ne remplace pas le stockage.', ['GraphQL', 'bases', 'réponse'], ['gqlQueries'], 0),
  card('course-graphql-10', 'cp3', 'graphql', 'Que fait $id dans query Book($id: Int!) { book(id: $id) { title } } ?', 'Il permet de transmettre l’id séparément du texte de l’opération.', 'Les variables { "id": 2 } font chercher le livre 2. Int! exige ici un entier non nul.', ['GraphQL', 'variables'], ['gqlQueries'], 0),

  card('course-realtime-01', 'cp2', 'realtime', 'Que font socket.emit et socket.on ?', 'emit envoie un événement ; on inscrit la fonction appelée à sa réception.', 'socket.emit("question", "Bonjour") correspond à socket.on("question", text => ...). Les noms et le format doivent être convenus.', ['Socket.IO', 'événements'], ['socketEmit', 'socketListen'], 0),
  card('course-realtime-02', 'cp6', 'realtime', 'Sur le serveur, quelle différence entre socket.emit, socket.broadcast.emit et io.emit ?', 'Ils ciblent la connexion courante, les autres, puis toutes celles du namespace concerné.', 'Avec A/B/C et socket=A, les destinataires sont respectivement A, B/C et A/B/C.', ['Socket.IO', 'broadcast'], ['socketBroadcast'], 1),
  card('course-realtime-03', 'cp6', 'realtime', 'Pourquoi envoyer l’état actuel à une nouvelle connexion ?', 'Pour qu’elle commence avec les données déjà connues du serveur.', 'Si le document vaut Bonjour avant sa connexion, écouter seulement les futures modifications ne lui donne pas cet état initial.', ['Socket.IO', 'synchronisation'], ['socketDisconnect'], 2),
  card('course-realtime-04', 'cp6', 'realtime', 'Un texte conservé seulement dans une variable serveur survit-il au redémarrage ?', 'Non : la mémoire du processus est perdue au redémarrage.', 'Un envoi reçu par les clients n’est pas une sauvegarde durable. Écrire dans un stockage et prévoir la récupération d’état.', ['Socket.IO', 'persistance'], ['socketDisconnect'], 2),
  card('course-realtime-05', 'cp6', 'realtime', 'Un client WebSocket brut parle-t-il directement à un serveur Socket.IO ?', 'Non : Socket.IO ajoute son protocole d’événements et exige un client compatible.', 'WebSocket est un transport possible ; Socket.IO peut aussi utiliser HTTP long-polling. Ce sont deux notions différentes.', ['Socket.IO', 'WebSocket', 'protocole'], ['socketIntro'], 0),
  card('course-realtime-06', 'cp2', 'realtime', 'Pourquoi retirer un écouteur quand son écran disparaît ?', 'Pour éviter des réactions inutiles ou doublées et des mises à jour d’un écran supprimé.', 'Après socket.on("update", onUpdate), retirer socket.off("update", onUpdate) avec la même fonction.', ['Socket.IO', 'cycle de vie'], ['socketListen'], 2),
  card('course-realtime-07', 'cp6', 'realtime', 'Deux personnes remplacent un texte en même temps : une diffusion simple fusionne-t-elle leurs versions ?', 'Non : la dernière écriture peut écraser l’autre ; diffuser ne résout pas le conflit.', 'Après Salut A puis Salut B, un remplacement garde Salut B. Définir versions, refus de conflit ou fusion selon le besoin.', ['Socket.IO', 'concurrence'], ['socketEmit'], 2),
  card('course-realtime-08', 'cp2', 'realtime', 'Un message reçu par socket exige-t-il moins de validation qu’une requête HTTP ?', 'Non : contrôler contenu, taille, identité et permission selon l’action et la ressource.', 'Une connexion authentifiée n’a pas forcément le droit de modifier tous les documents. Le serveur valide aussi la donnée reçue.', ['Socket.IO', 'validation', 'sécurité'], ['socketMiddleware', 'socketListen'], 0),
  card('course-realtime-09', 'cp6', 'realtime', 'Qu’est-ce qu’une room Socket.IO ?', 'Un groupe de connexions côté serveur qui permet de cibler une diffusion.', 'Si A et B ont rejoint atelier, io.to("atelier").emit(...) cible ce groupe. Vérifier d’abord leur droit de le rejoindre.', ['Socket.IO', 'rooms'], ['socketRooms'], 1),
  card('course-realtime-10', 'cp6', 'realtime', 'Que prouve un acquittement reçu après un événement ?', 'Que le destinataire a appelé la réponse convenue ; son sens dépend du traitement effectué.', 'Un callback « reçu » ne prouve pas une écriture en base. Confirmer « sauvegardé » exige d’achever cette écriture avant la réponse.', ['Socket.IO', 'acquittement'], ['socketEmit'], 2),

  card('course-i18n-01', 'cp2', 'i18n', 'Quelle différence entre internationalisation et localisation ?', 'L’internationalisation prépare plusieurs langues ; la localisation adapte textes et conventions à une langue ou région.', 'Extraire le bouton sous la clé save prépare sa traduction ; lui donner Enregistrer en français réalise une adaptation.', ['i18n', 'localisation'], ['i18nStart', 'intl'], 0),
  card('course-i18n-02', 'cp2', 'i18n', 'Pourquoi conserver la clé save dans les dictionnaires français et anglais ?', 'Pour désigner le même message logique indépendamment de sa traduction.', 't("save") donne Enregistrer en français et Save en anglais. La clé est stable ; sa valeur dépend de la langue.', ['i18next', 'clés'], ['i18nKeys'], 0),
  card('course-i18n-03', 'cp2', 'i18n', 'Quel rôle remplit i18next-fs-backend ?', 'Il charge les dictionnaires depuis des fichiers du système.', 'loadPath: "locales/{{lng}}/translation.json" désigne le fichier de la langue résolue. Le module ne détecte pas la langue.', ['i18next', 'configuration'], ['i18nFiles'], 2),
  card('course-i18n-04', 'cp2', 'i18n', 'Comment une route Express obtient-elle req.t ?', 'En passant d’abord par le middleware HTTP i18next installé avec middleware.handle(i18next).', 'app.use(middleware.handle(i18next)) doit précéder la route. Celle-ci appelle ensuite req.t("welcome") pour la langue de la requête.', ['i18next', 'Express', 'middleware'], ['i18nHttp'], 2),
  card('course-i18n-05', 'cp2', 'i18n', 'Que signifie fallbackLng: "en" ?', 'L’anglais sert de langue de repli si la traduction manque dans la langue recherchée.', 'Une valeur française présente reste française ; une valeur manquante peut être cherchée en anglais. Ce réglage ne force pas tout en anglais.', ['i18next', 'fallback'], ['i18nFallback'], 0),
  card('course-i18n-06', 'cp2', 'i18n', 'Pourquoi interpoler name plutôt que concaténer des morceaux de phrase ?', 'Pour laisser chaque traduction placer les mots et la variable dans l’ordre adapté.', 't("hello", { name: "Lina" }) remplace {{name}} dans une phrase complète. Conserver une protection adaptée au contexte d’affichage.', ['i18next', 'interpolation'], ['i18nInterpolation'], 1),
  card('course-i18n-07', 'cp2', 'i18n', 'Comment i18next choisit-il une forme plurielle ?', 'Transmettre count et fournir les formes prévues pour la langue.', 'En anglais, messages_one: "{{count}} message" et messages_other: "{{count}} messages" donnent 1 message et 2 messages.', ['i18next', 'pluriels'], ['i18nPlural'], 1),
  card('course-i18n-08', 'cp2', 'i18n', 'Traduire les textes suffit-il à localiser un prix ou une date ?', 'Non : choisir aussi les conventions de format, de région, et si nécessaire de fuseau ou devise.', 'Intl.NumberFormat formate avec une locale. Choisir EUR affiche une devise, sans convertir automatiquement un montant d’une autre devise.', ['i18n', 'Intl', 'formatage'], ['intl'], 1),
  card('course-i18n-09', 'cp2', 'i18n', 'Avec LanguageDetector et lookupQuerystring: "lng", que teste /?lng=fr ?', 'La sélection du français via le paramètre de requête, si fr est supporté.', 'Le détecteur suit l’ordre configuré. Sans paramètre, un autre signal comme l’en-tête peut être utilisé avant le repli.', ['i18next', 'langue', 'HTTP'], ['i18nHttp'], 2),
  card('course-i18n-10', 'cp2', 'i18n', 'Quels cas vérifier après l’ajout de traductions ?', 'Langues prévues, clé manquante, zéro/un/plusieurs, variables et textes plus longs.', 'Un texte correct peut déborder d’un bouton. Le repli aide face aux manques, mais ne remplace pas la vérification des dictionnaires et de l’affichage.', ['i18n', 'vérification'], ['i18nFallback', 'i18nPlural', 'i18nInterpolation'], 2),
];
export const courseSources = Object.values(docs);
