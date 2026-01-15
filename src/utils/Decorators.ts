import { test } from '@playwright/test';

export function step(stepName?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (...args: any[]) {
        // Standard Decorators (Stage 3) - 2 arguments: (value, context)
        if (args.length === 2 && typeof args[1] === 'object' && args[1] !== null && 'kind' in args[1]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            const [originalMethod, context] = args as [Function, ClassMethodDecoratorContext];
            if (context.kind !== 'method') throw new Error('@step can only be used on methods');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return async function (this: any, ...methodArgs: any[]) {
                const name = stepName || `${this.constructor.name}.${String(context.name)}`;
                return await test.step(
                    name,
                    async () => {
                        return await originalMethod.apply(this, methodArgs);
                    },
                    { box: true }
                );
            };
        }

        // Legacy Decorators (Experimental) - 3 arguments: (target, propertyKey, descriptor)
        if (args.length >= 3) {
            const [, propertyKey, descriptor] = args;

            // Ensure descriptor exists (sometimes undefined in edge cases or if signature mismatches)
            if (!descriptor) {
                // Fallback or error if descriptor is strictly required
                throw new Error(`@step decorator called with 3 arguments but descriptor is undefined. Ensure Method Decorator signature.`);
            }

            const originalMethod = descriptor.value;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            descriptor.value = async function (...methodArgs: any[]) {
                const name = stepName || `${this.constructor.name}.${propertyKey}`;
                return await test.step(
                    name,
                    async () => {
                        return await originalMethod.apply(this, methodArgs);
                    },
                    { box: true }
                );
            };
            return descriptor;
        }

        throw new Error('Unsupported decorator signature: @step compatible with Legacy (3 args) or Standard (2 args) decorators only.');
    };
}