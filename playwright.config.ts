import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright arranca el servidor de desarrollo de Angular por su cuenta.
 *
 * Nota macOS 12: los navegadores que descarga Playwright requieren macOS 13+.
 * Por eso usamos el canal `chrome` (Google Chrome instalado en el sistema).
 * En CI (Linux) se puede cambiar a Chromium sin más cambios.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chrome-desktop',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'chrome-mobile',
      use: { ...devices['Pixel 5'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
