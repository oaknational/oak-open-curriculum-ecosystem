# Empty Elasticsearch Fields Investigation

**Date**: 2026-01-02
**Status**: ✅ COMPLETE
**Triggered by**: 7 empty fields observed in ES Discover view (pre-refactoring ingest)

---

## Executive Summary

Investigation confirmed that **bulk download data does not include categories/unit_topics** — this is documented in the SDK schema delta. Additionally, semantic fields for threads and sequences were never implemented. Several fields can be constructed or populated from available data.

### Impact Assessment

| Field | Impact | Priority | Effort |
|-------|--------|----------|--------|
| `unit_topics` / `categories` | HIGH — blocks faceting by topic | 🔴 HIGH | Medium (API calls) |
| `sequence_semantic` | HIGH — no ELSER search on sequences | 🔴 HIGH | Low (generate from existing data) |
| `thread_semantic` | MEDIUM — no ELSER search on threads | 🟡 MEDIUM | Low (generate from existing data) |
| `category_titles` | MEDIUM — sequence topic filtering | 🟡 MEDIUM | Low (aggregate from units) |
| `sequence_canonical_url` | LOW — deep linking from facets | 🟢 LOW | Trivial (construct URL) |
| `subjects` (meta) | LOW — metadata completeness | 🟢 LOW | Trivial (use SDK constants) |

---

## Detailed Findings

### 1. `unit_topics` / `categories` — Bulk Data Does NOT Include Categories

**Evidence**: SDK bulk schema explicitly documents this:

```typescript
// From packages/sdks/oak-curriculum-sdk/src/types/generated/bulk/bulk-schemas.ts
export const BULK_SCHEMA_DELTA = {
  unit: {
    "missingFields": [
        "phaseSlug",
        "subjectSlug",
        "notes",
        "categories",     // ← CONFIRMED MISSING
        "canonicalUrl"
    ],
    "addedFields": [
        "examBoards"
    ]
  },
}
```

**Source**: Categories ARE available from the API via `/sequences/{sequence}/units` endpoint.

**Solution**: Supplement bulk data with API calls to fetch categories. Two options:
1. **Hybrid approach**: Fetch `/sequences/{sequence}/units` for each sequence during ingestion
2. **Post-processing**: Enrich unit documents after bulk ingestion

**API Response Structure**:
```json
{
  "categories": [
    { "categoryTitle": "Reading, writing & oracy", "categorySlug": "reading-writing-oracy" }
  ]
}
```

---

### 2. `sequence_semantic` — Not Implemented

**Evidence**: `sequence-document-builder.ts` does not set the `sequence_semantic` field.

**Schema Definition** (Zod):
```typescript
sequence_semantic: z.string().min(1).optional(),
```

**Mapping** (`oak-sequences.ts`):
```typescript
sequence_semantic: { type: 'semantic_text' }
```

**Solution**: Generate semantic summary from available data:
- Sequence title
- Subject title
- Phase title
- Category titles (when populated)
- Key stages covered
- Years covered

**4-Retriever Model**: Sequences should follow the same pattern as lessons/units:
- `sequence_structure` (BM25 on lightweight text)
- `sequence_content` (BM25 on full text, if applicable)
- `sequence_structure_semantic` (ELSER on structure)
- `sequence_content_semantic` (ELSER on content, if applicable)

Since sequences don't have "content" like lessons (no transcript), they may only need structure fields.

---

### 3. `thread_semantic` — Not Implemented

**Evidence**: `thread-document-builder.ts` does not set the `thread_semantic` field.

**Schema Definition** (Zod):
```typescript
thread_semantic: z.string().min(1).optional(),
```

**Mapping** (`oak-threads.ts`):
```typescript
thread_semantic: { type: 'semantic_text' }
```

**Solution**: Generate semantic summary from:
- Thread title
- Subject slugs
- Unit count
- Could potentially aggregate unit titles/topics from related units

---

### 4. `category_titles` — Hardcoded to Empty Array

**Evidence**: `bulk-sequence-transformer.ts` line 94:
```typescript
categoryTitles: [],
```

**Solution**: After unit categories are populated, aggregate across units to build sequence-level `category_titles`.

---

### 5. `sequence_canonical_url` — Not Passed to Facet Builder

**Evidence**: `extractSequenceFacetParamsFromBulkFile` doesn't include `canonicalUrl`.

**URL Pattern**: `https://www.thenational.academy/teachers/programmes/{sequenceSlug}/units`

**Solution**: Construct URL from sequence slug:
```typescript
const canonicalUrl = `https://www.thenational.academy/teachers/programmes/${sequenceSlug}/units`;
```

---

### 6. `subjects` (oak_meta) — Metadata Completeness

**Evidence**: Meta document may not include all subjects.

**Solution**: Use SDK constants:
```typescript
import { SUBJECTS, KEY_STAGES } from '@oaknational/oak-curriculum-sdk';
// SUBJECTS = ["art", "citizenship", "computing", ...]
// KEY_STAGES = ["ks1", "ks2", "ks3", "ks4"]
```

---

## URL Patterns Verified

All canonical URLs must be real URLs on https://www.thenational.academy/

| Entity | URL Pattern | Status |
|--------|------------|--------|
| **Threads** | `https://www.thenational.academy/teachers/curriculum/threads/{threadSlug}` | ✅ Verified in code |
| **Sequences** | `https://www.thenational.academy/teachers/programmes/{sequenceSlug}/units` | ✅ Verified in code |
| **Units** | From API `canonicalUrl` field | ✅ Verified |
| **Lessons** | From API `canonicalUrl` field | ✅ Verified |

---

## SDK Constants Available

From `path-parameters.ts`:

```typescript
export const KEY_STAGES = ["ks1", "ks2", "ks3", "ks4"] as const;

export const SUBJECTS = [
  "art", "citizenship", "computing", "cooking-nutrition",
  "design-technology", "english", "french", "geography",
  "german", "history", "maths", "music", "physical-education",
  "religious-education", "rshe-pshe", "science", "spanish"
] as const;

// Years from API schema
type Year = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "all-years";
```

---

## Recommended Implementation Order

### Phase 1: Trivial Fixes (Low Risk)
1. ✅ Add `sequence_canonical_url` construction to sequence facet builder
2. ✅ Add `subjects`, `key_stages` to meta document from SDK constants

### Phase 2: Semantic Field Generation
3. Generate `sequence_semantic` from existing data
4. Generate `thread_semantic` from existing data
5. Consider 4-retriever model for sequences/threads

### Phase 3: API Supplementation (Higher Risk)
6. Design API supplementation strategy for categories
7. Implement category fetching during ingestion
8. Aggregate `category_titles` for sequences
9. Re-ingest to populate empty fields

---

## Related Documents

- [roadmap.md](../plans/semantic-search/roadmap.md) — Add as Milestone 5
- [bulk-schemas.ts](../../packages/sdks/oak-curriculum-sdk/src/types/generated/bulk/bulk-schemas.ts) — Source of truth for bulk schema delta
- [ADR-093](../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) — Bulk-first strategy

