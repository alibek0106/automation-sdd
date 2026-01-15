import { Page, Locator, expect } from '@playwright/test';
import { TIMEOUTS } from '../utils/Constants';
import { BasePage } from './BasePage';

export class AutomationExerciseProductDetailPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly RETRY_INTERVAL = 1000;
    private readonly SHORT_POLLING_TIMEOUT = 2000;

    private readonly SELECTORS = {
        CONTAINER_PRODUCT_INFO: '.product-information',
        TEXT_PRODUCT_PRICE: '.product-information span span'
    };

    // ===========================
    // Locators
    // ===========================
    private readonly quantityInput: Locator;
    private readonly addToCartButton: Locator;
    private readonly productInformation: Locator;
    private readonly productName: Locator;
    private readonly productPrice: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly viewCartLink: Locator;

    constructor(page: Page) {
        super(page, 'ProductDetailPage');

        // Product Interaction
        this.quantityInput = this.page.locator('#quantity').describe('Quantity Input');
        this.addToCartButton = this.page.getByRole('button', { name: 'Add to cart' }).describe('Add To Cart Button');

        // Product Info
        this.productInformation = this.page.locator(this.SELECTORS.CONTAINER_PRODUCT_INFO).describe('Product Information');
        // Scoped and role-based for Heading
        this.productName = this.productInformation.getByRole('heading', { level: 2 }).describe('Product Name');
        this.productPrice = this.page.locator(this.SELECTORS.TEXT_PRODUCT_PRICE).describe('Product Price');

        // Modal
        this.continueShoppingButton = this.page.getByRole('button', { name: 'Continue Shopping' }).describe('Continue Shopping Button');
        this.viewCartLink = this.page.getByRole('link', { name: 'View Cart' }).describe('View Cart Link');
    }

    // ===========================
    // Actions
    // ===========================

    async setQuantity(quantity: string): Promise<void> {
        await this.quantityInput.fill(quantity);
    }

    async addToCart(): Promise<void> {
        // Retry mechanism: Click add to cart and wait for modal to appear.
        // Handles cases where ads intercept the click.
        await expect(async () => {
            await this.addToCartButton.click();
            await expect(this.viewCartLink).toBeVisible({ timeout: this.SHORT_POLLING_TIMEOUT });
        }).toPass({
            timeout: TIMEOUTS.DEFAULT,
            intervals: [this.RETRY_INTERVAL]
        });
    }

    async clickContinueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async clickViewCart(): Promise<void> {
        await this.viewCartLink.click();
    }

    // ===========================
    // Verifications / Getters
    // ===========================

    async verifyProductDetailVisible(): Promise<void> {
        await expect(this.productInformation, 'Product Information should be visible').toBeVisible();
    }

    async getProductName(): Promise<string> {
        return this.productName.innerText();
    }

    async getProductPrice(): Promise<string> {
        return this.productPrice.innerText();
    }
}
