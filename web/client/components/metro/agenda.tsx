import { clientEntry, css, type Handle } from "@remix-run/component";

import { color, grid, weight } from "../../tokens.ts";
import { addDays, dayKey, eventsByDay, fromKey } from "./_lib/calendar.ts";
import { watchToday } from "./_lib/today.ts";
import type { CalendarEvent } from "./_lib/types.ts";

export type AgendaProps = {
  events?: CalendarEvent[];
  locale?: string;
  /** How many days ahead to list, today included. */
  days?: number;
};

/**
 * What is coming up, day by day, from today. Days without events are left out.
 *
 * The list is worked out in the browser, which is the only place that knows what today is.
 */
export const Agenda = clientEntry(
  import.meta.url,
  function Agenda(handle: Handle<AgendaProps>) {
    let today: Date | undefined;

    watchToday(handle, (now) => {
      today = now;
      handle.update();
    });

    return () => {
      const { events = [], locale = "en", days = 14 } = handle.props;
      if (!today) return <div mix={agendaStyle} />;

      const byDay = eventsByDay(events, today);
      const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
      const date = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      const upcoming = Array.from(
        { length: days },
        (_, i) => dayKey(addDays(today!, i)),
      ).filter((key) => byDay.has(key));

      return (
        <div mix={agendaStyle}>
          {upcoming.length === 0
            ? <p mix={emptyStyle}>nothing coming up</p>
            : upcoming.map((key, i) => {
              const offset = Math.round(
                (fromKey(key).getTime() - fromKey(dayKey(today!)).getTime()) /
                  86_400_000,
              );
              return (
                <section key={key} mix={dayStyle}>
                  <h2 mix={i === 0 ? [headingStyle, firstStyle] : headingStyle}>
                    {offset < 2
                      ? relative.format(offset, "day")
                      : date.format(fromKey(key)).toLowerCase()}
                  </h2>
                  <ul>
                    {byDay.get(key)!.map((event) => (
                      <EventRow
                        key={`${event.time} ${event.title}`}
                        {...event}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}
        </div>
      );
    };
  },
);

/** One appointment: when, what, where. */
export function EventRow(handle: Handle<CalendarEvent>) {
  return () => {
    const { time, title, where } = handle.props;
    return (
      <li mix={rowStyle}>
        <span mix={timeStyle}>{time ?? "all day"}</span>
        <span>
          <span mix={titleStyle}>{title}</span>
          {where === undefined ? null : <span mix={whereStyle}>{where}</span>}
        </span>
      </li>
    );
  };
}

const agendaStyle = css({
  paddingInline: grid.pad,
  paddingBlock: "0.75rem 2rem",
  maxWidth: "32rem",
});

const dayStyle = css({ marginBottom: "1.5rem" });

const headingStyle = css({
  marginBottom: "0.5rem",
  fontSize: "1.25rem",
  fontWeight: weight.light,
  color: color.muted,
});

const firstStyle = css({ color: color.accent });

const rowStyle = css({
  display: "grid",
  gridTemplateColumns: "4.5rem 1fr",
  gap: "0.75rem",
  paddingBlock: "0.4rem",
});

const timeStyle = css({ color: color.muted, fontSize: "0.95rem" });

const titleStyle = css({
  display: "block",
  fontSize: "1.35rem",
  fontWeight: weight.light,
  lineHeight: 1.25,
});

const whereStyle = css({
  display: "block",
  fontSize: "0.9rem",
  color: color.muted,
});

const emptyStyle = css({ color: color.muted });
