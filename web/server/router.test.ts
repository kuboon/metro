import { assert, assertEquals, assertStringIncludes } from "@std/assert";

import router from "./router.tsx";

async function page(path: string): Promise<string> {
  const response = await router.fetch(new Request(`http://x${path}`));
  assertEquals(response.status, 200);
  return await response.text();
}

Deno.test("every page renders the shell and boots the runtime", async () => {
  for (const path of ["/", "/panorama", "/people"]) {
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
  const html = await page("/");
  const weekday = new Intl.DateTimeFormat("en", { weekday: "long" });
  assert(!html.includes(weekday.format(new Date())));
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
