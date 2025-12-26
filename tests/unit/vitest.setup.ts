import { vi } from "vitest";

// Stub browser functions for vitest
// console.log = vi.fn();
// console.warn = vi.fn();
// console.error = vi.fn();

// Polyfill CSS.escape for jsdom
// Implementation based on: https://drafts.csswg.org/cssom/#the-css.escape()-method
declare global {
  interface CSS {
    escape(value: string): string;
  }
}

if (!globalThis.CSS || !globalThis.CSS.escape) {
  globalThis.CSS = globalThis.CSS || ({} as CSS);
  globalThis.CSS.escape = (value: string): string => {
    if (typeof value !== "string") {
      throw new TypeError("CSS.escape requires a string argument");
    }

    const length = value.length;
    let result = "";
    let index = 0;

    while (index < length) {
      const character = value.charAt(index);
      const charCode = character.charCodeAt(0);

      // Handle null character
      if (charCode === 0x0000) {
        result += "\uFFFD";
      }
      // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is U+007F
      else if (
        (charCode >= 0x0001 && charCode <= 0x001f) ||
        charCode === 0x007f
      ) {
        result += "\\" + charCode.toString(16) + " ";
      }
      // If the character is the first character and is a digit (U+0030 to U+0039)
      else if (index === 0 && charCode >= 0x0030 && charCode <= 0x0039) {
        result += "\\" + charCode.toString(16) + " ";
      }
      // If the character is the second character and is a digit (U+0030 to U+0039)
      // and the first character is a `-` (U+002D)
      else if (
        index === 1 &&
        charCode >= 0x0030 &&
        charCode <= 0x0039 &&
        value.charCodeAt(0) === 0x002d
      ) {
        result += "\\" + charCode.toString(16) + " ";
      }
      // If the character is the first character and is a `-` (U+002D), and there is no second character
      else if (index === 0 && length === 1 && charCode === 0x002d) {
        result += "\\" + character;
      }
      // If the character is not handled above and is greater than or equal to U+0080,
      // is `-` (U+002D) or `_` (U+005F), or is in one of the ranges [0-9] (U+0030 to U+0039),
      // [A-Z] (U+0041 to U+005A), or [a-z] (U+0061 to U+007A)
      else if (
        charCode >= 0x0080 ||
        charCode === 0x002d ||
        charCode === 0x005f ||
        (charCode >= 0x0030 && charCode <= 0x0039) ||
        (charCode >= 0x0041 && charCode <= 0x005a) ||
        (charCode >= 0x0061 && charCode <= 0x007a)
      ) {
        result += character;
      }
      // Otherwise, the escaped character
      else {
        result += "\\" + character;
      }

      index++;
    }

    return result;
  };
}
