/**
 * The shared test-file rules, in a module with no import-time IO: `shared.ts` builds
 * import-resolver settings when it loads (a working-directory read), and a test that
 * imports these rules must not consume that. `shared.ts` re-exports them, so every
 * workspace keeps its import path.
 */
import type { Linter } from 'eslint';

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
 * The `no-restricted-syntax` and `no-restricted-properties` entries below
 * enforce the lint-checkable items of the test-immediate-fails checklist
 * (`.agent/rules/test-immediate-fails.md`) when ESLint runs: process.env and
 * process.cwd access, and vi.mock-family cache mutation, all at `error`.
 *
 * @see `.agent/rules/no-global-state-in-tests.md` for the dependency-injection
 *   rationale behind the vi.mock ban
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
        'Tests must not read or write process.env. Pass literal inputs via dependency injection. See .agent/rules/test-immediate-fails.md.',
    },
    {
      selector: "CallExpression[callee.object.name='process'][callee.property.name='cwd']",
      message:
        'Tests must not consume process.cwd(). Anchor paths at import.meta.dirname. See .agent/rules/test-immediate-fails.md.',
    },
  ],
  // Module-cache / global-state manipulation: prohibited by
  // .agent/rules/no-global-state-in-tests.md, at `error` in the test files of
  // every workspace whose ESLint config applies these rules.
  'no-restricted-properties': [
    'error',
    {
      object: 'vi',
      property: 'mock',
      message:
        'vi.mock mutates the module cache, which tests must never do. Use dependency injection instead. See .agent/rules/test-immediate-fails.md.',
    },
    {
      object: 'vi',
      property: 'doMock',
      message:
        'vi.doMock mutates the module cache, which tests must never do. Use dependency injection instead. See .agent/rules/test-immediate-fails.md.',
    },
    {
      object: 'vi',
      property: 'stubGlobal',
      message:
        'vi.stubGlobal mutates global state. Use dependency injection or explicit parameter passing. See .agent/rules/test-immediate-fails.md.',
    },
  ],
  // Host-local (the sibling estate's product modules): the general text above is
  // shared with the sibling Practice instance; this block names this estate's
  // production factories and lives only here.
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
