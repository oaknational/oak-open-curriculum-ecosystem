# Semantic Search - Navigation Hub

**Status**: Part 1 In Progress (Stream A Complete, Streams B-D Ready)  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Last Updated**: 2025-12-19

---

## Quick Start

For new sessions, read in this order:

1. **Foundation Documents** (MUST READ FIRST)
   - [rules.md](../../directives-and-memory/rules.md) — TDD, quality gates, no type shortcuts
   - [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — All types from schema
   - [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — Test types and TDD approach

2. **Source of Truth** (for all types and available data)
   - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` — **The OpenAPI schema**

3. **Current Work**
   - [Part 1: Search Excellence](part-1-search-excellence.md) — Active plan with four streams
   - [Requirements](requirements.md) — Strategic context, success criteria

---

## Part Overview

```text
═══════════════════════════════════════════════════════════════════
Part 1: Search Excellence                           [🔄 In Progress]
═══════════════════════════════════════════════════════════════════
Done when: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption

  Stream A: Foundation                              ✅ Complete
  Stream B: Relevance Optimisation                  📋 Ready
  Stream C: Query Intelligence                      📋 Blocked on B.2
  Stream D: Infrastructure                          📋 Ready

═══════════════════════════════════════════════════════════════════
Part 2: MCP Natural Language Tools                  [📋 Planned]
═══════════════════════════════════════════════════════════════════
Done when: Agents can search Oak curriculum effectively via MCP

  Stream A: Structured Search Tools
  Stream B: Natural Language Pipeline
  Stream C: Agent Guidance

(Cross-reference: .agent/plans/sdk-and-mcp-enhancements/)

═══════════════════════════════════════════════════════════════════
Part 3: Future Enhancements                         [📋 Future]
═══════════════════════════════════════════════════════════════════

  Stream A: Reference Indices (phase-10)
  Stream B: Entity Extraction (phase-9)
  Stream C: Learning to Rank (phase-11)
  Stream D: Full Curriculum Coverage
  Stream E: Search UI (deferred)
```

---

## Metrics

### Current State

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Standard Query MRR | 0.931 | ≥0.92 | ✅ Met |
| Hard Query MRR | 0.367 | ≥0.50 | ❌ Gap: 36% |
| Zero-hit Rate | 0% | 0% | ✅ Met |
| p95 Latency | ~450ms | ≤1500ms | ✅ Within budget |

### What's Actually Proven

| Claim | Evidence | Status |
|-------|----------|--------|
| Code compiles | `pnpm type-check` passes | ✅ Proven |
| Unit tests pass | `pnpm test` passes | ✅ Proven |
| All quality gates pass | `pnpm check` exits 0 | ✅ Proven |
| Four-retriever improves search | Ablation study | ✅ Proven |
| KS4 filtering reduces results | Not tested live | ❌ Not proven |

---

## Architecture

### Four-Retriever Hybrid Design

```text
Query → [BM25 Content] ─┐
     → [BM25 Structure] ─┼─→ RRF Fusion → Top 10 Results
     → [ELSER Content] ──┤
     → [ELSER Structure]─┘
```

| Retriever | Field Type | Purpose |
|-----------|------------|---------|
| BM25 on Content | Transcript/rollup text | Lexical matching on teaching material |
| ELSER on Content | Transcript/rollup text | Semantic matching on teaching material |
| BM25 on Structure | Curated summary | Lexical matching on metadata |
| ELSER on Structure | Curated summary | Semantic matching on metadata |

### Field Nomenclature

Pattern: `<entity>_content|structure[_semantic]`

| Field | Type | Purpose |
|-------|------|---------|
| `lesson_content` | text | BM25 on transcript |
| `lesson_content_semantic` | semantic_text | ELSER on transcript |
| `lesson_structure` | text | BM25 on summary |
| `lesson_structure_semantic` | semantic_text | ELSER on summary |

---

## Elasticsearch Documentation

| Topic | URL |
|-------|-----|
| Hybrid Search (RRF) | <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html> |
| Linear Retriever | <https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search> |
| Semantic Reranking | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html> |
| ELSER | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html> |
| Inference API | <https://www.elastic.co/guide/en/elasticsearch/reference/current/inference-apis.html> |

---

## Key ADRs

| ADR | Title | Purpose |
|-----|-------|---------|
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Search Evaluation Framework | Metrics, decision criteria |
| [ADR-080](../../../docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) | KS4 Metadata Denormalisation | Tier/examBoard filtering |
| [ADR-075](../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) | Dense Vector Removal | Why E5 was removed |
| [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | ELSER-Only Strategy | Sparse vectors sufficient |

---

## Quality Gates

Run from repo root after any changes:

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

**All gates must pass. No exceptions.**

---

## Key File Locations

### Search Implementation

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/hybrid-search/            # RRF query builders
├── src/lib/search-quality/           # Ground truth, metrics
├── src/lib/indexing/                 # Document transforms
├── smoke-tests/                      # Search quality benchmarks
└── docs/                             # INGESTION-GUIDE, SYNONYMS, etc.
```

### SDK & Field Definitions

```text
packages/sdks/oak-curriculum-sdk/
├── type-gen/typegen/search/field-definitions/  # Index schemas
├── src/mcp/synonyms/                           # Synonyms
└── src/types/generated/api-schema/             # OpenAPI types
```

---

## Document Index

### Active Plans

| Document | Purpose |
|----------|---------|
| [Part 1: Search Excellence](part-1-search-excellence.md) | Current work — four streams |
| [Requirements](requirements.md) | Strategic context, success criteria |

### Reference Plans

| Document | Purpose |
|----------|---------|
| [phase-3-multi-index-and-fields.md](phase-3-multi-index-and-fields.md) | Stream A completed work |
| [phase-4-search-sdk-and-cli.md](phase-4-search-sdk-and-cli.md) | Stream D detailed checkpoints |
| [phase-9-entity-extraction.md](phase-9-entity-extraction.md) | Part 3 reference |
| [phase-10-reference-indices.md](phase-10-reference-indices.md) | Part 3 reference |
| [phase-11-plus-future.md](phase-11-plus-future.md) | Part 3 reference |

### Research & Evaluation

| Document | Purpose |
|----------|---------|
| [search-query-optimization-research.md](../../research/search-query-optimization-research.md) | Stream B/C technical approaches |
| [B-001 Baseline](../../evaluations/experiments/B-001-hard-query-baseline.experiment.md) | Hard query baseline |
| [E-001 Reranking](../../evaluations/experiments/E-001-semantic-reranking.experiment.md) | Semantic reranking experiment |
| [E-002 Query Expansion](../../evaluations/experiments/E-002-query-expansion.experiment.md) | LLM query expansion |
| [E-003 Linear Retriever](../../evaluations/experiments/E-003-linear-retriever.experiment.md) | Weighted fusion experiment |
| [E-004 Phonetic](../../evaluations/experiments/E-004-phonetic-enhancement.experiment.md) | Phonetic matching for misspellings |

### Archive

| Document | Status |
|----------|--------|
| [phase-5-search-ui.md](archive/phase-5-search-ui.md) | Deferred to Part 3 |
| [phase-6-cloud-functions.md](archive/phase-6-cloud-functions.md) | Deferred to Part 3 |
| [phase-7-admin-dashboard.md](archive/phase-7-admin-dashboard.md) | Deferred to Part 3 |
| [phase-8-query-enhancement.md](archive/phase-8-query-enhancement.md) | Superseded by research |

---

## Development Rules

### TDD at All Levels

1. **RED** — Write test first, run it, prove it fails
2. **GREEN** — Write minimal implementation to pass
3. **REFACTOR** — Improve implementation, tests stay green

### Schema-First

All types flow from the OpenAPI schema via `pnpm type-gen`. Never hand-author types.

### No Type Shortcuts

Never use `as`, `any`, `!`, `Record<string, unknown>`. Preserve type information.

### Delete Dead Code

If code is unused, delete it. No commented-out code. No skipped tests.

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-19 | Restructured from Phase to Part → Stream → Task hierarchy |
| 2025-12-17 | Phase 3 code complete |
| 2025-12-15 | Dense vector code removed (ADR-075) |
