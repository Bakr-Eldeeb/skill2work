import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoRepository } from '../../core/store';
import { TranslatePipe } from '../../core/preferences';
import { JobCard, PageHeader, ScoreCard } from '../../shared/ui';
@Component({
  selector: 's2w-candidate-dashboard',
  imports: [RouterLink, TranslatePipe, JobCard, PageHeader, ScoreCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class CandidateDashboard {
  s = inject(DemoRepository);
  get c() {
    return this.s.candidate();
  }
  get assessed() {
    return this.c.skills.filter((s) => s.score !== undefined).length;
  }
  get jobs() {
    return this.s
      .state()
      .jobs.filter((j) => j.published)
      .sort((a, b) => (this.s.score(this.c, b) ?? -1) - (this.s.score(this.c, a) ?? -1))
      .slice(0, 4);
  }
  get applications() {
    return this.s.state().applications.filter((a) => a.candidateId === this.c.id);
  }
  get fair() {
    return this.s.state().fairs.find((f) => f.universityId === this.c.universityId);
  }
}
