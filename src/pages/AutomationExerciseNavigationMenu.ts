import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AutomationExerciseNavigationMenu extends BasePage {
    // ===========================
    // Locators
    // ===========================
    private readonly homeLink: Locator;
    private readonly productsLink: Locator;
    private readonly cartLink: Locator;
    private readonly signupLoginLink: Locator;
    private readonly deleteAccountLink: Locator;
    private readonly logoutLink: Locator;
    private readonly loggedInAsText: Locator;

    constructor(page: Page) {
        super(page, 'NavigationMenu');

        this.homeLink = this.page.getByRole('link', { name: 'Home' }).describe('Home Link');
        this.productsLink = this.page.getByRole('link', { name: 'Products' }).describe('Products Link');
        this.cartLink = this.page.locator('.shop-menu').getByRole('link', { name: 'Cart' }).describe('Cart Link');
        this.signupLoginLink = this.page.getByRole('link', { name: 'Signup / Login' }).describe('Signup/Login Link');
        this.deleteAccountLink = this.page.getByRole('link', { name: 'Delete Account' }).describe('Delete Account Link');
        this.logoutLink = this.page.getByRole('link', { name: 'Logout' }).describe('Logout Link');

        // Handling "Logged in as" strictly
        this.loggedInAsText = this.page.getByText('Logged in as').describe('Logged In User');
    }

    // ===========================
    // Actions
    // ===========================

    async clickSignupLogin(): Promise<void> {
        await this.signupLoginLink.click();
        await expect(this.page).toHaveURL(/\/login/);
    }

    async clickDeleteAccount(): Promise<void> {
        await this.deleteAccountLink.click();
    }

    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }

    async verifyUserLoggedIn(username: string): Promise<void> {
        await expect(this.loggedInAsText, 'Should be logged in').toBeVisible();
        await expect(this.page.getByText(username), 'Username should be visible').toBeVisible();
    }

    async verifyUserNotLoggedIn(): Promise<void> {
        await expect(this.loggedInAsText, 'Should not be logged in').not.toBeVisible();
    }

    async clickHome(): Promise<void> {
        await this.homeLink.click();
    }

    async clickProducts(): Promise<void> {
        await this.productsLink.click();
    }

    async clickCart(): Promise<void> {
        await this.cartLink.click();
        await expect(this.page).toHaveURL(/\/view_cart/);
    }
}
