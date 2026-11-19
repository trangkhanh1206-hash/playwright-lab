import { test, expect } from '@playwright/test';

test('Verify guest customer can browse store and view Winter jacket details', async ({ page }) => {
  // STEP 1: Navigate to the Storefront homepage (uses baseURL from config)
  await page.goto('/');

  // STEP 2: Open the navigation Menu and go to the Store catalog
  const menuButton = page.getByRole('button', { name: /menu/i });
  await expect(menuButton).toBeVisible();
  await menuButton.click();

  const storeLink = page.getByRole('link', { name: /^store$/i });
  await expect(storeLink).toBeVisible();
  await storeLink.click();

  // Verify navigation to the /vn/store catalog page
  await expect(page).toHaveURL(/.*\/store/);

  // STEP 3: Select the "Winter jacket" product from the product list
  // Increased timeout to 15000ms to accommodate Render Cloud cold-start latency
  const productCard = page.getByRole('link', { name: /winter jacket/i }).first();
  await expect(productCard).toBeVisible({ timeout: 15000 });
  await productCard.click();

  // STEP 4: Web-First Assertions to verify the product detail page
  // 1. Verify the URL transitions to the product details route (/products/...)
  await expect(page).toHaveURL(/.*products/, { timeout: 15000 });

  // 2. Verify the product heading is visible on the page
  const productTitle = page.getByRole('heading', { name: /winter jacket/i });
  await expect(productTitle).toBeVisible();
});
