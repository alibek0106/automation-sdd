import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../constants/Routes';

export class AutomationExerciseContactUsPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly SELECTORS = {
        HEADING: 'h2.title:has-text("Get In Touch")',
        INPUT_NAME: '[data-qa="name"]',
        INPUT_EMAIL: '[data-qa="email"]',
        INPUT_SUBJECT: '[data-qa="subject"]',
        INPUT_MESSAGE: '[data-qa="message"]',
        INPUT_FILE_UPLOAD: 'input[name="upload_file"]',
        BTN_SUBMIT: '[data-qa="submit-button"]',
        MSG_SUCCESS: '.status.alert-success',
        BTN_HOME: '.btn-success' // Still using specific class, but isolated here. If verification fails, we can refine to '.btn-success >> text=Home'
    };

    // ===========================
    // Locators
    // ===========================
    private readonly nameInput: Locator;
    private readonly emailInput: Locator;
    private readonly subjectInput: Locator;
    private readonly messageInput: Locator;
    private readonly uploadFileInput: Locator;
    private readonly submitButton: Locator;
    private readonly successMessage: Locator;
    private readonly homeButton: Locator;
    private readonly heading: Locator;

    constructor(page: Page) {
        super(page, 'ContactUsPage');

        this.heading = this.page.locator(this.SELECTORS.HEADING).describe('Contact Us Heading');
        this.nameInput = this.page.locator(this.SELECTORS.INPUT_NAME).describe('Contact Name Input');
        this.emailInput = this.page.locator(this.SELECTORS.INPUT_EMAIL).describe('Contact Email Input');
        this.subjectInput = this.page.locator(this.SELECTORS.INPUT_SUBJECT).describe('Contact Subject Input');
        this.messageInput = this.page.locator(this.SELECTORS.INPUT_MESSAGE).describe('Contact Message Input');
        this.uploadFileInput = this.page.locator(this.SELECTORS.INPUT_FILE_UPLOAD).describe('Upload File Input');
        this.submitButton = this.page.locator(this.SELECTORS.BTN_SUBMIT).describe('Submit Button');
        this.successMessage = this.page.locator(this.SELECTORS.MSG_SUCCESS).describe('Success Message');

        // Refined locator to ensure we click the actual "Home" button if multiple success buttons appear
        this.homeButton = this.page.locator(this.SELECTORS.BTN_HOME).filter({ hasText: 'Home' }).describe('Home Button');
    }

    // ===========================
    // Actions
    // ===========================

    async navigate() {
        await this.navigateTo(Routes.CONTACT_US);
    }

    async verifyPageOpened() {
        await expect(this.heading, 'Contact Us page should be opened').toBeVisible();
    }

    async fillContactForm(name: string, email: string, subject: string, message: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
        await this.messageInput.fill(message);
    }

    async uploadFile(filePath: string) {
        await this.uploadFileInput.setInputFiles(filePath);
    }

    async submitForm() {
        // Handle potential confirmation dialog
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
        await this.submitButton.click();
    }

    async verifySuccessMessage(text: string) {
        await expect(this.successMessage, 'Success message should be visible').toBeVisible();
        await expect(this.successMessage, 'Success message should have expected text').toHaveText(text);
    }

    async clickHome() {
        await this.homeButton.click();
    }

    async verifyStillOnPageAfterValidation(): Promise<void> {
        // Using regex to match base URL + path to avoid issue with trailing slashes
        await expect(this.page, 'Should still be on Contact Us page').toHaveURL(new RegExp(Routes.CONTACT_US));
    }
}
