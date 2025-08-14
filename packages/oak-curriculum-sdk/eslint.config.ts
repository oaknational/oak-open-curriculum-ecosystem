/**
 * ESLint Configuration for oak-curriculum-sdk
 *
 * Standard SDK package configuration - no biological architecture enforcement
 */

import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../eslint.config.base';
import { commonSettings } from '../../eslint-rules/index.js';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = tsEslintConfig(
  ...baseConfig,
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '*.log',
      '.turbo/**',
      // Examples
      'examples/**',
      // Generated files
      'src/types/generated/**',
      'test-cache/**',
      // Documentation
      'docs/**',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
        tsconfigRootDir: thisDir,
      },
    },
    settings: {
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          project: './tsconfig.lint.json',
        },
      },
    },
  },
  // Config files
  {
    files: ['eslint.config.ts', 'vitest.config.ts', 'vitest.config.e2e.ts', 'tsup.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
  },
);

export default config;
