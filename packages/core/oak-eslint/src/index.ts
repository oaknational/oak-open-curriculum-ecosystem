// import { boundaryRules } from './rules/boundary.js'; // We will need to wrap the boundary logic in a rule or config export
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver } from 'eslint-plugin-import-x';
import { oakPlugin, oakRuleModules } from './plugin.js';
import type { Linter } from 'eslint';

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

export const rules = oakRuleModules;

import { recommended } from './configs/recommended.js';
import { strict } from './configs/strict.js';
import { react } from './configs/react.js';
import { next } from './configs/next.js';

import type { TSESLint } from '@typescript-eslint/utils';

export const configs = {
  recommended,
  strict,
  react,
  next,
};

/**
 * ESLint plugin for Oak National Academy standards.
 *
 * Exported as a plain object so the shared rule inventory and bundled
 * config arrays preserve their native inferred shapes.
 */
const plugin = {
  ...oakPlugin,
  configs: configs,
};

type ConfigSegment = TSESLint.FlatConfig.Config | TSESLint.FlatConfig.ConfigArray;

/**
 * Flattens shared config fragments while staying in the same config type
 * family as the bundled `@oaknational` presets.
 */
export function defineConfigArray(
  ...segments: readonly ConfigSegment[]
): TSESLint.FlatConfig.ConfigArray {
  const flattened: TSESLint.FlatConfig.Config[] = [];

  for (const segment of segments) {
    if (Array.isArray(segment)) {
      flattened.push(...segment);
      continue;
    }

    flattened.push(segment);
  }

  return flattened;
}

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
 * patterns (process.env, process.cwd, loadRuntimeConfig, observability
 * factory imports, and vi.mock-family cache mutation) are `error`.
 * Existing violations stay visible only through explicit workspace-local
 * allowlists tracked by
 * `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`.
 *
 * Workspaces that legitimately host the tests FOR `loadRuntimeConfig` or
 * `createHttpObservabilityOrThrow` (i.e. `runtime-config.*.test.ts`,
 * `http-observability.*.test.ts`) add a file-glob override disabling
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
  // .agent/rules/no-global-state-in-tests.md. Applies repo-wide at
  // `error`. Workspaces carrying existing violations add a per-file
  // allowlist in their own `eslint.config.ts`; the backlog is therefore
  // physically visible in the config and each migration is a one-line
  // deletion. Tracked by
  // `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`.
  // Aligned with `patterns/warning-severity-is-off-severity.md` (never
  // warn: fix or allowlist-with-deadline).
  'no-restricted-properties': [
    'error',
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
  // Applies at `error`. Workspaces carrying existing violations add a
  // per-file allowlist in their own `eslint.config.ts`; the backlog is
  // physically visible in config and each migration deletes a line.
  // Tracked by
  // `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`.
  //
  // Workspaces that host the tests FOR these modules (runtime-config /
  // http-observability subject-under-test) also declare file-glob
  // overrides disabling this rule on those specific files.
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['**/runtime-config', '**/runtime-config.js'],
          allowTypeImports: true,
          message:
            'Tests must not import loadRuntimeConfig or its siblings — that function reads .env files from disk, merging them into the test input. Construct a RuntimeConfig literal via a test helper (e.g. createMockRuntimeConfig from test-helpers). Type-only imports (`import type { RuntimeConfig }`) are permitted. See .agent/rules/test-immediate-fails.md.',
        },
        {
          group: ['**/observability/http-observability', '**/observability/http-observability.js'],
          allowTypeImports: true,
          message:
            'Tests must not import createHttpObservability / createHttpObservabilityOrThrow — those factories route through real Sentry initialisation and register process listeners. Inject createFakeHttpObservability from test-helpers/observability-fakes instead. Type-only imports (`import type { HttpObservability }`) are permitted. See .agent/rules/test-immediate-fails.md.',
        },
      ],
    },
  ],
} as const satisfies Linter.RulesRecord;

export default plugin;
