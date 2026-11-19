import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app, click, text, pause } from './app-harness.mjs';
import { seed } from '../src/app/core/seed.ts';
import { nextAssessmentTime } from '../src/app/core/assessment.ts';

function reduce(a) {
  const original = a.w.matchMedia.bind(a.w);
  a.w.matchMedia = (query) =>
    query.includes('prefers-reduced-motion') ? { matches: true } : original(query);
}
test('A scored zero has its own stamp, date and feedback; an unassessed skill gets only an assessment action', async () => {
  const state = seed();
  const candidate = state.candidates[0];
  candidate.skills = [
    { name: 'Angular', score: 0, date: '2024-12-29', summary: 'Record summary' },
    { name: 'Design Systems' },
  ];
  state.results = [
    {
      id: 'r1',
      candidateId: candidate.id,
      skill: 'Angular',
      score: 0,
      date: '2024-12-29',
      strengths: 'Actual strengths',
      weaknesses: 'Actual practice suggestion',
      explanations: ['Actual explanation'],
      simulated: true,
    },
    {
      id: 'r2',
      candidateId: 'another',
      skill: 'Angular',
      score: 99,
      date: '2024-12-30',
      strengths: 'Different candidate',
      explanations: [],
    },
  ];
  const a = await app('/candidate/passport', 'candidate', { state });
  const doc = a.w.document;
  try {
    reduce(a);
    await click(a, 'Open Passport');
    assert.equal(doc.querySelector('.moving'), null);
    assert.match(text(doc.querySelector('.holder-leaf')), /S2W-c1/);
    assert.match(text(doc.querySelector('.holder-leaf')), /29 Dec 2024/);
    assert.equal(doc.querySelector('.previous').disabled, true);
    doc.querySelector('.next').click();
    await pause();
    const [assessed, claimed] = doc.querySelectorAll('.leaf s2w-passport-entry');
    assert.match(text(assessed.querySelector('.seal')), /Angular/);
    assert.equal(text(assessed.querySelector('.number')), '0/100');
    assert.match(text(assessed), /Actual explanation/);
    assert.doesNotMatch(text(assessed), /Different candidate/);
    assert.equal(claimed.querySelector('.seal, .number'), null);
    assert.match(text(claimed), /Not Assessed Yet/);
    assert.match(claimed.querySelector('a').getAttribute('href'), /skill=Design%20Systems/);
    assert.equal(doc.querySelector('.next').disabled, true);
    await click(a, 'List View');
    assert.equal(doc.querySelectorAll('.evidence-card').length, 2);
    assert.equal(text(doc.querySelector('.evidence-card .number')), '0/100');
    assert.match(text(doc.querySelector('.evidence-list')), /Actual explanation/);
    await click(a, 'Passport View');
    assert.match(text(doc.querySelector('.page-controls')), /3–4/);
    doc.querySelector('.previous').click();
    await pause();
    await click(a, 'Close passport');
    assert.ok(doc.querySelector('.open-button'));
    assert.equal(a.errors.length, 0, a.errors.join('\n'));
  } finally {
    await a.close();
  }
});
test('Passport honors the live 24-hour reassessment boundary and separates claimed actions', async () => {
  const state = seed();
  const date = new Date(Date.now() - 86400000 + 1700).toISOString();
  state.candidates[0].skills = [{ name: 'Angular', score: 37, date }, { name: 'Sass' }];
  assert.equal(nextAssessmentTime(state.candidates[0].skills[0]), Date.parse(date) + 86400000);
  const a = await app('/candidate/skills', 'candidate', { state });
  try {
    await click(a, 'List View');
    const [scored, claimed] = a.w.document.querySelectorAll('.evidence-card');
    assert.equal(scored.querySelector('.entry-actions a'), null);
    assert.match(text(scored), /Reassessment available/);
    assert.match(text(claimed.querySelector('a')), /Assess skill/);
    await new Promise((resolve) =>
      setTimeout(resolve, Math.max(0, Date.parse(date) + 86400000 - Date.now()) + 200),
    );
    await pause();
    assert.equal(text(scored.querySelector('.entry-actions a')), 'Reassess');
  } finally {
    await a.close();
  }
});
test('Normal turn locks repeated input and hides moving copies from assistive technology', async () => {
  const a = await app('/candidate/passport', 'candidate');
  const doc = a.w.document;
  try {
    await click(a, 'Open Passport');
    const moving = doc.querySelector('.moving');
    assert.ok(moving.hasAttribute('inert'));
    assert.equal(moving.getAttribute('aria-hidden'), 'true');
    doc.querySelector('.next').click();
    await pause();
    assert.match(text(doc.querySelector('.page-controls')), /1–2/);
    await new Promise((r) => setTimeout(r, 560));
    assert.equal(doc.querySelector('.moving'), null);
    doc
      .querySelector('.spread')
      .dispatchEvent(new a.w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await pause();
    assert.match(text(doc.querySelector('.page-controls')), /3–4/);
  } finally {
    await a.close();
  }
});

test('List View opens in one click from a results deep link and both displays keep the existing record', async () => {
  const a = await app('/candidate/results', 'candidate');
  try {
    await click(a, 'List View');
    const cards = a.w.document.querySelectorAll('.evidence-card');
    assert.equal(cards.length, 4);
    assert.match(text(cards[0]), /Angular/);
    await click(a, 'Passport View');
    reduce(a);
    await click(a, 'Open Passport');
    a.w.document.querySelector('.next').click();
    await pause();
    await click(a, 'Assessment results');
    await click(a, 'Passport View');
    assert.match(text(a.w.document.querySelector('.page-controls')), /3–4/);
  } finally {
    await a.close();
  }
});
