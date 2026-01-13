import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AutomationExerciseLoginPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly SELECTORS = {
        INPUT_LOGIN_EMAIL: '[data-qa="login-email"]',
        INPUT_LOGIN_PASSWORD: '[data-qa="login-password"]',
        BTN_LOGIN: '[data-qa="login-button"]',
        INPUT_SIGNUP_NAME: '[data-qa="signup-name"]',
        INPUT_SIGNUP_EMAIL: '[data-qa="signup-email"]',
        BTN_SIGNUP: '[data-qa="signup-button"]'
    };

    // ===========================
    // Locators
    // ===========================

    // Login Form Locators
    private readonly loginEmailInput: Locator;
    private readonly loginPasswordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginHeader: Locator;

    // Signup Form Locators
    private readonly signupNameInput: Locator;
    private readonly signupEmailInput: Locator;
    private readonly signupButton: Locator;
    private readonly newUserSignupHeader: Locator;

    constructor(page: Page) {
        super(page, 'LoginPage');

        // Login
        this.loginEmailInput = this.page.locator(this.SELECTORS.INPUT_LOGIN_EMAIL).describe('Login Email Input');
        this.loginPasswordInput = this.page.locator(this.SELECTORS.INPUT_LOGIN_PASSWORD).describe('Login Password Input');
        this.loginButton = this.page.locator(this.SELECTORS.BTN_LOGIN).describe('Login Button');
        this.loginHeader = page.getByRole('heading', { name: MESSSAGES.LOGIN_HEADER });

        // Signup
        this.signupNameInput = this.page.locator(this.SELECTORS.INPUT_SIGNUP_NAME).describe('Signup Name Input');
        this.signupEmailInput = this.page.locator(this.SELECTORS.INPUT_SIGNUP_EMAIL).describe('Signup Email Input');
        this.signupButton = this.page.locator(this.SELECTORS.BTN_SIGNUP).describe('Signup Button');
        this.newUserSignupHeader = page.getByRole('heading', { name: MESSSAGES.NEW_USER_SIGNUP });
    }

    // ===========================
    // Actions
    // ===========================

    async navigate() {
        await this.navigateTo(Routes.LOGIN);
    }

    async verifyNewUserSignupVisible() {
        await expect(this.newUserSignupHeader, 'New User Signup Header should be visible').toBeVisible();
    }

    async verifyLoginHeaderVisible() {
        await expect(this.loginHeader, 'Login Header should be visible').toBeVisible();
    }

    async enterSignupName(name: string) {
        await this.signupNameInput.fill(name);
    }

    async enterSignupEmail(email: string) {
        await this.signupEmailInput.fill(email);
    }

    async clickSignup() {
        await this.signupButton.click();
    }

    async enterLoginEmail(email: string) {
        await this.loginEmailInput.fill(email);
    }

    async enterLoginPassword(password: string) {
        await this.loginPasswordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }
}
