import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('OfflinePay Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('should show dashboard and balance', async ({ page }) => {
    await expect(page.locator('text=Secure Vault Balance')).toBeVisible();
  });

  test('should have no accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('full send flow', async ({ page }) => {
    await page.click('text=Send');
    await page.fill('input[placeholder="UPI ID or Phone Number"]', 'test@upi');
    await page.fill('input[placeholder="0"]', '100');
    await page.click('text=Confirm Details');
    
    // PIN screen
    for (const num of ['1', '2', '3', '4', '5', '6']) {
      await page.click(`button:has-text("${num}")`);
    }

    // Should generate QR
    await expect(page.locator('text=Authorization Successful')).toBeVisible({ timeout: 10000 });
  });

  test('offline mode works', async ({ page, context }) => {
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('text=Offline Mode')).toBeVisible();
  });
});
