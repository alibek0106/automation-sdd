import { Page, Locator, expect } from '@playwright/test';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AutomationExerciseSignupPage extends BasePage {

    // ===========================
    // Constants & Selectors
    // ===========================
    private readonly SELECTORS = {
        // Account Info
        RADIO_MR: '#id_gender1',
        RADIO_MRS: '#id_gender2',
        INPUT_PASSWORD: '[data-qa="password"]',
        DROPDOWN_DAYS: '[data-qa="days"]',
        DROPDOWN_MONTHS: '[data-qa="months"]',
        DROPDOWN_YEARS: '[data-qa="years"]',
        CHECKBOX_NEWSLETTER: '#newsletter',
        CHECKBOX_OFFERS: '#optin',

        // Address Info
        INPUT_FIRST_NAME: '[data-qa="first_name"]',
        INPUT_LAST_NAME: '[data-qa="last_name"]',
        INPUT_COMPANY: '[data-qa="company"]',
        INPUT_ADDRESS: '[data-qa="address"]',
        INPUT_ADDRESS2: '[data-qa="address2"]',
        DROPDOWN_COUNTRY: '[data-qa="country"]',
        INPUT_STATE: '[data-qa="state"]',
        INPUT_CITY: '[data-qa="city"]',
        INPUT_ZIPCODE: '[data-qa="zipcode"]',
        INPUT_MOBILE: '[data-qa="mobile_number"]',

        // Actions
        BTN_CREATE_ACCOUNT: '[data-qa="create-account"]'
    };

    // ===========================
    // Locators
    // ===========================

    // Header
    private readonly accountInfoHeader: Locator;

    // Account Info
    private readonly titleMr: Locator;
    private readonly titleMrs: Locator;
    private readonly passwordInput: Locator;
    private readonly daysDropdown: Locator;
    private readonly monthsDropdown: Locator;
    private readonly yearsDropdown: Locator;
    private readonly newsletterCheckbox: Locator;
    private readonly specialOffersCheckbox: Locator;

    // Address Info
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly companyInput: Locator;
    private readonly addressInput: Locator;
    private readonly address2Input: Locator;
    private readonly countryDropdown: Locator;
    private readonly stateInput: Locator;
    private readonly cityInput: Locator;
    private readonly zipcodeInput: Locator;
    private readonly mobileNumberInput: Locator;

    private readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page, 'SignupPage');

        this.accountInfoHeader = page.getByText(MESSSAGES.ENTER_ACCOUNT_INFO);

        this.titleMr = this.page.locator(this.SELECTORS.RADIO_MR).describe('Title Mr');
        this.titleMrs = this.page.locator(this.SELECTORS.RADIO_MRS).describe('Title Mrs');
        this.passwordInput = this.page.locator(this.SELECTORS.INPUT_PASSWORD).describe('Password Input');
        this.daysDropdown = this.page.locator(this.SELECTORS.DROPDOWN_DAYS).describe('Days Dropdown');
        this.monthsDropdown = this.page.locator(this.SELECTORS.DROPDOWN_MONTHS).describe('Months Dropdown');
        this.yearsDropdown = this.page.locator(this.SELECTORS.DROPDOWN_YEARS).describe('Years Dropdown');
        this.newsletterCheckbox = this.page.locator(this.SELECTORS.CHECKBOX_NEWSLETTER).describe('Newsletter Checkbox');
        this.specialOffersCheckbox = this.page.locator(this.SELECTORS.CHECKBOX_OFFERS).describe('Special Offers Checkbox');

        this.firstNameInput = this.page.locator(this.SELECTORS.INPUT_FIRST_NAME).describe('First Name Input');
        this.lastNameInput = this.page.locator(this.SELECTORS.INPUT_LAST_NAME).describe('Last Name Input');
        this.companyInput = this.page.locator(this.SELECTORS.INPUT_COMPANY).describe('Company Input');
        this.addressInput = this.page.locator(this.SELECTORS.INPUT_ADDRESS).describe('Address Input');
        this.address2Input = this.page.locator(this.SELECTORS.INPUT_ADDRESS2).describe('Address2 Input');
        this.countryDropdown = this.page.locator(this.SELECTORS.DROPDOWN_COUNTRY).describe('Country Dropdown');
        this.stateInput = this.page.locator(this.SELECTORS.INPUT_STATE).describe('State Input');
        this.cityInput = this.page.locator(this.SELECTORS.INPUT_CITY).describe('City Input');
        this.zipcodeInput = this.page.locator(this.SELECTORS.INPUT_ZIPCODE).describe('Zipcode Input');
        this.mobileNumberInput = this.page.locator(this.SELECTORS.INPUT_MOBILE).describe('Mobile Number Input');

        this.createAccountButton = this.page.locator(this.SELECTORS.BTN_CREATE_ACCOUNT).describe('Create Account Button');
    }

    // ===========================
    // Actions
    // ===========================

    async verifyAccountInfoPageOpened() {
        await expect(this.accountInfoHeader, 'Account Info Header should be visible').toBeVisible();
    }

    async selectTitle(title: 'Mr.' | 'Mrs.') {
        await (title === 'Mr.' ? this.titleMr : this.titleMrs).check();
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async selectDateOfBirth(day: string, month: string, year: string) {
        await this.daysDropdown.selectOption(day);
        await this.monthsDropdown.selectOption(month);
        await this.yearsDropdown.selectOption(year);
    }

    async checkNewsletter() {
        await this.newsletterCheckbox.check();
    }

    async checkSpecialOffers() {
        await this.specialOffersCheckbox.check();
    }

    async enterFirstName(firstName: string) {
        await this.firstNameInput.fill(firstName);
    }

    async enterLastName(lastName: string) {
        await this.lastNameInput.fill(lastName);
    }

    async enterCompany(company: string) {
        await this.companyInput.fill(company);
    }

    async enterAddress(address: string) {
        await this.addressInput.fill(address);
    }

    async enterAddress2(address2: string) {
        await this.address2Input.fill(address2);
    }

    async selectCountry(country: string) {
        await this.countryDropdown.selectOption(country);
    }

    async enterState(state: string) {
        await this.stateInput.fill(state);
    }

    async enterCity(city: string) {
        await this.cityInput.fill(city);
    }

    async enterZipcode(zipcode: string) {
        await this.zipcodeInput.fill(zipcode);
    }

    async enterMobileNumber(mobileNumber: string) {
        await this.mobileNumberInput.fill(mobileNumber);
    }

    async clickCreateAccount() {
        await this.createAccountButton.click();
    }
}
