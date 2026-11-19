import { test, expect } from '@playwright/test';
import { seed } from '../src/app/core/seed';

test('responsive reader, reduced motion, keyboard order, list and RTL', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript((state) => {
    localStorage.setItem('skill2work.demo.v1', JSON.stringify(state));
    localStorage.setItem('s2w.session', 'uc1');
  }, seed());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/candidate/passport');
  await page.getByRole('button', { name: 'Open Passport' }).click();
  await expect(page.locator('.leaf')).toHaveCount(1);
  await expect(page.locator('.moving')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Holder identity' })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await page.getByRole('button', { name: 'Next page' }).click();
  await page.getByRole('button', { name: 'Read assessed skills' }).click();
  await expect(page.locator('.leaf .seal')).toHaveCount(2);
  await page.getByRole('button', { name: 'List View', exact: true }).click();
  await expect(page.locator('.evidence-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'Passport View', exact: true }).click();
  await expect(page.locator('.page-controls')).toContainText('3');
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await page.getByRole('button', { name: 'Change language' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('.spread').press('ArrowRight');
  await expect(page.locator('.page-controls')).toContainText('2 / 4');
  await page.locator('.spread').press('Escape');
  await expect(page.locator('.open-button')).toBeVisible();
});
