/**
 * Base ESLint Configuration - Shared across all workspaces
 *
 * This configuration contains rules that apply to all workspaces.
 * Workspace-specific rules should be added in their own eslint.config.js files.
 */

import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import { configs as tsEslintConfigs, parser as tsEslintParser } from 'typescript-eslint';
import eslint from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';

export const ignores = [
  'dist/',
  'node_modules/',
  'coverage/',
  '**/*.d.ts',
  'commitlint.config.js',
  '**/tsup.config.ts',
  'reference/',
  'research/',
  // Ignore ephemeral bundled config artifacts (e.g., tsup.config.bundled_*.mjs)
  '**/tsup.config.*',
  '**/*.bundled_*.mjs',
  // Generated TSDoc files
  '**/docs/_typedoc_src/**',
  '**/docs/api/',
  '**/docs/api-md/',
];

export const baseRules: readonly Linter.Config[] = [
  eslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...tsEslintConfigs.strictTypeChecked,
  ...tsEslintConfigs.stylisticTypeChecked,
  prettierRecommended,
];

/**
 * @todo move to eslint-rules
 */
export const tsRules: Linter.RulesRecord = {
  // Types
  '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true, ignoreRestArgs: false }],
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'error',
  curly: 'error',
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    {
      assertionStyle: 'never',
    },
  ],
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/no-restricted-types': [
    'error',
    {
      types: {
        // This is a complicated way of saying `any` for objects
        'Record<string, unknown>': {
          message:
            'Avoid Record<string, unknown>. Use an existing internal or library type where possible. If you are working on the Oak Curriculum SDK or MCP server, use a type and type guard derived from the compile time data structures packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema.',
        },

        // Common variants you might also want to block
        'Record<string, undefined>': {
          message:
            'Avoid Record<string, undefined>. Use an existing internal or library type where possible. If keys are optional, prefer Partial. If you are working on the Oak Curriculum SDK or MCP server, use a type and type guard derived from the compile time data structures packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema.',
        },
        'Readonly<Record<string, undefined>>': {
          message:
            'Avoid Readonly<Record<string, undefined>>. Use an existing internal or library type where possible. If you are working on the Oak Curriculum SDK or MCP server, use a type and type guard derived from the compile time data structures packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema.',
        },
        'Record<PropertyKey, undefined>': {
          message:
            'Avoid Record<PropertyKey, undefined>. Use an existing internal or library type where possible. If you are working on the Oak Curriculum SDK or MCP server, use a type and type guard derived from the compile time data structures packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema.',
        },
      },
    },
  ],

  // Type imports and exports
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/consistent-type-exports': 'error',

  // Complexity
  complexity: ['error', { max: 8 }],
  'max-depth': ['error', 3],
  'max-statements': ['error', 20],
  'max-lines-per-function': ['error', 50],
  // Reduce to 150, encourage collections of small, focused files
  'max-lines': ['error', 250],

  // To turn back on
  'no-undef': 'off',

  // To investigate turning back on
  'consistent-return': 'off',

  // General good practices
  'no-empty': 'error',
  'no-empty-function': 'error',
  'no-constant-condition': 'error',
  '@typescript-eslint/no-deprecated': 'error',
  '@typescript-eslint/consistent-return': 'error',

  // Import rules for tree shaking
  'import-x/no-namespace': 'error',
  'import-x/no-cycle': ['error'],
  'import-x/no-useless-path-segments': ['error'],
  'import-x/no-named-as-default': 'error',

  // Improved dependency management
  // 'import-x/no-extraneous-dependencies': 'error',
  // 'no-internal-modules': 'error',

  // Prevent export * for better tree shaking
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ExportAllDeclaration',
      message:
        'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
    },
  ],
};

/**
 * Test file rules
 *
 * @todo move to eslint-rules
 */
export const testRules: Linter.RulesRecord = {
  'max-lines': ['error', 700],
  'max-lines-per-function': ['error', 1000],
  '@typescript-eslint/consistent-type-assertions': [
    'off',
    {
      assertionStyle: 'as',
    },
  ],
  '@typescript-eslint/no-restricted-types': 'off',
  '@typescript-eslint/unbound-method': 'off',
  'import-x/no-named-as-default-member': 'off',
};

export const baseConfig = defineConfig(
  {
    ignores,
  },
  ...baseRules,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        projectService: true,
      },
      /**
       * @todo the code base is supposed to be edge compatible, so we need to remove these globals, move the Node reliant code to a specific space, and add the Node globals there
       */
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: tsRules,
  },
  // Test files - common rules
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/test-*.ts',
      '**/__tests__/**',
    ],
    rules: {
      ...testRules,
    },
  },
  // Generated types
  {
    files: ['**/src/types/generated/**'],
    rules: {
      curly: 'off',
    },
  },
  // Config files - allow default project service to avoid per-package tsconfig coupling
  {
    files: ['**/*.config.ts', '**/eslint.config.ts', 'eslint.config.base.ts'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        projectService: true,
        allowDefaultProject: true,
      },
    },
  },
);
