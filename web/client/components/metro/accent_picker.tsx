import { clientEntry, css, type Handle, on } from "@remix-run/component";

import { color, grid, weight } from "../../tokens.ts";
import { accents, themeStore } from "./_lib/theme_store.ts";

/** The theme settings: dark or light, and one accent for every tile. */
export const AccentPicker = clientEntry(
  import.meta.url,
  function AccentPicker(handle: Handle) {
    // The saved choice is read after hydration, which has to start from the defaults in the HTML.
    handle.queueTask(() => {
      if (handle.signal.aborted) return;
      themeStore.addEventListener("change", () => handle.update(), {
        signal: handle.signal,
      });
      themeStore.load();
      handle.update();
    });

    return () => (
      <div mix={settingsStyle}>
        <h2 mix={headingStyle}>theme</h2>
        <div role="group" aria-label="theme" mix={themesStyle}>
          {(["dark", "light"] as const).map((theme) => (
            <button
              key={theme}
              type="button"
              aria-pressed={themeStore.theme === theme ? "true" : "false"}
              mix={[
                themeStyle,
                on("click", () => themeStore.set({ theme })),
              ]}
            >
              {theme}
            </button>
          ))}
        </div>

        <h2 mix={headingStyle}>accent colour</h2>
        <p mix={currentStyle}>{themeStore.accent.name}</p>
        <div role="group" aria-label="accent colour" mix={swatchesStyle}>
          {accents.map((accent) => (
            <button
              key={accent.name}
              type="button"
              aria-label={accent.name}
              aria-pressed={themeStore.accent === accent ? "true" : "false"}
              mix={[
                swatchStyle,
                on("click", () => themeStore.set({ accent })),
              ]}
            >
              <span mix={chipStyle} style={{ background: accent.color }} />
            </button>
          ))}
        </div>
      </div>
    );
  },
);

const settingsStyle = css({
  paddingInline: grid.pad,
  paddingBlock: "0.75rem 2rem",
  maxWidth: "32rem",
});

const headingStyle = css({
  marginBlock: "0.5rem",
  fontSize: "1.5rem",
  fontWeight: weight.light,
});

const themesStyle = css({
  display: "flex",
  gap: "1.5rem",
  marginBottom: "1.5rem",
});

const themeStyle = css({
  fontSize: "1.5rem",
  fontWeight: weight.thin,
  color: color.muted,
  '&[aria-pressed="true"]': { color: color.fg, fontWeight: weight.normal },
});

const currentStyle = css({ marginBottom: "0.75rem", color: color.muted });

const swatchesStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: grid.gap,
});

const swatchStyle = css({
  aspectRatio: "1",
  '&[aria-pressed="true"]': {
    outline: `3px solid ${color.fg}`,
    outlineOffset: "-3px",
  },
});

const chipStyle = css({ display: "block", width: "100%", height: "100%" });
