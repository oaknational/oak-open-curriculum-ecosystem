/**
 * Base ESLint Configuration - Shared across all workspaces
 *
 * This configuration contains rules that apply to all workspaces.
 * Workspace-specific rules should be added in their own eslint.config.js files.
 */

import eslint from '@eslint/js';
import {
  config as tsEslintConfig,
  configs as tsEslintConfigs,
  parser as tsEslintParser,
} from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';

export const baseConfig = tsEslintConfig(
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '**/*.d.ts',
      '.eslintrc.js',
      'commitlint.config.js',
      'reference/',
    ],
  },
  eslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...tsEslintConfigs.strictTypeChecked,
  ...tsEslintConfigs.stylisticTypeChecked,
  prettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        projectService: true,
      },
      /**
       * @todo the code base is supposed to be edge compatible, so we need to remove these globals, move the Node reliant code to a specific space, and add the Node globals there
       */
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Types
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',

      // Complexity
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],

      // General good practices
      // TypeScript handles undefined variables better than ESLint
      'no-undef': 'off',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-constant-condition': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      'consistent-return': 'off',
      '@typescript-eslint/consistent-return': 'error',

      // Import rules for tree shaking
      'import-x/no-namespace': 'error',
      'import-x/no-cycle': ['error'],
      'import-x/no-useless-path-segments': ['error'],
      'import-x/no-named-as-default': 'error',

      // Prevent export * for better tree shaking
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
  // Test files - common rules
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/test-*.ts', '**/__tests__/**'],
    rules: {
      'max-lines': ['error', 700],
      'max-lines-per-function': ['error', 1000],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow',
        },
      ],
    },
  },
  // Config files need their own tsconfig
  {
    files: ['**/*.config.ts', '**/eslint.config.ts', 'eslint.config.base.ts'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
