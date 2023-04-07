import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 13'],
});

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Replace the URL with the actual URL of your application
    await page.goto(
      'http://localhost:3000/?resid=642353ea8806cefe68ba43fe&tabid=1'
    );
  });

  test.describe('UI', () => {
    test('Load restaurant name', async ({ page }) => {
      const restaurantName = await page.$('#restaurantName');
      expect(restaurantName).toBeTruthy();
    });

    test('Load categories', async ({ page }) => {
      const categories = await page.$$('.category');
      expect(categories.length).toBeGreaterThan(0);
    });

    test('Load menù', async ({ page }) => {
      // Wait for the foodListContainer to be visible on the page
      await page.waitForSelector('#foodListContainer');

      // Get all the food-item elements inside the foodListContainer
      const foodItems = await page.$$('#foodListContainer .food-item');

      // Check if there are any food-item elements
      expect(foodItems.length).toBeGreaterThan(0);
    });
  });

  test.describe('UX', () => {
    test('Main Order Flow', async ({ page }) => {
      // Add the first 3 food items to the cart
      await page.locator('.add-button').first().click();
      await page
        .locator(
          'div:nth-child(2) > .backdrop-blur-4xl > div > .w-1\\/4 > .add-button > .backdrop-blur-lg'
        )
        .click();
      await page
        .locator(
          'div:nth-child(3) > .backdrop-blur-4xl > div > .w-1\\/4 > .add-button > .backdrop-blur-lg'
        )
        .click();

      // Click the second category button
      await page.locator('.category:nth-child(1)').click();

      // Add one more food item to the cart
      await page.locator('.add-button').first().click();

      // Click the second category button
      await page.locator('.category:nth-child(2)').click();

      // Add one more food item to the cart
      await page.locator('.add-button').first().click();

      // Click the order button
      await page.locator('#ordine').click();

      // Input some test notes
      await page.getByPlaceholder('Note').click();
      await page.getByPlaceholder('Note').fill('Test Notes');

      // Click another time the order button this time it will confirm the order and then trigger a dialog for double check
      await page.locator('#ordine').click();

      page.once('dialog', (dialog) => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept().catch(() => {});
      });

      // Finally check fot the navigation to the confirmation page
      await page.waitForNavigation();
      expect(page.url()).toBe(
        'http://localhost:3000/confirmation?resid=642353ea8806cefe68ba43fe&tabid=1'
      );
    });
  });
});
