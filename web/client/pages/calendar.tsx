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

/** Calendars, as Metro accent colours. */
const work = "#0050ef";
const home = "#008a00";
const friends = "#d80073";
const health = "#fa6800";
const holidays = "#647687";

/** Offsets rather than dates, so the demo is never out of date. */
const events: CalendarEvent[] = [
  { daysFromToday: -12, title: "ballet class", color: home },
  { daysFromToday: -10, time: "19:00", title: "piano lesson", color: home },
  { daysFromToday: -9, title: "release planning", color: work },
  { daysFromToday: -8, time: "10:00", title: "team offsite", color: work },
  { daysFromToday: -8, title: "Ada Lovelace's birthday", color: friends },
  { daysFromToday: -8, title: "design class", color: home },
  { daysFromToday: -5, title: "ballet class", color: home },
  { daysFromToday: -3, title: "national holiday", color: holidays },
  { daysFromToday: -2, time: "18:00", title: "piano lesson", color: home },
  {
    daysFromToday: 0,
    time: "09:30",
    title: "stand-up",
    where: "room 4",
    color: work,
  },
  {
    daysFromToday: 0,
    time: "14:00",
    title: "design review",
    where: "studio",
    color: work,
  },
  {
    daysFromToday: 1,
    time: "12:30",
    title: "lunch with Grace Hopper",
    color: friends,
  },
  {
    daysFromToday: 1,
    time: "18:00",
    title: "ferry to the island",
    color: home,
  },
  { daysFromToday: 3, title: "release day", color: work },
  { daysFromToday: 3, time: "10:00", title: "dentist", color: health },
  { daysFromToday: 3, title: "ballet class", color: home },
  {
    daysFromToday: 5,
    time: "08:00",
    title: "hills with Yukihiro Matsumoto",
    where: "north station",
    color: friends,
  },
  { daysFromToday: 6, time: "19:00", title: "piano lesson", color: home },
  {
    daysFromToday: 9,
    time: "19:30",
    title: "concert",
    where: "the old hall",
    color: friends,
  },
  { daysFromToday: 10, title: "ballet class", color: home },
  { daysFromToday: 10, title: "Linus Torvalds's birthday", color: friends },
  { daysFromToday: 13, time: "18:00", title: "piano lesson", color: home },
  { daysFromToday: 16, time: "10:00", title: "check-up", color: health },
  { daysFromToday: 17, title: "ballet class", color: home },
  { daysFromToday: 24, title: "year-end party", color: work },
  { daysFromToday: 28, title: "holiday", color: holidays },
  { daysFromToday: 29, title: "holiday", color: holidays },
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
