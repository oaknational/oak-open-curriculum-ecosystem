# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this
before every session. Every entry earned its place by
changing behaviour.

**Source**: Distilled from `archive/napkin-2026-02-24.md`
(sessions 2026-02-10 to 2026-02-24) and
`archive/napkin-2026-02-28.md` (sessions 2026-02-26 to
2026-02-28).

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
- Risk acceptance is a human decision. Agents classify
  severity and describe impact; agents do not accept risks
  or defer items on behalf of the owner
- Commands should be thin pointers to prompts, not
  duplicates. The prompt is the source of truth; the
  command is a platform-specific entry point
- Onboarding simulations must be discovery-based: start at
  README.md only, no prescribed reading list, no access to
  the onboarding planning documents. Describe personas by
  their motivations ("anxious about looking foolish",
  "sceptical by default"), not by focus areas. A
  prescriptive approach tests whether reviewers can read
  pre-selected files; a discovery approach tests whether
  the documentation actually guides people

## Repo-Specific Rules

- `pnpm-workspace.yaml` must list only existing package
  directories — a missing directory causes confusing turbo
  scope
- ADR index is the source of truth for ADR count; keep
  README in sync
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
- Self-referencing imports within a package (e.g.
  `import from '@oaknational/sdk-codegen/bulk'` inside
  sdk-codegen itself) are a trap: TypeScript and tsup
  don't catch them, only runtime does. External consumers
  use subpath exports; internal files use relative imports
- Turbo cache can mask latent failures for a long time —
  package renames force cache misses that surface them
- When moving files between workspaces, ESLint rule overrides
  must also move — otherwise lint errors appear silently
- When migrating facade imports, check for second-level barrels
  (e.g. `oak.ts` re-exporting from the facade) — they add
  hidden consumers that don't appear in a direct grep for the
  facade file
- E2E config files use prefix convention (`vitest.e2e.config.ts`)
  not suffix (`vitest.config.e2e.ts`) — prefix is matched by
  `*.config.ts` globs in tsconfig and ESLint. Standardised
  repo-wide in F32

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
- `{}` as a generic constraint (`T extends {}`) is an escape
  hatch, not a solution. MCP responses have full Zod
  validation — the types ARE known. Use specific per-type
  builder functions instead of generic `T extends object`.
- `@typescript-eslint/no-restricted-imports` `group` patterns
  use minimatch: `*` matches one path segment (not `/`),
  `**` matches zero or more segments. Use `**` for deep
  sub-path coverage — `@oaknational/pkg/*` catches
  `@oaknational/pkg/foo` but NOT `@oaknational/pkg/foo/bar`.
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
- `Record<string, string | undefined>` is acceptable at the
  `process.env` entry boundary — the key space is genuinely
  unbounded. Zod validation immediately narrows it. This is
  the correct exception to "Record is too generic"
- `const noop = () => {};` triggers `no-empty-function` lint.
  Use `const noop = () => undefined;` — non-empty expression
  body with equivalent void semantics
- Interface Segregation eliminates assertion pressure: when
  test fakes can't satisfy a complex generated type without
  `as`, extract a narrowed interface with only consumed fields

## Widget Rendering (ChatGPT Sandbox)

Widget architecture, dispatch pattern, data shapes, sandbox
dependencies, edge cases, and resilience hardening are
documented in `apps/oak-curriculum-mcp-streamable-http/docs/widget-rendering.md`. Dev gotchas not covered there:

- Zod schema fixtures must use parent-level enum values (e.g.
  `'science'` not `'biology'` for `subject_parent`) — the
  generated `SUBJECTS` enum only contains top-level subjects
- Generic `T extends SomeBase` constraints fail with TS7053
  weak type detection when union members don't overlap
  sufficiently. Use per-type builder functions instead.
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
- Classify network errors by `error.name` (e.g.
  `'AbortError'`, `'TypeError'`), not `error.message` —
  `message.includes('abort')` is too broad and matches
  unrelated errors
- `isPlainObject` type guard satisfies both
  `IndicesIndexSettings` and `MappingTypeMapping`
- EsCurric MCP API key needs `feature_actions.read` Kibana
  privilege (in addition to `feature_agentBuilder.read`) for
  the `platform_core_search` tool to work. Without it, the
  "No connector found" error is misleading — the connector
  exists but the key cannot see it

## Testing

- Replace Express `_router` access in tests with HTTP
  assertions via supertest — more resilient, tests actual
  behaviour
- For large mechanical migrations (30+ files), use
  subagents to parallelise the work
- Bulk operation factories should accept `startIndex`
  rather than mutating readonly `_id` after creation
- `ensurePathsOnSchema` creates a new object (spread) —
  use `toStrictEqual` not `toBe` for structural equality
- For refactoring TDD (runtime behaviour unchanged), the
  RED phase is compiler errors from signature changes, not
  runtime test failures. Update test call sites first.
  For type-derivation fixes, use `satisfies` as a
  compile-time anchor: `{ flat: 'value' } satisfies MyType`
  fails type-check if the derivation is wrong, serving as
  the RED phase alongside generator string-output tests
- Compile-time type assertions (e.g. `AssertNoX<T>`) are
  inert unless the resulting type is consumed in a binding
  or type path — all three reviewers independently caught
  this pattern
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
- `resolveEnv` integration tests that need `.env` file
  isolation: use `'/tmp'` as `startDir` to prevent ambient
  `.env` files from satisfying schema requirements
- After refactoring entry points (removing `dotenv`,
  changing `loadRuntimeConfig` signature), check E2E tests
  that launch the process directly — `mcp-dev-runner.e2e.test.ts`
  broke when `src/index.ts` direct-run guard was removed

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
- ADR Implementation sections have file paths that go stale
  when packages are moved. Always grep ADRs for old paths
  after a move.
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
- Commitlint enforces conventional commit `subject-case`:
  subject line must start with lowercase type prefix
  (e.g. `fix(scope): description`). Uppercase item
  references like "F7 — description" are rejected. When
  moving files between workspaces, also check that
  relative links in README files adjust for directory
  depth changes (e.g. `../../../docs/` may become
  `../../../../docs/`).

## Architecture

- **Response augmentation is best-effort**: canonical URL
  decoration must NEVER fail the API call. Wrap `augmentBody()`
  in try-catch that logs and returns unaugmented response.
  Middleware factory requires `Logger` (DI); `BaseApiClient`
  provides `createNoopLogger()` when the consuming app doesn't
  inject one. Pure augmentation functions should not log —
  they throw or return errors; the middleware boundary logs.
- **Tests that agree with code on the wrong contract are worse
  than no tests**: the snagging bugs were invisible because
  tests encoded the same wrong assumptions (e.g. `keyStageSlugs`
  instead of API's `keyStages`). Anchor test fixtures to the
  schema or captured API responses, not to code assumptions.
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
- search-sdk → curriculum-sdk dependency is banned (ADR-108,
  enforced by `createSdkBoundaryRules('search')`). Shared
  data lives in `@oaknational/sdk-codegen/synonyms`.
  `SearchRetrievalService` in curriculum-sdk is ISP, not
  duplication
- When removing an entry from `LIB_PACKAGES`, check ALL
  packages that called `createLibBoundaryRules` with that
  name — their ESLint config may generate empty/broken zone
  paths. The zone uses `../${otherLib}/**` relative paths
  that only resolve correctly for actual sibling packages.
- When splitting a core package that has runtime deps into
  core + libs: schemas stay in core (`coreBoundaryRules`),
  runtime pipeline moves to libs (`createLibBoundaryRules`).
  No re-exports, no compatibility layer.
- Prefer `git worktree` over `git stash` for baseline
  comparisons — stash risks lost work
- Background reviewer agents that haven't returned by the
  end of a conversation turn are lost — re-invoke in the
  next session
- When extracting types from a composition root to fix layer
  violations, the composition root itself may still need a
  local `import type` for its own internal usage — a
  re-export alone is not sufficient for local references
- `void promise` silently swallows rejections — use
  `.catch(logger.error)` for cleanup promises in event
  handlers like `res.on('close')`
- TSDoc `@see` references should point to ADRs, not plan
  files — plans are archived/deleted after completion
- Progressive ESLint re-enablement: narrow overrides from
  directory-wide to file-specific first. This ensures new
  code and tests get full checking while grandfathering
  known violations in specific files
- TS2209 rootDir ambiguity: when `tsconfig.build.json`
  narrows `include` from a wide base, add explicit
  `rootDir: "./src"` for export map resolution
- Stale tsup entries match nothing silently after file
  moves — remove dead entry points promptly

## ESM Module System

ESM rules (extensions, no CommonJS, no `__dirname`,
barrel export ban) are documented in `CONTRIBUTING.md`
§ESM Module System. Remaining gotchas not covered there:

- Vitest mock paths need `.js`: `vi.mock('./module.js')`
- tsup ESM config: `format: ['esm']`, `platform: 'node'`,
  `target: 'node22'`

## Workspace and Turbo

- `workspace:*` not `workspace:^` — all 14 workspaces use
  `workspace:*`. For private packages that will never be published
  to a registry, the runtime difference is zero, but consistency
  matters. Do not introduce `workspace:^`
- Turbo stops at first failure by default — use `--continue`
  to see all errors across workspaces
- E2E tests need explicit env in `turbo.json`:
  `"env": ["OAK_API_KEY"]`
- Semantic-release managed packages use
  `"version": "0.0.0-development"`
- Never commit `.turbo/` cache files

## Troubleshooting

Project-specific troubleshooting is in
`docs/operations/troubleshooting.md`. Agent-specific gotchas:

| Symptom | Fix |
|---------|-----|
| Grep tool fails with cursorignore errors | Use `rg` in shell with `2>/dev/null` |
| StrReplace fails on plan files | Unicode quotes (U+2019, U+201C/D) block matching — match on surrounding text or use Python |
| Reviewer reports G1 failures that seem wrong | Re-run specific gates (`wc -l`, `pnpm test:e2e --filter=...`) to verify — reviewers may read stale terminal output |
| Reviewer flags repo name mismatch (oak-open-curriculum-ecosystem vs oak-open-curriculum-ecosystem) | False positive — confirmed three times (2026-02-26 x2, 2026-02-27). The GitHub rename to `oak-open-curriculum-ecosystem` HAS been executed. The local git remote is stale. Docs are correct. Always verify against the user's disposition before acting on this |
| Onboarding reviewer claims files do not exist | Always verify with `glob` or `ls` before acting — reviewers produce consistent false positives on file-existence checks (R2 from 2026-02-26 rerun: all 5 "missing" files existed) |
