/**
 * ESLint Configuration for oak-curriculum-sdk
 */

import { defineConfig } from 'eslint/config';
import { baseConfig } from '../../../eslint.config.base';
import { commonSettings } from '../../../eslint-rules/index.js';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = defineConfig(
  ...baseConfig,
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '*.log',
      '.turbo/**',
      // Local entry shims (JS)
      'scripts/*.mjs',
      // Examples
      'examples/**',

      // E2E script snippets not part of the TS project
      'e2e-tests/scripts/**',
      'test-cache/**',
      // Documentation
      'docs/**',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
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
    rules: {
      // Disallow specific Object.* properties, they lose type information
      'no-restricted-properties': [
        'error',
        {
          object: 'Object',
          property: 'keys',
          message: 'Use typeSafeKeys<T>() for typed keys.',
        },
        {
          object: 'Object',
          property: 'values',
          message: 'Use typeSafeValues<T>() for typed values.',
        },
        {
          object: 'Object',
          property: 'entries',
          message: 'Use typeSafeEntries<T>() for typed entries.',
        },
        {
          object: 'Object',
          property: 'fromEntries',
          message: 'Use typeSafeFromEntries<K,V>().',
        },
        {
          object: 'Object',
          property: 'getOwnPropertyNames',
          message: 'Use typeSafeOwnKeys<T>() if you truly need all own keys.',
        },
        {
          object: 'Object',
          property: 'getOwnPropertySymbols',
          message: 'Use typeSafeOwnKeys<T>() if you truly need all own keys.',
        },

        // Disallow Reflect.* methods for key/value access, they lose type information
        {
          object: 'Reflect',
          property: 'get',
          message: 'Prefer typed property access or typeSafeGet().',
        },
        {
          object: 'Reflect',
          property: 'set',
          message: 'Prefer typed property assignment or typeSafeSet().',
        },
        {
          object: 'Reflect',
          property: 'has',
          message: 'Prefer the `in` operator or typeSafeHas().',
        },
        {
          object: 'Reflect',
          property: 'ownKeys',
          message: 'Use typeSafeOwnKeys<T>() for a typed result.',
        },
      ],
    },
  },
  // Rules for the type-gen code
  {
    files: ['scripts/typegen/**'],
    rules: {
      'no-restricted-properties': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'max-depth': 'off',
      complexity: 'off',
    },
  },
  // Rules for the generated files
  {
    files: ['src/types/generated/**'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-depth': 'off',
      complexity: 'off',
      // Generated code: relax strictness to avoid busywork on emitted text
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      'no-irregular-whitespace': 'off',
      'no-restricted-properties': 'off',
      'max-statements': 'off',
    },
  },
  // Allow the type helper file to use restricted APIs internally
  {
    files: ['src/types/helpers.ts'],
    rules: {
      'no-restricted-properties': 'off',
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
