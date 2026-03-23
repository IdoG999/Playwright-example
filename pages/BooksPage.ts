import { Page } from '@playwright/test';

export class BooksPage {
  constructor(private page: Page) {}

  readonly url = '/practice/books';

  async goto() {
    await this.page.goto(this.url);
  }

  async search(query: string) {
    await this.page.locator('#searchBox').fill(query);
  }

  async clearSearch() {
    await this.page.locator('#searchBox').fill('');
  }

  async clickBook(bookId: string) {
    await this.page.locator(`#see-book-${bookId}`).click();
  }

  getBookByTitle(title: string) {
    return this.page.getByText(title);
  }
}
