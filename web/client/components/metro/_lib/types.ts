/** Grid spans: small 1×1, medium 2×2, wide 4×2, large 4×4 units. */
export type TileSize = "small" | "medium" | "wide" | "large";

/** The glyphs `_lib/icons.tsx` draws. */
export type IconName =
  | "back"
  | "calendar"
  | "mail"
  | "message"
  | "music"
  | "people"
  | "phone"
  | "photo"
  | "settings"
  | "sun";

/**
 * What one tile face shows.
 *
 * Plain data rather than JSX, because it crosses the hydration boundary as a client entry's prop.
 * (A `type`, not an `interface`: only a type alias satisfies `SerializableProps`.)
 */
export type TileContent = {
  icon?: IconName;
  /** Bottom-left caption. Not drawn on a small tile, but still its accessible name. */
  label?: string;
  /** Bottom-right badge. */
  count?: number;
  /** Large thin text, for the one thing the face is about. */
  headline?: string;
  lines?: string[];
};

export type Photo = { src: string; alt: string };

export type Contact = { name: string; photo?: string };

export type Post = { author: string; text: string; when: string };
