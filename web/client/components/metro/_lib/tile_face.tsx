/**
 * One face of a tile: the only thing about a tile that has a colour.
 *
 * ## The fold
 *
 * A face is `shown` at 0deg or folded edge-on, `up` at 90deg or `down` at -90deg. It never goes past
 * edge-on, so there is no angle at which its back — mirrored text — faces the viewer, and nothing
 * depends on `backface-visibility`.
 *
 * The stages come from *which state the face is entering*: folding away starts at once, unfolding
 * waits for exactly that long. Flipping back is the same two rules on the opposite faces, so both
 * directions are symmetric.
 */

import { css, type Handle, type RemixNode } from "@remix-run/component";

import { color, grid, weight } from "../../../tokens.ts";
import { Icon } from "./icons.tsx";
import type { TileContent, TileSize } from "./types.ts";

export type Fold = "shown" | "up" | "down";

export interface TileFaceProps {
  size?: TileSize;
  content?: TileContent;
  fold?: Fold;
  /** The children are a picture: text goes white, over a scrim, whatever the accent. */
  photo?: boolean;
  /** Drawn behind the content. */
  children?: RemixNode;
}

export function TileFace(handle: Handle<TileFaceProps>) {
  return () => {
    const { size = "medium", content = {}, fold = "shown", photo, children } =
      handle.props;
    const { icon, label, count, headline, lines = [] } = content;
    const hasText = headline !== undefined || lines.length > 0;

    return (
      <span
        data-face=""
        data-fold={fold}
        data-photo={photo ? "" : undefined}
        data-size={size}
        data-caption={label !== undefined && size !== "small" ? "" : undefined}
        aria-hidden={fold === "shown" ? undefined : "true"}
        mix={faceStyle}
      >
        {children}
        {photo && label !== undefined && size !== "small"
          ? <span mix={scrimStyle} />
          : null}
        {hasText
          ? (
            <span mix={textStyle}>
              {headline === undefined
                ? null
                : <span mix={headlineStyle}>{headline}</span>}
              {lines.map((line, index) => (
                <span
                  key={index}
                  data-first={index === 0 ? "" : undefined}
                  mix={lineStyle}
                >
                  {line}
                </span>
              ))}
            </span>
          )
          : null}
        {icon === undefined
          ? null
          : (
            <span data-corner={hasText ? "" : undefined} mix={iconStyle}>
              <Icon name={icon} />
            </span>
          )}
        {label === undefined ? null : (
          <span
            data-small={size === "small" ? "" : undefined}
            mix={labelStyle}
          >
            {label}
          </span>
        )}
        {count === undefined ? null : <span mix={countStyle}>{count}</span>}
      </span>
    );
  };
}

/** One stage. The whole flip is two of them. */
const STAGE = "240ms";

const faceStyle = css({
  position: "absolute",
  inset: 0,
  display: "block",
  overflow: "hidden",
  background: color.accent,
  color: color.onAccent,
  "&[data-photo]": { color: "#fff" },
  // Set on every state, so one transition covers the fold and the delayed hide.
  '&[data-fold="shown"]': {
    transform: "perspective(800px) rotateX(0deg)",
    visibility: "visible",
    transition:
      `transform ${STAGE} cubic-bezier(0.1, 0.7, 0.3, 1) ${STAGE}, visibility 0s linear ${STAGE}`,
  },
  '&[data-fold="up"], &[data-fold="down"]': {
    visibility: "hidden",
    transition:
      `transform ${STAGE} cubic-bezier(0.7, 0, 0.9, 0.3), visibility 0s linear ${STAGE}`,
  },
  '&[data-fold="up"]': { transform: "perspective(800px) rotateX(90deg)" },
  '&[data-fold="down"]': { transform: "perspective(800px) rotateX(-90deg)" },
  "@media (prefers-reduced-motion: reduce)": {
    '&[data-fold="shown"], &[data-fold="up"], &[data-fold="down"]': {
      transition: "none",
    },
  },
});

const scrimStyle = css({
  position: "absolute",
  inset: "auto 0 0",
  height: "3.2em",
  background: "linear-gradient(transparent, rgb(0 0 0 / 0.7))",
});

const textStyle = css({
  position: "absolute",
  inset: "0.6em 0.7em",
  bottom: "0.6em",
  display: "block",
  overflow: "hidden",
  "[data-caption] > &": { bottom: "2.1em" },
});

const headlineStyle = css({
  display: "block",
  fontSize: `min(3.2em, calc(${grid.unit} * 0.62))`,
  fontWeight: weight.thin,
  lineHeight: 1.05,
  whiteSpace: "nowrap",
});

const lineStyle = css({
  display: "block",
  overflow: "hidden",
  "&[data-first]": { fontSize: "1.25em" },
});

const iconStyle = css({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "38%",
  aspectRatio: "1",
  transform: "translate(-50%, -50%)",
  // The wide face is twice as wide as it is tall; size its icon by the height instead.
  '[data-size="wide"] > &': { width: "19%" },
  '[data-size="small"] > &': { width: "50%" },
  "&[data-corner]": {
    top: "0.8em",
    left: "auto",
    right: "0.8em",
    width: "1.8em",
    transform: "none",
  },
});

const labelStyle = css({
  position: "absolute",
  left: "0.7em",
  right: "2.4em",
  bottom: "0.5em",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: weight.normal,
  // Off a small tile to look at, still there to be read out.
  "&[data-small]": {
    width: "1px",
    height: "1px",
    right: "auto",
    clipPath: "inset(50%)",
  },
});

const countStyle = css({
  position: "absolute",
  right: "0.6em",
  bottom: "0.3em",
  fontSize: "1.35em",
  lineHeight: 1.1,
  fontWeight: weight.light,
  '[data-size="small"] > &': { fontSize: "1em" },
});
