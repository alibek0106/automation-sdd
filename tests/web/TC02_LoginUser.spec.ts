import { test } from '@fixtures/index';
import { DataFactory } from '@utils/DataFactory';

/**
 * TC02: User Login
 * 
 * Validates user authentication with correct credentials and verifies
 * successful login state in the UI.
 */

test.describe('User Authentication', () => {
    let user = DataFactory.generateUser();

    test.beforeEach(async ({ userApiSteps }) => {
        // Create a unique user for this test via API
        // We need full user details for registration, even if we only need email/pass for login
        const account = DataFactory.generateAccountDetails();
        const address = DataFactory.generateAddressInfo();

        // Update user password to match account password as that's what's used for login
        user.password = account.password;

        await userApiSteps.registerUser(user, account, address);
    });

    test.afterEach(async ({ userApiSteps }) => {
        await userApiSteps.deleteUser(user.email, user.password);
    });

    test('TC02: Login User with correct email and password', async ({
        automationExerciseLandingSteps,
        automationExerciseNavigationSteps,
        automationExerciseLoginSteps,
    }) => {
        // --- TEST FLOW ---
        // 1. Launch browser and Navigate to url 'http://automationexercise.com'
        await automationExerciseLandingSteps.navigateToHomepage();

        // 2. Verify that home page is visible successfully
        await automationExerciseLandingSteps.verifyPageOpened();

        // 3. Click on 'Signup / Login' button
        await automationExerciseNavigationSteps.clickSignupLogin();

        // 4. Verify 'Login to your account' is visible
        await automationExerciseLoginSteps.verifyLoginHeaderVisible();

        // 5. Enter correct email address and password
        // 6. Click 'login' button
        await automationExerciseLoginSteps.login(user.email, user.password);

        // 7. Verify that 'Logged in as username' is visible
        await automationExerciseNavigationSteps.verifyUserLoggedIn(user.name);
    });
});
