import { vi } from "vitest";
import cssEscape from "css.escape";

// Stub browser functions for vitest
// console.log = vi.fn();
// console.warn = vi.fn();
// console.error = vi.fn();

// Polyfill CSS.escape for jsdom using the css.escape package
if (!globalThis.CSS) {
  globalThis.CSS = {} as CSS;
}
if (!globalThis.CSS.escape) {
  globalThis.CSS.escape = cssEscape;
}
