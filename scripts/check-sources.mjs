import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { examSources } from '../data/exam.js';
import { courseSources } from '../data/courses.js';
import { documentRoutes } from '../lib/documents.js';

const siteRoot = fileURLToPath(new URL('../', import.meta.url));
const workspace = path.resolve(process.env.CDA_WORKSPACE || path.dirname(siteRoot));
const sources = new Set([...examSources, ...courseSources].filter(source => source.path).map(source => source.path));
const failures = [];

for (const relative of sources) {
  try {
    const entry = await stat(path.join(workspace, relative));
    if (!entry.isFile() || entry.size === 0) throw new Error('fichier vide ou invalide');
  } catch {
    failures.push(relative);
  }
}

for (const [route, relative] of Object.entries(documentRoutes)) {
  try {
    const bytes = await readFile(path.join(workspace, relative));
    if (bytes.length <= 100) throw new Error('document vide');
    if (route.endsWith('.pdf') ? bytes.subarray(0, 5).toString() !== '%PDF-' : bytes.includes(0)) {
      throw new Error('format invalide');
    }
  } catch {
    if (!failures.includes(relative)) failures.push(relative);
  }
}

if (failures.length) {
  console.error('Sources locales absentes ou invalides :\n' + failures.map(relative => `- ${relative}`).join('\n'));
  console.error('Configurer CDA_WORKSPACE vers le dossier contenant les cours et dossiers personnels.');
  process.exitCode = 1;
} else {
  console.log(`${sources.size} sources locales et ${Object.keys(documentRoutes).length} documents vérifiés.`);
}
