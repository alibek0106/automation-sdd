import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PAGE_TITLES } from '../utils/Constants';

export class AutomationExercisePaymentPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly SELECTORS = {
        INPUT_NAME: 'input[name="name_on_card"]',
        INPUT_CARD_NUMBER: 'input[name="card_number"]',
        INPUT_CVC: 'input[name="cvc"]',
        INPUT_EXPIRY_MONTH: 'input[name="expiry_month"]',
        INPUT_EXPIRY_YEAR: 'input[name="expiry_year"]',
        BTN_PAY: '[data-qa="pay-button"]'
    };

    // ===========================
    // Locators
    // ===========================
    private readonly nameOnCardInput: Locator;
    private readonly cardNumberInput: Locator;
    private readonly cvcInput: Locator;
    private readonly expirationMonthInput: Locator;
    private readonly expirationYearInput: Locator;
    private readonly payButton: Locator;

    constructor(page: Page) {
        super(page, 'PaymentPage');

        this.nameOnCardInput = this.page.locator(this.SELECTORS.INPUT_NAME).describe('Name on Card Input');
        this.cardNumberInput = this.page.locator(this.SELECTORS.INPUT_CARD_NUMBER).describe('Card Number Input');
        this.cvcInput = this.page.locator(this.SELECTORS.INPUT_CVC).describe('CVC Input');
        this.expirationMonthInput = this.page.locator(this.SELECTORS.INPUT_EXPIRY_MONTH).describe('Expiration Month Input');
        this.expirationYearInput = this.page.locator(this.SELECTORS.INPUT_EXPIRY_YEAR).describe('Expiration Year Input');
        this.payButton = this.page.locator(this.SELECTORS.BTN_PAY).describe('Pay and Confirm Order Button');
    }

    // ===========================
    // Actions
    // ===========================

    async verifyPageLoaded(): Promise<void> {
        await expect(this.page, 'Payment Page should be loaded').toHaveTitle(PAGE_TITLES.PAYMENT);
    }

    async enterNameOnCard(name: string): Promise<void> {
        await this.nameOnCardInput.fill(name);
    }

    async enterCardNumber(number: string): Promise<void> {
        await this.cardNumberInput.fill(number);
    }

    async enterCVC(cvc: string): Promise<void> {
        await this.cvcInput.fill(cvc);
    }

    async enterExpirationMonth(month: string): Promise<void> {
        await this.expirationMonthInput.fill(month);
    }

    async enterExpirationYear(year: string): Promise<void> {
        await this.expirationYearInput.fill(year);
    }

    async clickPayAndConfirm(): Promise<void> {
        await this.payButton.click();
    }
}
