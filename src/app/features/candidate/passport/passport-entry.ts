import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/preferences';
import { PassportSkill } from './passport-data';
import { PassportDate } from './passport-date';
import { PassportStamp } from './passport-stamp';
@Component({
  selector: 's2w-passport-entry',
  imports: [RouterLink, TranslatePipe, PassportDate, PassportStamp],
  templateUrl: './passport-entry.html',
  styleUrl: './passport-entry.css',
})
export class PassportEntry {
  readonly entry = input.required<PassportSkill>();
  readonly paper = input(false);
  readonly remove = output<string>();
}
