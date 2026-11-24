/**
 * The part every tile shares: its place in the grid, what it is (link, button or neither), and the
 * press tilt.
 *
 * The base is transparent, always. A tile's colour belongs to its faces; a coloured base would show
 * through as a solid square while a face is folded edge-on.
 */

import {
  css,
  type Handle,
  on,
  ref,
  type RemixNode,
} from "@remix-run/component";

import { grid } from "../../../tokens.ts";
import type { TileSize } from "./types.ts";

export interface TileBaseProps {
  size?: TileSize;
  href?: string;
  /** Makes a tile without an `href` a button. */
  onPress?: () => void;
  /** Accessible name, where the faces' own text is not enough. */
  name?: string;
  /** Receives the host element in the browser. */
  host?: (node: HTMLElement) => void;
  children: RemixNode;
}

export function TileBase(handle: Handle<TileBaseProps>) {
  let tilt: string | undefined;

  const release = () => {
    if (tilt === undefined) return;
    tilt = undefined;
    handle.update();
  };

  const press = [
    on<HTMLElement, "pointerdown">("pointerdown", (event) => {
      const box = event.currentTarget.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      const degrees = (n: number) => `${(n * 16).toFixed(1)}deg`;
      tilt = `perspective(600px) rotateX(${degrees(-y)}) rotateY(${
        degrees(x)
      }) scale(0.97)`;
      handle.update();
    }),
    on<HTMLElement, "pointerup">("pointerup", release),
    on<HTMLElement, "pointerleave">("pointerleave", release),
    on<HTMLElement, "pointercancel">("pointercancel", release),
  ];

  return () => {
    const { size = "medium", href, onPress, name, host, children } =
      handle.props;
    const node = ref<HTMLElement>((element) => host?.(element));

    if (href !== undefined) {
      return (
        <a
          href={href}
          draggable={false}
          aria-label={name}
          data-size={size}
          style={{ transform: tilt }}
          mix={[baseStyle, node, ...press]}
        >
          {children}
        </a>
      );
    }

    if (onPress) {
      return (
        <button
          type="button"
          aria-label={name}
          data-size={size}
          style={{ transform: tilt }}
          mix={[
            baseStyle,
            node,
            ...press,
            on<HTMLElement>("click", () => handle.props.onPress?.()),
          ]}
        >
          {children}
        </button>
      );
    }

    return (
      <div data-size={size} mix={[baseStyle, node]}>
        {children}
      </div>
    );
  };
}

const baseStyle = css({
  position: "relative",
  display: "block",
  minWidth: 0,
  padding: 0,
  background: "transparent",
  textAlign: "left",
  userSelect: "none",
  transition: "transform 120ms ease-out",
  '&[data-size="small"]': { gridColumn: "span 1", gridRow: "span 1" },
  '&[data-size="medium"]': { gridColumn: "span 2", gridRow: "span 2" },
  '&[data-size="wide"]': { gridColumn: "span 4", gridRow: "span 2" },
  '&[data-size="large"]': { gridColumn: "span 4", gridRow: "span 4" },
  // Text scales with the unit, so a fluid phone grid keeps its proportions.
  "--tile-text": `clamp(11px, calc(${grid.unit} * 0.18), 16px)`,
  fontSize: "var(--tile-text)",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    transform: "none !important",
  },
});
