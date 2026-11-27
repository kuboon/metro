import { clientEntry, css, type Handle, on } from "@remix-run/component";

import { color, grid, weight } from "../../tokens.ts";
import {
  dayKey,
  eventsByDay,
  fromKey,
  monthGrid,
  weekdayNames,
} from "./_lib/calendar.ts";
import { watchToday } from "./_lib/today.ts";
import type { CalendarEvent } from "./_lib/types.ts";
import { EventRow } from "./agenda.tsx";

export type MonthViewProps = {
  events?: CalendarEvent[];
  locale?: string;
  /** The first column: 0 is Sunday, 1 Monday. */
  weekStart?: number;
};

/**
 * A month as six weeks of days. Today is the accent face, a day with events carries a mark, and
 * choosing a day lists its events under the grid.
 *
 * Like `CalendarTile`, it learns the date in the browser: the HTML holds the weekday headings and
 * an empty grid, never the month the site happened to be built in.
 */
export const MonthView = clientEntry(
  import.meta.url,
  function MonthView(handle: Handle<MonthViewProps>) {
    let today: Date | undefined;
    /** The month on screen, as its 1st. */
    let shown: Date | undefined;
    let selected: string | undefined;

    watchToday(handle, (now) => {
      const wasToday = today && dayKey(today);
      today = now;
      // Follow the date over midnight unless the reader has gone elsewhere.
      if (shown === undefined || selected === wasToday) {
        shown = new Date(now.getFullYear(), now.getMonth(), 1);
        selected = dayKey(now);
      }
      handle.update();
    });

    const go = (months: number) => {
      if (!shown) return;
      shown = new Date(shown.getFullYear(), shown.getMonth() + months, 1);
      handle.update();
    };

    const pick = (key: string) => {
      selected = key;
      const day = fromKey(key);
      if (shown && day.getMonth() !== shown.getMonth()) {
        shown = new Date(day.getFullYear(), day.getMonth(), 1);
      }
      handle.update();
    };

    return () => {
      const { events = [], locale = "en", weekStart = 1 } = handle.props;
      const byDay = today ? eventsByDay(events, today) : new Map();
      const todayKey = today && dayKey(today);
      const days = shown
        ? monthGrid(shown.getFullYear(), shown.getMonth(), weekStart)
        : [];
      const chosen = selected === undefined ? [] : byDay.get(selected) ?? [];

      return (
        <div mix={monthStyle}>
          <div mix={barStyle}>
            <h2 mix={titleStyle} aria-live="polite">
              {shown
                ? new Intl.DateTimeFormat(locale, {
                  month: "long",
                  year: "numeric",
                }).format(shown).toLowerCase()
                : " "}
            </h2>
            <button
              type="button"
              aria-label="previous month"
              mix={[stepStyle, on("click", () => go(-1))]}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="next month"
              mix={[stepStyle, on("click", () => go(1))]}
            >
              ›
            </button>
          </div>

          <div role="grid" aria-label="month" mix={gridStyle}>
            {weekdayNames(locale, weekStart, "narrow").map((name, i) => (
              <span key={`h${i}`} role="columnheader" mix={weekdayStyle}>
                {name.toLowerCase()}
              </span>
            ))}
            {days.map((day) => {
              const key = dayKey(day);
              const outside = day.getMonth() !== shown!.getMonth();
              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  aria-label={new Intl.DateTimeFormat(locale, {
                    dateStyle: "full",
                  }).format(day)}
                  aria-current={key === todayKey ? "date" : undefined}
                  aria-selected={key === selected ? "true" : "false"}
                  data-outside={outside ? "" : undefined}
                  data-busy={byDay.has(key) ? "" : undefined}
                  mix={[dayStyle, on("click", () => pick(key))]}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {selected === undefined ? null : (
            <section mix={dayListStyle}>
              <h3 mix={dayHeadingStyle}>
                {new Intl.DateTimeFormat(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).format(fromKey(selected)).toLowerCase()}
              </h3>
              {chosen.length === 0 ? <p mix={emptyStyle}>no events</p> : (
                <ul>
                  {chosen.map((event: CalendarEvent) => (
                    <EventRow
                      key={`${event.time} ${event.title}`}
                      {...event}
                    />
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      );
    };
  },
);

const monthStyle = css({
  paddingInline: grid.pad,
  paddingBlock: "0.75rem 2rem",
  maxWidth: "32rem",
});

const barStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.75rem",
});

const titleStyle = css({
  flex: 1,
  fontSize: "1.6rem",
  fontWeight: weight.light,
  minHeight: "1.35em",
});

const stepStyle = css({
  width: "2.25rem",
  height: "2.25rem",
  border: `2px solid ${color.fg}`,
  borderRadius: "50%",
  fontSize: "1.25rem",
  lineHeight: 1,
  "&:active": { background: color.fg, color: color.bg },
});

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "4px",
});

const weekdayStyle = css({
  paddingBlock: "0.25rem",
  textAlign: "center",
  fontSize: "0.85rem",
  color: color.muted,
});

const dayStyle = css({
  position: "relative",
  aspectRatio: "1",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  padding: "0.3rem 0.4rem",
  fontSize: "1.1rem",
  fontWeight: weight.light,
  outline: `2px solid transparent`,
  outlineOffset: "-2px",
  "&[data-outside]": { color: color.muted },
  '&[aria-current="date"]': {
    background: color.accent,
    color: color.onAccent,
    fontWeight: weight.normal,
  },
  '&[aria-selected="true"]': { outlineColor: color.fg },
  "&[data-busy]::after": {
    content: '""',
    position: "absolute",
    right: "0.4rem",
    bottom: "0.4rem",
    width: "0.4rem",
    height: "0.4rem",
    background: "currentColor",
  },
});

const dayListStyle = css({ marginTop: "1.5rem" });

const dayHeadingStyle = css({
  marginBottom: "0.75rem",
  fontSize: "1.25rem",
  fontWeight: weight.light,
  color: color.accent,
});

const emptyStyle = css({ color: color.muted });
