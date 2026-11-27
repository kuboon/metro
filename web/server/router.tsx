/**
 * The app. `deno serve router.tsx` answers it live, and `deno task build` has `@remix-kbn/ssg` crawl
 * the same router from `entryPoints` and write each response to `web/dist`.
 */

import {
  createController,
  createRouter,
  type RouterContext,
} from "@remix-run/fetch-router";
import { render } from "@remix-run/render-middleware";
import {
  createFileTree,
  type FileServerBehavior,
  githubPages,
} from "@remix-kbn/ssg/site";

import { base } from "../client/base.ts";
import { Layout, type PageModule } from "../client/layout.tsx";
import * as CalendarPage from "../client/pages/calendar.tsx";
import * as Home from "../client/pages/index.tsx";
import * as PanoramaPage from "../client/pages/panorama.tsx";
import * as People from "../client/pages/people.tsx";
import { routes } from "../client/routes.ts";
import { assets, assetsPath } from "./assets.ts";
import { clientRuntime } from "./runtime.ts";

/** Deploy path prefix. The build strips it back off when writing, so output lands at the root. */
export { base };

/** Where the static build deploys. The build writes the file this rule would serve. */
export const fileServer: FileServerBehavior = githubPages();

/** Where the static crawl starts; every other page is linked from a tile. */
export const entryPoints: readonly string[] = ["/"];

/** Renders a page module into the shell. */
function pageAction(page: PageModule) {
  const Page = page.default;

  return (context: AppContext): Response =>
    context.render(
      <Layout
        title={page.title}
        description={page.description}
        script={clientRuntime}
      >
        <Page />
      </Layout>,
    );
}

/** The files under `client/static/`, served verbatim at their own names. */
const staticFiles = await createFileTree({
  rootDir: `${import.meta.dirname}/../client/static`,
  basePath: `${base}/static`,
  cacheControl: "public, max-age=3600",
});

const router = createRouter({ middleware: [render({ assets })] });

/** The request context the middleware produces — `context.render`, in practice. */
export type AppContext = RouterContext<typeof router>;

declare module "@remix-run/fetch-router" {
  interface RouterTypes {
    context: AppContext;
  }
}

router.map(
  routes,
  createController(routes, {
    actions: {
      home: pageAction(Home),
      calendar: pageAction(CalendarPage),
      panorama: pageAction(PanoramaPage),
      people: pageAction(People),
    },
  }),
);

router.get(`${base}/static/*path`, ({ request }) => staticFiles.fetch(request));
router.get(`${assetsPath}/*path`, ({ request }) => assets.fetch(request));

export default router;
