import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { resolveTarget } from "../../../src/helpers.ts";

describe("resolveTarget", () => {
  beforeEach(() => {
    document.body.innerHTML = /*html*/ `
      <div class="foo"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("resolves the window to the document root", () => {
    expect(resolveTarget(window)).toEqual(document.documentElement);
  });

  it("Returns either an element or nothing", () => {
    const existing = document.querySelector(".foo");
    const missing = document.querySelector(".waldo");
    expect(resolveTarget(existing)).toEqual(existing);
    expect(resolveTarget(missing)).toEqual(null);
  });

  it("Returns nothing for lists", () => {
    const nodeList = document.querySelectorAll("div");
    const array = [...nodeList];
    /** @ts-expect-error */
    expect(resolveTarget(nodeList)).toEqual(null);
    /** @ts-expect-error */
    expect(resolveTarget(array)).toEqual(null);
  });
});
