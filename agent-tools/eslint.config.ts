import globals from 'globals';
import {
  configs,
  createImportResolverSettings,
  defineConfigArray,
  ignores as globalIgnores,
  testRules,
} from '@oaknational/eslint-plugin-standards';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
    files: ['**/*.{ts,tsx}'],
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
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      ...testRules,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'src/**/__tests__/**/*.{ts,tsx}',
      'src/typescript-estate/file-classification.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/file-classification-engine.js'],
              message:
                'The prepared classification engine is restricted to its validated facade and colocated tests.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['eslint.config.ts', 'vitest.config.ts'],
    languageOptions: {
      parserOptions: {
        project: wsTsProject,
        tsconfigRootDir: thisDir,
      },
    },
  },
);

export default config;
