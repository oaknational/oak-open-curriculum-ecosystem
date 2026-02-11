# Search SDK + CLI Extraction

**Label**: Current priority  
**Status**: 🔄 IN PROGRESS (Checkpoints A–E2 ✅; Checkpoint F next)  
**Parent**: [../README.md](../README.md) | [../roadmap.md](../roadmap.md)  
**Estimated Effort**: SDK + CLI extraction complete; Result pattern + TSDoc complete; remaining: MCP integration (F)  
**Prerequisites**: Ground truth foundation (✅ complete)  
**Last Updated**: 2026-02-11

---

## Context: Three Workspaces

| Workspace | Location | Purpose |
| --- | --- | --- |
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream Oak API, type-gen |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (library) — fully implemented, 34 tests |
| **Search CLI** | `apps/oak-search-cli/` (renamed from `apps/oak-open-curriculum-semantic-search/`) | Operator CLI consuming the SDK; also hosts evaluation (934 tests) |

The Search SDK **consumes types from** the Curriculum
SDK. The Search CLI **consumes** the Search SDK.

---

## Purpose (right problem, right layer)

We have a powerful Elasticsearch-backed semantic search
at `apps/oak-search-cli/`. The Next.js
layers were removed (Feb 2026). The workspace is now pure
TypeScript with all search logic in `src/lib/`, full DI,
and centralised env access.

**Actual usage today**: scripts + `src/lib/**` (indexing,
retrieval, observability, evaluation). All product code
uses DI — `process.env` is centralised in `src/lib/env.ts`
(ESLint-enforced, zero exemptions).

**Required usage next**: an **SDK** consumed by an
**MCP server** and a **CLI**. NL mapping stays in MCP.

**Approach**: the current workspace **stays in place** and
becomes the CLI (renamed to `apps/oak-search-cli/`). The
SDK library code is extracted out to
`packages/sdks/oak-search-sdk/`. The CLI becomes a thin
wrapper that depends on the SDK.

- **SDK** (`packages/sdks/oak-search-sdk/`): retrieval +
  admin + observability services, DI, no CLI concerns
- **CLI** (`apps/oak-search-cli/`): operator commands,
  evaluation (ground truths, benchmarks, validation),
  scripts — all consuming the SDK

Reference research: `.agent/research/elasticsearch/system/semantic-search-sdk-and-cli-extraction.md`

---

## Foundation Documents (MUST READ + RE-COMMIT)

Before starting, and again at each checkpoint below, re-read and explicitly re-commit to:

1. `.agent/directives/rules.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

Additionally, ensure you are still solving the right problem at the right layer:

- **First question**: could it be simpler without compromising quality?
- **Layer question**: is this change best made in the SDK/type-gen layer, the CLI layer, or the MCP layer?

**All quality gates must pass. No exceptions.**

---

## Scope

### In scope

1. **Extract Search SDK** (`packages/sdks/oak-search-sdk/`)
   - Retrieval: structured search + suggestions
     (hybrid BM25 + ELSER via RRF)
   - Admin: ES setup, ingestion, rollups, index
     metadata
   - Observability: zero-hit logging/persistence/
     maintenance
   - **Dependency-injected**: consuming app supplies
     config + clients (no `process.env` inside
     services — already enforced via ESLint)

2. **Rename + reshape current workspace as CLI** ✅
   (`apps/oak-search-cli/`, renamed from
   `apps/oak-open-curriculum-semantic-search/`)
   - Thin wrapper: CLI commands call SDK services
   - Operator-intent commands
     (setup/status/ingest/rollup/telemetry)
   - Hosts all **evaluation**: ground truths,
     benchmarks, validation, experiments
   - Replaces ad-hoc `scripts/` with cohesive CLI

3. **Prepare MCP integration**
   - Express MCP server consumes the SDK
   - NL mapping lives in MCP via comprehensive tool
     examples (not inside SDK)

4. ~~**Retire Next.js runtime**~~ ✅ Complete (Feb 2026)

5. ~~**Workspace tidy-up / DI enforcement**~~ ✅ Complete
   (Feb 2026)
   - `process.env` centralised, ESLint enforced
   - Dead code removed, tests use DI
   - Every function accepts its dependencies as
     parameters — extraction is a file-move exercise

### Explicitly out of scope

- Building a new UI (will live in a different app)
- Building a deployed HTTP API layer
- Relevance re-tuning (pre-SDK work is the
  verification phase for IR correctness)

---

## Architectural Decisions

### 1) Where the SDK lives

**`packages/sdks/oak-search-sdk/`** — sits alongside
the Curriculum SDK in `packages/sdks/`.

### 2) Where the CLI lives

**`apps/oak-search-cli/`** — the original workspace
(`apps/oak-open-curriculum-semantic-search/`) renamed.
This avoids creating a new workspace from scratch; the
existing scripts, evaluation, operations, tests, and
config stay in place. The SDK library code is extracted
out; the CLI keeps everything else and adds a thin
wrapper over the SDK.

### 3) Where evaluation lives

**In the CLI**, not the SDK. Evaluation (ground truths,
benchmarks, validation, experiments) is operator tooling
*about* the search, not the search itself. It consumes
SDK retrieval services via DI (the benchmark runners
already accept a `SearchFunction` parameter).

### 4) SDK public surface: "services"

```typescript
createSearchSdk({ deps, config })
  -> { retrieval, admin, observability }
```

Key rule: **config and clients are provided by the
consumer**. No internal singletons.

### 5) NL parsing responsibility

NL stays in the **MCP layer**. The SDK remains
deterministic. See [ADR-107].

### 6) Types and schema-first discipline

- Search request/response/index doc types flow from
  `@oaknational/oak-curriculum-sdk` generated artefacts.
- If a generated file is involved, **the generator is
  the source of truth** (update templates, rerun
  `pnpm type-gen`).

[ADR-107]: /docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md

---

## Checkpoints (re-read foundation docs at each)

### Checkpoint A — Confirm assumptions + define contract ✅ Complete

- ✅ Next.js layer removed
- ✅ `process.env` centralised in `env.ts` (ESLint enforced)
- ✅ Dead code cleaned up
- ✅ SDK workspace created at `packages/sdks/oak-search-sdk/`
  with package.json, tsconfig, tsup, vitest, eslint configs
- ✅ Service interfaces defined:
  - `RetrievalService` — `searchLessons`, `searchUnits`,
    `searchSequences`, `suggest`, `fetchSequenceFacets`
  - `AdminService` — `setup`, `reset`, `verifyConnection`,
    `listIndexes`, `updateSynonyms`, `ingest`,
    `getIndexMeta`, `setIndexMeta`
  - `ObservabilityService` — `recordZeroHit`,
    `getRecentZeroHits`, `getZeroHitSummary`,
    `persistZeroHitEvent`, `fetchTelemetry`
- ✅ Factory: `createSearchSdk({ deps, config }) -> SearchSdk`
  - `SearchSdkDeps`: `esClient` (ES `Client`), optional `Logger`
  - `SearchSdkConfig`: `indexTarget`, `indexVersion`, `zeroHit`
- ✅ Schema-first boundary documented: curriculum types
  from `@oaknational/oak-curriculum-sdk`, authored types
  for SDK contract, params, results, and ES transport
- ✅ 25 integration tests specify the full contract (GREEN)
  — all three services fully implemented
- ✅ 9 additional unit tests for index resolver
- ✅ Test helpers use `vi.spyOn` on injected Client methods
  returning structurally valid empty responses (no IO)

### Checkpoints B + C + D — Full SDK extraction ✅ Complete

All three services extracted in a single pass (Feb 2026).
25 integration tests GREEN, all quality gates pass.

**Retrieval service** (`src/retrieval/`):
- ✅ 4-way RRF query builders (lessons, units), 2-way (sequences)
- ✅ Query preprocessing: noise removal, curriculum phrase detection
- ✅ Transcript-aware score normalisation (ADR-099)
- ✅ Suggestions: completion + bool_prefix fallback
- ✅ Sequence facet fetching
- ✅ Smart subject filtering (ADR-101, KS4 science variants)

**Admin service** (`src/admin/`):
- ✅ Setup: index creation + synonym upsert via Client API
- ✅ Connection verification, index listing
- ✅ Synonym management (`buildElasticsearchSynonyms`)
- ✅ Index metadata read/write using Result pattern
- ✅ Bulk ingestion from JSON files with doc-type routing
- ✅ ES error type guards (resource exists, not found, mapping)

**Observability service** (`src/observability/`):
- ✅ Instance-level in-memory FIFO store (max 200 events)
- ✅ Zero-hit event recording + optional ES persistence
- ✅ Summary aggregation by scope
- ✅ Telemetry fetching from ES with aggregations

**Internal infrastructure** (`src/internal/`):
- ✅ `EsSearchFn` adapter wrapping `Client.search()`
- ✅ Pure index name resolver (no env reads)
- ✅ Internal ES types (`EsSearchRequest`, `EsSearchResponse`, `EsHit`)
- ✅ 9 unit tests for index resolver

### Checkpoint E — Rename workspace + wire CLI ✅ Complete

- ✅ Renamed `apps/oak-open-curriculum-semantic-search/`
  to `apps/oak-search-cli/`
- ✅ Updated `package.json` name to `@oaknational/search-cli`,
  turbo config, pnpm-workspace.yaml, and all internal references
- ✅ `bin/oaksearch.ts` CLI entry point created with
  commander — ready for subcommand registration
- ✅ tsup build from single entry (`bin/oaksearch.ts`),
  bundled, with shebang banner
- ✅ `package.json` has `bin.oaksearch` pointing to
  built output
- ✅ All legacy `package.json` scripts migrated to use
  the new CLI entry points
- ✅ CLI subcommands wired to SDK services:
  - `oaksearch search` — lessons, units, sequences,
    suggest, facets via `RetrievalService`
  - `oaksearch admin` — setup, reset, status, synonyms,
    meta, plus pass-through orchestration commands
    (ingest, verify, download, sandbox, diagnostics)
  - `oaksearch eval` — benchmark (all/lessons/units/
    threads/sequences), validate, typegen
  - `oaksearch observe` — telemetry, summary, purge
- ✅ `createCliSdk()` factory: env → ES client → SDK
  instance, used by all CLI commands
- ✅ Shared infrastructure:
  - `src/cli/shared/validators.ts` — schema-derived
    type guards (no `as` assertions)
  - `src/cli/shared/pass-through.ts` — script delegation
  - `src/cli/shared/output.ts` — terminal formatting
- ✅ Evaluation rewired to use SDK retrieval:
  - Benchmark query runners use `sdk.retrieval.searchLessons`,
    `searchUnits`, `searchSequences` (same code path
    as production consumers)
  - `SearchFunction` type changed from raw ES request/
    response to SDK params/results
  - Test harnesses and mocks updated to match SDK types
  - Thread benchmarks remain on direct ES (SDK does not
    yet expose thread search)
- ✅ Handler tests: integration tests for search, admin,
  observe handlers using mocked SDK services
- ✅ All quality gates pass: build, type-check, lint, test

### TSDoc Compliance Fix ✅ Complete

Codebase-wide fix of non-standard TSDoc tags at source
(462 files changed, Feb 2026):

- Extended `postProcessTypesSource` in `typegen-core.ts`
  to strip `@description`, `@constant`, `@enum` from
  openapiTS output at generation time
- Deleted `sanitize-docs.ts` and `docs/_typedoc_src/`
  entirely; TypeDoc configs point at `src/` directly
- Moved `schema-bridge.ts` to `src/types/` as real source
- Removed `@module` (84 files), `@fileoverview` (30 files),
  and one-off non-standard tags across the codebase
- Installed `eslint-plugin-tsdoc` with `tsdoc/syntax: warn`
  in `@oaknational/eslint-plugin-standards` for regression
  prevention
- Created `tsdoc.json` configs declaring `@generated` as
  custom modifier tag (root + per-workspace)

### Checkpoint E2 — Result pattern + comprehensive TSDoc ✅ Complete

All SDK service I/O methods now return `Result<T, E>`
using per-service discriminated union error types. All
functions across the SDK and CLI have comprehensive TSDoc
annotations. Full quality gate chain passes (including
test:ui, test:e2e, test:e2e:built, smoke:dev:stub).

**Error types implemented**:

- `RetrievalError` (`es_error | timeout | validation_error
  | unknown`)
- `AdminError` (replaced `IndexMetaError`) (`es_error |
  not_found | mapping_error | validation_error | unknown`)
- `ObservabilityError` (`es_error | unknown`) — async I/O
  methods only; sync pure methods unchanged

**What was done** (~50 files changed):

- All 16 SDK service I/O methods return `Result<T, E>`
  via `ok()`/`err()` wrapping
- Silent error swallowing fixed in observability
  persistence, telemetry fetching, and admin delete
- `ConnectionStatus` and `SynonymsResult` simplified
  (redundant fields removed — `Result` envelope replaces
  `success`/`error`/`connected` flags)
- CLI error boundary: all `.action()` blocks check
  `result.ok`, print error type and message, set
  `process.exitCode = 1`
- Benchmark runners updated to consume `Result`, fail
  fast on `!result.ok`
- Comprehensive TSDoc on all SDK and CLI functions
- Files split by responsibility to maintain max-lines
  with full documentation:
  - `admin-index-operations.ts` (from `create-admin-service.ts`)
  - `retrieval-search-helpers.ts` (from `create-retrieval-service.ts`)
  - `admin-sdk-commands.ts` and `admin-orchestration-commands.ts`
    (from `admin/index.ts`)
- `benchmark-adapters.ts` DRYed with generic `groupEntries<T>`
  (removed eslint max-lines override)
- Directive review: sub-agent audits confirmed compliance
  across all modified files

### Checkpoint F — MCP integration wiring

- Add / update the semantic search MCP tool in the Express MCP server to call SDK services
- Ship comprehensive tool examples mapping user intent to SDK calls
- Keep NL parsing policy in MCP (and test it there)

### Checkpoint G — Retire the Next.js layer ✅ Complete

- ✅ Next.js app layer removed from the build graph
- ✅ `app/`, `tests/`, `public/`, Next.js config,
  Playwright config deleted
- ✅ Dependencies removed (`next`, `react`, `react-dom`,
  `styled-components`, `@oaknational/oak-components`,
  `ai`, `@ai-sdk/openai`)
- ✅ Build/lint/test configs updated to pure TypeScript
  (no JSX, no jsdom, no React plugins)
- ✅ Smoke tests rewritten to call `src/lib/` directly
- ✅ Dead code removed (`query-parser.ts`, `openapi.ts`,
  `openapi.register.ts`, orphaned types)
- ✅ Documentation and `.env.example` updated
- ✅ ADRs 044, 045 superseded; ADR-049 partially
  superseded

### Checkpoint H — Workspace tidy-up ✅ Complete

- ✅ `process.env` centralised in `src/lib/env.ts` with
  `env()`, `optionalEnv()`, and `childProcessEnv()`
- ✅ ESLint `no-restricted-syntax` rule forbids direct
  `process.env` access outside `env.ts` (zero exemptions)
- ✅ All product code refactored to accept config as
  parameters (DI-ready for SDK extraction)
- ✅ All tests refactored to use DI — no `process.env`
  mutations
- ✅ Dead code deleted: `semantic-reranking/` experiment,
  `discover-lessons.ts`, `migrate-transcript-cache.ts`
- ✅ Duplicate ES clients removed
  (`verify-ingestion.ts`, `semantic-reranking/index.ts`)
- ✅ `reset-ttls` moved to `operations/utilities/`
- ✅ `scripts/README.md` corrected (not deprecated)
- ✅ `diagnostics/` added to `.gitignore`
- ✅ `turbo.json` cleaned of stale Next.js references

---

## Quality Gates (mandatory)

Run from repo root, one at a time, no filters:

```bash
pnpm type-gen          # Makes changes
pnpm build             # Makes changes
pnpm type-check
pnpm lint:fix          # Makes changes
pnpm format:root       # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

---

## ES Documentation References

Future adapters should be designed with Elasticsearch-native capabilities in mind:

- [Hybrid retrieval (RRF)](https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html)
- [Semantic search overview](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html)
- [ELSER](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html)

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [../roadmap.md](../roadmap.md)                                                                | Linear milestone sequence |
| [sdk-extraction/README.md](../sdk-extraction/README.md)                                       | SDK extraction overview |
| [semantic-search-sdk-and-cli-extraction.md](../../../research/elasticsearch/system/semantic-search-sdk-and-cli-extraction.md) | Research analysis |
| [four-retriever-implementation.md](../archive/completed/four-retriever-implementation.md)     | Retrieval architecture |
| [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Tier strategy |
