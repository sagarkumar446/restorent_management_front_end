const { test, expect } = require("@playwright/test");
const DinePage = require("../pages/DinePage");
const { instrument } = require("../support/instrument");

test.beforeEach(async ({ page }) => {
  await instrument(page);
});

test("dine page lists tables from API", async ({ page }) => {
  const tablesResponse = page.waitForResponse(
    (r) => r.url().includes("/customers/tables") && r.ok()
  );
  const dine = await new DinePage(page).open("/dine");
  const resp = await tablesResponse;
  const body = await resp.json();

  await expect(dine.heading).toBeVisible();
  if ((body.data || []).length > 0) {
    await expect(dine.tableTitles().first()).toBeVisible();
  }
});

test("check available tables returns result", async ({ page }) => {
  const dine = await new DinePage(page).open("/dine");
  const avail = page.waitForResponse((r) =>
    r.url().includes("/customers/tables/available")
  );
  await dine.checkAvailabilityButton.click();
  const resp = await avail;
  expect(resp.status()).toBe(200);
  await expect(dine.availabilityResult()).toBeVisible({ timeout: 15000 });
});
