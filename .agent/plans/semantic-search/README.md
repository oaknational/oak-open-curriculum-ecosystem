# Semantic Search - Navigation Hub

**Status**: Part 1 ACTIVE — Tier 1: B.5 Phrase Enhancement (IMPLEMENTED, AWAITING VALIDATION)  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Strategy**: [ADR-082: Fundamentals-First](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)  
**Last Updated**: 2025-12-23 18:00 UTC

---

## ⚠️ Quality Gates NOT VERIFIED — B.5 Incomplete (2025-12-23)

**Quality gates have NOT been verified after B.5 implementation.** The experiment to measure MRR impact has also NOT been run.

| Gate | Status |
|------|--------|
| **Quality gates** | ❌ **NOT VERIFIED** — must run full suite after B.5 merge |
| Index validation | ✅ 436 lessons, 36 units, 163 synonyms |
| B.5 Implementation | ✅ Code merged |
| **B.5 Validation** | ❌ **NOT DONE** — must run `pnpm eval:diagnostic` |
| Latest MRR | 0.369 (BEFORE phrase boosting — needs re-measurement) |

**FIRST STEP**: Run quality gates from repo root. Fix any failures before proceeding.

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| **[current-state.md](current-state.md)** | Current metrics, index status, known issues |
| **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** | Chronological experiment history |
| **[Part 1: Search Excellence](part-1-search-excellence.md)** | Active plan with tier-based streams |

---

## Quick Start

For new sessions, read in this order:

1. **Foundation Documents** (MUST READ FIRST)
   - [rules.md](../../directives-and-memory/rules.md) — TDD, quality gates, no type shortcuts
   - [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — All types from schema
   - [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — Test types and TDD approach
   - [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — **Fundamentals-first strategy**

2. **Source of Truth** (for all types and available data)
   - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` — **The OpenAPI schema**

3. **Current State & History**
   - [current-state.md](current-state.md) — Current metrics and known issues
   - [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) — Experiment history

4. **Current Work**
   - [Part 1: Search Excellence](part-1-search-excellence.md) — Active plan with tier-based streams
   - [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) — Strategic roadmap

---

## Strategic Direction

> "We should be able to do an excellent job with traditional methods, and an amazing job with non-AI recent search methods, and a phenomenal job once we take that already optimised approach and add AI into the mix."

**Semantic Reranking was REJECTED** with a -16.8% regression. This led to a strategic pivot:

```text
                           ┌─────────────────┐
                           │   PHENOMENAL    │  ← Tier 4: AI Enhancement (DEFERRED)
                       ┌───┴─────────────────┴───┐
                       │       EXCELLENT         │  ← Tier 3: Modern ES Features
                   ┌───┴─────────────────────────┴───┐
                   │           VERY GOOD             │  ← Tier 2: Document Relationships
               ┌───┴─────────────────────────────────┴───┐
               │              GOOD                       │  ← Tier 1: Search Fundamentals
               │              ← WE ARE HERE              │
               └─────────────────────────────────────────┘
```

---

## Part Overview

```text
═══════════════════════════════════════════════════════════════════
Part 1: Search Excellence (Fundamentals-First)      [🔄 In Progress]
═══════════════════════════════════════════════════════════════════
Done when: Hard Query MRR ≥0.50, Search SDK ready for MCP consumption

  Stream A: Foundation                              ✅ Complete
  Stream B: Tier 1 — Search Fundamentals            🔄 In Progress
    B.1 Baseline                                    ✅ Complete
    B.2 Semantic reranking                          ❌ Rejected
    B.3 Comprehensive synonyms                      ✅ Complete (163 deployed)
    B.4 Noise filtering                             ✅ Complete (+16.8% MRR)
    B.5 Phrase matching                             🔄 IMPL DONE, VALIDATION PENDING
  Stream C: Tier 2 — Document Relationships         📋 After Tier 1
  Stream D: Tier 3 — Modern ES Features             📋 After Tier 2
  Stream E: AI Enhancement                          ⏸️ DEFERRED
  Stream F: Infrastructure                          📋 Ready

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

For current metrics, index status, and known issues, see **[current-state.md](current-state.md)**.

### Tier Advancement Criteria

| Tier | MRR Target | Exit Criteria |
|------|------------|---------------|
| **Tier 1** | ≥0.45 | Synonyms, noise, phrases complete |
| **Tier 2** | ≥0.55 | Cross-reference demonstrably helps |
| **Tier 3** | ≥0.60 | Parameters evidence-based |
| **Tier 4** | ≥0.75 | Only if Tiers 1-3 plateau |

### What's Actually Proven

| Claim | Evidence | Status |
|-------|----------|--------|
| Code compiles | `pnpm type-check` passes | ✅ Proven |
| Unit tests pass | `pnpm test` passes (88 files, 490 tests) | ✅ Proven |
| All quality gates pass | `pnpm check` exits 0 | ✅ Proven |
| Test isolation works | `isolate: true, pool: 'forks'` | ✅ Proven (2025-12-22) |
| Exit codes report failures correctly | Vitest exits 1 on failure | ✅ Proven (2025-12-22) |
| Four-retriever improves search | Ablation study | ✅ Proven |
| Semantic reranking improves search | Experiment rejected | ❌ Disproven |

### ✅ Ingestion Complete — Validated (2025-12-22)

**All ingestion issues resolved. Complete data indexed. Baselines re-measured. Ready for experiments.**

| Milestone | Status |
|-----------|--------|
| Lesson ingestion (ADR-083) | ✅ 436 lessons (was 314) |
| Unit `lesson_count` fixed | ✅ 36/36 units correct |
| Thread fields populated | ✅ All units have `thread_slugs` |
| Bulk download validation | ✅ 436 lessons, 36 units match exactly |
| Fresh re-ingestion | ✅ 2025-12-22 18:47 UTC |
| Baselines re-measured | ✅ 2025-12-22 20:29 UTC |

**Root Cause**: Upstream API pagination bug (unfiltered endpoint returns 431/436 lessons).

**Fix**: `fetchAllLessonsByUnit()` workaround. Documented in API wishlist.

**Current Metrics (Complete Data)**:
- Standard queries: Lesson 0.944, Unit 0.988 ✅ Excellent
- Hard queries: Lesson 0.316, Unit 0.856 ⚠️ Lessons need improvement

**Full report**: [COMPLETION-REPORT-2025-12-22.md](../quality-and-maintainability/COMPLETION-REPORT-2025-12-22.md)

See [current-state.md](current-state.md) for full metrics.

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

### Data Assets We Have (But Don't Fully Exploit)

| Asset | Currently Used? | Tier to Address |
|-------|-----------------|-----------------|
| Lesson transcripts | ✅ Yes | — |
| Curated summaries | ✅ Yes | — |
| Keywords | ✅ Yes (boosted) | — |
| **Lesson→Unit relationship** | ❌ Not used | **Tier 2** |
| **Unit→Thread relationship** | ❌ Not used | **Tier 2** |
| **Thread progression** | ❌ Not used | **Tier 2** |

### Field Nomenclature

Pattern: `<entity>_content|structure[_semantic]`

| Field | Type | Purpose |
|-------|------|---------|
| `lesson_content` | text | BM25 on transcript |
| `lesson_content_semantic` | semantic_text | ELSER on transcript |
| `lesson_structure` | text | BM25 on summary |
| `lesson_structure_semantic` | semantic_text | ELSER on summary |

---

## Key ADRs

| ADR | Title | Purpose |
|-----|-------|---------|
| [ADR-083](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) | **Complete Lesson Enumeration** | Fix ingestion gap |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | **Fundamentals-First Strategy** | Tier prioritisation |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Search Evaluation Framework | Metrics, decision criteria |
| [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) | SDK Domain Synonyms | Synonym management |
| [ADR-080](../../../docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) | KS4 Metadata Denormalisation | Tier/examBoard filtering |
| [ADR-075](../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) | Dense Vector Removal | Why E5 was removed |
| [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | ELSER-Only Strategy | Sparse vectors sufficient |

---

## Elasticsearch Documentation

| Topic | URL |
|-------|-----|
| Search Relevance | <https://www.elastic.co/docs/solutions/search/full-text/search-relevance> |
| Synonyms | <https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-synonym-tokenfilter.html> |
| Terms Lookup | <https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html#query-dsl-terms-lookup> |
| More Like This | <https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html> |
| Hybrid Search (RRF) | <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html> |
| Linear Retriever | <https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search> |
| ELSER | <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html> |
| Inference API | <https://www.elastic.co/guide/en/elasticsearch/reference/current/inference-apis.html> |

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
├── evaluation/
│   ├── analysis/                     # Measurement scripts (console reports)
│   └── experiments/
│       ├── current/                  # Active experiments (vitest)
│       └── historical/               # Rejected experiments (learning)
├── operations/
│   ├── ingestion/                    # Data pipeline tooling
│   ├── observability/                # Monitoring and cleanup
│   ├── infrastructure/               # ES management scripts
│   └── utilities/                    # Helper scripts
├── smoke-tests/                      # Search quality benchmarks
└── docs/                             # INGESTION-GUIDE, SYNONYMS, etc.
```

### SDK & Field Definitions

```text
packages/sdks/oak-curriculum-sdk/
├── type-gen/typegen/search/field-definitions/  # Index schemas
├── src/mcp/synonyms/                           # Synonyms (ADR-063)
└── src/types/generated/api-schema/             # OpenAPI types
```

---

## Document Index

### Current State & History

| Document | Purpose |
|----------|---------|
| [current-state.md](current-state.md) | **Current metrics**, index status, known issues |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | **Chronological history** — what happened and why |

### Active Plans

| Document | Purpose |
|----------|---------|
| [Part 1: Search Excellence](part-1-search-excellence.md) | Current work — tier-based streams |
| [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap — what to try next |

### Experiments & Analysis

**Analysis Scripts** (measurement & reporting):

- `pnpm eval:diagnostic` — 18-query diagnostic analysis by pattern
- `pnpm eval:per-category` — Hard query baseline by category
- See `evaluation/analysis/README.md` for details

**Experiments** (hypothesis testing):

- **Current** (`evaluation/experiments/current/`):
  - `hybrid-superiority.experiment.ts` — Validates 4-retriever hybrid ✅
  - `mcp-comparison.experiment.ts` — Cross-validation with MCP tools ✅
- **Historical** (`evaluation/experiments/historical/`):
  - `semantic-reranking/` — B.2 rejected (-16.8% regression) ❌

**Experiment Documents**:

| Document | Status | Notes |
|----------|--------|-------|
| [hard-query-baseline](../../evaluations/baselines/hard-query-baseline.md) | ✅ Complete | Baseline data |
| [semantic-reranking](../../evaluations/experiments/semantic-reranking.experiment.md) | ❌ Rejected | -16.8% regression |
| [comprehensive-synonym-coverage](../../evaluations/experiments/comprehensive-synonym-coverage.experiment.md) | ✅ Complete | +3.5% MRR |
| [query-expansion](../../evaluations/experiments/query-expansion.experiment.md) | ⏸️ Deferred | Tier 4 |
| [linear-retriever](../../evaluations/experiments/linear-retriever.experiment.md) | 📋 Planned | Tier 3 |
| [phonetic-enhancement](../../evaluations/experiments/phonetic-enhancement.experiment.md) | 📋 Low priority | Misspelling already 0.833 |

### Reference Plans

| Document | Purpose |
|----------|---------|
| [phase-3-multi-index-and-fields.md](phase-3-multi-index-and-fields.md) | Stream A completed work |
| [phase-4-search-sdk-and-cli.md](phase-4-search-sdk-and-cli.md) | Stream F detailed checkpoints |
| [phase-9-entity-extraction.md](phase-9-entity-extraction.md) | Part 3 reference |
| [phase-10-reference-indices.md](phase-10-reference-indices.md) | Part 3 reference |
| [phase-11-plus-future.md](phase-11-plus-future.md) | Part 3 reference |

### Research

| Document | Purpose |
|----------|---------|
| [search-query-optimization-research.md](../../research/search-query-optimization-research.md) | Technical approaches |

### Archive

| Document | Status |
|----------|--------|
| [phase-5-search-ui.md](archive/phase-5-search-ui.md) | Deferred to Part 3 |
| [phase-6-cloud-functions.md](archive/phase-6-cloud-functions.md) | Deferred to Part 3 |
| [phase-7-admin-dashboard.md](archive/phase-7-admin-dashboard.md) | Deferred to Part 3 |
| [phase-8-query-enhancement.md](archive/phase-8-query-enhancement.md) | Superseded by research |

---

## Development Rules

### Fundamentals First (ADR-082)

1. **Tier 1**: Synonyms, phrase matching, noise filtering
2. **Tier 2**: Document relationships (Unit→Lesson, threads)
3. **Tier 3**: RRF tuning, Linear Retriever, field boosting
4. **Tier 4**: AI (only when Tiers 1-3 plateau)

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

## How to Update Documentation After Changes

When metrics change (after an experiment or system change):

1. Run the relevant smoke tests to measure new values
2. Update the metrics tables in [current-state.md](current-state.md)
3. Update the "Last Updated" date in this file and current-state.md
4. **Add an entry to [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — See "How to Add an Entry" section in that file
5. Update [part-1-search-excellence.md](part-1-search-excellence.md) if experiment status changes

**Critical**: The experiment log is the historical record. Always update it after completing work.

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-22 | Ingestion data quality fixes complete — all blockers resolved |
| 2025-12-22 | Status updated to ACTIVE — ready for Tier 1 experiments |
| 2025-12-22 | Test isolation architecture fix complete — all quality gates pass |
| 2025-12-22 | Added assumptions to verify section in current-state.md |
| 2025-12-20 | Metrics section now links to current-state.md (single source of truth) |
| 2025-12-20 | Removed experiment IDs (E-xxx, F-xxx, B-xxx); use descriptive names only |
| 2025-12-20 | Added current-state.md, EXPERIMENT-LOG.md; deleted requirements.md, snagging.md |
| 2025-12-19 | Semantic reranking rejected; ADR-082 created; tier-based strategy adopted |
| 2025-12-19 | Restructured from Phase to Part → Stream → Task hierarchy |
| 2025-12-17 | Phase 3 code complete |
| 2025-12-15 | Dense vector code removed (ADR-075) |
