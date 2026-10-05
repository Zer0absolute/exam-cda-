import test from 'node:test';
import assert from 'node:assert/strict';
import {
  localDay, defaultState, scheduleReview, buildCardQueue, recordActivity,
  streak, mastery, dueCount, sanitizeState, exportAnki,
} from '../lib/learning.js';

const now = new Date('2026-10-04T12:00:00.000Z');
const cards = [
  { id: 'new', cp: 'CP1', question: 'Nouvelle ?', answer: 'Réponse' },
  { id: 'late', cp: 'CP1' },
  { id: 'recent', cp: 'CP2' },
  { id: 'future', cp: 'CP1' },
];
const review = (due, overrides = {}) => ({
  due,
  interval: 3,
  ease: 2.5,
  repetitions: 2,
  lapses: 0,
  lastReviewed: '2026-10-01T12:00:00.000Z',
  rating: 'good',
  ...overrides,
});
const reviews = {
  late: review('2026-10-02T12:00:00.000Z'),
  recent: review('2026-10-04T12:00:00.000Z'),
  future: review('2026-10-08T12:00:00.000Z'),
};

test('default states do not share mutable objects or arrays', () => {
  const first = defaultState();
  const second = defaultState();
  first.notes.cp1 = 'Une note';
  first.bookmarks.push('card1');
  assert.deepEqual(second.notes, {});
  assert.deepEqual(second.bookmarks, []);
  assert.equal(second.settings.dailyCards, 15);
});

test('localDay uses calendar fields in the current local timezone', () => {
  const date = new Date(2026, 9, 4, 0, 5);
  assert.equal(localDay(date), '2026-10-04');
  assert.equal(localDay(new Date(2026, 0, 2, 23, 59)), '2026-01-02');
  assert.throws(() => localDay(new Date('invalid')), /Date invalide/);
});

test('good reviews progress through 1, 3, then ease-multiplied days', () => {
  const first = scheduleReview(undefined, 'good', now);
  const second = scheduleReview(first, 'good', now);
  const third = scheduleReview(second, 'good', now);
  assert.equal(first.interval, 1);
  assert.equal(second.interval, 3);
  assert.equal(third.interval, 8);
  assert.equal(third.repetitions, 3);
  assert.equal(first.ease, 2.5);
  assert.equal(first.lastReviewed, now.toISOString());
});

test('again schedules ten minutes and resets successful repetition count', () => {
  const result = scheduleReview(review('2026-10-04T12:00:00Z', { lapses: 2 }), 'again', now);
  assert.equal(result.due, '2026-10-04T12:10:00.000Z');
  assert.equal(result.interval, 0);
  assert.equal(result.repetitions, 0);
  assert.equal(result.lapses, 3);
  assert.equal(result.ease, 2.3);
  assert.equal(scheduleReview(result, 'good', now).interval, 1);
});

test('hard and easy have their documented first intervals and bounded ease', () => {
  assert.equal(scheduleReview(null, 'hard', now).interval, 1);
  assert.equal(scheduleReview(null, 'easy', now).interval, 4);
  assert.equal(scheduleReview(review(now.toISOString(), { ease: 1.3 }), 'hard', now).ease, 1.3);
  assert.equal(scheduleReview(review(now.toISOString(), { ease: 5 }), 'easy', now).ease, 5);
  assert.throws(() => scheduleReview(null, 'invalid', now), /invalide/);
});

test('SRS day intervals preserve the browser-local time across DST', () => {
  const start = new Date(2026, 9, 24, 14, 15);
  const due = new Date(scheduleReview(null, 'good', start).due);
  assert.equal(due.getDate(), 25);
  assert.equal(due.getHours(), 14);
  assert.equal(due.getMinutes(), 15);
});

test('queue prioritizes overdue cards, excludes future cards and caps the result', () => {
  assert.deepEqual(buildCardQueue(cards, reviews, { now }).map((card) => card.id), ['late', 'recent', 'new']);
  assert.deepEqual(buildCardQueue(cards, reviews, { now, limit: 1 }).map((card) => card.id), ['late']);
  assert.deepEqual(buildCardQueue(cards, reviews, { now, limit: 0 }), []);
  assert.equal(dueCount(cards, reviews, now), 3);
});

test('queue competency filter supports case and numeric CP identifiers', () => {
  assert.deepEqual(buildCardQueue(cards, reviews, { now, cp: 'cp1' }).map((card) => card.id), ['late', 'new']);
  assert.deepEqual(buildCardQueue(cards, reviews, { now, cp: 2 }).map((card) => card.id), ['recent']);
  assert.deepEqual(buildCardQueue(cards, reviews, { now, cp: 'CP13' }), []);
});

test('all mode includes scheduled future cards after due and unseen cards', () => {
  assert.deepEqual(buildCardQueue(cards, reviews, { now, mode: 'all' }).map((card) => card.id), ['late', 'recent', 'new', 'future']);
  assert.equal(buildCardQueue(cards, reviews, { now, cp: 'CP1', mode: 'all' }).length, 3);
});

test('recordActivity creates all counters, mutates state, and counts only the requested type', () => {
  const state = defaultState();
  assert.equal(recordActivity(state, 'cards', now), state);
  recordActivity(state, 'cards', now);
  recordActivity(state, 'questions', now);
  assert.deepEqual(state.activity[localDay(now)], { cards: 2, questions: 1, written: 0, sheets: 0 });
  assert.throws(() => recordActivity(state, 'unknown', now), /invalide/);
});

test('streak accepts yesterday before today starts and stops at absent or empty days', () => {
  const current = new Date(2026, 9, 4, 13);
  const active = { cards: 1, questions: 0, written: 0, sheets: 0 };
  const activity = { '2026-10-03': active, '2026-10-02': active, '2026-09-30': active };
  assert.equal(streak(activity, current), 2);
  activity['2026-10-04'] = active;
  assert.equal(streak(activity, current), 3);
  activity['2026-10-02'] = { cards: 0 };
  assert.equal(streak(activity, current), 2);
  assert.equal(streak({}, current), 0);
  assert.equal(streak({ '2026-10-05': active }, current), 0);
});

test('mastery distinguishes seen cards from cards with successful intervals of three days', () => {
  const result = mastery(cards, { ...reviews, late: { ...reviews.late, repetitions: 0 } });
  assert.deepEqual(result, { total: 4, seen: 3, learned: 2, percent: 50 });
  assert.deepEqual(mastery(cards, reviews, 'CP2'), { total: 1, seen: 1, learned: 1, percent: 100 });
  assert.deepEqual(mastery([], {}), { total: 0, seen: 0, learned: 0, percent: 0 });
});

test('sanitizeState validates and independently clones a complete save', () => {
  const state = defaultState();
  state.settings.examDate = '2026-12-10';
  state.reviews = reviews;
  state.answers = { 'oral:o001': { text: 'Une réponse en français.', rating: 'good' } };
  state.notes = { cp1: 'Penser aux tests.' };
  state.bookmarks = ['new', 'new'];
  state.completedPresentation = ['Le contexte du projet'];
  state.writtenRuns = [{ date: now.toISOString(), ids: ['w1', 'w2'], seconds: 1800, completed: true }];
  recordActivity(state, 'written', now);
  const clean = sanitizeState(state);
  assert.deepEqual(clean.answers, state.answers);
  assert.deepEqual(clean.writtenRuns, state.writtenRuns);
  assert.deepEqual(clean.bookmarks, ['new']);
  clean.notes.cp1 = 'Modifiée';
  assert.equal(state.notes.cp1, 'Penser aux tests.');
});

test('sanitizeState supports missing optional fields but rejects unsupported versions', () => {
  assert.deepEqual(sanitizeState({ version: 1 }), defaultState());
  for (const input of [null, [], 'save', { version: 2 }, {}]) assert.throws(() => sanitizeState(input), /invalide/);
});

test('sanitizeState rejects malformed nested values and impossible dates', () => {
  const invalid = [
    { settings: { examDate: '2026-02-30' } },
    { settings: { dailyCards: '15' } },
    { settings: { dailyCards: -1 } },
    { reviews: { card: { ...reviews.late, due: 'yesterday' } } },
    { reviews: { card: { ...reviews.late, due: '2026-10-04T24:00:00.000Z' } } },
    { reviews: { card: { ...reviews.late, repetitions: 1.5 } } },
    { activity: { '2026-02-30': { cards: 1 } } },
    { activity: { '2026-10-04': { cards: -1 } } },
    { answers: { oral: 'plain string' } },
    { answers: { oral: { text: 'Une réponse', rating: 'easy' } } },
    { notes: { note: ['invalid'] } },
    { bookmarks: 'invalid' },
    { reviews: null },
    { activity: null },
    { writtenRuns: null },
    { writtenRuns: [{ date: now.toISOString(), ids: [], seconds: 30, completed: 'yes' }] },
  ];
  for (const bad of invalid) assert.throws(() => sanitizeState({ ...defaultState(), ...bad }), /invalide/);
});

test('sanitizeState blocks dangerous keys at every level without polluting prototypes', () => {
  const payloads = [
    '{"version":1,"notes":{"__proto__":{"polluted":true}}}',
    '{"version":1,"reviews":{"constructor":{}}}',
    '{"version":1,"unknown":{"deep":{"prototype":{}}}}',
    '{"version":1,"bookmarks":["__proto__"]}',
  ];
  for (const payload of payloads) assert.throws(() => sanitizeState(JSON.parse(payload)), /invalide/);
  assert.equal({}.polluted, undefined);
  const withAccessor = { version: 1, get notes() { throw new Error('Getter invoked'); } };
  assert.throws(() => sanitizeState(withAccessor), /propriété invalide/);
});

test('sanitizeState caps valid counters and settings without accepting non-finite numbers', () => {
  const clean = sanitizeState({ ...defaultState(), settings: { dailyCards: 10_000, dailyQuestions: 500 }, cardSessions: 9_000_000 });
  assert.equal(clean.settings.dailyCards, 100);
  assert.equal(clean.settings.dailyQuestions, 20);
  assert.equal(clean.cardSessions, 1_000_000);
  assert.throws(() => sanitizeState({ ...defaultState(), cardSessions: Infinity }), /invalide/);
});

test('Anki export is HTML escaped and always has exactly three physical TSV fields', () => {
  const result = exportAnki([{ id: 'x', cp: 'CP1', question: 'A < B\tC\nD', answer: '"X" & Y', detail: 'suite\r\n<script>', tags: ['test tag', 'FR\nEN'] }]);
  const lines = result.trimEnd().split('\n');
  assert.deepEqual(lines.slice(0, 3), ['#separator:Tab', '#html:true', '#columns:Recto\tVerso\tTags']);
  assert.equal(lines.length, 4);
  assert.equal(lines[3].split('\t').length, 3);
  assert.match(lines[3], /A &lt; B&#9;C<br>D/);
  assert.match(lines[3], /&quot;X&quot; &amp; Y<br><br>suite<br>&lt;script&gt;/);
  assert.match(lines[3], /CDA::CP1/);
  assert.match(lines[3], /test_tag FR_EN/);
});
