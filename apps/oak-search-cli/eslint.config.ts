/**
 * ESLint Configuration for Oak Open Curriculum Semantic Search
 *
 * Node.js library workspace — no React, no Next.js.
 */

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { defineConfig, globalIgnores } from 'eslint/config';
import type { Linter } from 'eslint';
import { parser as tseslintParser } from 'typescript-eslint';
import {
  configs,
  ignores,
  testRules,
  appBoundaryRules,
  appArchitectureRules,
} from '@oaknational/eslint-plugin-standards';

const thisDir = dirname(fileURLToPath(import.meta.url));

const eslintConfig = defineConfig(
  globalIgnores([
    ...ignores,
    'build/**',
    'vitest.config.ts',
    'vitest.e2e.config.ts',
    'bulk-downloads/**',
    'scripts/**/*.mjs',
  ]),

  // Use the recommended config from our standards plugin (includes TS, Prettier, Import-X)
  ...configs.strict,

  // TypeScript rules for source files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      ...appBoundaryRules,
      ...appArchitectureRules,
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],
    },
  },

  // Test file rules
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/test-*.ts', '**/__tests__/**'],
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- testRules types don't match defineConfig's strict expectations
    rules: testRules as unknown as Linter.RulesRecord,
  },

  // Evaluation scripts - same standards as src/ but allow console.log
  {
    files: ['evaluation/**/*.ts'],
    ignores: ['evaluation/**/*.test.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      // Inherit all source file rules
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],
      // Allow console.log for evaluation scripts
      'no-console': 'off',
    },
  },

  // Operations scripts - SAME standards as src/, MUST use logger
  // Exception: ingestion/ is CLI tooling (like utilities), so console.log allowed
  {
    files: ['operations/**/*.ts'],
    ignores: ['operations/ingestion/**/*.ts', 'operations/utilities/**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      // Inherit all source file rules
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],
      // NO console.log - MUST use logger
      'no-console': 'error',
    },
  },

  // Operations/ingestion - CLI tools that output to stdout
  {
    files: ['operations/ingestion/**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      // Same quality standards as src/
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],
      // Allow console.log for CLI output
      'no-console': 'off',
    },
  },

  // Operations utilities - allow console.log for simple exports
  {
    files: ['operations/utilities/**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      // Simpler rules for utilities
      complexity: ['error', { max: 8 }],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 100],
      // Allow console.log for simple utilities
      'no-console': 'off',
    },
  },

  // Code generation scripts — inherently large with many statements.
  // Structural limits are relaxed but type-safety rules remain enforced.
  {
    files: ['ground-truths/generation/**/*.ts'],
    ignores: ['ground-truths/generation/**/*.test.ts'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      complexity: 'off',
      'no-console': 'off',
    },
  },

  // ──────────────────────────────────────────────────
  // process.env access restriction
  // Composition roots pass process.env to loadRuntimeConfig() once.
  // Everything else accepts config as a parameter (ADR-078).
  // ──────────────────────────────────────────────────
  {
    files: ['**/*.ts'],
    ignores: [
      'src/lib/env.ts',
      'bin/**',
      'scripts/**',
      'operations/**',
      'evaluation/**',
      'smoke-test*.ts',
      'smoke-tests/**',
      'src/lib/elasticsearch/setup/cli.ts',
      'src/lib/elasticsearch/setup/ingest-live.ts',
      'src/cli/shared/pass-through.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: ['MemberExpression', '[object.name="process"]', '[property.name="env"]'].join(
            '',
          ),
          message:
            'Direct process.env access is forbidden. ' +
            'Use loadRuntimeConfig() at composition roots, ' +
            'or accept config as a parameter (ADR-078).',
        },
      ],
    },
  },
);

export default eslintConfig;
