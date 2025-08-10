import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

import type { ScrollPosition } from "../../../src/defs.js";

export function scrollTo(
  page: Page,
  position: Partial<ScrollPosition>,
  testId?: string
) {
  return page.evaluate(
    ({ testId, position }) => {
      const el = !!testId
        ? document.querySelector(`[data-testid="${testId}"]`)
        : document.documentElement;

      if (!el) {
        return;
      }
      el.scrollTo({ ...position, behavior: "instant" });

      return { top: el.scrollTop, left: el.scrollLeft };
    },
    {
      position,
      testId,
    }
  );
}

export function scrollToEnd(page: Page, testId?: string) {
  return page.evaluate(
    ({ testId }) => {
      const el = !!testId
        ? document.querySelector(`[data-testid="${testId}"]`)
        : document.documentElement;

      if (!el) {
        return null;
      }

      el.scrollTo({
        top: el.scrollHeight,
        left: el.scrollWidth,
        behavior: "instant",
      });

      return { top: el.scrollTop, left: el.scrollLeft };
    },
    { testId }
  );
}

export function wait(timeout = 0): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(undefined), timeout)
  );
}

export function getScrollPosition(page: Page, testId?: string) {
  return page.evaluate(
    ({ testId }) => {
      const el = !!testId
        ? document.querySelector(`[data-testid="${testId}"]`)
        : document.documentElement;

      return !!el
        ? {
            top: el.scrollTop,
            left: el.scrollLeft,
          }
        : null;
    },
    { testId }
  );
}

export async function expectScrollPosition(
  page: Page,
  expected: ScrollPosition | undefined | null,
  testId?: string
) {
  const scrollY = await page.evaluate(
    (args): ScrollPosition => {
      const el = !!args.testId
        ? document.querySelector(`[data-testid="${args.testId}"]`)
        : document.documentElement;

      return !!el
        ? { top: el.scrollTop, left: el.scrollLeft }
        : { top: -1, left: -1 };
    },
    { testId }
  );

  expect(scrollY).toEqual(expected);
}

/**
 * Wait for a DOM event on the window, e.g. "swup:visit:end"
 */
export async function waitForEvent(page: Page, event: string) {
  await page.evaluate(
    (event) =>
      new Promise<void>((resolve) => {
        window.addEventListener(event, () => resolve(), { once: true });
      }),
    event
  );
}

export async function waitForSwup(page: Page) {
	await page.waitForSelector('html.swup-enabled');
}