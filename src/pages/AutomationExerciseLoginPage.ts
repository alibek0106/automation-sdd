import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { MESSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AutomationExerciseLoginPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    // ===========================
    // Constants & Selectors
    // ===========================
    // Kept for reference or backward compatibility if needed, but currently replaced by role locators locally
    // private readonly SELECTORS = {};

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
        const loginForm = this.page.locator('.login-form');
        this.loginEmailInput = loginForm.getByPlaceholder('Email Address').describe('Login Email Input');
        this.loginPasswordInput = loginForm.getByPlaceholder('Password').describe('Login Password Input');
        this.loginButton = loginForm.getByRole('button', { name: 'Login' }).describe('Login Button');
        this.loginHeader = page.getByRole('heading', { name: MESSAGES.LOGIN_HEADER });

        // Signup
        const signupForm = this.page.locator('.signup-form');
        this.signupNameInput = signupForm.getByPlaceholder('Name').describe('Signup Name Input');
        this.signupEmailInput = signupForm.getByPlaceholder('Email Address').describe('Signup Email Input');
        this.signupButton = signupForm.getByRole('button', { name: 'Signup' }).describe('Signup Button');
        this.newUserSignupHeader = page.getByRole('heading', { name: MESSAGES.NEW_USER_SIGNUP });
    }

    // ===========================
    // Actions
    // ===========================

    async navigate(): Promise<void> {
        await this.navigateTo(Routes.LOGIN);
    }

    async verifyNewUserSignupVisible(): Promise<void> {
        await expect(this.newUserSignupHeader, 'New User Signup Header should be visible').toBeVisible();
    }

    async verifyLoginHeaderVisible(): Promise<void> {
        await expect(this.loginHeader, 'Login Header should be visible').toBeVisible();
    }

    async enterSignupName(name: string): Promise<void> {
        await this.signupNameInput.fill(name);
    }

    async enterSignupEmail(email: string): Promise<void> {
        await this.signupEmailInput.fill(email);
    }

    async clickSignup(): Promise<void> {
        await this.signupButton.click();
    }

    async enterLoginEmail(email: string): Promise<void> {
        await this.loginEmailInput.fill(email);
    }

    async enterLoginPassword(password: string): Promise<void> {
        await this.loginPasswordInput.fill(password);
    }

    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }
}
