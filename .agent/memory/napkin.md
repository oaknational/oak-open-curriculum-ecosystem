# Napkin

## Session: 2026-02-11 — Checkpoint E2: Result Pattern + TSDoc + Directive Review

### Context

- Checkpoint E2 complete: all SDK service I/O returns `Result<T, E>`, comprehensive TSDoc across SDK and CLI
- Full quality gate chain passes: clean, type-gen, build, type-check, format:root, markdownlint:root, lint:fix, test, test:ui, test:e2e, test:e2e:built, smoke:dev:stub
- Directive review completed with sub-agent audits
- Branch: feat/semantic_search_deployment

### What Was Built

- **Error types**: `AdminError` (replaced `IndexMetaError`), `ObservabilityError` discriminated unions; `RetrievalError` already existed
- **Result wrapping**: All 16 SDK service I/O methods return `Result<T, E>` via `ok()`/`err()`
- **Silent error swallowing fixed**: `observability.persistEvent`, `observability.fetchTelemetry`, `admin.safeDeleteIndex` no longer silently swallow errors
- **Simplified data types**: `ConnectionStatus` (removed `connected`/`error`), `SynonymsResult` (removed `success`/`error`) — redundant with `Result`
- **CLI error boundary**: All command `.action()` blocks check `result.ok`, print `type: message` on error, set `process.exitCode = 1`
- **Benchmark runners**: Updated `SearchFunction`/`UnitSearchFunction`/`SequenceSearchFunction` to return `Result`, fail fast on `!result.ok`
- **TSDoc**: Comprehensive annotations on all SDK and CLI functions, interfaces, types, constants
- **File extractions by responsibility**:
  - `admin-index-operations.ts` from `create-admin-service.ts` (index lifecycle)
  - `retrieval-search-helpers.ts` from `create-retrieval-service.ts` (sequence/unit helpers)
  - `admin-sdk-commands.ts` from `admin/index.ts` (SDK-mapped commands)
  - `admin-orchestration-commands.ts` from `admin/index.ts` (pass-through commands)
- **DRY refactor**: `benchmark-adapters.ts` — eliminated 4 identical grouping functions with generic `groupEntries<T>`, removed eslint max-lines override
- **Pure function extraction**: `calculateBenchmarkMetrics` from `runQuery` to stay under max-lines-per-function while preserving full documentation

### Mistakes Made (and Corrected)

- **CRITICAL: Compressed TSDoc to meet max-lines instead of splitting files** — the rules say "split into smaller files by responsibility", NEVER make files shorter by stripping documentation. Fixed by proper file splits.
- **Ran only `pnpm test` instead of full quality gate chain** — `pnpm test` is only unit+integration tests. The full chain includes test:ui, test:e2e, test:e2e:built, smoke:dev:stub. Must always run the full chain as specified in AGENT.md.
- TSDoc subagent added `@remarks` tags that are unsupported by the tsdoc plugin
- `{@link ./module-path}` syntax triggers `tsdoc-reference-missing-hash` — replaced with backtick module references
- `>` in TSDoc examples must use backslash escape
- `{ value: number }` in TSDoc triggers malformed inline tag — braces look like TSDoc inline tags
- `benchmark-test-harness.ts` needed explicit `LessonsSearchResult` intermediate variable to avoid type incompatibility with `ok()` wrapper

### Directive Review Findings

**SDK (23 files): ALL PASS** — No type shortcuts, no disabled checks, complete TSDoc, no unused code, fail-fast compliance, proper test patterns.

**CLI (25 files): 23 PASS, 2 pre-existing issues in files I touched:**
1. `benchmark-adapters.ts` — Had `/* eslint max-lines: [error, 275] */` override (rule workaround). **FIXED** by DRYing with generic `groupEntries<T>`, file went from 267 to 157 lines.
2. `benchmark-entry-runner.ts` — Catch blocks log errors and create synthetic 0-score results instead of failing fast. **PRE-EXISTING design choice** for benchmark resilience. Errors ARE logged and visible in results, but process exits 0 even when queries fail. Noted for future work.

### Patterns to Remember

- **NEVER compress docs to meet line limits** — always split files by responsibility
- **Full quality gate chain** from AGENT.md: clean, type-gen, build, type-check, format:root, markdownlint:root, lint:fix, test, test:ui, test:e2e, test:e2e:built, smoke:dev:stub
- `{@link ./path}` is NOT valid TSDoc — use backtick references for module paths
- DRY repetitive adapter code with generic functions + callbacks before splitting into separate files
- `toServiceError` helper pattern: catch unknown, check for `statusCode` (ES errors), always provide `type` + `message`
- `safeDeleteIndex` returning `ok(undefined)` for not-found is correct
- `handleStatus` must unwrap TWO Result calls and combine
- Benchmark runners should `throw` on `!result.ok` — fail fast, no Result propagation
- When a pre-existing eslint override exists in a file you touch, fix the root cause (DRY/split) rather than leaving the override

---

## Session: 2026-02-11 — TSDoc Compliance Fix

### Context

- Implemented full TSDoc compliance plan: fix all non-standard tags at source, delete sanitize-docs.ts
- Branch: feat/semantic_search_deployment
- Commit: 506a9cf (pushed)

### What Was Done

- Extended `postProcessTypesSource` in `typegen-core.ts` to strip `@description`, `@constant` (both inline and multi-line), `@enum` from openapiTS output
- Deleted `sanitize-docs.ts` and entire `docs/_typedoc_src/` directory
- Moved `schema-bridge.ts` from `docs/_typedoc_src/types/` to `src/types/` as real source
- Updated all three TypeDoc configs (`typedoc.json`, `typedoc.ai.json`, `typedoc.mcp.json`) to point at `src/` directly
- Removed `docs:prepare` script and simplified all docs commands in package.json
- Removed `@module` from 84+ files across search-cli and curriculum-sdk
- Removed `@fileoverview` from 30+ files across notion-mcp, streamable-http
- Fixed one-off tags: `@property`->list, `@todo`->`@remarks TODO:`, `@default`->`@defaultValue`, `@future`->`@remarks`, `@yields`->`@returns`, `@remark`->`@remarks`, `@test`->plain comment, `@oaknational/*`/`@clerk/*`->backtick-wrapped
- Installed `eslint-plugin-tsdoc` in `@oaknational/eslint-plugin-standards`, added `tsdoc/syntax: warn`
- Created `tsdoc.json` at root and in workspaces with `@generated` files (search-cli, curriculum-sdk)
- All quality gates pass: 0 errors, 462 files changed

### Mistakes Made (and Corrected)

- Initial `@constant` regex only matched multi-line `* @constant` but missed inline `/** @constant */` — added second pattern
- Root `tsdoc.json` not picked up by workspaces because `@microsoft/tsdoc-config` stops at nearest `package.json` — had to create per-workspace `tsdoc.json` files
- `extends` in `tsdoc.json` didn't propagate tags due to version incompatibility between `@microsoft/tsdoc` and `@microsoft/tsdoc-config` — put full tag definition in each workspace's config instead
- `eslint-plugin-tsdoc` was being bundled by tsup which broke config discovery — added to `external` list in tsup.config.ts

### Patterns to Remember

- `openapiTS` emits `/** @constant */` as single-line comments AND `* @constant` as multi-line — regex must handle both
- `@microsoft/tsdoc-config` `loadForFolder()` stops walking up at nearest `package.json` — each workspace needs its own `tsdoc.json`
- ESLint plugins that use dynamic file resolution (`@microsoft/tsdoc-config`) must be marked `external` in tsup bundles
- `perl -i -pe` for single-line replacements, `perl -i -0pe` for multi-line patterns spanning newlines
- The `docs/_typedoc_src` layer was unnecessary — TypeDoc can read `src/` directly with `--skipErrorChecking`

---

## Session: 2026-02-11 — Directive Review + E2 Planning

### Context

- Reviewed all work against `.agent/directives/` — found two non-compliances
- Planned Checkpoint E2 (Result pattern + TSDoc) and inserted it between E and F
- Partially started: `RetrievalError` type added to `types/retrieval-results.ts` (type only)
- Branch: feat/semantic_search_deployment

### Key Findings from Directive Review

- **Result pattern**: Retrieval, admin (non-meta), and observe services throw instead of `Result<T, E>`. The rules say "Don't throw, use Result." This affects ~25 files across SDK, CLI, and benchmarks.
- **TSDoc depth**: Private helpers (`registerLessonsCmd`, etc.) have minimal one-line JSDoc. Rules require "exhaustive, comprehensive TSDoc annotations" on ALL functions.
- **Everything else compliant**: Cardinal Rule (types from schema), no type shortcuts, DI for testability, fail fast, clear boundaries, consistent naming, architectural model — all pass.

### Design Decisions for E2

- **Per-service error types**: `RetrievalError`, `AdminError` (replaces `IndexMetaError`), `ObservabilityError`
- **Sync observe methods stay as-is**: `getRecentZeroHits`, `getZeroHitSummary` are pure in-memory, cannot fail
- **TSDoc standard**: summary + `@param` + `@returns` on everything; `@example` on public APIs

### Partial Changes in Working Tree

- `types/retrieval-results.ts` has `RetrievalError` type definition added (not yet integrated)
- `.prettierignore` fixed (old workspace path → `oak-search-cli`)
- SDK `README.md` created at `packages/sdks/oak-search-sdk/README.md`

### Patterns to Remember

- When a directive review reveals significant work, update the plan BEFORE coding
- Per-service error types are cleaner than a unified `SearchSdkError` — each service has different failure modes
- `@oaknational/result` has `ok()`, `err()`, `isOk()`, `isErr()`, `unwrap()`, `map()`, `flatMap()`, `mapErr()`, `unwrapOr()`, `unwrapOrElse()` — rich utility set

---

## Session: 2026-02-11 — Documentation Consolidation

### Context

- Post-Checkpoint E documentation sweep
- Updated all plans, prompts, and roadmap to reflect current reality
- Fixed stale workspace name references
- Created SDK README from ephemeral plan content

### What Was Done

- Updated `semantic-search.prompt.md`: now reflects Checkpoint E complete, F is next priority
- Updated `search-sdk-cli.plan.md`: fixed tautological "renamed from" references, updated status header and context table
- Updated `roadmap.md`: marked Phase 2 complete, unblocked Phase 3 (MCP integration), fixed execution order diagram
- Fixed `ARCHITECTURE.md`: replaced "being retired" note with factual "was retired" statement
- Fixed `README.md`: updated System Topology diagram to reference SDK
- Fixed `.prettierignore`: updated stale `oak-open-curriculum-semantic-search` path to `oak-search-cli`
- Created `packages/sdks/oak-search-sdk/README.md`: permanent documentation for the SDK (usage, architecture, consumers)
- `.cursorignore` has a stale reference but is system-managed (cannot be edited by agent)

### Patterns to Remember

- Session prompts in `.agent/prompts/` should be updated at the end of each session, not just napkin
- Plan documents should use the old name in "renamed from" clauses, not the current name (tautology)

---

## Session: 2026-02-11 — Checkpoint E: CLI Rename + Wiring

### Context

- Checkpoint E complete: workspace renamed, CLI wired to SDK, evaluation rewired
- 934 tests GREEN (82 test files), all quality gates pass
- Branch: feat/semantic_search_deployment

### What Was Built

- `src/cli/shared/` — `createCliSdk`, validators (type guards), pass-through helper, output formatting
- `src/cli/search/` — lessons/units/sequences/suggest/facets via RetrievalService
- `src/cli/admin/` — setup/reset/status/synonyms/meta via AdminService + pass-through orchestration
- `src/cli/observe/` — telemetry/summary via ObservabilityService + purge pass-through
- `src/cli/eval/` — benchmark/validate/typegen pass-throughs
- Evaluation rewired: benchmark runners use `sdk.retrieval.searchLessons` etc.
- All legacy `package.json` scripts migrated to CLI entry points

### What Works

- Shared `registerPassThrough` eliminates process.env lint errors (omitting env uses Node.js default)
- Shared `validators.ts` with `isSubject`/`isKeyStage`/`isSearchScope` type guards eliminates all `as` assertions
- Breaking command registration into small functions (`registerLessonsCmd` etc.) keeps under 50-line limit
- `isIndexMetaDoc` from SDK validates JSON.parse output without unsafe assignment
- `registerBashPassThrough` handles shell scripts (alias-swap.sh)

### Mistakes Made (and Corrected)

- Forgot the units benchmark runner also had `as SearchSubjectSlug` — caught by second lint pass
- Added subject mapping lines to `runUnitQuery` which pushed it over 50-line function limit — extracted `toSearchSubject` and `extractUnitSlugs` helpers
- `JSON.parse()` returns `any` — fixed with `const parsed: unknown = JSON.parse(json)` + `isIndexMetaDoc` guard
- Pass-through commands initially used `env: process.env` explicitly — removed since it's the default

### Patterns to Remember

- `const parsed: unknown = JSON.parse(json)` is the correct pattern for avoiding `no-unsafe-assignment`
- Use `isSubject()` then fallback to `'science'` for `AllSubjectSlug → SearchSubjectSlug` mapping (KS4 variants)
- Omit `env` from `execFileSync` options — Node.js inherits `process.env` by default
- `max-lines-per-function` (50 lines) — extract per-command registration functions
- Commander `this.args` in `function action(this: Command)` avoids unused parameter lint errors

---

## Session: 2026-02-10 — SDK Full Extraction (Checkpoints B+C+D)

### Context

- Checkpoints A–D complete: SDK workspace with all three services implemented
- 34 tests GREEN (25 integration + 9 unit), all quality gates pass
- Branch: feat/semantic_search_deployment (ahead of origin)
- Next: Checkpoint E (CLI rename + subcommand wiring)

### What Was Built

- `src/internal/` — ES search adapter (`EsSearchFn`), index resolver, internal types
- `src/retrieval/` — 4-way RRF query builders, query processing, suggestions, facets, score normalisation
- `src/admin/` — Setup, connection, listing, synonyms, index-meta (Result pattern), bulk ingest
- `src/observability/` — Instance-level FIFO store, ES persistence, telemetry queries
- `src/create-search-sdk.ts` — Real factory replacing the stub
- Test helpers — `vi.spyOn` on Client methods, structurally valid empty responses

### What Works

- The DI pattern is clean — extraction worked as a file-move + adaptation exercise
- Types flowing from Curriculum SDK prevented shape mismatches
- `vi.spyOn` on the injected Client is the right mocking strategy — no type assertions needed
- Splitting files to stay under 250-line max-lines rule works well for modularity
- ES client v9 uses `document` not `body` for `client.index()` calls
- Synonym sets need `[...synonymSet.synonyms_set]` to convert readonly to mutable

### Mistakes Made (and Corrected)

- Initially created `ZeroHitEvent` with `query` field — the schema uses `text`
- Used `body` parameter for `client.index()` — ES v9 uses `document`
- Type assertions (`as`) crept in during initial porting — all replaced with type guards
- Files exceeded 250-line limit — had to split into `index-meta.ts`, `ingest.ts`, `es-error-guards.ts`, `zero-hit-telemetry.ts`
- `buildSearchParams` complexity exceeded 8 — split into `assignQueryOrRetriever` + `assignOptionalFields`
- `toMappingParams` returned `unknown` for settings/mappings — needed `estypes.IndicesIndexSettings` + `estypes.MappingTypeMapping`
- Suggestion items need `url` and `contexts` fields, not just `label` and `scope`
- `Record<string, unknown>` is banned — used `isHighlightRecord` type guard instead
- `Object.keys()` is restricted — used `for...in` with `hasOwnProperty` guard

### Patterns to Remember

- ES client v9: `document` not `body` for indexing
- ES client v9: spread readonly arrays before passing to mutable params
- `isPlainObject` type guard satisfies both `IndicesIndexSettings` and `MappingTypeMapping`
- `isKnownSubject` type guard replaces `subject as keyof typeof SUBJECT_TO_PARENT`
- `extractStatusCode` centralises ES error code extraction without assertions
- `for...in` + `Object.prototype.hasOwnProperty.call()` for iterating unknown objects
