import { describe, expect, it } from "vitest";

import {
  getScrollState,
  isScrollPosition,
  isScrollState,
} from "../../../src/helpers.ts";

describe("isScrollPosition", () => {
  it("should accept a valid scroll position", () => {
    expect(isScrollPosition({ top: 0, left: 200 })).toEqual(true);
  });

  it("should allow extra properties", () => {
    expect(isScrollPosition({ top: 0, left: 200, extra: "foo" })).toEqual(true);
  });

  it("should detect missing properties", () => {
    expect(isScrollPosition({ top: 0 })).toEqual(false);
  });
});

describe("isScrollState", () => {
  it("should accept a valid scroll state", () => {
    expect(
      isScrollState({
        ":root": { top: 0, left: 200 },
      })
    ).toEqual(true);
  });

  it("should reject an invalid scroll state", () => {
    expect(isScrollState([{ top: 0, left: 200 }])).toEqual(false);
  });
});
