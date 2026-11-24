import { clientEntry, css, type Handle, ref } from "@remix-run/component";

import { color, grid, weight } from "../../tokens.ts";
import { reducedMotion } from "./_lib/live.ts";

export type PanoramaBackdropProps = {
  /** The panorama's id. Its sections scroll in `#${id}-sections`. */
  id: string;
  title: string;
  background?: string;
};

/** How much wider than the screen the background is, as a fraction. */
const OVERSCAN = 0.3;

/**
 * The panorama's two slow layers — the background and the title — and the parallax that moves them.
 *
 * Like `PivotHeader`, the only client entry of its container: the sections stay server-rendered
 * siblings so they may hold client entries of their own.
 */
export const PanoramaBackdrop = clientEntry(
  import.meta.url,
  function PanoramaBackdrop(handle: Handle<PanoramaBackdropProps>) {
    /** How far along the sections are, 0 to 1, and how far the title travels, in pixels. */
    let progress = 0;
    let travel = 0;
    let title: HTMLElement | undefined;

    handle.queueTask(() => {
      const sections = document.getElementById(`${handle.props.id}-sections`);
      if (handle.signal.aborted || !sections || reducedMotion()) return;
      let frame = 0;

      const measure = () => {
        frame = 0;
        const range = sections.scrollWidth - sections.clientWidth;
        // A long title ends flush right; one that already fits still drifts a little.
        travel = Math.max(
          (title?.scrollWidth ?? 0) - sections.clientWidth,
          sections.clientWidth * 0.2,
        );
        progress = range > 0
          ? Math.min(1, Math.max(0, sections.scrollLeft / range))
          : 0;
        handle.update();
      };
      const schedule = () => frame ||= requestAnimationFrame(measure);

      const options = { signal: handle.signal, passive: true };
      sections.addEventListener("scroll", schedule, options);
      addEventListener("resize", schedule, options);
      handle.signal.addEventListener(
        "abort",
        () => cancelAnimationFrame(frame),
      );
      schedule();
    });

    return () => {
      const { title: text, background } = handle.props;
      const backgroundShift = progress * OVERSCAN / (1 + OVERSCAN) * -100;
      return (
        <>
          {background === undefined ? null : (
            <div
              aria-hidden="true"
              mix={backgroundStyle}
              style={{
                backgroundImage:
                  `linear-gradient(var(--panorama-scrim), var(--panorama-scrim)), url("${background}")`,
                transform: `translateX(${backgroundShift.toFixed(3)}%)`,
              }}
            />
          )}
          <h1
            mix={[
              titleStyle,
              ref<HTMLElement>((node) => {
                title = node;
              }),
            ]}
            style={{
              transform: `translateX(${(-progress * travel).toFixed(1)}px)`,
            }}
          >
            {text}
          </h1>
        </>
      );
    };
  },
);

const backgroundStyle = css({
  "--panorama-scrim": `color-mix(in srgb, ${color.bg} 62%, transparent)`,
  position: "absolute",
  insetBlock: 0,
  left: 0,
  zIndex: -1,
  width: `${100 + OVERSCAN * 100}%`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  willChange: "transform",
});

const titleStyle = css({
  flex: "none",
  alignSelf: "flex-start",
  minWidth: "100%",
  paddingInline: grid.pad,
  fontSize: "clamp(5rem, 24vw, 8.5rem)",
  fontWeight: weight.thin,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  textTransform: "lowercase",
  whiteSpace: "nowrap",
  willChange: "transform",
});
