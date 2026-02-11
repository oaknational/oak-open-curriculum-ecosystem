# Napkin

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
