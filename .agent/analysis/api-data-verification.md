# API Data Verification for Milestone 5

## Summary

This document verifies which data is available via the API for supplementing bulk data during ingestion.

## Verification Results

### Categories

| Source | Available | Notes |
|--------|-----------|-------|
| Bulk download | ❌ No | Explicitly listed in `BULK_SCHEMA_DELTA.unit.missingFields` |
| API: `/sequences/{slug}/units` | ✅ Yes | Returned per-unit when available |
| API: `/units/{slug}` (summary) | ❌ No | Not included in unit summary response |

**Observation**: Categories are available in the sequences/units endpoint but NOT in the unit summary endpoint. The categories are subject-specific - English units have categories like "Grammar", "Spelling", "Vocabulary", "Reading, writing & oracy", while Maths units may not have categories.

**Example from English Year 5**:
```json
{
  "unitTitle": "Five sentence types",
  "categories": [{ "categoryTitle": "Grammar", "categorySlug": "grammar" }]
}
```

### Threads

| Source | Available | Notes |
|--------|-----------|-------|
| Bulk download | ✅ Yes | Included in `unit.threads[]` |
| API: `/sequences/{slug}/units` | ✅ Yes | Returned per-unit with slug, title, and order |
| API: `/units/{slug}` (summary) | ✅ Yes | Included in response |
| API: `/threads` | ✅ Yes | Returns all threads with titles and slugs |

**No API supplementation needed** - thread data is already in bulk.

### Canonical URLs

| Entity | Available | Pattern |
|--------|-----------|---------|
| Lessons | ✅ Derivable | `/teachers/lessons/{lessonSlug}` |
| Units | ✅ API + Derivable | `/teachers/programmes/{subject}-{phase}/units/{unitSlug}` |
| Sequences | ✅ Derivable | `/teachers/programmes/{sequenceSlug}/units` |
| Threads | ✅ Derivable | `/teachers/curriculum/threads/{threadSlug}` |

**No API supplementation needed** - all URLs can be derived from slugs.

### Key Stages, Subjects, Years (Enums)

All available in SDK constants:
- `KEY_STAGES`: `['ks1', 'ks2', 'ks3', 'ks4']`
- `SUBJECTS`: 17 subjects including `'maths'`, `'english'`, `'science'`, etc.

**No API supplementation needed** - use SDK constants.

## API Supplementation Strategy

### For Categories

**Endpoint**: `GET /api/sequences/{sequenceSlug}/units?year={year}`

**Strategy**:
1. During bulk ingestion, for each sequence:
   - Call the sequences/units API to get categories per unit
   - Build a `Map<unitSlug, categories[]>`
2. When transforming bulk units:
   - Look up categories from the map
   - Populate `unit_topics` field

**Rate Limiting Consideration**:
- 30 sequences × 6-7 years average = ~200 API calls
- This is acceptable during ingestion (not real-time)

### Not Needed

- **Threads**: Already in bulk data
- **Canonical URLs**: Can be derived from slugs
- **Enums**: Available in SDK

## Recommendation

1. **Implement category supplementation** via sequences/units API during ingestion
2. **Skip semantic fields** for sequences/threads (per earlier decision)
3. **Use shared URL generator** for all canonical URLs
4. **Use SDK constants** for enums (already available)

## Test Data

For testing category supplementation:
- English has rich category data (Grammar, Spelling, Vocabulary, etc.)
- Maths may have fewer/no categories

Use `english-primary` or `english-secondary` for testing.

