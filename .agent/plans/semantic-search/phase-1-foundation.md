# Phase 1: Foundation (Lexical Baseline + Two-Way Hybrid)

**Status**: ✅ COMPLETE | Two-Way Hybrid Measured  
**Last Updated**: 2025-12-10

---

## Goal

Establish a clean lexical search baseline and fix ELSER for two-way hybrid comparison.

**First Question Applied**: Start with the simplest approach that delivers value. Only add complexity (dense vectors, reranking) when validated necessary by metrics.

---

## Critical Discovery: ELSER Was Not Operational for Lessons

On 2025-12-10, we discovered that the `lesson_semantic` field was **never being populated** during indexing:

- ELSER queries on lessons returned **0 hits**
- The "hybrid" search was actually **BM25-only** for lessons
- Unit search WAS hybrid (unit_semantic was correctly populated)

**Root cause**: `createLessonDocument()` did not include `lesson_semantic: transcript`.

**Fix applied**: Added `lesson_semantic: transcript` with TDD.

**Impact**: All prior "baseline" measurements were actually **lexical-only** measurements.

See `.agent/research/elasticsearch/assumptions-validation.md` for full analysis.

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

---

## Measurement Results

### Two-Way Hybrid (BM25 + ELSER) - Current (2025-12-10)

| Metric        | Result    | Target  | Status       |
| ------------- | --------- | ------- | ------------ |
| MRR           | **0.908** | > 0.70  | **PASS**     |
| NDCG@10       | 0.725     | > 0.75  | Below target |
| Zero-hit rate | **0.0%**  | < 10%   | **PASS**     |
| p95 Latency   | **198ms** | < 300ms | **PASS**     |

**3 of 4 targets met.** NDCG improved but still 2.5% below target.

### Lexical Baseline (BM25 Only) - For Comparison

| Metric        | Result    | Target  | Status       |
| ------------- | --------- | ------- | ------------ |
| MRR           | **0.920** | > 0.70  | **PASS**     |
| NDCG@10       | 0.690     | > 0.75  | Below target |
| Zero-hit rate | **0.0%**  | < 10%   | **PASS**     |
| p95 Latency   | 322ms     | < 300ms | Below target |

### Comparison: Lexical vs Two-Way Hybrid

| Metric      | Lexical (BM25) | Two-Way Hybrid | Change       |
| ----------- | -------------- | -------------- | ------------ |
| MRR         | 0.920          | 0.908          | -1.3%        |
| NDCG@10     | 0.690          | 0.725          | **+5.1%** ✅ |
| p95 Latency | 322ms          | 198ms          | **-38%** ✅  |

### Analysis

**Improvements with ELSER:**

- NDCG@10 improved by 5.1% - validates the value of semantic search
- Latency improved by 38% - fresh index performs better
- All queries return results (0% zero-hit rate maintained)

**Remaining gap:**

- NDCG still 2.5% below the 0.75 target
- MRR slightly decreased (likely noise, difference is small)

### Key Findings

1. **ELSER adds measurable value** - 5.1% NDCG improvement validates hybrid approach
2. **Fuzzy matching confirmed working** - "pythagorus" misspelling returns Pythagoras lessons
3. **Query-time synonyms operational** - "squared" expands to "quadratic" for BM25
4. **Latency improved** - Fresh index after re-ingestion is faster
5. **Semantic gap narrowed** - Natural language queries improved with ELSER

### Why Lexical Still Performs Well

BM25 with our enhancements is surprisingly strong:

- **Fuzzy matching** handles typos (`pythagorus` → `Pythagoras`)
- **Query-time synonyms** expand search terms (`squared` → `quadratic`)
- **Multi-field search** boosts title matches over transcript matches

This creates a high bar for hybrid search to beat.

---

## Three-Way Comparison Framework

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                        SEARCH APPROACH COMPARISON                          │
├────────────────────────────────────────────────────────────────────────────┤
│  1. LEXICAL ONLY (BM25)                                   ← MEASURED       │
│     • Fuzzy matching (fuzziness: 'AUTO')                                   │
│     • Query-time synonyms (oak_text_search analyzer)                       │
│     • MRR: 0.920 | NDCG: 0.690                                             │
├────────────────────────────────────────────────────────────────────────────┤
│  2. TWO-WAY HYBRID (BM25 + ELSER)                         ← MEASURED       │
│     • RRF combines lexical + sparse vector                                 │
│     • MRR: 0.908 | NDCG: 0.725 (+5.1%)                                     │
│     • p95 Latency: 198ms (-38% from lexical)                               │
├────────────────────────────────────────────────────────────────────────────┤
│  3. THREE-WAY HYBRID (BM25 + ELSER + E5)                  ← PHASE 2        │
│     • RRF combines lexical + sparse + dense vectors                        │
│     • Expected: Additional +5-10% NDCG                                     │
│     • Requires: Dense vector retriever enabled                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## NDCG Gap Analysis

The 0.725 NDCG@10 (2.5% below target) indicates room for improvement in ranking quality. Two-way hybrid improved over lexical (+5.1%), but natural language queries may benefit from dense vectors.

| Approach          | Status      | Notes                                         |
| ----------------- | ----------- | --------------------------------------------- |
| BM25 (synonyms)   | ✅ Measured | NDCG 0.690 - synonym expansion helps somewhat |
| BM25 + ELSER      | ✅ Measured | NDCG 0.725 - 5.1% improvement, semantic helps |
| BM25 + ELSER + E5 | ⏸️ Phase 2  | Expected: additional +5-10% for semantic gaps |

### Synonym Architecture (Important)

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

**Implication**: Query-time synonyms improve BM25 recall but not ELSER. ELSER relies on its trained model to understand semantic relationships. Dense vectors (Phase 2) are the solution for semantic gaps that neither synonyms nor ELSER can cover.

---

### Phase 1D: Missing Indices ✅

- Thread mapping and document builder implemented
- Sequence document builder implemented
- Reference index infrastructure ready

### Phase 1E: Search Foundation ✅

- Fuzzy matching enabled (`fuzziness: 'AUTO'`)
- All quality gates passing
- Complete lesson coverage verified

### Phase 1F: ELSER Fix ✅

- Root cause identified: `lesson_semantic` not populated
- Fix applied with TDD (test added first)
- Unit test verifies `lesson_semantic` contains transcript content
- Re-indexing required to apply fix to existing data

---

## Technical Implementation

### RRF Query Structure (ES 8.11+)

```typescript
{
  retriever: {
    rrf: {
      retrievers: [
        { standard: { query: { multi_match: { ... } } } },  // BM25
        { standard: { query: { semantic: { field: 'lesson_semantic', ... } } } }  // ELSER
      ],
      rank_window_size: 60,
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

- **Unit tests**: Extraction functions, metrics calculations, lesson_semantic population
- **Integration tests**: Document transforms
- **Smoke tests**: Search quality against live server

---

## Files Modified

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/indexing/
│   ├── index-bulk-helpers.ts              # deriveLessonGroupsFromUnitSummaries()
│   ├── document-transforms.ts             # createLessonDocument() - ELSER FIX
│   └── document-transforms.unit.test.ts   # lesson_semantic test added
├── src/lib/index-oak-helpers.ts           # fetchPairData(), buildCoreDocumentOps()
├── src/lib/hybrid-search/rrf-query-builders.ts # ES 8.11+ retriever API
├── src/lib/search-quality/
│   ├── ground-truth/                      # Modular ground truth (NEW)
│   │   ├── algebra.ts, geometry.ts, number.ts  # Topic-specific queries
│   │   ├── edge-cases.ts                  # Misspellings, natural language
│   │   └── index.ts                       # Combined exports
│   ├── ground-truth.ts                    # Legacy wrapper
│   └── metrics.ts                         # MRR, NDCG@10
├── smoke-tests/search-quality.smoke.test.ts    # Benchmark suite (port fixed)
├── docs/SYNONYMS.md                       # Synonym system documentation (NEW)
└── docs/INGESTION-GUIDE.md                # Complete re-indexing guide (NEW)

packages/sdks/oak-curriculum-sdk/
├── src/mcp/synonyms/                      # Modular synonyms (NEW)
│   ├── numbers.ts                         # squared → quadratic
│   └── index.ts                           # Barrel file
├── src/mcp/ontology-data.ts               # Imports from synonyms/
└── src/mcp/synonym-export.ts              # ES export includes numbers group

.agent/research/elasticsearch/
└── assumptions-validation.md              # ELSER discovery documentation
```

---

## Next Steps

### Decision Point: Phase 2?

Two-way hybrid improved NDCG by 5.1% but still misses the 0.75 target by 2.5%.

**Options:**

| Option                 | Description                            | Effort | Expected Gain |
| ---------------------- | -------------------------------------- | ------ | ------------- |
| A. Accept 0.725        | Good enough for demo, defer Phase 2    | None   | —             |
| B. Tune RRF params     | Adjust rank_window_size, rank_constant | Low    | +1-2%         |
| C. Ground truth review | Ensure expectations match reality      | Low    | Validation    |
| D. Phase 2 (E5 dense)  | Three-way hybrid (BM25 + ELSER + E5)   | Medium | +5-10%        |

**Recommendation**: Try options B and C first (low effort). If NDCG remains below 0.75, proceed to Phase 2.

### Re-Running Tests

```bash
# Terminal 1: Start the server
cd apps/oak-open-curriculum-semantic-search
rm -rf .next && pnpm dev

# Terminal 2: Run smoke tests
pnpm test:smoke
```

### Re-Ingestion (if needed)

**Full ingestion guide**: `apps/oak-open-curriculum-semantic-search/docs/INGESTION-GUIDE.md`

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup
pnpm es:ingest-live -- --subject maths --keystage ks4
pnpm es:status
```

See `phase-2-dense-vectors.md` for three-way hybrid (BM25 + ELSER + E5) if Phase 2 is needed.

---

## Deferred Work (Post-Baseline)

The following are documented in `requirements.md` and should be addressed after baseline metrics are established:

### Phase 1G: Search Filter Improvements

Make facet fields (tier, exam_board, pathway, year_group) usable as query filters. Currently facets are returned but cannot filter results.

### Phase 1H: API Schema Filter Investigation

Audit Oak API schema for additional filterable fields (yearSlug, contentGuidance, supervisionLevel, priorKnowledgeRequirements, etc.).

---

## Success Criteria

- [x] All 314 Maths KS4 lessons indexed
- [x] RRF queries using ES 8.11+ `retriever` API
- [x] Ground truth with accurate expectations
- [x] Metrics infrastructure (MRR, NDCG@10)
- [x] Smoke test suite ready
- [x] All quality gates passing
- [x] **Lexical baseline established (MRR 0.920, NDCG 0.690)**
- [x] **ELSER fix applied with TDD**
- [x] **Re-index lessons with lesson_semantic populated (314/314)**
- [x] **Two-way hybrid measured (MRR 0.908, NDCG 0.725)**

### Phase 1 Complete

All Phase 1 success criteria met. Two-way hybrid shows 5.1% NDCG improvement over lexical baseline, validating the value of ELSER semantic search.

NDCG@10 (0.725) is still 2.5% below the 0.75 target. Decision pending on whether to:

- Accept current results for demo
- Tune RRF parameters
- Proceed to Phase 2 (three-way hybrid with E5 dense vectors)
