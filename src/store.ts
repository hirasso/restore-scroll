import type { ScrollContainer, ScrollState, Settings } from "./defs.js";
import { dispatch } from "./events.js";
import {
  readScrollState,
  readContainerSelector,
  commitScrollState,
  deepEqual,
} from "./helpers.js";

/**
 * Store the current scroll position of an element to the history state
 */
export function store(element: ScrollContainer, settings: Settings): void {
  const { logger } = settings;
  const state = readScrollState();

  const selector = readContainerSelector(element, logger);
  if (!selector) {
    return;
  }

  const { scrollTop: top, scrollLeft: left } = element;
  const position = { top, left };

  /** do not store again if there is no change */
  const stored = state[selector] || {};
  if (deepEqual(stored, position)) {
    return;
  }

  state[selector] = { top, left };

  if (!dispatch(element, "store", { position }, settings)) {
    return logger?.log("prevented store:", { element, top, left });
  }

  commitScrollState(state);
  logger?.log("store:", { element, top, left });
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
