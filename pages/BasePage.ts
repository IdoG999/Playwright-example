import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page, protected basePath = '') {}

  async goto(path: string) {
    await this.page.goto(path.startsWith('http') ? path : this.basePath + path);
  }
}
