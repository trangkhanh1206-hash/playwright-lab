import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model (POM) representing the Product Detail Page (PDP)
 * on the Medusa Next.js Storefront.
 * Encapsulates all UI locators and business actions for product navigation,
 * variant selection (Size & Color), and cart interaction.
 */
export class ProductPage extends BasePage {
  // =========================================================================
  // 1. UI LOCATORS (Encapsulated element selectors)
  // =========================================================================
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;
  readonly priceTag: Locator;

  constructor(page: Page) {
    super(page);
    // Uses the first heading element (rendered as <h2> on Medusa PDP)
    this.productTitle = page.getByRole('heading').first();
    // Matches the primary purchase CTA button case-insensitively
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    // Targets the product price element via its semantic test ID
    this.priceTag = page.getByTestId('product-price');
  }

  // =========================================================================
  // 2. BUSINESS ACTIONS (User workflows exposed to test specs)
  // =========================================================================

  /**
   * Navigates through the store catalog (/vn/store) and opens a specific product.
   * Going via /vn/store initializes the Vietnam region cookie and wakes up
   * the Render Cloud backend, preventing direct-link Next.js SSR 500 errors.
   *
   * @param productName - Display name of the target product (e.g., 'Classic T-Shirt')
   */
  async openProductFromStore(productName: string): Promise<void> {
    await this.navigateTo('/vn/store');
    
    // Locate the product card link matching the given name (case-insensitive)
    const productLink = this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first();
    
    // Extended timeout (20s) to accommodate Render Cloud cold-start latency
    await expect(productLink).toBeVisible({ timeout: 20000 });
    await productLink.click();

    // Verify navigation successfully transitioned to a product detail route
    await expect(this.page).toHaveURL(/.*products/, { timeout: 15000 });
  }

  /**
   * Selects a product size variant button (e.g., 'S', 'M', 'L').
   * Uses exact matching so 'S' does not collide with substrings in other labels.
   *
   * @param size - Exact size label displayed on the option button
   */
  async selectSize(size: string): Promise<void> {
    const sizeBtn = this.page.getByRole('button', { name: size, exact: true });
    await expect(sizeBtn).toBeVisible({ timeout: 10000 });
    await sizeBtn.click();
  }

  /**
   * Selects a product color variant button (e.g., 'White', 'Black').
   *
   * @param color - Exact color label displayed on the option button
   */
  async selectColor(color: string): Promise<void> {
    const colorBtn = this.page.getByRole('button', { name: color, exact: true });
    await expect(colorBtn).toBeVisible({ timeout: 10000 });
    await colorBtn.click();
  }

  /**
   * Adds the currently selected product variant to the shopping cart.
   * Verifies the selected variant is in stock ("Add to cart" vs "Out of stock")
   * and includes a resilient retry if Render Cloud throttles the first request.
   */
  async addToCart(): Promise<void> {
    // Ensure the selected Size + Color combination is in stock and clickable
    await expect(this.addToCartButton).toHaveText(/add to cart/i, { timeout: 15000 });
    await expect(this.addToCartButton).toBeEnabled({ timeout: 15000 });
    await this.addToCartButton.click();

    // Wait for the header cart counter to update to Cart (1);
    // retry once if free-tier cloud backend latency drops the initial click
    const cartOne = this.page.getByText(/Cart\s*\(1\)/i).first();
    try {
      await expect(cartOne).toBeVisible({ timeout: 15000 });
    } catch {
      if (await this.addToCartButton.isEnabled()) {
        await this.addToCartButton.click();
      }
    }
  }
}
