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

/** One square of the month view: a day, the number of the month that starts next, or nothing. */
export type CalendarCell =
  | { day: Date; month?: undefined }
  | { month: Date; day?: undefined }
  | undefined;

/** A row of seven cells, and the month it counts as for the header. */
export type CalendarRow = { cells: CalendarCell[]; month: Date };

/**
 * Consecutive months as one stream of rows.
 *
 * Each month opens with a square holding its number, right after the previous month's last day,
 * then six empty squares, then its 1st. Seven squares is a whole week, so every day still falls in
 * its own weekday's column.
 */
export function calendarRows(months: Date[], weekStart: number): CalendarRow[] {
  const rows: CalendarRow[] = [];
  const column = (date: Date) => (date.getDay() - weekStart + 7) % 7;
  let cells: CalendarCell[] = [];
  const push = (cell: CalendarCell) => {
    cells.push(cell);
    if (cells.length < 7) return;
    rows.push({ cells, month: rowMonth(cells) });
    cells = [];
  };

  if (months.length > 0) {
    // The number sits a week ahead of the 1st, so in the 1st's own column, one row up.
    const lead = column(months[0]);
    for (let i = 0; i < lead; i++) cells.push(undefined);
  }
  for (const month of months) {
    push({ month });
    for (let i = 0; i < 6; i++) push(undefined);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    for (let d = 1; d <= last.getDate(); d++) {
      push({ day: new Date(month.getFullYear(), month.getMonth(), d) });
    }
  }
  if (cells.length > 0) {
    while (cells.length < 7) cells.push(undefined);
    rows.push({ cells, month: rowMonth(cells) });
  }
  return rows;
}

/** The month a row belongs to: its first day's, or the one its number square opens. */
function rowMonth(cells: CalendarCell[]): Date {
  const day = cells.find((cell) => cell?.day)?.day;
  if (day) return new Date(day.getFullYear(), day.getMonth(), 1);
  return cells.find((cell) => cell?.month)!.month!;
}

/** The ISO 8601 week number of the week holding `date`. */
export function isoWeek(date: Date): number {
  // The ISO week belongs to the year of its Thursday.
  const thursday = addDays(date, 3 - ((date.getDay() + 6) % 7));
  const jan1 = new Date(thursday.getFullYear(), 0, 1);
  const days = Math.round((thursday.getTime() - jan1.getTime()) / 86_400_000);
  return 1 + Math.floor(days / 7);
}
