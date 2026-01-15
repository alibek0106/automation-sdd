import { ApiClient } from '../ApiClient';
import { expect } from '../../fixtures';
import { API_ENDPOINTS, API_STATUS_CODES, API_MESSAGES, API_RESPONSE_KEYS } from '../../utils/Constants';
import { step } from '../../utils/Decorators';
import { Product } from '../models/SearchProduct';
import {
    ProductListResponseSchema,
    SearchProductResponseSchema,
    BrandListResponseSchema
} from '../schemas/ProductSchemas';

export class ProductsApiSteps {
    private storedApiProducts: Product[] = [];

    constructor(private apiClient: ApiClient) { }

    @step('Verify all products list API response')
    async verifyAllProductsList() {
        const response = await this.apiClient.get(API_ENDPOINTS.PRODUCTS_LIST);

        // Verify status code
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Verify response body with Zod Schema
        const responseBody = await response.json();
        const parsedResponse = ProductListResponseSchema.parse(responseBody);

        // Additional logical assertions
        expect(parsedResponse.products.length).toBeGreaterThan(0);
    }

    @step('Verify POST to products list is not supported')
    async verifyPostToProductsListNotSupported() {
        const response = await this.apiClient.post(API_ENDPOINTS.PRODUCTS_LIST, {});

        // API returns 200 OK even for "Method Not Allowed" logical error
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Verify response body message
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.RESPONSE_CODE, API_STATUS_CODES.METHOD_NOT_ALLOWED);
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.MESSAGE, API_MESSAGES.METHOD_NOT_SUPPORTED);
    }

    @step('Search for product "{0}" via API')
    async searchProductViaApi(searchTerm: string): Promise<Product[]> {
        const response = await this.apiClient.post(API_ENDPOINTS.SEARCH_PRODUCT, {
            search_product: searchTerm
        });

        // Verify status code
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Parse and Validate with Zod
        const responseBody = await response.json();
        const parsedResponse = SearchProductResponseSchema.parse(responseBody);

        // Verify response structure logic
        expect(parsedResponse.responseCode).toBe(API_STATUS_CODES.OK);

        // Store and return products
        this.storedApiProducts = parsedResponse.products;
        return this.storedApiProducts;
    }

    @step('Get stored API search results')
    getStoredApiProducts(): Product[] {
        return this.storedApiProducts;
    }

    @step('Verify API search for "{0}" returns empty or not found')
    async verifyApiSearchReturnsEmptyOrNotFound(searchTerm: string) {
        const response = await this.apiClient.post(API_ENDPOINTS.SEARCH_PRODUCT, {
            search_product: searchTerm
        });

        // Verify status code
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Parse and Validate with Zod
        const responseBody = await response.json();
        const parsedResponse = SearchProductResponseSchema.parse(responseBody);

        // Verify response logic
        expect(parsedResponse.responseCode).toBe(API_STATUS_CODES.OK);
        expect(parsedResponse.products.length, `Expected no products for search term "${searchTerm}"`).toBe(0);
    }

    @step('Get all brands via API')
    async getAllBrands(): Promise<{ id: number; brand: string }[]> {
        const response = await this.apiClient.get(API_ENDPOINTS.BRANDS_LIST);
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        const responseBody = await response.json();

        // Validate with Zod
        const parsedResponse = BrandListResponseSchema.parse(responseBody);

        return parsedResponse.brands;
    }

    @step('Get all products via API')
    async getAllProducts(): Promise<Product[]> {
        const response = await this.apiClient.get(API_ENDPOINTS.PRODUCTS_LIST);
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        const responseBody = await response.json();
        const parsedResponse = ProductListResponseSchema.parse(responseBody);

        return parsedResponse.products;
    }

    @step('Get products by Brand "{0}" via API')
    async getProductsByBrand(brandName: string): Promise<Product[]> {
        const allProducts = await this.getAllProducts();

        // Filter logic: Check if product.brand matches brandName (case-insensitive)
        const filtered = allProducts.filter(p =>
            p.brand && p.brand.toLowerCase() === brandName.toLowerCase()
        );

        return filtered;
    }

    @step('Get products by Category "{0}" > "{1}" via API')
    async getProductsByCategory(mainCategory: string, subCategory: string): Promise<Product[]> {
        const allProducts = await this.getAllProducts();

        // Filter logic: 
        // mainCategory matches product.category.usertype.usertype
        // subCategory matches product.category.category
        const filtered = allProducts.filter(p => {
            // Safe navigation in case category structure is missing
            const pMainCat = p.category?.usertype?.usertype;
            const pSubCat = p.category?.category;

            return pMainCat && pMainCat.toLowerCase() === mainCategory.toLowerCase() &&
                pSubCat && pSubCat.toLowerCase() === subCategory.toLowerCase();
        });

        return filtered;
    }
}
