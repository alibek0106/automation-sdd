# Best Practices Review - Playwright & TypeScript

This document provides recommendations for improving code quality based on Playwright and TypeScript best practices.

---

## Playwright Best Practices

### 1. Migrate to User-Facing Locators

**Current State**: Heavy use of CSS selectors and XPath  
**Recommendation**: Migrate to Playwright's recommended locators

#### Why It Matters

Playwright recommends using locators that users can see and interact with. This makes tests:

- More resilient to UI changes
- Easier to understand
- Better aligned with user behavior
- Less likely to break from implementation changes

#### Current Examples

```typescript
// AutomationExerciseProductsPage.ts

// ❌ Current - CSS Selector
INPUT_SEARCH: '#search_product',

// ❌ Current - XPath
BTN_SUBMIT_SEARCH: '//button[@id="submit_search"]',
PAGE_HEADER_XPATH: '//h2[contains(@class, "title")]',
```

#### Recommended Approach

```typescript
// ✅ Recommended - Role-based locators
private readonly searchInput: Locator;
private readonly submitSearchButton: Locator;
private readonly pageHeader: Locator;

constructor(page: Page) {
    super(page, 'ProductsPage');

    // Use role-based which is accessible to users
    this.searchInput = this.page.getByRole('textbox', { name: /search/i })
        .describe('Search Input');

    this.submitSearchButton = this.page.getByRole('button', { name: /search|submit/i })
        .describe('Search Button');

    this.pageHeader = this.page.getByRole('heading', { level: 2 })
        .describe('Page Header');
}
```

#### Migration Priority

1. **High Priority** (User interaction points):

   - Form inputs
   - Buttons
   - Links

2. **Medium Priority** (Assertions):

   - Headings
   - Images with alt text
   - Labels

3. **Low Priority** (Structural):
   - Containers
   - Wrappers

#### Fallback Strategy

If role-based locators aren't feasible:

1. Try `getByLabel()`
2. Try `getByText()`
3. Try `getByTestId()` (add `data-testid` to HTML)
4. Lastly, use CSS selectors with `.describe()`

---

### 2. Use Web-First Assertions

**Current State**: Mix of custom assertions and Playwright assertions  
**Recommendation**: Standardize on Playwright's web-first assertions

#### Examples

**Current**:

```typescript
// AutomationExerciseProductsSteps.ts
const count = await this.productsPage.getProductCount();
if (count <= minCount) {
  throw new Error(`${ERROR_MESSAGES.PRODUCT_COUNT_MISMATCH} ...`);
}
```

**Recommended**:

```typescript
// Use Playwright's auto-retrying assertions
await expect(
  this.productsPage.getProductCards(),
  `Should have more than ${minCount} products`
).toHaveCount({ min: minCount + 1 });
```

#### Benefits

- ✅ Auto-retrying (waits for condition)
- ✅ Better error messages
- ✅ Screenshot on failure
- ✅ Trace integration

---

### 3. Simplify Navigation Patterns

**Current State**: Complex retry logic for navigation  
**Recommendation**: Use Playwright's built-in navigation handling

#### Current Code

```typescript
private async clickWithNavigationRetry(element: Locator, expectedUrlPattern: RegExp, retries = 1) {
    for (let i = 0; i < retries; i++) {
        try {
            await element.click();
            const timeout = i === retries - 1 ? TIMEOUTS.NAVIGATION : 6000;
            await expect(this.page).toHaveURL(expectedUrlPattern, { timeout });
            return;
        } catch (error) {
            if (i === retries - 1) throw error;
            await this.page.waitForTimeout(1000);
        }
    }
}
```

#### Recommended Approach

**Option 1: Use `toPass()` for retries**

```typescript
private async clickAndWaitForURL(element: Locator, expectedUrlPattern: RegExp): Promise<void> {
    await expect(async () => {
        await element.click();
        await expect(this.page).toHaveURL(expectedUrlPattern);
    }).toPass({ timeout: TIMEOUTS.NAVIGATION, intervals: [1000, 2000] });
}
```

**Option 2: Use `Promise.all()` for simultaneous wait**

```typescript
private async clickAndNavigate(element: Locator, expectedUrlPattern: RegExp): Promise<void> {
    await Promise.all([
        this.page.waitForURL(expectedUrlPattern, { timeout: TIMEOUTS.NAVIGATION }),
        element.click()
    ]);
}
```

---

### 4. Improve Test Isolation

**Current State**: Good use of `beforeEach`, but verify complete isolation  
**Recommendation**: Ensure tests can run in any order

#### Checklist

- ✅ Each test navigates to starting state
- ✅ No shared variables between tests
- ✅ No test depends on another test's outcome
- ❓ Database/API state properly isolated
- ❓ Browser storage cleared between tests

#### Example of Good Isolation

```typescript
test.describe('Product Search', () => {
    test.beforeEach(async ({ automationExerciseLandingSteps, automationExerciseNavigationSteps }) => {
        // Reset to known state
        await automationExerciseLandingSteps.navigateToHomepage();
        await automationExerciseLandingSteps.verifyPageOpened();
        await automationExerciseNavigationSteps.clickProducts();
    });

    test('Search test 1', async ({ ... }) => {
        // Completely independent
    });

    test('Search test 2', async ({ ... }) => {
        // Runs fine even if test 1 fails
    });
});
```

---

### 5. Optimize Performance with Parallel Execution

**Current State**: 4 workers configured ✅  
**Recommendation**: Ensure tests are parallelizable

#### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true, // ✅ Good
  workers: process.env.CI ? 4 : 4, // ✅ Good
});
```

#### Make Tests Parallelizable

**Do**:

- ✅ Use worker-specific storage (already done: `getWorkerStorageState()`)
- ✅ Generate unique test data per test
- ✅ Clean up after each test

**Don't**:

- ❌ Share global state
- ❌ Depend on test execution order
- ❌ Use fixed data that could collide

---

## TypeScript Best Practices

### 1. Add Explicit Return Types

**Current State**: Many methods infer return types  
**Recommendation**: Add explicit return types for better documentation

#### Current

```typescript
async searchProduct(term: string) {
    await this.searchInput.fill(term);
    await this.clickWithNavigationRetry(...);
}

async getProductNames() {
    return await this.productNames.allInnerTexts();
}
```

#### Recommended

```typescript
async searchProduct(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.clickWithNavigationRetry(...);
}

async getProductNames(): Promise<string[]> {
    return await this.productNames.allInnerTexts();
}
```

#### Benefits

- Better IDE autocomplete
- Self-documenting code
- Catches incorrect returns at compile time
- Aligns with project standard (coding-standards.md line 11)

---

### 2. Use `readonly` for Immutable Properties

**Current State**: Good use of `readonly` for locators ✅  
**Recommendation**: Continue this pattern, expand where applicable

#### Example

```typescript
class AutomationExerciseProductsPage extends BasePage {
  // ✅ Good
  private readonly productsList: Locator;
  private readonly searchInput: Locator;

  // ✅ Good
  private readonly SELECTORS = {
    PRODUCTS_LIST: ".features_items",
    // ...
  } as const;
}
```

**Note**: Using `as const` for SELECTORS object makes it deeply readonly.

---

### 3. Avoid Non-Null Assertions

**Current State**: No obvious use of `!` operator ✅  
**Recommendation**: Continue avoiding this

Example to avoid:

```typescript
// ❌ Avoid
const element = this.productCards.nth(0)!;

// ✅ Better
const element = this.productCards.nth(0);
// Playwright will throw descriptive error if element doesn't exist
```

---

### 4. Use Type Guards

**Recommendation**: Add type guards for dynamic typing scenarios

#### Example Use Case

```typescript
// AutomationExerciseProductsSteps.ts line 31
@step('Add product "{0}" to cart')
async addProductToCart(product: string | number) {
    if (typeof product === 'number') {
        await this.productsPage.addProductToCart(product);
    } else {
        await this.productsPage.addProductToCartByName(product);
    }
}
```

**Enhancement**: Create a type guard function

```typescript
function isProductIndex(product: string | number): product is number {
    return typeof product === 'number';
}

@step('Add product "{0}" to cart')
async addProductToCart(product: string | number): Promise<void> {
    if (isProductIndex(product)) {
        await this.productsPage.addProductToCart(product);
    } else {
        await this.productsPage.addProductToCartByName(product);
    }
}
```

---

### 5. Enable Additional Strict Checks

**Current State**: `"strict": true` ✅  
**Recommendation**: Add more compiler checks

#### Recommended tsconfig.json Updates

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## Test Design Best Practices

### 1. Use Descriptive Test Names

**Current State**: Good test names ✅

Examples:

```typescript
test('TC01: Register User with Complete Profile', ...)
test('Search for non-existent product', ...)
test(`Scenario: Verify Brand Filter results match API Inventory - ${brand}`, ...)
```

**Recommendation**: Continue this pattern. Test names should:

- Describe what is being tested
- Describe the expected outcome
- Be unique and searchable

---

### 2. Keep Tests Focused

**Current State**: Tests are well-focused ✅

**Recommendation**: Continue ensuring each test:

- Tests one logical scenario
- Has a clear pass/fail condition
- Doesn't try to test multiple unrelated things

---

### 3. Use Data-Driven Tests

**Current State**: Good use of loops for parameterized tests ✅

```typescript
const brandsToTest = ['Polo', 'H&M', 'Madame'];

for (const brand of brandsToTest) {
    test(`Verify Brand Filter - ${brand}`, async ({ ... }) => {
        // Test logic
    });
}
```

**Recommendation**: Continue this pattern, but consider test.describe.configure for sharding:

```typescript
for (const brand of brandsToTest) {
    test.describe(`Brand: ${brand}`, () => {
        test.describe.configure({ mode: 'parallel' });

        test('Filter test', async ({ ... }) => { ... });
        test('Count test', async ({ ... }) => { ... });
    });
}
```

---

## Error Handling Best Practices

### 1. Provide Meaningful Error Messages

**Current State**: Good error messages ✅

```typescript
throw new Error(
  `${ERROR_MESSAGES.PRODUCT_VERIFICATION_FAILED}: Product "${name}" does not contain search term "${term}"`
);
```

**Recommendation**: Continue including:

- What failed
- Expected vs actual values
- Context for debugging

---

### 2. Use Custom Matchers

**Current State**: Custom matcher for status codes ✅

```typescript
export const expect = baseExpect.extend(customMatchers);

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveStatusCode(expectedCode: number): Promise<R>;
    }
  }
}
```

**Recommendation**: Consider adding more custom matchers for:

- Product data validation
- Cart state verification
- Form field validation

Example:

```typescript
// src/utils/CustomMatchers.ts
toContainProduct(productName: string) {
    return {
        message: () => `Expected cart to contain product: ${productName}`,
        pass: /* implementation */,
    };
}
```

---

## Performance Best Practices

### 1. Use API for Test Data Setup

**Current State**: Hybrid tests use API ✅

```typescript
// TC13_BrandCategoryFiltering.spec.ts
const expectedProducts = await productsApiSteps.getProductsByBrand(brand);
```

**Recommendation**: Continue this pattern. Use API for:

- ✅ Setting up test data
- ✅ Fast pre-conditions
- ✅ Verification alongside UI
- ✅ Cleanup

---

### 2. Avoid Unnecessary Waits

**Current State**: Needs improvement (see critical issues)  
**Recommendation**: Remove all `waitForTimeout()` calls

---

### 3. Optimize Locators

**Recommendation**: Use specific locators instead of chaining filters

**Current**:

```typescript
private getProductCardByName(productName: string): Locator {
    return this.productCards.filter({ hasText: productName }).first();
}
```

**Alternative** (if possible):

```typescript
// If products have unique IDs
private getProductCardById(productId: string): Locator {
    return this.page.locator(`[data-product-id="${productId}"]`);
}
```

---

## Documentation Best Practices

### 1. Add JSDoc to Public APIs

**Recommendation**: Add JSDoc to complex methods

```typescript
/**
 * Searches for products matching the given term.
 * Automatically waits for search results to load.
 *
 * @param term - The search term (case-insensitive)
 * @throws {Error} If search fails or navigation doesn't complete
 * @example
 * await productsPage.searchProduct('Jeans');
 */
async searchProduct(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.clickWithNavigationRetry(this.submitSearchButton, /\\/products\\?search=/);
}
```

---

### 2. Keep Comments Updated

**Current State**: Some comments may be outdated

```typescript
// AutomationExerciseProductsPage.ts
// Product Card Elements
// Product Card Elements  // ❌ Duplicate comment
PRODUCT_CARD: '.product-image-wrapper', // Structural wrapper, keeping as class for now
```

**Recommendation**: Remove outdated or duplicate comments

---

## Security Best Practices

### 1. Never Commit Secrets

**Current State**: Using environment variables ✅

```typescript
dotenv.config({ path: path.resolve(__dirname, ".env") });
```

**Recommendation**: Ensure `.env` is in `.gitignore` and use environment-specific configs

---

### 2. Validate External Data

**Recommendation**: Add schema validation for API responses

```typescript
// Example using Zod (already in package.json)
import { z } from 'zod';

const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.string(),
    brand: z.string().optional(),
});

async getProducts() {
    const response = await this.apiClient.get('/products');
    const products = ProductSchema.array().parse(response.data);
    return products;
}
```

---

## Maintenance Best Practices

### 1. Keep Dependencies Updated

**Recommendation**: Regularly update Playwright and other dependencies

```bash
# Check for updates
npm outdated

# Update Playwright
npm install -D @playwright/test@latest
npx playwright install
```

---

### 2. Run Linters Regularly

**Recommendation**: Set up pre-commit hooks

```bash
# Install husky
npm install --save-dev husky lint-staged

# Add to package.json
"lint-staged": {
    "*.ts": [
        "eslint --fix",
        "prettier --write"
    ]
}
```

---

### 3. Monitor Test Flakiness

**Recommendation**: Track test stability over time

- Use Playwright's built-in flakiness detection
- Re-run failed tests automatically
- Monitor retry rates in CI

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0, // ✅ Good
});
```

---

## Summary Checklist

### High Priority

- [ ] Remove all `waitForTimeout()` calls
- [ ] Add explicit return types
- [ ] Migrate to role-based locators (where feasible)
- [ ] Add ESLint rule for missing await

### Medium Priority

- [ ] Use `toPass()` for retries
- [ ] Add more JSDoc comments
- [ ] Create additional custom matchers
- [ ] Set up pre-commit hooks

### Low Priority

- [ ] Add stricter TypeScript checks
- [ ] Create more test data factories
- [ ] Add API response schema validation
- [ ] Set up flakiness monitoring

---

**These best practices will help maintain a robust, scalable, and maintainable test suite.**
