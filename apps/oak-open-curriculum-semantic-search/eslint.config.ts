/**
 * ESLint Configuration for Oak Open Curriculum Semantic Search
 */

import type { ConfigArray } from 'typescript-eslint';
import { ignores, tsRules } from '../../eslint.config.base';
import { appBoundaryRules, appArchitectureRules } from '../../eslint-rules/index.js';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import eslint from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { importX } from 'eslint-plugin-import-x';

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
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  prettierRecommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // App architecture & boundaries
      ...appBoundaryRules,
      ...appArchitectureRules,
      ...tsRules,
    },
  },
];

export default config;
