import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { technologyTopics, courseSections, courseCards, courseSources } from '../data/courses.js';
import { competencies, flashcards } from '../data/knowledge.js';
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

test('the JavaScript tests course uses the frameworks actually present in the local exercises', () => {
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

test('course source paths stay local and official source links use HTTPS', () => {
  for (const source of courseSources) {
    assert.ok(source.label);
    assert.ok(source.path || source.url);
    if (source.path) {
      assert.ok(!path.isAbsolute(source.path));
      assert.ok(!source.path.split(/[\\/]/).includes('..'));
    }
    if (source.url) assert.equal(new URL(source.url).protocol, 'https:');
  }
});
