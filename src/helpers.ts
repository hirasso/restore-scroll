import type { ScrollPosition, ScrollMemory } from "./defs.js";
import { prefix } from "./index.js";

/** Create a minimal logger with a prefix */
export function createLogger() {
  const style = [
    "background: linear-gradient(to right, #a960ee, #f78ed4)",
    "color: white",
    "font-weight: bold",
    "padding: 2px 6px",
    "border-radius: 4px",
  ].join(";");

  return {
    state: (state: string, ...args: any[]) => console.log(`%c${prefix} ${state}`, style, ...args),
    log: (...args: any[]) => console.log(`%c${prefix} ${args[0]}`, style, ...args),
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
function isObject(value: unknown): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Check if an unknown value has the shape of the ScrollPosition type
 */
export function isScrollPosition(value: unknown): value is ScrollPosition {
  return (
    isObject(value) &&
    typeof (value as Record<string, unknown>).top === "number" &&
    typeof (value as Record<string, unknown>).left === "number" &&
    typeof (value as Record<string, unknown>).debug === "boolean"
  );
}

/**
 * Check if an unknown value has the shape of the ScrollMemory type
 */
export function isScrollMemory(value: unknown): value is ScrollMemory {
  return (
    isObject(value) &&
    !Array.isArray(value) &&
    Object.entries(value as Record<string, unknown>).every(
      ([key, value]) => typeof key === "string" && isScrollPosition(value)
    )
  );
}

/**
 * Get stored scrollmemory state, filter out invalid records
 */
export function getScrollMemoryFromState(): ScrollMemory | null {
  const memory = window.history.state?.scrollmemory || {};

  if (!isObject(memory)) return null;

  return Object.fromEntries(
    Object.entries(memory).filter(
      ([key, value]) => typeof key === "string" && isScrollPosition(value)
    )
  ) as ScrollMemory;
}

/**
 * Get a unique CSS selector for a given DOM element.
 * The selector is built from tag names, IDs, classes, and :nth-child where necessary.
 */
function getUniqueSelector(el: Element): string {
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
export function getStorageSelector(element: Element): string {
  if (!element.matches("body *")) {
    return ":root";
  }
  return getUniqueSelector(element);
}

/**
 * Query all elements as an array
 */
export function collect<T extends Element>(selector: string): T[] {
  return [...document.querySelectorAll<T>(selector)];
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