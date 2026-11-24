import { css, type Handle, type RemixNode } from "@remix-run/component";

import { color, grid, weight } from "../../tokens.ts";

/**
 * A named block of tiles on the four-column grid.
 *
 * Columns and rows are the same `--metro-unit`, so every tile is square by construction. On a phone
 * that unit is derived from the viewport (see `static/app.css`) and the block fills it edge to edge.
 */
export function TileGroup(
  handle: Handle<{ name?: string; children?: RemixNode }>,
) {
  return () => (
    <section mix={groupStyle}>
      {handle.props.name === undefined
        ? null
        : <h2 mix={nameStyle}>{handle.props.name}</h2>}
      <div data-tile-grid="" mix={gridStyle}>{handle.props.children}</div>
    </section>
  );
}

/** Lays groups out: stacked on a phone, side by side where there is room. */
export function StartScreen(handle: Handle<{ children?: RemixNode }>) {
  return () => <div mix={startStyle}>{handle.props.children}</div>;
}

const groupStyle = css({ minWidth: 0 });

const nameStyle = css({
  marginBottom: "0.5rem",
  fontSize: "1.25rem",
  fontWeight: weight.light,
  textTransform: "lowercase",
  color: color.muted,
});

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(4, ${grid.unit})`,
  gridAutoRows: grid.unit,
  gridAutoFlow: "row dense",
  gap: grid.gap,
});

const startStyle = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  gap: "1.75rem 3rem",
  paddingInline: grid.pad,
  paddingBlock: "0.75rem 2rem",
  "@media (max-width: 639.98px)": { flexDirection: "column" },
});
