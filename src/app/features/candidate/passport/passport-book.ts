import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet, DecimalPipe } from '@angular/common';
import { TranslatePipe, Preferences } from '../../../core/preferences';
import { ProfileMedia } from '../../../shared/profile-media';
import { PassportCover } from './passport-cover';
import { PassportData, PassportPage } from './passport-data';
import { PassportEntry } from './passport-entry';
import { PassportDate } from './passport-date';

type Movement = 'open' | 'close' | 'forward' | 'back';
@Component({
  selector: 's2w-passport-book',
  imports: [
    NgTemplateOutlet,
    DecimalPipe,
    TranslatePipe,
    ProfileMedia,
    PassportCover,
    PassportEntry,
    PassportDate,
  ],
  templateUrl: './passport-book.html',
  styleUrl: './passport-book.css',
})
export class PassportBook {
  readonly data = inject(PassportData);
  private prefs = inject(Preferences);
  private life = inject(DestroyRef);
  private stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  readonly open = signal(false);
  readonly narrow = signal(false);
  readonly step = computed(() => (this.narrow() ? 1 : 2));
  private readonly selected = signal(0);
  readonly first = computed(
    () =>
      Math.floor(Math.min(this.selected(), this.data.pages().length - 1) / this.step()) *
      this.step(),
  );
  readonly visible = computed(() =>
    this.data.pages().slice(this.first(), this.first() + this.step()),
  );
  readonly pageLabel = computed(() => {
    const start = this.first() + 1;
    return this.visible().length === 2 ? start + '–' + (start + 1) : String(start);
  });
  readonly motion = signal<Movement | null>(null);
  readonly outgoing = signal<PassportPage | null>(null);
  readonly outgoingNumber = signal(1);
  readonly atEnd = computed(() => this.first() + this.step() >= this.data.pages().length);
  private timer?: ReturnType<typeof setTimeout>;
  constructor() {
    afterNextRender(() => {
      const el = this.stage().nativeElement;
      const update = (width: number) => {
        if (width > 0) this.narrow.set(width < 730);
      };
      update(el.clientWidth);
      const observer = new ResizeObserver((entries) => update(entries[0].contentRect.width));
      observer.observe(el);
      this.life.onDestroy(() => observer.disconnect());
    });
    this.life.onDestroy(() => clearTimeout(this.timer));
  }
  target(kind: PassportPage['kind']) {
    return this.data.pages().findIndex((p) => p.kind === kind);
  }
  read(index = 0) {
    if (this.motion() || index < 0 || index >= this.data.pages().length) return;
    const wasOpen = this.open();
    const previous = this.first();
    this.selected.set(index);
    if (wasOpen && previous === this.first()) return;
    this.open.set(true);
    const movement = wasOpen ? (this.first() > previous ? 'forward' : 'back') : 'open';
    const source =
      movement === 'forward'
        ? Math.min(previous + this.step() - 1, this.data.pages().length - 1)
        : previous;
    this.outgoingNumber.set(source + 1);
    this.outgoing.set(this.data.pages()[source]);
    this.animate(movement);
  }
  close() {
    if (this.open() && !this.motion()) this.animate('close');
  }
  turn(delta: number) {
    const next = this.first() + delta * this.step();
    if (next >= 0 && next < this.data.pages().length) this.read(next);
  }
  key(event: KeyboardEvent) {
    if (
      !this.open() ||
      event.altKey ||
      event.metaKey ||
      event.ctrlKey ||
      (event.target as HTMLElement)?.closest('details')
    )
      return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.turn((event.key === 'ArrowRight' ? 1 : -1) * (this.prefs.language() === 'ar' ? -1 : 1));
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }
  private animate(movement: Movement) {
    const finish = () => {
      if (movement === 'close') this.open.set(false);
      this.motion.set(null);
      this.outgoing.set(null);
      setTimeout(() => {
        if (this.life.destroyed) return;
        const stage = this.stage().nativeElement;
        const node = stage.querySelector<HTMLElement>(
          movement === 'close' ? '.open-button' : '.spread',
        );
        if (!node?.getClientRects().length) return;
        const active = document.activeElement;
        if (active && active !== document.body && !stage.contains(active)) return;
        if (
          movement === 'open' ||
          movement === 'close' ||
          this.narrow() ||
          active === document.body
        ) {
          node.focus({ preventScroll: true });
        }
        if (this.narrow() && node.getBoundingClientRect().top < 72) {
          node.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      }, 0);
    };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    this.motion.set(movement);
    this.timer = setTimeout(finish, 520);
  }
}
