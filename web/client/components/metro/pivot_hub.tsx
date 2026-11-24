import { css, type Handle } from "@remix-run/component";

import { grid, weight } from "../../tokens.ts";
import { BackLink } from "./_lib/back_link.tsx";
import { Pivot, type PivotProps } from "./pivot.tsx";

export interface PivotHubProps extends PivotProps {
  /** The application name over the headings. */
  title: string;
  /** Where the back arrow goes; no arrow without it. */
  back?: string;
}

/** A whole screen: the application's name, and a pivot filling the rest. */
export function PivotHub(handle: Handle<PivotHubProps>) {
  return () => {
    const { title, back, ...pivot } = handle.props;
    return (
      <main mix={hubStyle}>
        <header mix={headerStyle}>
          {back === undefined ? null : <BackLink href={back} />}
          <h1 mix={titleStyle}>{title}</h1>
        </header>
        <Pivot {...pivot} />
      </main>
    );
  };
}

const hubStyle = css({
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  overflow: "hidden",
});

const headerStyle = css({
  flex: "none",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: `1rem ${grid.pad} 0`,
});

const titleStyle = css({
  fontSize: "0.95rem",
  fontWeight: weight.normal,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
});
