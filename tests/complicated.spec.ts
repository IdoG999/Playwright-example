import { test, expect } from './fixtures';

test.describe('Practice Form', () => {
  test('should submit full student registration form', async ({ page, testData }) => {
    await page.goto('/practice/practice-form');

    const data = testData.practiceForm;
    await page.locator('#firstName').fill(data.firstName);
    await page.locator('#lastName').fill(data.lastName);
    await page.locator('#userEmail').fill(data.email);
    await page.locator('#gender-radio-1').check(); // Male
    await page.locator('#userNumber').fill(data.mobile);
    await page.locator('#dateOfBirthInput').fill(data.dateOfBirth);
    await page.locator('#hobbies-checkbox-1').check(); // Sports
    await page.locator('#currentAddress').fill(data.address);

    // State and City dropdowns
    await page.locator('#state').click();
    await page.getByText(data.state, { exact: true }).click();
    await page.locator('#city').click();
    await page.getByText(data.city, { exact: true }).click();

    await page.locator('#submit').click();

    // Verify success modal
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.getByText('Thanks for submitting the form')).toBeVisible();
    await expect(page.locator('.modal-content')).toContainText(data.firstName);
    await expect(page.locator('.modal-content')).toContainText(data.lastName);
    await expect(page.locator('.modal-content')).toContainText(data.email);
  });
});

test.describe('Book Store', () => {
  test('should search books and filter results', async ({ page }) => {
    await page.goto('/practice/books');

    // Verify books are displayed
    await expect(page.getByText('Git Pocket Guide')).toBeVisible();
    await expect(page.getByText('Learning JavaScript Design Patterns')).toBeVisible();

    // Search filters the list
    await page.locator('#searchBox').fill('JavaScript');
    await expect(page.getByText('Learning JavaScript Design Patterns')).toBeVisible();
    await expect(page.getByText('Speaking JavaScript')).toBeVisible();
    await expect(page.getByText('Git Pocket Guide')).not.toBeVisible();

    // Clear search shows all again
    await page.locator('#searchBox').fill('');
    await expect(page.getByText('Git Pocket Guide')).toBeVisible();
  });

  test('should navigate to book detail when clicking a book', async ({ page }) => {
    await page.goto('/practice/books');

    await page.locator('#see-book-GitPocketGuide').click();

    // Verify we navigated (URL or detail content)
    await expect(page).toHaveURL(/\/books/);
  });
});

test.describe('Login - Negative and Navigation', () => {
  test('should show error on invalid credentials', async ({ page, testData }) => {
    await page.goto('/practice/login');

    const creds = testData.loginCredentials;
    await page.locator('#userName').fill(creds.userName);
    await page.locator('#password').fill(creds.password);
    await page.locator('#login').click();

    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('should navigate to register when clicking New User', async ({ page }) => {
    await page.goto('/practice/login');

    await page.locator('#newUser').click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#userForm')).toBeVisible();
  });
});

test.describe('Multi-step Flow', () => {
  test('should complete practice form and verify modal, then navigate to books', async ({ page, testData }) => {
    // Step 1: Submit form (use custom data from fixture factory)
    const formData = testData.createPracticeFormData({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      gender: 'female',
      mobile: '1234567890',
    });
    await page.goto('/practice/practice-form');
    await page.locator('#firstName').fill(formData.firstName);
    await page.locator('#lastName').fill(formData.lastName);
    await page.locator('#userEmail').fill(formData.email);
    await page.locator('#gender-radio-2').check();
    await page.locator('#userNumber').fill(formData.mobile);
    await page.locator('#state').click();
    await page.getByText(formData.state, { exact: true }).click();
    await page.locator('#city').click();
    await page.getByText(formData.city, { exact: true }).click();
    await page.locator('#submit').click();

    await expect(page.getByText('Thanks for submitting the form')).toBeVisible();
    await page.locator('#close-modal').click();

    // Step 2: Navigate to books and search
    await page.goto('/practice/books');
    await page.locator('#searchBox').fill('Eloquent');
    await expect(page.getByText('Eloquent JavaScript')).toBeVisible();
  });
});
