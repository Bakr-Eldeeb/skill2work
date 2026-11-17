import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DemoRepository } from '../../core/store';
import { Preferences, TranslatePipe } from '../../core/preferences';
import { PageHeader, EmptyState } from '../../shared/ui';
@Component({
  selector: 's2w-settings',
  imports: [FormsModule, DatePipe, TranslatePipe, PageHeader, EmptyState],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  s = inject(DemoRepository);
  p = inject(Preferences);
  r = inject(Router);
  route = inject(ActivatedRoute);
  notifications = !!this.route.snapshot.data['notifications'];
  email = this.s.user()!.email;
  password = ''; // Never prefill or reveal an existing password.
  error = '';
  get notices() {
    return this.s.state().notifications.filter((n) => n.userId === this.s.user()?.id);
  }
  get demoAccounts() {
    return this.s
      .state()
      .users.filter((u) => ['uc1', 'uco1', 'uu1', 'admin'].includes(u.id))
      .map(({ role, email }) => ({ role, email }));
  }
  readAll() {
    this.s.markNotificationsRead();
  }
  reset() {
    if (confirm('Reset all demo data and sign out? This removes changes in this browser.')) {
      this.s.reset();
      this.r.navigateByUrl('/sign-in');
    }
  }
  save() {
    this.error = '';
    try {
      this.s.saveCredentials(this.email, this.password);
      this.password = '';
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
}
