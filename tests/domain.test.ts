import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seed } from '../src/app/core/seed';
import { match, overall, eligible, recommended, jobErrors } from '../src/app/core/matching';
import { fixtureScore, questions } from '../src/app/core/assessment';
test('deterministic coherent seed counts and demo accounts', () => {
  const d = seed();
  assert.equal(d.candidates.length, 50);
  assert.equal(d.companies.length, 10);
  assert.equal(d.universities.length, 3);
  assert.deepEqual(seed(), d);
  for (const j of d.jobs) assert.deepEqual(jobErrors(j.skills), []);
});
test('match, missing evidence, zero result, overall and track change', () => {
  const d = seed(),
    c = d.candidates[0],
    j = d.jobs[0];
  assert.equal(match(c, j), 59.9);
  assert.equal(overall(c, d.trackWeights), 57.7);
  assert.equal(match({ ...c, skills: [] }, j), null);
  assert.equal(match({ ...c, skills: [{ name: 'Angular', score: 0 }] }, j), 0);
  assert.equal(match({ ...c, skills: [{ name: 'Angular' }] }, j), null);
  assert.equal(match({ ...c, skills: [{ name: 'angular', score: 100 }] }, j), 50);
  assert.equal(overall({ ...c, skills: [{ name: 'Unrelated', score: 99 }] }, d.trackWeights), null);
  assert.equal(overall({ ...c, track: 'Backend Development' }, d.trackWeights), 70.9);
});
test('eligibility requires every must-have assessed and individually passed', () => {
  const d = seed(),
    j = d.jobs[0],
    c = d.candidates[0];
  assert.equal(eligible(c, j), false);
  const good = {
    ...c,
    skills: [
      { name: 'Angular', score: 65 },
      { name: 'TypeScript', score: 60 },
    ],
  };
  assert.equal(eligible(good, j), true);
  assert.equal(eligible({ ...good, skills: [{ name: 'Angular', score: 100 }] }, j), false);
  assert.equal(
    eligible(
      {
        ...good,
        skills: [
          { name: 'Angular', score: 64 },
          { name: 'TypeScript', score: 100 },
        ],
      },
      j,
    ),
    false,
  );
  assert.equal(eligible(good, { ...j, skills: [] }), false);
});
test('recommendations sort match, nice-to-have count, overall, stable ID', () => {
  const d = seed(),
    base = d.candidates[0],
    j = {
      ...d.jobs[0],
      skills: [
        { name: 'Angular', weight: 100, must: true, minimum: 60 },
        { name: 'Communication', weight: 0, must: false, minimum: 0 },
      ],
    };
  const make = (id: string, nice: boolean, score = 70, sql = 50) => ({
    ...base,
    id,
    track: 'Backend Development',
    skills: [
      { name: 'Angular', score },
      { name: 'SQL', score: sql },
      ...(nice ? [{ name: 'Communication', score: 0 }] : []),
    ],
  });
  const a = make('a', false),
    b = make('b', true),
    c = make('c', true, 70, 90),
    e = make('e', true, 70, 90),
    z = make('z', false, 90);
  assert.deepEqual(
    recommended([e, b, a, z, c], j, d.trackWeights).map((c) => c.id),
    ['z', 'c', 'e', 'b', 'a'],
  );
});
test('publish validation under/over, duplicates, blank skills, thresholds and must-have', () => {
  const s = seed().jobs[0].skills;
  assert.equal(jobErrors(s).length, 0);
  for (const invalid of [
    s.map((x) => ({ ...x, weight: 1 })),
    s.map((x) => ({ ...x, weight: 100 })),
    s.map((x) => ({ ...x, must: false })),
    s.map((x) => ({ ...x, name: 'Angular' })),
    s.map((x) => ({ ...x, name: '' })),
    s.map((x) => ({ ...x, minimum: 101 })),
    s.map((x) => ({ ...x, weight: -1 })),
    [],
  ])
    assert.ok(jobErrors(invalid).length);
});
test('question counts, full coverage and deterministic MCQ rounding', () => {
  for (const [level, count] of [
    ['Easy', 4],
    ['Medium', 6],
    ['Hard', 8],
  ] as const) {
    const qs = questions(['Angular', 'SQL'], level);
    assert.equal(qs.length, count * 2);
    for (const skill of ['Angular', 'SQL']) {
      const subset = qs.filter((q) => q.skill === skill);
      assert.equal(subset.filter((q) => q.type === 'mcq').length, Math.round(0.3 * count));
      assert.equal(subset.length, count);
    }
    assert.ok(qs.every((q) => !('answer' in q) && !('rubric' in q)));
  }
  assert.equal(fixtureScore('Angular'), fixtureScore('Angular'));
});

test('decimal weights are validated in hundredths, not binary floating point', () => {
  const skill = (name: string, weight: number) => ({ name, weight, must: true, minimum: 50 });
  assert.deepEqual(
    jobErrors([skill('Angular', 33.33), skill('SQL', 33.33), skill('TypeScript', 33.34)]),
    [],
  );
  assert.ok(
    jobErrors([skill('Angular', 33.333), skill('SQL', 33.333), skill('TypeScript', 33.334)]).length,
  );
  assert.ok(
    jobErrors([skill('Angular', 33.33), skill('SQL', 33.33), skill('TypeScript', 33.33)]).length,
  );
});
