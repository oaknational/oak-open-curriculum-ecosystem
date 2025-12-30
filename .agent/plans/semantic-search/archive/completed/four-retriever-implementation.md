# Archive: Four-Retriever Hybrid Implementation

**Status**: ✅ Complete (Phases 3.0–3d)  
**Completed**: 2025-12-18  
**Original Location**: `phase-3-multi-index-and-fields.md` (sections 3.0-3d)

---

## Summary

Implemented and validated the four-retriever hybrid search architecture:
- BM25 on content fields
- BM25 on structure fields
- ELSER on content semantic fields
- ELSER on structure semantic fields

Achieved MRR 0.931 for lessons (+2.5% over baseline) and MRR 1.000 for units (perfect score).

---

## What Was Done

### Part 3.0: Verification (2025-12-15)
- Proved hybrid search superior to BM25 or ELSER alone
- Verified lesson-only, unit-only, and joint search
- Implemented Redis cache TTL with jitter (ADR-079)

### Part 3a: Feature Parity (2025-12-15)
- Imported OWA aliases to synonyms
- Added `pupilLessonOutcome` field
- Added display title fields
- Implemented KS4 sequence traversal (`ks4-context-builder.ts`)

### Part 3b: Semantic Summaries (2025-12-17)
- Removed dense vector code (ADR-075)
- Enhanced lesson summary template with all API fields
- Enhanced unit summary template with all API fields
- Adopted `<entity>_content|structure[_semantic]` naming pattern

### Part 3c: Four-Retriever + API Wiring (2025-12-17)
- Updated field nomenclature across schema
- Wired KS4 filtering through API layer
- Updated query builders for four retrievers

### Part 3d: Live Validation (2025-12-18)
- Re-indexed with new schema (314 lessons, 36 units)
- All metrics improved over baseline
- Fixed tier metadata bug for Maths-style sequences

---

## Four-Retriever Ablation Study

### Key Finding: Standard vs Hard Queries

| Query Type | Best Configuration | MRR |
|------------|-------------------|-----|
| **Standard** | Four-way hybrid | 0.931 (lessons), 1.000 (units) |
| **Hard** | Single ELSER | 0.287 (lessons), 0.883 (units) |

**Insight**: On hard/naturalistic queries, RRF fusion dilutes semantic signal with BM25 noise. This led to Phase 3e (ES Native Enhancements) to improve BM25 contribution.

### Ablation Results (Lessons - Standard Queries)

| Configuration | MRR | NDCG@10 |
|---------------|-----|---------|
| bm25_content | 0.892 | 0.696 |
| elser_content | 0.831 | 0.673 |
| bm25_structure | 0.884 | 0.713 |
| elser_structure | 0.886 | 0.737 |
| content_hybrid | 0.908 | 0.726 |
| structure_hybrid | 0.925 | 0.744 |
| **four_way_hybrid** | **0.931** | **0.749** |

---

## Tier Metadata Bug Fix

### Problem
KS4 filtering showed "0 foundation results" for Maths.

### Root Cause
`isKs4Sequence()` skipped `maths-secondary` (no exam board slug), but tier data exists embedded in Year 10/11 entries.

### Fix
Process ALL sequences for tier extraction; removed early-return check.

### Result
- Foundation tier: 0 → **251 lessons**
- Higher tier: 0 → **314 lessons**

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Four retrievers in RRF | Content + Structure × BM25 + ELSER covers all query types |
| Process all sequences | Tier data can be embedded, not just in exam board sequences |
| `light_english` stemmer | Less aggressive for educational content |

---

## Related ADRs

- [ADR-075: Dense Vector Removal](../../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md)
- [ADR-076: ELSER-Only Embedding Strategy](../../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)
- [ADR-077: Semantic Summary Generation](../../../../docs/architecture/architectural-decisions/077-semantic-summary-generation.md)
- [ADR-079: SDK Cache TTL Jitter](../../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md)
- [ADR-080: KS4 Metadata Denormalisation](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)

---

## Key Learnings

1. **Hybrid superiority is query-dependent** — Four-way hybrid wins on standard queries; ELSER alone wins on hard queries.
2. **Process ALL data** — Assumptions about sequence types led to missing tier metadata.
3. **Structure field adds value** — ELSER on structure consistently strong across all query types.
4. **Ablation studies are essential** — Without them, we wouldn't know ELSER > BM25 on hard queries.

---

## Successor Work

**Phase 3e** (ES Native Enhancements) addresses the finding that BM25 underperforms on hard queries by adding:
- Enhanced fuzzy configuration
- Phrase prefix boost
- Stemming and stop words (reverted — regressed metrics)

Phase 3e is documented in the remaining sections of `phase-3-multi-index-and-fields.md`.



