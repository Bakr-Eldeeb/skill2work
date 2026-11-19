import { expect, test } from '@playwright/test';

for (const width of [1536, 1440, 768, 390]) {
  test(`landing layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1024 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your skills deserve');
    await page.locator('.passport-scene img').evaluate((image: HTMLImageElement) => image.decode());
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    if (width === 1536 || width === 390) {
      await page.screenshot({ path: `screenshots/landing-${width}-top.png` });
      await page.screenshot({ path: `screenshots/landing-${width}-full.png`, fullPage: true });
    }
    if (width <= 850) {
      await page.getByRole('button', { name: 'Navigation menu' }).click();
      await expect(page.getByRole('navigation').getByText('For Companies')).toBeVisible();
      await page.getByRole('button', { name: 'Navigation menu' }).click();
    }
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    if (width === 1536) await page.screenshot({ path: 'screenshots/landing-dark-desktop.png' });
    await page.getByRole('button', { name: 'Change language' }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('مهاراتك');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
  });
}
