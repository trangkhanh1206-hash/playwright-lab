import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;
  readonly priceTag: Locator;

  constructor(page: Page) {
    super(page);
    // Use the first heading (h2 tag with the product name on the detail page)
    this.productTitle = page.getByRole('heading').first();
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.priceTag = page.getByTestId('product-price');
  }

  async selectSize(size: string): Promise<void> {
    await this.page.getByRole('button', { name: size, exact: true }).click();
  }

  async selectColor(color: string): Promise<void> {
    await this.page.getByRole('button', { name: color, exact: true }).click();
  }
  
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
