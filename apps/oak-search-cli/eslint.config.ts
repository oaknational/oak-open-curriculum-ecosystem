/**
 * ESLint Configuration for Oak Open Curriculum Semantic Search
 *
 * Node.js library workspace — no React, no Next.js.
 */

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { globalIgnores } from 'eslint/config';
import { configs as tseslintConfigs, parser as tseslintParser } from 'typescript-eslint';
import {
  configs,
  createImportResolverSettings,
  defineConfigArray,
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

function createJavaScriptRuleOverrides(): Record<string, 'off'> {
  const overrides: Record<string, 'off'> = {};

  for (const config of configs.strict) {
    for (const ruleName in config.rules ?? {}) {
      if (ruleName.startsWith('@typescript-eslint/')) {
        overrides[ruleName] = 'off';
      }
    }
  }

  return overrides;
}

const javaScriptRuleOverrides = createJavaScriptRuleOverrides();

const eslintConfig = defineConfigArray(
  globalIgnores([...ignores, 'build/**', 'bulk-downloads/**', 'scripts/**/*.mjs']),

  // Use the recommended config from our standards plugin (includes TS, Prettier, Import-X)
  configs.strict,

  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        URL: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
      parserOptions: {
        program: null,
        project: false,
        projectService: false,
      },
    },
    rules: {
      ...javaScriptRuleOverrides,
      ...tseslintConfigs.disableTypeChecked.rules,
    },
  },

  {
    files: ['**/*.ts'],
    settings: createImportResolverSettings({ project: thisDir }),
  },

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
  // ADR-162 observability-first: require structured emission in newly
  // exported async functions. Rule is path-scoped internally to apps/**
  // and packages/sdks/**.
  {
    files: ['src/**/*.ts'],
    rules: {
      '@oaknational/require-observability-emission': 'error',
    },
  },
  // ADR-088 Result pattern + ADR-162 engineering-axis: preserve caught
  // error context when throwing new errors inside catch blocks.
  //  Enforcement surface matches the observability emitter
  // surface because both are the same trust-boundary class — apps +
  // SDK runtime entry points; packages/core/* and packages/libs/* are
  // leaf layers whose error ergonomics differ. ESLint built-in rule
  // (added in 9.35.0) supersedes the originally planned custom
  // `require-error-cause` rule — the built-in is a documented superset
  // covering missing cause, cause-mismatch, destructured loss, and
  // variable shadowing. `requireCatchParameter: true` forbids no-param
  // catch blocks so every caught error is available as a cause.
  // See ADR-162 History 2026-04-19 addendum for the re-scoping
  // rationale and the opt-out protocol.
  {
    files: ['src/**/*.ts'],
    rules: {
      'preserve-caught-error': ['error', { requireCatchParameter: true }],
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

  // Smoke tests are explicitly permitted real IO per ADR-161 (on-demand
  // pipeline, out of CI). The hermetic-test restrictions do not apply.
  {
    files: ['**/smoke-tests/**/*.test.ts', '**/*.smoke.test.ts'],
    rules: {
      'no-restricted-syntax': 'off',
      'no-restricted-properties': 'off',
    },
  },

  // Test-ceremony migration backlog — see
  // `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`.
  // Each entry is a known violation; delete as files migrate.
  {
    files: [
      // production-factory imports (not subject under test)
      'src/cli/shared/with-loaded-cli-env.unit.test.ts',
      'src/observability/cli-observability.unit.test.ts',
      // vi.mock family
      'src/adapters/hybrid-data-source.integration.test.ts',
      'src/lib/elastic-http.unit.test.ts',
    ],
    rules: {
      'no-restricted-properties': 'off',
    },
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

  // Static curriculum traversal data is intentionally exhaustive and
  // easier to review as a single source-of-truth table than split shards.
  {
    files: ['src/lib/indexing/curriculum-pattern-config.ts'],
    rules: {
      'max-lines': 'off',
    },
  },

  // Validation CLI keeps many orthogonal checks in one script so failures
  // are visible from a single execution path.
  {
    files: ['evaluation/validation/validate-ground-truth.ts'],
    rules: {
      'max-lines': 'off',
      'max-statements': 'off',
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
        projectService: true,
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
