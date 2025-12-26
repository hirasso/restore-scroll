import { vi } from "vitest";

// Stub browser functions for vitest
// console.log = vi.fn();
// console.warn = vi.fn();
// console.error = vi.fn();

// Polyfill CSS.escape for jsdom
// @ts-ignore
if (!global.CSS || !global.CSS.escape) {
  // @ts-ignore
  global.CSS = global.CSS || {};
  // @ts-ignore
  global.CSS.escape = (value: string) => {
    if (typeof value !== "string") {
      throw new TypeError("CSS.escape requires a string argument");
    }
    // Simple CSS escape implementation
    return value.replace(/([ #;?%&,.+*~'"!^$[\]()=>|\/@])/g, "\\$1");
  };
}
