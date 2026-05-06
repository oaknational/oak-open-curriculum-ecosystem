import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import { importX } from 'eslint-plugin-import-x';
import sonarjs from 'eslint-plugin-sonarjs';
import tsdocPlugin from 'eslint-plugin-tsdoc';

import { oakPlugin } from '../plugin.js';

/**
 * Shared plugin registration for the `@oaknational` namespace.
 *
 * This wires the same plugin definition that `src/index.ts` exports so the
 * packaged rule inventory and the rules available through
 * `configs.recommended` cannot drift apart.
 *
 * `require-observability-emission` is registered here (rule available)
 * but not activated in the recommended rule set. Per ADR-162 Phase 5
 * acceptance, each `apps/*` and `packages/sdks/*` workspace enables the
 * rule at `warn` in its own flat config. Preset-level activation is
 * deliberately avoided so the rule never fires outside its intended scope.
 */
/**
 * Restricted types shared between recommended and strict configs.
 *
 * Strict config spreads this and adds FORBIDDEN-prefixed overrides
 * plus strict-only additions. Adding a type here automatically
 * includes it in strict — no duplication needed.
 */
export const RECOMMENDED_RESTRICTED_TYPES = {
  'Record<string, unknown>': {
    message:
      'Avoid Record<string, unknown>. Use an existing internal or library type where possible.',
  },
  'Record<string, undefined>': {
    message:
      'Avoid Record<string, undefined>. Use an existing internal or library type where possible. If keys are optional, prefer Partial.',
  },
  'Readonly<Record<string, undefined>>': {
    message:
      'Avoid Readonly<Record<string, undefined>>. Use an existing internal or library type where possible.',
  },
  'Record<PropertyKey, undefined>': {
    message:
      'Avoid Record<PropertyKey, undefined>. Use an existing internal or library type where possible.',
  },
} as const;

export const recommended = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  // Full `sonarjs.configs.recommended` activation is tracked by the
  // sonarjs-activation-and-sonarcloud-backlog plan in
  // .agent/plans/architecture-and-infrastructure/current/ — flip the
  // entry below to `sonarjs.configs.recommended` when the plan is in its
  // GREEN phase. Until then, keep only the Quality-Gate remediation rules
  // active so local lint mirrors the current Sonar blocker surface without
  // importing the whole recommended preset.
  {
    plugins: { sonarjs },
    rules: {
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-alphabetical-sort': 'error',
      'sonarjs/no-nested-functions': ['error', { threshold: 4 }],
      'sonarjs/void-use': 'error',
    },
  },
  prettierConfig,
  {
    plugins: {
      tsdoc: tsdocPlugin,
      '@oaknational': oakPlugin,
    },
    rules: {
      // Types
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
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
          types: RECOMMENDED_RESTRICTED_TYPES,
        },
      ],

      // Type imports and exports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',

      // Complexity
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],

      // General good practices
      'no-console': 'error',
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-constant-condition': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/consistent-return': 'error',

      // Import rules
      'import-x/no-namespace': 'error',
      'import-x/no-cycle': ['error'],
      'import-x/no-useless-path-segments': ['error'],
      'import-x/no-named-as-default': 'error',

      '@oaknational/no-eslint-disable': 'error',
      '@oaknational/no-dynamic-import': 'error',
      // Severity is `warn` during the rule's development phase per the general
      // principle that new ESLint rules wire at `warn` first to avoid blocking
      // unrelated work in the monorepo while the rule is iterated and the
      // existing-violation surface is captured. Escalation to `error` (and the
      // no-warning-toleration regime) is a separate, deliberate decision once
      // the rule is stable and every existing violation is either on the frozen
      // allowlist or migrated away.
      //
      // The `allowlistPathShapes` entries below are a frozen historical-violation
      // inventory captured at the moment this rule went live. The structural
      // defaults (`**/test-helpers/**`, `**/test-fakes/**`,
      // `**/vitest.*.config.ts`, `**/vitest.setup.ts`) are hardcoded inside the
      // rule and are not removable through this option.
      //
      // Per `.agent/rules/never-disable-checks.md`, per-file `eslint-disable`
      // comments to bypass this rule are FORBIDDEN. Allowlist-ADD discipline:
      // any PR adding a path here must cite either an entry in the §IO Inventory
      // historical record carried by the originating capture commit, or a named
      // follow-up plan whose closure removes the entry. Allowlist removals
      // (migrating a path off the allowlist) require no citation — they are the
      // intended end state.
      '@oaknational/no-real-io-in-tests': [
        'warn',
        {
          allowlistPathShapes: [
            '**/agent-tools/tests/codex-project-agents.integration.test.ts',
            '**/agent-tools/tests/codex-reviewer-resolve.integration.test.ts',
            '**/agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts',
            '**/agent-tools/tests/runtime-agent-index.integration.test.ts',
            '**/apps/oak-curriculum-mcp-streamable-http/e2e-tests/vercel-ignore-runtime.e2e.test.ts',
            '**/apps/oak-search-cli/src/lib/indexing/field-readback-audit-parse-ledger.integration.test.ts',
            '**/apps/oak-search-cli/src/lib/indexing/task-0.0-gap-ledger.integration.test.ts',
            '**/packages/core/build-metadata/tests/git-sha.unit.test.ts',
            '**/packages/core/env/tests/root-package-version.unit.test.ts',
            '**/packages/core/observability/src/no-node-only-imports.unit.test.ts',
            '**/packages/libs/env-resolution/tests/app-root.integration.test.ts',
            '**/packages/libs/env-resolution/tests/repo-root.integration.test.ts',
            '**/packages/libs/env-resolution/tests/resolve-env.integration.test.ts',
            '**/packages/sdks/oak-sdk-codegen/code-generation/codegen-core-file-operations.integration.test.ts',
            '**/packages/sdks/oak-sdk-codegen/code-generation/copy-json-assets.integration.test.ts',
            '**/packages/sdks/oak-sdk-codegen/code-generation/schema-cache.integration.test.ts',
            '**/packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/upstream-param-description-overrides.unit.test.ts',
            '**/packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/validate-canonical-urls.integration.test.ts',
            '**/packages/sdks/oak-sdk-codegen/e2e-tests/generators/write-json-graph-file.e2e.test.ts',
            '**/packages/sdks/oak-sdk-codegen/e2e-tests/scripts/codegen-core.e2e.test.ts',
            '**/packages/sdks/oak-sdk-codegen/src/bulk/generators/synonym-miner.integration.test.ts',
            '**/packages/sdks/oak-sdk-codegen/src/bulk/generators/write-json-dataset.integration.test.ts',
            '**/packages/sdks/oak-sdk-codegen/src/bulk/generators/write-json-graph-file.integration.test.ts',
          ],
        },
      ],

      // TSDoc
      'tsdoc/syntax': 'error',

      // Prevent export *
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:
            'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
        },
      ],
    },
  },
);
