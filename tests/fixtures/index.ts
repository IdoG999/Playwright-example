/**
 * Playwright fixtures for add/delete data.
 * - testData: provides typed test data factories (add data)
 * - page: overridden to clear cookies before/after each test (delete data)
 */
import { test as base, expect } from '@playwright/test';
import {
  createTextBoxData,
  createPracticeFormData,
  createLoginCredentials,
  type TextBoxFormData,
  type PracticeFormData,
  type LoginCredentials,
} from './test-data';

export { expect };

export const test = base.extend<{
  testData: {
    textBox: TextBoxFormData;
    practiceForm: PracticeFormData;
    loginCredentials: LoginCredentials;
    createTextBoxData: typeof createTextBoxData;
    createPracticeFormData: typeof createPracticeFormData;
    createLoginCredentials: typeof createLoginCredentials;
  };
}>({
  testData: async ({}, use) => {
    await use({
      textBox: createTextBoxData(),
      practiceForm: createPracticeFormData(),
      loginCredentials: createLoginCredentials(),
      createTextBoxData,
      createPracticeFormData,
      createLoginCredentials,
    });
  },

  page: async ({ page }, use) => {
    // Setup: clear cookies before test (delete prior session data)
    await page.context().clearCookies();
    await use(page);
    // Teardown: clear cookies after test (delete data created during test)
    await page.context().clearCookies();
  },
});
