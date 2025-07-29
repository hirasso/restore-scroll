import type { Target, Options, ScrollContainer, Logger } from "./defs.js";

import {
  debounce,
  createLogger,
  createContainerSelector,
  resolveTarget,
} from "./helpers.js";
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

  const elements = resolveTarget(target);

  if (!elements.length) {
    logger?.warn("No targets found");
    return;
  }

  elements.forEach((el) => initializeScrollContainer(el, logger));

  /** Store all on beforeunload */
  if (!hookedIntoBeforeUnlad) {
    hookedIntoBeforeUnlad = true;
    window.addEventListener("beforeunload", storeAll);
  }
}

/**
 * Initialize a scroll container
 */
function initializeScrollContainer(element: ScrollContainer, logger?: Logger) {
  /** Prevent double initialization */
  if (element.hasAttribute("data-restore-scroll")) {
    return logger?.warn("Already initialized:", element);
  }

  /** Mark the element */
  element.setAttribute("data-restore-scroll", "");

  /** Create and store the selector in the element */
  element.__restore_scroll = {
    selector: createContainerSelector(element, logger),
  };

  const scrollTarget = element.matches("body *") ? element : window;
  const onScroll = debounce(() => store(element, logger), 150);

  scrollTarget.addEventListener("scroll", onScroll, { passive: true });

  restore(element, logger);
}
