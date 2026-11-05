/**
 * ESLint Configuration for safe-path
 *
 * Path-containment guard: assert a candidate path resolves within a base directory.
 */

import {
  configs,
  coreBoundaryRules,
  createImportResolverSettings,
  defineConfigArray,
  ignores as globalIgnores,
  testRules,
} from '@oaknational/eslint-plugin-standards';
import globals from 'globals';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = defineConfigArray(
  {
    ignores: [...globalIgnores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  configs.strict,
  {
    // The owner's ruling of 2026-09-08 on `no-throw-statement`: off where the
    // throw debt lives (this workspace), error everywhere else and in every new
    // workspace; the migration waits for the merge-back into the upstream. The
    // ruling is quoted in the plugin's configs/recommended.ts; the
    // no-throw-remediation plan owns the migration.
    rules: { '@oaknational/no-throw-statement': 'off' },
  },
  {
    files: ['**/*.ts'],
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
  },
  {
    files: ['src/**/*.ts'],
    rules: coreBoundaryRules,
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
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
