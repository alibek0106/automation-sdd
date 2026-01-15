import { AutomationExerciseProductsPage } from '../pages/AutomationExerciseProductsPage';
import { expect } from '@playwright/test';
import { step } from '../utils/Decorators';
import { ERROR_MESSAGES } from '../utils/Constants';
import { Product } from '../api/models/SearchProduct';

export class AutomationExerciseProductsSteps {
    constructor(private productsPage: AutomationExerciseProductsPage) { }

    @step('Verify Products page is visible')
    async verifyProductsPageVisible(): Promise<void> {
        await this.productsPage.verifyPageOpened();
    }

    @step('View details of the first product')
    async viewFirstProductDetails(): Promise<void> {
        await this.productsPage.viewProductDetails(0);
    }

    @step('View details of product: {0}')
    async viewProductDetails(productName: string): Promise<void> {
        await this.productsPage.viewProductDetailsByName(productName);
    }

    @step('Navigate to Products page')
    async navigateToProductsPage(): Promise<void> {
        await this.productsPage.navigate();
    }

    @step('Add product "{0}" to cart')
    async addProductToCart(product: string | number): Promise<void> {
        if (typeof product === 'number') {
            await this.productsPage.addProductToCart(product);
        } else {
            await this.productsPage.addProductToCartByName(product);
        }
    }

    @step('Click "Continue Shopping"')
    async clickContinueShopping(): Promise<void> {
        await this.productsPage.clickContinueShopping();
    }

    @step('Verify success message is visible')
    async verifySuccessMessage(): Promise<void> {
        await this.productsPage.verifySuccessMessage();
    }

    @step('Search for product: {0}')
    async searchForProduct(term: string): Promise<void> {
        await this.productsPage.searchProduct(term);
    }

    @step('Verify "SEARCHED PRODUCTS" header is visible')
    async verifySearchedProductsHeader(): Promise<void> {
        await this.productsPage.verifySearchedProductsHeader();
    }

    /**
     * Verifies that all displayed search results contain the search term.
     * Normalizes both the product names and search term by removing special characters and converting to lowercase.
     * 
     * @param term - The search term to verify against result names
     */
    @step('Verify all search results contain: {0}')
    async verifySearchResultsContain(term: string): Promise<void> {
        const names = await this.productsPage.getProductNames();

        expect(names.length, `${ERROR_MESSAGES.NO_PRODUCTS_FOUND}: ${term}`).toBeGreaterThan(0);

        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedTerm = normalize(term);

        for (const name of names) {
            const normalizedName = normalize(name);
            expect(normalizedName, `${ERROR_MESSAGES.PRODUCT_VERIFICATION_FAILED}: Product "${name}" should contain term "${term}"`).toContain(normalizedTerm);
        }
    }

    @step('Verify no products are displayed')
    async verifyNoProductsDisplayed(): Promise<void> {
        const names = await this.productsPage.getProductNames();
        expect(names.length, `${ERROR_MESSAGES.UNEXPECTED_PRODUCTS_FOUND}: ${names.join(', ')}`).toBe(0);
    }

    @step('Filter by Category: {0} > {1}')
    async filterByCategory(mainCategory: string, subCategory: string): Promise<void> {
        await this.productsPage.clickCategory(mainCategory);
        await this.productsPage.clickSubCategory(mainCategory, subCategory);
    }

    @step('Filter by Brand: {0}')
    async filterByBrand(brandName: string): Promise<void> {
        await this.productsPage.clickBrand(brandName);
    }

    @step('Verify page header is "{0}"')
    async verifyPageHeader(expectedTitle: string): Promise<void> {
        await this.productsPage.verifyPageHeader(expectedTitle);
    }

    @step('Verify displayed product count is greater than {0}')
    async verifyProductCountGreaterThan(minCount: number): Promise<void> {
        const count = await this.productsPage.getProductCount();
        expect(count, `${ERROR_MESSAGES.PRODUCT_COUNT_MISMATCH} Expected > ${minCount} products, but found ${count}`).toBeGreaterThan(minCount);
    }

    // ==================== Hybrid API Validation Methods ====================

    @step('Verify UI product count matches API count')
    async verifyProductCountMatchesApi(apiProducts: Product[]): Promise<void> {
        const apiCount = apiProducts.length;
        await expect(this.productsPage.getProductCards(), `UI should display ${apiCount} products`).toHaveCount(apiCount);
    }

    @step('Verify UI product names match API response')
    async verifyProductNamesMatchApi(apiProducts: Product[]): Promise<void> {
        // Ensure products are loaded first
        await this.verifyProductCountMatchesApi(apiProducts);

        const uiProducts = await this.productsPage.getProductDetails();

        // Sort both arrays by name for consistent comparison
        const sortedApiProducts = [...apiProducts].sort((a, b) => a.name.localeCompare(b.name));
        const sortedUiProducts = [...uiProducts].sort((a, b) => a.name.localeCompare(b.name));

        for (let i = 0; i < sortedApiProducts.length; i++) {
            const apiName = sortedApiProducts[i].name.trim();
            const uiName = sortedUiProducts[i]?.name.trim();

            expect.soft(uiName, `Product name at index ${i} should match API`).toBe(apiName);
        }
    }

    @step('Verify UI product prices match API response')
    async verifyProductPricesMatchApi(apiProducts: Product[]): Promise<void> {
        // Ensure products are loaded first
        await this.verifyProductCountMatchesApi(apiProducts);

        const uiProducts = await this.productsPage.getProductDetails();

        // Sort both arrays by name to ensure matching order
        const sortedApiProducts = [...apiProducts].sort((a, b) => a.name.localeCompare(b.name));
        const sortedUiProducts = [...uiProducts].sort((a, b) => a.name.localeCompare(b.name));

        for (let i = 0; i < sortedApiProducts.length; i++) {
            const apiPrice = sortedApiProducts[i].price.trim();
            const uiPrice = sortedUiProducts[i]?.price.trim();

            // Normalize prices for comparison (remove extra spaces, currencies, etc.)
            const normalizePrice = (price: string) => price.replace(/\s+/g, ' ').trim();

            expect.soft(normalizePrice(uiPrice), `Product price for "${sortedApiProducts[i].name}" should match API`).toBe(normalizePrice(apiPrice));
        }
    }

    @step('Verify product card structure at index {0}')
    async verifyProductCardStructureAt(index: number): Promise<void> {
        await this.productsPage.verifyProductCardStructure(index);
    }

    @step('Verify all product cards have required structure')
    async verifyAllProductCardsStructure(): Promise<void> {
        const count = await this.productsPage.getProductCount();

        for (let i = 0; i < count; i++) {
            await this.productsPage.verifyProductCardStructure(i);
        }

    }

    @step('Verify empty search results are displayed')
    async verifyEmptySearchResults(): Promise<void> {
        await this.productsPage.verifyEmptyState();
    }
}
