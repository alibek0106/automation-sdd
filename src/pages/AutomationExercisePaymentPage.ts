import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PAGE_TITLES } from '../utils/Constants';

export class AutomationExercisePaymentPage extends BasePage {
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

        this.nameOnCardInput = this.page.locator('input[name="name_on_card"]').describe('Name on Card Input');
        this.cardNumberInput = this.page.locator('input[name="card_number"]').describe('Card Number Input');
        this.cvcInput = this.page.locator('input[name="cvc"]').describe('CVC Input');
        this.expirationMonthInput = this.page.locator('input[name="expiry_month"]').describe('Expiration Month Input');
        this.expirationYearInput = this.page.locator('input[name="expiry_year"]').describe('Expiration Year Input');
        this.payButton = this.page.getByRole('button', { name: 'Pay and Confirm Order' }).describe('Pay and Confirm Order Button');
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
