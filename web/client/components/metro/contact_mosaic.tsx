import { css, type Handle } from "@remix-run/component";

import { grid } from "../../tokens.ts";
import { TileBase } from "./_lib/tile_base.tsx";
import { TileFace } from "./_lib/tile_face.tsx";
import type { Contact } from "./_lib/types.ts";

/** A dense block of contacts: a photo where there is one, initials on the accent where not. */
export function ContactMosaic(handle: Handle<{ contacts: Contact[] }>) {
  return () => (
    <div mix={mosaicStyle}>
      {handle.props.contacts.map(({ name, photo }) => (
        <TileBase key={name} size="small">
          <TileFace
            size="small"
            content={photo === undefined
              ? { label: name, headline: initials(name) }
              : { label: name }}
          >
            {photo === undefined
              ? null
              : <img src={photo} alt="" mix={photoStyle} />}
          </TileFace>
        </TileBase>
      ))}
    </div>
  );
}

function initials(name: string): string {
  return name.split(" ").map((word) => word[0]).join("").toLowerCase();
}

const mosaicStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(4, ${grid.unit})`,
  gridAutoRows: grid.unit,
  gap: grid.gap,
});

const photoStyle = css({ width: "100%", height: "100%", objectFit: "cover" });
