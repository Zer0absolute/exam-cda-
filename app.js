import { competencies, flashcards, contentSources } from './data/knowledge.js';
import { technologyTopics, courseSources } from './data/courses.js';
import { renderCourses, technologySelector, renderCourseExamples, renderCourseExercise, renderReferences } from './lib/course-view.js';
import { oralQuestions as dossierQuestions, writtenExercises, presentationPlan, projectFacts, examFormat, examSources } from './data/exam.js';
import { conceptQuestions } from './data/concept-questions.js';
import { defaultState, sanitizeState, localDay, scheduleReview, buildCardQueue, recordActivity, streak, mastery, dueCount, exportAnki } from './lib/learning.js';

const oralQuestions = [...conceptQuestions, ...dossierQuestions];

const STORAGE = new URLSearchParams(location.search).has('test') ? 'cda-studio-test-v1' : 'cda-studio-v1';
const SIDEBAR_STORAGE = `${STORAGE}-sidebar-collapsed`;
let sidebarCollapsed = false;
try { sidebarCollapsed = localStorage.getItem(SIDEBAR_STORAGE) === 'true'; } catch {}
const $ = selector => document.querySelector(selector);
const h = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let storageError = '';
let recoveryRaw = '';
let pendingNavigation = null;
let pendingLesson = '';
let state = defaultState();
try { const saved = localStorage.getItem(STORAGE); if (saved) state = sanitizeState(JSON.parse(saved)); }
catch {
  try { recoveryRaw = localStorage.getItem(STORAGE) || ''; if (recoveryRaw) localStorage.setItem(`${STORAGE}-recovery`, recoveryRaw); } catch {}
  storageError = 'La sauvegarde est illisible. Une copie brute est conservée et disponible dans Réglages.';
}
try { recoveryRaw ||= localStorage.getItem(`${STORAGE}-recovery`) || ''; } catch {}
const nav = [ ['today', 'Aujourd’hui', 'home'], ['sheets', 'Fiches mémo', 'book'], ['tech', 'Cours & notions', 'source'], ['cards', 'Cartes de révision', 'cards'], ['oral', 'Questions & réponses', 'chat'], ['written', 'Écrit · FR & EN', 'pen'], ['exam', 'Soutenance blanche', 'timer'] ];
let view = nav.some(([id]) => id === location.hash.slice(1)) || ['settings', 'sources'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'today';
let filterTechnology = 'all', selectedTechnology = '';
let filterCp = 'all', filterKind = 'all', query = '', selectedSheet = '', selectedOral = oralQuestions[0]?.id;
let oralScope = 'notions', filterOralTechnology = 'all';
let revealedOral = false, cardMode = 'due', session = null, written = null;
let timer = { running: false, remaining: 40 * 60, duration: 40 * 60, end: 0, phase: 'presentation', full: false };
let timerInterval = null;

function icon(name, size = 20) {
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    book: '<path d="M12 5v16M3 3c4-1 6 0 9 2 3-2 5-3 9-2v16c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',
    cards: '<rect x="6" y="6" width="15" height="15" rx="3"/><path d="M17 3H6a3 3 0 0 0-3 3v11M10 12h7m-7 4h4"/>',
    chat: '<path d="M21 11a9 9 0 0 1-9 9H4l-2 2v-9a9 9 0 1 1 19-2Z"/><path d="M7 9h10M7 13h6"/>',
    pen: '<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15Z"/>',
    timer: '<circle cx="12" cy="14" r="8"/><path d="M12 10v4l3 2M9 2h6M12 2v4m6 2 2-2"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
    source: '<path d="M14 3H4v17h16V10M14 3h7v7M21 3l-11 11"/>',
    flame: '<path d="M12 2c1 6 7 7 7 13a7 7 0 0 1-14 0c0-3 2-5 4-7 0 4 1 5 2 5 2 0 3-5 1-11Z"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    star: '<path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    play: '<path d="m8 4 13 8-13 8Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    reset: '<path d="M3 10a9 9 0 1 1 2 9M3 3v7h7"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 2v6M17 2v6M3 11h18"/>',
    'panel-close': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m7-11-3 3 3 3"/>',
    'panel-open': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m4-11 3 3-3 3"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
}
function save() {
  try { localStorage.setItem(STORAGE, JSON.stringify(state)); }
  catch { toast('Le navigateur ne peut pas enregistrer. Exporte ta progression depuis Réglages.'); }
}
function sidebarToggle() {
  const label = sidebarCollapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale';
  return `<button id="sidebar-toggle" type="button" class="sidebar-toggle" data-action="sidebar-toggle" aria-controls="sidebar" aria-expanded="${!sidebarCollapsed}" aria-label="${label}" title="${label}">${icon(sidebarCollapsed ? 'panel-open' : 'panel-close')}</button>`;
}
function applySidebarState() {
  $('#app').classList.toggle('sidebar-collapsed', sidebarCollapsed);
  const toggle = $('#sidebar-toggle');
  const label = sidebarCollapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale';
  toggle.setAttribute('aria-expanded', String(!sidebarCollapsed));
  toggle.setAttribute('aria-label', label);
  toggle.title = label;
  toggle.innerHTML = icon(sidebarCollapsed ? 'panel-open' : 'panel-close');
}
function toast(message) { const node = $('#toast'); node.textContent = message; node.classList.add('show'); clearTimeout(toast.timeout); toast.timeout = setTimeout(() => node.classList.remove('show'), 5000); }
function go(id) { if (view === id) { render(); return; } pendingNavigation = { cp: filterCp, kind: filterKind, technology: filterTechnology, sheet: selectedSheet }; location.hash = id; }
function cpLabel(id) { const cp = competencies.find(c => c.id === id); return cp ? `CP ${cp.number} · ${cp.short}` : 'Toutes les compétences'; }
function badge(id) { const cp = competencies.find(c => c.id === id); return `<span class="badge block-${cp?.block || 1}">CP ${cp?.number || '?'}</span>`; }
function selectCp() { return `<label class="select-label"><span class="sr-only">Filtrer par compétence</span><select id="cp-filter"><option value="all">Toutes les compétences</option>${competencies.map(c => `<option value="${c.id}" ${filterCp === c.id ? 'selected' : ''}>CP ${c.number} · ${h(c.short)}</option>`).join('')}</select></label>`; }
function searchBox(placeholder) { return `<label class="search">${icon('search', 18)}<input id="search" value="${h(query)}" placeholder="${h(placeholder)}" aria-label="${h(placeholder)}" type="search"></label>`; }
function pageHead(eyebrow, title, text, extra = '') { return `<div class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="subtitle">${text}</p></div>${extra}</div>`; }
function button(label, action, cls = 'primary', extra = '') { return `<button class="btn ${cls}" data-action="${action}" ${extra}>${label}</button>`; }
function progress(value, label) { const n = Math.max(0, Math.min(100, value)); return `<div class="progress" role="progressbar" aria-label="${h(label)}" aria-valuenow="${Math.round(n)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${n}%"></span></div>`; }
function daily() { return state.activity[localDay()] || { cards: 0, questions: 0, sheets: 0, written: 0 }; }
function daysToExam() { if (!state.settings.examDate) return null; const end = new Date(`${state.settings.examDate}T12:00:00`); const today = new Date(`${localDay()}T12:00:00`); return Math.round((end - today) / 86400000); }
function render() {
  const days = daysToExam();
  const dayText = days === null ? 'La régularité fait la différence.' : days > 0 ? `${days} jour${days > 1 ? 's' : ''} pour prendre confiance.` : days === 0 ? 'C’est le grand jour. Tu as travaillé.' : 'Ton parcours continue.';
  $('#app').innerHTML = `<aside id="sidebar" class="sidebar"><a href="#today" class="brand" aria-label="CDA Studio · Accueil" title="CDA Studio · Accueil"><span class="brand-mark"><i></i><i></i><i></i><i></i></span><span class="brand-name">CDA<span class="brand-light"> studio</span></span></a><div class="workspace-label">TON ESPACE DE RÉVISION</div><nav aria-label="Navigation principale">${nav.map(([id, label, symbol]) => `<a href="#${id}" aria-label="${h(label)}" title="${h(label)}" class="nav-item ${view === id ? 'active' : ''}" ${view === id ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span>${id === 'cards' ? `<span class="nav-count">${dueCount(flashcards, state.reviews)}</span>` : ''}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="exam-note"><span class="little-dot"></span><strong>Objectif : titre CDA</strong><p>${dayText}</p><a href="#settings">${days === null ? 'Ajouter ma date' : 'Modifier ma date'} ${icon('arrow', 14)}</a></div><a href="#sources" aria-label="Référentiel & dossiers" title="Référentiel & dossiers" class="nav-item ${view === 'sources' ? 'active' : ''}">${icon('source')}<span>Référentiel & dossiers</span></a><a href="#settings" aria-label="Réglages & sauvegarde" title="Réglages & sauvegarde" class="nav-item ${view === 'settings' ? 'active' : ''}">${icon('settings')}<span>Réglages & sauvegarde</span></a><div class="profile"><span class="avatar">M</span><div><strong>Maël</strong><span>Préparation à la soutenance</span></div><span class="local-dot" title="Application locale"></span></div></div></aside><div class="shell"><header class="topbar"><div class="topbar-heading">${sidebarToggle()}<span>MON PARCOURS <span class="topbar-divider">/</span> <strong>${h(nav.find(([id]) => id === view)?.[1] || (view === 'settings' ? 'Réglages' : 'Référentiel & dossiers'))}</strong></span></div><span class="date-label">${icon('calendar', 15)} ${h(new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }))}</span></header><main id="main" tabindex="-1">${({ today: dashboard, sheets, tech: coursesView, cards, oral, written: writtenView, exam: examView, settings, sources })[view]()}</main><footer class="footer"><span>Un concept compris. Un exemple concret. Un peu plus de confiance.</span><span><span class="little-dot"></span> Progression enregistrée dans ce navigateur</span></footer></div>`;
  applySidebarState();
  if (storageError) { toast(storageError); storageError = ''; }
}

function dashboard() {
  const today = daily(), m = mastery(flashcards, state.reviews), due = dueCount(flashcards, state.reviews);
  const goals = [Math.min(today.cards / state.settings.dailyCards, 1), Math.min(today.questions / state.settings.dailyQuestions, 1), Math.min(today.sheets, 1)];
  const percent = Math.round(goals.reduce((a, b) => a + b, 0) / 3 * 100);
  const date = new Date(); const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(date); d.setDate(d.getDate() - 6 + i); return d; });
  return `${pageHead('BONJOUR MAËL, ON S’Y MET ?', 'Un peu chaque jour.<br><span class="serif">Beaucoup plus à l’aise.</span>', 'Ton rituel pour comprendre, retenir et expliquer le jour de la soutenance.', `<span class="outline-pill">${icon('flame', 17)} ${streak(state.activity)} jour${streak(state.activity) !== 1 ? 's' : ''} de suite</span>`)}<section class="daily-hero"><div class="hero-main"><div class="eyebrow">TON RENDEZ-VOUS DU JOUR <span class="hero-time">≈ 25 MIN</span></div><h2>Comprendre avant de mémoriser.</h2><p>Lis une fiche, tente son exercice,<br class="desktop-only"> puis retiens les notions avec les cartes.</p><div class="hero-actions">${button(`Choisir une notion ${icon('arrow', 18)}`, 'daily-start')}<span>${Math.min(state.settings.dailyCards, due)} cartes · ${state.settings.dailyQuestions} questions · 1 fiche</span></div></div><div class="hero-progress"><div class="radial" style="--percent:${percent}"><div><strong>${percent}<small>%</small></strong><span>du rituel réalisé</span></div></div><p>${percent === 100 ? 'Rituel accompli. Beau travail !' : 'Chaque petite session compte.'}</p></div></section><div class="stats-grid"><div class="stat-card"><span>À réviser</span><div><strong>${due}</strong>${icon('cards', 24)}</div><p>Cartes nouvelles ou arrivées à échéance</p></div><div class="stat-card"><span>En mémoire</span><div><strong>${m.learned}<small> / ${m.total}</small></strong>${icon('check', 24)}</div><p>Cartes réussies et espacées d’au moins 3 jours</p></div><div class="stat-card"><span>Cette semaine</span><div><strong>${days.filter(d => state.activity[localDay(d)] && Object.values(state.activity[localDay(d)]).some(n => n > 0)).length}<small> / 7 jours</small></strong>${icon('calendar', 24)}</div><div class="week-dots">${days.map(d => `<span title="${h(d.toLocaleDateString('fr-FR'))}" class="${state.activity[localDay(d)] && Object.values(state.activity[localDay(d)]).some(n => n > 0) ? 'done' : ''}">${h(d.toLocaleDateString('fr-FR', { weekday: 'narrow' }))}</span>`).join('')}</div></div></div><div class="section-heading"><h2>Trois façons de progresser</h2><span>COMPRENDRE → RETENIR → EXPLIQUER</span></div><div class="learning-grid">${[
    ['sheets', 'book', '01', 'Faire le point', 'Fiches mémo', 'Les notions essentielles des 11 compétences, des exemples et les points à vérifier.', `${state.completedSheets.length} / 11 fiches parcourues`, 'olive'],
    ['cards', 'cards', '02', 'Ancrer les notions', 'Rappel actif', 'Des cartes courtes. Tu cherches la réponse, puis tu programmes la prochaine révision.', `${flashcards.length} cartes · export Anki`, 'lavender'],
    ['oral', 'chat', '03', 'Prendre confiance', 'Expliquer les notions', 'Des cas autonomes avec réponses sourcées, puis un mode pour préparer tes dossiers au jury.', `${conceptQuestions.length} notions · ${dossierQuestions.length} questions dossiers`, 'peach'],
  ].map(([target, symbol, n, kicker, title, description, info, color]) => `<a href="#${target}" class="learning-card ${color}"><div class="learning-card-top"><span class="icon-box">${icon(symbol, 22)}</span><span class="mono">${n}</span></div><span class="learning-kicker">${kicker}</span><h3>${title}</h3><p>${description}</p><div class="learning-card-bottom"><span>${info}</span>${icon('arrow', 19)}</div></a>`).join('')}</div><div class="dashboard-bottom"><section class="competency-overview"><div class="section-heading"><h2>Ton parcours, compétence par compétence</h2><a href="#sheets">Tout explorer ${icon('arrow', 15)}</a></div>${[1, 2, 3].map(b => { const c = competencies.filter(c => c.block === b), ids = new Set(c.map(x => x.id)), relevant = flashcards.filter(x => ids.has(x.cp)), x = mastery(relevant, state.reviews); return `<div class="block-line"><span class="block-number block-${b}">0${b}</span><div><strong>${['Développer une application sécurisée', 'Concevoir une application en couches', 'Préparer le déploiement'][b - 1]}</strong><span>${c.map(x => `CP ${x.number}`).join(' · ')}</span>${progress(x.percent, `Mémorisation du bloc ${b}`)}</div><span class="block-percent">${x.percent}%</span></div>`; }).join('')}</section><section class="exam-preview"><span class="eyebrow">LE JOUR J</span><h2>2 h 15 pour<br><span class="serif">raconter ton travail.</span></h2><div>${examFormat.map(x => `<div class="format-line"><span>${h(x.title)}</span><strong>${x.minutes} min</strong></div>`).join('')}</div><a href="#exam">M’entraîner en conditions réelles ${icon('arrow', 17)}</a></section></div>`;
}

function sheets() {
  const cp = competencies.find(x => x.id === selectedSheet);
  if (cp) return `${button(`${icon('back', 16)} Toutes les fiches`, 'sheets-back', 'text-button')}${pageHead(`BLOC ${cp.block} · COMPÉTENCE ${cp.number}`, h(cp.title), h(cp.summary), `<button class="btn secondary" data-action="bookmark" data-id="${cp.id}" aria-pressed="${state.bookmarks.includes(cp.id)}">${icon('star', 17)} ${state.bookmarks.includes(cp.id) ? 'Favori' : 'Garder en favori'}</button>`)}<div class="sheet-layout"><article class="sheet-content">${cp.sections.map((s, index) => `<section id="sheet-section-${cp.id}-${index}">${s.course ? '<div class="eyebrow muted">NOTION · EXEMPLE AUTONOME</div>' : ''}<h2 tabindex="-1">${h(s.title)}</h2>${s.body ? `<p>${h(s.body)}</p>` : ''}${s.bullets?.length ? `<ul>${s.bullets.map(x => `<li>${h(x)}</li>`).join('')}</ul>` : ''}${renderCourseExamples(s, h)}${s.code ? `<pre><code>${h(s.code)}</code></pre>` : ''}${renderCourseExercise(s, h)}${renderReferences(s, h)}</section>`).join('')}<div class="source-note">${icon('source', 16)} ${h(cp.source)} · Le référentiel définit les compétences. Les références près des notions permettent de lire leur documentation ; les exercices sont créés pour pratiquer.</div></article><aside class="sheet-aside">${session?.queue.length ? button("Revenir à ma carte", 'card-resume', 'primary full') : ''}<section class="panel"><span class="eyebrow">JE DOIS SAVOIR EXPLIQUER</span><ul class="checklist">${cp.checklist.map(x => `<li>${icon('check', 16)}<span>${h(x)}</span></li>`).join('')}</ul>${button(state.notes[`sheet-day:${cp.id}`] === localDay() ? `${icon('check', 16)} Relue aujourd’hui` : 'Valider ma lecture du jour', 'sheet-complete', state.completedSheets.includes(cp.id) ? 'secondary full' : 'primary full', `data-id="${cp.id}"`)}</section><section class="panel"><h3>Avec mes propres mots</h3><p class="muted small">Reformule la notion, explique un exemple fourni ou note une hésitation.</p><textarea id="sheet-note" data-id="${cp.id}" rows="7" placeholder="Cette notion signifie… Dans l’exemple, on obtient…" aria-label="Mes notes pour ${h(cp.short)}">${h(state.notes[cp.id] || '')}</textarea><span class="save-hint">Enregistrement automatique</span></section>${button(`Réviser les cartes ${icon('arrow', 17)}`, 'sheet-cards', 'secondary full', `data-id="${cp.id}"`)}</aside></div>`;
  const normalized = query.toLocaleLowerCase('fr');
  const filtered = competencies.filter(c => (filterCp === 'all' || c.id === filterCp) && `${c.title} ${c.short} ${c.summary} ${c.sections.map(s => `${s.title} ${s.body} ${(s.bullets || []).join(' ')}`).join(' ')}`.toLocaleLowerCase('fr').includes(normalized));
  return `${pageHead('COMPRENDRE AVANT DE MÉMORISER', 'Tes fiches <span class="serif">mémo.</span>', 'Les notions des 3 blocs, expliquées avec des exemples autonomes et des références primaires.')}<div class="toolbar">${searchBox('Chercher une notion : SQL, sécurité, tests…')}${selectCp()}${button(`${icon('download', 16)} Imprimer`, 'print', 'secondary')}</div>${[1, 2, 3].map(b => { const list = filtered.filter(c => c.block === b); if (!list.length) return ''; return `<div class="section-heading"><h2><span class="block-number block-${b}">0${b}</span> ${['Développer une application sécurisée', 'Concevoir et développer en couches', 'Préparer le déploiement'][b - 1]}</h2><span>${list.length} COMPÉTENCES</span></div><div class="sheets-grid">${list.map(c => { const m = mastery(flashcards, state.reviews, c.id); return `<button class="sheet-card" data-action="sheet-open" data-id="${c.id}"><div>${badge(c.id)}<span class="sheet-status">${state.completedSheets.includes(c.id) ? icon('check', 18) : state.bookmarks.includes(c.id) ? icon('star', 18) : icon('arrow', 18)}</span></div><h3>${h(c.title)}</h3><p>${h(c.summary)}</p><div class="sheet-meta"><span>${c.sections.length} repères à retenir</span><span>${m.learned} / ${m.total} cartes</span></div>${progress(m.percent, `Mémorisation CP ${c.number}`)}</button>`; }).join('')}</div>`; }).join('')}${filtered.length ? '' : '<div class="empty-state">Aucune fiche pour cette recherche. Essaie un autre mot.</div>'}`;
}

function coursesView() { return renderCourses({ selectedTechnology, h, icon, pageHead, button, badge, cpLabel, state, localDay, query, hasCardSession: Boolean(session?.queue.length) }); }
function eligibleCards() { return filterTechnology === 'all' ? flashcards : flashcards.filter(card => card.technology === filterTechnology); }

function cards() {
  const due = buildCardQueue(eligibleCards(), state.reviews, { limit: flashcards.length, cp: filterCp, mode: cardMode }).length;
  let body;
  if (!session) body = `<section class="card-intro panel"><div class="large-symbol lavender">${icon('cards', 32)}</div><div class="eyebrow">LE RAPPEL ACTIF</div><h2>Cherche avant de retourner.</h2><p>Lis d’abord une fiche dans Cours & notions si le sujet est flou.<br>Les questions portent sur des notions et des exemples donnés sur place.</p><div class="intro-metrics"><div><strong>${due}</strong><span>${cardMode === 'due' ? 'cartes disponibles' : 'cartes dans ce filtre'}</span></div><div><strong>${Math.min(due, state.settings.dailyCards)}</strong><span>cartes dans cette session</span></div></div>${button(`Lancer les cartes ${icon('arrow', 18)}`, 'cards-start', 'primary', due ? '' : 'disabled')}<p class="small muted">Espace pour retourner · 1 à 4 pour noter · Une répétition oubliée revient dans la session.</p></section>`;
  else if (!session.queue.length) body = `<section class="card-intro panel"><div class="large-symbol olive">${icon('check', 32)}</div><div class="eyebrow">SESSION TERMINÉE</div><h2>Une étape de plus.</h2><p>${session.graded} réponse${session.graded > 1 ? 's' : ''} évaluée${session.graded > 1 ? 's' : ''}. Les prochaines révisions sont programmées.</p><div class="hero-actions">${button(`Passer aux questions ${icon('arrow', 18)}`, 'cards-to-oral')}${button('Une autre session', 'cards-restart', 'secondary')}</div></section>`;
  else { const c = session.queue[0]; const answer = session.revealed; body = `<div class="session-progress"><span>${session.graded} réponse${session.graded > 1 ? 's' : ''} travaillée${session.graded > 1 ? 's' : ''}</span><span>${session.queue.length} carte${session.queue.length > 1 ? 's' : ''} restante${session.queue.length > 1 ? 's' : ''}</span></div><section class="flashcard ${answer ? 'revealed' : ''}"><div class="flashcard-top">${badge(c.cp)}<span>${h(cpLabel(c.cp).split(' · ')[1])}</span><span class="mono">${answer ? 'VERSO' : 'RECTO'}</span></div><div class="flashcard-question"><span class="eyebrow">${answer ? 'LA RÉPONSE' : 'À TOI DE JOUER'}</span><h2>${h(c.question)}</h2>${answer ? `<div class="answer-content"><p>${h(c.answer)}</p>${c.detail ? `<div class="answer-detail">${h(c.detail)}</div>` : ''}${renderReferences(c, h)}</div>` : `<p class="card-prompt">Prends quelques secondes. Dis la réponse à voix haute.</p>`}</div>${button("Relire la fiche", 'card-lesson', 'text-button', `data-id="${c.id}"`)}<div class="flashcard-tags">${(c.tags || []).map(t => `<span>${h(t)}</span>`).join('')}</div></section>${answer ? `<div class="rating-heading">Comment s’est passée ta réponse ?</div><div class="ratings">${[['again', 'À revoir', '1', 'red'], ['hard', 'Difficile', '2', 'amber'], ['good', 'Bien', '3', 'green'], ['easy', 'Facile', '4', 'blue']].map(([rating, label, key, color]) => { const r = scheduleReview(state.reviews[c.id], rating); const interval = rating === 'again' ? '10 min + rappel ici' : `${Math.round(r.interval)} jour${r.interval > 1 ? 's' : ''}`; return `<button class="rating ${color}" data-action="card-rate" data-rating="${rating}"><span><kbd>${key}</kbd> ${label}</span><small>${interval}</small></button>`; }).join('')}</div>` : `<div class="center">${button(`Voir la réponse <kbd>espace</kbd>`, 'card-reveal', 'primary wide')}</div>`}<div class="center small muted session-tip">La répétition espacée suit tes réponses. « En mémoire » indique un intervalle d’au moins 3 jours.</div>`; }
  return `${pageHead('RETENIR DURABLEMENT', 'Une carte. <span class="serif">Une idée.</span>', 'Des questions sur les concepts, des réponses expliquées et leurs références. Tous les exemples utiles sont fournis.', button(`${icon('download', 17)} Exporter pour Anki`, 'anki-export', 'secondary'))}<div class="toolbar">${selectCp()}${technologySelector(filterTechnology, h)}<div class="segmented" aria-label="Mode de révision"><button data-action="card-mode" data-mode="due" class="${cardMode === 'due' ? 'selected' : ''}" aria-pressed="${cardMode === 'due'}">À réviser</button><button data-action="card-mode" data-mode="all" class="${cardMode === 'all' ? 'selected' : ''}" aria-pressed="${cardMode === 'all'}">Tout pratiquer</button></div>${session ? button('Quitter la session', 'cards-stop', 'text-button') : '<span class="toolbar-note">Les cartes dues passent en premier.</span>'}</div><div class="cards-stage">${body}</div>`;
}

function filteredQuestions() {
  return oralQuestions.filter(q =>
    (oralScope === 'notions' ? q.kind === 'notion' : q.kind !== 'notion') &&
    (filterCp === 'all' || q.cp === filterCp) &&
    (oralScope !== 'notions' || filterOralTechnology === 'all' || q.technology === filterOralTechnology) &&
    (filterKind === 'all' || q.kind === filterKind) &&
    `${q.question} ${q.context || ''} ${q.project} ${q.answer}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')));
}
function oral() {
  const list = filteredQuestions();
  const q = list.find(x => x.id === selectedOral) || list[0];
  if (q) selectedOral = q.id;
  const notions = oralScope === 'notions';
  const kinds = { notion: 'Notions générales', technique: 'Entretien technique', projet: 'Ton projet', final: 'Entretien final' };
  const scopes = `<div class="oral-scopes segmented" aria-label="Choisir l’entraînement"><button data-action="oral-scope" data-scope="notions" class="${notions ? 'selected' : ''}" aria-pressed="${notions}">Notions générales</button><button data-action="oral-scope" data-scope="dossiers" class="${!notions ? 'selected' : ''}" aria-pressed="${!notions}">Mes dossiers</button></div>`;
  const filters = `<div class="toolbar">${searchBox(notions ? 'Chercher une notion : cardinalité, transaction…' : 'Chercher une question ou un projet…')}${selectCp()}${notions ? technologySelector(filterOralTechnology, h, 'oral-technology-filter') : `<label class="select-label"><span class="sr-only">Type de question</span><select id="kind-filter"><option value="all">Tous les entretiens</option>${Object.entries(kinds).filter(([key]) => key !== 'notion').map(([k,v]) => `<option value="${k}" ${filterKind === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>`}</div>`;
  const head = pageHead(notions ? 'COMPRENDRE ET EXPLIQUER' : 'PRÉPARER LE JURY · TES DOSSIERS', 'À toi de <span class="serif">répondre.</span>', notions ? 'Définis la notion et raisonne sur le cas donné. Les réponses expliquées citent leurs références primaires.' : 'Entraîne-toi à expliquer tes réalisations, les preuves de tes dossiers et tes choix devant le jury.');
  if (!q) return `${head}${scopes}${filters}<div class="empty-state">Aucune question avec ces filtres.</div>`;
  const guided = revealedOral ? `<section class="guided-answer"><span class="eyebrow">${notions ? 'EXPLICATION DU CAS' : 'RÉPONSE GUIDÉE À ADAPTER À TON TRAVAIL'}</span><p>${h(q.answer)}</p><h3>${notions ? 'Les points à vérifier' : 'Ce que le jury attend'}</h3><ul>${q.expected.map(x => `<li>${h(x)}</li>`).join('')}</ul><div class="followup"><strong>${notions ? 'Pour aller plus loin…' : 'Et si le jury relance…'}</strong><p>${h(q.followup)}</p></div>${q.sources?.length ? renderReferences(q, h) : `<p class="source-note">${h(q.source)}</p>`}</section><div class="self-rating">${button('À retravailler', 'oral-rate', 'secondary', 'data-rating="again"')}${button(`Réponse solide ${icon('check', 16)}`, 'oral-rate', 'primary', 'data-rating="good"')}${button(`Question suivante ${icon('arrow', 16)}`, 'oral-next', 'text-button')}</div>` : `<div class="answer-actions">${button('Comparer avec la réponse expliquée', 'oral-reveal')}${button(`Suivante ${icon('arrow', 16)}`, 'oral-next', 'text-button')}</div>`;
  return `${head}${scopes}${filters}<div class="oral-layout"><aside class="question-list panel"><div class="list-head"><strong>${list.length} questions</strong>${button('Au hasard', 'oral-random', 'text-button')}</div>${list.map(x => `<button class="question-list-item ${x.id === q.id ? 'selected' : ''}" data-action="oral-select" data-id="${x.id}"><span>${h(x.project)} · CP ${x.cp.replace('cp', '')}${state.answers[`oral:${x.id}`]?.rating === 'good' ? ` ${icon('check', 13)}` : ''}</span><strong>${h(x.question)}</strong></button>`).join('')}</aside><article class="oral-question panel"><div class="question-meta">${badge(q.cp)}<span>${h(kinds[q.kind])} · ${h(q.project)}</span></div>${q.context ? `<div class="concept-context"><span class="eyebrow">LES DONNÉES DU CAS</span><p>${h(q.context)}</p></div>` : ''}<h2>${h(q.question)}</h2><div class="answer-method"><span class="eyebrow">UNE RÉPONSE QUI TIENT DEBOUT</span><p>${notions ? '<strong>Définition</strong> → <strong>Données du cas</strong> → <strong>Raisonnement</strong> → <strong>Résultat</strong>' : '<strong>Contexte</strong> → <strong>Choix</strong> → <strong>Preuve</strong> → <strong>Limite</strong>'}</p></div><label class="field-label" for="oral-answer">Mes mots clés pour répondre</label><textarea id="oral-answer" data-id="${q.id}" rows="5" placeholder="${notions ? 'La notion signifie… Dans le cas donné… On obtient…' : 'J’ai choisi… parce que… Par exemple… La limite est…'}">${h(state.answers[`oral:${q.id}`]?.text || '')}</textarea><span class="save-hint">Enregistrement automatique · Autoévaluation avec une réponse expliquée</span>${guided}</article></div>`;
}

function writtenAnswer(exercise) {
  const text = written?.responses?.[exercise.id] ?? state.answers[`written:${exercise.id}`]?.text ?? '';
  if (exercise.choices?.length) return `<fieldset class="qcu-options"><legend class="field-label">Une seule réponse attendue</legend>${exercise.choices.map((c, i) => `<label class="qcu-option ${text === String(i) ? 'chosen' : ''}"><input type="radio" name="${exercise.id}" value="${i}" data-written="${exercise.id}" ${text === String(i) ? 'checked' : ''} ${written.submitted ? 'disabled' : ''}><span>${h(c)}</span></label>`).join('')}</fieldset>`;
  return `<label class="field-label" for="answer-${exercise.id}">${exercise.language === 'en' ? 'Your short answer in English' : 'Ta réponse en français'}</label><textarea id="answer-${exercise.id}" data-written="${exercise.id}" rows="6" ${written.submitted ? 'readonly' : ''} placeholder="${exercise.language === 'en' ? 'Write a clear, short professional answer…' : 'Rédige une réponse courte et précise…'}">${h(text)}</textarea>`;
}
function writtenCorrection(exercise) {
  const text = written.responses[exercise.id] || '';
  const qcu = exercise.choices?.length;
  return `<div class="written-correction"><div class="eyebrow">${qcu ? text === String(exercise.correctIndex) ? 'BONNE RÉPONSE' : text === '' ? 'QUESTION SANS RÉPONSE' : 'À REVOIR' : 'EXEMPLE DE RÉPONSE · AUTOÉVALUATION'}</div>${qcu ? `<p><strong>${h(exercise.choices[exercise.correctIndex])}</strong></p><p>${h(exercise.explanation || exercise.sample)}</p>` : `<p class="sample-answer" lang="${exercise.language}">${h(exercise.sample)}</p>`}<ul class="criteria">${exercise.criteria.map(x => `<li>${icon('check', 15)} ${h(x)}</li>`).join('')}</ul>${exercise.vocabulary?.length ? `<div class="vocab">${exercise.vocabulary.map(v => `<span><strong>${h(v.term)}</strong> ${h(v.translation)}</span>`).join('')}</div>` : ''}${!qcu ? `<p class="small muted">Compare le sens, les informations et la clarté. Une formulation différente peut être correcte.</p>` : ''}</div>`;
}
function writtenView() {
  if (!written) return `${pageHead('LIRE, COMPRENDRE, RÉPONDRE', 'L’écrit, <span class="serif">sans blocage.</span>', 'Deux QCU en français et deux réponses courtes en anglais, selon le RE fourni.')}<section class="written-hero panel"><div><span class="eyebrow">SIMULATION DU QUESTIONNAIRE PROFESSIONNEL</span><h2>4 questions.<br>30 minutes. À toi.</h2><p>Lis les documents supports et réponds avec précision.<br>Les réponses modèles s’affichent après ton essai.</p>${button(`Démarrer une simulation ${icon('arrow', 17)}`, 'written-session')}<p class="small muted">Les sujets sont des exercices créés pour réviser, pas des sujets officiels.</p></div><div class="written-breakdown"><div><span class="language-pill">FR</span><strong>2 questions à choix unique</strong><span>Compréhension d’un document technique</span></div><div><span class="language-pill en">EN</span><strong>2 réponses courtes ouvertes</strong><span>Compréhension et expression · niveau B1</span></div></div></section><div class="section-heading"><h2>Ou travailler un seul exercice</h2><span>${writtenExercises.length} EXERCICES</span></div><div class="written-grid">${writtenExercises.map(e => `<button class="written-card" data-action="written-single" data-id="${e.id}"><span class="language-pill ${e.language === 'en' ? 'en' : ''}">${e.language.toUpperCase()}</span><div><span class="small muted">${cpLabel(e.cp)} · ${e.choices?.length ? 'QCU' : 'Rédaction'}</span><h3>${h(e.prompt)}</h3></div>${icon('arrow', 17)}</button>`).join('')}</div>`;
  const exercises = written.ids.map(id => writtenExercises.find(e => e.id === id));
  const fr = exercises.filter(e => e.choices?.length), score = fr.filter(e => written.responses[e.id] === String(e.correctIndex)).length;
  return `${pageHead(written.mode === 'session' ? 'QUESTIONNAIRE PROFESSIONNEL · SIMULATION' : 'ENTRAÎNEMENT LIBRE', written.submitted ? 'Relis, puis <span class="serif">améliore.</span>' : 'Prends le temps <span class="serif">de lire.</span>', written.submitted ? `Français : ${score} / ${fr.length} QCU réussi${score > 1 ? 's' : ''}. L’anglais se travaille avec les critères et les exemples.` : 'Lis le support en anglais avant de répondre dans la langue demandée. Tes réponses sont enregistrées.', button(`${icon('back', 16)} Exercices`, 'written-back', 'secondary'))}${written.mode === 'session' ? `<div class="written-session-bar"><span>${icon('timer', 18)} ${written.submitted ? 'Simulation terminée' : 'Temps restant'}</span><strong id="written-timer" aria-live="off">${formatTime(written.remaining)}</strong><span>2 FR + 2 EN</span></div>` : ''}${exercises.map((e, index) => `<article class="written-exercise panel"><div class="question-meta"><span class="language-pill ${e.language === 'en' ? 'en' : ''}">${e.language.toUpperCase()}</span>${badge(e.cp)}<span>QUESTION ${index + 1} / ${exercises.length}</span></div><h2 lang="${e.language}">${h(e.prompt)}</h2><div class="document-extract" lang="${e.bonus ? e.language : 'en'}"><span class="eyebrow">${e.language === 'en' ? 'SUPPORTING DOCUMENT' : 'DOCUMENT SUPPORT'}</span><p>${h(e.context)}</p></div>${writtenAnswer(e)}${written.submitted ? writtenCorrection(e) : '<span class="save-hint">Enregistrement automatique</span>'}</article>`).join('')}<div class="answer-actions">${written.submitted ? button('Nouvelle simulation', 'written-session') : button(written.mode === 'session' ? 'Terminer et comparer mes réponses' : 'Comparer ma réponse', 'written-submit')}${written.mode === 'session' && !written.submitted ? '<span class="small muted">Les réponses ouvertes sont autoévaluées, avec une grille de critères.</span>' : ''}</div>`;
}

function formatTime(seconds) { const n = Math.max(0, Math.ceil(seconds)); return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`; }
function examView() {
  const phase = examFormat.find(x => x.id === timer.phase) || examFormat[0];
  const active = examFormat.indexOf(phase);
  return `${pageHead('S’ENTRAÎNER EN CONDITIONS RÉELLES', 'Le jour J, <span class="serif">avant le jour J.</span>', 'Un minuteur par épreuve, ton fil conducteur et des questions pour t’entraîner.')}<div class="exam-phases">${examFormat.map((p, i) => `<button data-action="exam-phase" data-id="${p.id}" class="exam-phase ${p.id === phase.id ? 'selected' : ''}" aria-pressed="${p.id === phase.id}"><span class="mono">0${i + 1}</span><strong>${h(p.title)}</strong><span>${p.minutes} minutes</span></button>`).join('')}</div><section class="timer-panel"><div class="timer-info"><span class="eyebrow">${timer.full ? `PARCOURS COMPLET · ÉTAPE ${active + 1} / 4` : 'ENTRAÎNEMENT PAR ÉPREUVE'}</span><h2>${h(phase.title)}</h2><p>${h(phase.description)}</p><span class="timer-note">Le minuteur continue si tu changes d’onglet. Pause manuelle disponible.</span></div><div class="timer-control"><strong id="timer-readout" class="timer-readout" aria-live="off">${formatTime(timer.remaining)}</strong><div>${button(`${icon(timer.running ? 'pause' : 'play', 16)} ${timer.running ? 'Pause' : timer.remaining === 0 ? 'Relancer' : 'Démarrer'}`, 'timer-toggle')}${button(icon('reset', 18), 'timer-reset', 'secondary icon-button', 'aria-label="Réinitialiser le minuteur"')}</div></div></section><div class="exam-actions">${button('Parcours complet · 2 h 15', 'exam-full', 'secondary')}${timer.full && active < 3 ? button(`Épreuve suivante ${icon('arrow', 16)}`, 'exam-next', 'primary') : ''}${phase.id === 'technique' ? button('Ouvrir les questions techniques', 'exam-questions', 'primary', 'data-kind="technique"') : phase.id === 'final' ? button('Ouvrir les questions du DP', 'exam-questions', 'primary', 'data-kind="final"') : phase.id === 'written' ? button('Ouvrir un questionnaire 2 FR + 2 EN', 'exam-written', 'primary') : ''}</div>${phase.id === 'presentation' ? `<div class="section-heading"><h2>Ton fil conducteur de 40 minutes</h2><span>DÉCOUPAGE PÉDAGOGIQUE À ADAPTER</span></div><div class="presentation-plan">${presentationPlan.map((p, i) => `<section class="presentation-step panel"><div class="step-number">${String(i + 1).padStart(2, '0')}</div><div><div class="step-head"><h3>${h(p.title)}</h3><span class="outline-pill">${p.minutes} min</span></div><p>${h(p.objective)}</p><ul>${p.prompts.map(x => `<li>${h(x)}</li>`).join('')}</ul><div class="evidence-note">${icon('source', 15)} ${h(p.evidence)}</div><label class="rehearsal-check"><input type="checkbox" data-presentation="${i}" ${state.completedPresentation.includes(String(i)) ? 'checked' : ''}> J’ai répété cette partie à voix haute</label></div></section>`).join('')}</div>` : `<section class="panel exam-method"><span class="eyebrow">TON REPÈRE POUR CETTE ÉPREUVE</span><h2>${phase.id === 'technique' ? 'Décris le chemin d’une requête.' : phase.id === 'written' ? 'Le document contient les indices.' : 'Relie ton expérience aux compétences.'}</h2><p>${phase.id === 'technique' ? 'Pars d’un exemple réel : interface, route, validation, règles métier, accès aux données, réponse. Justifie tes choix et nomme un risque, un test et une amélioration.' : phase.id === 'written' ? 'Lis d’abord les quatre questions. Identifie les passages utiles du support. En anglais, vise des phrases courtes et compréhensibles. Garde quelques minutes pour relire.' : 'Distingue ton travail personnel et celui du groupe. Utilise les exemples du dossier professionnel : Oddit, OQuiz, jeu météo et IACrea. Donne un fait observé, puis ce qu’il t’a appris.'}</p></section>`}<section class="project-reminders"><div class="section-heading"><h2>Les repères de tes dossiers</h2><a href="#sources">Ouvrir mes documents ${icon('arrow', 15)}</a></div><div class="facts-grid">${projectFacts.map(f => `<article class="fact"><h3>${h(f.title)}</h3><p>${h(f.body)}</p><span class="small muted">${h(f.source)}</span></article>`).join('')}</div></section><p class="source-note">Format d’examen : RE CDA fourni, millésime 2023, et consignes O’clock transmises. Les sujets et ce découpage de présentation sont des outils d’entraînement.</p>`;
}

function settings() {
  return `${pageHead('UN RITUEL QUI TE RESSEMBLE', 'Ton rythme. <span class="serif">Tes réglages.</span>', 'Choisis un objectif réaliste et garde une copie de ta progression.')}<div class="settings-grid"><section class="panel"><h2>Mon objectif quotidien</h2><label class="field-label" for="exam-date">Date de ma soutenance</label><input id="exam-date" type="date" value="${h(state.settings.examDate)}"><p class="small muted">Facultatif. Le compte à rebours apparaît dans le menu.</p><label class="field-label" for="daily-cards">Cartes par session</label><select id="daily-cards">${[5, 10, 15, 20, 30, 50].map(n => `<option value="${n}" ${state.settings.dailyCards === n ? 'selected' : ''}>${n} cartes</option>`).join('')}</select><label class="field-label" for="daily-questions">Questions orales par jour</label><select id="daily-questions">${[1, 2, 3, 5, 10].map(n => `<option value="${n}" ${state.settings.dailyQuestions === n ? 'selected' : ''}>${n} question${n > 1 ? 's' : ''}</option>`).join('')}</select><p class="save-hint">Les réglages s’enregistrent automatiquement.</p></section><section class="panel"><h2>Mes sauvegardes</h2><p>Cartes, notes, réponses et activités sont enregistrées dans ce navigateur, pour cette adresse locale. Une sauvegarde permet de les conserver si tu changes de navigateur ou effaces ses données.</p>${button(`${icon('download', 17)} Exporter ma progression (.json)`, 'backup-export', 'primary full')}${recoveryRaw ? button('Télécharger la sauvegarde brute à récupérer', 'recovery-export', 'secondary full') : ''}<label class="btn secondary full import-label">Importer une sauvegarde<input id="backup-import" type="file" accept=".json,application/json"></label><p class="small muted">L’import remplace la progression actuelle après validation. Un export de l’état actuel est téléchargé automatiquement avant remplacement.</p><hr><h3>Utiliser mes cartes dans Anki</h3><p class="small">Exporte le fichier TSV puis importe-le dans Anki : séparateur tabulation, champs Recto / Verso / Tags, HTML activé. Le planning de révision d’Anki est indépendant de celui du site.</p>${button(`${icon('download', 17)} Exporter les ${flashcards.length} cartes`, 'anki-export', 'secondary full')}</section><section class="panel"><h2>Comment les cartes reviennent</h2><ul class="spaced-list"><li><strong>À revoir</strong> : rappel dans la session, puis échéance dans 10 minutes.</li><li><strong>Difficile</strong> : intervalle court, au moins un jour.</li><li><strong>Bien</strong> : 1 jour, puis 3 jours ; l’intervalle augmente avec tes réussites.</li><li><strong>Facile</strong> : première révision dans 4 jours, puis un espacement plus long.</li></ul><p class="small muted">Les minuteurs et sessions de travail restent ouverts tant que cette page n’est pas rechargée. Les réponses, notes et résultats sont sauvegardés. Les cartes dues passent avant les nouvelles. Les indicateurs décrivent ta pratique et tes autoévaluations ; ils ne prédisent pas le résultat de l’examen.</p></section><section class="panel"><h2>Une routine simple</h2><ol class="spaced-list"><li>Lire une fiche pour comprendre la notion et tenter l’exercice.</li><li>Réviser les cartes de cette technologie sans lire la réponse.</li><li>Répondre à deux questions du jury à partir de tes dossiers.</li><li>Ajouter un exercice d’anglais quand tu as dix minutes.</li></ol><p>Une ou deux fois par semaine, répète ta présentation avec le minuteur. Termine en notant le point à améliorer.</p></section></div>`;
}
function sources() {
  return `${pageHead('LE SOCLE DE TES RÉVISIONS', 'Les notions. <span class="serif">Leurs références.</span>', 'Des références primaires pour apprendre, un référentiel et des dossiers pour préparer l’examen.')}<div class="document-grid">${[
    ['Référentiel CDA · REAC + RE', 'Les 11 compétences, leurs critères et les modalités de l’examen. Millésime 2023.', '/documents/referentiel.txt', 'book'],
    ['Dossier projet · GamerChallenge', 'Ta présentation de la conception, des réalisations, des tests et des limites.', '/documents/dossier-projet.pdf', 'source'],
    ['Dossier professionnel · version corrigée', 'Jeu météo, Oddit, OQuiz et IACrea. Les passages à compléter restent à préparer.', '/documents/dossier-professionnel.pdf', 'book'],
    ['Relecture avant soutenance', 'Les points à vérifier et les résultats de contrôles conservés.', '/documents/relecture.txt', 'check'],
  ].map(([title, description, url, symbol]) => `<a class="document-card panel" href="${url}" target="_blank" rel="noopener">${icon(symbol, 25)}<h3>${title}</h3><p>${description}</p><span>Ouvrir le document ${icon('source', 15)}</span></a>`).join('')}</div><section class="panel sources-info"><h2>Ce que tu travailles ici</h2><p>Les fiches et les cartes enseignent les notions avec des exemples autonomes, à partir des documentations officielles et des références primaires citées. Merise utilise aussi des références académiques ; UML utilise la spécification OMG. Les exercices et leurs corrections sont créés pour pratiquer. Les dossiers personnels alimentent la préparation du jury et la soutenance blanche.</p><p>Le questionnaire professionnel du RE fourni prévoit deux questions fermées à choix unique en français et deux questions ouvertes en anglais. Le site reprend cette distinction.</p><h3>Documents de travail utilisés</h3><ul class="source-files">${examSources.map(s => `<li><strong>${h(s.label)}</strong><code>${h(s.path)}</code></li>`).join('')}</ul><h3>Références des notions</h3><p class="small muted">Les mêmes liens sont proposés au pied des explications et au verso des cartes. Les sources académiques et les spécifications sont identifiées.</p><div class="official-links">${[...new Map([...contentSources, ...courseSources, ...conceptQuestions.flatMap(q => q.sources)].map(source => [source.url, source])).values()].map(source => `<a href="${h(source.url)}" target="_blank" rel="noopener"><span>${h(source.label)}</span><small>${h({official:'Documentation officielle', academic:'Référence académique', standard:'Norme / spécification'}[source.kind] || 'Référence primaire')}</small> ${icon('source', 14)}</a>`).join('')}</div></section>`;
}

function setPhase(id, full = false) {
  const phase = examFormat.find(x => x.id === id); if (!phase) return;
  timer = { running: false, duration: phase.minutes * 60, remaining: phase.minutes * 60, end: 0, phase: id, full };
}
function startCards() {
  const queue = buildCardQueue(eligibleCards(), state.reviews, { limit: state.settings.dailyCards, cp: filterCp, mode: cardMode });
  session = { queue, revealed: false, graded: 0, repeats: {} }; render();
}
function gradeCard(rating) {
  if (!session?.revealed || !session.queue.length) return;
  const c = session.queue.shift(); state.reviews[c.id] = scheduleReview(state.reviews[c.id], rating);
  session.graded++; recordActivity(state, 'cards');
  // One immediate retry per forgotten card; further lapses keep the 10-minute due date.
  if (rating === 'again' && !session.repeats[c.id]) { session.queue.splice(Math.min(2, session.queue.length), 0, c); session.repeats[c.id] = true; }
  session.revealed = false;
  if (!session.queue.length) state.cardSessions++;
  save(); render();
}
function nextQuestion(random = false) {
  const list = filteredQuestions(); if (!list.length) return;
  const current = list.findIndex(q => q.id === selectedOral);
  let options = list.filter(q => q.id !== selectedOral && state.answers[`oral:${q.id}`]?.rating !== 'good');
  if (!options.length) options = list.filter(q => q.id !== selectedOral);
  selectedOral = random ? (options[Math.floor(Math.random() * options.length)] || list[0]).id : list[(current + 1) % list.length].id;
  revealedOral = false; render();
}
function shuffled(items) { const list = [...items]; for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; } return list; }
function beginWritten(ids, mode) {
  written = { ids, mode, submitted: false, remaining: 1800, end: Date.now() + 1800000, running: mode === 'session', responses: Object.fromEntries(ids.map(id => [id, mode === 'single' ? state.answers[`written:${id}`]?.text || '' : ''])), started: Date.now() };
  if (view !== 'written') go('written'); else render();
}
function download(content, filename, mime = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type: mime })); const link = document.createElement('a'); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
}
function backup() { download(JSON.stringify(state, null, 2), `cda-studio-progression-${localDay()}.json`, 'application/json'); }
function printSheets() {
  const element = document.createElement('div'); element.id = 'print-content';
  element.innerHTML = competencies.map(cp => `<article class="print-sheet"><div class="eyebrow">CDA STUDIO · BLOC ${cp.block} · CP ${cp.number}</div><h1>${h(cp.title)}</h1><p>${h(cp.summary)}</p>${cp.sections.map(s => `<section><h2>${h(s.title)}</h2><p>${h(s.body)}</p>${s.bullets?.length ? `<ul>${s.bullets.map(x => `<li>${h(x)}</li>`).join('')}</ul>` : ''}${renderCourseExamples(s, h)}${s.code ? `<pre>${h(s.code)}</pre>` : ''}${renderCourseExercise(s, h)}${renderReferences(s, h)}</section>`).join('')}<h2>Je dois savoir expliquer</h2><ul>${cp.checklist.map(x => `<li>${h(x)}</li>`).join('')}</ul><p class="source-note">${h(cp.source)}</p></article>`).join('');
  document.body.append(element); document.body.classList.add('print-active');
  const cleanup = () => { element.remove(); document.body.classList.remove('print-active'); };
  window.addEventListener('afterprint', cleanup, { once: true }); window.print();
}

document.addEventListener('click', event => {
  const target = event.target.closest('[data-action]'); if (!target || target.disabled) return;
  const action = target.dataset.action;
  if (action === 'sidebar-toggle') {
    sidebarCollapsed = !sidebarCollapsed;
    applySidebarState();
    try { localStorage.setItem(SIDEBAR_STORAGE, String(sidebarCollapsed)); }
    catch { toast('Le navigateur ne peut pas mémoriser le choix du menu.'); }
    return;
  }
  if (action === 'course-open') { selectedTechnology = target.dataset.id; query = ''; render(); window.scrollTo(0, 0); }
  if (action === 'course-section') { const section = document.getElementById(target.dataset.id); section?.scrollIntoView({ behavior: 'instant', block: 'start' }); section?.querySelector('h2')?.focus({ preventScroll: true }); }
  if (action === 'card-lesson') { const card = flashcards.find(item => item.id === target.dataset.id); if (card) { if (card.lessonTechnology || card.technology) { selectedTechnology = card.lessonTechnology || card.technology; pendingLesson = `course-section-${selectedTechnology}-${card.lessonIndex}`; go('tech'); } else { selectedSheet = card.lessonCp || card.cp; pendingLesson = `sheet-section-${selectedSheet}-${card.lessonIndex}`; go('sheets'); } } }
  if (action === 'card-resume') go('cards');
  if (action === 'course-back') { selectedTechnology = ''; render(); window.scrollTo(0, 0); }
  if (action === 'course-cards') { filterTechnology = target.dataset.id; filterCp = 'all'; cardMode = 'all'; session = null; go('cards'); }
  if (action === 'course-cp') { selectedSheet = target.dataset.id; filterTechnology = 'all'; go('sheets'); }
  if (action === 'course-complete') { const id = target.dataset.id; if (state.notes[`course-day:${id}`] !== localDay()) { state.notes[`course-day:${id}`] = localDay(); recordActivity(state, 'sheets'); save(); render(); toast('Lecture du jour enregistrée. Essaie les cartes de cette technologie.'); } }
  if (action === 'course-print') window.print();
  if (action === 'daily-start') { selectedTechnology = ''; filterTechnology = 'all'; filterCp = 'all'; go('tech'); return; }
  if (action === 'sheet-open') { selectedSheet = target.dataset.id; render(); window.scrollTo(0, 0); }
  if (action === 'sheets-back') { selectedSheet = ''; render(); }
  if (action === 'sheet-complete') { const id = target.dataset.id; if (!state.completedSheets.includes(id)) state.completedSheets.push(id); if (state.notes[`sheet-day:${id}`] !== localDay()) { state.notes[`sheet-day:${id}`] = localDay(); recordActivity(state, 'sheets'); save(); render(); toast('Lecture du jour enregistrée. Essaie de l’expliquer sans la lire.'); } }
  if (action === 'bookmark') { const id = target.dataset.id; state.bookmarks = state.bookmarks.includes(id) ? state.bookmarks.filter(x => x !== id) : [...state.bookmarks, id]; save(); render(); }
  if (action === 'sheet-cards') { filterTechnology = 'all'; filterCp = target.dataset.id; cardMode = 'all'; session = null; go('cards'); }
  if (action === 'print') printSheets();
  if (action === 'cards-start') startCards();
  if (action === 'cards-restart') { session = null; render(); }
  if (action === 'cards-stop') { session = null; render(); }
  if (action === 'card-reveal' && session?.queue.length) { session.revealed = true; render(); }
  if (action === 'card-rate') gradeCard(target.dataset.rating);
  if (action === 'card-mode') { cardMode = target.dataset.mode; session = null; render(); }
  if (action === 'cards-to-oral') { oralScope = 'notions'; filterOralTechnology = filterTechnology; filterCp = 'all'; filterKind = 'all'; query = ''; revealedOral = false; go('oral'); }
  if (action === 'anki-export') { const deck = view === 'cards' ? eligibleCards().filter(card => filterCp === 'all' || card.cp === filterCp) : flashcards; download(exportAnki(deck, competencies), `CDA-Studio-Anki${view === 'cards' && filterTechnology !== 'all' ? '-' + filterTechnology : ''}.tsv`, 'text/tab-separated-values;charset=utf-8'); toast(`${deck.length} cartes exportées. Les instructions Anki sont dans Réglages.`); }
  if (action === 'oral-scope') { oralScope = target.dataset.scope; filterKind = 'all'; selectedOral = ''; revealedOral = false; query = ''; render(); }
  if (action === 'oral-select') { selectedOral = target.dataset.id; revealedOral = false; render(); }
  if (action === 'oral-random') nextQuestion(true);
  if (action === 'oral-next') nextQuestion();
  if (action === 'oral-reveal') { revealedOral = true; render(); }
  if (action === 'oral-rate') { const id = `oral:${selectedOral}`; state.answers[id] = { text: state.answers[id]?.text || '', rating: target.dataset.rating }; if (state.notes[`oral-day:${selectedOral}`] !== localDay()) { recordActivity(state, 'questions'); state.notes[`oral-day:${selectedOral}`] = localDay(); } save(); toast(target.dataset.rating === 'good' ? 'Réponse évaluée. Passe à la question suivante.' : 'Point à retravailler enregistré.'); render(); }
  if (action === 'written-single') beginWritten([target.dataset.id], 'single');
  if (action === 'written-session' || action === 'exam-written') {
    const fr = shuffled(writtenExercises.filter(e => e.language === 'fr' && e.choices?.length)).slice(0, 2);
    const en = shuffled(writtenExercises.filter(e => e.language === 'en')).slice(0, 2);
    beginWritten([...fr, ...en].map(e => e.id), 'session');
    if (action === 'exam-written' && timer.phase === 'written') {
      if (timer.running) timer.remaining = Math.max(0, Math.ceil((timer.end - Date.now()) / 1000));
      written.remaining = timer.remaining; written.end = Date.now() + timer.remaining * 1000;
      written.started = Date.now() - (1800 - timer.remaining) * 1000;
      timer.running = false; render();
      toast('Le questionnaire reprend le temps de l’épreuve écrite. Son minuteur prend le relais.');
    }
  }
  if (action === 'written-back') { if (written?.running) toast('Le questionnaire a été fermé ; tes réponses saisies sont conservées.'); written = null; render(); }
  if (action === 'written-submit' && written && !written.submitted) {
    const unanswered = written.ids.filter(id => !written.responses[id]?.trim());
    if (unanswered.length && written.remaining > 0) { toast(`Il reste ${unanswered.length} réponse${unanswered.length > 1 ? 's' : ''} à compléter avant de comparer.`); return; }
    written.submitted = true; written.running = false;
    for (const id of written.ids) if (written.responses[id]?.trim()) recordActivity(state, 'written');
    state.writtenRuns.push({ date: new Date().toISOString(), ids: written.ids, seconds: Math.min(1800, Math.round((Date.now() - written.started) / 1000)), completed: unanswered.length === 0 });
    save(); render(); window.scrollTo(0, 0);
  }
  if (action === 'exam-phase') { setPhase(target.dataset.id); render(); }
  if (action === 'exam-full') { setPhase(examFormat[0].id, true); timer.running = true; timer.end = Date.now() + timer.remaining * 1000; render(); }
  if (action === 'exam-next') { const index = examFormat.findIndex(p => p.id === timer.phase); if (index < examFormat.length - 1) { setPhase(examFormat[index + 1].id, true); timer.running = true; timer.end = Date.now() + timer.remaining * 1000; render(); } }
  if (action === 'timer-toggle') { if (timer.running) { timer.remaining = Math.max(0, Math.ceil((timer.end - Date.now()) / 1000)); timer.running = false; } else { if (!timer.remaining) timer.remaining = timer.duration; timer.running = true; timer.end = Date.now() + timer.remaining * 1000; } render(); }
  if (action === 'timer-reset') { timer.running = false; timer.remaining = timer.duration; render(); }
  if (action === 'exam-questions') { oralScope = 'dossiers'; filterCp = 'all'; query = ''; filterKind = target.dataset.kind; revealedOral = false; go('oral'); }
  if (action === 'backup-export') { backup(); toast('Sauvegarde de ta progression téléchargée.'); }
  if (action === 'recovery-export' && recoveryRaw) download(recoveryRaw, 'cda-studio-recuperation-brute.json', 'application/json');
});

document.addEventListener('input', event => {
  const el = event.target;
  if (el.id === 'search') {
    query = el.value; const pos = el.selectionStart; render(); const next = $('#search'); next.focus(); next.setSelectionRange(pos, pos);
  }
  if (el.id === 'course-note') { state.notes[el.dataset.id] = el.value; save(); }
  if (el.id === 'sheet-note') { state.notes[el.dataset.id] = el.value; save(); }
  if (el.id === 'oral-answer') { const id = `oral:${el.dataset.id}`; state.answers[id] = { text: el.value, rating: state.answers[id]?.rating || '' }; save(); }
  if (el.dataset.written && written && !written.submitted) { written.responses[el.dataset.written] = el.value; state.answers[`written:${el.dataset.written}`] = { text: el.value, rating: '' }; save(); }
});
document.addEventListener('change', async event => {
  const el = event.target;
  if (el.id === 'oral-technology-filter') { filterOralTechnology = el.value; selectedOral = ''; revealedOral = false; render(); }
  if (el.id === 'technology-filter') { filterTechnology = el.value; session = null; render(); }
  if (el.id === 'cp-filter') { filterCp = el.value; session = null; revealedOral = false; render(); }
  if (el.id === 'kind-filter') { filterKind = el.value; revealedOral = false; render(); }
  if (el.id === 'exam-date') { state.settings.examDate = el.value; save(); render(); }
  if (el.id === 'daily-cards') { state.settings.dailyCards = Number(el.value); save(); }
  if (el.id === 'daily-questions') { state.settings.dailyQuestions = Number(el.value); save(); }
  if (el.dataset.presentation !== undefined) { const id = el.dataset.presentation; state.completedPresentation = el.checked ? [...new Set([...state.completedPresentation, id])] : state.completedPresentation.filter(x => x !== id); save(); }
  if (el.id === 'backup-import' && el.files?.[0]) {
    const file = el.files[0];
    if (file.size > 10000000) { toast('Le fichier est trop volumineux (maximum 10 Mo).'); el.value = ''; return; }
    try { const imported = sanitizeState(JSON.parse(await file.text())); backup(); state = imported; session = null; written = null; save(); render(); toast('Progression importée. L’état précédent a été exporté en sauvegarde.'); }
    catch { toast('Ce fichier n’est pas une sauvegarde CDA Studio valide. Ta progression est conservée.'); el.value = ''; }
  }
});
document.addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select') || event.repeat) return;
  if (view === 'cards' && session?.queue.length) {
    if (event.code === 'Space') { event.preventDefault(); if (!session.revealed) { session.revealed = true; render(); } }
    const rating = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' }[event.key]; if (rating && session.revealed) { event.preventDefault(); gradeCard(rating); }
  }
});
window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  view = nav.some(([key]) => key === id) || ['settings', 'sources'].includes(id) ? id : 'today';
  query = ''; filterCp = pendingNavigation?.cp || 'all'; filterKind = pendingNavigation?.kind || 'all';
  filterTechnology = pendingNavigation?.technology || 'all'; selectedSheet = pendingNavigation?.sheet || '';
  if (!pendingNavigation) { selectedTechnology = ''; if (view === 'cards') session = null; }
  pendingNavigation = null; render(); window.scrollTo(0, 0);
  if (pendingLesson) { const section = document.getElementById(pendingLesson); section?.scrollIntoView({ behavior: 'instant', block: 'start' }); section?.querySelector('h2')?.focus({ preventScroll: true }); pendingLesson = ''; }
});
timerInterval = setInterval(() => {
  if (timer.running) { timer.remaining = Math.max(0, Math.ceil((timer.end - Date.now()) / 1000)); const node = $('#timer-readout'); if (node) node.textContent = formatTime(timer.remaining); if (!timer.remaining) { timer.running = false; toast('Temps écoulé pour cette épreuve. Fais le point avant de continuer.'); if (view === 'exam') render(); } }
  if (written?.running && !written.submitted) { written.remaining = Math.max(0, Math.ceil((written.end - Date.now()) / 1000)); const node = $('#written-timer'); if (node) node.textContent = formatTime(written.remaining); if (!written.remaining) { written.running = false; toast('Les 30 minutes sont écoulées. Termine et compare tes réponses.'); if (view === 'written') render(); } }
}, 1000);
render();
