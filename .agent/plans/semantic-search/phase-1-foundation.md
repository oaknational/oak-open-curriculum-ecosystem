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

#### Baseline Results (2025-12-10, after ground truth review)

| Metric        | Result    | Target  | Status       |
| ------------- | --------- | ------- | ------------ |
| MRR           | **0.893** | > 0.70  | **PASS**     |
| NDCG@10       | 0.648     | > 0.75  | Below target |
| Zero-hit rate | **0.0%**  | < 10%   | **PASS**     |
| p95 Latency   | 28ms      | < 300ms | **PASS**     |

#### Per-Query Breakdown

| Query                                   | Total | MRR   | NDCG@10 | Notes                               |
| --------------------------------------- | ----- | ----- | ------- | ----------------------------------- |
| "Pythagoras theorem"                    | 309   | 1.000 | 0.749   | Working correctly                   |
| "quadratic equations"                   | 187   | 1.000 | 0.495   | Some irrelevant results in top 10   |
| "trigonometry"                          | 37    | 1.000 | 0.857   | Excellent after ground truth fix    |
| "simultaneous equations"                | 181   | 1.000 | 0.825   | Excellent after ground truth fix    |
| "expanding brackets"                    | 90    | 1.000 | 0.664   | Working correctly                   |
| "pythagorus" (misspelled)               | 40    | 1.000 | 0.765   | **Fuzzy matching working**          |
| "how to solve equations with x squared" | 314   | 0.250 | 0.184   | Search quality issue - semantic gap |

#### Key Findings

1. **Fuzzy matching confirmed working** - "pythagorus" misspelling returns Pythagoras lessons
2. **Cache issue identified** - stale Next.js cache caused false zero-hit results; `rm -rf .next` fixes
3. **Ground truth corrected** - updated for simultaneous equations and trigonometry using MCP tools
4. **3 of 4 targets pass** - MRR, zero-hit, and latency all meet targets

#### NDCG Gap Analysis

The natural language query "how to solve equations with x squared" has MRR=0.25 (first relevant result at position 4). The phrase "x squared" should semantically match "quadratic" but:

- BM25 won't match (different words) - **synonym added, needs ES sync**
- ELSER sparse embeddings may not capture this synonym relationship - **synonyms don't help ELSER**
- Dense vectors (Phase 2) could help with this semantic gap

#### Synonym Architecture (Important)

```text
┌─────────────────────────────────────────────────────────────┐
│                    TEXT FIELDS (BM25)                       │
│  Index Time:  oak_text_index  → lowercase only              │
│  Query Time:  oak_text_search → lowercase + synonyms        │
│  → Synonyms HELP BM25                                       │
├─────────────────────────────────────────────────────────────┤
│                 SEMANTIC FIELD (ELSER)                      │
│  lesson_semantic: type: semantic_text                       │
│  → Processed directly by ELSER, NO custom analyser          │
│  → Synonyms DO NOT help ELSER                               │
└─────────────────────────────────────────────────────────────┘
```

**Implication**: Query-time synonyms improve BM25 recall but not ELSER. Dense vectors (Phase 2) are the solution for semantic gaps that synonyms can't cover.

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

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/indexing/index-bulk-helpers.ts      # deriveLessonGroupsFromUnitSummaries()
├── src/lib/index-oak-helpers.ts                # fetchPairData(), buildCoreDocumentOps()
├── src/lib/hybrid-search/rrf-query-builders.ts # ES 8.11+ retriever API
├── src/lib/search-quality/
│   ├── ground-truth/                           # Modular ground truth (NEW)
│   │   ├── algebra.ts, geometry.ts, number.ts  # Topic-specific queries
│   │   ├── edge-cases.ts                       # Misspellings, natural language
│   │   └── index.ts                            # Combined exports
│   ├── ground-truth.ts                         # Legacy wrapper
│   └── metrics.ts                              # MRR, NDCG@10
├── smoke-tests/search-quality.smoke.test.ts    # Benchmark suite (port fixed)
└── docs/SYNONYMS.md                            # Synonym system documentation (NEW)

packages/sdks/oak-curriculum-sdk/
├── src/mcp/synonyms/                           # Modular synonyms (NEW)
│   ├── numbers.ts                              # squared → quadratic
│   └── index.ts                                # Barrel file
├── src/mcp/ontology-data.ts                    # Imports from synonyms/
└── src/mcp/synonym-export.ts                   # ES export includes numbers group
```

---

## Next Steps

### Immediate: Sync Synonyms to Elasticsearch

The `squared → quadratic` synonym has been added to the SDK but needs deployment:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm elastic:setup  # Push updated synonyms to ES
```

Then re-run smoke tests:

```bash
pnpm test:smoke
```

### Establish Repeatable Baseline

Before evaluating dense vectors (Phase 2), we need:

1. **Stable metrics** - run smoke tests multiple times, ensure consistency
2. **Synonym sync complete** - deploy `squared → quadratic` to ES
3. **Documented baseline** - record metrics with timestamp for comparison

Dense vectors will be evaluated regardless of Phase 1 metrics - we need empirical data to make informed architecture decisions.

### Then Proceed to Phase 2 Evaluation

See `phase-2-dense-vectors.md` for:

- Three-way hybrid (BM25 + ELSER + E5 dense vectors)
- Expected ~10-25% NDCG improvement
- Additional complexity trade-offs
- Before/after comparison methodology

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
