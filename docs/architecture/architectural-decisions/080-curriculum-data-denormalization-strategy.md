# ADR-080: Comprehensive Curriculum Structure & Denormalisation Strategy

**Status**: Accepted  
**Date**: 2025-12-15 (Updated 2025-12-28 - comprehensive analysis of all 17 subjects × 4 key stages)  
**Decision Makers**: AI Platform Team  
**Related ADRs**: [ADR-066](066-sdk-response-caching.md), [ADR-067](067-sdk-generated-elasticsearch-mappings.md), [ADR-076](076-elser-only-embedding-strategy.md)  
**Analysis Document**: [Curriculum Structure Analysis](../../../.agent/plans/curriculum-structure-analysis.md)

## Scope

This ADR documents the **complete structural analysis** of:

- **17 subjects**: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish
- **4 key stages**: KS1, KS2, KS3, KS4
- **30 bulk download files** (one subject has no bulk file)
- **~12,320 unique lessons** (513 duplicates in raw bulk data, 2025-12-30 snapshot)

## Context

The Oak National Academy curriculum API has **7 distinct structural patterns** that require different handling:

| Pattern | Description                 | Subjects Affected                                      |
| ------- | --------------------------- | ------------------------------------------------------ |
| 1       | Simple flat (Primary)       | All subjects with primary content (15 of 17)           |
| 2       | Simple flat (Secondary KS3) | All subjects (17)                                      |
| 3       | Tier variants               | Maths KS4 (Foundation/Higher at year level)            |
| 4       | Exam board variants         | 12 subjects with multiple KS4 sequences                |
| 5       | Exam subject split          | Science KS4 only (Biology/Chemistry/Physics/Combined)  |
| 6       | Unit options                | Art, D&T, English, Geography, History, RE (6 subjects) |
| 7       | No KS4 content              | Cooking-nutrition (stops at KS3)                       |

### Key Stage Coverage Gaps

Not all subjects cover all key stages:

| Gap Type                  | Subjects Affected                        |
| ------------------------- | ---------------------------------------- |
| No KS1 (primary KS2 only) | French, Spanish (languages start Year 3) |
| No primary at all         | German, Citizenship                      |
| No KS4 at all             | Cooking-nutrition                        |
| No bulk download file     | RSHE-PSHE (API only)                     |

Teachers need to filter search results by:

- **Tier**: Foundation or Higher (GCSE difficulty levels)
- **Exam Board**: AQA, Edexcel, OCR, Eduqas, etc.
- **Exam Subject**: Biology, Chemistry, Physics (for combined science)
- **KS4 Option**: Combined Science, Triple Science, etc.

The API exposes this data via **top-down traversal** (sequence → year → tier/examSubject → units → lessons), not as flat fields on lesson/unit resources. This design reflects the underlying **many-to-many relationships**:

| Relationship           | Cardinality  | Example                                                       |
| ---------------------- | ------------ | ------------------------------------------------------------- |
| Lesson → Tiers         | Many-to-many | Same lesson appears in Foundation AND Higher                  |
| Lesson → Exam Boards   | Many-to-many | Same lesson appears in AQA AND Edexcel sequences              |
| Lesson → Units         | Many-to-many | Same lesson can appear in multiple units                      |
| Lesson → Exam Subjects | Many-to-many | Same lesson appears in combined-science AND separate sciences |
| Unit → Programmes      | Many-to-many | Same unit appears in multiple programme contexts              |

**Bottom-up** queries ("What tier is this lesson?") have multiple valid answers.  
**Top-down** traversal ("Get Higher tier AQA lessons") follows a deterministic path.

### Problem

To enable filtering in Elasticsearch, we need flat fields on indexed documents. However:

1. The upstream API doesn't provide flat `tier`, `examBoard`, etc. fields on lessons/units
2. **No single traversal algorithm** works for all subjects — pattern detection is required
3. Many-to-many relationships mean flat fields must be **arrays**, not scalars
4. Science KS4 uses exam subjects that are NOT in the API subject enum

## Decision

**Denormalise curriculum metadata at ingest time** by:

1. **Detect structural pattern** for each subject/keyStage combination
2. **Traverse sequences** using pattern-appropriate traversal
3. **Build lookup tables** mapping units → tiers, units → exam boards, units → exam subjects
4. **Decorate indexed documents** with arrays of applicable values
5. **Continue caching all SDK requests in Redis** (per ADR-066)

### Structural Pattern Detection

The ingestion pipeline must detect and handle these patterns:

#### Pattern 1: Simple Flat (Primary — KS1/KS2)

**Applies to**: All 15 subjects with primary content

**Detection**: Sequence slug ends in `-primary`, years 1-6

**Traversal**: `sequence → year → units[] → lessons[]`

**Characteristics**:

- No exam boards, tiers, or exam subjects
- No unit options
- No duplicates in bulk data
- Simple 1:1 lesson-to-unit mapping

**Special cases**:

- French, Spanish: Primary covers KS2 only (Years 3-6), no KS1
- German, Citizenship: No primary content at all

#### Pattern 2: Simple Flat (Secondary KS3)

**Applies to**: All 17 subjects

**Detection**: Secondary sequence, years 7-9

**Traversal**: `sequence → year → units[] → lessons[]`

**Characteristics**:

- Same simple structure as primary
- All subjects have KS3 content
- No complex nesting at this level

**Exception**: Science KS3 still uses `science` as subject slug (exam subjects only appear at KS4)

#### Pattern 3: Tier Variants (Maths KS4)

**Detection**: Response contains `tiers[]` at year level

```json
{ "year": 10, "tiers": [{ "tierSlug": "foundation", "units": [...] }] }
```

**Traversal**: `sequence → year → tiers[] → units[] → lessons[]`

#### Pattern 5: Exam Subject Split (Science KS4)

**Detection**: Response contains `examSubjects[]` at year level

```json
{ "year": 10, "examSubjects": [{ "examSubjectSlug": "biology", "tiers": [...] }] }
```

**Traversal**: `sequence → year → examSubjects[] → tiers[] → units[] → lessons[]`

**Critical**: Science KS4 returns empty from `/key-stages/ks4/subject/science/lessons`. Must use sequences endpoint.

#### Pattern 6: Unit Options (Art, D&T, English, Geography, History, RE)

**Detection**: Units contain `unitOptions[]` field

```json
{ "unitTitle": "Modern text: first study", "unitOptions": [{ "unitSlug": "...-198" }, ...] }
```

**Traversal**: Standard, but must track that lessons belong to multiple unit variants and aggregate `unit_ids` for each lesson.

**Subjects with unitOptions at KS4:**

| Subject             | Unit Option Examples                                        | Options Per Unit |
| ------------------- | ----------------------------------------------------------- | ---------------- |
| Art                 | Fine Art, Photography, Textiles, 3D Design, Graphic Comms   | 5-6              |
| Design-Technology   | Papers/boards, Polymers/timbers, Textiles                   | 2-3              |
| English             | Different set texts (Animal Farm, Inspector Calls, etc.)    | 2-4              |
| Geography           | Physical topics (Coastal, River, Glacial) or environments   | 2-3              |
| History             | Historic environments, Thematic studies (Health, Migration) | 2-6              |
| Religious Education | Buddhism vs Islam beliefs/practices                         | 2                |

**Bulk download implications**: These subjects show duplicate lesson entries where the same lesson appears in multiple unitOptions (English: 26 dups, Geography: 67 dups)

#### Pattern 4: Exam Board Variants (12 Subjects)

**Detection**: Subject has multiple sequences with different `ks4Options.slug` values.

**Subjects with exam board variants:**

| Subject             | KS4 Options (Exam Boards)     |
| ------------------- | ----------------------------- |
| Citizenship         | Core, GCSE                    |
| Computing           | AQA, Core, GCSE, OCR          |
| English             | AQA, Edexcel, Eduqas          |
| French              | AQA, Edexcel                  |
| Geography           | AQA, Edexcel B                |
| German              | AQA, Edexcel                  |
| History             | AQA, Edexcel                  |
| Music               | AQA, Edexcel, Eduqas, OCR     |
| Physical Education  | AQA, Core, Edexcel, GCSE, OCR |
| Religious Education | AQA, Core, Edexcel B, Eduqas  |
| Science             | AQA, Edexcel, OCR             |
| Spanish             | AQA, Edexcel                  |

**Note**: Subjects without `ks4Options` (Art, D&T, Maths, RSHE-PSHE, Cooking-nutrition) use a single secondary sequence with `ks4Options: null`.

**Traversal**: Must query each sequence and aggregate exam boards per lesson.

**API behavior note**: Some subjects (e.g., Physical Education GCSE) return the same units multiple times in a single sequence query — this is by design when content is shared across exam boards. The pipeline must deduplicate units by slug while aggregating the exam board context.

#### Pattern 7: No KS4 Content (Cooking-nutrition)

**Applies to**: Cooking-nutrition only

**Detection**: Secondary sequence only covers years 7-9

**Traversal**: Skip KS4 traversal entirely

**Bulk data**: `cooking-nutrition-secondary.json` contains only KS3 content (36 lessons, all with `keyStageSlug: "ks3"`)

**Ingestion impact**: When iterating subjects for KS4, exclude cooking-nutrition to avoid empty responses.

---

### Subject × Key Stage Matrix: Data Nuances

This matrix shows specific nuances for each subject at each key stage:

| Subject             | KS1    | KS2    | KS3    | KS4                                                |
| ------------------- | ------ | ------ | ------ | -------------------------------------------------- |
| Art                 | Simple | Simple | Simple | Unit options (6 specialisms)                       |
| Citizenship         | —      | —      | Simple | Exam boards (Core, GCSE)                           |
| Computing           | Simple | Simple | Simple | Exam boards (AQA, Core, GCSE, OCR)                 |
| Cooking-nutrition   | Simple | Simple | Simple | **No content**                                     |
| Design-technology   | Simple | Simple | Simple | Unit options (3 material types)                    |
| English             | Simple | Simple | Simple | Unit options + Exam boards (AQA, Edexcel, Eduqas)  |
| French              | —      | Simple | Simple | Exam boards (AQA, Edexcel)                         |
| Geography           | Simple | Simple | Simple | Unit options + Exam boards (AQA, Edexcel B)        |
| German              | —      | —      | Simple | Exam boards (AQA, Edexcel)                         |
| History             | Simple | Simple | Simple | Unit options + Exam boards (AQA, Edexcel)          |
| Maths               | Simple | Simple | Simple | **Tier variants** (Foundation/Higher)              |
| Music               | Simple | Simple | Simple | Exam boards (AQA, Edexcel, Eduqas, OCR)            |
| Physical-education  | Simple | Simple | Simple | Exam boards (AQA, Core, Edexcel, GCSE, OCR)        |
| Religious-education | Simple | Simple | Simple | Unit options + Exam boards (4)                     |
| RSHE-PSHE           | Simple | Simple | Simple | Simple (no bulk file)                              |
| Science             | Simple | Simple | Simple | **Exam subjects** (Bio/Chem/Phys/Combined) + Tiers |
| Spanish             | —      | Simple | Simple | Exam boards (AQA, Edexcel)                         |

**Legend**:

- **Simple**: Standard `units[] → lessons[]` structure
- **—**: No content for this key stage
- **Unit options**: Units have `unitOptions[]` with alternative content paths
- **Exam boards**: Multiple sequences with different `ks4Options.slug`
- **Tier variants**: `tiers[]` at year level (Foundation/Higher)
- **Exam subjects**: `examSubjects[]` at year level (Biology, Chemistry, Physics, Combined Science)

## Architecture

### Data Flow Overview

```mermaid
flowchart TB
    subgraph "Upstream Oak API"
        API_SUBJECTS["/subjects"]
        API_SEQUENCES["/sequences/{seq}/units"]
        API_UNITS["/units/{unit}/summary"]
        API_LESSONS["/lessons/{lesson}/summary"]
    end

    subgraph "SDK Cache Layer"
        REDIS[(Redis Cache<br/>14 day TTL + jitter)]
    end

    subgraph "Ingestion Pipeline"
        direction TB
        FETCH_REF["Phase 1: Fetch Reference Data"]
        DETECT["Phase 2: Detect Pattern per Subject/KS"]
        TRAVERSE["Phase 3: Pattern-Appropriate Traversal"]
        BUILD_MAP["Build UnitContextMap"]
        FETCH_CONTENT["Phase 4: Fetch Curriculum Content"]
        DECORATE["Phase 5: Decorate Documents"]
    end

    subgraph "Elasticsearch"
        ES_LESSONS[oak_lessons index]
        ES_UNITS[oak_units index]
        ES_ROLLUP[oak_unit_rollup index]
    end

    API_SUBJECTS --> REDIS
    API_SEQUENCES --> REDIS
    API_UNITS --> REDIS
    API_LESSONS --> REDIS

    REDIS --> FETCH_REF
    REDIS --> TRAVERSE
    REDIS --> FETCH_CONTENT

    FETCH_REF --> DETECT
    DETECT --> TRAVERSE
    TRAVERSE --> BUILD_MAP
    BUILD_MAP --> DECORATE
    FETCH_CONTENT --> DECORATE

    DECORATE --> ES_LESSONS
    DECORATE --> ES_UNITS
    DECORATE --> ES_ROLLUP
```

### UnitContextMap Building Process

```mermaid
flowchart LR
    subgraph "Sequence Response Structures"
        SCIENCES["Sciences Structure<br/>year → examSubjects[] → tiers[] → units[]"]
        MATHS["Maths Structure<br/>year → tiers[] → units[]"]
        OPTIONS["Unit Options<br/>year → units[] with unitOptions[]"]
        OTHERS["Other Subjects<br/>year → units[]"]
    end

    subgraph "Context Building"
        PARSE["parseExamBoardFromSlug()"]
        EXTRACT["extractKs4Option()"]
        DETECT["detectStructuralPattern()"]
        BUILD["buildUnitContextsFromSequenceResponse()"]
        MERGE["mergeUnitContexts()"]
    end

    subgraph "Output"
        MAP["UnitContextMap<br/>Map&lt;unitSlug, AggregatedUnitContext&gt;"]
    end

    SCIENCES --> DETECT
    MATHS --> DETECT
    OPTIONS --> DETECT
    OTHERS --> DETECT

    DETECT --> BUILD

    PARSE --> BUILD
    EXTRACT --> BUILD
    BUILD --> MERGE
    MERGE --> MAP
```

### Pattern Detection Logic

```typescript
interface SequenceYearData {
  year: number;
  units?: UnitData[];
  tiers?: TierData[];
  examSubjects?: ExamSubjectData[];
}

type StructuralPattern =
  | 'simple' // Patterns 1, 2: flat units
  | 'tier-variants' // Pattern 3: maths KS4
  | 'exam-subjects' // Pattern 5: science KS4
  | 'unit-options'; // Pattern 6: english/geography

function detectPattern(yearData: SequenceYearData): StructuralPattern {
  if (yearData.examSubjects) return 'exam-subjects';
  if (yearData.tiers) return 'tier-variants';
  if (yearData.units?.some((u) => u.unitOptions)) return 'unit-options';
  return 'simple';
}
```

### Filtering Architecture

```mermaid
flowchart LR
    subgraph "Search Request"
        REQ["POST /api/search<br/>{tier: 'foundation', examBoard: 'aqa'}"]
    end

    subgraph "Query Building"
        FILTERS["createLessonFilters()<br/>createUnitFilters()"]
        RRF["RRF Query Builder"]
    end

    subgraph "Elasticsearch Query"
        BOOL["bool filter:<br/>term: {tiers: 'foundation'}<br/>term: {exam_boards: 'aqa'}"]
    end

    subgraph "Results"
        RESULTS["Filtered Results<br/>(only matching documents)"]
    end

    REQ --> FILTERS
    FILTERS --> RRF
    RRF --> BOOL
    BOOL --> RESULTS
```

## Filterable Fields

### KS4 Metadata Fields

All KS4 metadata is indexed as **arrays** to support many-to-many relationships:

| Field                 | Type     | Source                        | Purpose                     |
| --------------------- | -------- | ----------------------------- | --------------------------- |
| `tiers`               | string[] | Sequence traversal            | Filter by Foundation/Higher |
| `tier_titles`         | string[] | Sequence traversal            | Display titles              |
| `exam_boards`         | string[] | Parsed from sequence slug     | Filter by AQA/Edexcel/etc   |
| `exam_board_titles`   | string[] | Parsed from sequence slug     | Display titles              |
| `exam_subjects`       | string[] | Sequence traversal (sciences) | Filter by Biology/Chemistry |
| `exam_subject_titles` | string[] | Sequence traversal (sciences) | Display titles              |
| `ks4_options`         | string[] | `/subjects` endpoint          | Filter by programme pathway |
| `ks4_option_titles`   | string[] | `/subjects` endpoint          | Display titles              |

### Additional Filterable Fields

These fields are also available from the sequence response and are indexed:

| Field           | Type     | Source            | Purpose                     |
| --------------- | -------- | ----------------- | --------------------------- |
| `thread_slugs`  | string[] | Unit threads[]    | Filter by curriculum thread |
| `thread_titles` | string[] | Unit threads[]    | Display titles              |
| `categories`    | string[] | Unit categories[] | Filter by category          |

### Known Values

**Exam Boards** (parsed from sequence slugs):

- `aqa` - AQA
- `edexcel` - Edexcel
- `ocr` - OCR
- `eduqas` - Eduqas
- `edexcelb` - Edexcel B

**Tiers**:

- `foundation` - Foundation
- `higher` - Higher

## Index Schema

```typescript
interface LessonDocument {
  // ... existing fields ...

  // KS4 metadata (arrays for many-to-many)
  tiers: string[]; // e.g., ["foundation", "higher"]
  tier_titles: string[]; // e.g., ["Foundation", "Higher"]
  exam_boards: string[]; // e.g., ["aqa", "edexcel"]
  exam_board_titles: string[]; // e.g., ["AQA", "Edexcel"]
  exam_subjects: string[]; // e.g., ["biology", "chemistry"]
  exam_subject_titles: string[]; // e.g., ["Biology", "Chemistry"]
  ks4_options: string[]; // e.g., ["gcse-combined-science"]
  ks4_option_titles: string[]; // e.g., ["GCSE Combined Science"]
}

interface UnitDocument {
  // ... existing fields ...

  // Same KS4 metadata arrays
  tiers: string[];
  tier_titles: string[];
  exam_boards: string[];
  exam_board_titles: string[];
  exam_subjects: string[];
  exam_subject_titles: string[];
  ks4_options: string[];
  ks4_option_titles: string[];
}
```

## Ingestion Sequence

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

## Elasticsearch Filtering

With arrays, ES uses "any match" semantics:

```json
{
  "query": {
    "bool": {
      "filter": [{ "term": { "tiers": "foundation" } }, { "term": { "exam_boards": "aqa" } }]
    }
  }
}
```

This matches lessons that appear in Foundation tier AND appear in AQA sequences.

For **exclusive** filtering ("Foundation only, not Higher"):

```json
{
  "bool": {
    "filter": [{ "term": { "tiers": "foundation" } }],
    "must_not": [{ "term": { "tiers": "higher" } }]
  }
}
```

## Implementation

### Key Files

| File                                             | Purpose                             |
| ------------------------------------------------ | ----------------------------------- |
| `src/lib/indexing/ks4-context-types.ts`          | Type definitions and type guards    |
| `src/lib/indexing/ks4-context-builder.ts`        | Sequence traversal and map building |
| `src/lib/indexing/document-transform-helpers.ts` | `extractKs4DocumentFields()`        |
| `type-gen/.../curriculum.ts`                     | Field definitions (schema source)   |

All files are in `apps/oak-open-curriculum-semantic-search/`.

### Key Functions

| Function                                  | Purpose                                 |
| ----------------------------------------- | --------------------------------------- |
| `parseExamBoardFromSlug()`                | Extracts exam board from sequence slug  |
| `buildUnitContextsFromSequenceResponse()` | Parses sequence response structure      |
| `buildKs4ContextMap()`                    | Orchestrates full map building          |
| `getKs4ContextForUnit()`                  | Retrieves aggregated context for a unit |
| `extractKs4DocumentFields()`              | Converts context to document fields     |

## Implementation Notes

### Critical: Process ALL Sequences (2025-12-18 Fix)

**Lesson learned**: Do NOT skip sequences based on exam board or ks4Options presence.

The original implementation had:

```typescript
// WRONG - skips Maths-style sequences
if (!isKs4Sequence(examBoard, ks4Option)) {
  return contextMap; // Early return
}
```

This caused `maths-secondary` to be skipped because:

- No exam board in slug (unlike `science-secondary-aqa`)
- `ks4Options: null` in subjects API response

But `maths-secondary` **DOES** contain tier data embedded in Year 10/11 entries. The fix is to process ALL sequences and let `buildUnitContextsFromSequenceResponse()` extract tiers wherever they exist:

```typescript
// CORRECT - process all sequences
async function processSequenceForKs4Context(...) {
  // No early return - process all sequences
  const response = await fetchSequenceUnits(sequence.sequenceSlug);
  const contexts = buildUnitContextsFromSequenceResponse(response, examBoard, ks4Option);
  // contexts will be empty for non-tiered years (correct behaviour)
  return mergeUnitContexts(contextMap, contexts);
}
```

**Result**: 251 Foundation lessons, 314 Higher lessons now correctly indexed for Maths KS4.

### Critical: Tier Is Many-to-Many (2025-12-20 Cleanup)

**Lesson learned**: Tier must be modelled as an ARRAY, not a scalar.

A lesson can appear in BOTH Foundation AND Higher tiers:

| Relationship   | Cardinality  | Example                                      |
| -------------- | ------------ | -------------------------------------------- |
| Lesson → Tiers | Many-to-many | Same lesson appears in Foundation AND Higher |

**Correct implementation** (already in place):

- `extractKs4DocumentFields()` returns `tiers: string[]` and `tier_titles: string[]`
- Data comes from `/sequences/{sequence}/units` via `buildKs4ContextMap()`

**Dead code removed** (2025-12-20):

- `programme-factor-extractors.ts` deleted - it tried to derive a SINGLE `tier` value from slug suffixes (never worked)
- The vestigial singular `tier` field in the schema should also be removed (cleanup pending)

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

For **exclusive** filtering ("Foundation only, not Higher"), query must explicitly exclude.

## Appendix: Complete Subject Analysis (2025-12-28)

### All 17 Subjects with Key Stage Coverage

| Subject             | KS1 | KS2 | KS3 | KS4 | KS4 Patterns                 | Bulk File Exists |
| ------------------- | --- | --- | --- | --- | ---------------------------- | ---------------- |
| Art                 | ✓   | ✓   | ✓   | ✓   | Unit options (6 specialisms) | ✓                |
| Citizenship         | —   | —   | ✓   | ✓   | Exam boards (Core, GCSE)     | ✓                |
| Computing           | ✓   | ✓   | ✓   | ✓   | Exam boards (4)              | ✓                |
| Cooking-nutrition   | ✓   | ✓   | ✓   | —   | N/A (no KS4)                 | ✓                |
| Design-technology   | ✓   | ✓   | ✓   | ✓   | Unit options (materials)     | ✓                |
| English             | ✓   | ✓   | ✓   | ✓   | Unit options + Exam boards   | ✓                |
| French              | —   | ✓   | ✓   | ✓   | Exam boards (AQA, Edexcel)   | ✓                |
| Geography           | ✓   | ✓   | ✓   | ✓   | Unit options + Exam boards   | ✓                |
| German              | —   | —   | ✓   | ✓   | Exam boards (AQA, Edexcel)   | ✓                |
| History             | ✓   | ✓   | ✓   | ✓   | Unit options + Exam boards   | ✓                |
| Maths               | ✓   | ✓   | ✓   | ✓   | **Tier variants** (F/H)      | ✓                |
| Music               | ✓   | ✓   | ✓   | ✓   | Exam boards (4)              | ✓                |
| Physical-education  | ✓   | ✓   | ✓   | ✓   | Exam boards (5)              | ✓                |
| Religious-education | ✓   | ✓   | ✓   | ✓   | Unit options + Exam boards   | ✓                |
| RSHE-PSHE           | ✓   | ✓   | ✓   | ✓   | Simple                       | **No**           |
| Science             | ✓   | ✓   | ✓   | ✓   | **Exam subjects** + Tiers    | ✓                |
| Spanish             | —   | ✓   | ✓   | ✓   | Exam boards (AQA, Edexcel)   | ✓                |

### Bulk Download Lesson Counts

| Subject             | Primary | Secondary | Raw Total  | Unique Lessons | Duplicates | Cause of Duplicates    |
| ------------------- | ------- | --------- | ---------- | -------------- | ---------- | ---------------------- |
| English             | 1,516   | 1,035     | 2,551      | 2,525          | 26         | Unit options           |
| Maths               | 1,072   | 1,235     | 2,307      | 1,934          | 373        | Tier variants (F/H)    |
| Science             | 390     | 888       | 1,278      | 1,277          | 1          | Cross-unit sharing     |
| Physical-education  | 432     | 560       | 992        | 992            | 0          | —                      |
| Geography           | 223     | 527       | 750        | 683            | 67         | Unit options           |
| History             | 216     | 468       | 684        | 684            | 0          | —                      |
| Religious-education | 216     | 396       | 612        | 612            | 0          | —                      |
| Computing           | 180     | 348       | 528        | 528            | 0          | —                      |
| Spanish             | 112     | 413       | 525        | 525            | 0          | —                      |
| French              | 105     | 417       | 522        | 522            | 0          | —                      |
| Music               | 216     | 218       | 434        | 434            | 0          | —                      |
| German              | —       | 411       | 411        | 411            | 0          | —                      |
| Art                 | 214     | 189       | 403        | 403            | 0          | —                      |
| Design-technology   | 144     | 216       | 360        | 360            | 0          | —                      |
| Citizenship         | —       | 318       | 318        | 318            | 0          | —                      |
| Cooking-nutrition   | 72      | 36        | 108        | 108            | 0          | —                      |
| RSHE-PSHE           | ?       | ?         | ?          | ?              | ?          | No bulk file available |
| **TOTAL**           | —       | —         | **12,833** | **~12,320**    | **513**    | —                      |

### KS4 Lesson Counts by Subject (from Bulk)

| Subject             | KS4 Lessons | Notes                         |
| ------------------- | ----------- | ----------------------------- |
| Maths               | 809         | 373 are tier duplicates       |
| Science             | 598         | Via examSubjects endpoint     |
| English             | 571         | 26 are unit option duplicates |
| Physical-education  | 344         | —                             |
| Religious-education | 288         | —                             |
| Geography           | 281         | 67 are unit option duplicates |
| History             | 248         | —                             |
| Computing           | 240         | —                             |
| Spanish             | 216         | —                             |
| Citizenship         | 209         | —                             |
| French              | 209         | —                             |
| German              | 208         | —                             |
| Design-technology   | 144         | —                             |
| Music               | 110         | —                             |
| Art                 | 76          | —                             |
| Cooking-nutrition   | 0           | No KS4 content                |

## Related Documentation

- [Upstream API Wishlist](../../../.agent/plans/external/ooc-api-wishlist/index.md) - Request for flat fields
- [Semantic Search Prompt](../../../.agent/prompts/semantic-search/semantic-search.prompt.md) - Entry point for AI sessions
- [ADR-066: SDK Response Caching](066-sdk-response-caching.md) - Redis caching strategy
- [ADR-079: SDK Cache TTL Jitter](079-sdk-cache-ttl-jitter.md) - Cache TTL strategy

## References

- Elasticsearch: [Search multiple indices](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-multiple-indices.html)
- Elasticsearch: [Term query on arrays](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)
- Elasticsearch: [RRF (Reciprocal Rank Fusion)](https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html)
- Oak API: [Sequences endpoint](https://open-api.thenational.academy/docs)
