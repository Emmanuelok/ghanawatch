import { test, expect } from "@playwright/test";

// Public, security, and core-app routes that must always render.
const PUBLIC_ROUTES = [
  "/", "/pricing", "/research", "/sectors", "/knowledge", "/tour", "/demo",
  "/verify", "/investigator", "/network", "/partners", "/transparency",
  "/case-law", "/legal-search", "/tools/vehicle-duty", "/tools/cost-simulator",
];

const APP_ROUTES = [
  "/dashboard", "/projects", "/map", "/cases", "/onboarding", "/ledger",
  "/projects/kasoa-4bed", "/projects/east-legon-plot", "/cases/case-1",
  "/v/east-legon-plot", "/projects/kasoa-4bed/evidence",
];

test.describe("public routes render", () => {
  for (const path of PUBLIC_ROUTES) {
    test(`GET ${path}`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(res?.status(), `${path} status`).toBeLessThan(400);
      // Nav chrome is present on every page.
      await expect(page.locator("header").first()).toBeVisible();
    });
  }
});

test.describe("app routes render", () => {
  for (const path of APP_ROUTES) {
    test(`GET ${path}`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(res?.status(), `${path} status`).toBeLessThan(400);
    });
  }
});

test("landing hydrates and the hero rotates", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const heading = page.locator("h1").first();
  const first = await heading.innerText();
  await page.waitForTimeout(3000);
  const second = await heading.innerText();
  expect(first).not.toBe(second); // client JS is running
});

test("no CSP violations on key pages", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => {
    if (/content security policy|refused to/i.test(m.text())) violations.push(m.text());
  });
  for (const path of ["/", "/map", "/verify"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
  }
  expect(violations, violations[0]).toHaveLength(0);
});

test("security headers are present", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toBeTruthy();
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-frame-options"]).toBe("SAMEORIGIN");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("verify API rejects an oversized payload (413)", async ({ request }) => {
  const res = await request.post("/api/verify-document", {
    data: { text: "x", junk: "B".repeat(10_000_000) },
  });
  expect(res.status()).toBe(413);
});

test("verify API rejects a disguised non-image (400)", async ({ request }) => {
  const res = await request.post("/api/verify-document", {
    data: { type: "receipt", image: "data:text/html;base64,PHNjcmlwdD4=" },
  });
  expect(res.status()).toBe(400);
});

test("verify API returns a verdict for a normal request", async ({ request }) => {
  const res = await request.post("/api/verify-document", {
    data: { text: "cement receipt no stamp plain paper urgent", type: "receipt" },
  });
  expect(res.ok()).toBe(true);
  const body = await res.json();
  expect(["verified", "flagged", "rejected"]).toContain(body.verdict);
});
