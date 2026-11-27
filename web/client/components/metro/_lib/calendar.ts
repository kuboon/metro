/**
 * Date arithmetic for the calendar components, on local calendar days.
 *
 * A day is named by its `YYYY-MM-DD` key in local time, so two events on the same day compare equal
 * however their times were written, and a key never drifts across a time-zone boundary.
 */

import type { CalendarEvent } from "./types.ts";

/** The local `YYYY-MM-DD` of a date. */
export function dayKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${
    pad(date.getDate())
  }`;
}

/** The local midnight a `YYYY-MM-DD` key names. */
export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** `date` moved by whole days, at local midnight. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** The day an event falls on, relative to `today` when it was given as an offset. */
export function eventDay(event: CalendarEvent, today: Date): string {
  if (event.date !== undefined) return event.date;
  return dayKey(addDays(today, event.daysFromToday ?? 0));
}

/** Events by day, each day's in time order (all-day first). */
export function eventsByDay(
  events: CalendarEvent[],
  today: Date,
): Map<string, CalendarEvent[]> {
  const days = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = eventDay(event, today);
    days.set(key, [...(days.get(key) ?? []), event]);
  }
  for (const list of days.values()) {
    list.sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  }
  return days;
}

/**
 * The six weeks that show a month, as dates: from the `weekStart` on or before the 1st, so every
 * month fits and the grid never changes height.
 */
export function monthGrid(
  year: number,
  month: number,
  weekStart: number,
): Date[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() - weekStart + 7) % 7;
  return Array.from({ length: 42 }, (_, i) => addDays(first, i - lead));
}

/** Weekday names in `locale`, starting from `weekStart` (0 is Sunday). */
export function weekdayNames(
  locale: string,
  weekStart: number,
  width: "narrow" | "short" | "long" = "short",
): string[] {
  const format = new Intl.DateTimeFormat(locale, { weekday: width });
  // 2023-01-01 was a Sunday; any fixed week will do, and none of it reaches the page as a date.
  return Array.from(
    { length: 7 },
    (_, i) => format.format(new Date(2023, 0, 1 + ((weekStart + i) % 7))),
  );
}
