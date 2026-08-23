const fs = require("fs");

const API = process.env.E2E_API_BASE || "http://localhost:8080/api";
const APP_ORIGIN = "http://localhost:3000";

module.exports = async () => {
  const stamp = Date.now();
  const email = `e2e.tfc.${stamp}@example.com`;
  const contactNumber = `9${String(stamp).slice(-9)}`;
  const password = "Test@12345";
  const creds = { email, password, registered: false, loginOk: false };

  try {
    const reg = await fetch(`${API}/customers/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "E2E Tester",
        address: "1 Test Lane",
        contactNumber,
        email,
        password,
        confirmPassword: password,
      }),
    });
    const regBody = await reg.json().catch(() => ({}));
    creds.registered =
      reg.ok && (regBody?.statusCode === 200 || regBody?.statusCode === 201);

    if (creds.registered) {
      const login = await fetch(`${API}/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginBody = await login.json().catch(() => ({}));
      const profile = loginBody?.data;
      creds.loginOk = Boolean(profile?.customerId);
      if (creds.loginOk) {
        fs.mkdirSync("e2e/.auth", { recursive: true });
        fs.writeFileSync(
          "e2e/.auth/customer.json",
          JSON.stringify({
            cookies: [],
            origins: [
              {
                origin: APP_ORIGIN,
                localStorage: [
                  { name: "customer", value: JSON.stringify(profile) },
                ],
              },
            ],
          })
        );
      }
    }
  } catch {
    // backend down: authenticated specs will skip
  }

  fs.mkdirSync("e2e/.auth", { recursive: true });
  fs.writeFileSync("e2e/.auth/credentials.json", JSON.stringify(creds));
};
