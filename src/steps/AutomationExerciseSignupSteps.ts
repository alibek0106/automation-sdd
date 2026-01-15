import { AutomationExerciseSignupPage } from '../pages/AutomationExerciseSignupPage';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseSignupSteps {
    constructor(
        private signupPage: AutomationExerciseSignupPage,
        private accountCreatedPage: AccountCreatedPage
    ) { }

    @step('Verify Account Information page is opened')
    async verifyAccountInfoPageOpened(): Promise<void> {
        await this.signupPage.verifyAccountInfoPageOpened();
    }

    @step('Fill account details')
    async fillAccountDetails(details: { title: 'Mr.' | 'Mrs.', password: string, day: string, month: string, year: string }): Promise<void> {
        await this.signupPage.selectTitle(details.title);
        await this.signupPage.enterPassword(details.password);
        await this.signupPage.selectDateOfBirth(details.day, details.month, details.year);
    }

    @step('Select newsletter')
    async selectNewsletter(): Promise<void> {
        await this.signupPage.checkNewsletter();
    }

    @step('Select special offers')
    async selectSpecialOffers(): Promise<void> {
        await this.signupPage.checkSpecialOffers();
    }

    @step('Fill address info')
    async fillAddressInfo(info: { firstName: string, lastName: string, company: string, address: string, address2: string, country: string, state: string, city: string, zipcode: string, mobileNumber: string }): Promise<void> {
        await this.signupPage.enterFirstName(info.firstName);
        await this.signupPage.enterLastName(info.lastName);
        await this.signupPage.enterCompany(info.company);
        await this.signupPage.enterAddress(info.address);
        await this.signupPage.enterAddress2(info.address2);
        await this.signupPage.selectCountry(info.country);
        await this.signupPage.enterState(info.state);
        await this.signupPage.enterCity(info.city);
        await this.signupPage.enterZipcode(info.zipcode);
        await this.signupPage.enterMobileNumber(info.mobileNumber);
    }

    @step('Click Create Account button')
    async clickCreateAccount(): Promise<void> {
        await this.signupPage.clickCreateAccount();
    }

    @step('Verify "ACCOUNT CREATED!" message')
    async verifyAccountCreated(): Promise<void> {
        await this.accountCreatedPage.verifyAccountCreatedMessage();
    }

    @step('Click Continue button')
    async clickContinue(): Promise<void> {
        await this.accountCreatedPage.clickContinue();
    }
}
