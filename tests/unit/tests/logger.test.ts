import { vi, describe, expect, it, beforeEach, afterEach } from "vitest";

import { restoreScroll } from "../../../src/index.js";
import { createElement } from "../support.js";

describe("Logger", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn");
    errorSpy = vi.spyOn(console, "error");
    document.body.append(
      createElement(/*html*/ `
      <div>
        <div class="scroller" data-restore-scroll></div>
      </div>
    `)
    );
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
    document.body.innerHTML = "";
  });

  it("should log if debug is true", () => {
    restoreScroll(document.querySelector(".scroller"), { debug: true });

    expect(warnSpy).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      "Already initialized:",
      expect.anything()
    );
  });

  it("should not log if debug is false", () => {
    restoreScroll(document.querySelector(".scroller"), { debug: false });
    expect(warnSpy).not.toBeCalled();
  });
});
