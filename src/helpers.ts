import type {
  Logger,
  ScrollContainer,
  ScrollPosition,
  ScrollState,
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
    requestAnimationFrame(() => resolve());
  });
};

/** Check if an element has overflow */
export const hasOverflow = ({
  clientWidth,
  clientHeight,
  scrollWidth,
  scrollHeight,
}: HTMLElement) => {
  return scrollHeight > clientHeight || scrollWidth > clientWidth;
};

/**
 * Minimal debounce function.
 * @see https://www.joshwcomeau.com/snippets/javascript/debounce/
 */
export function debounce<F extends (...args: unknown[]) => unknown>(
  callback: F,
  wait = 0
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
function isRecord(value: unknown): boolean {
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
      ([key, value]) => typeof key === "string" && isScrollPosition(value)
    )
  );
}

/**
 * Get stored restore-scroll state, filter out invalid records
 */
export function getScrollState(): ScrollState {
  const state = window.history.state?.scrollState;
  return isScrollState(state) ? state : {};
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
export function createStorageSelector(
  element: Element,
  logger?: Logger
): string {
  if (element.matches("body *") && !element.id) {
    logger?.log(
      "💡 for best results, add an [id] to elements you want to restore",
      { element }
    );
  }
  return element.matches("body *") ? createUniqueSelector(element) : ":root";
}

/**
 * Read the storage selector, log if none exists
 */
export function readStorageSelector(
  element: ScrollContainer,
  logger?: Logger
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
 * Query a scroll container by selector
 */
export function getScrollContainer(selector: string): Element | null {
  try {
    return document.querySelector(selector);
  } catch (e) {
    return null;
  }
}
