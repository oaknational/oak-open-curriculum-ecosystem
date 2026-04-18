/**
 * ESLint Configuration for oak-search-sdk
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
    ignores: [...ignores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'],
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

  {
    files: ['src/**/*.ts'],
    rules: {
      ...createSdkBoundaryRules('search'),
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

  // Test-ceremony migration backlog — see
  // `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`.
  // Each entry is a known vi.mock-family violation; delete as files migrate.
  {
    files: [
      'src/admin/lifecycle-stage-promote.integration.test.ts',
      'src/admin/verify-doc-counts.integration.test.ts',
      'src/admin/lifecycle-lease-infra.unit.test.ts',
      'src/admin/lifecycle-cleanup.integration.test.ts',
      'src/admin/index-lifecycle-service.integration.test.ts',
      'src/admin/lifecycle-promote-validation.integration.test.ts',
      'src/admin/alias-operations.integration.test.ts',
      'src/create-search-sdk.integration.test.ts',
    ],
    rules: {
      'no-restricted-properties': 'off',
      'no-restricted-imports': 'off',
    },
  },
);

export default config;
