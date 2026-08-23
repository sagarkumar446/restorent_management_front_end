const BasePage = require("./BasePage");

class CartPage extends BasePage {
  get emptyHeading() {
    return this.page.getByRole("heading", { name: "Your Cart is Empty" });
  }
  get heading() {
    return this.page.getByRole("heading", { name: "Your Cart", exact: true });
  }
  get clearCartButton() {
    return this.page.getByRole("button", { name: "Clear Cart" });
  }
  itemRow(name) {
    return this.page.getByRole("heading", { name });
  }
  get orderSummary() {
    return this.page.getByRole("heading", { name: "Order Summary" });
  }
  get payWithRazorpayButton() {
    return this.page.getByRole("button", { name: "Pay with Razorpay" });
  }
  get counterOrderButton() {
    return this.page.getByRole("button", { name: /Place Order/ });
  }
  increaseButtons() {
    return this.page.locator("button").filter({ hasNotText: /.*/ }).locator("svg");
  }
}

class OrdersPage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: "My Orders" });
  }
  get emptyState() {
    return this.page.getByText("No orders yet");
  }
  get loadingText() {
    return this.page.getByText("Loading order history...");
  }
  orderCards() {
    return this.page.locator("div").filter({ hasText: /^Order #\d+/ });
  }
}

module.exports = { CartPage, OrdersPage };
