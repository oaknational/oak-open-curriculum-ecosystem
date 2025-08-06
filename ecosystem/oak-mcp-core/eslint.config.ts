/**
 * ESLint Configuration for oak-mcp-core
 *
 * The MCP genotype package - minimal restrictions as it's pure infrastructure
 */

import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../eslint.config.base.js';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = tsEslintConfig(
  ...baseConfig,
  {
    ignores: ['dist/**', '*.log', '.turbo/**'],
  },
  {
    files: ['**/*.ts'],
    ignores: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
        tsconfigRootDir: thisDir,
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // Chora modules can import from other chora
      'import-x/no-relative-parent-imports': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
      // Allow some patterns needed for error handling
      '@typescript-eslint/no-this-alias': 'off',
    },
  },
  {
    // Configuration for test files
    files: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {},
  },
);

export default config;
