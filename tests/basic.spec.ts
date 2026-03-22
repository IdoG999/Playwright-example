import { test, expect } from './fixtures';

test.describe('Text Box', () => {
  test('should fill and submit text box form', async ({ page, testData }) => {
    await page.goto('/practice/text-box');

    const data = testData.textBox;
    await page.locator('#userName').fill(data.fullName);
    await page.locator('#userEmail').fill(data.email);
    await page.locator('#currentAddress').fill(data.currentAddress);
    await page.locator('#permanentAddress').fill(data.permanentAddress);
    await page.locator('#submit').click();

    const output = page.locator('#output');
    await expect(output).toBeVisible();
    await expect(output).toContainText(data.fullName);
    await expect(output).toContainText(data.email);
    await expect(output).toContainText(data.currentAddress);
    await expect(output).toContainText(data.permanentAddress);
  });
});

test.describe('Buttons', () => {
  test('should handle single click', async ({ page, testData }) => {
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
