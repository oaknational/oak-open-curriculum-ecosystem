/**
 * ESLint Configuration for oak-notion-mcp
 *
 * The Notion phenotype - enforces biological architecture pattern
 */

import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../../eslint.config.base';
import {
  psychaBoundaryRules,
  psychonArchitectureRules,
  commonSettings,
} from '../../../eslint-rules/index.js';

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
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          project: './tsconfig.lint.json',
        },
      },
    },
    rules: {
      // Enforce module boundaries
      'import-x/no-relative-parent-imports': 'off',
      ...psychaBoundaryRules,
      ...psychonArchitectureRules,
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
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
);

export default config;
