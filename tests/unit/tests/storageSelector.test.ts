import { afterEach, describe, expect, it } from "vitest";

import { createContainerSelector } from "../../../src/helpers.ts";
import { createElement } from "../support.ts";
import restoreScroll from "../../../src/restoreScroll.ts";
import { ScrollContainer } from "../../../src/defs.ts";

describe("createContainerSelector", () => {
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
    expect(
      createContainerSelector(document.querySelector(".scroller")!),
    ).toEqual(".scroller");
  });

  it("should use ':root' if not inside the body", () => {
    expect(createContainerSelector(document.documentElement)).toEqual(":root");
    expect(createContainerSelector(document.body)).toEqual(":root");
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

    expect(
      createContainerSelector(document.querySelector("#scroller")!),
    ).toEqual("#scroller");
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
});
