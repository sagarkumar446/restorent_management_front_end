const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/HomePage");
const DashboardNav = require("../pages/DashboardNav");
const { instrument } = require("../support/instrument");

test.beforeEach(async ({ page }) => {
  await instrument(page);
});

test("home renders hero and feature cards", async ({ page }) => {
  const home = await new HomePage(page).open("/");
  await expect(home.heading).toContainText(/Flavor/i);
  await expect(home.featureCard("Fast Service")).toBeVisible();
  await expect(home.featureCard("Quality First")).toBeVisible();
  await expect(home.featureCard("Fine Dining")).toBeVisible();
});

test("home CTA navigates to menu", async ({ page }) => {
  const home = await new HomePage(page).open("/");
  await home.exploreMenuLink.click();
  await expect(page).toHaveURL(/\/menu$/);
});

test("nav shows sign-in when logged out and links work", async ({ page }) => {
  const nav = new DashboardNav(page);
  await nav.open("/");
  await expect(nav.brand).toBeVisible();
  await expect(nav.menuLink).toBeVisible();
  await expect(nav.dineLink).toBeVisible();
  await expect(nav.signInLink).toBeVisible();

  await nav.dineLink.click();
  await expect(page).toHaveURL(/\/dine$/);
});
