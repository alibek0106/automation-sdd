/* eslint-disable playwright/expect-expect */
import { test } from '@fixtures/index';
import { PRODUCT_SEARCH_TEST_DATA } from '../testData/ProductSearchTestData';

/**
 * TC05: Product Search Functionality
 * 
 * Validates product search including valid searches, case-insensitive matching,
 * navigation to product details, and empty search results handling.
 */

test.describe('Product Search Functionality', () => {

    test.beforeEach(async ({ automationExerciseLandingSteps, automationExerciseNavigationSteps }) => {
        await automationExerciseLandingSteps.navigateToHomepage();
        await automationExerciseLandingSteps.verifyPageOpened();
        await automationExerciseNavigationSteps.clickProducts();
    });

    for (const { term, description } of PRODUCT_SEARCH_TEST_DATA.VALID_SEARCH_TERMS) {
        test(`Search for valid products: ${term} (${description})`, async ({ automationExerciseProductsSteps }) => {
            await automationExerciseProductsSteps.verifyProductsPageVisible();
            await automationExerciseProductsSteps.searchForProduct(term);
            await automationExerciseProductsSteps.verifySearchedProductsHeader();
            await automationExerciseProductsSteps.verifySearchResultsContain(term);
        });
    }

    test('Navigate to product details from search results', async ({ automationExerciseProductsSteps, automationExerciseProductDetailSteps }) => {
        const term = PRODUCT_SEARCH_TEST_DATA.STABLE_PRODUCT_TERM;

        await automationExerciseProductsSteps.verifyProductsPageVisible();
        await automationExerciseProductsSteps.searchForProduct(term);
        await automationExerciseProductsSteps.verifySearchedProductsHeader();

        await automationExerciseProductsSteps.verifySearchResultsContain(term);
        await automationExerciseProductsSteps.viewFirstProductDetails();
        await automationExerciseProductDetailSteps.verifyProductDetailVisible();
    });

    test('Search for non-existent product', async ({ automationExerciseProductsSteps }) => {
        const term = PRODUCT_SEARCH_TEST_DATA.NON_EXISTENT_PRODUCT;

        await automationExerciseProductsSteps.verifyProductsPageVisible();
        await automationExerciseProductsSteps.searchForProduct(term);
        await automationExerciseProductsSteps.verifySearchedProductsHeader();
        await automationExerciseProductsSteps.verifyNoProductsDisplayed();
    });
});
