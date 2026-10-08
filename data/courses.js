import { courseSections as foundations, courseCards as foundationCards, courseSources as foundationSources } from './course-foundations.js';
import { courseSections as stack, courseCards as stackCards, courseSources as stackSources } from './course-stack.js';
import { courseSections as extensions, courseCards as extensionCards, courseSources as extensionSources } from './course-extensions.js';

export const technologyTopics = [
  { id: 'merise', label: 'Merise', tools: 'Cardinalités · associations · MCD · MLD · normalisation', summary: 'Comprendre les cardinalités, les associations binaires et ternaires, le MCD, le MLD et les formes normales à partir de cas entièrement expliqués.', studyHint: 'Commence par distinguer besoin, use case UML et modèle Merise. Avance ensuite dans les fiches : vocabulaire, cardinalités, associations, passage aux tables et normalisation.', symbol: 'book', color: 'olive' },
  { id: 'typescript', label: 'TypeScript', tools: 'tsc · tsx · types · interfaces', summary: 'Lire et écrire du code typé : inférence, unions, narrowing, génériques et configuration.', symbol: 'pen', color: 'lavender' },
  { id: 'sql', label: 'SQL & PostgreSQL', tools: 'Requêtes · jointures · transactions', summary: 'Travailler directement les requêtes, les agrégations, les valeurs NULL et la cohérence des données.', symbol: 'source', color: 'olive' },
  { id: 'docker', label: 'Docker', tools: 'Dockerfile · Compose · Nginx', summary: 'Construire une image, relier les services, conserver les données et diagnostiquer un démarrage.', symbol: 'cards', color: 'peach' },
  { id: 'tests', label: 'Tests JavaScript', tools: 'node:test · node:assert · Vitest', summary: 'Écrire des assertions utiles, tester l’asynchrone et distinguer unité, HTTP et base de test.', symbol: 'check', color: 'olive' },
  { id: 'backend', label: 'Backend & API', tools: 'Node · Express · Prisma · Zod', summary: 'Suivre une requête, organiser les middleware, valider les entrées et contrôler les accès.', symbol: 'source', color: 'lavender' },
  { id: 'react', label: 'React & Router', tools: 'Composants · hooks · formulaires', summary: 'Réviser les données, les effets, les champs contrôlés et la navigation à partir de petits composants expliqués.', symbol: 'cards', color: 'lavender' },
  { id: 'mongodb', label: 'MongoDB & services', tools: 'Documents · schéma · index · transactions', summary: 'Comprendre les documents, les opérations CRUD et le choix entre données imbriquées et références.', symbol: 'source', color: 'peach' },
  { id: 'graphql', label: 'GraphQL', tools: 'Schéma · queries · mutations · resolvers', summary: 'Lire un schéma, distinguer requête et mutation, expliquer les resolvers et l’accès aux données.', symbol: 'book', color: 'olive' },
  { id: 'realtime', label: 'Temps réel', tools: 'Socket.IO · événements · rooms', summary: 'Comprendre les échanges client/serveur, la diffusion des événements et les rooms avec un cas de discussion expliqué.', symbol: 'chat', color: 'peach' },
  { id: 'i18n', label: 'Internationalisation', tools: 'i18next · locales · traductions', summary: 'Revoir les clés de traduction, la langue de repli, l’interpolation et les formats locaux.', symbol: 'book', color: 'lavender' },
];

export const courseSections = [...foundations, ...stack, ...extensions];
export const courseCards = [...foundationCards, ...stackCards, ...extensionCards];
// Liens explicites des cartes de la pile vers la leçon correspondante.
const stackLessonIndices = {
  docker: [0,0,0,0,1,1,1,1,2,3,3,2],
  tests: [0,0,0,0,0,1,1,1,1,1,2,2,2,0,3,3],
  backend: [0,0,1,1,2,2,0,3,3,3,4,4,4,5,5,5],
};
for (const card of stackCards) card.lessonIndex = stackLessonIndices[card.technology][Number(card.id.split('-').at(-1)) - 1];

export const courseSources = [...new Map([...foundationSources, ...stackSources, ...extensionSources].map(source => [source.url, source])).values()];
