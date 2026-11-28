import type { Handle } from "@remix-run/component";

/**
 * Calls `onDay` with the current date once the component is in the browser, again just after each
 * local midnight, and whenever the page comes back into view.
 *
 * Call from setup: it starts in a queued task, which never runs on the server, so a static build
 * never writes its own date into the page.
 */
export function watchToday(
  handle: Pick<Handle, "queueTask" | "signal">,
  onDay: (today: Date) => void,
): void {
  handle.queueTask(() => {
    if (handle.signal.aborted) return;
    let timer: number | undefined;

    const refresh = () => {
      const now = new Date();
      onDay(now);
      clearTimeout(timer);
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      timer = setTimeout(refresh, midnight.getTime() - now.getTime() + 50);
    };

    refresh();
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refresh();
    }, { signal: handle.signal });
    handle.signal.addEventListener("abort", () => clearTimeout(timer));
  });
}
