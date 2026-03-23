import { Page } from '@playwright/test';
import type { PracticeFormData } from '../tests/fixtures/test-data';

export class PracticeFormPage {
  constructor(private page: Page) {}

  readonly url = 'https://demoqa.com/automation-practice-form';

  async goto() {
    await this.page.goto(this.url);
  }

  async fillForm(data: PracticeFormData) {
    await this.page.locator('#firstName').fill(data.firstName);
    await this.page.locator('#lastName').fill(data.lastName);
    await this.page.locator('#userEmail').fill(data.email);
    const genderMap = { male: 1, female: 2, other: 3 } as const;
    await this.page.locator(`#gender-radio-${genderMap[data.gender]}`).check();
    await this.page.locator('#userNumber').fill(data.mobile);
    await this.page.locator('#dateOfBirthInput').fill(data.dateOfBirth);
    await this.page.locator('#hobbies-checkbox-1').check();
    await this.page.locator('#currentAddress').fill(data.address);

    await this.page.locator('#state').click();
    await this.page.getByText(data.state, { exact: true }).click();
    await this.page.locator('#city').click();
    await this.page.getByText(data.city, { exact: true }).click();
  }

  async submit() {
    await this.page.locator('#submit').click();
  }

  async closeModal() {
    await this.page.locator('#closeLargeModal').click();
  }

  get modal() {
    return this.page.locator('.modal-content');
  }

  get thanksMessage() {
    return this.page.getByText('Thanks for submitting the form');
  }
}
