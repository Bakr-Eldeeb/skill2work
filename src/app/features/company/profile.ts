import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemoRepository } from '../../core/store';
import { TranslatePipe } from '../../core/preferences';
import { PageHeader } from '../../shared/ui';
@Component({
  selector: 's2w-company-profile',
  imports: [ReactiveFormsModule, TranslatePipe, PageHeader],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class CompanyProfile {
  s = inject(DemoRepository);
  fb = inject(FormBuilder);
  company = this.s.company(this.s.user()!.entityId);
  form = this.fb.nonNullable.group({
    name: [this.company.name, Validators.required],
    location: [this.company.location, Validators.required],
    description: [this.company.description],
    website: [this.company.website],
  });
  error = '';
  save() {
    if (this.form.invalid) {
      this.error = 'Name and location are required.';
      return;
    }
    this.s.saveCompany({ ...this.company, ...this.form.getRawValue() });
    this.error = '';
  }
}
