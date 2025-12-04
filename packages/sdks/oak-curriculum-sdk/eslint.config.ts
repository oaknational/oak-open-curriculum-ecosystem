/**
 * ESLint Configuration for oak-curriculum-sdk
 */

import { defineConfig } from 'eslint/config';
import oakStandards, {
  ignores,
  testRules,
  commonSettings,
} from '@oaknational/eslint-plugin-standards';
import type { Linter } from 'eslint';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = defineConfig(
  {
    ignores: [
      ...ignores,
      'dist/**',
      'coverage/**',
      '*.log',
      '.turbo/**',
      // Local entry shims (JS)
      'type-gen/*.mjs',
      // Examples
      'examples/**',

      // E2E script snippets not part of the TS project
      'e2e-tests/scripts/**',
      'test-cache/**',
      // Documentation
      'docs/**',
    ],
  },

  // Use recommended and strict configs from standards plugin
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
  // Test file rules
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
  // Rules for the type-gen code
  {
    files: ['type-gen/**'],
    rules: {
      'no-restricted-properties': 'off',
      '@typescript-eslint/no-restricted-types': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'max-depth': 'off',
      complexity: 'off',
    },
  },
  // Rules for the generated files
  {
    files: ['src/types/generated/**'],
    rules: {
      // Disable until quality gates green, then fix.
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
      // Temporarily disabled rules for generated code -- some are probably permanent, some are just during MVP
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-depth': 'off',
      complexity: 'off',
      'max-statements': 'off',
      // Most likely permanent rules
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-irregular-whitespace': 'off',
      curly: 'off',
    },
  },
  // Rules for the generated files
  {
    files: ['src/types/generated/search/**'],
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
    },
  },
  // Allow the type helper file to use restricted APIs internally
  {
    files: ['src/types/helpers.ts'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },

  // Config files
  {
    files: ['eslint.config.ts', 'vitest.config.ts', 'vitest.config.e2e.ts', 'tsup.config.ts'],
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
