import type { Locator, Page } from '@playwright/test';

/**
 * Page object for XQA Buttons practice.
 * Locators stored in constructor per Playwright POM pattern.
 */
export class ButtonsPage {
  readonly dynamicClickMessage: Locator;
  readonly doubleClickMessage: Locator;
  readonly rightClickMessage: Locator;

  constructor(private page: Page) {
    this.dynamicClickMessage = page.getByText('You have done a dynamic click');
    this.doubleClickMessage = page.getByText('You have done a double click');
    this.rightClickMessage = page.getByText('You have done a right click');
  }

  readonly url = '/practice/buttons';

  async goto() {
    await this.page.goto(this.url);
  }

  async clickDynamic() {
    await this.page.getByRole('button', { name: 'Click Me' }).click();
  }

  async doubleClick() {
    await this.page.getByRole('button', { name: 'Double Click Me' }).dblclick();
  }

  async rightClick() {
    await this.page.getByRole('button', { name: 'Right Click Me' }).click({ button: 'right' });
  }
}
