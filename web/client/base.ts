/**
 * The deploy prefix, computed once — on both sides.
 *
 * Every URL the site emits carries this, and no output path does. The Pages workflow passes the
 * full public URL in `BASE_URL`; locally it is unset and the site is served from the root.
 *
 * On the server it comes from `BASE_URL`, read off `globalThis` because nothing in `client/` is
 * type-checked with `deno.ns`. In the browser there is no environment to read, so it comes from
 * the `<meta>` the shell writes.
 */

import { normalizeBase } from "@remix-kbn/ssg/base";

/** The two runtimes this runs in: one has an environment, the other has a document. */
type Host = {
  Deno?: { env: { get(key: string): string | undefined } };
  document?: {
    querySelector(
      selectors: string,
    ): { getAttribute(name: string): string | null } | null;
  };
};

/** The `<meta name>` the shell writes the prefix into, for the browser to read back. */
export const BASE_META_NAME = "rmx-base";

/** URL path prefix the site is mounted under, without a trailing slash (e.g. `''` or `/repo`). */
export const base: string = normalizeBase(
  (globalThis as Host).Deno?.env.get("BASE_URL") ??
    (globalThis as Host).document
      ?.querySelector(`meta[name="${BASE_META_NAME}"]`)
      ?.getAttribute("content"),
);
