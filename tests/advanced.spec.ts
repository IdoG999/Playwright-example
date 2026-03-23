import { test, expect } from './fixtures';

/**
 * Advanced Playwright tests: API testing and Mock APIs.
 * @see https://playwright.dev/docs/mock
 * @see https://playwright.dev/docs/mock-browser-apis
 */
test.describe('Advanced Playwright Tests', () => {
  test.describe('API Testing', () => {
    test('should call API directly and assert response', async ({ request }) => {
      const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body).toHaveProperty('id', 1);
      expect(body).toHaveProperty('userId');
      expect(body).toHaveProperty('title');
      expect(body).toHaveProperty('body');
    });

    test('should POST to API and verify', async ({ request }) => {
      const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: { title: 'Test', body: 'Body', userId: 1 },
      });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('id');
      expect(body.title).toBe('Test');
    });
  });

  test.describe('Mock API', () => {
    test('should mock API and return custom response without calling real API', async ({
      page,
    }) => {
      await page.route('**/api/v1/fruits', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ name: 'Strawberry', id: 21 }]),
        });
      });

      await page.goto('https://demo.playwright.dev/api-mocking');
      await expect(page.getByText('Strawberry', { exact: true })).toBeVisible();
      await expect(page.getByText('Banana')).toBeHidden();
    });

    test('should modify API response and add new fruit to list', async ({ page }) => {
      await page.route('**/api/v1/fruits', async (route) => {
        const response = await route.fetch();
        const json = (await response.json()) as { name: string; id: number }[];
        json.push({ name: 'Loquat', id: 100 });
        await route.fulfill({ response, json });
      });

      await page.goto('https://demo.playwright.dev/api-mocking');
      await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
    });
  });

  test.describe('Mock Browser APIs', () => {
    test('should mock navigator.geolocation', async ({ page }) => {
      await page.addInitScript(() => {
        const mockPosition = {
          coords: { latitude: 51.5074, longitude: -0.1278 },
          timestamp: Date.now(),
        };
        navigator.geolocation.getCurrentPosition = (success) =>
          success(mockPosition as GeolocationPosition);
      });

      await page.goto('about:blank');
      const result = await page.evaluate(() => {
        return new Promise<{ lat: number; lon: number }>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
            () => resolve({ lat: 0, lon: 0 })
          );
        });
      });
      expect(result.lat).toBe(51.5074);
      expect(result.lon).toBe(-0.1278);
    });
  });
});
