import type {
  Target,
  Options,
  ScrollPosition,
  Logger,
  AugmentedElement,
} from "./defs.js";

import {
  debounce,
  createLogger,
  isScrollPosition,
  getStorageSelector,
  collect,
  getScrollMemoryFromState,
  getScrollContainer,
} from "./helpers.js";

/** Keep track of remembered elements */
const elements = new WeakSet<Element>();

/** The logger prefix for the debug mode */
export const prefix = "scrollmemory";

/** The default options */
const defaults: Options = {
  debug: false,
};

/** Restore on load */
document.readyState === "interactive"
  ? restore()
  : window.addEventListener("DOMContentLoaded", restore);

/** Store on beforeunload */
window.addEventListener("beforeunload", storeAll);

/**
 * Restore scroll positions from the history state
 */
function restore() {
  const memory = getScrollMemoryFromState();

  if (!memory) return;

  for (const [selector, position] of Object.entries(memory)) {
    restoreElement(selector, position);
  }
}

/**
 * Restore the scroll position of an element.
 */
function restoreElement(selector: string, position: unknown): void {
  if (!isScrollPosition(position)) {
    return;
  }
  const { top, left, debug } = position;
  const logger = debug ? createLogger() : undefined;

  const element = getScrollContainer(selector);
  if (!element) {
    return logger?.warn(`No element found for '${selector}'`);
  }

  /** Wait for the element to have a height before attempting to scroll */
  const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
    if (!contentRect.height) return;
    resizeObserver.disconnect();
    element.scrollTo({ top, left, behavior: "instant" });
    logger?.state("🔄 restored:", { selector, ...position, element });
  });
  resizeObserver.observe(element);

  /** Do not wait longer than 100ms */
  setTimeout(() => resizeObserver.disconnect(), 100);

  /** store once */
  storeElement(augment(element)!, logger);
}

/**
 * Augment an element with custom properties
 */
function augment(element: Element, logger?: Logger): AugmentedElement | null {
  const augmented = element as AugmentedElement;
  const selector = getStorageSelector(element);

  if (!selector) {
    logger?.error("Could not create a selector from", element);
    return null;
  }

  augmented.__scrollmemory = { selector };

  return augmented;
}

/**
 * Track the scroll position of an element
 */
export function remember(target: Target | null, options: Partial<Options> = {}): void {
  if (!target) return;
  track(target, options);
}

/**
 * Track and remember the scroll position for a target
 */
function track(target: Target, _options: Partial<Options> = {}): void {
  const element = resolveTarget(target);

  /** Handle an array of elements recursively */
  if (Array.isArray(element)) {
    return element.forEach((el) => track(el, _options));
  }

  if (elements.has(element)) return;

  elements.add(element);

  const options = { ...defaults, ..._options };

  element.setAttribute("data-scrollmemory", options.debug ? "debug" : "");

  const logger = options.debug ? createLogger() : undefined;

  const augmented = augment(element, logger);
  if (!augmented) return;

  const scrollTarget = element.matches("body *") ? element : window;
  const scrollHandler = debounce(() => storeElement(augmented, logger), 150);

  scrollTarget.addEventListener("scroll", scrollHandler, { passive: true });
}

/**
 * Resolve the target to an element or an array of elements
 */
function resolveTarget(target: Target): Element | Element[] {
  /** Resolve the window to the scrollingElement */
  if (target instanceof Window) {
    return document.scrollingElement || document.documentElement;
  }

  /** convert a node list to an array */
  if (target instanceof NodeList) {
    return [...target];
  }

  return target;
}

/**
 * Store the current scroll position of an element to the history state
 */
function storeElement(element: AugmentedElement, logger?: Logger): void {
  const { selector } = element.__scrollmemory || {};

  if (!selector) {
    logger?.warn("No selector present for", element);
    return;
  }

  const state = window.history.state || {};
  const scrollmemory = state.scrollmemory || {};

  const position: ScrollPosition = {
    top: element.scrollTop,
    left: element.scrollLeft,
    debug: !!logger,
  };
  scrollmemory[selector] = position;

  /** store the position in the element itself */
  element.__scrollmemory = {
    ...element.__scrollmemory,
    position,
  };

  const newState = {
    ...state,
    scrollmemory,
  };

  window.history.replaceState(newState, "");

  logger?.state("💾 stored:", { element, ...position });
}

/**
 * Store all positions before unload
 */
function storeAll(): void {
  const state: Record<string, ScrollPosition> = {};

  collect<AugmentedElement>("[data-scrollmemory]")
    .map((el) => el.__scrollmemory)
    .filter((data) => !!data)
    .forEach(({ selector, position }) => {
      if (typeof selector !== "string") return;
      if (!isScrollPosition(position)) return;

      state[selector] = position;
    });

  const newState = {
    ...(window.history.state || {}),
    state,
  };

  window.history.replaceState(newState, "");
}
