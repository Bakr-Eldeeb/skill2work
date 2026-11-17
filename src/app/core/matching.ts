import { Candidate, Job, JobSkill } from './models';
export const key = (s: string) => s.trim().toLocaleLowerCase('en');
export function evidence(c: Candidate, name: string) {
  return c.skills.find((s) => key(s.name) === key(name));
}
export function match(c: Candidate, j: Job): number | null {
  if (!j.skills.some((r) => evidence(c, r.name)?.score !== undefined)) return null;
  return j.skills.reduce((n, r) => n + (r.weight * (evidence(c, r.name)?.score ?? 0)) / 100, 0);
}
export function overall(
  c: Candidate,
  weights: Record<string, Record<string, number>>,
): number | null {
  const raw = weights[c.track] ?? {};
  const w = Object.fromEntries(Object.entries(raw).map(([name, value]) => [key(name), value]));
  const included = c.skills.filter((s) => s.score !== undefined && (w[key(s.name)] ?? 0) > 0);
  const total = included.reduce((n, s) => n + w[key(s.name)], 0);
  return total ? included.reduce((n, s) => n + s.score! * w[key(s.name)], 0) / total : null;
}
export function eligible(c: Candidate, j: Job) {
  const must = j.skills.filter((s) => s.must);
  return (
    must.length > 0 &&
    must.every((r) => {
      const s = evidence(c, r.name);
      return s?.score !== undefined && s.score >= r.minimum;
    })
  );
}
export function recommended(cs: Candidate[], j: Job, w: Record<string, Record<string, number>>) {
  const nice = (c: Candidate) =>
    j.skills.filter((r) => !r.must && evidence(c, r.name)?.score !== undefined).length;
  return cs
    .filter((c) => eligible(c, j))
    .sort(
      (a, b) =>
        (match(b, j) ?? 0) - (match(a, j) ?? 0) ||
        nice(b) - nice(a) ||
        (overall(b, w) ?? 0) - (overall(a, w) ?? 0) ||
        a.id.localeCompare(b.id),
    );
}
/** Stable total in hundredths of a percentage point. */
export function weightTotal(skills: JobSkill[]): number {
  return skills.reduce((n, s) => n + Math.round(Number(s.weight) * 100), 0) / 100;
}
export function jobErrors(skills: JobSkill[]): string[] {
  const errors: string[] = [];
  // Percentages may use at most 2 decimal places. Convert to basis points
  // to avoid JS floating-point errors (e.g. 33.33 + 33.33 + 33.34).
  const values = skills.map((s) => Number(s.weight));
  const exactCents = values.every(
    (v) => Number.isFinite(v) && Math.abs(v * 100 - Math.round(v * 100)) < 1e-7,
  );
  const totalCents = values.reduce((sum, v) => sum + Math.round(v * 100), 0);
  if (!exactCents || totalCents !== 10000) errors.push('Skill weights must total exactly 100%.');
  if (!skills.some((s) => s.must)) errors.push('At least one Must-Have skill is required.');
  if (skills.some((s) => !s.name.trim())) errors.push('Every skill needs a name.');
  if (new Set(skills.map((s) => key(s.name))).size !== skills.length)
    errors.push('Duplicate skills are not allowed.');
  if (
    skills.some(
      (s) =>
        !Number.isFinite(s.weight) ||
        s.weight < 0 ||
        s.weight > 100 ||
        !Number.isFinite(s.minimum) ||
        s.minimum < 0 ||
        s.minimum > 100,
    )
  )
    errors.push('Weights and minimum scores must be between 0 and 100.');
  return errors;
}
