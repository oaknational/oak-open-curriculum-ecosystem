/**
 * ESLint Configuration for oak-mcp-core
 *
 * The MCP genotype package - minimal restrictions as it's pure infrastructure
 */

import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../eslint.config.base.js';

const config = tsEslintConfig(
  ...baseConfig,
  {
    files: ['**/*.ts'],
    ignores: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
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
    rules: {
      // Test files can have looser rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
  {
    // Configuration for config files
    files: ['*.config.ts', '*.config.js', 'eslint.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Config files can use CommonJS
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);

export default config;
