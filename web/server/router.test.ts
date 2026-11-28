import { assert, assertEquals, assertStringIncludes } from "@std/assert";

import router from "./router.tsx";

async function page(path: string): Promise<string> {
  const response = await router.fetch(new Request(`http://x${path}`));
  assertEquals(response.status, 200);
  return await response.text();
}

Deno.test("every page renders the shell and boots the runtime", async () => {
  for (const path of ["/", "/calendar", "/panorama", "/people"]) {
    const html = await page(path);
    assertStringIncludes(html, "<!DOCTYPE html>");
    assertStringIncludes(html, '<script type="module" src="/assets/hydration');
  }
});

Deno.test("the Start screen places every kind of tile as a client entry", async () => {
  const html = await page("/");
  const entries = JSON.parse(
    html.match(/id="rmx-data">(.*?)<\/script>/s)![1],
  ) as { h: Record<string, { exportName: string }> };
  const names = new Set(Object.values(entries.h).map((e) => e.exportName));
  for (
    const name of [
      "Tile",
      "FlipTile",
      "PhotoTile",
      "CalendarTile",
      "PivotHeader",
      "AccentPicker",
    ]
  ) {
    assert(names.has(name), `${name} is not hydrated`);
  }
});

Deno.test("the calendar does not bake the build date into the page", async () => {
  const weekday = new Intl.DateTimeFormat("en", { weekday: "long" });
  const month = new Intl.DateTimeFormat("en", { month: "long" });
  for (const path of ["/", "/calendar"]) {
    const html = (await page(path)).toLowerCase();
    assert(!html.includes(weekday.format(new Date()).toLowerCase()), path);
    assert(!html.includes(month.format(new Date()).toLowerCase()), path);
  }
});

Deno.test("the calendar screen hydrates its agenda and month", async () => {
  const html = await page("/calendar");
  for (const name of ["Agenda", "MonthView", "PivotHeader"]) {
    assertStringIncludes(html, `"exportName":"${name}"`);
  }
});

Deno.test("the calendar tile opens the calendar", async () => {
  assertStringIncludes(await page("/"), 'href="/calendar"');
});

Deno.test("a fold never turns a face past edge-on", async () => {
  const html = await page("/");
  const angles = [...html.matchAll(/rotate[XY]\((-?[\d.]+)deg\)/g)]
    .map((match) => Number(match[1]));
  assert(angles.length > 0);
  for (const angle of angles) assert(Math.abs(angle) <= 90, `${angle}deg`);
  assert(!html.includes("backface-visibility"));
});

Deno.test("the phone grid is four columns derived from the viewport", async () => {
  const css = await page("/static/app.css");
  assertStringIncludes(
    css.replace(/\s+/g, " "),
    "(100vw - 2 * var(--metro-pad) - 3 * var(--metro-gap)) / 4",
  );
  assertStringIncludes(await page("/"), "repeat(4, var(--metro-unit))");
});

Deno.test("between months the stream grows by one week, so weekdays keep their columns", async () => {
  const { calendarRows } = await import(
    "../client/components/metro/_lib/calendar.ts"
  );
  const months = [
    new Date(2026, 10, 1),
    new Date(2026, 11, 1),
    new Date(2027, 0, 1),
  ];
  const rows = calendarRows(months, 1);
  for (const { cells } of rows) {
    cells.forEach((cell, col) => {
      if (cell?.day) assertEquals((cell.day.getDay() + 6) % 7, col);
    });
  }
  const flat = rows.flatMap((row) => row.cells);
  const dec = flat.findIndex((cell) => cell?.month?.getMonth() === 11);
  assertEquals(flat[dec - 1]?.day?.getDate(), 30); // right after Nov 30
  assertEquals(flat.slice(dec + 1, dec + 7), Array(6).fill(undefined));
  assertEquals(flat[dec + 7]?.day?.getDate(), 1); // then Dec 1
});
