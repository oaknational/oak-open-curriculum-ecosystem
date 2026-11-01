import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import type { TSESLint } from '@typescript-eslint/utils';
import { importX } from 'eslint-plugin-import-x';
import sonarjs from 'eslint-plugin-sonarjs';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import unicorn from 'eslint-plugin-unicorn';

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
 * rule in its own flat config. Preset-level activation is deliberately
 * avoided so the rule never fires outside its intended scope.
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

const recommendedBase: TSESLint.FlatConfig.ConfigArray = defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  // The analyser rules below are enabled one by one, each tagged with the
  // Sonar key it mirrors, rather than through `sonarjs.configs.recommended`,
  // so every active rule is one the resting branch is held at zero on. The
  // dispositions are recorded in docs/governance/sonar-disposition-policy.md.
  // Sonar S7778 maps to unicorn/prefer-single-call; enable that one rule
  // without adopting the full Unicorn preset.
  {
    plugins: { sonarjs, unicorn },
    rules: {
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-alphabetical-sort': 'error',
      'sonarjs/no-nested-functions': ['error', { threshold: 4 }],
      'sonarjs/void-use': 'error',
      'unicorn/prefer-single-call': 'error',

      // Phase 5 (main-sonar-ai-profile-to-zero): matching unicorn rules for the
      // recently-activated SonarJS idiom classes, enabled at `error`. The autofix
      // pass in THIS SAME commit clears every existing violation, so no warn-debt
      // is introduced (principles.md §"No warning toleration": fix the root cause
      // in the same work-item; do not defer). The new-rules-start-warn carve-out
      // applies only to a violation surface that needs a separate migration lane
      // (e.g. no-throw-statement); this is not that. Each maps to a Sonar rule.
      'unicorn/prefer-string-replace-all': 'error', // S7781
      'unicorn/prefer-string-raw': 'error', // S7780
      'unicorn/prefer-number-properties': 'error', // S7773
      'unicorn/prefer-at': 'error', // S7755
      'prefer-object-has-own': 'error', // S6653 (ESLint core rule, not unicorn)
      'unicorn/prefer-node-protocol': 'error', // S7772
      'unicorn/prefer-global-this': 'error', // S7764

      // Every remaining analyser rule with an open finding on the resting
      // branch (the analyser's issue list for this checkout's project,
      // read 2026-11-01) and a lint twin in the installed plugins, locked at
      // `error` so each class is refused at commit time once cured. The
      // twins were read from eslint-plugin-sonarjs 4.2.0 (rule docs carry
      // the Sonar key), eslint-plugin-unicorn 73 and typescript-eslint.
      // Security and reliability:
      'sonarjs/super-linear-regex': 'error', // S8786
      'sonarjs/pseudo-random': 'error', // S2245
      'sonarjs/hashing': 'error', // S4790
      'sonarjs/updated-loop-counter': 'error', // S2310
      'sonarjs/no-all-duplicated-branches': 'error', // S3923
      'sonarjs/no-os-command-from-path': 'error', // S4036
      'sonarjs/no-clear-text-protocols': 'error', // S5332
      'sonarjs/no-misleading-array-reverse': 'error', // S4043
      'unicorn/no-object-as-default-parameter': 'error', // S7737
      // Maintainability, autofixable:
      'unicorn/prefer-export-from': 'error', // S7763
      'unicorn/prefer-includes': 'error', // S7765
      'sonarjs/concise-regex': 'error', // S6353
      'sonarjs/prefer-regexp-exec': 'error', // S6594
      'unicorn/catch-error-name': 'error', // S7718
      'unicorn/prefer-set-has': 'error', // S7776
      '@typescript-eslint/prefer-optional-chain': 'error', // S6582
      'unicorn/prefer-type-error': 'error', // S7786
      'sonarjs/no-redundant-optional': 'error', // S4782
      'unicorn/no-useless-spread': 'error', // S7747
      'unicorn/prefer-string-starts-ends-with': 'error', // S6557
      'sonarjs/no-inverted-boolean-check': 'error', // S1940
      'no-unneeded-ternary': ['error', { defaultAssignment: false }], // S6644 (ESLint core rule)
      'unicorn/no-useless-promise-resolve-reject': 'error', // S7746
      'unicorn/prefer-array-find': 'error', // S7750
      'unicorn/no-useless-fallback-in-spread': 'error', // S7744
      'unicorn/prefer-native-coercion-functions': 'error', // S7770
      // Maintainability, cured by hand:
      'sonarjs/no-nested-template-literals': 'error', // S4624
      'unicorn/prefer-top-level-await': 'error', // S7785
      'sonarjs/redundant-type-aliases': 'error', // S6564
      'sonarjs/use-type-alias': 'error', // S4323
      'sonarjs/no-nested-conditional': 'error', // S3358
      '@typescript-eslint/max-params': ['error', { max: 7 }], // S107
      'sonarjs/todo-tag': 'error', // S1135
      'sonarjs/class-name': 'error', // S101
      'sonarjs/no-identical-functions': 'error', // S4144
      'sonarjs/no-selector-parameter': 'error', // S2301
      'sonarjs/regex-complexity': 'error', // S5843
      'sonarjs/prefer-specific-assertions': 'error', // S5906
      '@typescript-eslint/prefer-nullish-coalescing': 'error', // S6606
      '@typescript-eslint/no-base-to-string': 'error', // S6551
      '@typescript-eslint/no-redundant-type-constituents': 'error', // S6571
      'unicorn/consistent-function-scoping': 'error', // S7721
      'unicorn/prefer-code-point': 'error', // S7758
      // S6845 and S6822 (jsx-a11y classes) have no twin in the estate.

      'unicorn/no-abusive-eslint-disable': 'error',
    },
  },
  prettierConfig,
  {
    plugins: {
      tsdoc: tsdocPlugin,
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

const oakRecommendedConfig: TSESLint.FlatConfig.Config = {
  plugins: {
    '@oaknational': oakPlugin,
  },
  rules: {
    '@oaknational/no-eslint-disable': 'error',
    '@oaknational/no-conditional-tests': 'error',
    '@oaknational/no-dynamic-import': 'error',
    // Architectural boundary: application code must not READ the `.agent/`
    // knowledge substrate at runtime (fs reads / `new URL` into `.agent/`).
    // agent-tools/ (the substrate operator) is exempt inside the rule. The
    // companion IMPORT boundary is enforced by the depcruise
    // `no-import-from-agent-substrate` forbidden rule. Strict (PDR-126): the
    // rule's violation surface measured empty across every lint workspace on
    // 2026-09-25, so it sits at `error` with nothing behind it. Doctrine: owner
    // 2026-06-22, .agent/directives/testing-strategy.md.
    '@oaknational/no-agent-substrate-access': 'error',
    // Bans `throw` in favour of the Result pattern (ADR-088 /
    // use-result-pattern). The owner's ruling of 2026-09-08 on the rule's
    // warning surface (sixteen workspaces held throw debt when this landed):
    // "Turn the rule off for now, we can't fix it without creating
    // incredible churn, so that needs to wait until the Engraph fork is merged
    // back into the upstream. However, in any workspace with no current
    // warnings and in any new workspace, leave it on as an error." So the
    // preset says `error`, every workspace that holds throw debt turns the rule
    // `off` in its own flat config citing this ruling, and there is no warn
    // tier (PDR-126). The migration lane (the no-throw-remediation plan under
    // .agent/plans-backlog-2026-07/) waits for the merge-back.
    '@oaknational/no-throw-statement': 'error',
    // At `error` with no allowlist, as every gate is (principles.md §Code
    // Quality: no warning toleration, never disable checks, fix things). The
    // structural exemptions (`**/test-helpers/**`, `**/test-fakes/**`,
    // `**/vitest.*.config.ts`, `**/vitest.setup.ts`) are hardcoded inside the
    // rule. Per `.agent/rules/never-disable-checks.md`, per-file
    // `eslint-disable` comments to bypass this rule are FORBIDDEN; a test that
    // does real IO is migrated to a fake or moved to the integration category.
    '@oaknational/no-real-io-in-tests': 'error',
  },
};

export const recommended: TSESLint.FlatConfig.ConfigArray = [
  ...recommendedBase,
  oakRecommendedConfig,
];
