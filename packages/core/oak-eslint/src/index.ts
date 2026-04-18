import { noExportTrivialTypeAliasesRule } from './rules/no-export-trivial-type-aliases.js';
import { noEslintDisableRule } from './rules/no-eslint-disable.js';
// import { boundaryRules } from './rules/boundary.js'; // We will need to wrap the boundary logic in a rule or config export
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver } from 'eslint-plugin-import-x';

/**
 * Re-exports boundary rules and helpers from the boundary module.
 *
 * @remarks
 * TODO: For now, we are exporting the raw logic as we did in eslint-rules.
 * We should aim to expose them as proper configs or rules.
 */
export {
  coreBoundaryRules,
  createDesignBoundaryRules,
  createLibBoundaryRules,
  createSdkBoundaryRules,
  appBoundaryRules,
  appArchitectureRules,
} from './rules/boundary.js';

export const rules = {
  'no-export-trivial-type-aliases': noExportTrivialTypeAliasesRule,
  'no-eslint-disable': noEslintDisableRule,
};

import { recommended } from './configs/recommended.js';
import { strict } from './configs/strict.js';
import { react } from './configs/react.js';
import { next } from './configs/next.js';

import type { Linter } from 'eslint';
import type { TSESLint } from '@typescript-eslint/utils';

export const configs: Record<string, Linter.Config[]> = {
  recommended: Array.isArray(recommended) ? recommended : [recommended],
  strict: Array.isArray(strict) ? strict : [strict],
  react: Array.isArray(react) ? react : [react],
  next: Array.isArray(next) ? next : [next],
};

/**
 * ESLint plugin for Oak National Academy standards.
 *
 * Typed as `FlatConfig.Plugin` from typescript-eslint rather than core
 * `ESLint.Plugin` because the latter's `rules` expects `Rule.RuleModule`
 * which is structurally incompatible with typescript-eslint's `RuleModule`.
 * `FlatConfig.Plugin` uses `LooseRuleDefinition` which bridges this gap.
 */
const plugin: TSESLint.FlatConfig.Plugin = {
  rules: rules,
  configs: configs,
};

type ImportResolverProject = string | string[];
type NodeResolverOptions = Parameters<typeof createNodeResolver>[0];

export interface ImportResolverSettingsOptions {
  readonly project?: ImportResolverProject;
  readonly node?: NodeResolverOptions;
}

/**
 * Shared import-resolution settings for flat-config ESLint consumers.
 *
 * The TypeScript resolver understands TS pathing and declaration surfaces.
 * The Node resolver is chained after it so lint follows real Node/package
 * export semantics when the TypeScript resolver produces false negatives.
 */
export function createImportResolverSettings(options: ImportResolverSettingsOptions = {}) {
  const { project, node } = options;
  const typeScriptResolver =
    project === undefined
      ? createTypeScriptImportResolver({
          alwaysTryTypes: true,
        })
      : createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project,
        });

  return {
    'import-x/resolver-next': [typeScriptResolver, createNodeResolver(node)],
  };
}

/**
 * Default resolver settings for workspaces that do not need explicit project
 * or Node-resolution overrides.
 */
export const commonSettings = createImportResolverSettings();

/**
 * Global ignore patterns for ESLint.
 * Includes build artifacts, test results, and documentation.
 */
export const ignores = [
  'tmp/',
  'dist/',
  'node_modules/',
  '**/*.d.ts',
  'commitlint.config.js',
  '**/tsup.config.ts',
  'reference/',
  'research/',
  // Ignore ephemeral bundled config artifacts (e.g., tsup.config.bundled_*.mjs)
  '**/tsup.config.*',
  '**/*.bundled_*.mjs',
  // Generated TypeDoc output
  '**/docs/api/',
  '**/docs/api-md/',
  // Test results
  '**/test-results/',
  '**/coverage/',
];

/**
 * Common rules for test files.
 *
 * ALL of these exceptions are problems, and need removing at the earliest opportunity.
 *
 * Structural limits (max-lines, max-lines-per-function) are temporarily relaxed for
 * test files.
 *
 * Tests may import workspace-local devDependencies, but they still must
 * declare those packages in the workspace manifest rather than relying on
 * the repo root toolchain.
 *
 * The rules below enforce the test-immediate-fails checklist
 * (`.agent/rules/test-immediate-fails.md`) at compile time. Zero-violation
 * patterns (process.env, process.cwd, loadRuntimeConfig and observability
 * factory imports) are `error`. The `vi.mock` family is `warn` during the
 * migration tracked by
 * `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`
 * and will be escalated to `error` once the backlog reaches zero.
 *
 * Workspaces that legitimately host the tests FOR `loadRuntimeConfig` or
 * `createHttpObservabilityOrThrow` (i.e. `runtime-config.*.test.ts`,
 * `http-observability.*.test.ts`) add a file-glob override disabling
 * `no-restricted-imports` for those specific files in their workspace
 * `eslint.config.ts`.
 *
 * @see ADR-078 for the dependency injection rationale behind the vi.mock ban
 * @see principles.md "No type shortcuts" — applies to test code equally
 * @see `.agent/rules/test-immediate-fails.md` — the authoritative checklist
 */
export const testRules = {
  'max-lines': ['error', 700],
  'max-lines-per-function': ['error', 1000],
  '@typescript-eslint/consistent-indexed-object-style': 'off',
  '@typescript-eslint/consistent-type-definitions': 'off',
  '@typescript-eslint/no-restricted-types': 'off',
  '@typescript-eslint/unbound-method': 'off',
  'import-x/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: true,
      optionalDependencies: false,
      peerDependencies: false,
      includeTypes: false,
    },
  ],
  'import-x/no-named-as-default-member': 'off',
  // Hermetic-test enforcement: process.env / process.cwd access is
  // prohibited. Re-includes the ExportAllDeclaration selector from
  // `recommended` because per-file rule values replace rather than merge.
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ExportAllDeclaration',
      message:
        'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
    },
    {
      selector: "MemberExpression[object.name='process'][property.name='env']",
      message:
        'Tests must not read or write process.env. Pass literal inputs via dependency injection (ADR-078). See .agent/rules/test-immediate-fails.md.',
    },
    {
      selector: "CallExpression[callee.object.name='process'][callee.property.name='cwd']",
      message:
        'Tests must not consume process.cwd(). Anchor paths at import.meta.dirname. See .agent/rules/test-immediate-fails.md.',
    },
  ],
  // Module-cache / global-state manipulation: prohibited by ADR-078 and
  // .agent/rules/no-global-state-in-tests.md. Currently `warn` during the
  // audit-and-migrate backlog per
  // `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`;
  // escalates to `error` once the backlog is cleared.
  'no-restricted-properties': [
    'warn',
    {
      object: 'vi',
      property: 'mock',
      message:
        'vi.mock mutates the module cache and violates ADR-078 (DI-for-testability). Use dependency injection instead. See .agent/rules/test-immediate-fails.md.',
    },
    {
      object: 'vi',
      property: 'doMock',
      message:
        'vi.doMock mutates the module cache and violates ADR-078. Use dependency injection instead. See .agent/rules/test-immediate-fails.md.',
    },
    {
      object: 'vi',
      property: 'stubGlobal',
      message:
        'vi.stubGlobal mutates global state. Use dependency injection or explicit parameter passing (ADR-078). See .agent/rules/test-immediate-fails.md.',
    },
  ],
  // Production-factory ceremony: tests must not import factories that
  // route through runtime disk/env resolution or real SDK initialisation.
  // Currently `warn` during the migration backlog tracked by
  // `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`;
  // escalates to `error` once the backlog is cleared.
  //
  // Workspaces that host the tests FOR these modules add a file-glob
  // override disabling this rule on their specific runtime-config /
  // http-observability test files.
  'no-restricted-imports': [
    'warn',
    {
      patterns: [
        {
          group: ['**/runtime-config', '**/runtime-config.js'],
          message:
            'Tests must not import loadRuntimeConfig or its siblings — that function reads .env files from disk, merging them into the test input. Construct a RuntimeConfig literal via a test helper (e.g. createMockRuntimeConfig from test-helpers). See .agent/rules/test-immediate-fails.md.',
        },
        {
          group: ['**/observability/http-observability', '**/observability/http-observability.js'],
          message:
            'Tests must not import createHttpObservability / createHttpObservabilityOrThrow — those factories route through real Sentry initialisation and register process listeners. Inject createFakeHttpObservability from test-helpers/observability-fakes instead. See .agent/rules/test-immediate-fails.md.',
        },
      ],
    },
  ],
} as const satisfies Linter.RulesRecord;

export default plugin;
