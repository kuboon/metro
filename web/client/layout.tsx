/**
 * The document shell.
 *
 * There is no header or footer: every page of this site is a whole screen. `static/app.css` comes
 * first in `<head>` because it names the cascade layers, and the boot script follows it so a saved
 * accent is in place before anything paints.
 *
 * `data-rmx-preserve-attrs` is what keeps that accent across a soft navigation: the two attributes
 * belong to the browser, and reconciling them with the next page's HTML would reset the theme.
 */

import type { Handle, RemixNode } from "@remix-run/component";

import { base, BASE_META_NAME } from "./base.ts";

/** Where the client runtime lives, and what it pulls in behind it. */
export interface ClientRuntime {
  src: string;
  /** The chunks it imports, for `<link rel="modulepreload">`. */
  preloads: readonly string[];
}

/** What every page module exports. */
export interface PageModule {
  default: (handle: Handle) => () => RemixNode;
  title: string;
  description: string;
}

export interface LayoutProps {
  title: string;
  description: string;
  script: ClientRuntime;
  children: RemixNode;
}

export function Layout(handle: Handle<LayoutProps>) {
  return () => {
    const { title, description, script, children } = handle.props;

    return (
      <html
        lang="en"
        data-theme="dark"
        data-rmx-preserve-attrs="data-theme style"
      >
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta name={BASE_META_NAME} content={base} />
          <link rel="stylesheet" href={`${base}/static/app.css`} />
          <script src={`${base}/static/theme-boot.js`}></script>
          <link
            rel="icon"
            type="image/svg+xml"
            href={`${base}/static/favicon.svg`}
          />
          {script.preloads.map((href) => (
            <link key={href} rel="modulepreload" href={href} />
          ))}
        </head>
        <body>
          {children}
          <script type="module" src={script.src}></script>
        </body>
      </html>
    );
  };
}
