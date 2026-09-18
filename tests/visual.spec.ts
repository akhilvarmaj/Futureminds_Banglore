import { test, expect } from '@playwright/test';

for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
  for (const theme of ['light', 'dark']) {
    test(`production visual comparison ${viewport.name} ${theme}`, async ({ page }) => {
      test.setTimeout(120000);
      await page.setViewportSize(viewport);
      await page.addInitScript(value => localStorage.setItem('fm_theme', value), theme);
      for (const route of ['home', 'programs', 'projects', 'demo']) {
        const samples: Record<string, any> = {};
        for (const version of ['production', 'reconciled']) {
          const url = version === 'production' ? `https://www.futuremindsco.in/#${route}` : `http://localhost:3002/${route === 'home' ? '' : route + '/'}`;
          await page.goto(url, { waitUntil: 'domcontentloaded' });
          await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /dark/ : /^(?!.*dark)/);
          await page.evaluate(() => document.fonts.ready);
          await expect(page.locator('h1')).toBeVisible();
          samples[version] = await page.evaluate(() => {
            const header = document.querySelector('body #root > div > header')!;
            const heading = document.querySelector('h1')!;
            const style = getComputedStyle(heading);
            return { headerHeight: header.getBoundingClientRect().height, headingFont: style.fontSize, headingWeight: style.fontWeight, headingColor: style.color, bodyBackground: getComputedStyle(document.body).backgroundColor, overflow: document.documentElement.scrollWidth > innerWidth };
          });
          await page.screenshot({ path: `review-artifacts/screenshots/${viewport.name}-${theme}-${route}-${version}.png` });
        }
        expect(samples.reconciled.overflow).toBe(false);
        for (const property of ['headerHeight', 'headingFont', 'headingWeight', 'headingColor', 'bodyBackground']) expect(samples.reconciled[property], `${route}: ${property}`).toBe(samples.production[property]);
      }
    });
  }
}