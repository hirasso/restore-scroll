import type { Settings, ScrollContainer } from "./defs.js";
import { dispatch } from "./events.js";
import {
  readScrollState,
  readContainerSelector,
  isScrollPosition,
} from "./helpers.js";

/**
 * Restore the scroll position of an element.
 */
export function restore(element: ScrollContainer, settings: Settings): void {
  const { logger } = settings;
  const selector = readContainerSelector(element, logger);
  if (!selector) return;

  const position = readScrollState()[selector];

  if (!isScrollPosition(position)) {
    return;
  }

  /**
   * Apply the restoration
   */
  const apply = () => {
    if (!dispatch(element, "restore", { position }, settings)) {
      return logger?.log("prevented restore:", { element, ...position });
    }

    element.scrollTo({ ...position, behavior: "instant" });
    logger?.log("restore:", { element, ...position });
  };

  /** Apply immediately if the element has a width and height */
  const { width, height } = element.getBoundingClientRect();
  if (width || height) {
    return apply();
  }

  /** Do not wait longer than 100ms */
  const timeout = setTimeout(() => {
    observer.disconnect();
    logger?.warn("restore timed out", { selector, element, ...position });
  }, 100);

  /** Wait for the element to have a height before attempting to scroll */
  const observer = new ResizeObserver(([{ contentRect }]) => {
    if (!contentRect.height) return;
    observer.disconnect();
    clearTimeout(timeout);
    apply();
  });

  observer.observe(element);
}
