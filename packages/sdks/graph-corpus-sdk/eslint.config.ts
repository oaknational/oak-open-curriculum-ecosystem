/**
 * ESLint Configuration for graph-corpus-sdk
 *
 * Oak's typed corpus-adapter SDK. Applies strict Oak standards plus
 * SDK runtime boundary rules (ADR-108) and the SDK observability /
 * preserve-caught-error rules (ADR-162, ADR-088).
 */

import {
  configs,
  defineConfigArray,
  ignores,
  testRules,
  createImportResolverSettings,
  createSdkBoundaryRules,
} from '@oaknational/eslint-plugin-standards';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = defineConfigArray(
  {
    ignores: [
      ...ignores,
      'dist/**',
      'coverage/**',
      '*.log',
      '.turbo/**',
      // External-data file convention (`*.external-data.ts`): a faithful
      // snapshot of an external source, not authored code. Code-quality rules
      // such as max-lines are a category error for it; the loader validates it
      // strictly through `EefToolkitSchema` at the boundary, and type-check +
      // prettier still apply. Matched by pattern (not path) so it survives file
      // moves; see the external-data convention in
      // docs/governance/sonar-disposition-policy.md §Duplications.
      'src/**/*.external-data.ts',
    ],
  },

  configs.strict,

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

  // SDK runtime boundary rules (ADR-108): block deep imports into the
  // generation workspace; permit single-level subpath exports only.
  {
    files: ['src/**/*.ts'],
    rules: {
      ...createSdkBoundaryRules('runtime'),
    },
  },

  // ADR-162 observability-first: require structured emission in newly
  // exported async functions. Rule is path-scoped internally to apps/**
  // and packages/sdks/**.
  {
    files: ['src/**/*.ts'],
    rules: {
      '@oaknational/require-observability-emission': 'error',
    },
  },

  // ADR-088 Result pattern + ADR-162 engineering-axis: preserve caught
  // error context when throwing new errors inside catch blocks. The
  // enforcement surface matches the observability emitter surface
  // because both are the same trust-boundary class — apps + SDK
  // runtime entry points; packages/core/* and packages/libs/* are leaf
  // layers whose error ergonomics differ.
  {
    files: ['src/**/*.ts'],
    rules: {
      'preserve-caught-error': ['error', { requireCatchParameter: true }],
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
);

export default config;
