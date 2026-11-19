import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DemoRepository } from '../../core/store';
import { Preferences, TranslatePipe } from '../../core/preferences';
import { ScoreCard, EmptyState } from '../../shared/ui';
import { key } from '../../core/matching';
import { PassportData } from './passport/passport-data';
import { PassportDate } from './passport/passport-date';
import { PassportBook } from './passport/passport-book';
import { PassportEntry } from './passport/passport-entry';
import { ProfileMedia } from '../../shared/profile-media';
import { BackButton } from '../../shared/back-button';
@Component({
  selector: 's2w-skills',
  imports: [
    FormsModule,
    DatePipe,
    RouterLink,
    TranslatePipe,
    ScoreCard,
    EmptyState,
    DecimalPipe,
    PassportBook,
    PassportEntry,
    PassportDate,
    ProfileMedia,
    BackButton,
  ],
  providers: [PassportData],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  s = inject(DemoRepository);
  route = inject(ActivatedRoute);
  router = inject(Router);
  d = inject(PassportData);
  prefs = inject(Preferences);
  mode: 'book' | 'list' = 'book';
  display(mode: 'book' | 'list') {
    this.mode = mode;
    if (this.tab === 'results') this.select('skills');
  }
  name = '';
  error = '';
  tab = 'skills';
  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((p) => {
      const value = p.get('tab') ?? this.route.snapshot.data['tab'] ?? 'skills';
      this.tab = value === 'results' ? 'results' : 'skills';
    });
  }
  get c() {
    return this.s.candidate();
  }
  get results() {
    return this.d.results();
  }
  cooldown(name: string) {
    return this.d.entries().find((e) => key(e.skill.name) === key(name))?.coolingUntil;
  }
  select(tab: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab }, replaceUrl: true });
  }
  focusAdd() {
    document.getElementById('add-skill-input')?.focus();
  }
  add() {
    this.error = '';
    try {
      this.s.addSkill(this.name);
      this.mode = 'list';
      this.name = '';
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
  remove(name: string) {
    if (confirm(this.prefs.text('Remove this skill and its visible assessment result?'))) {
      try {
        this.s.removeSkill(name);
      } catch (e) {
        this.error = (e as Error).message;
      }
    }
  }
}
