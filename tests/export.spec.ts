import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

test('offline standalone navigation and inlined images', async ({ page, context }) => {
  await context.setOffline(true);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve('future_minds_sharable.html')).href);
  await page.getByRole('link', { name: 'View Robotics Syllabus' }).click();
  await expect(page.locator('h1')).toHaveText('Robotics Classes for Kids in Electronic City');
  await page.getByRole('button', { name: 'Book a Free Demo', exact: true }).click();
  await expect(page.locator('select').nth(1)).toHaveValue('Robotics & Hardware');
  expect(await page.locator('img').evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.naturalWidth > 0 && image.src.startsWith('data:')))).toBe(true);
  expect(errors).toEqual([]);
});

test('hosting configuration has no catch-all rewrite and preserves legacy export', async ({ request }) => {
  const config = JSON.parse(await fs.readFile('vercel.json', 'utf8'));
  expect(config.rewrites).toBeUndefined();
  expect(config.outputDirectory).toBe('dist');
  expect(config.trailingSlash).toBe(true);
  for (const redirect of config.redirects.filter(entry => entry.has)) {
    expect(redirect.has[0].type).toBe('host');
    expect(redirect.destination).toBe('https://www.futuremindsco.in/:path*');
  }
  const legacy = await request.get('/future_minds_sharable', { maxRedirects: 0 });
  expect(legacy.status()).toBe(308);
  expect(legacy.headers().location).toBe('/future_minds_sharable.html');
  expect((await request.get('/future_minds_sharable')).status()).toBe(200);
  expect(await fs.readFile('public/_redirects', 'utf8')).not.toContain('/*');
});