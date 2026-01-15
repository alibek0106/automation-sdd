import { z } from 'zod';

/**
 * Zod Schema for Product
 * Matches src/api/models/SearchProduct.ts
 */
export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.string(),
    brand: z.string(),
    category: z.object({
        usertype: z.object({
            usertype: z.string()
        }).optional(),
        category: z.string()
    }).optional()
});

/**
 * Zod Schema for Search Product API Response
 */
export const SearchProductResponseSchema = z.object({
    responseCode: z.number(),
    products: z.array(ProductSchema)
});

export const ProductListResponseSchema = z.object({
    responseCode: z.number(),
    products: z.array(ProductSchema) // Lists usually return same structure
});

export const BrandSchema = z.object({
    id: z.number(),
    brand: z.string()
});

export const BrandListResponseSchema = z.object({
    responseCode: z.number(),
    brands: z.array(BrandSchema)
});
