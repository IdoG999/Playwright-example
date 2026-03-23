import { Page } from '@playwright/test';
import type { TextBoxFormData } from '../tests/fixtures/test-data';

export class TextBoxPage {
  constructor(private page: Page) {}

  readonly url = '/practice/text-box';

  async goto() {
    await this.page.goto(this.url);
  }

  async fillForm(data: TextBoxFormData) {
    await this.page.locator('#userName').fill(data.fullName);
    await this.page.locator('#userEmail').fill(data.email);
    await this.page.locator('#currentAddress').fill(data.currentAddress);
    await this.page.locator('#permanentAddress').fill(data.permanentAddress);
  }

  async submit() {
    await this.page.locator('#submit').click();
  }

  get output() {
    return this.page.locator('#output');
  }
}
