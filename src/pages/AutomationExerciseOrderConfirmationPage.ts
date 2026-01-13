import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { MESSAGES } from '../utils/Constants';

export class AutomationExerciseOrderConfirmationPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly SELECTORS = {
        BTN_DOWNLOAD_INVOICE: 'a.check_out',
        BTN_CONTINUE: '[data-qa="continue-button"]'
    };

    // ===========================
    // Locators
    // ===========================
    private readonly orderPlacedMessage: Locator;
    private readonly downloadInvoiceButton: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        super(page, 'OrderConfirmationPage');

        // Using getByText with the constant message is robust and readable here
        this.orderPlacedMessage = page.getByText(MESSAGES.ORDER_PLACED);

        this.downloadInvoiceButton = this.page.locator(this.SELECTORS.BTN_DOWNLOAD_INVOICE).describe('Download Invoice Button');
        this.continueButton = this.page.locator(this.SELECTORS.BTN_CONTINUE).describe('Continue Button');
    }

    // ===========================
    // Actions
    // ===========================

    async verifyPageLoaded(): Promise<void> {
        await expect(this.orderPlacedMessage).toBeVisible();
    }

    async verifyOrderConfirmed(): Promise<void> {
        await this.verifyPageLoaded();
    }

    async clickDownloadInvoice(): Promise<void> {
        await this.downloadInvoiceButton.click();
    }

    async verifyDownloadInvoiceVisible(): Promise<void> {
        await expect(this.downloadInvoiceButton, 'Download Invoice Button should be visible').toBeVisible();
    }

    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
