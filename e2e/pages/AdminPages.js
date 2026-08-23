const BasePage = require("./BasePage");

class AdminLoginPage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: "Admin Login" });
  }
  get emailField() {
    return this.page.getByPlaceholder("e.g. admin@tfc.com");
  }
  get passwordField() {
    return this.page.getByPlaceholder("••••••••");
  }
  get submitButton() {
    return this.page.getByRole("button", { name: /Sign In to Dashboard|Authenticating\.\.\./ });
  }
  alert() {
    return this.page.locator("span").filter({
      hasText: /Login failed\. Please check your credentials\.|Invalid email or password/,
    });
  }
}

class AdminDashboardPage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: "Admin Dashboard" });
  }
  statCard(label) {
    return this.page.getByText(label, { exact: true });
  }
}

module.exports = { AdminLoginPage, AdminDashboardPage };
