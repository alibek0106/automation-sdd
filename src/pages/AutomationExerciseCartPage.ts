import { Page, Locator, expect } from '@playwright/test';
import { MESSSAGES } from '../constants/Messages';
import { TIMEOUTS } from '../utils/Constants';
import { BasePage } from './BasePage';

export class AutomationExerciseCartPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly SELECTORS = {
        TABLE_CART: '#cart_info_table',
        TABLE_ROWS: '#cart_info_table tbody tr',
        MSG_EMPTY_CART: '#empty_cart',
        BTN_PROCEED_CHECKOUT: 'text=Proceed To Checkout',

        // Row specific selectors (relative to row)
        BTN_DELETE: '.cart_quantity_delete',
        BTN_QUANTITY: '.cart_quantity button',
        TEXT_PRICE: '.cart_price p',
        TEXT_TOTAL: '.cart_total p',
        LINK_DESCRIPTION: '.cart_description h4 a'
    };

    // ===========================
    // Locators
    // ===========================
    private readonly cartTable: Locator;
    private readonly cartRows: Locator;
    private readonly emptyCartMessage: Locator;
    private readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        super(page, 'CartPage');
        this.cartTable = this.page.locator(this.SELECTORS.TABLE_CART).describe('Cart Table');
        this.cartRows = this.page.locator(this.SELECTORS.TABLE_ROWS).describe('Cart Rows');
        this.emptyCartMessage = this.page.locator(this.SELECTORS.MSG_EMPTY_CART).describe('Empty Cart Message');
        this.proceedToCheckoutButton = this.page.getByText('Proceed To Checkout').describe('Proceed To Checkout Button');
    }

    // ===========================
    // Actions
    // ===========================

    async removeProduct(productName: string) {
        const row = this.cartRows.filter({ hasText: productName });

        // Retry mechanism: Click delete and verify it disappears.
        await expect(async () => {
            // 1. Success Check: If empty cart message is visible, product is effectively removed.
            if (await this.emptyCartMessage.isVisible()) {
                return;
            }

            // 2. Success Check: If row is already hidden, we are good.
            if (await row.isHidden()) {
                return;
            }

            // 3. Action: Click delete (only if we still see the row)
            await row.locator(this.SELECTORS.BTN_DELETE).click();

            // 4. Verification: Wait for either row to vanish OR empty cart to appear
            // We poll manually here to support the OR condition within the outer retry
            await expect.poll(async () => {
                const isRowGone = await row.isHidden();
                const isEmptyVisible = await this.emptyCartMessage.isVisible();
                return isRowGone || isEmptyVisible;
            }, { timeout: 2000 }).toBe(true);

        }).toPass({
            timeout: TIMEOUTS.DEFAULT,
            intervals: [1000]
        });
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }

    // ===========================
    // Verifications / Getters
    // ===========================

    async verifyCartEmpty() {
        await expect(this.emptyCartMessage, 'Empty cart message should be as expected').toContainText(MESSSAGES.CART_EMPTY);
    }

    async verifyCartVisible() {
        await expect(this.cartTable, 'Cart table should be visible').toBeVisible();
    }

    async verifyProductQuantity(productName: string, quantity: string) {
        // Finding the row that contains the product name
        const row = this.cartRows.filter({ hasText: productName });
        const quantityButton = row.locator(this.SELECTORS.BTN_QUANTITY);
        await expect(quantityButton, 'Product quantity should match').toHaveText(quantity);
    }

    async verifyProductPrice(productName: string, price: string) {
        const row = this.cartRows.filter({ hasText: productName });
        const priceElement = row.locator(this.SELECTORS.TEXT_PRICE);
        await expect(priceElement, 'Product price should match').toHaveText(price);
    }

    async verifyTotalPrice(productName: string, total: string) {
        const row = this.cartRows.filter({ hasText: productName });
        const totalElement = row.locator(this.SELECTORS.TEXT_TOTAL);
        await expect(totalElement, 'Total price should match').toHaveText(total);
    }

    async getCartProducts() {
        return this.cartRows.all();
    }

    async verifyProductRemoved(productName: string) {
        await expect(this.cartRows.filter({ hasText: productName }), 'Product should be removed').not.toBeVisible();
    }

    async getCartItemsDetails(): Promise<{ name: string, price: string, quantity: string, total: string }[]> {
        const rows = await this.cartRows.all();
        const details = [];
        for (const row of rows) {
            const name = await row.locator(this.SELECTORS.LINK_DESCRIPTION).innerText();
            const price = await row.locator(this.SELECTORS.TEXT_PRICE).innerText();
            const quantity = await row.locator(this.SELECTORS.BTN_QUANTITY).innerText();
            const total = await row.locator(this.SELECTORS.TEXT_TOTAL).innerText();
            details.push({ name, price, quantity, total });
        }
        return details;
    }
}
