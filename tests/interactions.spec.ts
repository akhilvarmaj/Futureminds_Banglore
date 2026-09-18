import { test, expect } from '@playwright/test';
import { BUSINESS } from '../src/data/siteSeo';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).openedUrls = [];
    window.open = ((url: string) => { (window as any).openedUrls.push(url); return { closed: false }; }) as typeof window.open;
    (window as any).audioEvents = 0;
    const original = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function () { (window as any).audioEvents++; return original.call(this); };
  });
});

test('theme persistence, mobile navigation and owner-mode removal', async ({ page }) => {
  await page.goto('/?admin=true');
  await page.evaluate(() => localStorage.setItem('fm_owner_mode', 'true'));
  await page.getByTitle('Future Minds Academy', { exact: true }).click({ clickCount: 3 });
  await expect(page.getByRole('button', { name: /Share|Push to Git|Admin access|Owner Mode/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle theme appearance' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Toggle theme appearance' }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Toggle Navigation Menu' }).click();
  await page.getByRole('link', { name: 'Programs (Robotics, AI, Coding)', exact: true }).click();
  await expect(page).toHaveURL(/\/programs\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Our Programs & Curriculum');
});

test('hero radar, steering, code mode, game motion and actual audio generation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Test Beep' }).click();
  expect(await page.evaluate(() => (window as any).audioEvents)).toBeGreaterThan(0);
  await page.getByTitle('Mute Lab Audio').click();
  const mutedCount = await page.evaluate(() => (window as any).audioEvents);
  await page.getByRole('button', { name: 'Test Beep' }).click();
  expect(await page.evaluate(() => (window as any).audioEvents)).toBe(mutedCount);
  await page.getByTitle('Unmute Lab Audio').click();
  await page.getByRole('slider').fill('10');
  await expect(page.locator('main')).toContainText(/Obstacle|Collision|STOP/i);
  await page.getByRole('slider').fill('40');
  await page.getByRole('button', { name: /Steer Left/ }).click();
  await expect(page.locator('main')).toContainText(/Left/);
  await page.getByRole('button', { name: /Steer Right/ }).click();
  await page.getByRole('button', { name: '↑ Forward', exact: true }).click();
  await page.getByRole('button', { name: 'Code Logic', exact: true }).click();
  await expect(page.locator('main')).toContainText(/if|loop/);
  await page.getByRole('button', { name: /Lab Game/ }).click();
  const before = await page.locator('main').innerText();
  await expect.poll(() => page.locator('main').innerText()).not.toBe(before);
  await page.screenshot({ path: 'test-results/hero-game.png' });
  await page.getByRole('button', { name: 'Rover Radar', exact: true }).click();
  await expect(page.getByRole('slider')).toBeVisible();
});

test('project maze execution, reset, alternate boards and audio toggle', async ({ page }) => {
  await page.goto('/projects/');
  await page.getByRole('button', { name: /Step Ahead/ }).click();
  await page.getByRole('button', { name: /Sonar Scan/ }).click();
  await page.getByRole('button', { name: /Run Algorithm/ }).click();
  await expect(page.locator('main')).toContainText('Code sequence finished');
  await page.getByRole('button', { name: 'Reset Board' }).click();
  await expect(page.getByRole('button', { name: /Run Algorithm/ })).toBeDisabled();
  await page.getByRole('combobox').selectOption('maze');
  await page.getByRole('combobox').selectOption('hard');
  await page.getByRole('button', { name: 'Lab Audio Active' }).click();
  await expect(page.getByRole('button', { name: 'Sound Muted' })).toBeVisible();
});

test('logic gates, AI training and soil sensor respond', async ({ page }) => {
  await page.goto('/projects/');
  await page.getByRole('button', { name: /Logic Gate Circuits/ }).click();
  await page.getByRole('button', { name: 'NAND GATE', exact: true }).click();
  await expect(page.getByText('ACTIVE (1)', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'AND GATE', exact: true }).click();
  await expect(page.getByText('IDLE (0)', { exact: true })).toBeVisible();
  const switches = page.locator('main button').filter({ hasText: /^$/ });
  await switches.nth(0).click();
  await switches.nth(1).click();
  await expect(page.getByText('✓ SOLVED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Next Mission/ }).click();
  await expect(page.locator('main')).toContainText('Mission 2');
  await page.getByRole('button', { name: /AI Vision Classifier/ }).click();
  await page.getByRole('button', { name: /Snap More Samples/ }).click();
  await expect(page.locator('main')).toContainText('9 Images');
  await page.getByRole('button', { name: /Train Neural Network/ }).click();
  await expect(page.locator('main')).toContainText('91.2%');
  await page.getByRole('button', { name: 'Drone 🛸', exact: true }).click();
  await page.getByRole('button', { name: 'Robo-Arm 🦾', exact: true }).click();
  await page.getByRole('button', { name: /Smart IoT Sensor/ }).click();
  await expect(page.locator('main')).toContainText('Water Pump: ACTIVE');
  await page.getByRole('slider').fill('60');
  await expect(page.locator('main')).toContainText('Water Pump: STANDBY');
});

test('grade selection, batch selection, FAQ and map copy', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/grades/');
  await page.getByRole('button', { name: /05\s*Grade 9/ }).click();
  await page.getByRole('button', { name: /Book Free Demo for Grade 9/ }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.locator('select').nth(0)).toHaveValue('Grade 9–10 (Ages 14–16)');
  await page.goto('/about/');
  await page.getByRole('button', { name: 'Reserve Slot', exact: true }).first().click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.locator('select').nth(2)).toHaveValue(/Weekend: Morning Batch/);
  await page.goto('/faq/');
  await page.getByRole('button', { name: /What if my child misses/ }).click();
  await expect(page.locator('main')).toContainText('makeup sessions');
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Copy Address' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(BUSINESS.address);
  await expect(page.locator('main')).toContainText(BUSINESS.hours);
  await expect(page.locator('iframe')).toHaveAttribute('src', /12\.8395,77\.6775/);
});

test('service demo prefills and WhatsApp submission stay intact without sending', async ({ page }) => {
  await page.goto('/ai-classes-for-kids-bangalore/');
  await page.getByRole('button', { name: 'Book a Free Demo', exact: true }).click();
  await expect(page.locator('select').nth(1)).toHaveValue('Artificial Intelligence');
  await page.getByPlaceholder('e.g. Ramesh Varma').fill('SEO Test Parent');
  await page.getByPlaceholder('e.g. Aarav').fill('Test Student');
  await page.getByRole('button', { name: /Confirm & Send Complete Inquiry/ }).click();
  await expect(page.locator('main')).toContainText('Ready on WhatsApp');
  const urls = await page.evaluate(() => (window as any).openedUrls);
  expect(urls).toHaveLength(1);
  const url = new URL(urls[0]);
  expect(url.origin + url.pathname).toBe('https://wa.me/919618283987');
  expect(url.searchParams.get('text')).toContain('SEO Test Parent');
  expect(url.searchParams.get('text')).toContain('Artificial Intelligence');
  await page.getByRole('button', { name: /Edit details/ }).click();
  await expect(page.getByPlaceholder('e.g. Aarav')).toHaveValue('Test Student');
  await page.goto('/contact/');
  const hrefs = await page.locator('a[href^="https://wa.me/"]').evaluateAll(anchors => anchors.map(anchor => (anchor as HTMLAnchorElement).href));
  expect(hrefs.length).toBeGreaterThan(0);
  expect(hrefs.every(href => href.startsWith('https://wa.me/919618283987?'))).toBe(true);
});