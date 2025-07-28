import { beforeEach, describe, expect, it } from "vitest";

import { commitScrollState, readScrollState } from "../../../src/helpers.ts";

describe("readScrollState", () => {
  beforeEach(() => {
    commitScrollState({});
  });

  it("should return the scroll state from the history", () => {
    const expected = { ":root": { top: 100, left: 200 } };
    commitScrollState(expected);
    expect(readScrollState()).toEqual(expected);
  });

  it("should return an empty object on failure", () => {
    /** @ts-expect-error passing invalid scroll state */
    commitScrollState({ anything: { top: 100 } });
    expect(readScrollState()).toEqual({});
  });
});
