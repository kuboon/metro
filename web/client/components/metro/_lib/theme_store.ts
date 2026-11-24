/**
 * The theme and accent, shared by every settings control on the page.
 *
 * Tiles never subscribe: their faces paint `var(--metro-accent)`, and this writes that property on
 * `<html>`. One write re-themes every tile, hydrated or not.
 */

import { TypedEventTarget } from "@remix-run/component";

export type Theme = "dark" | "light";

export interface Accent {
  name: string;
  color: string;
  /** Text colour on it: white, except on the lightest four. */
  on: string;
}

const accent = (name: string, color: string, on = "#fff"): Accent => ({
  name,
  color,
  on,
});

export const accents: readonly Accent[] = [
  accent("lime", "#a4c400", "#000"),
  accent("green", "#60a917"),
  accent("emerald", "#008a00"),
  accent("teal", "#00aba9"),
  accent("cyan", "#1ba1e2"),
  accent("cobalt", "#0050ef"),
  accent("indigo", "#6a00ff"),
  accent("violet", "#aa00ff"),
  accent("pink", "#f472d0", "#000"),
  accent("magenta", "#d80073"),
  accent("crimson", "#a20025"),
  accent("red", "#e51400"),
  accent("orange", "#fa6800"),
  accent("amber", "#f0a30a", "#000"),
  accent("yellow", "#e3c800", "#000"),
  accent("brown", "#825a2c"),
  accent("olive", "#6d8764"),
  accent("steel", "#647687"),
  accent("mauve", "#76608a"),
  accent("taupe", "#87794e"),
];

/** Read by `static/theme-boot.js` as well. */
const STORAGE_KEY = "metro-theme";

class ThemeStore extends TypedEventTarget<{ change: Event }> {
  #accent: Accent = accents.find(({ name }) => name === "cobalt")!;
  #theme: Theme = "dark";
  #loaded = false;

  get accent(): Accent {
    return this.#accent;
  }

  get theme(): Theme {
    return this.#theme;
  }

  /** Reads what was saved, once. Browser only: call it from a queued task. */
  load(): void {
    if (this.#loaded) return;
    this.#loaded = true;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
      this.#accent = accents.find(({ name }) => name === saved.accent) ??
        this.#accent;
      if (saved.theme === "light") this.#theme = "light";
    } catch {
      // Storage blocked or unreadable: keep the defaults.
    }
  }

  set(next: { accent?: Accent; theme?: Theme }): void {
    this.#accent = next.accent ?? this.#accent;
    this.#theme = next.theme ?? this.#theme;

    const { name, color, on } = this.#accent;
    const root = document.documentElement;
    root.dataset.theme = this.#theme;
    root.style.setProperty("--metro-accent", color);
    root.style.setProperty("--metro-on-accent", on);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accent: name, color, on, theme: this.#theme }),
      );
    } catch {
      // The choice still holds for this visit.
    }
    this.dispatchEvent(new Event("change"));
  }
}

export const themeStore: ThemeStore = new ThemeStore();
