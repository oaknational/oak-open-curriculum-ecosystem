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

      // Complexity. These are set to accommodate the current quality of the code.
      // If we want to use this repo to demo best practices, we need to bring them down to the targets in dedicated PRs.
      // That needs to be done gradually.
      complexity: ['error', { max: 35 }], // Target 10, lowers cognitive load
      'max-depth': ['error', 5], // Target 3, lowers cognitive load
      'max-statements': ['error', 50], // Max statements per function, target 20, enforces single responsibility principle
      'max-lines-per-function': ['error', 100], // Target 40 (1 screen height), enforces single responsibility principle, lowers cognitive load
      'max-lines': ['error', 1000], // Max lines per file, target 350, requires well defined boundaries of responsibility

      // Good practices
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-constant-condition': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      // Note: you must disable the base rule as it can report incorrect errors
      'consistent-return': 'off',
      '@typescript-eslint/consistent-return': 'error',
    },
  },
  // Test files
  {
    files: ['**/*.test.ts'],
    rules: {
      // The outer arrow functions in test files can get huge, but the inner functions
      // should be small, one solution might be to improve encapsulation and separation
      // of concerns in the file under test, forcing it to be broken down into smaller
      // files and therefore smaller test files as well.
      // Vitest does support more than one top-level define(), so maybe we just
      // need to break with Jest compatibility and use that.
      'max-lines-per-function': ['error', 1000],
    },
  },
  // Config files (JS)
  {
    files: ['**/*.config.js'],
    extends: [tsEslintConfigs.disableTypeChecked],
  },
  // Separation of concerns between core and individual servers, to make extraction into workspaces easier later
  // Restriction for app code
  {
    files: ['src/oak-notion-mcp/**/*.{ts,tsx,js,jsx}'],
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
    files: ['src/oak-mcp-core/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'import-x/no-internal-modules': 'error',
    },
  },
);

export default config;
