import { Page } from '@playwright/test';
import { TIMEOUTS } from '../utils/Constants';

export class BasePage {
    readonly page: Page;
    readonly name: string;

    constructor(page: Page, name: string) {
        this.page = page;
        this.name = name;
    }

    /**
     * Navigates to a specific URL and waits for load state
     */
    async navigateTo(url: string) {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Reloads the page with optional wait logic
     */
    async reload() {
        await this.page.reload();
        await this.page.waitForLoadState('load');
    }

    /**
     * Waits for the URL to contain a specific string or match a regex
     */
    async waitForUrl(url: string | RegExp) {
        await this.page.waitForURL(url, { timeout: TIMEOUTS.DEFAULT });
    }

}
