import { AutomationExerciseLandingPage } from '../pages/AutomationExerciseLandingPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseLandingSteps {
    constructor(private landingPage: AutomationExerciseLandingPage) { }

    @step('Navigate to homepage')
    async navigateToHomepage(): Promise<void> {
        await this.landingPage.navigate();
    }


    @step('Verify landing page is opened')
    async verifyPageOpened(): Promise<void> {
        await this.landingPage.verifyPageOpened();
    }
}
