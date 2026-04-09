import { defineConfig, devices } from '@playwright/test'

/** Set `E2E_FULL_MATRIX=1` to run Firefox, WebKit, Edge, and mobile (slower). Default is Chromium only. */
const fullMatrix = process.env.E2E_FULL_MATRIX === '1'

const chromiumOnly = [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]

const allProjects = [
  ...chromiumOnly,
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
]

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: fullMatrix ? allProjects : chromiumOnly,
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
