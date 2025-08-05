import { test, expect } from "@playwright/test";
import { scrollTo, scrollToEnd, getScrollPosition, wait } from "./support";

test.describe("Restore Scroll", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/e2e");
  });

  test("Restores scroll positions after a reload", async ({ page }) => {
    page.setViewportSize({ width: 1000, height: 1000 });
    await page
      .getByTestId("vertical-scroll-container")
      .scrollIntoViewIfNeeded();

    const randomBeforeReload = await page.getByTestId("random").textContent();

    const beforeReload = {
      window: await scrollTo(page, { top: 200 }),
      vertical: await scrollToEnd(page, "vertical-scroll-container"),
      horizontal: await scrollToEnd(page, "horizontal-scroll-container"),
      both: await scrollToEnd(page, "both-axis-scroll-container"),
    };

    /**
     * await page.reload({ waitUntil: "networkidle" }); causes problems with FireFox.
     * The following seems to be working.
     */
    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.evaluate(() => window.location.reload()),
    ]);

    const randomAfterReload = await page.getByTestId("random").textContent();
    expect(randomBeforeReload).not.toBe(randomAfterReload);

    const afterReload = {
      window: { top: 200, left: 0 },
      vertical: await getScrollPosition(page, "vertical-scroll-container"),
      horizontal: await getScrollPosition(page, "horizontal-scroll-container"),
      both: await getScrollPosition(page, "both-axis-scroll-container"),
    };

    expect(beforeReload).toEqual(afterReload);
  });
});
