const { test, expect } = require("@playwright/test");
const MenuPage = require("../pages/MenuPage");
const DashboardNav = require("../pages/DashboardNav");
const { instrument } = require("../support/instrument");

test.beforeEach(async ({ page }) => {
  await instrument(page);
});

test("menu loads items from API", async ({ page }) => {
  const menu = new MenuPage(page);
  const menuResponse = page.waitForResponse(
    (r) => r.url().includes("/customers/menu") && r.ok()
  );
  await menu.open("/menu");
  const resp = await menuResponse;
  expect(resp.status()).toBe(200);

  await expect(menu.heading).toBeVisible();
  await expect(menu.addToCartButtons().first()).toBeVisible();
});

test("menu search filters dishes", async ({ page }) => {
  const menu = new MenuPage(page);
  await menu.open("/menu");
  await expect(menu.addToCartButtons().first()).toBeVisible();

  const before = await menu.itemCards().count();
  const firstTitle = (await menu.itemCards().first().textContent()).trim();
  expect(before).toBeGreaterThan(0);

  await menu.searchBox.fill(firstTitle.slice(0, Math.min(4, firstTitle.length)));
  await page.waitForTimeout(500);
  const after = await menu.itemCards().count();
  expect(after).toBeLessThanOrEqual(before);
});

test("veg filter shows only veg badges", async ({ page }) => {
  const menu = await new MenuPage(page).open("/menu");
  await menu.dietFilter("veg").click();
  await page.waitForTimeout(500);
  const count = await menu.nonVegBadge().count();
  expect(count).toBe(0);
});

test("add to cart increments nav badge", async ({ page }) => {
  const menu = await new MenuPage(page).open("/menu");
  const nav = new DashboardNav(page);
  await menu.addToCartButtons().first().click();
  await expect(nav.cartBadge).toHaveText("1");
  await menu.addToCartButtons().first().click();
  await expect(nav.cartBadge).toHaveText("2");
});
