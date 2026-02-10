# Semantic Search — Session Entry Point

**Last Updated**: 2026-02-10

---

## Current Priority: SDK Extraction

Ground truths are complete across all four indexes. The Next.js UI and HTTP API layers have been removed (Feb 2026). The immediate priority is extracting the search capability into a dedicated SDK and CLI.

**Plan**: [search-sdk-cli.md](../../plans/semantic-search/active/search-sdk-cli.md)  
**Roadmap**: [roadmap.md](../../plans/semantic-search/roadmap.md)

---

## What We Have

A powerful Elasticsearch-backed semantic search capability at `apps/oak-open-curriculum-semantic-search/`. The core search logic lives in `src/lib/`. The workspace is a pure TypeScript library — the Next.js UI and HTTP API layers were removed in Feb 2026 (ADRs 044, 045 superseded; 049 partially superseded).

### Search Pipeline

4-way RRF hybrid search (BM25 + ELSER on both Content and Structure) for lessons and units, 2-way for threads and sequences. Query processing includes noise phrase removal, curriculum phrase detection, and transcript-aware score normalisation.

**Full details**: [ARCHITECTURE.md](/apps/oak-open-curriculum-semantic-search/docs/ARCHITECTURE.md)

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

**Protocol**: [Ground Truth Protocol](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/ground-truth-protocol.md)

---

## What We Are Building

### Search SDK (`packages/libs/search-sdk/`)

Public API: `createSearchSdk({ deps, config }) -> { retrieval, admin, observability }`

- **Retrieval**: structured search + suggestions (hybrid BM25 + ELSER via RRF)
- **Admin**: ES setup, ingestion, rollups, index metadata
- **Observability**: zero-hit logging/persistence/maintenance
- **Dependency-injected**: consuming app supplies config + clients

### Search CLI (`packages/tools/search-cli/`)

First-class CLI workspace consuming the SDK. Replaces ad-hoc `scripts/` entrypoints with cohesive operator-intent commands.

### Key Architectural Decision

NL parsing stays in the **MCP layer**. The SDK remains deterministic. See [ADR-107](/docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md).

---

## Mandatory Reading

Before starting work:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth
4. [semantic-search-architecture.md](../../directives-and-memory/semantic-search-architecture.md) — Structure is the foundation
5. [search-sdk-cli.md](../../plans/semantic-search/active/search-sdk-cli.md) — **THE** plan for this work

---

## Two SDKs

| SDK | Location | Purpose |
|-----|----------|---------|
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/` | Access to upstream Oak API, type-gen |
| **Search SDK** | To be: `packages/libs/search-sdk/` | Elasticsearch-backed semantic search |

The Search SDK **consumes types from** the Curriculum SDK but is a separate concern.

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
| [ARCHITECTURE.md](/apps/oak-open-curriculum-semantic-search/docs/ARCHITECTURE.md) | Search pipeline architecture |
| [Ground Truth Protocol](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and GT process |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Ground truth methodology |
| [ADR-082](/docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first search strategy |
| [ADR-107](/docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md) | Deterministic SDK / NL-in-MCP boundary |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Authoritative plan sequence |
| [Multi-Index Plan](../../plans/semantic-search/archive/completed/multi-index-ground-truths.md) | Completed ground truth work |
| [expansion-plan.md](../../plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) | Future GT expansion |
