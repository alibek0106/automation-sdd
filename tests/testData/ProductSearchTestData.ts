/**
 * Test data constants for product search tests
 * Extracted from TC05_SearchProducts.spec.ts
 */
export const PRODUCT_SEARCH_TEST_DATA = {
    /**
     * Products known to exist in the system.
     * 'Jeans' is more stable than 'Dress' which has multiple variants.
     */
    STABLE_PRODUCT_TERM: "Jeans",

    /**
     * Search terms for validation tests
     */
    VALID_SEARCH_TERMS: [
        { term: "Jeans", description: "Standard search" },
        { term: "T-Shirt", description: "Standard search with punctuation" },
        { term: "Winter Top", description: "Specific keyword" },
    ],

    /**
     * Non-existent product for negative testing.
     * This value should never match any real product.
     */
    NON_EXISTENT_PRODUCT: "XYZ123NOTFOUND",
} as const;
