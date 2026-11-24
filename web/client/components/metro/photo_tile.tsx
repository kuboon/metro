import { clientEntry, css, type Handle } from "@remix-run/component";

import { live } from "./_lib/live.ts";
import { TileBase } from "./_lib/tile_base.tsx";
import { TileFace } from "./_lib/tile_face.tsx";
import type { Photo, TileSize } from "./_lib/types.ts";

export type PhotoTileProps = {
  photos: Photo[];
  label?: string;
  size?: TileSize;
  href?: string;
  /** Milliseconds each photo is on screen. */
  interval?: number;
  delay?: number;
};

/** A tile whose face is a photo, panning slowly and cross-fading to the next. */
export const PhotoTile = clientEntry(
  import.meta.url,
  function PhotoTile(handle: Handle<PhotoTileProps>) {
    let current = 0;

    live(handle, () => ({
      interval: handle.props.photos.length > 1
        ? handle.props.interval ?? 6000
        : 0,
      delay: handle.props.delay,
      tick: () => {
        current = (current + 1) % handle.props.photos.length;
        handle.update();
      },
    }));

    return () => {
      const { photos, label, size, href } = handle.props;
      return (
        <TileBase size={size} href={href}>
          <TileFace size={size} content={{ label }} photo>
            {photos.map(({ src, alt }, index) => (
              <img
                key={src}
                src={src}
                alt={index === current ? alt : ""}
                draggable={false}
                data-current={index === current ? "" : undefined}
                mix={photoStyle}
              />
            ))}
          </TileFace>
        </TileBase>
      );
    };
  },
);

const photoStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "125%",
  objectFit: "cover",
  opacity: 0,
  // Rewound only once the fade has hidden it.
  transition: "opacity 900ms ease, transform 0s linear 900ms",
  "&[data-current]": {
    opacity: 1,
    transform: "translateY(-18%)",
    transition: "opacity 900ms ease, transform 8s linear",
  },
  "@media (prefers-reduced-motion: reduce)": {
    "&, &[data-current]": { transition: "none" },
  },
});
