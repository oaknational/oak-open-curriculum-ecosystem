# Semantic Search Current State

**Last Updated**: 2026-01-10
**Status**: 🔄 **Category Consistency + Benchmark Output Improvements Required**
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
**Current Plan**: [m3-revised-phase-aligned-search-quality.md](active/m3-revised-phase-aligned-search-quality.md)

This is THE authoritative source for current system metrics.

---

## 🔄 Immediate Priorities

### 1. Add `pedagogical-intent` queries to ALL entries

**Problem**: Only `maths/secondary` has `pedagogical-intent` queries. 29/30 entries are missing this category.

**Why**: ALL 5 categories are now REQUIRED for consistent cross-subject benchmarking. Without consistent coverage, we cannot make meaningful comparisons.

### 2. Update benchmark output to show per-category metrics

**Problem**: Current output shows only aggregate metrics per subject/phase.

**Required**: Every run must display measured/target/difference/status for every subject-phase-category combination.

---

## Ground Truth Validation Status (2026-01-10)

Three validation stages status:

### Three-Stage Validation Model

| Stage | Status | What It Proves |
|-------|--------|----------------|
| **1. Type-Check** | ✅ PASS | Data integrity (required fields) |
| **2. Runtime Validation** | ✅ PASS | Semantic rules (16 checks) |
| **3. Qualitative Review** | ✅ COMPLETE | Production readiness |

### Stage 3 Qualitative Review Results (2026-01-09)

| Metric | Value |
|--------|-------|
| Total queries reviewed | 474 |
| Total slugs validated | 1,290 |
| Subject/phase entries | 30 |
| Issues found | 1 |
| Issues fixed | 1 |
| Deep verification queries | 15 (maths + english sampling) |

**Issue fixed**: `times tables year 3` category corrected from `cross-topic` to `precise-topic`.

**Documentation**: [Stage 3 Review Progress](../../reviews/stage-3-review-progress.md)

### Validation Infrastructure

| Aspect | Status |
|--------|--------|
| Bulk data parsing | ✅ Correct `.lessons[]` + `lessonSlug` |
| Slug validation | ✅ Validates against 12,320 slugs |
| Type generation | ✅ Branded types + Zod schemas |
| Validation checks | ✅ **16 comprehensive checks** |
| Cross-subject check | ✅ Slug-to-subject mapping |
| Category coverage | ✅ Entry-level minimum enforcement |
| Description required | ✅ All 474 queries have descriptions |
| Quality analysis | ✅ `pnpm ground-truth:analyze` |

### Available Scripts

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm ground-truth:validate  # Run all 16 validation checks
pnpm ground-truth:analyze   # Detailed quality breakdown by entry
pnpm benchmark --all        # Run benchmarks for all 30 entries
```

---

## 🎯 Next Priority: Phase 8 — Comprehensive Benchmarks

**Status**: ✅ **UNBLOCKED** — Ready to start

### What to Do

```bash
cd apps/oak-open-curriculum-semantic-search

# Run all 30 subject/phase entries
pnpm benchmark --all

# Or run specific combinations
pnpm benchmark --subject maths
pnpm benchmark --phase primary
pnpm benchmark --subject english --phase secondary --verbose
```

### Expected Output

For each subject/phase entry, ALL 6 metrics:

- MRR (Mean Reciprocal Rank)
- NDCG@10 (Ranking quality)
- Precision@10 (Proportion of top 10 that are relevant)
- Recall@10 (Proportion of relevant found in top 10)
- Zero-Hit Rate (Queries returning nothing)
- p95 Latency (95th percentile response time)

Plus per-category breakdown and query count.

### After Benchmarks

1. Update `evaluation/baselines/baselines.json` with ALL measured metrics
2. Document results in `EXPERIMENT-LOG.md` with complete metrics tables
3. Identify subjects needing improvement (MRR < 0.40)

**Note**: Results are stored in `baselines.json`, NOT in registry code. The registry contains only ground truth queries.

---

## ✅ Previous Work Complete

### Result Pattern Compliance (2026-01-07)

| Component | Change | Status |
|-----------|--------|--------|
| SDK Retry Middleware | Catches and retries network exceptions | ✅ Complete |
| `safeGet` Helper | Wraps `client.GET`, converts exceptions to `Result.Err` | ✅ Complete |
| SDK API Methods | All 8 `makeGet...` functions use `safeGet` | ✅ Complete |
| File Split | `sdk-api-methods.ts` → 4 smaller modules | ✅ Complete |

### Test Coverage (2026-01-07)

| Component | Tests | Status |
|-----------|-------|--------|
| Retry middleware | 13 integration tests | ✅ Complete |
| Lesson materials | 12 unit tests (error handling) | ✅ Complete |
| `safeGet` | 3 unit tests | ✅ Complete |
| SDK API methods (error) | 8 unit tests | ✅ Complete |
| SDK API methods (success) | 8 unit tests | ✅ Complete |

### Ground Truth Remediation (2026-01-08 → 2026-01-09)

| Issue | Before | After | Status |
|-------|--------|-------|--------|
| Invalid slugs | 66 | 0 | ✅ Fixed |
| Empty expectedRelevance | 12 | 0 | ✅ Fixed |
| Missing categories | 130 | 0 | ✅ Fixed |
| Short queries | 78 | 0 | ✅ Fixed |
| Uniform scores | 47 | 0 | ✅ Fixed |
| Missing priority | 34 | 0 | ✅ Fixed |
| Single-slug queries | 10 | 0 | ✅ Fixed |
| No score=3 | 21 | 0 | ✅ Fixed |
| Missing descriptions | 275 | 0 | ✅ Fixed |
| Category coverage gaps | 43 | 0 | ✅ Fixed |

---

## Current ES Index State

From Elastic Cloud Index Management (2026-01-02):

| Index | Documents | Storage |
|-------|-----------|---------|
| `oak_lessons` | 184,985 | 806.62MB |
| `oak_unit_rollup` | 165,345 | 706.06MB |
| `oak_units` | 1,635 | 8.94MB |
| `oak_threads` | 164 | 255.53KB |
| `oak_sequence_facets` | 57 | 375.14KB |
| `oak_sequences` | 30 | 267.67KB |
| `oak_meta` | 1 | 5.34KB |

**Note**: `oak_lessons` and `oak_unit_rollup` counts include ELSER sub-documents. Actual document counts:

| Document Type | Count |
|---------------|-------|
| Lessons | 12,833 |
| Units | 1,665 |
| Threads | 164 |
| Sequences | 30 |
| Sequence facets | 57 |
| **Total** | **16,414** |

---

## Search Quality Metrics

### Metrics Tracked

| Metric | Purpose | Reference |
|--------|---------|-----------|
| **MRR** | Position of first relevant result | Primary acceptance metric |
| **NDCG@10** | Overall ranking quality | Secondary quality metric |
| **Precision@10** | Proportion of top 10 that are relevant | Noise detection |
| **Recall@10** | Proportion of relevant found in top 10 | Completeness detection |
| **Zero-Hit Rate** | Queries returning nothing | Coverage gaps |
| **p95 Latency** | User experience | Performance budget |

> **Full definitions**: See [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md)

### Ground Truth Coverage

| Dimension | Value |
|-----------|-------|
| Subjects | 16 |
| Phases | 2 (primary, secondary) |
| Entries | 30 (citizenship/german have no primary) |
| Total queries | 474 |
| Total slugs | 1,290 |

---

## ✅ Completed Milestones

| Milestone | Status | ADR |
|-----------|--------|-----|
| M1: Complete ES Ingestion | ✅ Verified | [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) |
| M2: Sequence Indexing | ✅ Verified | — |
| M3: Ground Truth Expansion | ✅ Complete | — |
| M4: DRY/SRP Refactoring | ✅ Complete | — |
| M5: Data Completeness | ✅ Complete | [ADR-097](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) |
| M6: Unified Evaluation Infrastructure | ✅ Complete | [ADR-098](../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) |
| Result Pattern Compliance | ✅ Complete | [ADR-088](../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) |
| Stage 3 Qualitative Review | ✅ Complete | [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) |

---

## Ingestion Performance

| Metric | Value |
|--------|-------|
| Documents indexed | 16,414 |
| Initial failures | 17 (0.10%) |
| Final failures | 0 |
| Retry rounds | 1 |
| Duration | ~22 minutes |

### Optimised Parameters

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_CHUNK_SIZE_BYTES` | 8MB | Reduce ELSER queue pressure |
| `DEFAULT_CHUNK_DELAY_MS` | 7001ms | Base delay between chunks |
| `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER` | 1.5× | Progressive delay |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [EXPERIMENTAL-PROTOCOL.md](../../evaluations/EXPERIMENTAL-PROTOCOL.md) | **How to run experiments** |
| [roadmap.md](roadmap.md) | Master plan |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Tier definitions |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Experiment history |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Ground Truth Validation |
| [ADR-088](../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) | Result Pattern |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry |
| [ADR-097](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) | Context Enrichment |
| [ADR-098](../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) | Ground Truth Registry |
