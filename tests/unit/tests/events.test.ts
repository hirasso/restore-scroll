import { vi, afterEach, beforeEach, describe, expect, it } from "vitest";

import { dispatch } from "../../../src/events.ts";
import { Settings, ScrollPosition } from "../../../src/defs.ts";

const log = vi.fn();

const settings: Settings = {
  events: {
    store: (el, event) => log(el, event.type, event.detail),
    restore: (el, event) => log(el, event.type, event.detail),
  },
};

const eventDetail = { position: { top: 100, left: 200 } };

function attachEventListeners(el: Element) {
  el.addEventListener("restore-scroll:store", (e) => {
    const event = e as CustomEvent<{ position: ScrollPosition }>;
    log(el, event.type, event.detail);
  });
  el.addEventListener("restore-scroll:restore", (e) => {
    const event = e as CustomEvent<{ position: ScrollPosition }>;
    log(el, event.type, event.detail);
  });
}

describe("events", () => {
  beforeEach(() => {
    document.body.innerHTML = /*html*/ `
      <div class="foo"></div>
    `;
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = "";
  });

  it("dispatches declarative events", () => {
    const el = document.querySelector(".foo")!;
    dispatch(el, "store", eventDetail, settings);
    dispatch(el, "restore", eventDetail, settings);

    expect(log).toBeCalledWith(el, "restore-scroll:store", eventDetail);
    expect(log).toBeCalledWith(el, "restore-scroll:restore", eventDetail);
    expect(log).toBeCalledTimes(2);
  });

  it("dispatches DOM events", () => {
    const el = document.querySelector(".foo")!;
    attachEventListeners(el);

    dispatch(el, "store", eventDetail, {});
    dispatch(el, "restore", eventDetail, {});

    expect(log).toBeCalledWith(el, "restore-scroll:store", eventDetail);
    expect(log).toBeCalledWith(el, "restore-scroll:restore", eventDetail);
    expect(log).toBeCalledTimes(2);
  });

  it("Always dispatches both event types (declarative as well as DOM)", () => {
    const el = document.querySelector(".foo")!;
    attachEventListeners(el);

    dispatch(el, "store", eventDetail, settings);
    dispatch(el, "restore", eventDetail, settings);

    expect(log).toBeCalledWith(el, "restore-scroll:store", eventDetail);
    expect(log).toBeCalledWith(el, "restore-scroll:restore", eventDetail);
    expect(log).toBeCalledTimes(4);
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
