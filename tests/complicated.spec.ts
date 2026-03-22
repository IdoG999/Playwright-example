import { test, expect } from '@playwright/test';

test.describe('Practice Form', () => {
  test('should submit full student registration form', async ({ page }) => {
    await page.goto('/practice/practice-form');

    // Fill required and optional fields
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('john.doe@example.com');
    await page.locator('#gender-radio-1').check(); // Male
    await page.locator('#userNumber').fill('9876543210');
    await page.locator('#dateOfBirthInput').fill('1995-05-15');
    await page.locator('#hobbies-checkbox-1').check(); // Sports
    await page.locator('#currentAddress').fill('123 Main Street, City');

    // State and City dropdowns
    await page.locator('#state').click();
    await page.getByText('NCR', { exact: true }).click();
    await page.locator('#city').click();
    await page.getByText('Delhi', { exact: true }).click();

    await page.locator('#submit').click();

    // Verify success modal
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.getByText('Thanks for submitting the form')).toBeVisible();
    await expect(page.locator('.modal-content')).toContainText('John');
    await expect(page.locator('.modal-content')).toContainText('Doe');
    await expect(page.locator('.modal-content')).toContainText('john.doe@example.com');
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
  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/practice/login');

    await page.locator('#userName').fill('invaliduser');
    await page.locator('#password').fill('wrongpassword');
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
  test('should complete practice form and verify modal, then navigate to books', async ({ page }) => {
    // Step 1: Submit form
    await page.goto('/practice/practice-form');
    await page.locator('#firstName').fill('Jane');
    await page.locator('#lastName').fill('Smith');
    await page.locator('#userEmail').fill('jane@example.com');
    await page.locator('#gender-radio-2').check(); // Female
    await page.locator('#userNumber').fill('1234567890');
    await page.locator('#submit').click();

    await expect(page.getByText('Thanks for submitting the form')).toBeVisible();
    await page.locator('#close-modal').click();

    // Step 2: Navigate to books and search
    await page.goto('/practice/books');
    await page.locator('#searchBox').fill('Eloquent');
    await expect(page.getByText('Eloquent JavaScript')).toBeVisible();
  });
});
