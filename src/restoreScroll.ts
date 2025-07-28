import type { Target, Options, ScrollContainer } from "./defs.js";

import { debounce, createLogger, createStorageSelector } from "./helpers.js";
import { restore } from "./restore.js";
import { store, storeAll } from "./store.js";

/** The default options */
const defaults: Options = {
  debug: false,
};

/** Hook into beforeunload */
let hookedIntoBeforeUnlad = false;

/**
 * Track the scroll position of an element
 */
export default function restoreScroll(
  target: Target | null,
  options: Partial<Options> = {}
) {
  const settings = { ...defaults, ...options };
  const logger = settings.debug ? createLogger() : undefined;

  if (!target) {
    return logger?.error("no target provided");
  }

  /** Handle a collection of targets recursively */
  if (target instanceof NodeList || Array.isArray(target)) {
    return [...target].forEach((target) => restoreScroll(target, options));
  }

  /** Resolve the window to the root scrolling element */
  const element = (
    target === window
      ? (document.scrollingElement ?? document.documentElement)
      : target
  ) as ScrollContainer;

  /** Prevent double initialization */
  if (element.hasAttribute("data-restore-scroll")) {
    return logger?.error("Already handled:", element);
  }

  /** Mark the element */
  element.setAttribute("data-restore-scroll", "");

  /** Create and store the selector in the element */
  element.__restore_scroll = {
    selector: createStorageSelector(element, logger),
  };

  const scrollTarget = element.matches("body *") ? element : window;
  const onScroll = debounce(() => store(element, logger), 150);

  scrollTarget.addEventListener("scroll", onScroll, { passive: true });

  restore(element, logger);

  /** Store all on beforeunload */
  if (!hookedIntoBeforeUnlad) {
    hookedIntoBeforeUnlad = true;
    window.addEventListener("beforeunload", storeAll);
  }
  return {element};
}
