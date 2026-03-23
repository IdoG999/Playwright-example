import type { Locator, Page } from '@playwright/test';
import type { LoginCredentials } from '../tests/fixtures/test-data';

/**
 * Page object for Login (XQA and DemoQA).
 */
export class LoginPage {
  readonly errorMessage: Locator;
  readonly backToLoginLink: Locator;

  constructor(private page: Page) {
    this.errorMessage = page.locator('#name');
    this.backToLoginLink = page.getByText(/back to login/i);
  }

  readonly url = '/practice/login';
  readonly demoQaLoginUrl = 'https://demoqa.com/login';

  async goto() {
    await this.page.goto(this.url);
  }

  async gotoDemoQa() {
    await this.page.goto(this.demoQaLoginUrl);
  }

  async fillCredentials(creds: LoginCredentials) {
    await this.page.locator('#userName').fill(creds.userName);
    await this.page.locator('#password').fill(creds.password);
  }

  async login() {
    await this.page.locator('#login').click();
  }

  async clickNewUser() {
    await this.page.locator('#newUser').click();
  }
}
