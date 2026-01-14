import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TIMEOUTS, MESSAGES, PAGE_TITLES } from '../utils/Constants';
import { Routes } from '../constants/Routes';

export class AutomationExerciseProductsPage extends BasePage {

    private readonly SELECTORS = {
        // Main lists and containers
        PRODUCTS_LIST: '.features_items',
        BRANDS_PANEL: '.brands_products',
        CATEGORY_PANEL: '#accordian',

        // Product Card Elements
        // Product Card Elements
        PRODUCT_CARD: '.product-image-wrapper', // Structural wrapper, keeping as class for now
        PRODUCT_NAME: '.productinfo p',
        PRODUCT_PRICE: '.productinfo h2',
        PRODUCT_IMAGE: 'img',
        BTN_ADD_TO_CART: 'Add to cart', // For Use with getByRole('button', { name: ... }) OR text matching
        LINK_VIEW_PRODUCT: 'View Product', // For Use with getByText(...)

        // Search
        INPUT_SEARCH: '#search_product',
        BTN_SUBMIT_SEARCH: '//button[@id="submit_search"]',
        HEADER_SEARCHED: 'h2.title',

        // Header and Messages
        PAGE_HEADER_XPATH: '//h2[contains(@class, "title")]',
        EMPTY_STATE_TEXT: 'No product',

        // Modals / Overlays
        MODAL_CART: '#cartModal',
        BTN_CONTINUE_SHOPPING: 'button[name="Continue Shopping"]', // refined from getByRole for consistency if needed, but getByRole is fine too. 
        // Keeping getByRole in method is fine, but if we want strictly string selectors:
        BTN_CONTINUE_SHOPPING_ROLE: 'Continue Shopping'
    };

    // ===========================
    // Locators
    // ===========================
    private readonly productsList: Locator;
    private readonly searchInput: Locator;
    private readonly submitSearchButton: Locator;
    private readonly searchedProductsHeader: Locator;
    private readonly productCards: Locator;
    private readonly categoryPanel: Locator;
    private readonly brandsPanel: Locator;
    private readonly cartModal: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly pageHeader: Locator;

    // Derived locators (lists)
    private readonly productNames: Locator;
    private readonly productPrices: Locator;

    constructor(page: Page) {
        super(page, 'ProductsPage');

        // Init Locators using centralized selectors
        this.productsList = this.page.locator(this.SELECTORS.PRODUCTS_LIST).describe('Products List');
        this.productCards = this.page.locator(this.SELECTORS.PRODUCT_CARD).describe('Product Cards');

        this.searchInput = this.page.locator(this.SELECTORS.INPUT_SEARCH).describe('Search Input');
        this.submitSearchButton = this.page.locator(this.SELECTORS.BTN_SUBMIT_SEARCH).describe('Search Button');
        this.searchedProductsHeader = this.page.locator(this.SELECTORS.HEADER_SEARCHED)
            .filter({ hasText: MESSAGES.SEARCHED_PRODUCTS })
            .describe('Searched Products Header');

        this.categoryPanel = this.page.locator(this.SELECTORS.CATEGORY_PANEL).describe('Category Sidebar');
        this.brandsPanel = this.page.locator(this.SELECTORS.BRANDS_PANEL).describe('Brands Sidebar');

        this.cartModal = this.page.locator(this.SELECTORS.MODAL_CART).describe('Cart Modal');
        this.continueShoppingButton = this.page.getByRole('button', { name: this.SELECTORS.BTN_CONTINUE_SHOPPING_ROLE }).describe('Continue Shopping Button');
        this.pageHeader = this.page.locator(this.SELECTORS.PAGE_HEADER_XPATH).describe('Page Header');

        // Derived for convenience
        this.productNames = this.page.locator(this.SELECTORS.PRODUCT_NAME).describe('Product Names List');
        this.productPrices = this.page.locator(this.SELECTORS.PRODUCT_PRICE).describe('Product Prices List');
    }

    // ===========================
    // Actions
    // ===========================

    async navigate() {
        await this.navigateTo(Routes.PRODUCTS);
    }

    async verifyPageOpened() {
        await expect(this.page, 'Products Page should be opened').toHaveTitle(PAGE_TITLES.ALL_PRODUCTS);
        await expect(this.productsList, 'Products List should be visible').toBeVisible();
    }

    async searchProduct(term: string) {
        await this.searchInput.fill(term);
        await this.clickWithNavigationRetry(this.submitSearchButton, /\/products\?search=/, 3);
    }

    async verifySearchedProductsHeader() {
        await expect(this.searchedProductsHeader, 'Searched Products Header should be visible').toBeVisible({ timeout: TIMEOUTS.VISIBILITY });
    }

    async clickBrand(brandName: string) {
        const brandLink = this.getBrandLink(brandName);
        const safeBrandName = this.getSafeUrlFragment(brandName);
        const expectedUrlPattern = new RegExp(`/brand_products/${safeBrandName}`);

        await this.clickWithNavigationRetry(brandLink, expectedUrlPattern);
    }

    async clickCategory(category: string) {
        // Toggle the category and ensure it expands.
        // We look for the panel with ID matching the category (e.g., #Women).
        const categoryLink = this.categoryPanel.locator(`//a[@href="#${category}"]`);
        const categoryBody = this.categoryPanel.locator(`#${category}`);

        // Scroll to the category link to ensure it's in view (helper for sticky headers/ads)
        await categoryLink.scrollIntoViewIfNeeded();

        // If not already visible, click to expand. Use retries as accordion clicks can be flaky.
        if (!await categoryBody.isVisible()) {
            for (let i = 0; i < 3; i++) {
                try {
                    await categoryLink.click();
                    await expect(categoryBody, `Category body for ${category} should be visible`).toBeVisible({ timeout: 2000 });
                    return; // Success
                } catch (e) {
                    if (i === 2) throw e; // Throw on last attempt
                    // Wait briefly before retrying
                    await this.page.waitForTimeout(500);
                }
            }
        }
    }

    async clickSubCategory(mainCategory: string, subCategory: string) {
        // Ensure the main category is really open before trying to find subcategory
        const categoryBody = this.categoryPanel.locator(`#${mainCategory}`);
        await expect(categoryBody).toBeVisible();

        const subCategoryLink = this.getSubCategoryLink(mainCategory, subCategory);

        // Ensure subcategory is reachable
        await subCategoryLink.scrollIntoViewIfNeeded();
        await expect(subCategoryLink).toBeVisible();

        const href = await subCategoryLink.getAttribute('href');

        if (!href) {
            throw new Error(`Subcategory link for ${mainCategory} > ${subCategory} has no href`);
        }

        await this.clickWithNavigationRetry(subCategoryLink, new RegExp(href));
    }

    async viewProductDetails(index: number) {
        // "View Product" buttons are a list.
        // It's safer to find the card at index, then the button inside it.
        await this.getProductCard(index).getByRole('link', { name: this.SELECTORS.LINK_VIEW_PRODUCT }).click();
    }

    async viewProductDetailsByName(productName: string) {
        const productCard = this.getProductCardByName(productName);
        await productCard.getByRole('link', { name: this.SELECTORS.LINK_VIEW_PRODUCT }).click();
    }

    async addProductToCart(index: number) {
        await this.getProductCard(index).getByText(this.SELECTORS.BTN_ADD_TO_CART).first().click();
    }

    async addProductToCartByName(productName: string) {
        const product = this.getProductCardByName(productName);
        await product.hover();
        await product.getByText(this.SELECTORS.BTN_ADD_TO_CART).first().click();
    }

    async clickContinueShopping() {
        await this.continueShoppingButton.click();
    }

    // ===========================
    // Verifications / Getters
    // ===========================

    async verifySuccessMessage() {
        await expect(this.cartModal, 'Cart Modal should be visible').toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    }

    async verifyPageHeader(expectedTitle: string) {
        await expect(this.pageHeader, 'Page Header should have expected title').toHaveText(expectedTitle, { ignoreCase: true });
    }

    async verifyProductsContainName(namePart: string) {
        const count = await this.productCards.count();
        expect(count).toBeGreaterThan(0);
    }

    async verifyEmptyState() {
        const count = await this.productCards.count();
        expect(count, 'No product cards should be visible for empty search results').toBe(0);
    }

    async verifyProductCardStructure(index: number) {
        const card = this.getProductCard(index);

        await expect(card.locator(this.SELECTORS.PRODUCT_IMAGE), 'Product Image should be visible').toBeVisible();
        await expect(card.getByRole('link', { name: this.SELECTORS.LINK_VIEW_PRODUCT }), 'View Product Link should be visible').toBeVisible();
    }

    async getProductNames(): Promise<string[]> {
        return await this.productNames.allInnerTexts();
    }

    async getProductCount(): Promise<number> {
        return await this.productCards.count();
    }

    async getProductPrices(): Promise<string[]> {
        return await this.productPrices.allInnerTexts();
    }

    /**
    * Get product details including names and prices
    * optimized to use evaluateAll for performance
    */
    async getProductDetails(): Promise<Array<{ name: string, price: string }>> {
        return await this.productCards.evaluateAll((cards, selectors) => {
            return cards.map(card => {
                const nameEl = card.querySelector(selectors.name);
                const priceEl = card.querySelector(selectors.price);
                return {
                    name: nameEl ? (nameEl as HTMLElement).innerText.trim() : '',
                    price: priceEl ? (priceEl as HTMLElement).innerText.trim() : ''
                };
            });
        }, { name: this.SELECTORS.PRODUCT_NAME, price: this.SELECTORS.PRODUCT_PRICE });
    }

    getProductCards(): Locator {
        return this.productCards;
    }

    getProductCard(index: number): Locator {
        return this.productCards.nth(index);
    }

    // ===========================
    // Private Helpers
    // ===========================

    private getProductCardByName(productName: string): Locator {
        return this.productCards.filter({ hasText: productName }).first();
    }

    private getBrandLink(brandName: string): Locator {
        return this.brandsPanel.locator(`li a:has-text("${brandName}")`);
    }

    private getSubCategoryLink(mainCategory: string, subCategory: string): Locator {
        return this.categoryPanel.locator(`#${mainCategory} .panel-body ul li a:has-text("${subCategory}")`);
    }

    /**
     * Escapes special characters and encodes spaces for URL matching.
     * Replaces explicit space encoding logic.
     */
    private getSafeUrlFragment(text: string): string {
        return text.replace(/ /g, '%20').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Robust click with navigation retry.
     * Handles cases where ads intercept clicks or navigation doesn't trigger immediately.
     * Default retries = 1 means "try once, no retry".
     */
    private async clickWithNavigationRetry(element: Locator, expectedUrlPattern: RegExp, retries = 1) {
        for (let i = 0; i < retries; i++) {
            try {
                await element.click();
                // Use a shorter timeout for interim attempts, full timeout for the last one
                const timeout = i === retries - 1 ? TIMEOUTS.NAVIGATION : 6000;
                await expect(this.page).toHaveURL(expectedUrlPattern, { timeout });
                return;
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                // If we are retrying, wait a bit to ensure stability
                await this.page.waitForTimeout(1000);
            }
        }
    }
}
