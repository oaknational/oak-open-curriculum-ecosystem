/**
 * ESLint Configuration for Oak Open Curriculum Semantic Search
 */

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';

import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { importX } from 'eslint-plugin-import-x';
import type { ConfigArray } from 'typescript-eslint';

import { ignores, tsRules } from '../../eslint.config.base';
import { appBoundaryRules, appArchitectureRules } from '../../eslint-rules/index.js';

const thisDir = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({ baseDirectory: thisDir });

const config: ConfigArray = [
  {
    ignores: [...ignores, '.next/**'],
  },
  ...compat.config({
    // Extend canonical Next configs last so detection works and rules are applied
    extends: ['next/core-web-vitals', 'next/typescript'],
    settings: { next: { rootDir: '.' } },
  }),
  eslint.configs.recommended,
  prettierRecommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        project: './tsconfig.lint.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      // App architecture & boundaries
      ...appBoundaryRules,
      ...appArchitectureRules,
      ...tsRules,
    },
  },
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
];

export default config;
