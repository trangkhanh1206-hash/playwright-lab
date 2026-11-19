import { test, expect } from '@playwright/test';

test('E2E Cart Workflow: Select variant, add to cart, verify drawer & update quantity', async ({ page }) => {
  // 1. Navigate to the product list (/vn/store) and select a product
  await page.goto('/vn/store');

  const productCard = page.getByRole('link', { name: /classic t-shirt/i }).first();
  await expect(productCard).toBeVisible({ timeout: 15000 });
  await productCard.click();

  await expect(page).toHaveURL(/.*products/, { timeout: 15000 });

  // 2. SELECT A DYNAMIC VARIATION (IF THE PRODUCT HAS MULTIPLE OPTIONS)
  const sizeLButton = page.getByRole('button', { name: 'L', exact: true });
  if (await sizeLButton.isVisible()) {
    await sizeLButton.click();
  }

  const colorBlackButton = page.getByRole('button', { name: /black/i });
  if (await colorBlackButton.isVisible()) {
    await colorBlackButton.click();
  }

  // 3. ADD-TO-CART
  const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
  await expect(addToCartBtn).toBeEnabled({ timeout: 15000 });
  await addToCartBtn.click();

  // 4. CHECK SHOPPING CART STATUS UPDATED (1) AND CLICK "GO TO CART"
  const cartCounterOne = page.getByText(/Cart\s*\(1\)/i).first();
  await expect(cartCounterOne).toBeVisible({ timeout: 25000 });

  // Use .first() to avoid strict mode violation errors between the <a> and <button> tags
  const goToCartBtn = page.getByRole('button', { name: /go to cart/i }).first();
  await expect(goToCartBtn).toBeVisible({ timeout: 10000 });
  await goToCartBtn.click();

  // Confirmation that you have been redirected to the shopping cart page (/vn/cart)
  await expect(page).toHaveURL(/.*\/cart/, { timeout: 15000 });

  // 5. ADJUST THE QUANTITY FROM 1 TO 2 AND CHECK THE SUBTOTAL
  // Use the initial estimated monetary value (e.g., ₫500,000)
  const subtotalLocator = page.getByTestId('cart-subtotal').first();
  await expect(subtotalLocator).toBeVisible({ timeout: 15000 });
  const initialSubtotal = await subtotalLocator.innerText();

  // Select quantity = 2 in the dropdown box <select data-testid="product-select-button">
  const quantitySelect = page.getByTestId('product-select-button').first();
  await expect(quantitySelect).toBeVisible({ timeout: 15000 });

  // Click '2' and wait for Server Action to update the shopping cart and complete the response
  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/cart') && resp.status() === 200, { timeout: 20000 }).catch(() => null),
    quantitySelect.selectOption('2'),
  ]);

  // Confirm that the quantity field retains the value '2' and the estimated total will automatically update
  await expect(quantitySelect).toHaveValue('2', { timeout: 20000 });
  await expect(subtotalLocator).not.toHaveText(initialSubtotal, { timeout: 20000 });
});