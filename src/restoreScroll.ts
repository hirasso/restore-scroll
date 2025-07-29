import type { Target, Options, ScrollContainer, Settings } from "./defs.js";

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
  onStore: () => {},
  onRestore: () => {},
};

/** Hook into beforeunload */
let hookedIntoBeforeUnlad = false;

/**
 * Track the scroll position of an element
 */
export default function restoreScroll(
  target: Target | null,
  options: Partial<Options> = {},
) {
  const settings: Settings = { ...defaults, ...options };
  settings.logger = settings.debug ? createLogger() : undefined;

  const elements = resolveTarget(target);

  if (!elements.length) {
    settings.logger?.warn("No targets found");
    return;
  }

  elements.forEach((el) => initializeScrollContainer(el, settings));

  /** Store all on beforeunload */
  if (!hookedIntoBeforeUnlad) {
    hookedIntoBeforeUnlad = true;
    window.addEventListener("beforeunload", storeAll);
  }
}

/**
 * Initialize a scroll container
 */
async function initializeScrollContainer(
  element: ScrollContainer,
  settings: Settings,
) {
  const { onStore, onRestore, logger } = settings;

  /** Prevent double initialization */
  if (element.hasAttribute("data-restore-scroll")) {
    return settings.logger?.warn("Already initialized:", element);
  }

  /** Mark the element */
  element.setAttribute("data-restore-scroll", "");

  /** Create and store the selector in the element */
  const selector = createContainerSelector(element, settings.logger);
  element.__restore_scroll = { selector };

  const scrollTarget = element.matches("body *") ? element : window;
  const onScroll = debounce(() => store(element, settings), 150);

  scrollTarget.addEventListener("scroll", onScroll, { passive: true });

  restore(element, settings);
}
