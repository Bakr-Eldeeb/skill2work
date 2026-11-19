import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/preferences';
@Component({
  selector: 's2w-passport-cover',
  imports: [TranslatePipe],
  template: `<div class="binding">
    <div class="frame">
      <div class="imprint"><img src="assets/skill2work-mark.svg" alt="" />SKILL2WORK</div>
      <strong class="cover-name">{{ 'Skill Passport' | t }}</strong>
      <img class="medallion" src="assets/passport-medallion.svg" alt="" />
      <span class="motto">{{ 'Prove Skills. Find Work.' | t }}</span><span
        class="cover-rule"
        aria-hidden="true"
      ></span>
    </div>
  </div>`,
  styleUrl: './passport-cover.css',
})
export class PassportCover {}
