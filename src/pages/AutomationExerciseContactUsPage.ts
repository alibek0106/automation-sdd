import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../constants/Routes';

export class AutomationExerciseContactUsPage extends BasePage {
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

        this.heading = this.page.getByRole('heading', { name: 'Get In Touch' }).describe('Contact Us Heading');
        this.nameInput = this.page.getByPlaceholder('Name').describe('Contact Name Input');
        this.emailInput = this.page.getByPlaceholder('Email', { exact: true }).describe('Contact Email Input');
        this.subjectInput = this.page.getByPlaceholder('Subject').describe('Contact Subject Input');
        this.messageInput = this.page.getByPlaceholder('Your Message Here').describe('Contact Message Input');
        this.uploadFileInput = this.page.locator('input[name="upload_file"]').describe('Upload File Input');
        this.submitButton = this.page.getByRole('button', { name: 'Submit' }).describe('Submit Button');
        this.successMessage = this.page.locator('.status.alert-success').describe('Success Message'); // Keep class for status message

        // Refined locator to target the Home button with specific class and text
        this.homeButton = this.page.locator('.btn-success').filter({ hasText: 'Home' }).describe('Home Button');
    }

    // ===========================
    // Actions
    // ===========================

    async navigate(): Promise<void> {
        await this.navigateTo(Routes.CONTACT_US);
    }

    async verifyPageOpened(): Promise<void> {
        await expect(this.heading, 'Contact Us page should be opened').toBeVisible();
    }

    async fillContactForm(name: string, email: string, subject: string, message: string): Promise<void> {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
        await this.messageInput.fill(message);
    }

    async uploadFile(filePath: string): Promise<void> {
        await this.uploadFileInput.setInputFiles(filePath);
    }

    async submitForm(): Promise<void> {
        // Handle potential confirmation dialog
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
        await this.submitButton.click();
    }

    async verifySuccessMessage(text: string): Promise<void> {
        await expect(this.successMessage, 'Success message should be visible').toBeVisible();
        await expect(this.successMessage, 'Success message should have expected text').toHaveText(text);
    }

    async clickHome(): Promise<void> {
        await this.homeButton.click();
    }

    async verifyStillOnPageAfterValidation(): Promise<void> {
        // Using regex to match base URL + path to avoid issue with trailing slashes
        await expect(this.page, 'Should still be on Contact Us page').toHaveURL(new RegExp(Routes.CONTACT_US));
    }
}
