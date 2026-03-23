import type { Locator, Page } from '@playwright/test';
import type { TextBoxFormData } from '../tests/fixtures/test-data';

/** Page object for XQA Text Box practice. */
export class TextBoxPage {
  readonly output: Locator;

  constructor(private page: Page) {
    this.output = page.locator('#output');
  }

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
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}
