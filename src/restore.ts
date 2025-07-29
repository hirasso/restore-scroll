import type { Logger, ScrollContainer } from "./defs.js";
import { readScrollState, readContainerSelector, isScrollPosition } from "./helpers.js";

/**
 * Restore the scroll position of an element.
 */
export function restore(element: ScrollContainer, logger?: Logger): void {
  const selector = readContainerSelector(element, logger);
  if (!selector) return;

  const position = readScrollState()[selector];
  let restored = false;

  if (!isScrollPosition(position)) {
    return;
  }
  const { top, left } = position;

  /** Wait for the element to have a height before attempting to scroll */
  const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
    if (!contentRect.height) return;
    resizeObserver.disconnect();

    element.scrollTo({ top, left, behavior: "instant" });
    resizeObserver.disconnect();
    restored = true;

    logger?.log("restored:", { element, ...position });
  });
  resizeObserver.observe(element);

  /** Do not wait longer than 100ms */
  setTimeout(() => {
    resizeObserver.disconnect();

    if (!restored) {
      logger?.warn("restore timed out", { selector, element, ...position });
    }
  }, 100);
}
