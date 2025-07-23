import { test, expect } from "@playwright/test";

test("should start game and log action", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.click("text=Start");
    await page.click("text=Bet");
    await expect(page.locator("text=Bet 40 by Player 1")).toBeVisible();
});