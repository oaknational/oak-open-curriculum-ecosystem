/**
 * ESLint Configuration for oak-sdk-codegen
 *
 * Applies strict Oak standards plus SDK boundary rules that prevent
 * generation from importing runtime SDK concerns (ADR-108).
 */

import { defineConfig } from 'eslint/config';
import oakStandards, {
  ignores,
  testRules,
  commonSettings,
  createSdkBoundaryRules,
} from '@oaknational/eslint-plugin-standards';
import type { Linter } from 'eslint';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = defineConfig(
  {
    ignores: [...ignores, 'dist/**', 'coverage/**', '*.log', '.turbo/**', 'test-cache/**'],
  },

  ...(oakStandards.configs!.strict as Linter.Config[]),

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    settings: {
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          projectService: true,
        },
      },
    },
  },

  {
    files: ['src/**/*.ts', 'code-generation/**/*.ts', 'vocab-gen/**/*.ts'],
    rules: {
      ...createSdkBoundaryRules('generation'),
    },
  },

  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/test-*.ts',
      '**/__tests__/**',
    ],
    rules: {
      ...testRules,
    },
  },

  // Code generators legitimately use Object.keys/values/entries to iterate
  // OpenAPI schema properties. 75 structural violations remain; refactoring
  // is out of scope for M1 (F33 progressive re-enablement). New code in
  // code-generation/ is still subject to SDK boundary rules above.
  {
    files: ['code-generation/**'],
    rules: {
      'no-restricted-properties': 'off',
      '@typescript-eslint/no-restricted-types': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'max-depth': 'off',
      complexity: 'off',
    },
  },

  // Vocab-gen serializer functions exceed structural limits (12 violations
  // across 6 files). Tests and new code are fully checked.
  {
    files: [
      'vocab-gen/generators/analysis-report-generator.ts',
      'vocab-gen/generators/misconception-graph-generator.ts',
      'vocab-gen/generators/nc-coverage-generator.ts',
      'vocab-gen/generators/synonym-miner.ts',
      'vocab-gen/generators/vocabulary-graph-generator.ts',
      'vocab-gen/vocab-gen.ts',
    ],
    rules: {
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      complexity: 'off',
    },
  },

  {
    files: ['src/generated/vocab/**'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },

  {
    files: ['src/types/generated/**'],
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-restricted-types': 'off',
      'no-restricted-properties': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-depth': 'off',
      complexity: 'off',
      'max-statements': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-irregular-whitespace': 'off',
      curly: 'off',
    },
  },

  {
    files: ['eslint.config.ts', 'vitest.config.ts', 'vitest.e2e.config.ts', 'tsup.config.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'import-x/no-named-as-default-member': 'off',
    },
  },
);

export default config;
