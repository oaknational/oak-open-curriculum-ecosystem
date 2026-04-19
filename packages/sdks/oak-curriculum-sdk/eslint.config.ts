/**
 * ESLint Configuration for oak-curriculum-sdk
 *
 * Applies strict Oak standards plus SDK boundary rules that prevent
 * deep imports into the generation workspace (ADR-108).
 */

import { defineConfig } from 'eslint/config';
import {
  configs,
  ignores,
  testRules,
  createImportResolverSettings,
  createSdkBoundaryRules,
} from '@oaknational/eslint-plugin-standards';

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
      'code-generation/*.mjs',
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
  ...configs.strict,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    settings: createImportResolverSettings({ project: thisDir }),
  },
  // SDK boundary rules: prevent deep imports into generation workspace (ADR-108)
  {
    files: ['src/**/*.ts'],
    rules: {
      ...createSdkBoundaryRules('runtime'),
    },
  },
  // ADR-162 observability-first: require structured emission in newly
  // exported async functions. Rule is path-scoped internally to apps/**
  // and packages/sdks/**. Initial severity `warn`; escalates to `error`
  // once Phase 2 of the observability restructure lands its first
  // emission sites.
  {
    files: ['src/**/*.ts'],
    rules: {
      '@oaknational/require-observability-emission': 'warn',
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
      '**/test-helpers/**',
      '**/__tests__/**',
    ],
    rules: {
      ...testRules,
    },
  },
  {
    files: ['src/mcp/ontology-data.ts', 'src/validation/types.ts'],
    rules: {
      'max-lines': 'off',
    },
  },
  {
    files: ['src/response-augmentation.ts'],
    rules: {
      '@typescript-eslint/no-restricted-types': 'off',
    },
  },
);

export default config;
