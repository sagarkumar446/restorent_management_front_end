const { test, expect } = require("@playwright/test");
const { AdminLoginPage, AdminDashboardPage } = require("../pages/AdminPages");
const { instrument } = require("../support/instrument");

test.beforeEach(async ({ page }) => {
  await instrument(page);
});

test("admin login page renders", async ({ page }) => {
  const adminLogin = await new AdminLoginPage(page).open("/admin/login");
  await expect(adminLogin.heading).toBeVisible();
  await expect(adminLogin.submitButton).toBeEnabled();
});

test("admin login with bad credentials shows error", async ({ page }) => {
  const adminLogin = await new AdminLoginPage(page).open("/admin/login");
  await adminLogin.emailField.fill("intruder@example.com");
  await adminLogin.passwordField.fill("not-the-password");
  await adminLogin.submitButton.click();
  await expect(adminLogin.alert()).toBeVisible();
  await expect(adminLogin.heading).toBeVisible();
});

test("anonymous access to /admin/dashboard is redirected to login", async ({ page }) => {
  await new AdminDashboardPage(page).open("/admin/dashboard");
  await page.waitForTimeout(1500);
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("anonymous access to /admin/dine is redirected to login", async ({ page }) => {
  await new AdminDashboardPage(page).open("/admin/dine");
  await page.waitForTimeout(1500);
  await expect(page).toHaveURL(/\/admin\/login$/);
});
