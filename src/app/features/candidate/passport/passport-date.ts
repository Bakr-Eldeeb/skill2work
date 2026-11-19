import { inject, Pipe, PipeTransform } from '@angular/core';
import { Preferences } from '../../../core/preferences';
@Pipe({ name: 'passportDate', pure: false })
export class PassportDate implements PipeTransform {
  private preferences = inject(Preferences);
  private formats = new Map<string, Intl.DateTimeFormat>();
  transform(value?: string | number, time = false): string {
    if (!value) return '';
    const locale = this.preferences.language() === 'ar' ? 'ar-EG' : 'en-GB';
    const calendarDate = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
    const key = locale + time + calendarDate;
    let format = this.formats.get(key);
    if (!format) {
      format = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(calendarDate ? { timeZone: 'UTC' } : {}),
        ...(time ? ({ hour: '2-digit', minute: '2-digit' } as const) : {}),
      });
      this.formats.set(key, format);
    }
    return format.format(new Date(value));
  }
}
