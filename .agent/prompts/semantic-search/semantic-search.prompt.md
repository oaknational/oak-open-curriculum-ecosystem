# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-11

---

## Current Priority: Result Pattern + TSDoc — Checkpoint E2

Checkpoints A–E are complete: the SDK is fully implemented
with 34 tests, and the CLI is renamed with all subcommands
wired to SDK services. 934 tests pass in the CLI workspace
(82 test files). All quality gates are green.

**A directive review identified two non-compliances** that
must be fixed before the MCP server (Checkpoint F) consumes
the SDK:

1. **Result pattern**: All three SDK services throw on
   failure instead of returning `Result<T, E>`. The rules
   say "Don't throw, use the result pattern."
2. **TSDoc depth**: Private helpers and several public APIs
   lack the exhaustive TSDoc annotations the rules require.

**Next step**: Implement Checkpoint E2 — convert all SDK
services to use `Result<T, E>` and add comprehensive TSDoc
with examples across all new code.

**Plan**: [search-sdk-cli.plan.md](../../plans/semantic-search/active/search-sdk-cli.plan.md)
**Roadmap**: [roadmap.md](../../plans/semantic-search/roadmap.md)

---

## What We Have

A production-ready Elasticsearch-backed semantic search
system split across three workspaces:

- **Search SDK** (`packages/sdks/oak-search-sdk/`): Fully
  implemented retrieval, admin, and observability services
  with dependency injection. 34 tests.
- **Search CLI** (`apps/oak-search-cli/`): Thin wrapper
  over the SDK providing `oaksearch` commands for search,
  admin, evaluation, and observability. 934 tests (82 files).
- **Curriculum SDK** (`packages/sdks/oak-curriculum-sdk/`):
  Upstream Oak API types, generated via `pnpm type-gen`.

**DI-ready**: All `process.env` access is centralised in
`src/lib/env.ts` (ESLint-enforced). Product code accepts
config as parameters. The `createCliSdk()` factory maps
env → ES client → SDK instance.

### Search Pipeline

4-way RRF hybrid search (BM25 + ELSER on both Content and Structure) for lessons and units, 2-way for threads and sequences. Query processing includes noise phrase removal, curriculum phrase detection, and transcript-aware score normalisation.

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

## Checkpoint E2 — What Needs Doing

### Result Pattern (~25 files)

Convert all SDK service methods that can fail to return
`Result<T, E>` using per-service error types:

| Service | Error Type | Variants |
|---------|-----------|----------|
| Retrieval | `RetrievalError` | `es_error`, `timeout`, `validation_error`, `unknown` |
| Admin | `AdminError` (replaces `IndexMetaError`) | `es_error`, `not_found`, `mapping_error`, `validation_error`, `unknown` |
| Observability | `ObservabilityError` | `es_error`, `unknown` |

Sync observe methods (`getRecentZeroHits`,
`getZeroHitSummary`) stay as-is — they are pure
in-memory operations that cannot fail.

**Partial progress**: `RetrievalError` type definition
has been added to `types/retrieval-results.ts` (type only,
not yet integrated into the interface or implementation).

### TSDoc Standard

Every function (public or private) gets:
- One-sentence summary
- `@param` for each parameter
- `@returns` description
- `@example` block on all public API surfaces

### Execution Phases

1. SDK types + interfaces
2. SDK implementation (`ok()`/`err()` wrapping)
3. SDK integration tests
4. CLI handlers + handler tests
5. Benchmark query runners
6. TSDoc pass (all files)
7. Quality gates + docs

---

## CLI Commands (`oaksearch`)

| Command Group | Subcommands | SDK Service |
|---------------|-------------|-------------|
| `oaksearch search` | lessons, units, sequences, suggest, facets | `RetrievalService` |
| `oaksearch admin` | setup, reset, status, synonyms, meta, ingest, verify, download, ... | `AdminService` |
| `oaksearch eval` | benchmark (all/lessons/units/threads/sequences), validate, typegen | Pass-through |
| `oaksearch observe` | telemetry, summary, purge | `ObservabilityService` |

---

## After E2: Checkpoint F — MCP Integration Wiring

Wire the semantic search MCP tool in the Express MCP
server to call SDK services:

- Add/update the search tool to use `createSearchSdk()`
- Ship comprehensive tool examples mapping user intent
  to SDK calls
- Keep NL parsing policy in MCP (and test it there)

**Key Decision**: NL stays in the **MCP layer**. The SDK
remains deterministic. See [ADR-107].

---

## Mandatory Reading

Before starting work:

1. [rules.md](../../directives/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives/schema-first-execution.md) — Generator is source of truth
4. [semantic-search-architecture.md](../../directives/semantic-search-architecture.md) — Structure is the foundation
5. [search-sdk-cli.plan.md](../../plans/semantic-search/active/search-sdk-cli.plan.md) — **THE** plan for this work

---

## Three Workspaces

| Workspace | Location | Purpose |
|-----------|----------|---------|
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/` | Upstream Oak API, type-gen |
| **Search SDK** | `packages/sdks/oak-search-sdk/` | ES-backed semantic search (fully implemented, 34 tests) |
| **Search CLI** | `apps/oak-search-cli/` | Operator CLI + evaluation (934 tests, 82 files) |

The Search SDK consumes types from the Curriculum SDK.
The Search CLI consumes the Search SDK.

[ADR-107]: /docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
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
