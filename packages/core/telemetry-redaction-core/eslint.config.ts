/**
 * ESLint configuration for the runtime-agnostic telemetry redaction core.
 *
 * @remarks Mirrors `@oaknational/observability` precisely; this workspace
 * sits alongside it as a sibling `packages/core/` library. The
 * zero-`@sentry/*`-imports invariant is enforced at test time (structural
 * scan) rather than via an ESLint rule because the restriction is
 * workspace-scoped and better proved at the file-contents level than at
 * the config level.
 */

import { defineConfig } from 'eslint/config';
import {
  configs,
  coreBoundaryRules,
  createImportResolverSettings,
  ignores as globalIgnores,
  testRules,
} from '@oaknational/eslint-plugin-standards';
import globals from 'globals';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = defineConfig(
  {
    ignores: [...globalIgnores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  ...configs.strict,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        projectService: false,
        project: wsTsProject,
        tsconfigRootDir: thisDir,
      },
    },
    settings: createImportResolverSettings({ project: wsTsProject }),
    rules: coreBoundaryRules,
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        projectService: false,
        project: wsTsProject,
        tsconfigRootDir: thisDir,
      },
    },
    settings: createImportResolverSettings({ project: wsTsProject }),
    rules: testRules,
  },
  {
    files: ['*.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      'import-x/no-relative-packages': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
);

export default config;
