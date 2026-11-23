import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { ProductPage } from '../pages/CartPage';

test.describe('Medusa Storefront - POM Variant Selection', () => {

  test('Student verifies variant selection & cart interaction via POM', async ({ page }) => {
    // 1. Instantiate the Page Object
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // 2. Navigate via BasePage method
    await productPage.openProductFromStore('Classic T-Shirt');
    await expect(productPage.productTitle).toContainText(/classic t-shirt/i, { timeout: 15000 });

    // 3. Perform actions through business methods (NO raw selectors!)
    await productPage.selectSize('M');
    await productPage.selectColor('White');
    await productPage.addToCart();
    
    // 4. Assert UI state change (Web-first assertion via Page Object)
    await expect(cartPage.cartCounterOne).toBeVisible({ timeout: 20000 });
  });
});
