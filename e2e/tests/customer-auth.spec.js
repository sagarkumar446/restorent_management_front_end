const { test, expect } = require("@playwright/test");
const fs = require("fs");
const CustomerLoginPage = require("../pages/CustomerLoginPage");
const DashboardNav = require("../pages/DashboardNav");
const { instrument } = require("../support/instrument");

const creds = fs.existsSync("e2e/.auth/credentials.json")
  ? JSON.parse(fs.readFileSync("e2e/.auth/credentials.json", "utf8"))
  : { registered: false, loginOk: false, email: "", password: "" };

test.beforeEach(async ({ page }) => {
  await instrument(page);
});

test("sign-in button disabled until fields filled", async ({ page }) => {
  const loginPage = await new CustomerLoginPage(page).open("/sign-in");
  await expect(loginPage.submitButton).toBeDisabled();
  await loginPage.emailField.fill("a@b.com");
  await expect(loginPage.submitButton).toBeDisabled();
  await loginPage.passwordField.fill("x");
  await expect(loginPage.submitButton).toBeEnabled();
});

test("login with wrong credentials shows error alert", async ({ page }) => {
  const loginPage = await new CustomerLoginPage(page).open("/sign-in");
  await loginPage.emailField.fill("nouser@example.com");
  await loginPage.passwordField.fill("WrongPass123");
  await loginPage.submitButton.click();
  await expect(loginPage.alert()).toBeVisible();
  await expect(page).not.toHaveURL(/\/orders|\/cart/);
});

test("registered user can log in and log out end to end", async ({ page }) => {
  test.skip(!creds.loginOk, "global setup could not register/login a customer (backend down or OTP-gated register)");
  const loginPage = await new CustomerLoginPage(page).open("/sign-in");
  await loginPage.emailField.fill(creds.email);
  await loginPage.passwordField.fill(creds.password);
  await loginPage.submitButton.click();

  await expect(page).toHaveURL(/\/$/, { timeout: 15000 });
  const nav = new DashboardNav(page);
  await expect(nav.signInLink).toBeHidden({ timeout: 15000 });

  await nav.openUserMenu();
  await nav.logoutButton.click();
  await expect(nav.signInLink).toBeVisible();
});
