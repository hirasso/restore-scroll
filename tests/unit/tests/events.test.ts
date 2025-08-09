import { vi, afterEach, beforeEach, describe, expect, it } from "vitest";

import { dispatch } from "../../../src/events.ts";
import { ScrollPosition, Settings } from "../../../src/defs.ts";

const settingsWithEvents: Settings = {
  events: {
    store: (el, event) => console.log(el, event.type, event.detail),
    restore: (el, event) => console.log(el, event.type, event.detail),
  },
};
const eventDetail = { position: { top: 100, left: 200 } };

describe("events", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log");
    document.body.innerHTML = /*html*/ `
      <div class="foo"></div>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("dispatches declarative events", () => {
    const el = document.querySelector(".foo")!;
    dispatch(el, "store", eventDetail, settingsWithEvents);
    dispatch(el, "restore", eventDetail, settingsWithEvents);

    expect(logSpy).toBeCalledWith(el, "restore-scroll:store", eventDetail);
    expect(logSpy).toBeCalledWith(el, "restore-scroll:restore", eventDetail);
    expect(logSpy).toBeCalledTimes(2);
  });

  it("dispatches DOM events", () => {
    const el = document.querySelector(".foo")!;

    el.addEventListener("restore-scroll:store", (e) => {
      const event = e as CustomEvent<{ position: ScrollPosition }>;
      console.log(el, event.type, event.detail);
    });
    el.addEventListener("restore-scroll:restore", (e) => {
      const event = e as CustomEvent<{ position: ScrollPosition }>;
      console.log(el, event.type, event.detail);
    });

    dispatch(el, "store", eventDetail, {});
    dispatch(el, "restore", eventDetail, {});

    expect(logSpy).toBeCalledWith(el, "restore-scroll:store", eventDetail);
    expect(logSpy).toBeCalledWith(el, "restore-scroll:restore", eventDetail);
    expect(logSpy).toBeCalledTimes(2);
  });

  it("Always dispatches both event types (declarative as well as DOM)", () => {
    const el = document.querySelector(".foo")!;

    el.addEventListener("restore-scroll:store", (e) => {
      const event = e as CustomEvent<{ position: ScrollPosition }>;
      console.log(el, event.type, event.detail);
    });
    el.addEventListener("restore-scroll:restore", (e) => {
      const event = e as CustomEvent<{ position: ScrollPosition }>;
      console.log(el, event.type, event.detail);
    });

    dispatch(el, "store", eventDetail, settingsWithEvents);
    dispatch(el, "restore", eventDetail, settingsWithEvents);

    expect(logSpy).toBeCalledWith(el, "restore-scroll:store", eventDetail);
    expect(logSpy).toBeCalledWith(el, "restore-scroll:restore", eventDetail);
    expect(logSpy).toBeCalledTimes(4);
  });

  it("Respects preventDefault", () => {
    const el = document.querySelector(".foo")!;
    const settings: Settings = {
      events: {
        restore: (el, event) => {
          event.preventDefault();
        },
      },
    };
    const canceled = !dispatch(el, "restore", eventDetail, settings);
    expect(canceled).toBe(true);
  });
});
