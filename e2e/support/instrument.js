async function instrument(page) {
  const errors = [];
  const failed = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("response", (res) => {
    if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
  });
  page.e2eConsoleErrors = errors;
  page.e2eFailedResponses = failed;
}

module.exports = { instrument };
