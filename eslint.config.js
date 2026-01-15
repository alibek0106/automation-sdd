import playwright from 'eslint-plugin-playwright';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    // General Typescript Configuration
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
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
            'playwright/no-force-option': 'warn',
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