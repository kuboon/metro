/**
 * The browser modules, compiled as one graph.
 *
 * Every entrypoint goes into a single code-split bundle, so a module two islands import — the Remix
 * runtime, the theme store — is emitted once and is one module at runtime rather than two copies
 * with two states. That is what lets the accent picker re-theme tiles it has never heard of.
 */

import { createAssetServer } from "@remix-kbn/assets-deno";

import { base } from "../client/base.ts";

/** The directory every entrypoint below, and every `clientEntry()` id, is resolved against. */
const clientDir = new URL("../client/", import.meta.url);

/** Where the chunks are served, and where `entryUrl()` resolves against. */
export const assetsPath = `${base}/assets`;

export const assets = await createAssetServer({
  rootDir: decodeURIComponent(clientDir.pathname),
  entrypoints: [
    // The client runtime, loaded by every page.
    "hydration.ts",
    // Every component, by where it is rather than by name.
    "components/metro/*.tsx",
  ],
  basePath: assetsPath,
  mode: "bundle",
  bundle: { sourcemap: "none" },
});
