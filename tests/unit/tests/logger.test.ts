import { vi, describe, expect, it, beforeEach, afterEach } from "vitest";

import ScrollMemory from "../../../src/index.js";

describe("Logger", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn");
    errorSpy = vi.spyOn(console, "error");
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("should log if debug is true", () => {
    new ScrollMemory([], { debug: true });

    expect(warnSpy).toBeCalledWith(
      expect.anything(),
      "No elements provided.",
      expect.anything()
    );
  });

  it("should not log if debug is false", () => {
    new ScrollMemory([], { debug: false });
    expect(warnSpy).not.toBeCalled();
  });
});
