import { courseSections as foundations, courseCards as foundationCards, courseSources as foundationSources } from './course-foundations.js';
import { courseSections as stack, courseCards as stackCards, courseSources as stackSources } from './course-stack.js';
import { courseSections as extensions, courseCards as extensionCards, courseSources as extensionSources } from './course-extensions.js';

export const technologyTopics = [
  { id: 'merise', label: 'Merise', tools: 'Dictionnaire · MCD · MLD · MPD', summary: 'Partir du besoin utilisateur, écrire les règles de gestion, poser les cardinalités et passer du modèle aux tables.', studyHint: 'Pars d’un besoin « En tant que… », précise les règles de gestion, puis explique les entités et les cardinalités du MCD.', symbol: 'book', color: 'olive' },
  { id: 'typescript', label: 'TypeScript', tools: 'tsc · tsx · types · interfaces', summary: 'Lire et écrire du code typé : inférence, unions, narrowing, génériques et configuration.', symbol: 'pen', color: 'lavender' },
  { id: 'sql', label: 'SQL & PostgreSQL', tools: 'Requêtes · jointures · transactions', summary: 'Travailler directement les requêtes, les agrégations, les valeurs NULL et la cohérence des données.', symbol: 'source', color: 'olive' },
  { id: 'docker', label: 'Docker', tools: 'Dockerfile · Compose · Nginx', summary: 'Construire une image, relier les services, conserver les données et diagnostiquer un démarrage.', symbol: 'cards', color: 'peach' },
  { id: 'tests', label: 'Tests JavaScript', tools: 'node:test · node:assert · Vitest', summary: 'Écrire des assertions utiles, tester l’asynchrone et distinguer unité, HTTP et base de test.', symbol: 'check', color: 'olive' },
  { id: 'backend', label: 'Backend & API', tools: 'Node · Express · Prisma · Zod', summary: 'Suivre une requête, organiser les middleware, valider les entrées et contrôler les accès.', symbol: 'source', color: 'lavender' },
  { id: 'react', label: 'React & Router', tools: 'Composants · hooks · formulaires', summary: 'Réviser les données, les effets, les champs contrôlés et la navigation des exercices React.', symbol: 'cards', color: 'lavender' },
  { id: 'mongodb', label: 'MongoDB & services', tools: 'MongoDB · Winston · Formidable', summary: 'Revoir les documents, les logs, les microservices et les envois de fichiers étudiés avec OQuiz.', symbol: 'source', color: 'peach' },
  { id: 'graphql', label: 'GraphQL', tools: 'Apollo Server · pg · O’Resto', summary: 'Lire un schéma, distinguer requête et mutation, expliquer les resolvers et l’accès aux données.', symbol: 'book', color: 'olive' },
  { id: 'realtime', label: 'Temps réel', tools: 'Socket.IO · événements · rooms', summary: 'Comprendre les échanges du serveur et des clients dans l’atelier CollabScript.', symbol: 'chat', color: 'peach' },
  { id: 'i18n', label: 'Internationalisation', tools: 'i18next · locales · traductions', summary: 'Revoir les clés de traduction, la langue de repli, l’interpolation et les formats locaux.', symbol: 'book', color: 'lavender' },
];

export const courseSections = [...foundations, ...stack, ...extensions];
export const courseCards = [...foundationCards, ...stackCards, ...extensionCards];
export const courseSources = [...new Map([...foundationSources, ...stackSources, ...extensionSources].map(source => [source.path || source.url, source])).values()];
