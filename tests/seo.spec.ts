import { test, expect } from '@playwright/test';
import { load } from 'cheerio';
import sharp from 'sharp';
import { routes, hashAliases, SITE_ORIGIN, BUSINESS } from '../src/data/siteSeo';

for (const [name, route] of Object.entries(routes)) {
  test(`static SEO: ${name}`, async ({ request }) => {
    const response = await request.get(route.path);
    expect(response.status()).toBe(200);
    const text = await response.text();
    const html = load(text);
    expect(html('title')).toHaveLength(1);
    expect(html('title').text()).toBe(route.title);
    expect(html('meta[name="description"]')).toHaveLength(1);
    expect(html('meta[name="description"]').attr('content')).toBe(route.description);
    expect(html('link[rel="canonical"]')).toHaveLength(1);
    expect(html('link[rel="canonical"]').attr('href')).toBe(SITE_ORIGIN + route.path);
    expect(html('meta[property="og:url"]').attr('content')).toBe(SITE_ORIGIN + route.path);
    expect(html('meta[property="og:title"]').attr('content')).toBe(route.title);
    expect(html('meta[name="twitter:title"]').attr('content')).toBe(route.title);
    expect(html('meta[name="robots"]').attr('content')).not.toMatch(/noindex|nofollow/);
    expect(response.headers()['x-robots-tag'] || '').not.toMatch(/noindex/);
    expect(html('h1')).toHaveLength(1);
    expect(html('main').text().trim().length).toBeGreaterThan(500);
    expect(html('a[href^="/"]').length).toBeGreaterThan(7);
    expect(text).not.toMatch(/futuremindsv2\.vercel\.app|#1 Robotics|STEM certified|aggregateRating/);
    const graph = JSON.parse(html('#site-schema').text())['@graph'];
    const business = graph.find(entity => entity['@type'].includes('LocalBusiness'));
    expect(business.name).toBe(BUSINESS.name);
    expect(business.telephone).toBe(BUSINESS.phone);
    expect(business.address.streetAddress).toBe('1121, 5th Cross, Phase II, Ananth Nagar');
    expect(business.geo.latitude).toBe(BUSINESS.latitude);
    expect(business.openingHoursSpecification.map(hours => [hours.opens, hours.closes])).toEqual([['16:00', '20:00'], ['09:00', '19:00']]);
    expect(html('footer').text()).toContain(BUSINESS.address);
    let previous = 0;
    html('main h1, main h2, main h3, main h4, main h5').each((_, heading) => {
      const current = Number(heading.tagName.slice(1));
      expect(current, `Heading jump: ${html(heading).text()}`).toBeLessThanOrEqual(previous + 1);
      previous = current;
    });
    html('img').each((_, image) => expect(html(image).attr('alt')).toBeTruthy());
    for (const href of new Set(html('a[href^="/"]').map((_, anchor) => html(anchor).attr('href')).get())) {
      expect((await request.get(href)).status(), href).toBe(200);
    }
  });
  test(`rendered mobile and desktop: ${name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && /hydration|Minified React/.test(message.text())) errors.push(message.text()); });
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    for (const width of [1440, 390, 360]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator('img').evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test('sitemap, robots, unique metadata, social asset and unknown paths', async ({ request }) => {
  const xml = await request.get('/sitemap.xml');
  expect(xml.status()).toBe(200);
  expect(xml.headers()['content-type']).toContain('xml');
  const sitemap = load(await xml.text(), { xmlMode: true });
  expect(sitemap('urlset').attr('xmlns')).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
  expect(sitemap('loc').map((_, element) => sitemap(element).text()).get()).toEqual(Object.values(routes).map(route => SITE_ORIGIN + route.path));
  expect(await xml.text()).not.toContain('#');
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
  expect(new Set(Object.values(routes).map(route => route.title)).size).toBe(12);
  expect(new Set(Object.values(routes).map(route => route.description)).size).toBe(12);
  for (const path of ['/not-a-real-page/', '/programs/not-real/', '/assets/missing.js', '/api/github/patch-repo']) expect((await request.get(path)).status()).toBe(404);
  for (const route of Object.values(routes).filter(route => route.path !== '/')) {
    const response = await request.get(route.path.slice(0, -1), { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(route.path);
  }
  const image = await request.get('/og/future-minds-1200x630.jpg');
  expect(image.status()).toBe(200);
  const metadata = await sharp(await image.body()).metadata();
  expect([metadata.width, metadata.height]).toEqual([1200, 630]);
  const logo = await request.get('/future_minds_logo-96.webp');
  expect((await logo.body()).length).toBeLessThan(15000);
});

test('all legacy hashes and aliases preserve destination and canonical', async ({ page }) => {
  for (const [hash, destination] of Object.entries(hashAliases)) {
    await page.goto('/#' + hash);
    await expect(page).toHaveURL('http://localhost:3002' + routes[destination].path);
    await expect(page).toHaveTitle(routes[destination].title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', SITE_ORIGIN + routes[destination].path);
  }
});

test('standalone export stays usable without becoming an indexed duplicate', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/future_minds_sharable.html');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.getByRole('button', { name: 'Test Beep' })).toBeVisible();
  await page.getByRole('button', { name: 'Code Logic', exact: true }).click();
  expect(errors).toEqual([]);
});