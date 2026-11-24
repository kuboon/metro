import { css, type Handle, type RemixNode } from "@remix-run/component";

import { PivotHeader } from "./pivot_header.tsx";

export interface PivotItem {
  name: string;
  heading: string;
  content: RemixNode;
}

export interface PivotProps {
  /** Unique in the document; the tabs and panels derive their ids from it. */
  id: string;
  /** What the set of headings is called, to a screen reader. */
  label: string;
  items: PivotItem[];
}

/**
 * Headings over panels that swipe sideways.
 *
 * The swipe is native scroll snapping and works before any script does. `PivotHeader` is the
 * interactive part; this is a plain component, so panels may hold client entries of their own.
 */
export function Pivot(handle: Handle<PivotProps>) {
  return () => {
    const { id, label, items } = handle.props;
    return (
      <div mix={pivotStyle}>
        <PivotHeader
          id={id}
          label={label}
          headings={items.map(({ name, heading }) => ({ name, heading }))}
        />
        <div id={`${id}-panels`} mix={panelsStyle}>
          {items.map(({ name, content }) => (
            <div
              key={name}
              role="tabpanel"
              id={`${id}-panel-${name}`}
              aria-labelledby={`${id}-tab-${name}`}
              tabIndex={0}
              mix={panelStyle}
            >
              {content}
            </div>
          ))}
        </div>
      </div>
    );
  };
}

const pivotStyle = css({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
});

const panelsStyle = css({
  flex: 1,
  minHeight: 0,
  display: "flex",
  overflowX: "auto",
  overflowY: "hidden",
  scrollSnapType: "x mandatory",
  scrollbarWidth: "none",
  overscrollBehaviorX: "contain",
});

const panelStyle = css({
  flex: "0 0 100%",
  minWidth: 0,
  overflowX: "hidden",
  overflowY: "auto",
  scrollbarWidth: "none",
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
  "&:focus-visible": { outlineOffset: "-3px" },
});
