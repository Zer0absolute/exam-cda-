import test from 'node:test';
import assert from 'node:assert/strict';
import { technologyTopics, courseSections, courseCards, courseSources } from '../data/courses.js';
import { competencies, flashcards } from '../data/knowledge.js';
import { conceptQuestions } from '../data/concept-questions.js';
import { oralQuestions as dossierQuestions } from '../data/exam.js';
import { defaultState, sanitizeState, scheduleReview, buildCardQueue, exportAnki } from '../lib/learning.js';

const topics = new Set(technologyTopics.map(topic => topic.id));
const cpIds = new Set(competencies.map(cp => cp.id));

test('all eleven course technologies have practical sections and their own recall cards', () => {
  assert.equal(technologyTopics.length, 11);
  assert.equal(topics.size, 11);
  for (const topic of technologyTopics) {
    assert.ok(courseSections.filter(item => item.technology === topic.id).length >= 2, `${topic.id}: missing practical content`);
    assert.ok(courseCards.filter(item => item.technology === topic.id).length >= 8, `${topic.id}: missing recall content`);
  }
  for (const item of courseSections) {
    assert.ok(topics.has(item.technology));
    assert.ok(cpIds.has(item.cp));
    assert.ok(item.section.title && item.section.body && item.section.bullets.length >= 2);
  }
  for (const card of courseCards) {
    assert.ok(topics.has(card.technology));
    assert.ok(cpIds.has(card.cp));
    assert.ok(card.question && card.answer && card.detail && card.tags.length);
  }
});

test('course content is integrated into its CDA competency and the common revision deck', () => {
  for (const item of courseSections) {
    assert.ok(competencies.find(cp => cp.id === item.cp).sections.some(section => section.title === item.section.title));
  }
  for (const card of courseCards) assert.equal(flashcards.find(item => item.id === card.id)?.technology, card.technology);
  assert.equal(flashcards.filter(card => /^cp\d+-c\d+$/.test(card.id)).length, 118, 'original card identifiers must remain intact');
  assert.equal(new Set(flashcards.map(card => card.id)).size, flashcards.length);
});

test('the JavaScript tests course teaches the documented test frameworks with code', () => {
  const content = JSON.stringify(courseSections.filter(item => item.technology === 'tests'));
  for (const tool of ['node:test', 'node:assert', 'Vitest']) assert.ok(content.includes(tool), `missing ${tool}`);
  assert.ok(courseSections.some(item => item.technology === 'tests' && item.section.code), 'a tests course needs a readable code example');
});

test('technology filtering restricts a spaced-repetition session and its Anki export to the selected topic', () => {
  for (const topic of technologyTopics) {
    const selected = flashcards.filter(card => card.technology === topic.id);
    const queue = buildCardQueue(selected, {}, { limit: 100 });
    assert.ok(queue.length >= 8);
    assert.ok(queue.every(card => card.technology === topic.id));
    const tsv = exportAnki(selected);
    assert.equal(tsv.split('\n').filter(line => line && !line.startsWith('#')).length, selected.length);
  }
});

test('adding course cards keeps existing review dates, notes and course drafts compatible with old saves', () => {
  const save = defaultState();
  save.reviews['cp8-c01'] = scheduleReview(undefined, 'good', new Date('2026-10-04T12:00:00Z'));
  save.notes.cp8 = 'Note SQL existante.';
  save.notes['course:typescript'] = 'Expliquer unknown et le narrowing.';
  save.notes['course-day:typescript'] = '2026-10-04';
  assert.deepEqual(sanitizeState(JSON.parse(JSON.stringify(save))), save);
  const queue = buildCardQueue(flashcards, save.reviews, { now: new Date('2026-10-04T13:00:00Z'), limit: flashcards.length });
  assert.ok(!queue.some(card => card.id === 'cp8-c01'));
  assert.ok(queue.some(card => card.technology === 'typescript'));
});

test('learning sources link to primary references and distinguish documentation, academia and standards', () => {
  for (const source of courseSources) {
    assert.ok(source.label);
    assert.equal(source.path, undefined, 'personal course repositories are not learning references');
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.ok(['official', 'academic', 'standard'].includes(source.kind));
  }
});

test('learning material never asks the learner to remember a personal project', () => {
  const material = JSON.stringify({ competencies, flashcards, technologyTopics, courseSources });
  assert.equal(material.match(/OQuiz|Oddit|Gamer\s*Challenges?|CollabScript|O[’']Resto|IACrea/i)?.[0], undefined, 'personal project leaked into learning material');
  assert.equal(material.match(/dans (?:ton|mon) (?:projet|dépôt)|d'après les fichiers locaux/i)?.[0], undefined, 'a personal repository is assumed');
});

test('every explanation and card carries its own primary reference', () => {
  const items = [...competencies.flatMap(cp => cp.sections), ...flashcards];
  for (const item of items) {
    const label = item.id || item.title;
    assert.ok(item.sources?.length, `${label}: missing reference`);
    for (const source of item.sources) {
      assert.ok(source.label, `${label}: unnamed source`);
      assert.equal(new URL(source.url).protocol, 'https:');
      assert.ok(['official', 'academic', 'standard'].includes(source.kind), `${label}: unclear source status`);
    }
  }
});

test('the technology lessons have practice prompts and explained corrections', () => {
  for (const { section } of courseSections) {
    assert.ok(section.exercise?.prompt && section.exercise?.answer, `${section.title}: missing practice/correction`);
  }
});

test('Merise covers the requested fundamentals as explained lessons and recall cards', () => {
  const lessons = JSON.stringify(courseSections.filter(item => item.technology === 'merise')).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const deck = JSON.stringify(courseCards.filter(item => item.technology === 'merise')).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  for (const concept of ['cardinalite', 'binaire', 'ternaire', 'mcd', 'mld', 'mpd', 'cas d\'utilisation', 'dependance fonctionnelle', '1nf', '2nf', '3nf']) {
    assert.ok(lessons.includes(concept), `missing Merise lesson: ${concept}`);
    assert.ok(deck.includes(concept), `missing Merise recall: ${concept}`);
  }
  assert.ok(lessons.includes('include') && lessons.includes('extend'), 'use-case relations need explanation');
  assert.ok(lessons.includes('cle candidate'), 'normal forms require candidate keys');
  const academic = courseSources.filter(source => /scenari|univ-paris13|rpi\.edu/.test(source.url));
  assert.ok(academic.length >= 3);
  assert.ok(academic.every(source => source.kind === 'academic'), 'academic notes must not be labelled normative documentation');
});

test('Anki preserves the primary reference on the answer side of each exported card', () => {
  const card = courseCards[0];
  const row = exportAnki([card]).trimEnd().split('\n').at(-1).split('\t');
  assert.ok(row[1].includes(card.sources[0].url));
  assert.ok(row[1].includes('Références :'));
  assert.equal(row.length, 3);
});

test('each card targets an existing explanation for its lesson link', () => {
  for (const card of flashcards) {
    assert.ok(Number.isInteger(card.lessonIndex) && card.lessonIndex >= 0, `${card.id}: missing lesson link`);
    const technology = card.lessonTechnology || card.technology;
    const sections = technology
      ? courseSections.filter(item => item.technology === technology).map(item => item.section)
      : competencies.find(cp => cp.id === (card.lessonCp || card.cp)).sections;
    assert.ok(sections[card.lessonIndex], `${card.id}: lesson does not exist`);
  }
});

test('general oral questions cover every technology independently from dossier questions', () => {
  assert.equal(new Set([...conceptQuestions, ...dossierQuestions].map(item => item.id)).size, conceptQuestions.length + dossierQuestions.length);
  assert.ok(conceptQuestions.filter(item => item.technology === 'merise').length >= 8);
  for (const topic of topics) assert.ok(conceptQuestions.some(item => item.technology === topic), `${topic}: no general oral practice`);
  const material = JSON.stringify(conceptQuestions);
  assert.equal(material.match(/OQuiz|Oddit|Gamer\s*Challenges?|CollabScript|dans (?:ton|mon) (?:projet|dépôt)/i)?.[0], undefined);
  for (const item of conceptQuestions) {
    assert.equal(item.kind, 'notion');
    assert.ok(cpIds.has(item.cp));
    for (const field of ['question', 'answer', 'followup']) assert.ok(item[field]?.trim(), `${item.id}: missing ${field}`);
    assert.ok(item.expected.length >= 2 && item.expected.every(value => value.trim()), `${item.id}: missing assessment criteria`);
    assert.ok(item.sources?.length, `${item.id}: missing references`);
    for (const source of item.sources) {
      assert.ok(source.label);
      assert.equal(new URL(source.url).protocol, 'https:');
      assert.ok(['official', 'academic', 'standard'].includes(source.kind));
    }
  }
});

test('adding general oral questions preserves drafts and ratings from both learning modes', () => {
  const save = defaultState();
  save.answers[`oral:${dossierQuestions[0].id}`] = { text: 'Ma preuve existante.', rating: 'good' };
  save.answers[`oral:${conceptQuestions[0].id}`] = { text: 'Minimum et maximum de participation.', rating: 'again' };
  assert.deepEqual(sanitizeState(JSON.parse(JSON.stringify(save))), save);
});
