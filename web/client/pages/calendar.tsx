import type { Handle } from "@remix-run/component";

import {
  Agenda,
  type CalendarEvent,
  MonthView,
  PivotHub,
} from "../components/metro/mod.ts";
import { routes } from "../routes.ts";

export const title = "calendar — metro";
export const description =
  "Calendar: the days ahead, and the month at a glance.";

/** Offsets rather than dates, so the demo is never out of date. */
const events: CalendarEvent[] = [
  { daysFromToday: 0, time: "09:30", title: "stand-up", where: "room 4" },
  {
    daysFromToday: 0,
    time: "14:00",
    title: "design review",
    where: "studio",
  },
  { daysFromToday: 1, time: "12:30", title: "lunch with Grace Hopper" },
  { daysFromToday: 1, time: "18:00", title: "ferry to the island" },
  { daysFromToday: 3, title: "release day" },
  {
    daysFromToday: 5,
    time: "08:00",
    title: "hills with Yukihiro Matsumoto",
    where: "north station",
  },
  { daysFromToday: 9, time: "19:30", title: "concert", where: "the old hall" },
  { daysFromToday: 16, time: "10:00", title: "dentist" },
];

export default function Calendar(_handle: Handle) {
  return () => (
    <PivotHub
      id="calendar"
      title="calendar"
      label="views"
      back={routes.home.href()}
      items={[
        {
          name: "agenda",
          heading: "agenda",
          content: <Agenda events={events} />,
        },
        {
          name: "month",
          heading: "month",
          content: <MonthView events={events} />,
        },
      ]}
    />
  );
}
