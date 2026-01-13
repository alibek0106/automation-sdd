import { AutomationExerciseLandingPage } from '../pages/AutomationExerciseLandingPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseLandingSteps {
    constructor(private landingPage: AutomationExerciseLandingPage) { }

    @step('Navigate to homepage')
    async navigateToHomepage() {
        await this.blockAds();
        await this.landingPage.navigate();
    }

    async blockAds() {
        const page = this.landingPage.page;
        await page.route('**/*google_vignette*', (route: any) => route.abort());
        await page.route('**/adsbygoogle.js', (route: any) => route.abort());
        await page.route('**/*googlesyndication.com/**', (route: any) => route.abort());
        await page.route('**/*doubleclick.net/**', (route: any) => route.abort());
        await page.route('**/*amazon-adsystem.com/**', (route: any) => route.abort());
        await page.route('**/*gpt.js', (route: any) => route.abort());
    }

    @step('Verify landing page is opened')
    async verifyPageOpened() {
        await this.landingPage.verifyPageOpened();
    }
}
