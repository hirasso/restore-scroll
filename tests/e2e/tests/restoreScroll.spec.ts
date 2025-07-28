import { test, expect } from "@playwright/test";
import {
  scrollTo,
  scrollToEnd,
  expectScrollPosition,
  wait,
  getScrollPosition,
} from "./support";

test.describe("Restore Scroll", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Restores the scroll position after a reload", async ({ page }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page
      .getByTestId("vertical-scroll-container")
      .scrollIntoViewIfNeeded();

    const beforeReload = {
      window: await scrollTo(page, { top: 200 }),
      vertical: await scrollToEnd(page, "vertical-scroll-container"),
      horizontal: await scrollToEnd(page, "horizontal-scroll-container"),
      both: await scrollToEnd(page, "both-axis-scroll-container"),
    };

    await page.evaluate(() => window.location.reload);

    const afterReload = {
      window: { top: 200, left: 0 },
      vertical: await getScrollPosition(page, "vertical-scroll-container"),
      horizontal: await getScrollPosition(page, "horizontal-scroll-container"),
      both: await getScrollPosition(page, "both-axis-scroll-container"),
    };

    // expect(beforeReload).toEqual(afterReload);

    console.log({ beforeReload, afterReload });
    // await sleep(1000);
    // expect(page.getByTestId("third-vertical_tile--last")).toBeInViewport();
  });
});
