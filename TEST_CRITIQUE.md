# Test Suite Critique & Strategy Review (Hybrid Folder Focus)

## 1. Reliability & Stability Score
**Score: 8/10**

The hybrid suite (`tests/hybrid/`) is significantly more robust than the web suite. The test files here largely adhere to the critical requirements of isolation and state management.

*   **Positive Stability Factors:**
    *   **TC14 (`TC14_PurchaseFlowApiValidation.spec.ts`):** Correctly implements the "Fresh User per Worker" pattern. It generates a unique user in `beforeEach` and calls `userApiSteps.registerUser`. This ensures that if 4 workers run in parallel, they each have their own user, fulfilling **Hybrid Requirement 1, 2, and 3**.
    *   **TC05 & TC13:** These are largely stateless "read-only" tests (Search/Filter), meaning they are inherently safe for parallel execution as they don't modify server state.

*   **Risk Factors:**
    *   **TC14 Cleanup:** Use of `afterEach` for cleanup (`deleteUser`) is good, but if the test crashes *before* the hook, the user might remain on the server. Ideally, cleanup should be robust (e.g., separate cleanup job or "try/finally" semantics in fixtures), but standard Playwright hooks are generally acceptable.

## 2. Test Architecture & Maintenance

*   **Parallel Execution Compliance:**
    *   **Verdict: PASS.** All three hybrid tests (`TC05`, `TC13`, `TC14`) respect parallel execution. `TC14` specifically uses dynamic data generation (`DataFactory.generateFullUser()`) inside the test scope, so no static JSON files are locking threads.

*   **Selector Strategy & Steps Layer:**
    *   **TC05/TC13:** Correctly use `automationExerciseProductsSteps` and `productsApiSteps` layers. Logic is decoupled from the test file.
    *   **TC14 Helper:** Passes `page` object into `verifyAddressFieldsInPage` method inside the step:
        ```typescript
        await automationExerciseCheckoutSteps.verifyAddressFieldsInPage(..., page);
        ```
        **Critique:** Steps should reference their own `this.page`, not accept `page` as an argument from the test. This breaks encapsulation.

*   **API Steps Quality:**
    *   **Violation:** `UserApiSteps` (used in TC14) still returns `Promise<any>` calls and lacks decorators, which was identified in the broader review but applies here too. This makes the "Hybrid" part (the API interaction) weak in terms of type safety.

## 3. Improvements & Adherence to Requirements

### Critical Refactors
- [ ] **Fix TC14 Encapsulation:** Refactor `verifyAddressFieldsInPage` in `AutomationExerciseCheckoutSteps`. It should not accept `page` as an argument. The Page Object already owns `this.page`.
    *   *Current:* `verifyAddressFieldsInPage(..., page)`
    *   *Required:* `verifyAddressFieldsInPage(...)`
- [ ] **Type Safety in API Layer:** `productsApiSteps.getProductsByBrand` and others are good (`Product[]`), but `UserApiSteps` needs to return proper interfaces (e.g., `UserDetailsResponse`) instead of `any` to prevent regression.

### Strategic Improvements
- [ ] **Data-Driven Approach in TC05:** The loop `for (const { searchTerm... } of searchScenarios)` is excellent. Consider moving these scenarios to a separate data file (`tests/testData/searchData.ts`) to keep the spec file cleaner.
- [ ] **Unified Assertion Messages:** `TC14` has good custom messages (`expect(..., 'Cart price...').toContain(...)`). Ensure `TC13` and `TC05` match this standard (Requirements 12).

## 4. Areas for Investigation

*   **Topic: Network Mocking vs. Live API**
    *   **Context:** These are "Hybrid" tests, so they *must* hit the real API. However, for negative testing (e.g., "Simulate API 500 Error"), Playwright's `page.route()` is powerful.
    *   **Why:** To test UI resilience when the API *fails*, which is hard to reproduce with a real stable API.

*   **Topic: API Response Validation Libraries**
    *   **Context:** `expect(responseBody).toHaveProperty(...)` is okay, but libraries like `zod` can validate the *entire* schema of the API response in one line, ensuring strict contract testing.
