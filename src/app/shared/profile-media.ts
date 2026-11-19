import {
  Component,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  inject,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { MediaStore } from '../core/media';
import { TranslatePipe } from '../core/preferences';
@Component({
  selector: 's2w-profile-media',
  imports: [TranslatePipe],
  styles: [
    `
      :host(.passport-portrait) {
        display: block;
        flex: none;
      }
      :host(.passport-portrait) .profile-media,
      :host(.passport-portrait) img,
      :host(.passport-portrait) .media-fallback {
        width: var(--portrait-w, 68px);
        height: var(--portrait-h, 82px);
        border-radius: var(--portrait-radius, 8px);
      }
      :host(.passport-portrait) .media-fallback {
        background:
          repeating-linear-gradient(135deg, transparent 0 6px, #ffffff0e 6px 7px),
          linear-gradient(145deg, #6d587b, #39394e);
        color: #f8eed8;
        font-size: var(--portrait-font, 25px);
        font-weight: 700;
      }
    `,
  ],
  template: `<div class="profile-media" [class.is-cover]="kind === 'cover'">
    @if (source) {
      <img [src]="source" [alt]="alt" (error)="source = ''" />
    } @else {
      <div class="media-fallback" aria-hidden="true">
        {{ kind === 'cover' ? '' : initials ? monogram : alt.slice(0, 2) }}
      </div>
    }
    @if (editable) {
      <label class="media-edit"
        >{{ (kind === 'cover' ? 'Change cover' : 'Change image') | t
        }}<input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          [attr.aria-label]="alt + ' image'"
          (change)="upload($event)"
          [disabled]="busy"
      /></label>
      @if (value) {
        <button type="button" class="quiet" (click)="changed.emit('')">
          {{ 'Remove image' | t }}
        </button>
      }
    }
    @if (error) {
      <p class="error" role="alert">{{ error | t }}</p>
    }
    @if (busy) {
      <p role="status">{{ 'Preparing image…' | t }}</p>
    }
  </div>`,
})
export class ProfileMedia implements OnChanges, OnDestroy {
  @Input() initials = false;
  get monogram() {
    const names = this.alt.trim().split(/\s+/);
    return [names[0], ...(names.length > 1 ? [names[names.length - 1]] : [])]
      .map((n) => Array.from(n)[0] || '')
      .join('')
      .toLocaleUpperCase();
  }
  @Input() value = '';
  @Input() alt = 'Profile';
  @Input() kind = 'avatar';
  @Input() editable = false;
  @Output() changed = new EventEmitter<string>();
  media = inject(MediaStore);
  private cdr = inject(ChangeDetectorRef);
  source = '';
  error = '';
  busy = false;
  version = 0;
  async ngOnChanges() {
    const n = ++this.version;
    const value = await this.media.source(this.value);
    if (n !== this.version) {
      if (value.startsWith('blob:')) URL.revokeObjectURL(value);
      return;
    }
    this.release();
    this.source = value;
    this.cdr.markForCheck();
  }
  release() {
    if (this.source.startsWith('blob:')) URL.revokeObjectURL(this.source);
  }
  ngOnDestroy() {
    this.version++;
    this.release();
  }
  async upload(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;
    this.busy = true;
    this.error = '';
    try {
      this.changed.emit(await this.media.save(f));
    } catch (e) {
      this.error = (e as Error).message;
    } finally {
      this.busy = false;
      input.value = '';
      this.cdr.markForCheck();
    }
  }
}
