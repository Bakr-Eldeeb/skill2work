import { Reveal } from '../../shared/reveal';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/ui';
import { Preferences, TranslatePipe } from '../../core/preferences';
@Component({
  selector: 's2w-landing',
  imports: [Reveal, RouterLink, Logo, TranslatePipe],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  p = inject(Preferences);
  menu = false;
  l(english: string, arabic: string) {
    return this.p.language() === 'ar' ? arabic : english;
  }
  previewOpen = false;
}
