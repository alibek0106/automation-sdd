import { test as base, expect as baseExpect } from '@playwright/test';
import { PagesFixture, pagesFixture } from './pages.fixture';
import { StepsFixture, stepsFixture } from './steps.fixture';
import { ApiFixture, apiFixture } from './api.fixture';
import { customMatchers } from '../utils/CustomMatchers';

export type TestFixtures = PagesFixture & StepsFixture & ApiFixture;

export const test = base.extend<TestFixtures>({
    ...pagesFixture,
    ...stepsFixture,
    ...apiFixture,
    page: async ({ page }, use) => {
        // Global Ad Blocking
        await page.route('**/*google_vignette*', (route: any) => route.abort());
        await page.route('**/adsbygoogle.js', (route: any) => route.abort());
        await page.route('**/*googlesyndication.com/**', (route: any) => route.abort());
        await page.route('**/*doubleclick.net/**', (route: any) => route.abort());
        await page.route('**/*amazon-adsystem.com/**', (route: any) => route.abort());
        await page.route('**/*gpt.js', (route: any) => route.abort());

        await use(page);
    },
});

export const expect = baseExpect.extend(customMatchers);

declare global {
    namespace PlaywrightTest {
        interface Matchers<R> {
            toHaveStatusCode(expectedCode: number): Promise<R>;
        }
    }
}
