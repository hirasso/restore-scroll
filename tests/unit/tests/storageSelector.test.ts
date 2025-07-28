import { afterEach, describe, expect, it } from "vitest";

import { createStorageSelector } from "../../../src/helpers.ts";
import { createElement } from "../support.ts";
import restoreScroll from "../../../src/restoreScroll.ts";
import { ScrollContainer } from "../../../src/defs.ts";

describe("createStorageSelector", () => {
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
        `)
    );
    expect(createStorageSelector(document.querySelector(".scroller")!)).toEqual(
      "html > body:nth-child(2) > main > div.scroller:nth-child(3)"
    );
  });

  it("should use ':root' if not inside the body", () => {
    expect(createStorageSelector(document.documentElement)).toEqual(":root");
    expect(createStorageSelector(document.body)).toEqual(":root");
  });

  it("should use the [id] attribute if available", () => {
    document.body.append(
      createElement(/*html*/ `
          <main>
            <div></div>
            <div></div>
            <div id="scroller"></div>
          </main>
        `)
    );

    expect(createStorageSelector(document.querySelector("#scroller")!)).toEqual(
      "#scroller"
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
        `)
    );
    restoreScroll(document.querySelector(".scroller"));
    expect(
      document.querySelector<ScrollContainer>(".scroller")?.__restore_scroll
        ?.selector
    ).toEqual("html > body:nth-child(2) > main > div.scroller:nth-child(3)");
  });
});
