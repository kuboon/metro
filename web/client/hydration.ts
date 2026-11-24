/**
 * The client runtime, started once per document.
 *
 * `run()` walks the document for the hydration markers the renderer emitted and hydrates each one,
 * importing the module the server named for it. `assets.ts` resolved that name to a real URL during
 * render, so this hook is the whole of it.
 *
 * `run()` also takes over same-origin navigation, which is what makes a plain `<a href>` a soft
 * navigation. Two kinds are handed back to the browser first — see `navigation-guard.ts`.
 */

import { run } from "@remix-run/component";

import { guardBrowserNavigations } from "./navigation-guard.ts";

guardBrowserNavigations();

const app = run({
  loadModule: async (moduleUrl, exportName) => {
    const module = await import(moduleUrl) as Record<string, unknown>;
    const picked = module[exportName];
    if (typeof picked !== "function") {
      throw new Error(
        `Module "${moduleUrl}" has no function export "${exportName}".`,
      );
    }
    return picked;
  },
});

app.addEventListener("error", (event) => {
  console.error((event as Event & { error?: unknown }).error);
});

await app.ready();

// Browser checks wait on this before they click anything.
(globalThis as unknown as { __rmxReady?: boolean }).__rmxReady = true;
