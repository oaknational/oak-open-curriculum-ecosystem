/**
 * ESLint Configuration for oak-notion-mcp
 *
 * The Notion phenotype - enforces biological architecture pattern
 */

import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../eslint.config.base.js';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = tsEslintConfig(
  ...baseConfig,
  {
    ignores: ['dist/**', '*.log', '.turbo/**', '.logs/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
        tsconfigRootDir: thisDir,
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.lint.json',
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // Enforce module boundaries
      'import-x/no-relative-parent-imports': 'off',

      // Biological Architecture Enforcement
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            // Organa isolation - organs cannot import from other organs
            {
              target: 'src/organa/notion/**',
              from: 'src/organa/mcp/**',
              message:
                'Organs cannot import from other organs. Use dependency injection via psychon.',
            },
            {
              target: 'src/organa/mcp/**',
              from: 'src/organa/notion/**',
              message:
                'Organs cannot import from other organs. Use dependency injection via psychon.',
            },
          ],
        },
      ],

      // Force use of path aliases for cross-boundary imports
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*'],
              message:
                'Use path aliases for cross-boundary imports (e.g., @organa/mcp instead of ../../mcp).',
            },
            {
              group: ['**/internal/**', '**/internals/**', '**/private/**'],
              message: 'Cannot import from internal/private modules.',
            },
          ],
        },
      ],
    },
  },
  // Organa modules - Allow imports within the same organ
  {
    files: ['src/organa/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Psychon layer can import from any organ
  {
    files: ['src/index.ts', 'src/psychon/**/*.ts'],
    rules: {
      'import-x/no-restricted-paths': 'off',
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-internal-modules': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Entry point can import psychon
  {
    files: ['src/index.ts'],
    rules: {
      'import-x/no-internal-modules': 'off',
    },
  },
  // Test files can break boundaries but should maintain type safety
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-restricted-paths': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Config files (TS)
  {
    files: ['**/*.config.ts', 'eslint.config.ts', 'eslint.config.base.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
);

export default config;
