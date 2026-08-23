const { test, expect } = require("@playwright/test");
const { SignUpPage, OtpPage } = require("../pages/SignUpPage");
const { instrument } = require("../support/instrument");

test.beforeEach(async ({ page }) => {
  await instrument(page);
});

test("signup rejects invalid email inline", async ({ page }) => {
  const signUp = await new SignUpPage(page).open("/sign-up");
  await signUp.emailField.fill("not-an-email");
  await expect(signUp.invalidEmailHint).toBeVisible();
  await expect(signUp.sendCodeButton).toBeDisabled();
});

test("otp screen reachable only via flow shows empty email state", async ({ page }) => {
  const otp = await new OtpPage(page).open("/sign-up/otp");
  await expect(otp.heading).toBeVisible();
  await expect(otp.verifyButton).toBeDisabled();
});
