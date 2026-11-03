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
  // Full `sonarjs.configs.recommended` activation is tracked by the
  // sonarjs-activation-and-sonarcloud-backlog plan in
  // .agent/plans/architecture-and-infrastructure/current/ — flip the
  // entry below to `sonarjs.configs.recommended` when the plan is in its
  // GREEN phase. Until then, keep only the Quality-Gate remediation rules
  // active so local lint mirrors the current Sonar blocker surface without
  // importing the whole recommended preset. Sonar S7778 maps to
  // unicorn/prefer-single-call; enable that one rule without adopting the
  // full Unicorn preset.
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
      // Two related classes are deliberately NOT locked here and are handled
      // per-site in a later tranche: S6594 (prefer-regexp-exec is a
      // @typescript-eslint rule overlapping generated output, not a clean
      // autofix) and S7765 (prefer-includes force-converts the ADR-153
      // `value is X` type-guard `.some((id) => id === value)` idiom to a
      // type-unsound `.includes(value)` where the argument is wider than the
      // element type — incompatible with the house type-guard pattern).
      'unicorn/prefer-string-replace-all': 'error', // S7781
      'unicorn/prefer-string-raw': 'error', // S7780
      'unicorn/prefer-number-properties': 'error', // S7773
      'unicorn/prefer-at': 'error', // S7755
      'prefer-object-has-own': 'error', // S6653 (ESLint core rule, not unicorn)
      'unicorn/prefer-node-protocol': 'error', // S7772
      'unicorn/prefer-global-this': 'error', // S7764

      // Potentials
      'unicorn/no-abusive-eslint-disable': 'error',
      // 'unicorn/error-message': 'warn',
      // 'unicorn/throw-new-error': 'warn',
      // 'unicorn/no-new-buffer': 'warn',
      // 'unicorn/custom-error-definition': 'warn',
      // 'unicorn/explicit-length-check': 'warn',
      // 'unicorn/consistent-function-scoping': 'warn',
      // 'unicorn/no-anonymous-default-export': 'warn',
      // 'unicorn/prefer-string-starts-ends-with': 'warn',
      // 'unicorn/prefer-includes': 'warn',
      // 'unicorn/prefer-array-find': 'warn',
      // 'unicorn/prefer-array-some': 'warn',
      // 'unicorn/no-array-method-this-argument': 'warn',
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
    // Transition debt, not a design (PDR-126 §4): this rule sits at `warn` over
    // a frozen violation allowlist, the shape PDR-126 forbids for a new gate.
    // The no-io-test-boundary-and-di-recovery plan (under
    // .agent/plans-backlog-2026-07/architecture-and-infrastructure/) owns
    // bringing it to `error` in one landing by migrating or category-moving
    // every listed file; until then the allowlist below is that plan's
    // inventory, and this warn tier licenses no other warn-tier landing.
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
          // Recorded reason: plan `plan-corpus-refounding` — the freeze/verify
          // discrimination proofs (F1 D8) mutate genuine frozen artefacts on
          // mkdtemp temp trees; a fake fs would make the mutation proofs
          // theatre. The refounding module retires with the run (F1 §5), and
          // that plan's closure removes these entries.
          '**/agent-tools/src/collaboration-state/coordination-home-consolidation.integration.test.ts',
          '**/agent-tools/src/core/flag-path-resolve.integration.test.ts',
          '**/agent-tools/tests/collaboration-state/state-integrity.integration.test.ts',
          '**/agent-tools/tests/collaboration-state/watcher-staleness-io.integration.test.ts',
          '**/agent-tools/tests/protocol-conformance/node-io.integration.test.ts',
          '**/agent-tools/src/refounding/refound-freeze.integration.test.ts',
          '**/agent-tools/src/refounding/refound-verify-freeze.integration.test.ts',
          '**/agent-tools/src/refounding/refound-inventory.integration.test.ts',
          '**/agent-tools/src/refounding/refound-residue.integration.test.ts',
          '**/agent-tools/src/refounding/refound-sweep.integration.test.ts',
          '**/agent-tools/src/refounding/refound-plant-orphan.integration.test.ts',
          '**/agent-tools/src/refounding/refound-plant-challenge-canary.integration.test.ts',
          '**/agent-tools/src/refounding/refound-merge-recheck.integration.test.ts',
          '**/agent-tools/src/refounding/refound-tile.integration.test.ts',
          '**/agent-tools/src/refounding/refound-default-ledger.integration.test.ts',
          '**/agent-tools/src/refounding/refound-claim-census.integration.test.ts',
          '**/agent-tools/src/refounding/refound-batch-status.integration.test.ts',
          '**/agent-tools/src/refounding/refound-window-sample.integration.test.ts',
          // Recorded reason: plan `plan-corpus-refounding` — the read/write
          // path-resolver containment proofs need real symlinks and real
          // existence probes (a fake fs would make the symlink-escape and
          // ENOENT-refusal proofs theatre); same closure as the entries above.
          '**/agent-tools/src/refounding/refound-path-resolve.integration.test.ts',
          '**/agent-tools/tests/codex-project-agents.integration.test.ts',
          '**/agent-tools/tests/codex-reviewer-resolve.integration.test.ts',
          '**/agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts',
          '**/agent-tools/tests/runtime-agent-index.integration.test.ts',
          '**/apps/oak-curriculum-mcp-streamable-http/e2e-tests/vercel-ignore-runtime.e2e.test.ts',
          '**/apps/oak-search-cli/src/lib/indexing/field-readback-audit-parse-ledger.integration.test.ts',
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
          '**/packages/sdks/oak-sdk-codegen/e2e-tests/scripts/codegen-core.e2e.test.ts',
          '**/packages/sdks/oak-sdk-codegen/src/bulk/generators/synonym-miner.integration.test.ts',
          '**/packages/sdks/oak-sdk-codegen/src/bulk/generators/write-json-dataset.integration.test.ts',
        ],
      },
    ],
  },
};

export const recommended: TSESLint.FlatConfig.ConfigArray = [
  ...recommendedBase,
  oakRecommendedConfig,
];
