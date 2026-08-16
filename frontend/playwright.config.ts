import { defineConfig, devices } from "@playwright/test";

const PORT = 3001;
const API_PORT = 8001;
// The live generation matrix makes many generate/pdf calls in a short time,
// which would trip the backend's default 5/min rate limit. Relax it for the
// live run only — normal runs keep the production value.
const RATE_LIMIT_REQUESTS = process.env.E2E_GENERATE ? "1000" : "5";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    {
      command: `rate_limit_requests=${RATE_LIMIT_REQUESTS} .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port ${API_PORT}`,
      cwd: "../backend",
      url: `http://localhost:${API_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `NEXT_PUBLIC_ANALYTICS_DISABLED=true npm run dev -- -p ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
});
