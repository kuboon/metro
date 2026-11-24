/**
 * The design tokens, as the names of the custom properties `static/app.css` defines.
 *
 * The values are in CSS because the theme and the accent swap them at runtime; a component reads a
 * name from here and so has no colour of its own to fall out of step.
 */

export const color = {
  bg: "var(--metro-bg)",
  fg: "var(--metro-fg)",
  muted: "var(--metro-muted)",
  accent: "var(--metro-accent)",
  /** Text on an accent face. */
  onAccent: "var(--metro-on-accent)",
} as const;

/** The tile grid: one unit is a small tile, `pad` is the screen's side margin. */
export const grid = {
  unit: "var(--metro-unit)",
  gap: "var(--metro-gap)",
  pad: "var(--metro-pad)",
} as const;

export const weight = { thin: 200, light: 300, normal: 400 } as const;
