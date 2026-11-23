import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;
  readonly priceTag: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.getByRole('heading').first();
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.priceTag = page.getByTestId('product-price');
  }

  async openProductFromStore(productName: string): Promise<void> {
    await this.navigateTo('/vn/store');
    const productLink = this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first();
    await expect(productLink).toBeVisible({ timeout: 20000 });
    await productLink.click();
    await expect(this.page).toHaveURL(/.*products/, { timeout: 15000 });
  }

  async selectSize(size: string): Promise<void> {
    const sizeBtn = this.page.getByRole('button', { name: size, exact: true });
    if (await sizeBtn.isVisible()) {
      await sizeBtn.click();
    }
  }

  async selectColor(color: string): Promise<void> {
    const colorBtn = this.page.getByRole('button', { name: color, exact: true });
    if (await colorBtn.isVisible()) {
      await colorBtn.click();
    }
  }
  
  async addToCart(): Promise<void> {
    await expect(this.addToCartButton).toHaveText(/add to cart/i, { timeout: 15000 });
    await expect(this.addToCartButton).toBeEnabled({ timeout: 15000 });
    await this.addToCartButton.click();
  }
}
