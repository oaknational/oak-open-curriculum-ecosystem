/**
 * ESLint Configuration for moria/mcp
 *
 * The Moria framework - architectural patterns and interfaces
 */

import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../../eslint.config.base.js';
import {
  moriaBoundaryRules,
  moriaTestConfigRules,
  commonSettings,
} from '../../../eslint-rules/index.js';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const rootTsProject = fileURLToPath(new URL('../../../tsconfig.lint.root.json', import.meta.url));
const repoRootDir = dirname(rootTsProject);

const config = tsEslintConfig(
  ...baseConfig,
  {
    ignores: ['dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  // Apply common settings to all TypeScript files
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
  },
  // Apply boundary rules to source files only (not tests or configs)
  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.test.ts', '**/*.spec.ts'],
    rules: moriaBoundaryRules,
  },
  // Test and spec files - allow dev dependencies
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: moriaTestConfigRules,
  },
  // Config files - allow dev dependencies
  {
    files: ['*.config.ts', 'eslint.config.ts', 'vitest.config.ts', 'tsup.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: moriaTestConfigRules,
  },
);

export default config;
