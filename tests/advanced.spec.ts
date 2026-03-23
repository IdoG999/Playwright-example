import { test, expect } from './fixtures';

test.describe('Advanced Playwright Tests', () => {
  test('placeholder - add advanced tests here', async ({ page }) => {
    await page.goto('/practice');
    await expect(page).toHaveURL(/\/practice/);
  });
});
