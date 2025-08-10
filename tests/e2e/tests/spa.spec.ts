import { test, expect } from "@playwright/test";
import {
  scrollTo,
  wait,
  expectScrollPosition,
  waitForEvent,
  scrollToEnd,
  getScrollPosition,
  waitForSwup,
} from "./support";
import { SCROLL_DEBOUNCE_MS } from "../../../src/defs.ts";

test.describe("Single Page Apps", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/spa-1/");
  });

  test("Restores the window scroll position in Single Page Apps", async ({
    page,
  }) => {
    page.setViewportSize({ width: 1000, height: 1200 });
    const page1Position = await scrollTo(page, { top: 300 });
    let visitEndPromise: Promise<void>;

    await wait(SCROLL_DEBOUNCE_MS * 2);

    await waitForSwup(page);

    await page.locator('a[href="/spa-2/"]').click();
    await waitForEvent(page, "swup:visit:end");

    const page2Position = await scrollToEnd(page);
    await wait(SCROLL_DEBOUNCE_MS * 2);

    visitEndPromise = waitForEvent(page, "swup:visit:end");
    await page.goBack();
    await visitEndPromise;

    expect(await getScrollPosition(page)).toStrictEqual(page1Position);

    visitEndPromise = waitForEvent(page, "swup:visit:end");
    await page.goForward();
    await visitEndPromise;

    expect(await getScrollPosition(page)).toStrictEqual(page2Position);
  });

});
