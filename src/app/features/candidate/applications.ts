import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DemoRepository } from '../../core/store';
import { TranslatePipe } from '../../core/preferences';
import { PageHeader, EmptyState } from '../../shared/ui';
@Component({
  selector: 's2w-applications',
  imports: [FormsModule, DatePipe, RouterLink, TranslatePipe, PageHeader, EmptyState],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class CandidateApplications {
  s = inject(DemoRepository);
  notes: Record<string, string> = {};
  get applications() {
    return this.s.state().applications.filter((a) => a.candidateId === this.s.user()?.entityId);
  }
  respond(id: string, response: 'Accepted' | 'Declined' | 'Reschedule requested') {
    this.s.respond(id, response, this.notes[id] ?? '');
  }
}
