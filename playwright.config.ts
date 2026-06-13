import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PW_PORT || 3100);
const BASE = `http://127.0.0.1:${PORT}`;

// In sandboxed/CI environments a pre-installed Chromium can be pointed to via
// PW_CHROMIUM; otherwise Playwright uses its managed browser (installed in CI).
const executablePath = process.env.PW_CHROMIUM || undefined;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: BASE,
    trace: "on-first-retry",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Reuse a server if one is already running (sandbox); else build+start.
  webServer: {
    command: process.env.PW_NO_SERVER ? "true" : `pnpm start -p ${PORT}`,
    url: BASE,
    timeout: 120_000,
    reuseExistingServer: true,
  },
});
