const BasePage = require("./BasePage");

class SignUpPage extends BasePage {
  get emailField() {
    return this.page.getByPlaceholder("e.g. delicious@tfc.com");
  }
  get sendCodeButton() {
    return this.page.getByRole("button", { name: "Send Verification Code" });
  }
  get invalidEmailHint() {
    return this.page.getByText("Please enter a valid Gmail address");
  }
}

class OtpPage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: "Check Your Email" });
  }
  otpInputs() {
    return this.page.locator("form input, div input[type='text'], div input[type='tel']").first();
  }
  get allOtpInputs() {
    return this.page.locator("input[inputmode]", { hasNot: this.page.locator("x") });
  }
  get verifyButton() {
    return this.page.getByRole("button", { name: "Verify & Continue" });
  }
  get resendButton() {
    return this.page.getByRole("button", { name: "Resend Code" });
  }
}

module.exports = { SignUpPage, OtpPage };
