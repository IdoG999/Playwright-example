import { test, expect } from '@playwright/test';

test.describe('Text Box', () => {
  test('should fill and submit text box form', async ({ page }) => {
    await page.goto('/practice/text-box');

    await page.locator('#userName').fill('John Doe');
    await page.locator('#userEmail').fill('john@example.com');
    await page.locator('#currentAddress').fill('123 Main St');
    await page.locator('#permanentAddress').fill('456 Oak Ave');
    await page.locator('#submit').click();

    const output = page.locator('#output');
    await expect(output).toBeVisible();
    await expect(output).toContainText('John Doe');
    await expect(output).toContainText('john@example.com');
    await expect(output).toContainText('123 Main St');
    await expect(output).toContainText('456 Oak Ave');
  });
});

test.describe('Buttons', () => {
  test('should handle single click', async ({ page }) => {
    await page.goto('/practice/buttons');

    await page.locator('#dynamicClickBtn').click();
    await expect(page.getByText('You have done a dynamic click')).toBeVisible();
  });

  test('should handle double click', async ({ page }) => {
    await page.goto('/practice/buttons');

    await page.locator('#doubleClickBtn').dblclick();
    await expect(page.getByText('You have done a double click')).toBeVisible();
  });

  test('should handle right click', async ({ page }) => {
    await page.goto('/practice/buttons');

    await page.locator('#rightClickBtn').click({ button: 'right' });
    await expect(page.getByText('You have done a right click')).toBeVisible();
  });
});
