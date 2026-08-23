const { test, expect } = require("@playwright/test");

const API = "http://localhost:8080/api";

test("menu API returns non-empty menu with required fields", async ({ request }) => {
  const res = await request.get(`${API}/customers/menu`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.statusCode).toBe(200);
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);
  for (const key of ["menuItemId", "itemName", "price", "category"]) {
    expect(body.data[0]).toHaveProperty(key);
  }
});

test("categories API returns list", async ({ request }) => {
  const res = await request.get(`${API}/categories`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body.data)).toBe(true);
});

test("tables API returns list with status field", async ({ request }) => {
  const res = await request.get(`${API}/customers/tables`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body.data)).toBe(true);
  if (body.data.length > 0) {
    expect(body.data[0]).toHaveProperty("status");
  }
});

test("available tables requires date, guests and time params", async ({ request }) => {
  const noParams = await request.get(`${API}/customers/tables/available`);
  expect(noParams.status()).toBe(400);
  const withParams = await request.get(
    `${API}/customers/tables/available?date=2026-08-23&numberOfGuests=2&reservationTime=19:30`
  );
  expect(withParams.status()).toBe(200);
});

test("customer login rejects bad credentials with clean error", async ({ request }) => {
  const res = await request.post(`${API}/customers/login`, {
    data: { email: "nouser@example.com", password: "nope" },
  });
  expect(res.status()).toBe(401);
  const body = await res.json();
  expect(body.message).toBeTruthy();
});

test("employee login rejects bad credentials", async ({ request }) => {
  const res = await request.post(
    `${API}/employee/login?email=intruder@example.com&password=nope`
  );
  expect(res.status()).toBe(401);
});

test.fixme(
  "SECURITY (SCRUM-8): admin endpoints must reject unauthenticated access",
  async ({ request }) => {
    for (const path of [
      "/admin/dashboard-stats",
      "/admin/customers",
      "/view-tables/admin/reservations",
    ]) {
      const res = await request.get(`${API}${path}`);
      expect(res.status(), `${path} should require auth`).toBe(401);
    }
  }
);

test.fixme(
  "SECURITY (SCRUM-7): payment config must not expose razorpayKeySecret",
  async ({ request }) => {
    const res = await request.get(`${API}/payment/config`);
    const body = await res.json();
    expect(JSON.stringify(body)).not.toContain("razorpayKeySecret");
  }
);
