import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    // User-centric accessibility locators
    this.productTitle = page.getByRole('heading', { level: 1 });
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
  }

  async selectSize(size: string): Promise<void> {
    // Locates button by accessible text 'M', 'L', etc.
    const sizeButton = this.page.getByRole('button', { name: size, exact: true });
    await sizeButton.click();
  }

  async selectColor(color: string): Promise<void> {
    // Locates button by accessible text 'Black', 'White', etc.
    const colorButton = this.page.getByRole('button', { name: color, exact: true });
    await colorButton.click();
  }
  
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
