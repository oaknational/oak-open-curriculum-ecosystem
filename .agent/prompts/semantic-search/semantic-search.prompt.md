# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-12

---

## Current Priority: Search SDK Validation

SDK extraction is complete (Checkpoints A–E2). All service
I/O methods return `Result<T, E>`, comprehensive TSDoc is
in place, all quality gates pass.

**However**, the SDK was completely rewritten and
re-architected during extraction — DI, Result pattern,
service boundaries, query builders, all refactored. Before
wiring it into any consumer, we must thoroughly validate it
against real Elasticsearch to confirm it produces correct
results.

**Next step**: Run the full evaluation suite against a real
ES cluster via the CLI (which now uses SDK code paths) and
confirm MRR/NDCG scores match or exceed baseline.

**Roadmap**: [roadmap.md](../../plans/semantic-search/roadmap.md)

---

## What We Have

A production-ready Elasticsearch-backed semantic search
system split across three workspaces:

- **Search SDK** (`packages/sdks/oak-search-sdk/`): Fully
  implemented retrieval, admin, and observability services
  with dependency injection. All methods return
  `Result<T, E>`. 34 tests.
- **Search CLI** (`apps/oak-search-cli/`): Thin wrapper
  over the SDK providing `oaksearch` commands for search,
  admin, evaluation, and observability. 934 tests.
- **Oak API SDK** (`packages/sdks/oak-curriculum-sdk/`):
  Upstream Oak Open Curriculum API types, generated via
  `pnpm type-gen`.

**DI and credential safety**: The Search SDK requires ES
URL and credentials as explicit constructor arguments —
no environment variable access inside the SDK. Only the
CLI reads env vars (centralised in `src/lib/env.ts`,
ESLint-enforced). The `createCliSdk()` factory maps
env → ES client → SDK instance. All other consumers
(MCP servers, future apps) must provide their own
credentials at construction time.

### Search Pipeline

4-way RRF hybrid search (BM25 + ELSER on both Content
and Structure) for lessons and units, 2-way for threads
and sequences. Query processing includes noise phrase
removal, curriculum phrase detection, and transcript-aware
score normalisation.

**Full details**: [ARCHITECTURE.md](/apps/oak-search-cli/docs/ARCHITECTURE.md)

### Indexes

| Index | Documents | Purpose |
|-------|-----------|---------|
| `oak_lessons` | 12,833 | Primary lesson retrieval |
| `oak_unit_rollup` | 1,665 | Unit search and highlights |
| `oak_threads` | 164 | Curriculum progressions |
| `oak_sequences` | 30 | Subject-phase programmes |

### Ground Truth Baselines

| Index | GTs | MRR | NDCG@10 |
|-------|-----|-----|---------|
| Lessons | 30 | 0.983 | 0.955 |
| Units | 2 | 1.000 | 0.926 |
| Threads | 1 | 1.000 | 1.000 |
| Sequences | 1 | 1.000 | 1.000 |

**Protocol**: [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)

---

## Completed Work

### SDK Extraction (Checkpoints A–E2) ✅

Full details: [search-sdk-cli.plan.md](../../plans/semantic-search/active/search-sdk-cli.plan.md)

- SDK workspace at `packages/sdks/oak-search-sdk/`
- All 16 I/O methods return `Result<T, E>` with
  per-service error types (`RetrievalError`, `AdminError`,
  `ObservabilityError`)
- Comprehensive TSDoc on all functions
- CLI at `apps/oak-search-cli/` with error boundary pattern
- Evaluation rewired to use SDK retrieval code paths

### TSDoc Compliance Fix ✅

Non-standard TSDoc tags fixed at source across the entire
codebase (462 files). `eslint-plugin-tsdoc` added with
`tsdoc/syntax: warn` for regression prevention.

---

## What Needs Doing Next

### Remediation: HTTP 451 + Test Strategy + Documentation

Cross-cutting remediation discovered 2026-02-12 during
transcript endpoint investigation. The upstream API now
returns HTTP 451 (Unavailable For Legal Reasons) instead of
the previously documented 500/404. Our error classification,
E2E tests, and documentation are out of alignment.

**Plan**: [transcript-451-test-doc-remediation.plan.md](../../plans/semantic-search/active/transcript-451-test-doc-remediation.plan.md)

Four workstreams: 451 error handling (generator fix), E2E test
compliance (network IO removal, `process.env` cleanup), stale
documentation updates, directive compliance sweep. Can run in
parallel with SDK validation below.

### Search SDK Validation (Phase 2e)

The SDK was completely rewritten during extraction. Before
any consumer wires in, we must validate against real ES:

- Run full benchmark suite (`oaksearch eval benchmark`)
  via CLI (uses SDK retrieval code paths since Checkpoint E)
- Confirm MRR/NDCG scores match or exceed baseline:
  Lessons MRR 0.983, Units 1.000, Threads 1.000,
  Sequences 1.000
- Run manual searches across all retrieval methods
  (`searchLessons`, `searchUnits`, `searchSequences`,
  `suggest`, `fetchSequenceFacets`)
- Exercise filter combinations (subject, key stage, tier,
  exam board)
- Verify error handling with real ES failure scenarios
- Confirm zero-hit observability flows work end-to-end

### After Validation: MCP Search Integration (Phase 3)

Wire the Search SDK into the MCP curriculum servers
(`apps/oak-curriculum-mcp-stdio/`,
`apps/oak-curriculum-mcp-streamable-http/`), then compare
with existing REST API search and likely replace it:

- Add `semantic-search` MCP tool calling SDK retrieval
- Pass filter parameters (subject, key stage, tier, etc.)
- Handle `Result<T, E>` errors as MCP error responses
- Ship tool examples mapping user intent to SDK calls
- NL stays in MCP layer (ADR-107), SDK is deterministic
- Compare semantic search with existing `search` tool (REST API)
- If superior, replace REST API composite search with SDK-backed search

**Plan**: [wire-hybrid-search.md](../../plans/semantic-search/post-sdk/mcp-integration/wire-hybrid-search.md)

### After MCP: Phase 4 — Search Quality + Ecosystem

Multiple parallel streams:

| Stream | Focus |
|--------|-------|
| GT Expansion | 30 → 80-100 ground truths |
| Search Quality Levels 2-4 | Document relationships → Modern ES → AI enhancement |
| Bulk Data Analysis | Vocabulary mining from curriculum data |
| SDK API | Filter testing across 17 subjects × 4 key stages |
| Subject Domain Model | Move subject knowledge to type-gen time |
| Operations | Governance, latency budgets, failure modes |

**Details**: [roadmap.md](../../plans/semantic-search/roadmap.md)

---

## CLI Commands (`oaksearch`)

| Command Group | Subcommands | SDK Service |
|---------------|-------------|-------------|
| `oaksearch search` | lessons, units, sequences, suggest, facets | `RetrievalService` |
| `oaksearch admin` | setup, reset, status, synonyms, meta, ingest, verify, download, ... | `AdminService` |
| `oaksearch eval` | benchmark (all/lessons/units/threads/sequences), validate, typegen | Pass-through |
| `oaksearch observe` | telemetry, summary, purge | `ObservabilityService` |

---

## Mandatory Reading

Before starting work:

1. [rules.md](../../directives/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives/schema-first-execution.md) — Generator is source of truth
4. [semantic-search-architecture.md](../../directives/semantic-search-architecture.md) — Structure is the foundation
5. [roadmap.md](../../plans/semantic-search/roadmap.md) — Authoritative milestone sequence

---

## Three Workspaces

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Oak API SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream OOC API types, type-gen |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (34 tests) |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation (934 tests) |

The Search SDK consumes types from the Oak API SDK.
The Search CLI consumes the Search SDK.

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm test:e2e:built
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](/apps/oak-search-cli/docs/ARCHITECTURE.md) | Search pipeline architecture |
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and GT process |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Ground truth methodology |
| [ADR-082](/docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first search strategy |
| [ADR-107](/docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) | Deterministic SDK / NL-in-MCP boundary |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Authoritative plan sequence |
| [Multi-Index Plan](../../plans/semantic-search/archive/completed/multi-index-ground-truths.md) | Completed ground truth work |
| [expansion-plan.md](../../plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) | Future GT expansion |
