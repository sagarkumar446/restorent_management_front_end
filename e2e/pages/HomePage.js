const BasePage = require("./BasePage");

class HomePage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { level: 1 });
  }
  get exploreMenuLink() {
    return this.page.getByRole("link", { name: "Explore Menu" });
  }
  get bookTableLink() {
    return this.page.getByRole("link", { name: "Book a Table" });
  }
  get becomeMemberLink() {
    return this.page.getByRole("link", { name: "Become a Member" });
  }
  featureCard(name) {
    return this.page.getByText(name, { exact: true });
  }
}

module.exports = HomePage;
