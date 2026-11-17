import { BackButton } from './back-button';
import { BRAND } from '../core/brand';
import { Component, Input, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe, Preferences } from '../core/preferences';
import { Candidate, Job } from '../core/models';
import { DemoRepository } from '../core/store';
@Component({
  selector: 's2w-logo',
  template: `<img
    class="brand-logo"
    [src]="'assets/skill2work-logo-' + (p.dark() ? 'dark' : 'light') + '.svg'"
    [alt]="brand.name"
  />`,
})
export class Logo {
  readonly brand = BRAND;
  p = inject(Preferences);
}
@Component({
  selector: 's2w-header',
  imports: [TranslatePipe, BackButton],
  template: `<s2w-back />
    <div class="page-heading">
      <div>
        <p class="eyebrow">{{ eyebrow | t }}</p>
        <h1>{{ title | t }}</h1>
        <p class="muted">{{ subtitle | t }}</p>
      </div>
      <ng-content />
    </div>`,
})
export class PageHeader {
  @Input() title = '';
  @Input() eyebrow: string = BRAND.name;
  @Input() subtitle = '';
}
@Component({
  selector: 's2w-empty',
  imports: [TranslatePipe],
  template: `<section class="empty">
    <span class="empty-symbol">◇</span>
    <h3>{{ text | t }}</h3>
    <ng-content />
  </section>`,
})
export class EmptyState {
  @Input() text = 'No matching results.';
}
@Component({
  selector: 's2w-score',
  imports: [TranslatePipe, DecimalPipe],
  template: `<div class="score" [class.unassessed]="value === null">
      <strong>{{ value === null ? '—' : (value | number: '1.0-1') }}</strong>
      @if (value !== null) {
        <small>/100</small>
      }
    </div>
    <span class="muted"
      >{{ (value === null ? 'Not Assessed Yet' : label) | t }}
      @if (value !== null) {
        <small class="demo-inline">{{ 'Demo' | t }}</small>
      }
    </span>
    @if (value !== null && label === 'Match score') {
      <div class="match-track" aria-hidden="true"><i [style.width.%]="value"></i></div>
    }`,
})
export class ScoreCard {
  @Input() value: number | null = null;
  @Input() label = 'Match score';
}
@Component({
  selector: 's2w-job-card',
  imports: [RouterLink, TranslatePipe, ScoreCard],
  templateUrl: './job-card.html',
})
export class JobCard {
  @Input({ required: true }) job!: Job;
  @Input() candidate?: Candidate;
  @Input() fairId?: string;
  s = inject(DemoRepository);
}
