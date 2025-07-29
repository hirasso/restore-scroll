import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { resolveTarget } from "../../../src/helpers.ts";

describe("resolveTarget", () => {
  beforeEach(() => {
    document.body.innerHTML = /*html*/ `
      <div class="foo"></div>
      <div class="bar"></div>
      <div class="baz"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("resolves a string to an array of elements", () => {
    expect(resolveTarget("div")).toEqual([...document.querySelectorAll("div")]);
  });

  it("resolves the window to the document root", () => {
    expect(resolveTarget(window)).toEqual([document.documentElement]);
  });

  it("Always returns an array", () => {
    const el = document.querySelector(".bar");
    expect(resolveTarget(el)).toEqual([el]);
  });

  it("resolves a NodeList to an Array", () => {
    const nodeList = document.querySelectorAll("div");
    const array = [...nodeList];
    expect(resolveTarget(nodeList)).toEqual(array);
  });
});
