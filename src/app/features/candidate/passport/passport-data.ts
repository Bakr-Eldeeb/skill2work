import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DemoRepository } from '../../../core/store';
import { key } from '../../../core/matching';
import { nextAssessmentTime } from '../../../core/assessment';
import { AssessmentResult, Skill } from '../../../core/models';

export interface PassportSkill {
  skill: Skill;
  result?: AssessmentResult;
  date?: string;
  coolingUntil?: number;
}
export interface PassportPage {
  kind: 'holder' | 'index' | 'assessed' | 'claimed';
  entries: PassportSkill[];
}
@Injectable()
export class PassportData {
  private store = inject(DemoRepository);
  readonly holder = computed(() => this.store.candidate());
  readonly university = computed(
    () => this.store.state().universities.find((u) => u.id === this.holder().universityId)?.name,
  );
  readonly overall = computed(() => this.store.overall(this.holder()));
  readonly reference = computed(() => 'S2W-' + this.holder().id);
  readonly results = computed(() =>
    this.store.state().results.filter((r) => r.candidateId === this.holder().id),
  );
  private readonly now = signal(Date.now());
  readonly entries = computed(() => {
    const results = new Map(this.results().map((result) => [key(result.skill), result]));
    return this.holder().skills.map((skill): PassportSkill => {
      const result = results.get(key(skill.name));
      const date = skill.date ?? result?.date;
      const available = nextAssessmentTime(skill);
      return {
        skill,
        result,
        date: date && Number.isFinite(Date.parse(date)) ? date : undefined,
        coolingUntil: available > this.now() ? available : undefined,
      };
    });
  });
  readonly assessed = computed(() => this.entries().filter((e) => e.skill.score !== undefined));
  readonly claimed = computed(() => this.entries().filter((e) => e.skill.score === undefined));
  readonly earliest = computed(
    () =>
      this.assessed()
        .map((e) => e.date)
        .filter((d): d is string => !!d)
        .sort((a, b) => Date.parse(a) - Date.parse(b))[0],
  );
  readonly pages = computed(() => {
    const pages: PassportPage[] = [
      { kind: 'holder', entries: [] },
      { kind: 'index', entries: [] },
    ];
    for (const kind of ['assessed', 'claimed'] as const) {
      const records = this[kind]();
      for (let i = 0; i < records.length; i += 2)
        pages.push({ kind, entries: records.slice(i, i + 2) });
    }
    return pages;
  });
  constructor() {
    effect((cleanup) => {
      const times = this.entries().flatMap((e) => (e.coolingUntil ? [e.coolingUntil] : []));
      if (!times.length) return;
      const timer = setTimeout(
        () => this.now.set(Date.now()),
        Math.min(2147483647, Math.max(1, Math.min(...times) - Date.now() + 1)),
      );
      cleanup(() => clearTimeout(timer));
    });
  }
}
