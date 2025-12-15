# ADR-080: KS4 Metadata Denormalisation Strategy

**Status**: Accepted  
**Date**: 2025-12-15  
**Decision Makers**: AI Platform Team  
**Related ADRs**: [ADR-066](066-sdk-response-caching.md), [ADR-067](067-sdk-generated-elasticsearch-mappings.md), [ADR-076](076-elser-only-embedding-strategy.md)

## Context

Teachers need to filter search results by KS4-specific attributes:

- **Tier**: Foundation or Higher (GCSE difficulty levels)
- **Exam Board**: AQA, Edexcel, OCR, etc.
- **KS4 Option**: Combined Science, Triple Science, etc.

The Oak Open Curriculum API exposes this data via **top-down traversal** (sequence → year → tier → units → lessons), not as flat fields on lesson/unit resources. This design reflects the underlying **many-to-many relationships**:

| Relationship         | Cardinality  | Example                                          |
| -------------------- | ------------ | ------------------------------------------------ |
| Lesson → Tiers       | Many-to-many | Same lesson appears in Foundation AND Higher     |
| Lesson → Exam Boards | Many-to-many | Same lesson appears in AQA AND Edexcel sequences |
| Lesson → Units       | Many-to-many | Same lesson can appear in multiple units         |
| Unit → Programmes    | Many-to-many | Same unit appears in multiple programme contexts |

**Bottom-up** queries ("What tier is this lesson?") have multiple valid answers.  
**Top-down** traversal ("Get Higher tier AQA lessons") follows a deterministic path.

### Problem

To enable filtering in Elasticsearch, we need flat fields on indexed documents. However:

1. The upstream API doesn't provide flat `tier`, `examBoard`, etc. fields on lessons/units
2. We cannot request upstream API changes in the short term
3. Many-to-many relationships mean flat fields must be **arrays**, not scalars

### Data Available via API

**`/subjects` endpoint** provides:

```json
{
  "subjectSlug": "science",
  "sequenceSlugs": [
    {
      "sequenceSlug": "science-secondary-aqa",
      "ks4Options": { "title": "AQA GCSE Science", "slug": "aqa-gcse-science" }
    }
  ]
}
```

**`/sequences/{sequence}/units?year={year}` endpoint** provides:

```json
// KS4 Sciences: year → examSubjects → tiers → units
{
  "year": 10,
  "examSubjects": [
    {
      "examSubjectTitle": "Biology",
      "examSubjectSlug": "biology",
      "tiers": [
        {
          "tierTitle": "Foundation",
          "tierSlug": "foundation",
          "units": [{ "unitSlug": "...", "unitTitle": "..." }]
        },
        {
          "tierTitle": "Higher",
          "tierSlug": "higher",
          "units": [{ "unitSlug": "...", "unitTitle": "..." }]
        }
      ]
    }
  ]
}

// KS4 Maths: year → tiers → units (no examSubjects)
{
  "year": 10,
  "tiers": [
    {
      "tierTitle": "Foundation",
      "tierSlug": "foundation",
      "units": [{ "unitSlug": "...", "unitTitle": "..." }]
    }
  ]
}

// KS1-KS3: year → units (no tiers)
{
  "year": 7,
  "units": [{ "unitSlug": "...", "unitTitle": "..." }]
}
```

**Exam board** is encoded in the sequence slug (e.g., `science-secondary-aqa`).

## Decision

**Denormalise KS4 metadata at ingest time** by:

1. **Traverse sequences** in addition to existing lesson/unit fetches
2. **Build lookup tables** mapping units → tiers, units → exam boards
3. **Decorate indexed documents** with arrays of applicable values
4. **Continue caching all SDK requests in Redis** (per ADR-066)

### Index Schema (Denormalised)

```typescript
interface LessonDocument {
  // ... existing fields ...

  // KS4 metadata (arrays for many-to-many)
  tiers: string[]; // e.g., ["foundation", "higher"]
  tierTitles: string[]; // e.g., ["Foundation", "Higher"]
  examBoards: string[]; // e.g., ["aqa", "edexcel"]
  examBoardTitles: string[]; // e.g., ["AQA", "Edexcel"]
  ks4Options: string[]; // e.g., ["gcse-combined-science"]
  ks4OptionTitles: string[]; // e.g., ["GCSE Combined Science"]
  examSubjects: string[]; // e.g., ["biology", "chemistry"]
  examSubjectTitles: string[]; // e.g., ["Biology", "Chemistry"]
}

interface UnitDocument {
  // ... existing fields ...

  // Same KS4 metadata arrays
  tiers: string[];
  tierTitles: string[];
  examBoards: string[];
  examBoardTitles: string[];
  ks4Options: string[];
  ks4OptionTitles: string[];
  examSubjects: string[];
  examSubjectTitles: string[];
}
```

### Ingestion Sequence

The denormalisation happens **in addition to** existing ingestion, not as a replacement:

```text
Phase 1: Fetch reference data (existing)
├── GET /subjects                    → Subject list
├── GET /subjects/{subject}          → Subject details
└── GET /threads                     → Thread list

Phase 2: Fetch sequence metadata (NEW)
├── For each subject with KS4 content:
│   └── GET /sequences/{sequence}/units?year=10
│       └── Build unit → tier/examBoard lookup
│   └── GET /sequences/{sequence}/units?year=11
│       └── Build unit → tier/examBoard lookup

Phase 3: Fetch curriculum content (existing)
├── GET /key-stages/{ks}/subjects/{subject}/units
├── GET /units/{unit}/summary
└── GET /lessons/{lesson}/summary

Phase 4: Decorate and index (ENHANCED)
├── For each unit:
│   └── Look up tiers/examBoards from Phase 2
│   └── Add arrays to unit document
├── For each lesson:
│   └── Inherit from parent unit(s)
│   └── Add arrays to lesson document
└── Index to Elasticsearch
```

### Lookup Table Structure

```typescript
// Built from sequence traversal
interface SequenceMetadata {
  sequenceSlug: string;
  examBoard: string | null; // Parsed from slug or ks4Options
  examBoardTitle: string | null;
  ks4Option: string | null;
  ks4OptionTitle: string | null;
}

// Maps unitSlug → contexts it appears in
type UnitContextMap = Map<
  string,
  {
    tiers: Set<string>;
    tierTitles: Set<string>;
    examBoards: Set<string>;
    examBoardTitles: Set<string>;
    examSubjects: Set<string>;
    examSubjectTitles: Set<string>;
    ks4Options: Set<string>;
    ks4OptionTitles: Set<string>;
  }
>;
```

### Elasticsearch Filtering

With arrays, ES can filter using "any match" semantics:

```json
{
  "query": {
    "bool": {
      "filter": [{ "term": { "tiers": "foundation" } }, { "term": { "examBoards": "aqa" } }]
    }
  }
}
```

This matches lessons that appear in Foundation tier AND appear in AQA sequences, which is the correct semantic for many-to-many relationships.

### Redis Caching

**All SDK requests continue to be cached in Redis** per ADR-066:

- Sequence endpoints cached with same TTL (14 days + jitter per ADR-079)
- Cache key pattern: `oak-curriculum:{operationId}:{hash}`
- No special treatment for sequence data

### Parsing Exam Board from Sequence Slug

When `ks4Options` doesn't provide explicit exam board, parse from slug:

```typescript
function parseExamBoardFromSlug(sequenceSlug: string): string | null {
  const knownExamBoards = ['aqa', 'edexcel', 'ocr', 'eduqas', 'edexcelb'];
  const slugParts = sequenceSlug.toLowerCase().split('-');
  return knownExamBoards.find((eb) => slugParts.includes(eb)) ?? null;
}

// science-secondary-aqa → "aqa"
// maths-secondary → null (no exam board for maths)
```

## Rationale

### Why Denormalise vs Join at Query Time

Elasticsearch is not a relational database. Joins are:

1. **Not supported natively** in the way SQL databases support them
2. **Expensive** when simulated via application-side queries
3. **Incompatible with RRF** (Reciprocal Rank Fusion) scoring

Denormalisation at ingest time is the ES-native approach.

### Why Arrays vs Flat Fields

Arrays truthfully represent many-to-many relationships:

- A lesson in both Foundation AND Higher tiers: `tiers: ["foundation", "higher"]`
- Filtering for "foundation" matches this lesson (correct)
- Filtering for "foundation AND higher" also matches (correct)

Flat fields would force us to choose one value, losing information.

### Why Continue Caching

Sequence traversal adds API calls. With 10,000 req/hr rate limit:

- ~50 subjects × ~2 sequences avg × 2 years (10, 11) = ~200 additional calls per full ingest
- Caching prevents repeated calls during re-ingestion
- 14-day TTL with jitter prevents thundering herd

### Why NOT Wait for Upstream API Changes

1. Upstream changes have uncertain timeline
2. We can deliver value now with denormalisation
3. When upstream adds flat fields, we simplify—but the index schema stays the same

## Consequences

### Positive

- **Enables KS4 filtering** without upstream API changes
- **Truthful representation** of many-to-many relationships
- **ES-native** approach (denormalisation is idiomatic)
- **No breaking changes** to existing ingestion (additive)
- **Future-proof** (same schema works when upstream adds flat fields)

### Negative

- **Additional API calls** during ingestion (~200 per full ingest)
- **Complexity** in ingestion code (sequence traversal + lookup tables)
- **Data may be incomplete** if sequence data doesn't cover all units/lessons
- **Maintenance burden** (must keep parsing logic in sync with upstream patterns)

### Neutral

- **No runtime performance impact** (denormalisation happens at ingest time)
- **Index size increases slightly** (additional array fields)
- **Query patterns unchanged** (term filters work on arrays)

## Limitations

### Incomplete Coverage

Not all lessons/units can be associated with KS4 metadata:

1. **Lessons not in KS4 sequences**: Will have empty arrays (correct—they have no tier)
2. **Units that exist outside sequences**: May have incomplete metadata
3. **New content**: Requires re-ingestion to pick up sequence associations

### Filter Semantics

With arrays, `tier: "foundation"` matches lessons that **include** Foundation tier:

- A Foundation-only lesson: matches ✓
- A Foundation+Higher lesson: matches ✓ (may or may not be desired)

For **exclusive** filtering ("Foundation only, not Higher"), query must be:

```json
{
  "bool": {
    "filter": [{ "term": { "tiers": "foundation" } }],
    "must_not": [{ "term": { "tiers": "higher" } }]
  }
}
```

## Implementation Plan

1. **Add sequence traversal to ingestion** (`document-transforms.ts`)
2. **Build unit context lookup** from sequence data
3. **Update field definitions** with new array fields
4. **Decorate documents** during indexing
5. **Update ES mappings** via type-gen
6. **Add unit tests** for lookup table building
7. **Add smoke tests** for KS4 filtering

## Related Documentation

- [Upstream API Wishlist](../../../.agent/plans/external/upstream-api-metadata-wishlist.md) - Request for flat fields
- [Phase 3 Plan](../../../.agent/plans/semantic-search/phase-3-multi-index-and-fields.md) - Implementation context
- [ADR-066: SDK Response Caching](066-sdk-response-caching.md) - Redis caching strategy
- [ADR-079: SDK Cache TTL Jitter](079-sdk-cache-ttl-jitter.md) - Cache TTL strategy

## References

- Elasticsearch: [Search multiple indices](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-multiple-indices.html)
- Elasticsearch: [Term query on arrays](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)
- Oak API: [Sequences endpoint](https://open-api.thenational.academy/docs)
