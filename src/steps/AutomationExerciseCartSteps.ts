import { AutomationExerciseCartPage } from '../pages/AutomationExerciseCartPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseCartSteps {
    constructor(private cartPage: AutomationExerciseCartPage) { }

    @step('Verify Cart page is visible')
    async verifyCartVisible(): Promise<void> {
        await this.cartPage.verifyCartVisible();
    }

    @step('Verify Cart content')
    async verifyCartContent(products: Array<{ name: string, quantity: string, price: string, total: string }>): Promise<void> {
        for (const product of products) {
            await this.cartPage.verifyProductQuantity(product.name, product.quantity);
            await this.cartPage.verifyProductPrice(product.name, product.price);
            await this.cartPage.verifyTotalPrice(product.name, product.total);
        }
    }

    @step('Remove product: {0}')
    async removeProduct(productName: string): Promise<void> {
        await this.cartPage.removeProduct(productName);
    }

    @step('Verify product removed: {0}')
    async verifyProductRemoved(productName: string): Promise<void> {
        await this.cartPage.verifyProductRemoved(productName);
    }

    @step('Verify cart is empty')
    async verifyCartEmpty(): Promise<void> {
        await this.cartPage.verifyCartEmpty();
    }

    @step('Click "Proceed To Checkout"')
    async proceedToCheckout(): Promise<void> {
        await this.cartPage.proceedToCheckout();
    }

    @step('Get cart items details')
    async getCartItemsDetails(): Promise<{ name: string, price: string, quantity: string, total: string }[]> {
        return await this.cartPage.getCartItemsDetails();
    }
}
