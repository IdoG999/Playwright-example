import { Page } from '@playwright/test';
import type { LoginCredentials } from '../tests/fixtures/test-data';

export class LoginPage {
  constructor(private page: Page) {}

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

  get errorMessage() {
    return this.page.locator('#name');
  }

  get backToLoginLink() {
    return this.page.getByText(/back to login/i);
  }
}
