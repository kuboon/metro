import { clientEntry, type Handle } from "@remix-run/component";

import { TileBase } from "./_lib/tile_base.tsx";
import { TileFace } from "./_lib/tile_face.tsx";
import type { TileContent, TileSize } from "./_lib/types.ts";

export type TileProps = TileContent & { size?: TileSize; href?: string };

/** A single-face tile: a link with an `href`, otherwise a plain block. */
export const Tile = clientEntry(
  import.meta.url,
  function Tile(handle: Handle<TileProps>) {
    return () => {
      const { size, href, ...content } = handle.props;
      return (
        <TileBase size={size} href={href}>
          <TileFace size={size} content={content} />
        </TileBase>
      );
    };
  },
);
