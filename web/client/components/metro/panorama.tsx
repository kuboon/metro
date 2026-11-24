import { css, type Handle, type RemixNode } from "@remix-run/component";

import { grid, weight } from "../../tokens.ts";
import { BackLink } from "./_lib/back_link.tsx";
import { PanoramaBackdrop } from "./panorama_backdrop.tsx";

export interface PanoramaProps {
  /** Unique in the document. */
  id: string;
  title: string;
  /** Image URL for the layer behind everything. */
  background?: string;
  back?: string;
  /** `PanoramaSection`s. */
  children?: RemixNode;
}

/** A whole screen wider than the screen: sections scroll sideways, title and background lag. */
export function Panorama(handle: Handle<PanoramaProps>) {
  return () => {
    const { id, title, background, back, children } = handle.props;
    return (
      <main mix={panoramaStyle}>
        {back === undefined ? null : (
          <div mix={backStyle}>
            <BackLink href={back} />
          </div>
        )}
        <PanoramaBackdrop id={id} title={title} background={background} />
        <div
          id={`${id}-sections`}
          role="region"
          aria-label={title}
          tabIndex={0}
          mix={sectionsStyle}
        >
          {children}
        </div>
      </main>
    );
  };
}

/** One column of a panorama, narrow enough that the next one shows at the edge. */
export function PanoramaSection(
  handle: Handle<{ heading: string; children?: RemixNode }>,
) {
  return () => (
    <section mix={sectionStyle}>
      <h2 mix={headingStyle}>{handle.props.heading}</h2>
      {handle.props.children}
    </section>
  );
}

const panoramaStyle = css({
  position: "relative",
  zIndex: 0,
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  overflow: "hidden",
});

const backStyle = css({ flex: "none", padding: `1rem ${grid.pad} 0` });

const sectionsStyle = css({
  flex: 1,
  minHeight: 0,
  display: "flex",
  gap: "1.5rem",
  overflowX: "auto",
  overflowY: "hidden",
  paddingInline: grid.pad,
  scrollPaddingInline: grid.pad,
  scrollSnapType: "x proximity",
  scrollbarWidth: "none",
  overscrollBehaviorX: "contain",
  "&:focus-visible": { outlineOffset: "-3px" },
});

/** Four tile units on a phone would fill the screen; tiles inside shrink to fit the column. */
const sectionStyle = css({
  "--metro-unit": `calc((min(84vw, 360px) - 3 * ${grid.gap}) / 4)`,
  flex: "0 0 min(84vw, 360px)",
  overflowX: "hidden",
  overflowY: "auto",
  scrollbarWidth: "none",
  scrollSnapAlign: "start",
  paddingBottom: "2rem",
});

const headingStyle = css({
  marginBlock: "0.5rem 0.75rem",
  fontSize: "2rem",
  fontWeight: weight.light,
  lineHeight: 1.2,
  textTransform: "lowercase",
});
