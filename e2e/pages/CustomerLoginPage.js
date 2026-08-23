const BasePage = require("./BasePage");

class CustomerLoginPage extends BasePage {
  get emailField() {
    return this.page.getByPlaceholder("Email address");
  }
  get passwordField() {
    return this.page.getByPlaceholder("Enter password");
  }
  get submitButton() {
    return this.page.getByRole("button", { name: /Sign In$|Signing In\.\.\./ });
  }
  get signUpLink() {
    return this.page.getByText("Sign up", { exact: true });
  }
  alert() {
    return this.page.locator("span").filter({
      hasText: /Login successful|Invalid email or password|Login failed|Invalid credentials/,
    });
  }
}

module.exports = CustomerLoginPage;
