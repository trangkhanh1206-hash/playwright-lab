import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartDrawer: Locator;
  readonly cartCounterOne: Locator;
  readonly goToCartButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    // Point cartDrawer to the dropdown cart frame (or Cart counter (1) when adding products)
    this.cartDrawer = page.getByTestId('nav-cart-dropdown').or(page.getByText(/Cart\s*\(1\)/i)).first();
    this.cartCounterOne = page.getByText(/Cart\s*\(1\)/i).first();
    this.goToCartButton = page.getByRole('button', { name: /go to cart/i }).first();
    this.checkoutButton = page.getByRole('button', { name: /go to checkout/i }).first();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
