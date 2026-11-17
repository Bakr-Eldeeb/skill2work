import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemoRepository } from '../../core/store';
import { TranslatePipe } from '../../core/preferences';
import { PageHeader } from '../../shared/ui';
@Component({
  selector: 's2w-profile',
  imports: [ReactiveFormsModule, TranslatePipe, PageHeader],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class CandidateProfile {
  s = inject(DemoRepository);
  fb = inject(FormBuilder);
  c = this.s.candidate();
  error = '';
  form = this.fb.nonNullable.group({
    name: [this.c.name, Validators.required],
    location: [this.c.location, Validators.required],
    universityId: [this.c.universityId, Validators.required],
    track: [this.c.track, Validators.required],
    bio: [this.c.bio],
    education: [this.c.education],
    experience: [this.c.experience],
    projects: [this.c.projects],
  });
  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.error = 'Complete all required fields.';
      return;
    }
    try {
      this.s.saveCandidate({ ...this.s.candidate(), ...this.form.getRawValue() });
      this.error = '';
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
}
