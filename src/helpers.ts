import type {
  Logger,
  ScrollContainer,
  ScrollPosition,
  ScrollState,
  Target,
} from "./defs.js";

/** The logger prefix for the debug mode */
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
 * Create a unique CSS selector for a given DOM element.
 * The selector is built from tag names, IDs, classes, and :nth-child where necessary.
 */
function createUniqueSelector(el: Element): string {
  if (el.id) return `#${el.id}`;

  const path: string[] = [];

  // Traverse up the DOM tree from the element to the root <html> element
  while (el && el.nodeType === Node.ELEMENT_NODE) {
    // Start with the lowercase tag name (e.g., "div", "span")
    let selector = el.nodeName.toLowerCase();

    // If the element has an ID, use it as it's guaranteed to be unique in the document
    if (el.id) {
      selector += `#${el.id}`;
      path.unshift(selector); // Add to the beginning of the path
      break; // No need to go further up the tree
    }

    // If the element has class names, add them (dot-separated like in CSS)
    if (el.className && typeof el.className === "string") {
      // Clean up and convert class names to a valid CSS class selector
      const classes = el.className.trim().split(/\s+/).join(".");
      if (classes) {
        selector += `.${classes}`;
      }
    }

    // Use :nth-child() if the element is one of multiple siblings
    const parent = el.parentNode as Element;
    if (parent) {
      const siblings = Array.from(parent.children);
      if (siblings.length > 1) {
        // Get the element's index among its siblings (1-based index for CSS)
        const index = siblings.indexOf(el) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    // Add the constructed selector for this level to the front of the path
    path.unshift(selector);

    // Move up to the parent element
    el = el.parentElement!;
  }

  // Combine all parts of the path with `>` to form a full unique selector
  return path.join(" > ");
}

/**
 * Get the storage key for an element
 */
export function createContainerSelector(
  element: Element,
  logger?: Logger,
): string {
  if (element.matches("body *") && !element.id) {
    logger?.log(
      "💡 for best results, add an [id] to elements you want to restore",
      { element },
    );
  }
  return element.matches("body *") ? createUniqueSelector(element) : ":root";
}

/**
 * Read the storage selector, log if none exists
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
export function resolveTarget(target: Target | null): Element[] {
  /** The window */
  if (target === window) {
    return [document.scrollingElement ?? document.documentElement];
  }

  /** One element */
  if (target instanceof Element) {
    return [target];
  }

  /** Handle a string like a selector */
  if (typeof target === "string") {
    return [...document.querySelectorAll(target)];
  }

  /** Ensure an array */
  if (target instanceof NodeList) {
    return [...target];
  }

  /** Not an array */
  if (!Array.isArray(target)) {
    return [];
  }

  /** Filter out records */
  return target.filter((record) => record instanceof Element);
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
