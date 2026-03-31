/**
 * ESLint Configuration for Oak Open Curriculum Semantic Search
 *
 * Node.js library workspace — no React, no Next.js.
 */

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { defineConfig, globalIgnores } from 'eslint/config';
import { parser as tseslintParser } from 'typescript-eslint';
import {
  configs,
  ignores,
  testRules,
  appArchitectureRules,
} from '@oaknational/eslint-plugin-standards';
import {
  adminCliBoundaryRules,
  mixedCliBoundaryRules,
  readOnlyCliBoundaryRules,
} from './eslint.boundary-rules';

const thisDir = dirname(fileURLToPath(import.meta.url));

const eslintConfig = defineConfig(
  globalIgnores([...ignores, 'build/**', 'bulk-downloads/**', 'scripts/**/*.mjs']),

  // Use the recommended config from our standards plugin (includes TS, Prettier, Import-X)
  ...configs.strict,

  // TypeScript rules for source files
  {
    files: ['**/*.ts'],
    ignores: [
      '**/*.config.ts',
      'eslint.config.ts',
      'vitest.config.ts',
      'vitest.e2e.config.ts',
      'vitest.smoke.config.ts',
      'vitest.experiment.config.ts',
    ],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      ...appArchitectureRules,
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],
    },
  },

  // Enforce SDK capability boundaries (ADR-134)
  {
    files: ['src/**/*.ts'],
    // Default policy for non-admin app code.
    rules: {
      ...readOnlyCliBoundaryRules,
    },
  },
  {
    files: ['src/cli/admin/**/*.ts', 'src/lib/indexing/**/*.ts', 'src/adapters/**/*.ts'],
    // Privileged subtrees override default read-only policy.
    rules: {
      ...adminCliBoundaryRules,
    },
  },
  {
    files: ['evaluation/**/*.ts', 'operations/**/*.ts'],
    // Evaluation/operations may orchestrate read and admin surfaces, but
    // still must not use root or internal SDK imports.
    rules: {
      ...mixedCliBoundaryRules,
    },
  },

  // Test file rules
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/test-*.ts', '**/__tests__/**'],
    rules: { ...testRules },
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
      ...mixedCliBoundaryRules,
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
      ...mixedCliBoundaryRules,
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
      ...mixedCliBoundaryRules,
      // Same quality standards as src/
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],
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
      ...mixedCliBoundaryRules,
      // Simpler rules for utilities
      complexity: ['error', { max: 8 }],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 100],
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

  {
    files: ['scripts/**/*.ts', 'smoke-tests/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: [
      '**/*.config.ts',
      'eslint.config.ts',
      'vitest.config.ts',
      'vitest.e2e.config.ts',
      'vitest.smoke.config.ts',
      'vitest.experiment.config.ts',
    ],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['vitest.config.ts', 'vitest.e2e.config.ts'],
        },
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      'import-x/no-relative-packages': 'off',
      'import-x/no-relative-parent-imports': 'off',
      'max-lines': 'off',
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
      'src/lib/elasticsearch/setup/ingest.ts',
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
