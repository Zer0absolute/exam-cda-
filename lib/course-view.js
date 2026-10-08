import { technologyTopics, courseSections, courseCards } from '../data/courses.js';

export function renderReferences(item, h) {
  if (!item.sources?.length) return '';
  const kinds = { official: 'Documentation officielle', academic: 'Référence académique', standard: 'Norme / spécification' };
  return `<div class="lesson-references"><span class="eyebrow">RÉFÉRENCES DE LA NOTION</span><ul>${item.sources.map(source => `<li><span>${h(kinds[source.kind] || 'Référence primaire')}</span><a href="${h(source.url)}" target="_blank" rel="noopener">${h(source.label)} ↗</a></li>`).join('')}</ul></div>`;
}

export function renderCourseExamples(section, h) {
  if (!section.examples?.length) return '';
  return `<div class="course-examples">${section.examples.map(example => `<article class="course-example"><div class="eyebrow">EXEMPLE · USER STORY</div><h3>${h(example.role)}</h3><p>${/^[aeiouy]/i.test(example.role) ? 'En tant qu’' : 'En tant que '}<strong>${h(example.role)}</strong>, je souhaite <strong>${h(example.need)}</strong>, afin de <strong>${h(example.goal)}</strong>.</p>${example.criteria?.length ? `<h4>Critères d’acceptation proposés</h4><ul>${example.criteria.map(item => `<li>${h(item)}</li>`).join('')}</ul>` : ''}</article>`).join('')}</div>`;
}

export function renderCourseExercise(section, h) {
  if (!section.exercise) return '';
  return `<div class="course-exercise"><div class="eyebrow">À TOI DE JOUER · EXERCICE D’ENTRAÎNEMENT</div><p>${h(section.exercise.prompt)}</p><details><summary>Voir une correction possible</summary><p class="course-correction">${h(section.exercise.answer)}</p></details></div>`;
}


export function renderCourses({ selectedTechnology, h, icon, pageHead, button, badge, cpLabel, state, localDay, query, hasCardSession = false }) {
  const topic = technologyTopics.find(item => item.id === selectedTechnology);
  if (!topic) {
    const visible = technologyTopics.filter(item => {
      const sections = courseSections.filter(section => section.technology === item.id);
      const searchable = [item.label, item.tools, item.summary, ...sections.flatMap(({ section }) => [section.title, section.body, ...(section.bullets || []), ...(section.examples || []).flatMap(example => [example.role, example.need, example.goal, ...(example.criteria || [])]), section.exercise?.prompt, section.exercise?.answer])].join(' ');
      return searchable.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr'));
    });
    return `${pageHead('APPRENDRE LES NOTIONS', 'Comprendre. <span class="serif">Puis retenir.</span>', 'Des explications progressives, des exemples autonomes et des exercices, avec les références de chaque notion.')}<div class="course-intro"><span class="eyebrow">DE LA NOTION AU CODE</span><p>Choisis un sujet et suis les fiches dans l’ordre : définition, exemple, exercice corrigé, puis cartes de questions et réponses. Toutes les données utiles à l’exemple sont fournies sur place.</p><p class="small muted">Les technologies s’appuient sur leurs documentations officielles. La modélisation s’appuie aussi sur des références académiques ; UML sur la spécification OMG. Les exercices sont créés pour pratiquer.</p></div><label class="search course-search">${icon('search', 18)}<input id="search" type="search" value="${h(query)}" placeholder="Chercher : Merise, middleware, Vitest…" aria-label="Chercher une technologie"></label><div class="course-grid">${visible.map(item => {
      const sections = courseSections.filter(section => section.technology === item.id);
      const cards = courseCards.filter(card => card.technology === item.id);
      const cps = [...new Set(sections.map(section => section.cp))];
      return `<button class="course-card ${item.color}" data-action="course-open" data-id="${item.id}"><div class="course-card-top"><span class="icon-box">${icon(item.symbol, 21)}</span><span class="mono">${cards.length} CARTES</span></div><h2>${h(item.label)}</h2><span class="course-tools">${h(item.tools)}</span><p>${h(item.summary)}</p><div class="course-card-footer"><span>${sections.length} fiches pratiques · ${cps.map(cp => cp.toUpperCase().replace('CP', 'CP ')).join(' / ')}</span>${icon('arrow', 17)}</div></button>`;
    }).join('')}</div>${visible.length ? '' : '<div class="empty-state">Aucun sujet avec ce mot. Essaie le nom d’une technologie.</div>'}<p class="source-note">Chaque carte vérifie une notion ou un petit exemple dont le contexte est donné. Tu peux relire la fiche avant de recommencer.</p>`;
  }
  const sections = courseSections.filter(item => item.technology === topic.id);
  const cards = courseCards.filter(card => card.technology === topic.id);
  const cpIds = [...new Set(sections.map(item => item.cp))];
  const noteId = `course:${topic.id}`;
  const readToday = state.notes[`course-day:${topic.id}`] === localDay();
  return `${button(`${icon('back', 16)} Toutes les technos`, 'course-back', 'text-button')}${pageHead('FICHE DE COURS · EXEMPLES ET RAPPEL ACTIF', h(topic.label), h(topic.tools), button(`${icon('download', 16)} Imprimer cette fiche`, 'course-print', 'secondary'))}<div class="sheet-layout"><article class="sheet-content course-detail"><div class="course-summary"><p>${h(topic.summary)}</p><span class="small muted">${h(topic.studyHint || 'Lis la définition et l’exemple, tente l’exercice avant d’ouvrir la correction, puis vérifie ce que tu retiens avec les cartes.')}</span></div>${sections.map((item, index) => `<section id="course-section-${topic.id}-${index}"><div class="course-section-cp">${badge(item.cp)}<span>${h(cpLabel(item.cp))}</span></div><h2 tabindex="-1">${h(item.section.title)}</h2>${item.section.body ? `<p>${h(item.section.body)}</p>` : ''}${item.section.bullets?.length ? `<ul>${item.section.bullets.map(line => `<li>${h(line)}</li>`).join('')}</ul>` : ''}${renderCourseExamples(item.section, h)}${item.section.code ? `<pre><code>${h(item.section.code)}</code></pre>` : ''}${renderCourseExercise(item.section, h)}${renderReferences(item.section, h)}</section>`).join('')}</article><aside class="sheet-aside">${hasCardSession ? button("Revenir à ma carte", 'card-resume', 'primary full') : ''}<section class="panel course-toc"><div class="eyebrow">DANS CETTE FICHE</div><ol>${sections.map((item, index) => `<li><button data-action="course-section" data-id="course-section-${topic.id}-${index}">${h(item.section.title)}</button></li>`).join('')}</ol></section><section class="panel"><div class="eyebrow">TRAVAILLER CETTE TECHNO</div><h3 class="course-recall-title">${cards.length} cartes dédiées</h3><p class="small muted">Réponds avant de révéler. Lis les fiches avant les cartes. Les évaluations suivent ton planning de révision.</p>${button(`Réviser ${h(topic.label)} ${icon('arrow', 16)}`, 'course-cards', 'primary full', `data-id="${topic.id}"`)}${button(readToday ? `${icon('check', 16)} Relue aujourd’hui` : 'Valider ma lecture du jour', 'course-complete', 'secondary full', `data-id="${topic.id}"`)}</section><section class="panel"><h3>Avec mes mots</h3><p class="small muted">Reformule une définition et explique un exemple de cette fiche. Note les mots qui restent flous.</p><textarea id="course-note" data-id="${h(noteId)}" rows="7" placeholder="Cette notion signifie… Dans l’exemple, on obtient… Je confonds encore…" aria-label="Mes notes ${h(topic.label)}">${h(state.notes[noteId] || '')}</textarea><span class="save-hint">Enregistrement automatique</span></section><section class="panel"><div class="eyebrow">LIENS AVEC LE RÉFÉRENTIEL</div><div class="course-cp-links">${cpIds.map(cp => button(cpLabel(cp), 'course-cp', 'secondary full', `data-id="${cp}"`)).join('')}</div></section></aside></div>`;
}

export function technologySelector(selected, h, selectorId = 'technology-filter') {
  return `<label class="select-label"><span class="sr-only">Filtrer par technologie</span><select id="${h(selectorId)}"><option value="all">Toutes les technologies</option>${technologyTopics.map(topic => `<option value="${topic.id}" ${selected === topic.id ? 'selected' : ''}>${h(topic.label)}</option>`).join('')}</select></label>`;
}
