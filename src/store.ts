import type { Logger, ScrollContainer, ScrollState } from "./defs.js";
import {
  readScrollState,
  readContainerSelector,
  commitScrollState,
} from "./helpers.js";

/**
 * Store the current scroll position of an element to the history state
 */
export function store(element: ScrollContainer, logger?: Logger): void {
  const state = readScrollState();

  const selector = readContainerSelector(element, logger);
  if (!selector) {
    return;
  }

  const { scrollTop: top, scrollLeft: left } = element;
  state[selector] = { top, left };

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
      if (!selector) return;

      state[selector] = {
        top: el.scrollTop,
        left: el.scrollLeft,
      };
    });

  commitScrollState(state);
}
