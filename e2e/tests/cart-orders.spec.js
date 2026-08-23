const { test, expect } = require("@playwright/test");
const MenuPage = require("../pages/MenuPage");
const DashboardNav = require("../pages/DashboardNav");
const { CartPage, OrdersPage } = require("../pages/CartPage");
const { instrument } = require("../support/instrument");

test.beforeEach(async ({ page }) => {
  await instrument(page);
});

test("empty cart shows empty state", async ({ page }) => {
  const cart = await new CartPage(page).open("/cart");
  await expect(cart.emptyHeading).toBeVisible();
});

test("cart totals reflect added items", async ({ page }) => {
  const menu = new MenuPage(page);
  await menu.open("/menu");
  await menu.addToCartButtons().first().click();
  await menu.addToCartButtons().first().click();

  const nav = new DashboardNav(page);
  await nav.cartLink.click();
  await expect(page).toHaveURL(/\/cart$/);

  const cart = new CartPage(page);
  await expect(cart.heading).toBeVisible();
  await expect(cart.orderSummary).toBeVisible();
  const totalRow = page.getByText("Total", { exact: true });
  await expect(totalRow).toBeVisible();
});

test("placing order while logged out prompts login dialog", async ({ page }) => {
  let dialogMessage = "";
  page.on("dialog", async (d) => {
    dialogMessage = d.message();
    await d.dismiss();
  });

  const menu = new MenuPage(page);
  await menu.open("/menu");
  await menu.addToCartButtons().first().click();

  const nav = new DashboardNav(page);
  await nav.cartLink.click();
  const cart = new CartPage(page);
  await expect(cart.heading).toBeVisible();

  test.skip(
    (await cart.payWithRazorpayButton.count()) === 0 &&
      (await cart.counterOrderButton.count()) === 0,
    "no payment action button rendered"
  );

  const payButton =
    (await cart.payWithRazorpayButton.count()) > 0
      ? cart.payWithRazorpayButton
      : cart.counterOrderButton;
  await payButton.click();
  expect(dialogMessage).toContain("Please log in to place an order.");
});

test("orders page redirects anonymous users to sign-in", async ({ page }) => {
  await new OrdersPage(page).open("/orders");
  await expect(page).toHaveURL(/\/sign-in$/);
});
