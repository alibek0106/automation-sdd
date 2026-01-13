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
        INPUT_QUANTITY: '#quantity',
        BTN_ADD_TO_CART: 'button.cart',
        CONTAINER_PRODUCT_INFO: '.product-information',
        TEXT_PRODUCT_NAME: '.product-information h2',
        TEXT_PRODUCT_PRICE: '.product-information span span',
        // Modal elements
        BTN_CONTINUE_SHOPPING: '.modal-footer button',
        LINK_VIEW_CART: '.modal-body a[href="/view_cart"]'
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
        this.quantityInput = this.page.locator(this.SELECTORS.INPUT_QUANTITY).describe('Quantity Input');
        this.addToCartButton = this.page.locator(this.SELECTORS.BTN_ADD_TO_CART).describe('Add To Cart Button');

        // Product Info
        this.productInformation = this.page.locator(this.SELECTORS.CONTAINER_PRODUCT_INFO).describe('Product Information');
        this.productName = this.page.locator(this.SELECTORS.TEXT_PRODUCT_NAME).describe('Product Name');
        this.productPrice = this.page.locator(this.SELECTORS.TEXT_PRODUCT_PRICE).describe('Product Price');

        // Modal
        this.continueShoppingButton = this.page.locator(this.SELECTORS.BTN_CONTINUE_SHOPPING).describe('Continue Shopping Button');
        this.viewCartLink = this.page.locator(this.SELECTORS.LINK_VIEW_CART).describe('View Cart Link');
    }

    // ===========================
    // Actions
    // ===========================

    async setQuantity(quantity: string) {
        await this.quantityInput.fill(quantity);
    }

    async addToCart() {
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

    async clickContinueShopping() {
        await this.continueShoppingButton.click();
    }

    async clickViewCart() {
        await this.viewCartLink.click();
    }

    // ===========================
    // Verifications / Getters
    // ===========================

    async verifyProductDetailVisible() {
        await expect(this.productInformation, 'Product Information should be visible').toBeVisible();
    }

    async getProductName(): Promise<string> {
        return this.productName.innerText();
    }

    async getProductPrice(): Promise<string> {
        return this.productPrice.innerText();
    }
}
