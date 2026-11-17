import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DemoRepository } from '../../core/store';
import { TranslatePipe } from '../../core/preferences';
import { PageHeader, EmptyState } from '../../shared/ui';
import { evidence } from '../../core/matching';
@Component({
  selector: 's2w-university',
  imports: [FormsModule, RouterLink, DatePipe, TranslatePipe, PageHeader, EmptyState],
  templateUrl: './university.html',
  styleUrl: './university.css',
})
export class University {
  s = inject(DemoRepository);
  route = inject(ActivatedRoute);
  view = this.route.snapshot.data['view'] ?? 'dashboard';
  filter = '';
  get fairs() {
    return this.s.state().fairs.filter((f) => f.universityId === this.s.user()?.entityId);
  }
  get scopedFairs() {
    return this.fairs.filter((f) => !this.filter || f.id === this.filter);
  }
  get registrations() {
    return this.s
      .state()
      .registrations.filter((r) => this.scopedFairs.some((f) => f.id === r.fairId));
  }
  get applications() {
    return this.s
      .state()
      .applications.filter((a) => a.fairId && this.scopedFairs.some((f) => f.id === a.fairId));
  }
  get companyCount() {
    return new Set(this.scopedFairs.flatMap((f) => f.companies.map((c) => c.companyId))).size;
  }
  get jobs() {
    return [...new Set(this.scopedFairs.flatMap((f) => f.companies.flatMap((c) => c.jobIds)))];
  }
  fairName(id: string) {
    return this.fairs.find((f) => f.id === id)?.name;
  }
  get gaps() {
    const students = this.s
      .state()
      .candidates.filter((c) => c.universityId === this.s.user()?.entityId);
    const names = [
      ...new Set(this.jobs.flatMap((id) => this.s.job(id)?.skills.map((s) => s.name) ?? [])),
    ];
    return names
      .map((name) => ({
        name,
        count: students.filter((c) => evidence(c, name)?.score === undefined).length,
        total: students.length,
      }))
      .sort((a, b) => b.count - a.count);
  }
}
