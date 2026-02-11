# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-11

---

## Current Priority: MCP Search Integration

SDK extraction is complete (Checkpoints A–E2). The SDK is
production-ready: all service I/O methods return
`Result<T, E>`, comprehensive TSDoc is in place, all
quality gates pass.

**Next step**: Wire the Search SDK into the MCP curriculum
servers so AI agents can use hybrid Elasticsearch search.

**Plan**: [wire-hybrid-search.md](../../plans/semantic-search/post-sdk/mcp-integration/wire-hybrid-search.md)
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
- **Curriculum SDK** (`packages/sdks/oak-curriculum-sdk/`):
  Upstream Oak API types, generated via `pnpm type-gen`.

**DI-ready**: All `process.env` access is centralised in
`src/lib/env.ts` (ESLint-enforced). Product code accepts
config as parameters. The `createCliSdk()` factory maps
env → ES client → SDK instance.

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

### MCP Search Integration (Phase 3)

Wire the Search SDK into the MCP curriculum servers:

- Add `semantic-search` MCP tool calling SDK retrieval
- Pass filter parameters (subject, key stage, tier, etc.)
- Handle `Result<T, E>` errors as MCP error responses
- Ship tool examples mapping user intent to SDK calls
- NL stays in MCP layer (ADR-107), SDK is deterministic

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
5. [wire-hybrid-search.md](../../plans/semantic-search/post-sdk/mcp-integration/wire-hybrid-search.md) — **THE** plan for next work

---

## Three Workspaces

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream Oak API, type-gen |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (34 tests) |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation (934 tests) |

The Search SDK consumes types from the Curriculum SDK.
The Search CLI consumes the Search SDK.

[ADR-107]: /docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md

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
