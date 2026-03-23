import type { Locator, Page } from '@playwright/test';

/**
 * Page object for Book Store. Uses getByText for book titles (user-facing).
 */
export class BooksPage {
  readonly searchBox: Locator;

  constructor(private page: Page) {
    this.searchBox = page.locator('#searchBox');
  }

  readonly url = '/practice/books';

  async goto() {
    await this.page.goto(this.url);
  }

  async search(query: string) {
    await this.searchBox.fill(query);
  }

  async clearSearch() {
    await this.searchBox.fill('');
  }

  async clickBook(bookId: string) {
    await this.page.locator(`#see-book-${bookId}`).click();
  }

  getBookByTitle(title: string): Locator {
    return this.page.getByText(title);
  }
}
