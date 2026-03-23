import { Page } from '@playwright/test';

export class ButtonsPage {
  constructor(private page: Page) {}

  readonly url = '/practice/buttons';

  async goto() {
    await this.page.goto(this.url);
  }

  async clickDynamic() {
    await this.page.locator('#dynamicClickBtn').click();
  }

  async doubleClick() {
    await this.page.locator('#doubleClickBtn').dblclick();
  }

  async rightClick() {
    await this.page.locator('#rightClickBtn').click({ button: 'right' });
  }

  get dynamicClickMessage() {
    return this.page.getByText('You have done a dynamic click');
  }

  get doubleClickMessage() {
    return this.page.getByText('You have done a double click');
  }

  get rightClickMessage() {
    return this.page.getByText('You have done a right click');
  }
}
