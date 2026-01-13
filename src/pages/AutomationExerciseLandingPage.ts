import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class AutomationExerciseLandingPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly SELECTORS = {
        SLIDER_CAROUSEL: '#slider-carousel'
    };

    // ===========================
    // Locators
    // ===========================
    private readonly slider: Locator;
    private readonly logo: Locator;

    constructor(page: Page) {
        super(page, 'LandingPage');
        this.slider = this.page.locator(this.SELECTORS.SLIDER_CAROUSEL).describe('Home Page Slider');
        this.logo = this.page.getByRole('img', { name: 'Website for automation practice' }).describe('Site Logo');
    }

    // ===========================
    // Actions
    // ===========================

    async navigate() {
        await this.navigateTo(Routes.BASE_URL);
    }

    async verifyPageOpened() {
        await expect(this.page, 'Landing page should be opened').toHaveTitle(Routes.TITLE);
        // Robust check: Ensure key page elements are visible
        await expect(this.logo, 'Site Logo should be visible').toBeVisible();
        await expect(this.slider, 'Home Page Slider should be visible').toBeVisible();
    }
}
