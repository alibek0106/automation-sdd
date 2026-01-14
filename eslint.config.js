import playwright from 'eslint-plugin-playwright';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    // General Typescript Configuration
    {
        files: ['**/*.ts'],
        languageOptions: {
            parseOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: globals.node,
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },
    // Playwright Configuration
    {
        files: ['tests/**/*.ts', '**/*.spec.ts'],
        ...playwright.configs['flat/recommended'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            'playwright/no-skipped-test': 'warn',
            'playwright/no-page-pause': 'error',
            'playwright/no-force': 'warn',
        },
        settings: {
            playwright: {
                messages: {
                    conditionalExpects: 'Avoid conditional expectations (if/else). They make tests flaky.',
                    noForce: 'Do not force clicks. Fix the UI overlay causing the issue instead.',
                },
            },
        },
    },
];