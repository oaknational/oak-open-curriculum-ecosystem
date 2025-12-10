# Phase 1: Foundation (Two-Way Hybrid Search)

**Status**: ✅ COMPLETE  
**Last Updated**: 2025-12-10

---

## Goal

Implement two-way hybrid search (BM25 + ELSER) with Maths KS4 data as a complete vertical slice.

**First Question Applied**: Start with the simplest approach that delivers value. Only add complexity (dense vectors, reranking) when validated necessary by metrics.

---

## What's Complete

### Phase 1A: Data Ingestion ✅

| Index             | Count   | Status |
| ----------------- | ------- | ------ |
| `oak_lessons`     | **314** | ✅     |
| `oak_units`       | 36      | ✅     |
| `oak_unit_rollup` | 244     | ✅     |
| `oak_threads`     | 201     | ✅     |
| `oak_sequences`   | 2       | ✅     |

**Key Fix**: Pagination issue resolved - derived lesson groups from unit summaries instead of paginated API.

### Phase 1B: RRF API Update ✅

- Updated RRF query builders to ES 8.11+ `retriever` API
- Two-way RRF: BM25 + ELSER via `retriever` structure
- Three-way RRF ready for Phase 2 if needed

### Phase 1C: Baseline Metrics ✅

- Ground truth updated with correct Pythagoras/trigonometry expectations
- MRR and NDCG@10 metrics implemented with TDD (13 unit tests)
- Smoke test suite created for search quality evaluation

### Phase 1D: Missing Indices ✅

- Thread mapping and document builder implemented
- Sequence document builder implemented
- Reference index infrastructure ready

### Phase 1E: Search Foundation ✅

- Fuzzy matching enabled (`fuzziness: 'AUTO'`)
- All quality gates passing
- Complete lesson coverage verified

---

## Technical Implementation

### RRF Query Structure (ES 8.11+)

```typescript
{
  retriever: {
    rrf: {
      retrievers: [
        { standard: { query: { multi_match: { ... } } } },  // BM25
        { standard: { query: { text_expansion: { ... } } } }  // ELSER
      ],
      window_size: 50,
      rank_constant: 60
    }
  }
}
```

### Field Extraction

- `tier` (foundation/higher)
- `exam_board` (aqa, edexcel, ocr)
- `pathway`
- Dense vectors (384-dim E5) - ready for Phase 2

### Testing

- **Unit tests**: Extraction functions, metrics calculations
- **Integration tests**: Document transforms
- **Smoke tests**: Search quality against live server

---

## Files Modified

```
apps/oak-open-curriculum-semantic-search/
├── src/lib/indexing/index-bulk-helpers.ts      # deriveLessonGroupsFromUnitSummaries()
├── src/lib/index-oak-helpers.ts                # fetchPairData(), buildCoreDocumentOps()
├── src/lib/hybrid-search/rrf-query-builders.ts # ES 8.11+ retriever API
├── src/lib/search-quality/ground-truth.ts      # Updated expectations
├── src/lib/search-quality/metrics.ts           # MRR, NDCG@10
└── smoke-tests/search-quality.smoke.test.ts    # Benchmark suite
```

---

## Next Steps

1. **Run smoke tests** to establish baseline metrics:

   ```bash
   cd apps/oak-open-curriculum-semantic-search
   pnpm dev  # Start server
   pnpm test:smoke  # Run benchmarks
   ```

2. **Decision Point**:
   - **If targets met** (MRR > 0.70, NDCG@10 > 0.75): Stay with two-way hybrid
   - **If targets not met**: Proceed to Phase 2

---

## Deferred Work (Post-Baseline)

The following are documented in `requirements.md` and should be addressed after baseline metrics are established:

### Phase 1F: Search Filter Improvements

Make facet fields (tier, exam_board, pathway, year_group) usable as query filters. Currently facets are returned but cannot filter results.

### Phase 1G: API Schema Filter Investigation

Audit Oak API schema for additional filterable fields (yearSlug, contentGuidance, supervisionLevel, priorKnowledgeRequirements, etc.).

---

## Success Criteria

- [x] All 314 Maths KS4 lessons indexed
- [x] RRF queries using ES 8.11+ `retriever` API
- [x] Ground truth with accurate expectations
- [x] Metrics infrastructure (MRR, NDCG@10)
- [x] Smoke test suite ready
- [x] All quality gates passing
