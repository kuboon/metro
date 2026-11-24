/**
 * Every page, in one place. The map carries the deploy prefix, so `routes.people.href()` is right
 * under a GitHub Pages sub-path without anyone prepending anything.
 */

import { get, route } from "@remix-run/fetch-router/routes";

import { base } from "./base.ts";

export const routes = route(base, {
  home: get("/"),
  panorama: get("/panorama"),
  people: get("/people"),
});
