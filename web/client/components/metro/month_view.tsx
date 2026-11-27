import { clientEntry, css, type Handle, ref } from "@remix-run/component";

import { color, grid, weight } from "../../tokens.ts";
import {
  dayKey,
  eventsByDay,
  isoWeek,
  monthWeeks,
  weekdayNames,
} from "./_lib/calendar.ts";
import { watchToday } from "./_lib/today.ts";
import type { CalendarEvent } from "./_lib/types.ts";

export type MonthViewProps = {
  events?: CalendarEvent[];
  locale?: string;
  /** The first column: 0 is Sunday, 1 Monday. */
  weekStart?: number;
};

/** Months loaded on each side of today at first, and added whenever the reader nears an end. */
const SPAN = 6;
/** How close to an end, in pixels, before more months are added. */
const EDGE = 1200;

/**
 * Months as one endless vertical scroll of weeks.
 *
 * Every week is a row as tall as its busiest day: events stack under the date as chips. A month
 * starts on a fresh row in the column of its 1st, after a blank row's worth of space, so a week
 * that straddles two months shows up twice, half in each. The month at the top of the screen
 * names itself in a header that stays put.
 *
 * Like `CalendarTile`, it learns the date in the browser: the HTML holds the weekday headings and
 * nothing else, never the month the site happened to be built in.
 */
export const MonthView = clientEntry(
  import.meta.url,
  function MonthView(handle: Handle<MonthViewProps>) {
    let today: Date | undefined;
    /** The loaded range, as month offsets from the month `today` was first read in. */
    let first = -SPAN;
    let last = SPAN;
    let origin: Date | undefined;
    /** The month the header names: the one at the top of the screen. */
    let current: Date | undefined;
    let scroller: HTMLElement | undefined;
    let header: HTMLElement | undefined;
    let growing = false;

    const monthAt = (offset: number) =>
      new Date(origin!.getFullYear(), origin!.getMonth() + offset, 1);

    /** Which month block the header is over. */
    const track = () => {
      if (!scroller || !header || !origin) return;
      const line = scroller.getBoundingClientRect().top + header.offsetHeight;
      let found: string | undefined;
      for (
        const block of scroller.querySelectorAll<HTMLElement>("[data-month]")
      ) {
        if (block.getBoundingClientRect().top > line + 1) break;
        found = block.dataset.month;
      }
      if (found === undefined) return;
      const [y, m] = found.split("-").map(Number);
      if (
        !current || current.getFullYear() !== y ||
        current.getMonth() !== m - 1
      ) {
        current = new Date(y, m - 1, 1);
        handle.update();
      }
    };

    /** Loads more months when the reader is near either end. */
    const grow = () => {
      if (!scroller || growing) return;
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      if (scrollHeight - scrollTop - clientHeight < EDGE) {
        last += SPAN;
        handle.update();
      } else if (scrollTop < EDGE) {
        // Rows added above push everything down; move the scroll by as much so nothing jumps.
        growing = true;
        const before = scrollHeight;
        first -= SPAN;
        handle.update();
        handle.queueTask(() => {
          if (scroller) scroller.scrollTop += scroller.scrollHeight - before;
          growing = false;
        });
      }
    };

    watchToday(handle, (now) => {
      const firstRead = origin === undefined;
      today = now;
      if (firstRead) {
        origin = new Date(now.getFullYear(), now.getMonth(), 1);
        current = origin;
      }
      handle.update();
      if (!firstRead) return;
      handle.queueTask(() => {
        const row = scroller?.querySelector<HTMLElement>("[data-today]");
        row?.scrollIntoView({ block: "start" });
        scroller?.addEventListener("scroll", () => {
          track();
          grow();
        }, { passive: true, signal: handle.signal });
      });
    });

    return () => {
      const { events = [], locale = "en", weekStart = 1 } = handle.props;
      const byDay = today ? eventsByDay(events, today) : new Map();
      const todayKey = today && dayKey(today);
      const months = origin
        ? Array.from({ length: last - first + 1 }, (_, i) => monthAt(first + i))
        : [];
      const longMonth = new Intl.DateTimeFormat(locale, { month: "long" });
      const longMonthYear = new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      });
      const shortMonth = new Intl.DateTimeFormat(locale, { month: "short" });
      const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
      const thisYear = today?.getFullYear();
      const name = (month: Date, format: Intl.DateTimeFormat) =>
        (month.getFullYear() === thisYear ? format : longMonthYear)
          .format(month);

      return (
        <div
          mix={[scrollStyle, ref<HTMLElement>((node) => scroller = node)]}
        >
          <div
            mix={[headerStyle, ref<HTMLElement>((node) => header = node)]}
          >
            <h2 mix={titleStyle} aria-live="polite">
              {current ? name(current, longMonth) : " "}
            </h2>
            <div mix={weekdaysStyle} aria-hidden="true">
              {weekdayNames(locale, weekStart, "narrow").map((day, i) => (
                <span key={i} mix={weekdayStyle}>{day}</span>
              ))}
            </div>
          </div>

          {months.map((month) => {
            const weeks = monthWeeks(
              month.getFullYear(),
              month.getMonth(),
              weekStart,
            );
            const startCol = weeks[0].findIndex(Boolean);
            const id = `${month.getFullYear()}-${month.getMonth() + 1}`;
            return (
              <section key={id} data-month={id} mix={monthStyle}>
                <h3
                  mix={monthLabelStyle}
                  // Over the 1st; late in the week it hangs left from there, so it never runs off.
                  style={startCol < 4
                    ? { gridColumn: `${startCol + 1} / -1` }
                    : {
                      gridColumn: `1 / ${startCol + 2}`,
                      justifySelf: "end",
                    }}
                >
                  {name(month, shortMonth)}
                </h3>
                {weeks.map((week) => {
                  const from = week.findIndex(Boolean);
                  const to = week.findLastIndex(Boolean);
                  const days = week.filter(Boolean) as Date[];
                  const number = isoWeek(days[0]);
                  const hasToday = days.some((d) => dayKey(d) === todayKey);
                  return (
                    <div
                      key={dayKey(days[0])}
                      mix={weekStyle}
                      data-today={hasToday ? "" : undefined}
                    >
                      <span
                        mix={weekNumberStyle}
                        data-current={hasToday ? "" : undefined}
                        style={from === 0
                          ? { gridColumn: "1", justifySelf: "start" }
                          : { gridColumn: String(from), justifySelf: "end" }}
                        aria-hidden="true"
                      >
                        {number}
                      </span>
                      <span
                        mix={ruleStyle}
                        data-indent={from === 0 ? "" : undefined}
                        style={{ gridColumn: `${from + 1} / ${to + 2}` }}
                      />
                      {week.map((day, col) => {
                        if (!day) return null;
                        const key = dayKey(day);
                        const list: CalendarEvent[] = byDay.get(key) ?? [];
                        const weekend = (col + weekStart) % 7 === 0 ||
                          (col + weekStart) % 7 === 6;
                        return (
                          <div
                            key={key}
                            mix={dayStyle}
                            style={{ gridColumn: String(col + 1) }}
                          >
                            <time
                              dateTime={key}
                              aria-label={fullDate.format(day)}
                              aria-current={key === todayKey
                                ? "date"
                                : undefined}
                              data-weekend={weekend ? "" : undefined}
                              mix={dateStyle}
                            >
                              {day.getDate()}
                            </time>
                            {list.length === 0 ? null : (
                              <ul mix={chipsStyle}>
                                {list.map((event) => (
                                  <li
                                    key={`${event.time} ${event.title}`}
                                    title={[
                                      event.time,
                                      event.title,
                                      event.where,
                                    ]
                                      .filter(Boolean).join(" · ")}
                                    mix={chipStyle}
                                    style={event.color === undefined
                                      ? undefined
                                      : { "--chip": event.color }}
                                  >
                                    {event.title}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      );
    };
  },
);

const columns = "repeat(7, minmax(0, 1fr))";

const scrollStyle = css({
  height: "100%",
  overflowY: "auto",
  overscrollBehaviorY: "contain",
  scrollbarWidth: "none",
  paddingInline: `calc(${grid.pad} / 2)`,
  paddingBottom: "40vh",
});

const headerStyle = css({
  position: "sticky",
  top: 0,
  zIndex: 1,
  marginInline: `calc(${grid.pad} / -2)`,
  paddingInline: `calc(${grid.pad} / 2)`,
  background: color.bg,
});

const titleStyle = css({
  paddingInline: `calc(${grid.pad} / 2)`,
  fontSize: "2.4rem",
  fontWeight: weight.thin,
  lineHeight: 1.15,
  textTransform: "lowercase",
  minHeight: "1.2em",
});

const weekdaysStyle = css({
  display: "grid",
  gridTemplateColumns: columns,
  paddingBlock: "0.2rem 0.3rem",
});

const weekdayStyle = css({
  textAlign: "center",
  fontSize: "0.85rem",
  color: color.muted,
  textTransform: "lowercase",
});

/** A month opens with a blank row's worth of space, then its short name over the 1st. */
const monthStyle = css({
  display: "grid",
  gridTemplateColumns: columns,
  paddingTop: "4.5rem",
});

const monthLabelStyle = css({
  whiteSpace: "nowrap",
  paddingInline: "0.25rem",
  fontSize: "1.8rem",
  fontWeight: weight.light,
  textTransform: "lowercase",
  color: color.accent,
});

/** One week. Its height is its busiest day's. */
const weekStyle = css({
  gridColumn: "1 / -1",
  display: "grid",
  gridTemplateColumns: columns,
  gridTemplateRows: "auto auto",
  minHeight: "6.5rem",
  alignContent: "start",
  scrollMarginTop: "6rem",
});

const weekNumberStyle = css({
  gridRow: "1",
  alignSelf: "center",
  paddingInline: "0.25rem",
  fontSize: "0.8rem",
  color: color.muted,
  "&[data-current]": { color: color.accent },
});

const ruleStyle = css({
  gridRow: "1",
  alignSelf: "center",
  height: "1px",
  background: `color-mix(in srgb, ${color.fg} 25%, transparent)`,
  // The number shares the first cell when the week starts in the first column.
  "&[data-indent]": { marginLeft: "2rem" },
});

const dayStyle = css({
  gridRow: "2",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "0.35rem",
  paddingBottom: "0.75rem",
});

/** The date sits on a square face; today's is the accent tile. */
const dateStyle = css({
  display: "flex",
  alignItems: "flex-end",
  aspectRatio: "1",
  marginInline: "2px",
  marginTop: "0.35rem",
  padding: "0.15rem 0.3rem",
  fontSize: "1.5rem",
  fontWeight: weight.light,
  lineHeight: 1,
  "&[data-weekend]": { color: color.muted },
  '&[aria-current="date"]': { background: color.accent, color: color.onAccent },
});

const chipsStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  paddingInline: "2px",
});

/** An event is a small flat tile: its calendar's colour, or the accent. Square, like every tile. */
const chipStyle = css({
  "--chip": color.accent,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "clip",
  padding: "0.2rem 0.3rem",
  fontSize: "0.78rem",
  fontWeight: weight.normal,
  color: color.onAccent,
  background: "var(--chip)",
});
