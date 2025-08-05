/**
 * ESLint Configuration - Biological Architecture Enforcement
 *
 * This configuration enforces the biological architecture pattern where:
 * - Organa (organs) are bounded contexts that cannot import from each other
 * - Chora (fields) are cross-cutting infrastructure available everywhere
 * - Psychon (soul) is the wiring layer that can orchestrate everything
 * - All cross-boundary imports must use public APIs (index.ts files)
 *
 * For detailed architecture documentation, see:
 * - docs/architecture-overview.md - High-level overview and import rules
 * - docs/architecture/architectural-decisions/020-biological-architecture.md - Design rationale
 * - docs/naming.md - Complete hierarchy and Greek nomenclature
 */

import eslint from '@eslint/js';
import {
  config as tsEslintConfig,
  configs as tsEslintConfigs,
  parser as tsEslintParser,
  type Config,
} from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { importX } from 'eslint-plugin-import-x';

const config: Config = tsEslintConfig(
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '**/*.d.ts',
      '.eslintrc.js',
      'commitlint.config.js',
    ],
  },
  eslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...tsEslintConfigs.strictTypeChecked,
  ...tsEslintConfigs.stylisticTypeChecked,
  prettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // Types
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',

      // Complexity. These rules are intended to minimise cognitive load and enforce good code design.
      complexity: ['error', { max: 8 }], // Cyclomatic complexity, lowers cognitive load
      'max-depth': ['error', 3], // Max levels of nesting, lowers cognitive load
      'max-statements': ['error', 20], // Max statements per function, enforces single responsibility principle
      'max-lines-per-function': ['error', 50], // Target 50 (1 screen height), enforces single responsibility principle, lowers cognitive load
      'max-lines': ['error', 190], // Requires well defined boundaries of responsibility

      // General good practices
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-constant-condition': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      'consistent-return': 'off', // Note: you must disable the base rule as it can report incorrect errors
      '@typescript-eslint/consistent-return': 'error',

      // Import rules for tree shaking
      'import-x/no-namespace': 'error', // Prevents import * as something

      // Prevent export * from 'module' for better tree shaking
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:
            'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
        },
      ],

      'import-x/no-cycle': ['error'], // Prevent circular dependencies, they are a symptom of weakening boundaries
      'import-x/no-useless-path-segments': ['error'], // Reduce confused import paths

      // Enforce module boundaries - but allow cross-chora imports as they're architecturally correct
      'import-x/no-relative-parent-imports': 'off', // Turned off - too crude for our architecture

      // Biological Architecture Enforcement
      // See: docs/architecture-overview.md#architectural-boundaries
      // See: docs/architecture/architectural-decisions/020-biological-architecture.md
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            // Organa isolation - organs cannot import from other organs
            {
              target: 'src/organa/notion/**',
              from: 'src/organa/mcp/**',
              message:
                'Organs cannot import from other organs. Use dependency injection via psychon.',
            },
            {
              target: 'src/organa/mcp/**',
              from: 'src/organa/notion/**',
              message:
                'Organs cannot import from other organs. Use dependency injection via psychon.',
            },
            // Chorai cannot import from organa (infrastructure doesn't know business logic)
            {
              target: 'src/chora/**',
              from: 'src/organa/**',
              message: 'Chorai (infrastructure) cannot import from organa (business logic).',
            },
          ],
        },
      ],

      // RULE 1: Prevent deep imports beyond public APIs
      // See: docs/architecture-overview.md#import-rules
      // All cross-boundary imports must use public APIs (index.ts files)
      // NOTE: Temporarily disabled due to complexity of configuring for biological architecture
      // Architectural boundaries are enforced through documentation and code reviews
      'import-x/no-internal-modules': 'off',

      // RULE 2: Force use of path aliases for cross-boundary imports
      // See: docs/architecture-overview.md#cross-boundary-imports
      // Path aliases enforce architectural boundaries and prevent reaching through layers
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Block relative imports that go up more than one level
              group: ['../../*'],
              message:
                'Use path aliases for cross-boundary imports (e.g., @chora/stroma instead of ../../stroma).',
            },
            {
              // Block any internal/private paths
              group: ['**/internal/**', '**/internals/**', '**/private/**'],
              message: 'Cannot import from internal/private modules.',
            },
          ],
        },
      ],
    },
  },
  // Organa modules - Allow imports within the same organ
  {
    files: ['src/organa/**/*.ts'],
    rules: {
      // Within an organ, components can import from each other
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Chora modules - Cross-cutting fields that flow through everything
  // See: docs/architecture-overview.md#chora-fields
  // Chorai can import from other chorai but only via public APIs
  {
    files: ['src/chora/**/*.ts'],
    rules: {
      // Allow cross-chora imports - these are architecturally correct
      'import-x/no-relative-parent-imports': 'off',
      // Turn off the cross-boundary restriction for cross-chora
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Psychon layer (wiring) can import from any organ/chora
  // See: docs/architecture-overview.md#psychon-layer
  // The psychon is the soul that brings the organism to life by wiring all components
  {
    files: [
      'src/index.ts',
      'src/psychon/**/*.ts',
      'packages/*/src/index.ts',
      'packages/*/src/psychon/**/*.ts',
    ],
    rules: {
      // Turn off path restrictions (can import from any organ/chora)
      'import-x/no-restricted-paths': 'off',
      // Turn off parent import restrictions for psychon
      'import-x/no-relative-parent-imports': 'off',
      // Allow psychon to reach into internals for wiring
      'import-x/no-internal-modules': 'off',
      // Turn off pattern restrictions
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Entry point can import psychon
  {
    files: ['src/index.ts'],
    rules: {
      'import-x/no-internal-modules': 'off',
    },
  },
  // Eidola (test phantoms) can access internals for mocking
  // See: docs/architecture-overview.md#testing-infrastructure
  // Test phantoms mirror the living system and need access to internals for proper mocking
  {
    files: ['src/chora/eidola/**/*.ts'],
    rules: {
      'import-x/no-restricted-paths': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
      'import-x/no-internal-modules': 'off',
    },
  },
  // Test files
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/test-*.ts', '**/__tests__/**'],
    rules: {
      // Allow test files to import from parent directories for testing utilities
      'import-x/no-relative-parent-imports': 'off',
      // Tests can break architectural boundaries for testing
      'import-x/no-restricted-paths': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
      // The outer arrow functions in test files can get huge, but the inner functions
      // should be small, one solution might be to improve encapsulation and separation
      // of concerns in the file under test, forcing it to be broken down into smaller
      // files and therefore smaller test files as well.
      // Vitest does support more than one top-level define(), so maybe we just
      // need to break with Jest compatibility and use that.
      'max-lines': ['error', 700],
      'max-lines-per-function': ['error', 1000],
    },
  },
  // Config files (JS)
  {
    files: ['**/*.config.js', '.releaserc.js'],
    extends: [tsEslintConfigs.disableTypeChecked],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  // Script files
  {
    files: ['**/scripts/*.ts'],
    rules: {
      'max-lines': ['error', 300],
    },
  },
  // This file
  {
    files: ['eslint.config.ts'],
    rules: {
      'max-lines': ['error', 400],
    },
  },
);

export default config;
