import { test, expect } from '@playwright/test';
import { seed } from '../src/app/core/seed';

for (const width of [1440, 390]) {
  test('Career journey visual review at ' + width, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const state = seed();
    state.registrations.push({
      id: 'preview-ticket',
      fairId: 'f1',
      candidateId: 'c1',
      studentId: 'ECU-1042',
      ticketToken: '6d035396-9acb-42a8-8cdf-00e247b40587',
    });
    await page.addInitScript((data) => {
      if (!localStorage.getItem('skill2work.demo.v1'))
        localStorage.setItem('skill2work.demo.v1', JSON.stringify(data));
    }, state);
    async function capture(selector: string, name: string) {
      const panel = page.locator(selector).first();
      await expect(panel).toBeVisible();
      await panel.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({ path: 'screenshots/' + width + '-' + name + '.png' });
    }
    await page.goto('/');
    await page.getByRole('button', { name: /Explore skill evidence/ }).press('Enter');
    await expect(page.locator('#sample-evidence')).toContainText('Angular');
    await capture('.passport-scene', 'passport-hero');
    await capture('#how-it-works h2', 'career-journey');
    async function login(role: string) {
      await page.goto('/sign-in');
      await page.getByLabel('Email', { exact: true }).fill(role + '@skill2work.demo');
      await page.getByLabel('Password', { exact: true }).fill('Demo123!');
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
      await expect(page).toHaveURL(new RegExp('/' + role + '/'));
    }
    await login('candidate');
    for (const [route, selector, name] of [
      ['jobs/j1', '.xray-breakdown summary', 'skill-xray'],
      ['fairs/f1', '.fair-ticket', 'ticket'],
      ['profile', '.profile-identity', 'career-story'],
      ['applications/a1', '.application-timeline', 'milestones'],
    ]) {
      await page.goto('/candidate/' + route);
      await capture(selector, name);
    }
    await page.goto('/candidate/jobs');
    await page.locator('.search input').fill('no-matching-role-12345');
    await capture('.smart-empty', 'empty-search');
    await login('university');
    await page.goto('/university/analytics');
    await capture('.gap-card', 'skill-demand');
  });
}
