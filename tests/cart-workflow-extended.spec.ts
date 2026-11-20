import { test, expect } from '@playwright/test';

test('Extended E2E: Multi-item cart lifecycle, quantity update, item removal & checkout', async ({ page }) => {
  // Increase overall test timeout to 90s to accommodate multi-step API calls on Render Cloud
  test.setTimeout(90000);

  // =========================================================================
  // 1. ADD THE FIRST PRODUCT TO THE CART (Classic T-Shirt)
  // =========================================================================
  await page.goto('/vn/store');

  //Search product 'Classic T-Shirt' by product link
  const firstProduct = page.getByRole('link', { name: /classic t-shirt/i }).first();
  await expect(firstProduct).toBeVisible({ timeout: 20000 });
  await firstProduct.click();

  await expect(page).toHaveURL(/.*products\/classic-t-shirt/, { timeout: 15000 });

  // Select Size 'L' variant if available on the product page
  const sizeLButton = page.getByRole('button', { name: 'L', exact: true });
  if (await sizeLButton.isVisible()) {
    await sizeLButton.click();
  }

  // Select Color 'Black' variant if available on the product page
  const colorBlackButton = page.getByRole('button', { name: /black/i });
  if (await colorBlackButton.isVisible()) {
    await colorBlackButton.click();
  }

  // Add first product into cart
  const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
  await expect(addToCartBtn).toBeEnabled({ timeout: 15000 });
  await addToCartBtn.click();

  // Wait for the cart badge to update to Cart (1)
  await expect(page.getByText(/Cart\s*\(1\)/i).first()).toBeVisible({ timeout: 25000 });

  // =========================================================================
  // 2. RETURN TO CATALOG AND ADD A SECOND DISTINCT PRODUCT (Winter jacket)
  // =========================================================================
  await page.goto('/vn/store');

  // Search product 'Winter jacket' by TestId
  const secondProduct = page.getByTestId('product-title').filter({ hasText: 'Winter jacket' });
  await expect(secondProduct).toBeVisible({ timeout: 20000 });
  await secondProduct.click();

  await expect(page).toHaveURL(/.*products\/winter-jacket/, { timeout: 15000 });

  // Add second product into cart
  await expect(addToCartBtn).toBeEnabled({ timeout: 15000 });
  await addToCartBtn.click();

  // Wait for the cart badge to update to Cart (2) and click "Go to cart"
  await expect(page.getByText(/Cart\s*\(2\)/i).first()).toBeVisible({ timeout: 25000 });

  const goToCartBtn = page.getByRole('button', { name: /go to cart/i }).first();
  await expect(goToCartBtn).toBeVisible({ timeout: 10000 });
  await goToCartBtn.click();

  await expect(page).toHaveURL(/.*\/cart/, { timeout: 15000 });

  // Verify that both distinct products are rendered in the cart table
  await expect(page.getByRole('link', { name: /classic t-shirt/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /winter jacket/i }).first()).toBeVisible();

  // =========================================================================
  // 3. INCREMENT QUANTITY OF "Classic T-Shirt" FROM 1 TO 2 & VERIFY SUBTOTAL
  // =========================================================================
  const subtotalLocator = page.getByTestId('cart-subtotal').first();
  await expect(subtotalLocator).toBeVisible({ timeout: 15000 });
  const subtotalBeforeQtyUpdate = await subtotalLocator.innerText();

  // Scope the locator to the "Classic T-Shirt" row to target its specific quantity dropdown
  const tShirtRow = page.locator('tbody tr').filter({ hasText: 'Classic T-Shirt' });
  const tShirtQtySelect = tShirtRow.getByTestId('product-select-button');

  // Select quantity of product 'Classic T-Shirt' to 2
  await expect(tShirtQtySelect).toBeVisible({ timeout: 10000 });
  await tShirtQtySelect.selectOption('2');

  // Assert the quantity value updates to '2' and the subtotal recalculates upward
  await expect(tShirtQtySelect).toHaveValue('2', { timeout: 20000 });
  await expect(subtotalLocator).not.toHaveText(subtotalBeforeQtyUpdate, { timeout: 20000 });

  const subtotalAfterQtyUpdate = await subtotalLocator.innerText();

  // =========================================================================
  // 4. REMOVE "Winter jacket" FROM THE CART & VERIFY SUBTOTAL RECALCULATION
  // =========================================================================
  // Scope the locator to the "Winter jacket" row and click its remove (trash) button
  const jacketRow = page.locator('tbody tr').filter({ hasText: 'Winter jacket' });
  const removeJacketBtn = jacketRow.getByTestId('delete-button').or(jacketRow.getByRole('button')).first();

  await expect(removeJacketBtn).toBeVisible({ timeout: 10000 });
  await removeJacketBtn.click();

  // Assert "Winter jacket" is removed from the DOM and the subtotal recalculates downward
  await expect(jacketRow).toBeHidden({ timeout: 20000 });
  await expect(subtotalLocator).not.toHaveText(subtotalAfterQtyUpdate, { timeout: 20000 });

  // =========================================================================
  // 5. VERIFY REMAINING CART ITEM AND PROCEED TO CHECKOUT
  // =========================================================================
  // Confirm "Classic T-Shirt" still remains in the shopping cart
  await expect(tShirtRow).toBeVisible({ timeout: 15000 });

  // Click the "Go to checkout" button
  const checkoutBtn = page.getByRole('button', { name: /go to checkout/i }).first();
  await expect(checkoutBtn).toBeEnabled({ timeout: 15000 });
  await checkoutBtn.click();

  // Assert transition to /vn/checkout and verify shipping form inputs are visible
  await expect(page).toHaveURL(/.*\/checkout/, { timeout: 20000 });
  await expect(page.getByTestId('shipping-first-name-input').or(page.getByLabel(/first name/i)).first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('shipping-email-input').or(page.getByLabel(/email/i)).first()).toBeVisible();
});