/** Small, deterministic learning helpers shared by the local revision screens. */

const RATINGS = new Set(['again', 'hard', 'good', 'easy']);
const ACTIVITY_TYPES = ['cards', 'questions', 'written', 'sheets'];
const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const MAX_COUNTER = 1_000_000;

function validDate(value) {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Date invalide.');
  return date;
}

/** Browser-local day: UTC slicing would shift a late-night session in France. */
export function localDay(date = new Date()) {
  const current = validDate(date);
  return `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
}

export function defaultState() {
  return {
    version: 1,
    settings: { examDate: '', dailyCards: 15, dailyQuestions: 2 },
    reviews: {},
    activity: {},
    answers: {},
    notes: {},
    bookmarks: [],
    completedSheets: [],
    completedPresentation: [],
    writtenRuns: [],
    cardSessions: 0,
  };
}

function calendarDaysAfter(date, days) {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * A simple, transparent spaced-repetition rule (not Anki's FSRS algorithm):
 * again returns in 10 minutes and restarts the successful repetition count;
 * hard grows the previous interval by 20%; good starts at 1 then 3 days and
 * subsequently multiplies by ease; easy starts at 4 days and grows faster.
 * Day intervals preserve local wall-clock time across daylight-saving changes.
 */
export function scheduleReview(previous, rating, now = new Date()) {
  if (!RATINGS.has(rating)) throw new Error('Évaluation de carte invalide.');
  const current = validDate(now);
  const prior = previous ?? {};
  const previousInterval = Math.max(0, Number(prior.interval) || 0);
  const previousRepetitions = Math.max(0, Math.trunc(Number(prior.repetitions) || 0));
  let ease = Math.min(5, Math.max(1.3, Number(prior.ease) || 2.5));
  let repetitions = previousRepetitions + 1;
  let lapses = Math.max(0, Math.trunc(Number(prior.lapses) || 0));
  let interval;
  let due;

  if (rating === 'again') {
    ease = Math.max(1.3, ease - 0.2);
    repetitions = 0;
    lapses += 1;
    interval = 0;
    due = new Date(current.getTime() + 10 * 60_000);
  } else if (rating === 'hard') {
    ease = Math.max(1.3, ease - 0.15);
    interval = Math.max(1, Math.round(previousInterval * 1.2));
  } else if (rating === 'good') {
    interval = previousRepetitions === 0 ? 1 : previousRepetitions === 1 ? 3 : Math.max(1, Math.round(previousInterval * ease));
  } else {
    interval = previousRepetitions === 0 ? 4 : Math.max(4, Math.round(previousInterval * ease * 1.3));
    ease = Math.min(5, ease + 0.15);
  }

  interval = Math.min(36_500, interval);
  due ??= calendarDaysAfter(current, interval);
  return {
    due: due.toISOString(),
    interval,
    ease: Math.round(ease * 100) / 100,
    repetitions: Math.min(MAX_COUNTER, repetitions),
    lapses: Math.min(MAX_COUNTER, lapses),
    lastReviewed: current.toISOString(),
    rating,
  };
}

function competencyKey(value) {
  const normalized = String(value ?? '').trim().toUpperCase().replace(/\s+/g, '');
  return /^\d+$/.test(normalized) ? `CP${normalized}` : normalized;
}

function matchesCompetency(card, cp) {
  return cp === 'all' || competencyKey(card.cp) === competencyKey(cp);
}

/** Due reviews first, then unseen cards; optional practice includes future cards. */
export function buildCardQueue(cards, reviews, { now = new Date(), limit = 15, cp = 'all', mode = 'due' } = {}) {
  const timestamp = validDate(now).getTime();
  const size = Math.max(0, Math.trunc(Number(limit) || 0));
  return cards
    .map((card, index) => {
      const review = reviews?.[card.id];
      const due = review ? Date.parse(review.due) : null;
      const group = !review ? 1 : !Number.isFinite(due) || due <= timestamp ? 0 : 2;
      return { card, index, group, due: Number.isFinite(due) ? due : 0 };
    })
    .filter(({ card, group }) => matchesCompetency(card, cp) && (mode === 'all' || group !== 2))
    .sort((left, right) => left.group - right.group || (left.group === 1 ? left.index - right.index : left.due - right.due || left.index - right.index))
    .slice(0, size)
    .map(({ card }) => card);
}

export function dueCount(cards, reviews, now = new Date()) {
  return buildCardQueue(cards, reviews, { now, limit: cards.length }).length;
}

/** Mutates state intentionally; callers persist the updated state afterward. */
export function recordActivity(state, type, now = new Date()) {
  if (!ACTIVITY_TYPES.includes(type)) throw new Error('Type d’activité invalide.');
  state.activity ??= {};
  const day = localDay(now);
  const counters = state.activity[day] ??= { cards: 0, questions: 0, written: 0, sheets: 0 };
  for (const key of ACTIVITY_TYPES) counters[key] = Math.max(0, Number(counters[key]) || 0);
  counters[type] = Math.min(MAX_COUNTER, counters[type] + 1);
  return state;
}

function isActiveDay(counters) {
  return counters && ACTIVITY_TYPES.some((key) => Number(counters[key]) > 0);
}

/** Yesterday's streak remains visible before the first activity today. */
export function streak(activity, now = new Date()) {
  const date = validDate(now);
  date.setHours(12, 0, 0, 0);
  if (!isActiveDay(activity?.[localDay(date)])) date.setDate(date.getDate() - 1);
  let count = 0;
  while (isActiveDay(activity?.[localDay(date)])) {
    count += 1;
    date.setDate(date.getDate() - 1);
  }
  return count;
}

export function mastery(cards, reviews, cp = 'all') {
  const selected = cards.filter((card) => matchesCompetency(card, cp));
  const seen = selected.filter((card) => Boolean(reviews?.[card.id])).length;
  const learned = selected.filter((card) => {
    const review = reviews?.[card.id];
    return review && review.interval >= 3 && review.repetitions > 0;
  }).length;
  return { total: selected.length, seen, learned, percent: selected.length ? Math.round(learned / selected.length * 100) : 0 };
}

function fail(field) {
  throw new Error(`Sauvegarde invalide : ${field}.`);
}

function plainObject(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(field);
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) fail(field);
  return value;
}

// Inspect all input, including unknown fields which will subsequently be dropped.
// Accessor properties and prototype-pollution keys never enter the saved state.
function inspectInput(value, depth = 0, budget = { remaining: 100_000 }) {
  if (depth > 12 || --budget.remaining < 0) fail('structure trop volumineuse');
  if (typeof value === 'string' && value.length > 1_000_000) fail('texte trop long');
  if (value === null || typeof value !== 'object') return;
  if (!Array.isArray(value)) plainObject(value, 'objet');
  if (Array.isArray(value) && value.length > 20_000) fail('liste trop longue');
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_KEYS.has(key) || key.length > 2_000) fail('identifiant dangereux');
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !('value' in descriptor)) fail('propriété invalide');
    inspectInput(descriptor.value, depth + 1, budget);
  }
}

function textValue(value, field, maximum = 100_000) {
  if (typeof value !== 'string' || value.length > maximum) fail(field);
  return value;
}

function identifier(value, field, maximum = 200) {
  const result = textValue(value, field, maximum);
  if (!result || FORBIDDEN_KEYS.has(result) || /[\u0000-\u001f\u007f]/.test(result)) fail(field);
  return result;
}

function boundedNumber(value, field, minimum, maximum, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum || (integer && !Number.isInteger(value))) fail(field);
  return Math.min(maximum, value);
}

function dayValue(value, field) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(field);
  const parsed = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) fail(field);
  return value;
}

function isoValue(value, field) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) fail(field);
  dayValue(value.slice(0, 10), field);
  if (Number(value.slice(11, 13)) > 23 || Number(value.slice(14, 16)) > 59 || Number(value.slice(17, 19)) > 59) fail(field);
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) fail(field);
  return new Date(timestamp).toISOString();
}

function idList(value, field, maxLength = 200) {
  if (!Array.isArray(value) || value.length > 20_000) fail(field);
  return [...new Set(value.map((item) => identifier(item, field, maxLength)))];
}

function dictionary(value, field, transform) {
  plainObject(value, field);
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    identifier(key, field);
    result[key] = transform(item, key);
  }
  return result;
}

function optional(value, fallback) {
  return value === undefined ? fallback : value;
}

/** Validate and copy imported data. Missing optional v1 fields use fresh defaults. */
export function sanitizeState(input) {
  plainObject(input, 'format');
  inspectInput(input);
  if (input.version !== 1) fail('version non prise en charge');
  const state = defaultState();
  const settings = input.settings === undefined ? state.settings : plainObject(input.settings, 'réglages');
  state.settings = {
    examDate: settings.examDate === undefined || settings.examDate === '' ? '' : dayValue(settings.examDate, 'date de soutenance'),
    dailyCards: settings.dailyCards === undefined ? 15 : boundedNumber(settings.dailyCards, 'objectif de cartes', 1, 100, true),
    dailyQuestions: settings.dailyQuestions === undefined ? 2 : boundedNumber(settings.dailyQuestions, 'objectif de questions', 1, 20, true),
  };
  state.reviews = dictionary(optional(input.reviews, {}), 'révisions', (item) => {
    const review = plainObject(item, 'révision');
    if (!RATINGS.has(review.rating)) fail('évaluation');
    return {
      due: isoValue(review.due, 'prochaine révision'),
      interval: boundedNumber(review.interval, 'intervalle', 0, 36_500),
      ease: boundedNumber(review.ease, 'facilité', 1.3, 5),
      repetitions: boundedNumber(review.repetitions, 'répétitions', 0, MAX_COUNTER, true),
      lapses: boundedNumber(review.lapses, 'oublis', 0, MAX_COUNTER, true),
      lastReviewed: isoValue(review.lastReviewed, 'dernière révision'),
      rating: review.rating,
    };
  });
  state.activity = dictionary(optional(input.activity, {}), 'activité', (item, day) => {
    dayValue(day, 'jour d’activité');
    const counters = plainObject(item, 'compteurs d’activité');
    return Object.fromEntries(ACTIVITY_TYPES.map((key) => [key, counters[key] === undefined ? 0 : boundedNumber(counters[key], 'compteur d’activité', 0, MAX_COUNTER, true)]));
  });
  state.answers = dictionary(optional(input.answers, {}), 'réponses', (item) => {
    const answer = plainObject(item, 'réponse');
    if (answer.rating !== undefined && !['', 'again', 'good'].includes(answer.rating)) fail('autoévaluation de réponse');
    return { text: textValue(answer.text, 'texte de réponse'), rating: answer.rating ?? '' };
  });
  state.notes = dictionary(optional(input.notes, {}), 'notes', (item) => textValue(item, 'texte de note'));
  state.bookmarks = idList(optional(input.bookmarks, []), 'favoris');
  state.completedSheets = idList(optional(input.completedSheets, []), 'fiches terminées');
  state.completedPresentation = idList(optional(input.completedPresentation, []), 'étapes de présentation', 2_000);
  const writtenRuns = optional(input.writtenRuns, []);
  if (!Array.isArray(writtenRuns) || writtenRuns.length > 20_000) fail('entraînements écrits');
  state.writtenRuns = writtenRuns.map((item) => {
    const run = plainObject(item, 'entraînement écrit');
    if (typeof run.completed !== 'boolean') fail('état d’entraînement écrit');
    return {
      date: isoValue(run.date, 'date d’entraînement écrit'),
      ids: idList(run.ids, 'questions d’entraînement écrit'),
      seconds: boundedNumber(run.seconds, 'durée d’entraînement écrit', 0, 86_400, true),
      completed: run.completed,
    };
  });
  state.cardSessions = input.cardSessions === undefined ? 0 : boundedNumber(input.cardSessions, 'sessions de cartes', 0, MAX_COUNTER, true);
  return state;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\t/g, '&#9;')
    .replace(/\r\n|\r|\n/g, '<br>');
}

/** Anki's plain-text import format: one physical TSV line per safe HTML note. */
export function exportAnki(cards, competencies = []) {
  const rows = cards.map((card) => {
    const front = escapeHtml(card.question ?? card.front ?? '');
    const answer = escapeHtml(card.answer ?? card.back ?? '');
    const detail = card.detail ? `<br><br>${escapeHtml(card.detail)}` : '';
    const cp = competencyKey(card.cp);
    const tags = [...new Set([
      'CDA',
      cp ? `CDA::${cp}` : '',
      ...(Array.isArray(card.tags) ? card.tags : []),
    ].filter(Boolean).map((tag) => String(tag).replace(/[^\p{L}\p{N}_:\-]/gu, '_')))];
    return `${front}\t${answer}${detail}\t${tags.join(' ')}`;
  });
  return `#separator:Tab\n#html:true\n#columns:Recto\tVerso\tTags\n${rows.join('\n')}${rows.length ? '\n' : ''}`;
}
