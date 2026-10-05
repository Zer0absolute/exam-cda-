import { technologyTopics, courseSections, courseCards } from '../data/courses.js';

export function renderCourseExamples(section, h) {
  if (!section.examples?.length) return '';
  return `<div class="course-examples">${section.examples.map(example => `<article class="course-example"><div class="eyebrow">EXEMPLE · USER STORY</div><h3>${h(example.role)}</h3><p>${/^[aeiouy]/i.test(example.role) ? 'En tant qu’' : 'En tant que '}<strong>${h(example.role)}</strong>, je souhaite <strong>${h(example.need)}</strong>, afin de <strong>${h(example.goal)}</strong>.</p>${example.criteria?.length ? `<h4>Critères d’acceptation proposés</h4><ul>${example.criteria.map(item => `<li>${h(item)}</li>`).join('')}</ul>` : ''}</article>`).join('')}</div>`;
}

export function renderCourseExercise(section, h) {
  if (!section.exercise) return '';
  return `<div class="course-exercise"><div class="eyebrow">À TOI DE JOUER</div><p>${h(section.exercise.prompt)}</p><details><summary>Voir une correction possible</summary><p class="course-correction">${h(section.exercise.answer)}</p></details></div>`;
}


export function renderCourses({ selectedTechnology, h, icon, pageHead, button, badge, cpLabel, state, localDay, query }) {
  const topic = technologyTopics.find(item => item.id === selectedTechnology);
  if (!topic) {
    const visible = technologyTopics.filter(item => {
      const sections = courseSections.filter(section => section.technology === item.id);
      const searchable = [item.label, item.tools, item.summary, ...sections.flatMap(({ section }) => [section.title, section.body, ...(section.bullets || []), ...(section.examples || []).flatMap(example => [example.role, example.need, example.goal, ...(example.criteria || [])]), section.exercise?.prompt, section.exercise?.answer])].join(' ');
      return searchable.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr'));
    });
    return `${pageHead('LES OUTILS DE TA FORMATION', 'Tes cours. <span class="serif">Tes technos.</span>', 'Des fiches et du rappel actif tirés de tes cours et exercices O’clock, en complément du référentiel.')}<div class="course-intro"><span class="eyebrow">DE LA NOTION AU CODE</span><p>Choisis un sujet, lis les exemples puis explique-les sans regarder. Les cartes dédiées te permettent de travailler une technologie à la fois.</p><p class="small muted">Pour ton rituel, alterne modélisation, code, tests et déploiement. Ajoute un exemple de tes projets à chaque fiche.</p></div><label class="search course-search">${icon('search', 18)}<input id="search" type="search" value="${h(query)}" placeholder="Chercher : Merise, middleware, Vitest…" aria-label="Chercher une technologie"></label><div class="course-grid">${visible.map(item => {
      const sections = courseSections.filter(section => section.technology === item.id);
      const cards = courseCards.filter(card => card.technology === item.id);
      const cps = [...new Set(sections.map(section => section.cp))];
      return `<button class="course-card ${item.color}" data-action="course-open" data-id="${item.id}"><div class="course-card-top"><span class="icon-box">${icon(item.symbol, 21)}</span><span class="mono">${cards.length} CARTES</span></div><h2>${h(item.label)}</h2><span class="course-tools">${h(item.tools)}</span><p>${h(item.summary)}</p><div class="course-card-footer"><span>${sections.length} fiches pratiques · ${cps.map(cp => cp.toUpperCase().replace('CP', 'CP ')).join(' / ')}</span>${icon('arrow', 17)}</div></button>`;
    }).join('')}</div>${visible.length ? '' : '<div class="empty-state">Aucun sujet avec ce mot. Essaie le nom d’une technologie.</div>'}<p class="source-note">Les fiches conservent les différences entre tes exercices : Prisma dans OQuiz, Sequelize dans Oddit, et Drizzle/Hono dans GamerChallenge.</p>`;
  }
  const sections = courseSections.filter(item => item.technology === topic.id);
  const cards = courseCards.filter(card => card.technology === topic.id);
  const cpIds = [...new Set(sections.map(item => item.cp))];
  const noteId = `course:${topic.id}`;
  const readToday = state.notes[`course-day:${topic.id}`] === localDay();
  return `${button(`${icon('back', 16)} Toutes les technos`, 'course-back', 'text-button')}${pageHead('FICHE DE COURS · EXEMPLES ET RAPPEL ACTIF', h(topic.label), h(topic.tools), button(`${icon('download', 16)} Imprimer cette fiche`, 'course-print', 'secondary'))}<div class="sheet-layout"><article class="sheet-content course-detail"><div class="course-summary"><p>${h(topic.summary)}</p><span class="small muted">${h(topic.studyHint || 'Commence par identifier les entrées, le résultat attendu et une erreur possible dans chaque exemple.')}</span></div>${sections.map(item => `<section><div class="course-section-cp">${badge(item.cp)}<span>${h(cpLabel(item.cp))}</span></div><h2>${h(item.section.title)}</h2>${item.section.body ? `<p>${h(item.section.body)}</p>` : ''}${renderCourseExamples(item.section, h)}${item.section.bullets?.length ? `<ul>${item.section.bullets.map(line => `<li>${h(line)}</li>`).join('')}</ul>` : ''}${item.section.code ? `<pre><code>${h(item.section.code)}</code></pre>` : ''}${renderCourseExercise(item.section, h)}</section>`).join('')}</article><aside class="sheet-aside"><section class="panel"><div class="eyebrow">TRAVAILLER CETTE TECHNO</div><h3 class="course-recall-title">${cards.length} cartes dédiées</h3><p class="small muted">Réponds avant de révéler. Les évaluations suivent le même planning que tes autres cartes.</p>${button(`Réviser ${h(topic.label)} ${icon('arrow', 16)}`, 'course-cards', 'primary full', `data-id="${topic.id}"`)}${button(readToday ? `${icon('check', 16)} Relue aujourd’hui` : 'Valider ma lecture du jour', 'course-complete', 'secondary full', `data-id="${topic.id}"`)}</section><section class="panel"><h3>Mon exemple personnel</h3><p class="small muted">Écris ce que fait un exemple du cours, puis relie-le à un de tes projets.</p><textarea id="course-note" data-id="${h(noteId)}" rows="7" placeholder="Je peux expliquer… Dans OQuiz / Oddit / mon projet…" aria-label="Mes notes ${h(topic.label)}">${h(state.notes[noteId] || '')}</textarea><span class="save-hint">Enregistrement automatique</span></section><section class="panel"><div class="eyebrow">LIENS AVEC LE RÉFÉRENTIEL</div><div class="course-cp-links">${cpIds.map(cp => button(cpLabel(cp), 'course-cp', 'secondary full', `data-id="${cp}"`)).join('')}</div></section></aside></div>`;
}

export function technologySelector(selected, h) {
  return `<label class="select-label"><span class="sr-only">Filtrer par technologie</span><select id="technology-filter"><option value="all">Toutes les technologies</option>${technologyTopics.map(topic => `<option value="${topic.id}" ${selected === topic.id ? 'selected' : ''}>${h(topic.label)}</option>`).join('')}</select></label>`;
}
