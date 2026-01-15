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

        // Search
        HEADER_SEARCHED: 'h2.title',

        // Header and Messages
        PAGE_HEADER_XPATH: '//h2[contains(@class, "title")]',

        // Modals / Overlays
        MODAL_CART: '#cartModal',
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

        this.searchInput = this.page.getByPlaceholder('Search Product').describe('Search Input');
        this.submitSearchButton = this.page.locator('#submit_search').describe('Search Button');
        this.searchedProductsHeader = this.page.locator(this.SELECTORS.HEADER_SEARCHED)
            .filter({ hasText: MESSAGES.SEARCHED_PRODUCTS })
            .describe('Searched Products Header');

        this.categoryPanel = this.page.locator(this.SELECTORS.CATEGORY_PANEL).describe('Category Sidebar');
        this.brandsPanel = this.page.locator(this.SELECTORS.BRANDS_PANEL).describe('Brands Sidebar');

        this.cartModal = this.page.locator(this.SELECTORS.MODAL_CART).describe('Cart Modal');
        this.continueShoppingButton = this.page.getByRole('button', { name: 'Continue Shopping' }).describe('Continue Shopping Button');
        this.pageHeader = this.page.locator(this.SELECTORS.PAGE_HEADER_XPATH).describe('Page Header');

        // Derived for convenience
        this.productNames = this.page.locator(this.SELECTORS.PRODUCT_NAME).describe('Product Names List');
        this.productPrices = this.page.locator(this.SELECTORS.PRODUCT_PRICE).describe('Product Prices List');
    }

    // ===========================
    // Actions
    // ===========================

    async navigate(): Promise<void> {
        await this.navigateTo(Routes.PRODUCTS);
    }

    async verifyPageOpened(): Promise<void> {
        await expect(this.page, 'Products Page should be opened').toHaveTitle(PAGE_TITLES.ALL_PRODUCTS);
        await expect(this.productsList, 'Products List should be visible').toBeVisible();
    }

    async searchProduct(term: string): Promise<void> {
        await this.searchInput.fill(term);
        await this.clickWithNavigationRetry(this.submitSearchButton, /\/products\?search=/, 3);
    }

    async verifySearchedProductsHeader(): Promise<void> {
        await expect(this.searchedProductsHeader, 'Searched Products Header should be visible').toBeVisible({ timeout: TIMEOUTS.VISIBILITY });
    }

    async clickBrand(brandName: string): Promise<void> {
        const brandLink = this.getBrandLink(brandName);
        const safeBrandName = this.getSafeUrlFragment(brandName);
        const expectedUrlPattern = new RegExp(`/brand_products/${safeBrandName}`);

        await this.clickWithNavigationRetry(brandLink, expectedUrlPattern);
    }

    async clickCategory(category: string): Promise<void> {
        // Toggle the category and ensure it expands.
        // We look for the panel with ID matching the category (e.g., #Women).
        const categoryLink = this.categoryPanel.locator(`//a[@href="#${category}"]`);
        const categoryBody = this.categoryPanel.locator(`#${category}`);

        // Scroll to the category link to ensure it's in view (helper for sticky headers/ads)
        await categoryLink.scrollIntoViewIfNeeded();

        // Use Playwright's built-in retry mechanism via toPass()
        // This is necessary because the category click is often intercepted by ads or fails to trigger the animation immediately.
        // A simple click-and-wait is insufficient for this specific application.
        await expect(async () => {
            // If already visible, we don't need to do anything (idempotent)
            if (await categoryBody.isVisible()) {
                return;
            }

            // Click to expand
            await categoryLink.click();

            // Verify visibility
            await expect(categoryBody, `Category body for ${category} should be visible`).toBeVisible({ timeout: 2000 });
        }).toPass({
            timeout: TIMEOUTS.DEFAULT, // Use default timeout for the whole retry block
            intervals: [500, 1000, 2000] // Retry with increasing backoff
        });
    }

    async clickSubCategory(mainCategory: string, subCategory: string): Promise<void> {
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

    async viewProductDetails(index: number): Promise<void> {
        // "View Product" buttons are a list.
        // It's safer to find the card at index, then the button inside it.
        await this.getProductCard(index).getByRole('link', { name: 'View Product' }).click();
    }

    async viewProductDetailsByName(productName: string): Promise<void> {
        const productCard = this.getProductCardByName(productName);
        await productCard.getByRole('link', { name: 'View Product' }).click();
    }

    async addProductToCart(index: number): Promise<void> {
        // Reverting to getByText as it was more reliable for the overlay animation timing in this specific app
        const addToCartBtn = this.getProductCard(index).getByText('Add to cart').first();
        await addToCartBtn.waitFor({ state: 'visible' });
        await addToCartBtn.click();
    }

    async addProductToCartByName(productName: string): Promise<void> {
        const product = this.getProductCardByName(productName);
        await product.hover();
        const addToCartBtn = product.getByText('Add to cart').first();
        await addToCartBtn.waitFor({ state: 'visible' });
        await addToCartBtn.click();
    }

    async clickContinueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
        await expect(this.cartModal, 'Cart Modal should be hidden after continuing').toBeHidden();
    }

    // ===========================
    // Verifications / Getters
    // ===========================

    async verifySuccessMessage(): Promise<void> {
        // Ensure we are at the top of the page where the modal usually appears
        // The user reported the modal is not visible because the top of the page is out of viewport
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await expect(this.cartModal, 'Cart Modal should be visible').toBeVisible({ timeout: TIMEOUTS.DEFAULT });
    }

    async verifyPageHeader(expectedTitle: string): Promise<void> {
        await expect(this.pageHeader, 'Page Header should have expected title').toHaveText(expectedTitle, { ignoreCase: true });
    }

    async verifyProductsContainName(): Promise<void> {
        const count = await this.productCards.count();
        expect(count).toBeGreaterThan(0);
    }

    async verifyEmptyState(): Promise<void> {
        const count = await this.productCards.count();
        expect(count, 'No product cards should be visible for empty search results').toBe(0);
    }

    async verifyProductCardStructure(index: number): Promise<void> {
        const card = this.getProductCard(index);

        // Scroll into view to trigger lazy loading if any
        await card.scrollIntoViewIfNeeded();

        await expect(card.locator(this.SELECTORS.PRODUCT_IMAGE), 'Product Image should be visible').toBeVisible();
        await expect(card.getByRole('link', { name: 'View Product' }), 'View Product Link should be visible').toBeVisible();
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
        return this.productCards.filter({ hasText: productName }).first().describe(`Product Card: ${productName}`);
    }

    private getBrandLink(brandName: string): Locator {
        return this.brandsPanel.locator(`li a:has-text("${brandName}")`).describe(`Brand Link: ${brandName}`);
    }

    private getSubCategoryLink(mainCategory: string, subCategory: string): Locator {
        return this.categoryPanel.locator(`#${mainCategory} .panel-body ul li a:has-text("${subCategory}")`).describe(`SubCategory Link: ${mainCategory} > ${subCategory}`);
    }

    /**
     * Escapes special characters and encodes spaces for URL matching.
     * Replaces explicit space encoding logic.
     * 
     * @param text - The text to escape (e.g. brand name)
     * @returns The URL-safe fragment
     */
    private getSafeUrlFragment(text: string): string {
        return text.replace(/ /g, '%20').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Robust click with navigation retry.
     * Handles cases where ads intercept clicks or navigation doesn't trigger immediately.
     * Uses Playwright's automatic retry mechanism via `toPass`.
     * 
     * @param element - The locator to click
     * @param expectedUrlPattern - The regex pattern to match the URL after navigation
     * @param retries - Number of retry attempts (default: 3)
     */
    private async clickWithNavigationRetry(element: Locator, expectedUrlPattern: RegExp, retries = 3): Promise<void> {
        await expect(async () => {
            await element.click({ force: true });
            await expect(this.page).toHaveURL(expectedUrlPattern);
        }).toPass({
            timeout: TIMEOUTS.NAVIGATION * retries,
            intervals: [1000, 2000]
        });
    }
}
