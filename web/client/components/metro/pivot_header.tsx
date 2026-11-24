import { clientEntry, css, type Handle, on, ref } from "@remix-run/component";

import { color, grid, weight } from "../../tokens.ts";
import { reducedMotion } from "./_lib/live.ts";

export type PivotHeaderProps = {
  /** The pivot's id. Its panels are `#${id}-panels`. */
  id: string;
  label: string;
  headings: { name: string; heading: string }[];
};

/**
 * The pivot's headings, and all of its behaviour.
 *
 * It is the pivot's only client entry on purpose: a client entry's props are serialized, so one that
 * took the panels as children would strip the event handlers out of every tile in them. The panels
 * stay server-rendered siblings, and this drives them through the scroll position.
 */
export const PivotHeader = clientEntry(
  import.meta.url,
  function PivotHeader(handle: Handle<PivotHeaderProps>) {
    let active = 0;
    /** The panel a press is scrolling to; the ones passed on the way are not selected. */
    let target: number | undefined;
    let strip: HTMLElement | undefined;

    const scroller = () =>
      document.getElementById(`${handle.props.id}-panels`) ?? undefined;

    const behavior = (): ScrollBehavior => reducedMotion() ? "auto" : "smooth";

    const activate = (index: number) => {
      active = index;
      // Off-screen panels are still in the document; keep the keyboard out of them.
      [...scroller()?.children ?? []].forEach((panel, i) =>
        panel.toggleAttribute("inert", i !== index)
      );
      const tab = strip?.children[index] as HTMLElement | undefined;
      const first = strip?.children[0] as HTMLElement | undefined;
      strip?.scrollTo({
        left: (tab?.offsetLeft ?? 0) - (first?.offsetLeft ?? 0),
        behavior: behavior(),
      });
      handle.update();
    };

    const select = (index: number, focus = false) => {
      const panels = scroller();
      target = index;
      activate(index);
      panels?.scrollTo({
        left: index * panels.clientWidth,
        behavior: behavior(),
      });
      if (focus) (strip?.children[index] as HTMLElement | undefined)?.focus();
    };

    handle.queueTask(() => {
      const panels = scroller();
      if (handle.signal.aborted || !panels) return;
      const options = { signal: handle.signal, passive: true };

      panels.addEventListener("scroll", () => {
        if (!panels.clientWidth) return;
        const index = Math.round(panels.scrollLeft / panels.clientWidth);
        if (target !== undefined) {
          if (index === target) target = undefined;
          return;
        }
        if (index !== active) activate(index);
      }, options);
      // A hand on the panels overrides a press still in flight.
      for (const type of ["pointerdown", "wheel", "touchstart"]) {
        panels.addEventListener(type, () => target = undefined, options);
      }

      // A reload can restore the scroll position of a pivot that was not on its first panel.
      activate(
        panels.clientWidth
          ? Math.round(panels.scrollLeft / panels.clientWidth)
          : 0,
      );
    });

    return () => {
      const { id, label, headings } = handle.props;
      return (
        <div
          role="tablist"
          aria-label={label}
          mix={[
            stripStyle,
            ref<HTMLElement>((node) => {
              strip = node;
            }),
            on<HTMLElement, "keydown">("keydown", (event) => {
              const last = headings.length - 1;
              const next = {
                ArrowRight: active === last ? 0 : active + 1,
                ArrowLeft: active === 0 ? last : active - 1,
                Home: 0,
                End: last,
              }[event.key];
              if (next === undefined) return;
              event.preventDefault();
              select(next, true);
            }),
          ]}
        >
          {headings.map(({ name, heading }, index) => (
            <button
              key={name}
              type="button"
              role="tab"
              id={`${id}-tab-${name}`}
              aria-controls={`${id}-panel-${name}`}
              aria-selected={index === active ? "true" : "false"}
              tabIndex={index === active ? 0 : -1}
              mix={[tabStyle, on("click", () => select(index))]}
            >
              {heading}
            </button>
          ))}
        </div>
      );
    };
  },
);

const stripStyle = css({
  position: "relative",
  flex: "none",
  display: "flex",
  gap: "0.45em",
  paddingInline: grid.pad,
  overflowX: "auto",
  scrollbarWidth: "none",
  fontSize: "clamp(2.6rem, 12vw, 4rem)",
  lineHeight: 1.2,
  // Room for the last heading to reach the left edge.
  "&::after": { content: '""', flex: "0 0 100%" },
});

const tabStyle = css({
  flex: "none",
  fontWeight: weight.thin,
  textTransform: "lowercase",
  whiteSpace: "nowrap",
  color: color.fg,
  opacity: 0.4,
  transition: "opacity 200ms ease",
  '&[aria-selected="true"]': { opacity: 1 },
  "&:focus-visible": { outlineOffset: "-3px" },
});
