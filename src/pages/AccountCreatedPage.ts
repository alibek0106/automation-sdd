import { Page, Locator, expect } from '@playwright/test';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly SELECTORS = {
        BTN_CONTINUE: '[data-qa="continue-button"]'
    };

    // ===========================
    // Locators
    // ===========================
    private readonly accountCreatedHeader: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        super(page, 'AccountCreatedPage');
        this.accountCreatedHeader = page.getByText(MESSSAGES.ACCOUNT_CREATED);
        this.continueButton = this.page.locator(this.SELECTORS.BTN_CONTINUE).describe('Continue Button');
    }

    // ===========================
    // Actions
    // ===========================

    async verifyAccountCreatedMessage() {
        await expect(this.accountCreatedHeader, 'Account created message should be visible').toBeVisible();
    }

    async clickContinue() {
        await this.continueButton.click();
    }
}
