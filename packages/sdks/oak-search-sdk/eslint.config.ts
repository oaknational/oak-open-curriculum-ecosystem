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
);

export default config;
