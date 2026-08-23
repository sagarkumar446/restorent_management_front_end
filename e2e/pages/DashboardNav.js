const BasePage = require("./BasePage");

class DashboardNav extends BasePage {
  get brand() {
    return this.page.getByText("TheFoodClub", { exact: true });
  }
  get menuLink() {
    return this.page.getByRole("link", { name: "Menu", exact: true });
  }
  get dineLink() {
    return this.page.getByRole("link", { name: "Dine In" });
  }
  get cartLink() {
    return this.page.locator('a[href$="/cart"]');
  }
  get cartBadge() {
    return this.cartLink.locator("span").filter({ hasText: /^\d+$/ }).last();
  }
  get signInLink() {
    return this.page.getByRole("link", { name: "Sign In" });
  }
  async openUserMenu() {
    await this.page
      .locator("button")
      .filter({ hasText: /E2E Tester|Welcome/i })
      .first()
      .hover();
  }
  get myOrdersLink() {
    return this.page.getByRole("link", { name: "My Orders" });
  }
  get logoutButton() {
    return this.page.getByRole("button", { name: "Log out" });
  }
}

module.exports = DashboardNav;
