import type {
  Logger,
  ScrollContainer,
  ScrollPosition,
  ScrollState,
  Target,
} from "./defs.js";
import { finder } from "@medv/finder";

/** The logger and event prefix for the debug mode */
export const prefix = "restore-scroll";

/** Create a minimal logger with a prefix */
export function createLogger() {
  const style = [
    "background: linear-gradient(to right, #a960ee, #f78ed4)",
    "color: white",
    "padding-inline: 4px",
    "border-radius: 2px",
    "font-family: monospace",
  ].join(";");

  return {
    log: (...args: any[]) => console.log(`%c${prefix}`, style, ...args),
    warn: (...args: any[]) => console.warn(`%c${prefix}`, style, ...args),
    error: (...args: any[]) => console.error(`%c${prefix}`, style, ...args),
  };
}

/** Return a Promise that resolves after the next event loop. */
export const nextTick = (): Promise<void> => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
};

/**
 * Minimal debounce function.
 * @see https://www.joshwcomeau.com/snippets/javascript/debounce/
 */
export function debounce<F extends (...args: unknown[]) => unknown>(
  callback: F,
  wait = 0,
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
}

/**
 * Check if an unknown value is a non-empty object
 */
export function isRecord(value: unknown): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Check if an unknown value has the shape of the ScrollPosition type
 */
export function isScrollPosition(value: unknown): value is ScrollPosition {
  return (
    isRecord(value) &&
    typeof (value as Record<string, unknown>).top === "number" &&
    typeof (value as Record<string, unknown>).left === "number"
  );
}

/**
 * Check if an unknown value has the shape of the restoreScroll type
 */
export function isScrollState(value: unknown): value is ScrollState {
  return (
    isRecord(value) &&
    Object.entries(value as Record<string, unknown>).every(
      ([key, value]) => typeof key === "string" && isScrollPosition(value),
    )
  );
}

/**
 * Create a unique CSS selector for a given DOM element in the current page
 * Uses @medv/finder for robust selector generation.
 *
 * @see https://github.com/antonmedv/finder
 */
export function createUniqueSelector(el: Element, logger?: Logger): string {
  try {
    return finder(el, {
      root: document.body,
    });
  } catch (error) {
    logger?.error("couldn't create a unique selector:", { error, el });
    return "";
  }
}

/**
 * Get the container selector for an element
 */
export function createContainerSelector(
  element: Element,
  logger?: Logger,
): string {
  if (!isRootElement(element) && !element.id) {
    logger?.log(
      "💡 for best results, add an [id] to elements you want to restore",
      { element },
    );
  }
  return element.matches("body *")
    ? createUniqueSelector(element, logger)
    : ":root";
}

/**
 * Check if an element is a root element (<html> or <body>)
 */
export function isRootElement(element: unknown): boolean {
  return (
    element instanceof HTMLHtmlElement || element instanceof HTMLBodyElement
  );
}

/**
 * Read the container selector, log if none exists
 */
export function readContainerSelector(
  element: ScrollContainer,
  logger?: Logger,
): string | undefined {
  const { selector } = element.__restore_scroll || {};

  if (typeof selector !== "string") {
    logger?.error("Invalid selector", { selector, element });
    return;
  }

  if (!selector) {
    logger?.error("No selector available", { element });
    return;
  }

  return selector;
}

/**
 * Read the scroll state from the current history
 */
export function readScrollState(): ScrollState {
  const state = window.history.state?.restoreScroll;
  return isScrollState(state) ? state : {};
}

/**
 * Commit the provided scroll state to the history
 */
export function commitScrollState(state: ScrollState) {
  if (!isScrollState(state)) {
    return console.error("Invalid scroll state", state);
  }

  window.history.replaceState(
    {
      ...(window.history.state ?? {}),
      restoreScroll: state,
    },
    "",
  );
}

/**
 * Resolve a target
 */
export function resolveTarget(target: Target | null): Element | null {
  if (!target) return null;

  if (target === window || isRootElement(target)) {
    return document.scrollingElement ?? document.documentElement;
  }

  return target instanceof Element ? target : null;
}

/**
 * Check if two objects contain equal values
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a == null ||
    b == null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}
