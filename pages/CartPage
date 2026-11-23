import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartCounterOne: Locator;
  readonly goToCartButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartCounterOne = page.getByText(/Cart\s*\(1\)/i).first();
    this.goToCartButton = page.getByRole('button', { name: /go to cart/i }).first();
    this.checkoutButton = page.getByRole('button', { name: /go to checkout/i }).first();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
