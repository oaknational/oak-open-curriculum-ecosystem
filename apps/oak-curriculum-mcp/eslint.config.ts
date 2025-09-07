/**
 * ESLint Configuration for oak-curriculum-mcp
 *
 * Application package ESLint configuration
 */

import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../eslint.config.base';
import {
  appBoundaryRules,
  appArchitectureRules,
  commonSettings,
} from '../../eslint-rules/index.js';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const rootTsProject = fileURLToPath(new URL('../../tsconfig.lint.root.json', import.meta.url));
const repoRootDir = dirname(rootTsProject);

const config = tsEslintConfig(
  ...baseConfig,
  {
    ignores: ['dist/**', '*.log', '.turbo/**', '.logs/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: rootTsProject,
        tsconfigRootDir: repoRootDir,
      },
    },
    settings: {
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          project: rootTsProject,
        },
      },
    },
    rules: {
      'import-x/no-relative-parent-imports': 'off',
      ...appBoundaryRules,
      ...appArchitectureRules,
      '@typescript-eslint/no-restricted-types': [
        'off',
        {
          types: {
            unknown: {
              message:
                'Avoid `unknown`. Prefer a specific union, a domain model, or a generic parameter (e.g. <T>), so callers/implementations have a concrete type. The only exception is incoming data from network requests, or data read from files, which should be validated.',
            },
          },
        },
      ],
    },
  },
  // Remove broad allowances; rely on package imports and local relative paths only
  // Test files can break boundaries but should maintain type safety
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-restricted-paths': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Config files (TS)
  {
    files: ['**/*.config.ts', 'eslint.config.ts', 'eslint.config.base.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
);

export default config;
