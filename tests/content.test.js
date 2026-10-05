import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { competencies, flashcards, contentSources } from '../data/knowledge.js';
import {
  oralQuestions, writtenExercises, presentationPlan, projectFacts, examFormat, examSources,
} from '../data/exam.js';
import { defaultState, sanitizeState, scheduleReview, localDay, exportAnki } from '../lib/learning.js';
import { documentRoutes } from '../lib/documents.js';

const competencyIds = new Set(competencies.map((item) => item.id));
const nonempty = (value, message) => assert.ok(typeof value === 'string' && value.trim().length > 0, message);
const normalized = (value) => value.trim().toLocaleLowerCase('fr');

test('the 11 CDA competencies retain their official numbering and 4/4/3 block distribution', () => {
  assert.equal(competencies.length, 11);
  assert.deepEqual(competencies.map((item) => item.number), Array.from({ length: 11 }, (_, index) => index + 1));
  assert.deepEqual(competencies.map((item) => item.id), Array.from({ length: 11 }, (_, index) => `cp${index + 1}`));
  assert.deepEqual(competencies.map((item) => item.block), [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3]);
  for (const competency of competencies) {
    for (const field of ['title', 'short', 'summary', 'source']) nonempty(competency[field], `${competency.id}: missing ${field}`);
    assert.ok(competency.sections.length >= 3, `${competency.id}: insufficient reference-sheet coverage`);
    assert.ok(competency.checklist.length >= 3, `${competency.id}: insufficient oral checklist`);
    for (const section of competency.sections) {
      nonempty(section.title, `${competency.id}: missing section title`);
      assert.ok(Boolean(section.body?.trim()) || Boolean(section.bullets?.length) || Boolean(section.code?.trim()), `${competency.id}: empty reference-sheet section`);
    }
  }
});

test('identifiers are globally unique and every exercise points to a real competency', () => {
  const all = [...competencies, ...flashcards, ...oralQuestions, ...writtenExercises];
  assert.equal(new Set(all.map((item) => item.id)).size, all.length);
  for (const item of all) assert.match(item.id, /^[a-z0-9][a-z0-9-]*$/, `unsafe identifier: ${item.id}`);
  for (const item of [...flashcards, ...oralQuestions, ...writtenExercises]) {
    assert.ok(competencyIds.has(item.cp), `${item.id}: unknown competency ${item.cp}`);
  }
});

test('each competency has a substantial active-recall deck with unique prompts', () => {
  for (const competency of competencies) {
    const cards = flashcards.filter((item) => item.cp === competency.id);
    assert.ok(cards.length >= 8, `${competency.id}: fewer than eight recall cards`);
    assert.equal(new Set(cards.map((item) => normalized(item.question))).size, cards.length, `${competency.id}: duplicate recall prompt`);
  }
  for (const card of flashcards) {
    nonempty(card.question, `${card.id}: empty prompt`);
    nonempty(card.answer, `${card.id}: empty answer`);
    assert.ok(Array.isArray(card.tags), `${card.id}: tags must be a list`);
    for (const tag of card.tags) nonempty(tag, `${card.id}: empty tag`);
  }
});

test('oral training covers all competencies, projects and both jury interviews', () => {
  assert.ok(oralQuestions.length >= 30, 'the training bank needs varied questions');
  for (const competency of competencies) {
    assert.ok(oralQuestions.filter((item) => item.cp === competency.id).length >= 2, `${competency.id}: missing oral variety`);
  }
  assert.equal(new Set(oralQuestions.map((item) => normalized(item.question))).size, oralQuestions.length, 'duplicate oral question');
  for (const kind of ['technique', 'projet', 'final']) assert.ok(oralQuestions.some((item) => item.kind === kind), `missing ${kind} training`);
  for (const question of oralQuestions) {
    assert.ok(['technique', 'projet', 'final'].includes(question.kind), `${question.id}: unknown oral category`);
    for (const field of ['question', 'answer', 'project', 'followup', 'source']) nonempty(question[field], `${question.id}: missing ${field}`);
    assert.ok(question.expected.length >= 2, `${question.id}: missing assessment guide`);
    for (const criterion of question.expected) nonempty(criterion, `${question.id}: empty criterion`);
  }
});

test('French QCU exercises have distinct options and exactly one valid answer index', () => {
  const qcu = writtenExercises.filter((item) => item.format === 'qcu');
  assert.ok(qcu.length >= 2, 'a timed run needs two French QCU questions');
  for (const exercise of qcu) {
    assert.equal(exercise.language, 'fr', `${exercise.id}: the exam QCU must be in French`);
    assert.ok(exercise.choices.length >= 3, `${exercise.id}: insufficient distractors`);
    assert.equal(new Set(exercise.choices.map(normalized)).size, exercise.choices.length, `${exercise.id}: duplicate QCU choices`);
    assert.ok(Number.isInteger(exercise.correctIndex) && exercise.correctIndex >= 0 && exercise.correctIndex < exercise.choices.length, `${exercise.id}: invalid answer index`);
    nonempty(exercise.explanation, `${exercise.id}: a QCU needs an explanation`);
    for (const choice of exercise.choices) nonempty(choice, `${exercise.id}: empty option`);
  }
});

test('English exercises have open responses and all written corrections contain usable criteria', () => {
  const english = writtenExercises.filter((item) => item.language === 'en');
  assert.ok(english.length >= 2, 'a timed run needs two English open questions');
  for (const exercise of writtenExercises) {
    assert.ok(['fr', 'en'].includes(exercise.language), `${exercise.id}: unsupported language`);
    for (const field of ['prompt', 'context', 'sample']) nonempty(exercise[field], `${exercise.id}: missing ${field}`);
    assert.ok(exercise.criteria.length >= 2, `${exercise.id}: missing correction criteria`);
    for (const criterion of exercise.criteria) nonempty(criterion, `${exercise.id}: empty criterion`);
    for (const entry of exercise.vocabulary || []) {
      nonempty(entry.term, `${exercise.id}: empty vocabulary term`);
      nonempty(entry.translation, `${exercise.id}: empty vocabulary translation`);
    }
    if (exercise.language === 'en') {
      assert.equal(exercise.format, 'writing', `${exercise.id}: English requires an open response`);
      assert.ok(!exercise.choices?.length, `${exercise.id}: English should not become QCU`);
      assert.ok(exercise.sample.trim().split(/\s+/).length >= 8, `${exercise.id}: missing usable English model answer`);
    }
    if (exercise.language === 'fr' && !exercise.choices?.length) {
      assert.equal(exercise.bonus, true, `${exercise.id}: French open writing must be marked as supplementary training`);
    }
  }
});

test('the timed questionnaire can select two French QCU and two English open questions without bonus writing', () => {
  const french = writtenExercises.filter((item) => item.language === 'fr' && item.choices?.length);
  const english = writtenExercises.filter((item) => item.language === 'en');
  assert.ok(french.length >= 2 && english.length >= 2);
  const run = [...french.slice(0, 2), ...english.slice(0, 2)];
  assert.equal(run.length, 4);
  assert.equal(new Set(run.map((item) => item.id)).size, 4);
  assert.ok(run.every((item) => !item.bonus));
  assert.equal(run.filter((item) => item.language === 'fr' && item.format === 'qcu').length, 2);
  assert.equal(run.filter((item) => item.language === 'en' && item.format === 'writing').length, 2);
});

test('the presentation lasts 40 minutes and the complete exam lasts 135 minutes', () => {
  assert.deepEqual(examFormat.map((item) => item.id), ['presentation', 'technique', 'written', 'final']);
  assert.deepEqual(examFormat.map((item) => item.minutes), [40, 45, 30, 20]);
  assert.equal(examFormat.reduce((sum, item) => sum + item.minutes, 0), 135);
  assert.equal(presentationPlan.reduce((sum, item) => sum + item.minutes, 0), 40);
  for (const step of presentationPlan) {
    assert.ok(Number.isInteger(step.minutes) && step.minutes > 0);
    for (const field of ['title', 'objective', 'evidence']) nonempty(step[field], `missing presentation ${field}`);
    assert.ok(step.prompts.length >= 1, `${step.title}: no speaking prompt`);
  }
});

test('project reminders remain attributed, and local source paths stay inside the workspace', () => {
  assert.ok(projectFacts.length >= 3);
  for (const fact of projectFacts) for (const field of ['title', 'body', 'source']) nonempty(fact[field], `missing project fact ${field}`);
  assert.ok(examSources.length >= 3);
  for (const source of examSources) {
    nonempty(source.label, 'missing source label');
    nonempty(source.path, 'missing source path');
    assert.ok(!path.isAbsolute(source.path) && !source.path.split(/[\\/]/).includes('..'), 'source path must stay inside the workspace');
  }
  for (const source of contentSources) {
    nonempty(source.label, 'missing official reference label');
    assert.equal(new URL(source.url).protocol, 'https:', 'official references should use HTTPS');
  }
});

test('all four whitelisted document routes have safe paths and the expected types', () => {
  assert.deepEqual(Object.keys(documentRoutes).sort(), [
    '/documents/dossier-professionnel.pdf', '/documents/dossier-projet.pdf',
    '/documents/referentiel.txt', '/documents/relecture.txt',
  ]);
  for (const [route, relative] of Object.entries(documentRoutes)) {
    assert.ok(!path.isAbsolute(relative) && !relative.split(/[\\/]/).includes('..'), `route escapes the workspace: ${route}`);
    assert.equal(path.extname(relative), path.extname(route));
  }
});

test('a JSON backup round trip preserves current UI answers, daily sheet markers and complete written runs', () => {
  const now = new Date(2026, 9, 4, 15, 20);
  const day = localDay(now);
  const state = defaultState();
  state.settings = { examDate: '2026-12-11', dailyCards: 20, dailyQuestions: 3 };
  state.reviews[flashcards[0].id] = scheduleReview(undefined, 'good', now);
  state.answers[`oral:${oralQuestions[0].id}`] = { text: 'Contexte → choix → preuve → limite.\nMes mots, <sans HTML>.', rating: 'good' };
  state.answers[`written:${writtenExercises[0].id}`] = { text: '0', rating: '' };
  const english = writtenExercises.find((item) => item.language === 'en');
  state.answers[`written:${english.id}`] = { text: 'I keep secret values on the server.\nI verify the result.', rating: '' };
  state.answers[`oral:${oralQuestions[1].id}`] = { text: 'À retravailler demain.', rating: 'again' };
  state.notes.cp1 = 'Une note avec des accents et des tabulations\tconservées.';
  state.notes[`sheet-day:cp1:${day}`] = day;
  state.activity[day] = { cards: 20, questions: 3, sheets: 1, written: 4 };
  state.bookmarks = ['cp1', 'cp9'];
  state.completedSheets = ['cp1'];
  state.completedPresentation = ['0', '9'];
  state.writtenRuns = [{ date: now.toISOString(), ids: ['w001', 'w002', 'w009', 'w010'], seconds: 1795, completed: true }];
  state.cardSessions = 2;
  const restored = sanitizeState(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored, state);
  assert.notEqual(restored.answers, state.answers, 'restored answers must be an independent copy');
  assert.notEqual(restored.writtenRuns[0], state.writtenRuns[0], 'restored runs must be an independent copy');
});

test('the complete content deck exports to Anki without changing its card count or competency tags', () => {
  const rows = exportAnki(flashcards, competencies).trimEnd().split('\n').slice(3);
  assert.equal(rows.length, flashcards.length);
  rows.forEach((row, index) => {
    const fields = row.split('\t');
    assert.equal(fields.length, 3, `${flashcards[index].id}: unsafe TSV fields`);
    assert.ok(fields[0] && fields[1], `${flashcards[index].id}: empty Anki note`);
    assert.ok(fields[2].split(' ').includes(`CDA::${flashcards[index].cp.toUpperCase()}`), `${flashcards[index].id}: missing competency tag`);
  });
});
