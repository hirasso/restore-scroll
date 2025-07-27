import type { Logger, ScrollContainer, ScrollState } from "./defs.js";
import { getScrollState, readStorageSelector } from "./helpers.js";

/**
 * Store the current scroll position of an element to the history state
 */
export function store(element: ScrollContainer, logger?: Logger): void {
  const state = window.history.state || {};
  const scrollState = getScrollState();

  const selector = readStorageSelector(element, logger);
  if (!selector) {
    return;
  }

  const { scrollTop: top, scrollLeft: left } = element;
  scrollState[selector] = { top, left };

  const newState = {
    ...state,
    scrollState,
  };

  window.history.replaceState(newState, "");

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
      const selector = readStorageSelector(el);
      if (!selector) return;

      state[selector] = {
        top: el.scrollTop,
        left: el.scrollLeft,
      };
    });

  const newState = {
    ...(window.history.state || {}),
    state,
  };

  window.history.replaceState(newState, "");
}
