import type { ScrollContainer, ScrollState, Settings } from "./defs.js";
import {
  readScrollState,
  readContainerSelector,
  commitScrollState,
} from "./helpers.js";

/**
 * Store the current scroll position of an element to the history state
 */
export function store(
  element: ScrollContainer,
  { onStore, logger }: Settings,
): void {
  const state = readScrollState();

  const selector = readContainerSelector(element, logger);
  if (!selector) {
    return;
  }

  const { scrollTop: top, scrollLeft: left } = element;

  /** do not store again if there is no change */
  const stored = state[selector] || {};
  if (stored.top === top && stored.left === left) {
    return;
  }

  state[selector] = { top, left };

  onStore(element, { top, left });
  commitScrollState(state);

  logger?.log("stored:", { element, top, left });
}

/**
 * Store all positions before unload
 */
export function storeAll(): void {
  const state: ScrollState = {};

  document
    .querySelectorAll<ScrollContainer>("[data-restore-scroll]")
    .forEach((el) => {
      const selector = readContainerSelector(el);
      const { scrollTop: top, scrollLeft: left } = el;

      if (!selector || (!top && !left)) return;

      state[selector] = { top, left };
    });

  commitScrollState(state);
}
