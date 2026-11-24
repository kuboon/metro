/** Where the client runtime was compiled to, resolved once: the bundle does not change while running. */

import { assets } from "./assets.ts";
import type { ClientRuntime } from "../client/layout.tsx";

const entry = await assets.getScriptEntry("hydration.ts");

/** The `<script type="module">` a page loads, and the chunks to preload behind it. */
export const clientRuntime: ClientRuntime = {
  src: entry.href,
  preloads: entry.preloads,
};
