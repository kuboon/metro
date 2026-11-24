import { clientEntry, type Handle } from "@remix-run/component";

import { TileBase } from "./_lib/tile_base.tsx";
import { TileFace } from "./_lib/tile_face.tsx";
import type { TileSize } from "./_lib/types.ts";

export type CalendarTileProps = {
  label?: string;
  /** A line under the date: the next appointment. */
  event?: string;
  locale?: string;
  size?: TileSize;
  href?: string;
};

/**
 * Today's date, and it stays today's: it re-reads the clock at midnight and whenever the page comes
 * back into view.
 *
 * The date is read in the browser only. A static page is rendered once, at build time, and a build
 * date would be a wrong answer dressed as a right one — so the HTML carries the label and no date.
 */
export const CalendarTile = clientEntry(
  import.meta.url,
  function CalendarTile(handle: Handle<CalendarTileProps>) {
    let today: Date | undefined;

    handle.queueTask(() => {
      if (handle.signal.aborted) return;
      let timer: number | undefined;

      const refresh = () => {
        today = new Date();
        handle.update();
        clearTimeout(timer);
        const midnight = new Date(today);
        midnight.setHours(24, 0, 0, 0);
        timer = setTimeout(refresh, midnight.getTime() - today.getTime() + 50);
      };

      refresh();
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) refresh();
      }, { signal: handle.signal });
      handle.signal.addEventListener("abort", () => clearTimeout(timer));
    });

    return () => {
      const { label = "calendar", event, locale = "en", size, href } =
        handle.props;
      const part = (options: Intl.DateTimeFormatOptions) =>
        today ? new Intl.DateTimeFormat(locale, options).format(today) : " ";

      return (
        <TileBase size={size} href={href}>
          <TileFace
            size={size}
            content={{
              label,
              headline: part({ day: "numeric" }),
              lines: size === "small" ? [] : [
                part({ weekday: "long" }),
                ...(size === "wide" || size === "large"
                  ? [part({ month: "long", year: "numeric" })]
                  : []),
                ...(event === undefined ? [] : [event]),
              ],
            }}
          />
        </TileBase>
      );
    };
  },
);
