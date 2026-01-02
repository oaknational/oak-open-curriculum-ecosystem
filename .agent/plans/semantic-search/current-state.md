# Semantic Search Current State

**Last Updated**: 2026-01-02
**Status**: ✅ **Full ingestion verified** — Now optimising search quality
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

This is THE authoritative source for current system metrics.

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

**Note**: `oak_lessons` and `oak_unit_rollup` counts include ELSER sub-documents for sparse vector storage. Actual document counts:

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

### Ground Truth Coverage

| Dimension | Current | Gap |
|-----------|---------|-----|
| Subjects | Maths KS4 only | 16 subjects missing |
| Key Stages | KS4 only | KS1-3 missing |
| Query count | 73 queries | Need 200+ for full coverage |

### Current MRR (KS4 Maths only)

From [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) (2025-12-24):

| Category | MRR | Status |
|----------|-----|--------|
| Misspelling | 0.833 | ✅ Excellent |
| Naturalistic | 0.722 | ✅ Good |
| Multi-concept | 0.625 | ✅ Good |
| Synonym | 0.611 | ✅ Good |
| Colloquial | 0.500 | ⚠️ Acceptable |
| Intent-based | 0.229 | ❌ Exception granted |
| **Overall** | **0.614** | ✅ Tier 1 target met |

**Tier 1 status**: ✅ EXHAUSTED (all standard approaches tried for KS4 Maths)

**Key gap**: These metrics only cover KS4 Maths. Full curriculum benchmarks needed.

---

## Data Completeness

### Categories (Subject-Specific)

Only 3 subjects have categories:

| Subject | Categories |
|---------|------------|
| English | Grammar, Handwriting, Reading/writing/oracy |
| Science | Biology, Chemistry, Physics |
| Religious Education | Theology, Philosophy, Social science |

Other subjects use **threads** for navigation (all 164 threads indexed).

See [category-availability-by-subject.md](../../analysis/category-availability-by-subject.md).

### Thread Context

Unit documents now include:
- `thread_slugs` — All associated thread slugs
- `thread_titles` — Human-readable thread names
- `thread_orders` — Position in each thread

---

## ✅ Completed Work

| Milestone | Status | ADR |
|-----------|--------|-----|
| M1: Complete ES Ingestion | ✅ Verified | [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) |
| M2: Sequence Indexing | ✅ Verified | — |
| M4: DRY/SRP Refactoring | ✅ Complete | — |
| M5: Data Completeness | ✅ Complete | [ADR-097](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) |

## 🎯 Next Priority

**Milestone 3: Search Quality Optimization**

1. Create comprehensive ground truths (all subjects, all key stages)
2. Establish baseline benchmarks
3. Audit and improve synonyms
4. Analyze bulk download data for enrichment
5. Measure and iterate

See [roadmap.md](roadmap.md) for full details.

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
| [roadmap.md](roadmap.md) | Master plan |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Tier definitions |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Experiment history |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry |
| [ADR-097](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) | Context Enrichment |
