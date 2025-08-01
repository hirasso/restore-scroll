import { vi, afterEach, beforeEach, describe, expect, it } from "vitest";

import restoreScroll from "../../../src/restoreScroll.ts";
import { wait } from "../support.ts";
import { dispatch } from "../../../src/events.ts";
import { ScrollPosition, Settings } from "../../../src/defs.ts";

describe("events", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log");
    document.body.innerHTML = /*html*/ `
      <div class="foo"></div>
    `;
  });

  afterEach(() => {
    logSpy.mockRestore();
    document.body.innerHTML = "";
  });

  it("dispatches declarative events", async () => {
    const el = document.querySelector(".foo")!;

    const settings: Settings = {
      events: {
        store: (el, event) =>
          console.log(el, event.type, event.detail.position),
        restore: (el, event) =>
          console.log(el, event.type, event.detail.position),
      },
    };
    const position = { top: 100, left: 0 };
    dispatch(el, "store", { position }, settings);
    dispatch(el, "restore", { position }, settings);

    expect(logSpy).toBeCalledWith(el, "restore-scroll:store", position);
    expect(logSpy).toBeCalledWith(el, "restore-scroll:restore", position);
  });

  it("dispatches DOM events", async () => {
    const el = document.querySelector(".foo")!;

    el.addEventListener("restore-scroll:store", (e) => {
      const event = e as CustomEvent<{position: ScrollPosition}>;
      console.log(el, event.type, event.detail.position);
    });
    el.addEventListener("restore-scroll:restore", (e) => {
      const event = e as CustomEvent<{position: ScrollPosition}>;
      console.log(el, event.type, event.detail.position);
    });

    const position = { top: 100, left: 0 };
    dispatch(el, "store", { position }, {});
    dispatch(el, "restore", { position }, {});

    expect(logSpy).toBeCalledWith(el, "restore-scroll:store", position);
    expect(logSpy).toBeCalledWith(el, "restore-scroll:restore", position);
  });
});
