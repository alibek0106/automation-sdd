import { AutomationExerciseNavigationMenu } from '../pages/AutomationExerciseNavigationMenu';
import { step } from '../utils/Decorators';

export class AutomationExerciseNavigationSteps {
    constructor(private navigationMenu: AutomationExerciseNavigationMenu) { }

    @step('Click Signup/Login link')
    async clickSignupLogin(): Promise<void> {
        await this.navigationMenu.clickSignupLogin();
    }

    @step('Click Delete Account link')
    async clickDeleteAccount(): Promise<void> {
        await this.navigationMenu.clickDeleteAccount();
    }

    @step('Click Logout link')
    async clickLogout(): Promise<void> {
        await this.navigationMenu.clickLogout();
    }

    @step('Verify user is logged in as {0}')
    async verifyUserLoggedIn(username: string): Promise<void> {
        await this.navigationMenu.verifyUserLoggedIn(username);
    }

    @step('Verify user is not logged in')
    async verifyUserNotLoggedIn(): Promise<void> {
        await this.navigationMenu.verifyUserNotLoggedIn();
    }

    @step('Click Home link')
    async clickHome(): Promise<void> {
        await this.navigationMenu.clickHome();
    }

    @step('Click Products link')
    async clickProducts(): Promise<void> {
        await this.navigationMenu.clickProducts();
    }

    @step('Click Cart link')
    async clickCart(): Promise<void> {
        await this.navigationMenu.clickCart();
    }
}
