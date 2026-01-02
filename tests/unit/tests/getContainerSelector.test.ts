import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getContainerSelector,
  createLogger,
  createUniqueSelector,
} from "../../../src/helpers.ts";
import { createElement } from "../support.ts";
import restoreScroll from "../../../src/restoreScroll.ts";
import { ScrollContainer } from "../../../src/defs.ts";

describe("getContainerSelector", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should generate a selector from the path", () => {
    document.body.append(
      createElement(/*html*/ `
          <main>
            <div></div>
            <div></div>
            <div class="scroller"></div>
          </main>
        `),
    );
    // The finder library generates optimized selectors
    // In this case, .scroller is unique enough
    expect(getContainerSelector(document.querySelector(".scroller")!)).toEqual(
      ".scroller",
    );
  });

  it("should use ':root' if not inside the body", () => {
    expect(getContainerSelector(document.documentElement)).toEqual(":root");
    expect(getContainerSelector(document.body)).toEqual(":root");
  });

  it("should use the [id] attribute if available", () => {
    document.body.append(
      createElement(/*html*/ `
          <main>
            <div></div>
            <div></div>
            <div id="scroller"></div>
          </main>
        `),
    );

    expect(getContainerSelector(document.querySelector("#scroller")!)).toEqual(
      "#scroller",
    );
  });

  it("should inject the storage selector into the element", () => {
    document.body.append(
      createElement(/*html*/ `
          <main>
            <div></div>
            <div></div>
            <div class="scroller"></div>
          </main>
        `),
    );
    restoreScroll(document.querySelector(".scroller"));
    // The finder library generates optimized selectors
    expect(
      document.querySelector<ScrollContainer>(".scroller")?.__restore_scroll
        ?.selector,
    ).toEqual(".scroller");
  });

  it("should mask errors from `@medv/finder`", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = createLogger();
    // @ts-expect-error
    expect(() => createUniqueSelector(null, logger)).not.toThrow();
    expect(
      spy.mock.calls.some(
        (args) => args[2] === "couldn't create a unique selector:",
      ),
    ).toBe(true);
    vi.restoreAllMocks();
  });
});
