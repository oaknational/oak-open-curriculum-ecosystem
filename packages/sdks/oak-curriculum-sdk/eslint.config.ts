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
  // ADR-088 Result pattern + ADR-162 engineering-axis: preserve caught
  // error context when throwing new errors inside catch blocks. Enforced
  // at `error` severity (per `warning-severity-is-off-severity`: any
  // rule at `warn` is effectively off — a rule either matters or
  // doesn't). Enforcement surface matches the observability emitter
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
