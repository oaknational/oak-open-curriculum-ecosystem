# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this
before every session. Every entry earned its place by
changing behaviour.

**Source**: Distilled from `archive/napkin-2026-02-24.md`
(sessions 2026-02-10 to 2026-02-24).

---

## User Preferences

- British spelling, grammar, and date formats
- Plans must be **discoverable** (linked from README,
  roadmap, AND session prompt)
- Plans must be **actionable** (status tracking tables,
  completion checklists, resolved open questions)
- Archive docs are historical records — never update them
- Listen to user priorities, not document structure
- Try it before assuming it will not work

## Repo-Specific Rules

- `pnpm-workspace.yaml` must list only existing package
  directories — a missing directory causes confusing turbo
  scope
- ADR index is the source of truth for ADR count; keep
  README in sync
- Generator templates in `type-gen/typegen/` are the
  source of truth for anything in `src/types/generated/`
- Generated doc comments need escaping at the GENERATOR
  level, not in the output
- `tsdoc.json` `extends` works with `@microsoft/tsdoc-config`
  0.18.0; `TSDocConfigFile.findConfigPathForFolder` stops
  at `package.json`/`tsconfig.json` boundaries — each
  workspace needs its own `tsdoc.json` with `extends`
- From `packages/sdks/oak-curriculum-sdk/`, repo root is
  `../../../` not `../../`
- `@oaknational` is confirmed npm org scope (no token yet)
- `src/bulk/generators/` duplicates `vocab-gen/generators/`
  files — both must be updated in parallel until resolved
- When moving files between workspaces, ESLint rule overrides
  must also move — otherwise lint errors appear silently
- `*.config.ts` glob does NOT match `*.config.e2e.ts` —
  add explicit glob for E2E configs in tsconfig includes
- `export * from` is banned by `no-restricted-syntax` —
  always use named exports in barrel files

## TypeScript and Type Safety

- `TSESLint.FlatConfig.Plugin` from `@typescript-eslint/utils`
  bridges the `Rule.RuleModule` vs `TSESLint.RuleModule`
  gap — eliminates `as unknown as ESLint.Plugin['rules']`
- Zod v4 deprecated `ZodIssue` — use `core.$ZodIssue`
  via `import type { core } from 'zod'`
- Zod v4 deprecated `.merge()` — use `A.extend(B.shape)`
  to compose Zod object schemas. Caught by
  `@typescript-eslint/no-deprecated` lint rule.
- Shared Zod schemas are opt-in contracts: define fields
  as required in the schema, consumers use `.partial()` for
  optionality. This preserves the contract semantics: "if
  you use this capability, you must satisfy these fields."
- `Object.getOwnPropertyDescriptor(obj, key)?.value`
  returns `any` — assign to `const v: unknown = ...`
- `const parsed: unknown = JSON.parse(json)` avoids
  `no-unsafe-assignment`
- `Object.*` methods and `Reflect.*` methods are banned
  because they widen types (e.g. `Object.keys()` returns
  `string[]`, not the literal key union). Use `typeSafeKeys`
  etc. from `@oaknational/type-helpers` (core package). For
  plain objects whose key type IS `string` (e.g. Zod shapes),
  `for...in` is a language construct and is acceptable.
- ESLint `@typescript-eslint/no-restricted-types` in the
  strict config restricts 10 type-destroying patterns:
  `Record<string, unknown>`, `Record<string, any>`,
  `Record<string, undefined>`, `Readonly<Record<string, undefined>>`,
  `Record<PropertyKey, undefined>`, `object`, `Object`,
  `Function`, `unknown[]`, `{}`. The `satisfies Record<...>`
  pattern is acceptable because `satisfies` validates without
  widening — the inferred type stays narrow.
- `{}` as a generic constraint (`T extends {}`) is an escape
  hatch, not a solution. MCP responses have full Zod
  validation — the types ARE known. Use specific per-type
  builder functions instead of generic `T extends object`.
- ESLint flat config uses last-writer-wins for rule
  declarations. When `strict.ts` overrides a rule from
  `recommended.ts`, all entries from recommended are silently
  lost. Always replicate restricted types in strict.
- `@typescript-eslint/no-restricted-imports` `group` patterns
  use minimatch: `*` matches one path segment (not `/`),
  `**` matches zero or more segments. Use `**` for deep
  sub-path coverage — `@oaknational/pkg/*` catches
  `@oaknational/pkg/foo` but NOT `@oaknational/pkg/foo/bar`.
- SDK boundary rules (`createSdkBoundaryRules`) must include
  `@workspace/*` restriction alongside package-specific
  patterns. Without it, pnpm workspace aliases bypass the
  boundary rules entirely. All boundary rule sets in
  `boundary.ts` must include this pattern for consistency.
- `isSubject()` then fallback for `AllSubjectSlug` to
  `SearchSubjectSlug` mapping (KS4 variants)
- Derive types from generated contracts via indexed access:
  `type ToolAnnotations = NonNullable<ContractDescriptor['annotations']>`
  avoids modifying generators while maintaining type unification.
  Use a bottom contract `ToolDescriptor<string, never, never, never, never, string>`
  to extract invariant structural properties.
- For discriminated unions of `readonly string[] | { excludes: readonly string[] }`,
  use `'excludes' in value` (property check) not `Array.isArray(value)` —
  `Array.isArray` narrows to `string[]` but leaves the else branch
  still containing both union members.
- Type predicate stubs with `noUnusedParameters`: `() => false`
  won't compile — use the parameter in the body, e.g.
  `(v: unknown): v is T => typeof v === 'string' && v === '__never__'`
- `as const satisfies T` is the gold standard for test data
  that must be both a literal type and structurally valid
- Interface Segregation eliminates assertion pressure: when
  test fakes can't satisfy a complex generated type without
  `as`, extract a narrowed interface with only consumed fields

## Widget Rendering (ChatGPT Sandbox)

Widget architecture, dispatch pattern, data shapes, sandbox
dependencies, edge cases, and resilience hardening are
documented in the HTTP MCP server README (`Widget Rendering
Architecture` section). Dev gotchas not covered there:

- Zod schema fixtures must use parent-level enum values (e.g.
  `'science'` not `'biology'` for `subject_parent`) — the
  generated `SUBJECTS` enum only contains top-level subjects
- Generic `T extends SomeBase` constraints fail with TS7053
  weak type detection when union members don't overlap
  sufficiently. Use per-type builder functions instead.
- `onclick` inline handlers are exploitable in HTML-embedded
  JS: `esc()` HTML-encodes `'` to `&#39;`, but the browser
  HTML-decodes the attribute value before evaluating as JS.
  Use `data-oak-url` + delegated click handler instead.
- `JSON.stringify` for ALL dynamic data injected into
  generated JS string templates — the non-negotiable
  standard pattern for the `WIDGET_SCRIPT`.
- `expect.any(String)` returns `any` which triggers
  `no-unsafe-assignment`. Use `toHaveProperty` for
  structural checks on `unknown` values from `new Function`.

## Elasticsearch

- ES client v9: `document` not `body` for `client.index()`
- ES client v9: spread readonly arrays before passing to
  mutable params (`[...synonymSet.synonyms_set]`)
- Thread subject filter uses `subject_slugs` (plural array
  field); sequences use `subject_slug` (singular)
- `extractStatusCode` centralises ES error code extraction
  without assertions
- `isPlainObject` type guard satisfies both
  `IndicesIndexSettings` and `MappingTypeMapping`

## Testing

- **Tests MUST be independent and idempotent.** A test that
  depends on shared mutable state (e.g. a `beforeAll` app
  instance consumed by a prior test) passes or fails based
  on execution order. That is not a test — it is a
  coincidence. Each test must own its own state.
- Replace Express `_router` access in tests with HTTP
  assertions via supertest — more resilient, tests actual
  behaviour
- Bulk operation factories should accept `startIndex`
  rather than mutating readonly `_id` after creation
- `ensurePathsOnSchema` creates a new object (spread) —
  use `toStrictEqual` not `toBe` for structural equality
- NEVER reclassify a test to a weaker category to permit
  IO — refactor with DI instead
- E2E: STDIO IO allowed, network IO forbidden. Smoke: all
  IO allowed, NO mocks
- Naming: `test:*` for vitest tests, `smoke:*` for
  standalone tsx scripts
- For refactoring TDD (runtime behaviour unchanged), the
  RED phase is compiler errors from signature changes, not
  runtime test failures. Update test call sites first.
- Compile-time type assertions (e.g. `AssertNoX<T>`) are
  inert unless the resulting type is consumed in a binding
  or type path — all three reviewers independently caught
  this pattern
- Compliant `process.env` pattern:
  `loadRuntimeConfig(testEnv)` — never mutate global
  `process.env`
- `max-lines-per-function` (50 lines) — extract per-command
  registration functions
- ESLint complexity counts `??` and `?.` as branches — five
  nullish-coalescing expressions in one function can breach the
  limit. Fix: extract the merge logic into a named helper function
- `tsconfig.json` `include` patterns `**/*.test.ts` and
  `**/*.spec.ts` do NOT match test utility files (harness,
  fixture builder). Add `tests/**/*.ts` to include array
  when creating non-test utilities in test directories.
- ESLint `projectService: true` uses the nearest
  `tsconfig.json`, not `tsconfig.lint.json`. Files must be
  included in both for linting to work.
- Repeated multi-line test setup → extract scoped helper inside
  `describe` block (e.g. `registerWithOverrides`, `baseEnv`)
- Spread with optional properties widens types:
  `{ ...defaults, ...overrides }` where `overrides.prop?: T`
  yields `prop: T | undefined` even if `defaults.prop: T`.
  Fix: explicit property resolution with `??` or a typed merge helper
- `server.e2e.test.ts` has a hardcoded aggregated tools
  list — must be updated when adding new aggregated tools
- When moving files between workspaces, check whether
  removed tests should be recreated in the destination
- Stale vitest include globs are silent because of
  `passWithNoTests: true` — remove dead globs promptly

## TSDoc

- `{@link ./path}` is NOT valid TSDoc — use backtick
  references for module paths
- Braces `{ }` in TSDoc trigger malformed inline tag
- `>` in TSDoc examples needs backslash escape
- Never use `\x00` in regex — use string-based placeholders
  (e.g. `___TSDOC_SAFE_N___`)
- `openapiTS` emits `@constant` as both single-line
  (`/** @constant */`) and multi-line — regex must handle
  both forms
- ESLint plugins using dynamic file resolution
  (`@microsoft/tsdoc-config`) must be marked `external`
  in tsup bundles

## Documentation and Markdown

- Session prompts in `.agent/prompts/` should be updated
  at end of each session, not just napkin
- Fenced code blocks without language specifier fail
  markdownlint MD040
- `process.env.X = value` with trailing space in backticks
  triggers MD038
- Blank line between two blockquotes triggers MD028
- NEVER compress docs to meet line limits — split files by
  responsibility instead
- When removing a workspace, also search TSDoc `@see`
  links for old GitHub repo URLs
- ADR "Accepted (Revised)" status: use for documentation
  entropy fixes where the core decision is unchanged
  (follows ADR-055 precedent). Do not supersede — it
  adds overhead for no structural benefit
- ADR Consequences sections should use past tense for
  completed actions — stale future tense creates a false
  impression of outstanding work
- Permanently useful information does NOT belong in plans
  or archived plans — it belongs in ADRs. Plans are
  execution documents (what to do, in what order); they
  reference ADRs for architectural context. Extract
  permanent knowledge to ADRs before archiving a plan.

## Architecture

- **Response augmentation is best-effort**: canonical URL
  decoration must NEVER fail the API call. Wrap `augmentBody()`
  in try-catch that logs and returns unaugmented response.
  Middleware factory should accept optional `Logger` for DI.
- **Tests that agree with code on the wrong contract are worse
  than no tests**: the snagging bugs were invisible because
  tests encoded the same wrong assumptions (e.g. `keyStageSlugs`
  instead of API's `keyStages`). Anchor test fixtures to the
  schema or captured API responses, not to code assumptions.
- **SDK packages consumed as built dist**: `tsx` transpiles app
  source on the fly but imports SDK packages from `dist/`.
  Always `pnpm build` after SDK changes before smoke-testing
  the HTTP server.
- NEVER collapse distinct HTTP semantics into a single
  error kind — 404 and 451 have different meanings
- Per-service error types are cleaner than a unified error
  type — each service has different failure modes
- After any major rewrite/re-architecture, validation
  against the real system is non-negotiable before wiring
  into consumers
- When a directive review reveals significant work, update
  the plan BEFORE coding
- When a pre-existing eslint override exists in a file you
  touch, fix the root cause (DRY/split) rather than
  leaving the override
- Aggregated tools return `Promise<CallToolResult>` directly
  — they do NOT go through `ToolExecutionResult` unless they
  call `executeMcpTool` internally
- `AggregatedToolName` type derives from
  `keyof typeof AGGREGATED_TOOL_DEFS` — adding to the map
  automatically extends the type union
- Circular turbo dependency between curriculum-sdk and
  search-sdk: solved via dependency inversion. Define a
  local interface (`SearchRetrievalService`) structurally
  compatible with the concrete type. MCP servers inject the
  concrete implementation.
- Stub vs fake distinction: runtime stubs (plain functions,
  live in SDK, used in product code stub mode) vs test fakes
  (`vi.fn()`, live in `test-helpers/`, used in tests only)
- Prefer `git worktree` over `git stash` for baseline
  comparisons — stash risks lost work
- When extracting types from a composition root to fix layer
  violations, the composition root itself may still need a
  local `import type` for its own internal usage — a
  re-export alone is not sufficient for local references
- `void promise` silently swallows rejections — use
  `.catch(logger.error)` for cleanup promises in event
  handlers like `res.on('close')`
- TSDoc `@see` references should point to ADRs, not plan
  files — plans are archived/deleted after completion
- TS2209 rootDir ambiguity: when `tsconfig.build.json`
  narrows `include` from a wide base, add explicit
  `rootDir: "./src"` for export map resolution
- Stale tsup entries match nothing silently after file
  moves — remove dead entry points promptly
- Adapter/core packages must be rebuilt (`pnpm build`)
  before `pnpm type-gen` picks up changes — the SDK
  consumes built output, not source

## Domain Knowledge

Three distinct curriculum concepts — NEVER conflate:

1. **Thread** = Conceptual progression strand.
   Programme-agnostic. Cross-cutting. Shows how ideas
   build over time. The pedagogical backbone.
2. **Sequence** = API organisational structure for data
   storage and retrieval. A grouping by subject+phase.
3. **Programme** = User-facing curriculum pathway.
   Contextualised by key stage, tier, exam board.

- MFL threads span french, german, and spanish
  simultaneously — 164 threads across 16 subjects
- Sequences are the closest search architecture analogue
  to threads (both 2-way RRF, similar index size)

## ESM Module System

The monorepo is ESM-only (`"type": "module"`).

- File extensions mandatory: `import { x } from './helper.js'`
  (`.js` even for `.ts` files — TypeScript does not rewrite
  imports)
- No `__dirname` or `__filename` — use `import.meta.dirname`
- No `require()` or `module.exports` — ESM only
- JSON imports: `import data from './data.json' with { type: 'json' }`
- Vitest mock paths need `.js`: `vi.mock('./module.js')`
- tsup ESM config: `format: ['esm']`, `platform: 'node'`,
  `target: 'node22'`
- Common error "Cannot find module" → check missing `.js`
  extension. Applies to ALL relative imports including
  barrel re-exports. `pnpm build` + `pnpm type-check` do
  NOT catch this — only E2E tests against built `dist/`
  surface the error. Run `test:e2e` before pushing.
- Common error `__dirname is not defined` → use
  `import.meta.dirname`

## Workspace and Turbo

- `workspace:^` not `workspace:*` — the caret preserves
  semver intent and is replaced with actual version on publish
- Turbo stops at first failure by default — use `--continue`
  to see all errors across workspaces
- E2E tests need explicit env in `turbo.json`:
  `"env": ["OAK_API_KEY"]`
- Semantic-release managed packages use
  `"version": "0.0.0-development"`
- Never commit `.turbo/` cache files
- Quality gates always run in order: clean → type-gen →
  build → type-check → format → markdownlint → lint →
  test → test:ui → test:e2e → smoke:dev:stub

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Grep tool fails with cursorignore errors | Use `rg` in shell with `2>/dev/null` |
| Test upstream API status codes | `curl -s -w "\n%{http_code}"` |
| StrReplace fails on plan files | Unicode quotes (U+2019, U+201C/D) block matching — match on surrounding text or use Python |
| `pnpm publish --dry-run` fails | Add `--no-git-checks` with uncommitted changes |
| E2E `tool-examples-metadata` flaky | SSE payload timing — retry once before investigating |
| `pnpm benchmark` not found | The command is `pnpm benchmark` not `pnpm eval:benchmark` |
