import { describe, expect, it } from "vitest";

import * as moduleFile from "../../../src/index.js";
import * as umdFile from "../../../src/restoreScroll.js";

describe("Exports", () => {
  it("should have the correct exports for the es6 module", () => {
    expect(Object.keys(moduleFile)).toEqual([
      "restoreScroll",
    ]);
  });

  it("should only have a default export for the UMD bundle", () => {
    expect(Object.keys(umdFile)).toEqual(["default"]);
  });
});