import { describe, expect, it } from "vitest";

import { getScrollState } from "../../../src/helpers.ts";

describe("getScrollState", () => {
  it("should return the scroll state from the history", () => {
    const expected = { ":root": { top: 100, left: 200 } };
    window.history.replaceState(
      { restoreScroll: expected },
      "",
      window.location.href
    );
    expect(getScrollState()).toEqual(expected);
  });

  it("should return an empty object on failure", () => {
    window.history.replaceState(
      { restoreScroll: { anything: { top: 100 } } },
      "",
      window.location.href
    );
    expect(getScrollState()).toEqual({});
  });
});
