import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../../core/preferences';
import { PassportDate } from './passport-date';
@Component({
  selector: 's2w-passport-stamp',
  imports: [TranslatePipe, PassportDate],
  template: `<div class="seal">
    <div class="ink">
      <span class="brand">SKILL2WORK</span>
      <svg aria-hidden="true" viewBox="0 0 24 16" width="20" height="13">
        <path
          d="m3 8 6 5L21 2"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.4"
        />
      </svg>
      <b>{{ 'Assessed' | t }}</b><span class="skill" dir="auto">{{ name() }}</span>
      @if (date()) {
        <small>{{ date() | passportDate }}</small>
      }
    </div>
  </div>`,
  styles: [
    `
      :host {
        display: inline-block;
        flex: none;
      }
      .seal {
        color: var(--folio-ink, #126456);
        padding: 3px;
        border: 2px solid currentColor;
        border-radius: 46%;
        transform: rotate(-7deg);
        width: 112px;
        line-height: 1.1;
        background: repeating-linear-gradient(170deg, transparent 0 4px, #8580700c 4px 5px);
        animation: stamp-in 260ms ease-out both;
      }
      .ink {
        border: 1px dashed currentColor;
        border-radius: 45%;
        display: grid;
        align-content: center;
        justify-items: center;
        gap: 3px;
        padding: 8px 5px;
        min-height: 72px;
      }
      .brand {
        font-size: 8px;
        letter-spacing: 1.1px;
        font-weight: 800;
      }
      .ink b {
        font-size: 13px;
        text-transform: uppercase;
      }
      .ink .skill {
        font-size: 10px;
        font-weight: 800;
        line-height: 1.2;
        max-width: 100%;
        text-align: center;
        overflow-wrap: anywhere;
      }
      .ink small {
        font-size: 9px;
        min-height: 10px;
        white-space: nowrap;
      }
      .seal:dir(rtl) {
        transform: rotate(6deg);
      }
      @keyframes stamp-in {
        from {
          opacity: 0.15;
          scale: 1.06;
        }
        to {
          opacity: 1;
          scale: 1;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .seal {
          animation: none;
        }
      }
    `,
  ],
})
export class PassportStamp {
  readonly name = input.required<string>();
  readonly date = input<string>();
}
