import type { Target, Options, ScrollContainer, Settings } from "./defs.js";

import {
  debounce,
  createLogger,
  createContainerSelector,
  resolveTarget,
  isRootElement,
} from "./helpers.js";
import { restore } from "./restore.js";
import { store, storeAll } from "./store.js";

/** The default options */
const defaults: Options = {
  debug: false,
};

/** Hooked into beforeunload? */
let hookedIntoBeforeUnload = false;

/**
 * Restore the scroll position of an element
 */
export default function restoreScroll(
  target: Target | null,
  options: Partial<Options> = {},
) {
  const merged: Options = { ...defaults, ...options };
  const settings: Settings = {
    ...merged,
    logger: merged.debug ? createLogger() : undefined,
  };

  const element = resolveTarget(target);

  if (!element) {
    settings.logger?.error("No element found");
    return;
  }

  /** Store all on beforeunload */
  if (!hookedIntoBeforeUnload) {
    hookedIntoBeforeUnload = true;
    window.addEventListener("beforeunload", storeAll);
  }

  return register(element, settings);
}

/**
 * Register an element for scroll restoration
 */
function register(element: ScrollContainer, settings: Settings) {
  const { logger } = settings;

  /** Mark the element */
  element.setAttribute("data-restore-scroll", "");

  /** First time? Then attach the scroll handler further down */
  const isFirstTime = !element.__restore_scroll;

  /** Create and store the state in the element */
  element.__restore_scroll ??= {
    selector: createContainerSelector(element, logger),
  };

  /** Always restore when called */
  restore(element, settings);

  if (isFirstTime) {
    const eventTarget = isRootElement(element) ? window : element;
    const onScroll = debounce(() => store(element, settings), 150);
    eventTarget.addEventListener("scroll", onScroll, { passive: true });
  }
}
