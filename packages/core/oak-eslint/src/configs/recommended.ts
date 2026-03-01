import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import { importX } from 'eslint-plugin-import-x';
import tsdocPlugin from 'eslint-plugin-tsdoc';

import type { Linter } from 'eslint';

/**
 * Restricted types shared between recommended and strict configs.
 *
 * Strict config spreads this and adds FORBIDDEN-prefixed overrides
 * plus strict-only additions. Adding a type here automatically
 * includes it in strict — no duplication needed.
 */
export const RECOMMENDED_RESTRICTED_TYPES = {
  'Record<string, unknown>': {
    message:
      'Avoid Record<string, unknown>. Use an existing internal or library type where possible.',
  },
  'Record<string, undefined>': {
    message:
      'Avoid Record<string, undefined>. Use an existing internal or library type where possible. If keys are optional, prefer Partial.',
  },
  'Readonly<Record<string, undefined>>': {
    message:
      'Avoid Readonly<Record<string, undefined>>. Use an existing internal or library type where possible.',
  },
  'Record<PropertyKey, undefined>': {
    message:
      'Avoid Record<PropertyKey, undefined>. Use an existing internal or library type where possible.',
  },
} as const;

export const recommended: Linter.Config[] = [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  prettierConfig,
  {
    plugins: {
      tsdoc: tsdocPlugin,
    },
    rules: {
      // Types
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      curly: 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: RECOMMENDED_RESTRICTED_TYPES,
        },
      ],

      // Type imports and exports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',

      // Complexity
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],

      // General good practices
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-constant-condition': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/consistent-return': 'error',

      // Import rules
      'import-x/no-namespace': 'error',
      'import-x/no-cycle': ['error'],
      'import-x/no-useless-path-segments': ['error'],
      'import-x/no-named-as-default': 'error',

      // TSDoc
      'tsdoc/syntax': 'warn',

      // Prevent export *
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:
            'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
        },
      ],
    },
  },
];
