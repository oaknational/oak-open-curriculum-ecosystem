/**
 * ESLint Configuration for storage library
 *
 * Storage helpers for multi-runtime support
 */

import { defineConfig } from 'eslint/config';
import { baseConfig } from '../../../eslint.config.base';
import {
  createLibBoundaryRules,
  getOtherLibs,
  commonSettings,
} from '../../../eslint-rules/index.js';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = defineConfig(
  ...baseConfig,
  {
    ignores: ['dist/**', 'coverage/**', '*.log', '.turbo/**', '.storage/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: wsTsProject,
        tsconfigRootDir: thisDir,
      },
    },
    settings: {
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          project: wsTsProject,
        },
      },
    },
    rules: createLibBoundaryRules('storage', getOtherLibs('storage')),
  },
  // Config files
  {
    files: ['eslint.config.ts', 'vitest.config.ts', 'tsup.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
  },
);

export default config;
