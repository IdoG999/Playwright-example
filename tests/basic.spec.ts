import { test, expect } from './fixtures';
import { TextBoxPage, ButtonsPage } from '../pages';

test.describe('Text Box', () => {
  test.beforeEach(async ({ page }) => {
    await new TextBoxPage(page).goto();
  });

  test('should fill and submit text box form', async ({ page, testData }) => {
    const textBoxPage = new TextBoxPage(page);
    const data = testData.textBox;
    await textBoxPage.fillForm(data);
    await textBoxPage.submit();

    await expect(textBoxPage.output).toBeVisible();
    await expect(textBoxPage.output).toContainText(data.fullName);
    await expect(textBoxPage.output).toContainText(data.email);
    await expect(textBoxPage.output).toContainText(data.currentAddress);
    await expect(textBoxPage.output).toContainText(data.permanentAddress);
  });
});

test.describe('Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await new ButtonsPage(page).goto();
  });

  test('should handle single click', async ({ page }) => {
    const buttonsPage = new ButtonsPage(page);
    await buttonsPage.clickDynamic();
    await expect(buttonsPage.dynamicClickMessage).toBeVisible();
  });

  test('should handle double click', async ({ page }) => {
    const buttonsPage = new ButtonsPage(page);
    await buttonsPage.doubleClick();
    await expect(buttonsPage.doubleClickMessage).toBeVisible();
  });

  test('should handle right click', async ({ page }) => {
    const buttonsPage = new ButtonsPage(page);
    await buttonsPage.rightClick();
    await expect(buttonsPage.rightClickMessage).toBeVisible();
  });
});
