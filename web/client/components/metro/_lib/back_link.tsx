import { css, type Handle } from "@remix-run/component";

import { color } from "../../../tokens.ts";
import { Icon } from "./icons.tsx";

/** The round back arrow a screen carries when it was opened from another. */
export function BackLink(handle: Handle<{ href: string }>) {
  return () => (
    <a href={handle.props.href} aria-label="back" mix={linkStyle}>
      <Icon name="back" />
    </a>
  );
}

const linkStyle = css({
  flex: "none",
  display: "block",
  width: "2.25rem",
  height: "2.25rem",
  padding: "0.45rem",
  border: `2px solid ${color.fg}`,
  borderRadius: "50%",
  "&:active": { background: color.fg, color: color.bg },
});
