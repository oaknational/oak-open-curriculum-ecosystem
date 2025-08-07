import eslintTypescript from '@typescript-eslint/eslint-plugin';
import eslintTypescriptParser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: eslintTypescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.lint.json',
      },
    },
    plugins: {
      '@typescript-eslint': eslintTypescript,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '*.config.js',
      '*.config.ts',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
  },
];

export default config;
