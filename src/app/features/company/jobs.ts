import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DemoRepository } from '../../core/store';
import { TranslatePipe } from '../../core/preferences';
import { Job } from '../../core/models';
import { PageHeader, EmptyState } from '../../shared/ui';
import { jobErrors, weightTotal } from '../../core/matching';
@Component({
  selector: 's2w-company-jobs',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, PageHeader, EmptyState],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css',
})
export class CompanyJobs {
  s = inject(DemoRepository);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  editing = !!this.route.snapshot.data['editor'];
  jobId = this.route.snapshot.paramMap.get('id');
  existing = this.jobId ? this.s.job(this.jobId) : undefined;
  denied = !!this.jobId && (!this.existing || this.existing.companyId !== this.s.user()?.entityId);
  error = '';
  form = this.fb.nonNullable.group({
    title: [this.existing?.title ?? '', Validators.required],
    description: [this.existing?.description ?? '', Validators.required],
    location: [this.existing?.location ?? 'Cairo', Validators.required],
    mode: [this.existing?.mode ?? 'Hybrid'],
    type: [this.existing?.type ?? 'Full-time'],
    experience: [this.existing?.experience ?? '0–2 years'],
    salary: [this.existing?.salary ?? ''],
    skills: this.fb.array(
      (this.existing?.skills ?? [{ name: '', must: true, weight: 100, minimum: 60 }]).map((s) =>
        this.skillGroup(s),
      ),
    ),
  });
  get skills() {
    return this.form.controls.skills;
  }
  get total() {
    return weightTotal(this.skills.getRawValue());
  }
  get validation() {
    return jobErrors(this.skills.getRawValue());
  }
  skillGroup(s = { name: '', must: true, weight: 0, minimum: 60 }) {
    return this.fb.nonNullable.group({
      name: [s.name],
      must: [s.must],
      weight: [s.weight],
      minimum: [s.minimum],
    });
  }
  get jobs() {
    return this.s.state().jobs.filter((j) => j.companyId === this.s.user()?.entityId);
  }
  save(publish: boolean) {
    this.error = '';
    if (this.denied) return;
    try {
      const raw = this.form.getRawValue();
      const job: Job = {
        ...raw,
        id: this.existing?.id ?? this.s.id('j'),
        companyId: this.s.user()!.entityId,
        published: publish,
      };
      this.s.saveJob(job, publish);
      this.router.navigateByUrl('/company/jobs');
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
}
