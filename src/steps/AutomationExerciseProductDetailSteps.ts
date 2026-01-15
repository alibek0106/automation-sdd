import { AutomationExerciseProductDetailPage } from '../pages/AutomationExerciseProductDetailPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseProductDetailSteps {
    constructor(private productDetailPage: AutomationExerciseProductDetailPage) { }

    @step('Verify Product Detail page is visible')
    async verifyProductDetailVisible(): Promise<void> {
        await this.productDetailPage.verifyProductDetailVisible();
    }

    @step('Add product to cart with quantity: {0}')
    async addProductToCartWithQuantity(quantity: string): Promise<void> {
        await this.productDetailPage.setQuantity(quantity);
        await this.productDetailPage.addToCart();
    }

    @step('Click "Continue Shopping"')
    async clickContinueShopping(): Promise<void> {
        await this.productDetailPage.clickContinueShopping();
    }

    @step('Click "View Cart"')
    async clickViewCart(): Promise<void> {
        await this.productDetailPage.clickViewCart();
    }
}
