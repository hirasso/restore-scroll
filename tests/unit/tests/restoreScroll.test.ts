import { beforeEach, describe, expect, it } from "vitest";

import { commitScrollState, readScrollState } from "../../../src/helpers.ts";
import restoreScroll from "../../../src/restoreScroll.ts";
import { wait } from "../support.ts";

describe("restoreScroll", () => {
  beforeEach(() => {
    commitScrollState({});
  });

  it("stores the window scroll position", async () => {
    restoreScroll(window);
    window.dispatchEvent(new Event("scroll"));
    await wait(200);
    expect(readScrollState()).toEqual({ ":root": { top: 0, left: 0 } });
  });
});
