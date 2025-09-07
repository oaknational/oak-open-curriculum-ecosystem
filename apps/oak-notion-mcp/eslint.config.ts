/**
 * ESLint Configuration for oak-notion-mcp
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
      ...appBoundaryRules,
      ...appArchitectureRules,
      'import-x/no-relative-parent-imports': 'error',
      'import-x/no-internal-modules': 'off',
    },
  },
  // New structure modules - Allow imports within the same area (tools/integrations)
  {
    files: ['src/tools/**/*.ts', 'src/integrations/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
  // General intra-package allowance for parent relatives across src/**
  {
    files: ['src/**/*.ts'],
    rules: {
      'import-x/no-relative-parent-imports': 'off',
    },
  },
  // App layer can import broadly within the package
  {
    files: ['src/index.ts', 'src/app/**/*.ts'],
    rules: {
      'import-x/no-restricted-paths': 'off',
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-internal-modules': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Entry point
  {
    files: ['src/index.ts'],
    rules: {
      'import-x/no-internal-modules': 'off',
    },
  },
  // Test files
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-restricted-paths': 'off',
      'import-x/no-internal-modules': 'off',
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
      'import-x/no-internal-modules': 'off',
    },
  },
);

export default config;
