import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 2,
  timeout: 30000,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'review-artifacts/test-results.json' }]],
  projects: [
    { name: 'desktop' },
    { name: 'mobile-interactions', testMatch: '**/interactions.spec.ts', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  use: { baseURL: 'http://localhost:3002', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview', url: 'http://localhost:3002', reuseExistingServer: true },
});