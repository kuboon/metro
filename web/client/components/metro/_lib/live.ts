import type { Handle } from "@remix-run/component";

/** Whether the visitor asked for less motion. Browser only. */
export function reducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface LiveOptions {
  /** Milliseconds between ticks; `0` or less never ticks. */
  interval: number;
  /** Added before the first tick, so neighbouring tiles do not move in step. */
  delay?: number;
  /** A tick that lands while this is true is skipped. */
  paused?: () => boolean;
  tick: () => void;
}

/**
 * Runs a live tile's clock for as long as the component is mounted.
 *
 * Call from setup: it starts in a queued task, which never runs on the server. Ticks are skipped
 * in a hidden document, and none are scheduled under `prefers-reduced-motion`.
 */
export function live(
  handle: Pick<Handle, "queueTask" | "signal">,
  options: () => LiveOptions,
): void {
  handle.queueTask(() => {
    const { interval, delay = 0 } = options();
    if (handle.signal.aborted || interval <= 0 || reducedMotion()) return;

    let timer = setTimeout(function run() {
      const { paused, tick } = options();
      if (!document.hidden && !paused?.()) tick();
      timer = setTimeout(run, interval);
    }, interval + delay);

    handle.signal.addEventListener("abort", () => clearTimeout(timer));
  });
}
