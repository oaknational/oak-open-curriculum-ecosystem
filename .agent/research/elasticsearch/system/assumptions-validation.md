# Elasticsearch Assumptions Validation

**Created**: 2025-12-10  
**Updated**: 2025-12-10 (fix applied, terminology clarified)  
**Purpose**: Systematically validate assumptions about Elasticsearch usage against actual code and cluster state.

---

## Executive Summary

| #   | Assumption                                       | Status     | Impact          |
| --- | ------------------------------------------------ | ---------- | --------------- |
| 1   | ELSER semantic search is operational for lessons | **FIXED**  | Re-index needed |
| 2   | ELSER semantic search is operational for units   | **PASSED** | -               |
| 3   | RRF combines BM25 + ELSER for hybrid search      | **FIXED**  | Re-index needed |
| 4   | Synonyms improve BM25 search quality             | **PASSED** | -               |
| 5   | Dense vectors are generated and stored           | **PASSED** | -               |
| 6   | Fuzzy matching handles typos                     | **PASSED** | -               |
| 7   | Query-time synonym expansion works               | **PASSED** | -               |

**Fix Applied**: Added `lesson_semantic: transcript` to `createLessonDocument()`. Re-indexing required to populate ELSER embeddings for the 314 existing lessons.

**Key Outcome**: The baseline metrics we collected (MRR 0.892, NDCG 0.696) were actually **lexical-only** results. This is valuable because we can now compare lexical vs. two-way hybrid vs. three-way hybrid approaches.

---

## Assumption 1: ELSER Semantic Search for Lessons

### Assumption

> The `lesson_semantic` field is populated with text content, and ELSER generates sparse embeddings at index time, enabling semantic search for lessons.

### Evidence

**Schema Definition** (SDK):

```typescript
// packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts:66
{ name: 'lesson_semantic', zodType: 'string', optional: true },
```

**ES Mapping** (verified via API):

```json
{
  "lesson_semantic": {
    "type": "semantic_text",
    "inference_id": ".elser-2-elastic"
  }
}
```

**Document Creation Code (BEFORE FIX)**:

```typescript
// apps/oak-search-cli/src/lib/indexing/document-transforms.ts:114-141
return {
  lesson_id: lesson.lessonSlug,
  lesson_slug: lesson.lessonSlug,
  lesson_title: lesson.lessonTitle,
  // ... other fields ...
  transcript_text: transcript,
  lesson_dense_vector: lessonDenseVector,
  title_dense_vector: titleDenseVector,
  // NOTE: lesson_semantic was NEVER SET
};
```

**Document Creation Code (AFTER FIX)**:

```typescript
return {
  // ... other fields ...
  transcript_text: transcript,
  lesson_semantic: transcript, // ← FIX APPLIED
  lesson_dense_vector: lessonDenseVector,
  title_dense_vector: titleDenseVector,
};
```

**Cluster State (before re-indexing)**:

```text
Documents with lesson_semantic field: 0 of 314
Semantic query on lessons returns: 0 hits
```

### Validation Result: **FAILED → FIXED**

The `lesson_semantic` field:

- Is defined in the schema ✓
- Has correct ES mapping with ELSER inference ✓
- Is queried by RRF builders ✓
- **Was NEVER populated during document creation** ← Root cause
- **Is now populated in code** ✓
- **Requires re-indexing to apply** ← Next step

### Impact

All prior "hybrid" lesson searches were actually **BM25-only (lexical search)**. The ELSER retriever returned 0 results, so RRF degraded to single-source ranking.

**Silver lining**: We now have a clean lexical baseline for comparison.

---

## Assumption 2: ELSER Semantic Search for Units

### Assumption

> The `unit_semantic` field is populated and enables semantic search for unit rollups.

### Evidence

**Document Creation Code**:

```typescript
// apps/oak-search-cli/src/lib/indexing/document-transforms.ts:181
return {
  // ... other fields ...
  rollup_text: rollupText,
  unit_semantic: rollupText, // ✓ POPULATED
  // ...
};
```

**Cluster State**:

```text
Documents with unit_semantic field: 36 of 36 (100%)
Semantic query on units returns: 35 hits
```

**Sample Semantic Search**:

```text
Query: "pythagoras"
Results:
1. [12.440] right-angled-trigonometry
2. [11.767] similarity
3. [11.706] loci-and-construction
```

### Validation Result: **PASSED**

Unit semantic search is fully operational.

---

## Assumption 3: RRF Combines BM25 + ELSER

### Assumption

> Reciprocal Rank Fusion combines results from BM25 lexical search and ELSER semantic search.

### Evidence

**RRF Query Structure** (code):

```typescript
// apps/oak-search-cli/src/lib/hybrid-search/rrf-query-builders.ts:136-145
return {
  rrf: {
    retrievers: [
      createLessonBm25Retriever(text, filterClause),
      createLessonElserRetriever(text, filterClause),
    ],
    rank_window_size: 60,
    rank_constant: 60,
  },
};
```

**ELSER Retriever** (code):

```typescript
// apps/oak-search-cli/src/lib/hybrid-search/rrf-query-helpers.ts:157
return { standard: { query: { semantic: { field: 'lesson_semantic', query: text } }, filter } };
```

### Validation Result: **PARTIAL → FIXED**

| Index   | Before Fix | After Fix |
| ------- | ---------- | --------- |
| Units   | ✓ Hybrid   | ✓ Hybrid  |
| Lessons | BM25 only  | ✓ Hybrid  |

- **Units**: RRF was working correctly (both retrievers contribute)
- **Lessons**: RRF structure was correct, but ELSER retriever returned 0 results because field was empty. After re-indexing, both retrievers will contribute.

---

## Assumption 4: Synonyms Improve BM25 Search

### Assumption

> Query-time synonyms expand search terms to include related terms, improving recall.

### Evidence

**Analyzer Configuration** (ES cluster):

```json
{
  "oak_text_search": {
    "filter": ["lowercase", "oak_syns_filter"],
    "type": "custom",
    "tokenizer": "standard"
  }
}
```

**Synonym Set**: 130 synonym rules loaded

**Analyzer Tests**:

| Query         | Expanded Tokens                                    |
| ------------- | -------------------------------------------------- |
| `maths`       | `math, mathematics, maths`                         |
| `squared`     | `square, quadratic, quadrature, power of two, ...` |
| `key stage 4` | `ks4, gcse, y10, y11, year 10, year 11, ...`       |

**Field Configuration**:

```json
{
  "transcript_text": {
    "type": "text",
    "analyzer": "oak_text_index",
    "search_analyzer": "oak_text_search"
  }
}
```

### Validation Result: **PASSED**

Synonyms are:

- Loaded in ES (130 rules)
- Applied at query time via `oak_text_search` analyzer
- Expanding terms correctly

**Note**: Synonyms only benefit BM25. ELSER uses its own inference model and ignores the synonym filter.

---

## Assumption 5: Dense Vectors Are Generated

### Assumption

> Dense vectors (E5 embeddings) are generated for lessons and units for potential three-way hybrid search.

### Evidence

**Document Creation** (code):

```typescript
// apps/oak-search-cli/src/lib/indexing/document-transforms.ts:109-112
const [lessonDenseVector, titleDenseVector] = await Promise.all([
  generateDenseVector(esClient, transcript),
  generateDenseVector(esClient, lesson.lessonTitle),
]);
```

**Cluster State**:

```text
Documents with lesson_dense_vector: 314 of 314 (100%)
```

### Validation Result: **PASSED**

Dense vectors are being generated and stored. Three-way hybrid search infrastructure is ready for Phase 2.

---

## Assumption 6: Fuzzy Matching Handles Typos

### Assumption

> BM25 queries use `fuzziness: 'AUTO'` to handle common spelling mistakes.

### Evidence

**Code**:

```typescript
// apps/oak-search-cli/src/lib/hybrid-search/rrf-query-helpers.ts:139-145
query: {
  multi_match: {
    query: text,
    type: 'best_fields',
    tie_breaker: 0.2,
    fuzziness: 'AUTO',
    fields: LESSON_BM25_FIELDS,
  },
},
```

**Test Coverage**:

```typescript
// rrf-query-builders.unit.test.ts:39-42
it('includes fuzziness AUTO for typo tolerance in BM25', () => {
  const request = buildLessonRrfRequest({ text: 'pythagorus', size: 10 });
  const bm25Query = extractBm25Query(request);
  expect(bm25Query?.fuzziness).toBe('AUTO');
});
```

**Smoke Test Evidence (Lexical Baseline)**:

```text
Query: "pythagorus" (misspelled)
Total: 40 results
MRR: 1.000 (correct result first)
```

### Validation Result: **PASSED**

---

## Assumption 7: Query-Time Synonym Expansion

### Assumption

> The analyzer correctly expands synonyms at query time, not index time.

### Evidence

**Index vs Search Analyzer**:

```json
{
  "transcript_text": {
    "analyzer": "oak_text_index", // NO synonyms
    "search_analyzer": "oak_text_search" // WITH synonyms
  }
}
```

**Analyzer Definitions**:

```json
{
  "oak_text_index": {
    "filter": ["lowercase"],
    "tokenizer": "standard"
  },
  "oak_text_search": {
    "filter": ["lowercase", "oak_syns_filter"],
    "tokenizer": "standard"
  }
}
```

### Validation Result: **PASSED**

This architecture is correct because:

- Index-time synonyms would bloat the index with redundant terms
- Query-time synonyms allow synonym updates without re-indexing
- The `oak_syns_filter` uses `updateable: true` for live updates

---

## Root Cause Analysis: Missing `lesson_semantic`

### Why It Happened

The `createLessonDocument` function was written to include dense vectors but omitted the semantic text field:

```typescript
// What existed:
lesson_dense_vector: lessonDenseVector,
title_dense_vector: titleDenseVector,

// What was missing:
lesson_semantic: transcript,  // ← NOT PRESENT
```

Compare with `createRollupDocument` which correctly includes:

```typescript
unit_semantic: rollupText,
```

### Impact Assessment

The prior "baseline" metrics (MRR 0.892, NDCG 0.696) represent **lexical search only**:

| Metric                    | Lexical Only (measured) | Two-Way Hybrid (expected) |
| ------------------------- | ----------------------- | ------------------------- |
| MRR                       | 0.892                   | Similar or higher         |
| NDCG@10                   | 0.696                   | > 0.75 expected           |
| "x squared" → "quadratic" | Poor ranking            | Should improve with ELSER |

### Fix Applied (2025-12-10)

Added `lesson_semantic: transcript` to `createLessonDocument()` in `document-transforms.ts`.

**Test added**: `populates lesson_semantic with transcript content for ELSER semantic search`

**Next step**: Re-index all 314 lessons to populate ELSER embeddings.

---

## Three-Way Comparison Opportunity

With the lexical baseline established and ELSER fix applied, we can now compare:

| Approach                    | MRR   | NDCG@10 | Status     |
| --------------------------- | ----- | ------- | ---------- |
| 1. Lexical (BM25 only)      | 0.892 | 0.696   | ✓ Measured |
| 2. Two-way (BM25 + ELSER)   | TBD   | TBD     | Re-index   |
| 3. Three-way (+ E5 vectors) | TBD   | TBD     | Phase 2    |

This gives us data-driven architecture decisions.

---

## Recommendations

### Immediate Actions

1. ~~**Fix lesson_semantic population**~~ ✓ Done
2. **Re-index all lessons** - Required to populate ELSER embeddings
3. **Run smoke tests** - Measure two-way hybrid performance
4. **Document comparison** - Record metrics for each approach

### Validation Improvements

1. **Add data integrity checks** - Verify semantic fields are populated after indexing
2. **Add smoke test for ELSER** - Query semantic field directly, expect non-zero results
3. **Document field population requirements** - Clear guidance on which fields need explicit values

---

## Appendix: Raw Diagnostic Data

```json
{
  "lesson_semantic_count": 0,
  "unit_semantic_count": 36,
  "lesson_dense_vector_count": 314,
  "synonyms_count": 130,
  "lesson_semantic_mapping": {
    "type": "semantic_text",
    "inference_id": ".elser-2-elastic"
  },
  "lesson_semantic_query_hits": 0,
  "unit_semantic_query_hits": 35
}
```

Note: These counts are **before** re-indexing with the fix applied.
