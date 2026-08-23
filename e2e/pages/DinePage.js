const BasePage = require("./BasePage");

class DinePage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: /Reserve Your Table|Admin Dine Table/ });
  }
  get checkAvailabilityButton() {
    return this.page.getByRole("button", { name: "Check Available Tables", exact: true });
  }
  availabilityResult() {
    return this.page.getByText(
      /Available tables updated\.|No table is currently available for the selected slot\.|Failed to check available tables\./
    );
  }
  tableTitles() {
    return this.page.getByText(/^Table #\d+$/);
  }
  guestButton(n) {
    return this.page.getByRole("button", { name: `${n} Person` });
  }
}

module.exports = DinePage;
