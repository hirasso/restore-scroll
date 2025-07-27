import { afterEach, describe, expect, it } from "vitest";

import { createStorageSelector } from "../../../src/helpers.ts";
import { createElement } from "./support.ts";

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
});
