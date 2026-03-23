import { test, expect } from './fixtures';
import { PracticeFormPage, BooksPage, LoginPage } from '../pages';

test.describe('Practice Form', () => {
  test('should submit full student registration form', async ({ page, testData }) => {
    test.setTimeout(60000);
    const practiceFormPage = new PracticeFormPage(page);
    await practiceFormPage.goto();

    const data = testData.practiceForm;
    await practiceFormPage.fillForm(data);
    await practiceFormPage.submit();

    await expect(practiceFormPage.modal).toBeVisible();
    await expect(practiceFormPage.thanksMessage).toBeVisible();
    await expect(practiceFormPage.modal).toContainText(data.firstName);
    await expect(practiceFormPage.modal).toContainText(data.lastName);
  });
});

test.describe('Book Store', () => {
  test.beforeEach(async ({ page }) => {
    await new BooksPage(page).goto();
  });

  test('should search books and filter results', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await expect(booksPage.getBookByTitle('Git Pocket Guide')).toBeVisible();
    await expect(booksPage.getBookByTitle('Learning JavaScript Design Patterns')).toBeVisible();

    await booksPage.search('JavaScript');
    await expect(booksPage.getBookByTitle('Learning JavaScript Design Patterns')).toBeVisible();
    await expect(booksPage.getBookByTitle('Speaking JavaScript')).toBeVisible();
    await expect(booksPage.getBookByTitle('Git Pocket Guide')).toBeHidden();

    await booksPage.clearSearch();
    await expect(booksPage.getBookByTitle('Git Pocket Guide')).toBeVisible();
  });

  test('should navigate to book detail when clicking a book', async ({ page }) => {
    const booksPage = new BooksPage(page);
    await booksPage.clickBook('GitPocketGuide');

    await expect(page).toHaveURL(/\/books/);
  });
});

test.describe('Login - Negative and Navigation', () => {
  test('should show error on invalid credentials', async ({ page, testData }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const creds = testData.loginCredentials;
    await loginPage.fillCredentials(creds);
    await loginPage.login();

    await expect(loginPage.errorMessage).toContainText(/Invalid username or password/i);
  });

  test('should navigate to register when clicking New User', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoDemoQa();

    await loginPage.clickNewUser();

    await expect(page).toHaveURL(/\/register/);
    await expect(loginPage.backToLoginLink).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Multi-step Flow', () => {
  test('should complete practice form and verify modal, then navigate to books', async ({
    page,
    testData,
  }) => {
    test.setTimeout(60000);
    const formData = testData.createPracticeFormData({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      gender: 'female',
      mobile: '1234567890',
    });

    const practiceFormPage = new PracticeFormPage(page);
    await practiceFormPage.goto();
    await practiceFormPage.fillForm(formData);
    await practiceFormPage.submit();

    await expect(practiceFormPage.thanksMessage).toBeVisible();
    await practiceFormPage.closeModal();

    const booksPage = new BooksPage(page);
    await booksPage.goto();
    await booksPage.search('Eloquent');
    await expect(booksPage.getBookByTitle('Eloquent JavaScript')).toBeVisible();
  });
});
