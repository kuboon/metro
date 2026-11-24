/** Flat single-colour glyphs, drawn on a 24-unit square in `currentColor`. */

import { css, type Handle } from "@remix-run/component";

import type { IconName } from "./types.ts";

const paths: Record<IconName, string> = {
  back: "M11 4 3 12l8 8 1.6-1.6L7.3 13.2H21v-2.4H7.3l5.3-5.2z",
  calendar: "M3 4h4V2h2v2h6V2h2v2h4v17H3zm2 6v9h14v-9z",
  mail: "M2 5h20l-10 8zm0 2.6V19h20V7.6l-10 8z",
  message: "M2 3h20v14H11l-5 5v-5H2z",
  music: "M8 4 21 2v14.5a3.5 3 0 1 1-2-2.7V7l-9 1.4v10.1a3.5 3 0 1 1-2-2.7z",
  people:
    "M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8M1 21v-3q0-4 7-4t7 4v3zM16 5a3.5 3.5 0 1 1 0 7l-1-.2a6 6 0 0 0 .2-6.7zM17 21v-3q0-2.6-2-4 8-.5 8 4v3z",
  phone:
    "M6 2 2.5 5.5Q3 13 7 17t11.5 4.5L22 18l-5.5-4-2.5 2.5Q9 14 7.5 10L10 7.5z",
  photo: "M2 4h20v16H2zm2 13 5-6 4 4.5 3-3 4 4.5V6H4zM16 7h2.5v2.5H16z",
  settings:
    "M10 2h4l.5 3 2 1.1 2.8-1.2 2 3.5-2.3 1.9v2.4l2.3 1.9-2 3.5-2.8-1.2-2 1.1-.5 3h-4l-.5-3-2-1.1-2.8 1.2-2-3.5L5 13.7v-2.4L2.7 9.4l2-3.5 2.8 1.2 2-1.1zm2 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7",
  sun:
    "M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10M11 1h2v4h-2zm0 18h2v4h-2zM1 11h4v2H1zm18 0h4v2h-4zM3.5 5 5 3.5 7.8 6.3 6.3 7.8zM16.2 17.7l1.5-1.5L20.5 19 19 20.5zM3.5 19l2.8-2.8 1.5 1.5L5 20.5zM16.2 6.3 19 3.5 20.5 5l-2.8 2.8z",
};

export function Icon(handle: Handle<{ name: IconName }>) {
  return () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" mix={iconStyle}>
      <path fill="currentColor" d={paths[handle.props.name]} />
    </svg>
  );
}

const iconStyle = css({ display: "block", width: "100%", height: "100%" });
