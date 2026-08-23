const BasePage = require("./BasePage");

class MenuPage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: "Our Menu" });
  }
  get searchBox() {
    return this.page.getByPlaceholder("Search dishes...");
  }
  itemCards() {
    return this.page.locator("h3").filter({ hasText: /.+/ });
  }
  itemTitle(text) {
    return this.page.getByRole("heading", { name: text });
  }
  addToCartButtons() {
    return this.page.getByRole("button", { name: "Add to Cart" });
  }
  vegBadge() {
    return this.page.getByText("Veg", { exact: true });
  }
  nonVegBadge() {
    return this.page.getByText("Non-Veg", { exact: true });
  }
  dietFilter(name) {
    return this.page.getByRole("button", { name: name, exact: true });
  }
  categoryButton(name) {
    return this.page.getByRole("button", { name }).first();
  }
}

module.exports = MenuPage;
