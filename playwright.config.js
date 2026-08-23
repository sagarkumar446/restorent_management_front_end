const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e/tests",
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "e2e/report" }]],
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  globalSetup: "./e2e/support/global-setup.js",
  webServer: {
    command: "PORT=3000 BROWSER=none npx react-scripts start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 180000,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
