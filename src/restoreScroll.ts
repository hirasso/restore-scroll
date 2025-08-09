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

/** Hook into beforeunload */
let hookedIntoBeforeUnload = false;

/**
 * Restore the scroll position of an element
 */
export default function restoreScroll(
  target: Target | null,
  options: Partial<Options> = {}
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

  register(element, settings);

  /**
   * Return a destroy function
   */
  return { destroy: () => unregister(element) };
}

/**
 * Register an element for scroll restoration
 */
function register(element: ScrollContainer, settings: Settings) {
  const { logger } = settings;

  /** Mark the element */
  element.setAttribute("data-restore-scroll", "");

  /** Create and store the state in the element */
  element.__restore_scroll ??= {
    selector: createContainerSelector(element, logger),
    onScroll: debounce(() => store(element, settings), 150),
  };

  /** Always restore when called */
  restore(element, settings);

  const eventTarget = isRootElement(element) ? window : element;

  /** Allow for repeated calls to `register` (interesting for e.g. the window) */
  eventTarget.removeEventListener("scroll", element.__restore_scroll.onScroll);
  eventTarget.addEventListener("scroll", element.__restore_scroll.onScroll, {
    passive: true,
  });
}

/**
 * Unregister an element from scroll restoration
 */
function unregister(element: ScrollContainer) {
  if (!element.__restore_scroll) return;

  /** Unmark the element */
  element.removeAttribute("data-restore-scroll");

  const eventTarget = isRootElement(element) ? window : element;

  eventTarget.removeEventListener("scroll", element.__restore_scroll.onScroll);

  element.__restore_scroll = undefined;
}
