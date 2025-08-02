import eslint from '@eslint/js';
import {
  config as tsEslintConfig,
  configs as tsEslintConfigs,
  parser as tsEslintParser,
  type Config,
} from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { importX } from 'eslint-plugin-import-x';

const config: Config = tsEslintConfig(
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '**/*.d.ts',
      '.eslintrc.js',
      'commitlint.config.js',
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
        project: './tsconfig.json',
      },
    },
    rules: {
      // Types
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',

      // Complexity. These rules are intended to minimise cognitive load and enforce good code design.
      complexity: ['error', { max: 10 }], // Cyclomatic complexity, lowers cognitive load
      'max-depth': ['error', 3], // Max levels of nesting, lowers cognitive load
      'max-statements': ['error', 20], // Max statements per function, enforces single responsibility principle
      'max-lines-per-function': ['error', 50], // Target 50 (1 screen height), enforces single responsibility principle, lowers cognitive load
      'max-lines': ['error', 190], // Requires well defined boundaries of responsibility

      // General good practices
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-constant-condition': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      'consistent-return': 'off', // Note: you must disable the base rule as it can report incorrect errors
      '@typescript-eslint/consistent-return': 'error',

      // Import rules for tree shaking
      'import-x/no-namespace': 'error', // Prevents import * as something

      // Prevent export * from 'module' for better tree shaking
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:
            'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
        },
      ],

      // Enforce module boundaries - no reaching into parent directories, helps enforce dependency inversion principle
      'import-x/no-relative-parent-imports': ['warn'],
    },
  },
  // Separation of concerns between the core framework and individual servers, to make it easier to extract the core framework into a workspace later
  // Restriction for app code
  {
    files: ['src/oak-notion-mcp/**/*.ts'],
    rules: {
      'import-x/no-internal-modules': [
        'error',
        {
          forbid: ['oak-mcp-core/**'], // disallow deep imports
          allow: ['oak-mcp-core'], // allow only the barrel
        },
      ],
    },
  },
  // Core MCP framework code itself cannot import from other folders/workspaces outside of oak-mcp-core
  {
    files: ['src/oak-mcp-core/**/*.ts'],
    rules: {
      'import-x/no-internal-modules': 'error',
    },
  },
  // Test files
  {
    files: ['**/*.test.ts'],
    rules: {
      // Allow test files to import from parent directories for testing utilities
      'import-x/no-relative-parent-imports': 'off',
      // The outer arrow functions in test files can get huge, but the inner functions
      // should be small, one solution might be to improve encapsulation and separation
      // of concerns in the file under test, forcing it to be broken down into smaller
      // files and therefore smaller test files as well.
      // Vitest does support more than one top-level define(), so maybe we just
      // need to break with Jest compatibility and use that.
      'max-lines': ['error', 700],
      'max-lines-per-function': ['error', 1000],
    },
  },
  // Config files (JS)
  {
    files: ['**/*.config.js'],
    extends: [tsEslintConfigs.disableTypeChecked],
  },
  // Script files
  {
    files: ['**/scripts/*.ts'],
    rules: {
      'max-lines': ['error', 300],
    },
  },
);

export default config;
