import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AutomationExerciseNavigationMenu extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly SELECTORS = {
        LINK_HOME: 'a[href="/"]',
        LINK_PRODUCTS: 'a[href="/products"]',
        LINK_CART: 'a[href="/view_cart"]',
        LINK_LOGIN: 'a[href="/login"]',
        LINK_DELETE_ACCOUNT: 'a[href="/delete_account"]',
        LINK_LOGOUT: 'a[href="/logout"]',
        // Playwright text engine is robust for partial text matching
        TEXT_LOGGED_IN_AS: 'text=Logged in as'
    };

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

        // Refined Home link to ensure we don't pick up Logo if it shares same Href.
        this.homeLink = this.page.locator(this.SELECTORS.LINK_HOME).filter({ hasText: 'Home' }).first().describe('Home Link');

        this.productsLink = this.page.locator(this.SELECTORS.LINK_PRODUCTS).describe('Products Link');
        this.cartLink = this.page.locator(this.SELECTORS.LINK_CART).first().describe('Cart Link');
        this.signupLoginLink = this.page.locator(this.SELECTORS.LINK_LOGIN).describe('Signup/Login Link');
        this.deleteAccountLink = this.page.locator(this.SELECTORS.LINK_DELETE_ACCOUNT).describe('Delete Account Link');
        this.logoutLink = this.page.locator(this.SELECTORS.LINK_LOGOUT).describe('Logout Link');
        this.loggedInAsText = this.page.locator(this.SELECTORS.TEXT_LOGGED_IN_AS).describe('Logged In User');
    }

    // ===========================
    // Actions
    // ===========================

    async clickSignupLogin() {
        await this.signupLoginLink.click();
    }

    async clickDeleteAccount() {
        await this.deleteAccountLink.click();
    }

    async clickLogout() {
        await this.logoutLink.click();
    }

    async verifyUserLoggedIn(username: string) {
        await expect(this.loggedInAsText, 'Should be logged in').toBeVisible();
        await expect(this.page.getByText(username), 'Username should be visible').toBeVisible();
    }

    async verifyUserNotLoggedIn() {
        await expect(this.loggedInAsText, 'Should not be logged in').not.toBeVisible();
    }

    async clickHome() {
        await this.homeLink.click();
    }

    async clickProducts() {
        await this.productsLink.click();
    }

    async clickCart() {
        await this.cartLink.click();
    }
}
