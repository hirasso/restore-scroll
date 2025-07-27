import { describe, expect, it } from "vitest";

import * as ScrollMemoryModule from "../../../src/index.js";
import ScrollMemory from "../../../src/index.js";
import type { Options } from "../../../src/index.js";
import * as ScrollMemoryTS from "../../../src/ScrollMemory.js";

describe("Exports", () => {
  it("should have the correct exports for the es6 module", () => {
    expect(Object.keys(ScrollMemoryModule)).toEqual([
      "getScrollProgress",
      "hasOverflow",
      "hasCSSOverflow",
      "nextTick",
      "default",
    ]);

    const instance = new ScrollMemoryModule.default([
      document.createElement("div"),
    ]);
    expect(instance).toBeInstanceOf(ScrollMemory)
  });

  it("should only have a default export for the UMD bundle", () => {
    expect(Object.keys(ScrollMemoryTS)).toEqual(["default"]);
  });
});
