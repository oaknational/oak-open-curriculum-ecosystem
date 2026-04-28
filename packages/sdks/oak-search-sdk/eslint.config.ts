/**
 * ESLint Configuration for oak-search-sdk
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
    ignores: [...ignores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },

  // Use recommended and strict configs from standards plugin
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

  {
    files: ['src/**/*.ts'],
    rules: {
      ...createSdkBoundaryRules('search'),
    },
  },
  // ADR-162 observability-first: require structured emission in newly
  // exported async functions. Rule is path-scoped internally to apps/**
  // and packages/sdks/**.
  // once Phase 2 of the observability restructure lands its first
  // emission sites.
  {
    files: ['src/**/*.ts'],
    rules: {
      '@oaknational/require-observability-emission': 'error',
    },
  },
  // ADR-088 Result pattern + ADR-162 engineering-axis: preserve caught
  // error context when throwing new errors inside catch blocks.
  //  Enforcement surface matches the observability emitter
  // surface because both are the same trust-boundary class — apps +
  // SDK runtime entry points; packages/core/* and packages/libs/* are
  // leaf layers whose error ergonomics differ. ESLint built-in rule
  // (added in 9.35.0) supersedes the originally planned custom
  // `require-error-cause` rule — the built-in is a documented superset
  // covering missing cause, cause-mismatch, destructured loss, and
  // variable shadowing. `requireCatchParameter: true` forbids no-param
  // catch blocks so every caught error is available as a cause.
  // See ADR-162 History 2026-04-19 addendum for the re-scoping
  // rationale and the opt-out protocol.
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
