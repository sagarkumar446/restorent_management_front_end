class BasePage {
  constructor(page) {
    this.page = page;
  }

  async open(path = "/") {
    await this.page.goto(path);
    return this;
  }

  consoleErrors() {
    return this.page.e2eConsoleErrors || [];
  }

  failedResponses() {
    return this.page.e2eFailedResponses || [];
  }
}

module.exports = BasePage;
