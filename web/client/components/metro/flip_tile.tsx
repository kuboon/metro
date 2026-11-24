import { clientEntry, type Handle } from "@remix-run/component";

import { live } from "./_lib/live.ts";
import { TileBase } from "./_lib/tile_base.tsx";
import { TileFace } from "./_lib/tile_face.tsx";
import type { TileContent, TileSize } from "./_lib/types.ts";

export type FlipTileProps = {
  front: TileContent;
  back: TileContent;
  size?: TileSize;
  href?: string;
  /** Milliseconds between flips. `0` flips only when pressed. */
  interval?: number;
  delay?: number;
};

/**
 * A two-face live tile. It flips on a clock, and — without an `href` — when pressed.
 *
 * The flip itself is CSS, in `_lib/tile_face.tsx`; the component only says which face is shown. The
 * clock holds while a pointer or the keyboard is on the tile, so it can be read.
 */
export const FlipTile = clientEntry(
  import.meta.url,
  function FlipTile(handle: Handle<FlipTileProps>) {
    let flipped = false;
    let host: HTMLElement | undefined;

    const flip = () => {
      flipped = !flipped;
      handle.update();
    };

    live(handle, () => ({
      interval: handle.props.interval ?? 5000,
      delay: handle.props.delay,
      tick: flip,
      paused: () =>
        host !== undefined && (host.matches(":focus-visible") ||
          // `:hover` sticks after a tap on a touch screen, where it means nothing.
          (matchMedia("(hover: hover)").matches && host.matches(":hover"))),
    }));

    return () => {
      const { front, back, size, href } = handle.props;
      return (
        <TileBase
          size={size}
          href={href}
          onPress={href === undefined ? flip : undefined}
          host={(node) => host = node}
        >
          <TileFace
            size={size}
            content={front}
            fold={flipped ? "up" : "shown"}
          />
          <TileFace
            size={size}
            content={back}
            fold={flipped ? "shown" : "down"}
          />
        </TileBase>
      );
    };
  },
);
