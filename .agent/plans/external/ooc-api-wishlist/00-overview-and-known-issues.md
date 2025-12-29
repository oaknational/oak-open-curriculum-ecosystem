# Upstream Open Curriculum API Metadata Enhancement Wish List

- Upstream API docs: <https://open-api.thenational.academy/docs/about-oaks-api/api-overview>
- OpenAPI schema: <https://open-api.thenational.academy/api/v0/swagger.json>
- API front page: <https://open-api.thenational.academy/>

## Open Questions

- Does OpenAPI 3.0 support `examples` at the path level, rather than just at the parameter level?
- Can we update the OpenAPI spec to OpenAPI 3.1? Does GCP support this?
- Can we make sure that the API uses Zod 4?
- Can we make sure that the API ships the Zod schemas as code snippets, in addition to JSON Schema?
- Can we enhance the metadata of the API to make it more useful for AI agents?
- Can we improve data integrity at the API level?

---

## Binary Response Schema Fix (2025-12-16)

**Status**: 🔴 HIGH PRIORITY — Causes `z.unknown()` in generated SDK  
**Endpoint**: `/api/v0/lessons/{lessonSlug}/assets/{assetSlug}`  
**Response**: `LessonAssetResponse`

### Problem

The upstream OpenAPI schema incorrectly declares a JSON response for what is actually a binary file stream:

```yaml
# Current (incorrect)
responses:
  200:
    content:
      application/json:
        schema: {}   # Empty schema → generates z.unknown()
```

This generates `LessonAssetResponseSchema = z.unknown()` in the SDK, which:

1. Provides no type information
2. Cannot validate the response
3. Violates our strictness requirements

### Requested Fix

Change to idiomatic OpenAPI for binary responses:

```yaml
# Correct
responses:
  200:
    description: Binary asset file (PDF, image, video, etc.)
    content:
      application/octet-stream:
        schema:
          type: string
          format: binary
      application/pdf:
        schema:
          type: string
          format: binary
      image/*:
        schema:
          type: string
          format: binary
```

### Why This Matters

- **Type safety**: SDK can generate proper `Blob` or `ArrayBuffer` types
- **Documentation**: Consumers understand the response is binary, not JSON
- **Validation**: Response type validation becomes meaningful

### SDK Workaround (Current)

We currently accept `z.unknown()` for this endpoint because:

1. We cannot validate binary streams with Zod anyway
2. The upstream schema is the source of truth
3. This is documented as a legitimate exception pending upstream fix

---

## Legitimate `z.unknown()` Exceptions Registry (2025-12-16)

**Context**: Our strictness requirements mandate that all Zod schemas be explicit. However, some `z.unknown()` usages are **legitimate** due to genuinely dynamic data. This registry documents those exceptions.

### Exception 1: Elasticsearch Aggregations

**Pattern**: `z.record(z.string(), z.unknown())`  
**Location**: Search response schemas (`responses.lessons.ts`, `responses.units.ts`, etc.)  
**Field**: `AggregationsSchema`

```typescript
const AggregationsSchema = z.record(z.string(), z.unknown()).default({});
```

**Justification**:

- Elasticsearch aggregations have genuinely dynamic structure
- Shape depends on the query (terms, histogram, nested, etc.)
- Keys are aggregation names chosen at query time
- Values are polymorphic aggregation results

**Status**: ✅ LEGITIMATE — Cannot be made stricter without losing functionality

### Exception 2: Binary File Responses (Pending Upstream Fix)

**Pattern**: `z.unknown()`  
**Location**: `curriculumZodSchemas.ts`  
**Schema**: `LessonAssetResponseSchema`

**Justification**:

- Upstream declares empty JSON schema for binary endpoint
- See "Binary Response Schema Fix" section above for upstream request

**Status**: ⚠️ PENDING UPSTREAM — Will become `z.instanceof(Blob)` or similar when fixed

---

## Unit Summary `unitLessons` Truncation (2025-12-20)

**Status**: 🔴 HIGH PRIORITY — OpenAPI schema claims "All" but returns truncated data  
**Endpoint**: `/api/v0/units/{unitSlug}/summary`  
**Field**: `unitLessons[]`

### Problem

The `unitLessons` array in unit summary responses is **truncated** and does not return the complete list of lessons for a unit.

**Critical**: The OpenAPI schema explicitly documents this field as:

```json
"unitLessons": {
  "type": "array",
  "items": { ... },
  "description": "All the lessons contained in the unit"  // ← INCORRECT
}
```

The description says **"All the lessons"** but the actual data is truncated. This is a **documentation/data discrepancy** that misleads consumers.

**Example for `algebraic-fractions` unit**:

| Source | Lesson Count | Status |
|--------|--------------|--------|
| `/units/algebraic-fractions/summary` → `unitLessons[]` | **2 lessons** | ❌ Truncated |
| `/key-stages/ks4/subject/maths/lessons?unit=algebraic-fractions` | **10 lessons** | ✅ Complete |

This represents an **80% data loss** for this single unit.

**Impact on Maths KS4**:

| Source | Total Lessons |
|--------|---------------|
| Unit summaries (`unitLessons[]`) | ~314 |
| Lessons endpoint (paginated) | ~650+ |

### Root Cause Analysis

**Verified via upstream API code** (`reference/oak-openapi/`):

- The unit summary uses `sequenceView` (materialized view `published_mv_curriculum_sequence_b_13_0_17`)
- The `lessons` field is a **JSON array embedded in the sequence record** — a denormalised snapshot
- This snapshot appears to be truncated at materialization time
- The lessons endpoint uses `unitVariantLessonsView` — a normalised, row-per-lesson view with complete data

This may be **intentional** (designed for quick overview) or a **data bug** (materialisation should include all lessons). The API team should clarify.

### Requested Fix (Choose One)

**Option A**: Fix the data — make `unitLessons[]` actually contain all lessons

Ensure the materialized view includes all lessons. Add `lessonCount` field to indicate expected count.

**Option B**: Fix the documentation — update OpenAPI schema

Change the description from "All the lessons" to accurately reflect the truncation:

```json
"description": "Preview of lessons in the unit (may be truncated). For complete lesson list, use /key-stages/{ks}/subject/{subject}/lessons"
```

**Option C**: Add pagination to unit summary

```yaml
/units/{unitSlug}/summary:
  parameters:
    - name: lessonLimit
      in: query
      schema:
        type: integer
        default: 10
    - name: lessonOffset
      in: query
      schema:
        type: integer
        default: 0
```

### Our Workaround

Refactor ingestion to use the paginated lessons endpoint (`/key-stages/{ks}/subject/{subject}/lessons`) with proper pagination exhaustion instead of deriving from unit summaries.

**ADR**: [ADR-083: Complete Lesson Enumeration Strategy](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)

---

## Lessons Endpoint Pagination Bug (2025-12-22)

**Status**: 🔴 CRITICAL — Unfiltered pagination returns incomplete data  
**Endpoint**: `/api/v0/key-stages/{keyStage}/subject/{subject}/lessons`  
**Impact**: 5 lessons missing from Maths KS4 (431 returned instead of 436)

### Problem

The paginated lessons endpoint returns **incomplete data** when called without a unit filter, but returns **complete data** when filtering by unit.

**Verified via MCP tool calls** (2025-12-22):

| Query Type | Parameters | Maths KS4 Lessons Returned | Status |
|------------|------------|---------------------------|--------|
| Unfiltered pagination | `limit=100, offset=0..700` | **431 lessons** | ❌ Incomplete |
| Filtered by unit | `unit=compound-measures` | **11 lessons** (all present) | ✅ Complete |
| Individual lesson fetch | `/lessons/{slug}/summary` | Returns valid data | ✅ Works |

**Missing lessons** (exist in ES from previous ingestion, confirmed via `/lessons/{slug}/summary`):

1. `problem-solving-with-compound-measures` (unit: `compound-measures`)
2. `checking-and-securing-understanding-on-chains-of-reasoning-with-angle-facts` (unit: `angles`)
3. `checking-and-securing-understanding-of-exterior-angles` (unit: `angles`)
4. `interquartile-range` (unit: `graphical-representations-of-data-cumulative-frequency-and-histograms`)
5. `constructing-box-plots` (unit: `graphical-representations-of-data-cumulative-frequency-and-histograms`)

### Verification Steps

1. Called `/key-stages/ks4/subject/maths/lessons` with pagination (offset 0-700, limit 100)
   - **Result**: 7 pages returned, pagination exhausted, **431 unique lessons**
   - Missing lessons **never appeared** in any page

2. Called `/key-stages/ks4/subject/maths/lessons?unit=compound-measures`
   - **Result**: Returns `problem-solving-with-compound-measures` ✅

3. Called `/lessons/{slug}/summary` for each missing lesson
   - **Result**: All 5 return valid 200 responses with full lesson data ✅

### Impact

- **Data Loss**: 1.15% of lessons missing (5/436)
- **Unit Accuracy**: 3/36 units have incorrect lesson counts
- **Search Quality**: Missing lessons not discoverable via search
- **Ingestion Reliability**: Cannot trust unfiltered pagination for complete data

### Affected Units

| Unit | Expected | Returned | Missing |
|------|----------|----------|---------|
| `compound-measures` | 11 | 10 | 1 |
| `angles` | 10 | 8 | 2 |
| `graphical-representations-of-data-cumulative-frequency-and-histograms` | 11 | 9 | 2 |

### Requested Fix

Investigate why unfiltered pagination excludes these 5 specific lessons. Possible causes:

1. **Filtering logic bug**: Some lessons incorrectly filtered out
2. **Materialized view issue**: Lessons missing from the view backing unfiltered queries
3. **Tier/variant handling**: Lessons with specific tier combinations excluded
4. **State filtering**: Lessons incorrectly marked as non-published in unfiltered view

### Our Workaround

**Implemented** (2025-12-22): Fetch lessons unit-by-unit instead of using unfiltered pagination.

```typescript
// Instead of:
const lessons = await fetchAllLessonsWithPagination(client, 'ks4', 'maths');

// Use:
const units = await client.getUnitsByKeyStageAndSubject('ks4', 'maths');
const unitSlugs = units.map(u => u.unitSlug);
const lessons = await fetchAllLessonsByUnit(client, 'ks4', 'maths', unitSlugs);
```

This workaround:
- ✅ Returns all 436 lessons
- ✅ Correctly handles lessons belonging to multiple units
- ⚠️ Makes N+1 API calls (36 units = 36 calls instead of 7 pages)
- ⚠️ Slower due to serial fetching

**Code**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/fetch-all-lessons.ts`

---

## Bulk Download Data Integrity Issues (2025-12-19)

**Context**: Analysis of the bulk download data (`/bulk-download` endpoint) revealed inconsistencies that affect downstream filtering and search capabilities.

### Issue 1: Title Fields Null Despite Slug Fields Populated

**Affected Endpoints**: Bulk download JSON files (e.g., `maths-secondary.json`)
**Fields Affected**: `yearTitle`, `keyStageTitle`, `subjectTitle`

**Observation**:

```json
{
  "yearTitle": null,        // ← null
  "yearSlug": "year-7",     // ← populated
  "keyStageTitle": null,    // ← null
  "keyStageSlug": "ks3",    // ← populated
  "subjectTitle": null,     // ← null
  "subjectSlug": null,      // ← also null (double issue)
  "unitTitle": "Place value",
  "unitSlug": "place-value"
}
```

**Scope**: All 98 units in `maths-secondary.json` have `yearTitle: null` and `keyStageTitle: null`.

**Impact**:

- Consumers expecting human-readable titles get null
- Inconsistency between slug availability and title availability
- `subjectSlug` is also null in some cases (expected: `"maths"`)

**Requested Fix**:

Populate all `*Title` fields when corresponding `*Slug` fields are populated:

```json
{
  "yearTitle": "Year 7",
  "yearSlug": "year-7",
  "keyStageTitle": "Key Stage 3",
  "keyStageSlug": "ks3",
  "subjectTitle": "Maths",
  "subjectSlug": "maths"
}
```

### Issue 2: Missing Tier Metadata for Maths Secondary KS4 Variants

**Status**: CONFIRMED as tier variants (2025-12-24, updated 2025-12-28)  
**Affected Endpoint**: Bulk download JSON files (`maths-secondary.json`)  
**Fields Affected**: `sequence[].unitSlug`, `lessons[].lessonSlug`

#### 2a: Unit-Level Duplicates (sequence[] array)

**Root Cause Analysis** (2025-12-24):

Investigation confirmed these are **KS4 tier variants** (foundation vs higher), not duplicates:

- 30 unit slugs appear twice with identical metadata except for `unitLessons[]`.
- 26 of 30 have different lesson lists — one longer (higher tier), one shorter (foundation tier).
- Example: `algebraic-fractions` appears with 8 lessons (higher) and 2 lessons (foundation).
- The shorter variant contains a subset of the longer variant's lessons.

#### 2b: Lesson-Level Duplicates (lessons[] array)

**Investigation** (2025-12-28):

The `lessons[]` array contains **byte-for-byte identical duplicate entries** for lessons that exist in both tiers:

| Metric | Count |
|--------|-------|
| Raw entries in lessons[] | 1,235 |
| Unique lessonSlugs | 862 |
| Duplicate entries | 373 lessons × 2 = 746 entries |
| Single-appearance lessons | 63 (Higher tier only) |

**Critical Issue**: The two entries for each duplicated lesson are **completely identical** — there is no tier discriminator field to distinguish them. This makes programmatic deduplication require heuristic analysis or merging.

**Verification** (2025-12-28):

```bash
# Confirmed identical entries
jq '[.lessons[] | select(.lessonSlug == "solving-complex-quadratic-equations-by-completing-the-square")] | if .[0] == .[1] then "IDENTICAL" else "DIFFERENT" end' maths-secondary.json
# Result: "IDENTICAL"
```

#### Comparison with other subjects

| Subject | Has `examBoards` field | Has `tier` field | Duplicate unit slugs | Duplicate lesson slugs |
|---------|------------------------|-----------------|---------------------|----------------------|
| maths-secondary | NO | NO | 30 | 373 |
| science-secondary | YES | NO | 0 | 1 |
| All other secondary | YES | NO | 0 | 0 |

Maths secondary is **unique** — it's the only KS4 subject with tier variants but no explicit variant metadata.

**Impact**:

- Consumers cannot programmatically distinguish foundation vs higher without analysing lesson list composition.
- Vocabulary mining requires variant-aware processing or merging.
- No way to generate unique identifiers for variants.
- Raw lesson counts are misleading (2,307 bulk vs 1,934 unique).

**Requested Fix**:

Add explicit `tier` field to maths-secondary bulk download at BOTH unit and lesson level:

**Unit level**:

```json
{
  "unitSlug": "algebraic-fractions",
  "tier": "higher",           // ← NEW: "foundation" | "higher"
  "tierSlug": "higher",       // ← Optional: for filtering
  "unitLessons": [/* 8 lessons */]
}
```

**Lesson level**:

```json
{
  "lessonSlug": "solving-complex-quadratic-equations-by-completing-the-square",
  "tiers": ["foundation", "higher"],  // ← NEW: array of tiers this lesson belongs to
  // ... other fields
}
```

Alternatively, ensure lessons only appear ONCE with an array of associated tiers, rather than duplicating the entire entry.

### Issue 3: Missing Lesson Record Referenced by Unit Lessons

**Affected Endpoint**: Bulk download JSON files (for example `maths-secondary.json`)
**Field Affected**: `sequence[].unitLessons[].lessonSlug`

**Observation**:

- `further-demonstrating-of-pythagoras-theorem` appears in `unitLessons[]` with `state: "new"` but is missing from `lessons[]`.

**Impact**:

- Breaks referential integrity between unit summaries and lesson records.
- Forces consumers to handle missing data for referenced lessons.

**Requested Fix**:

- Ensure every `unitLessons[].lessonSlug` has a corresponding record in `lessons[]`, or remove non-published lessons from `unitLessons[]` and document the rule.

### Issue 4: Inconsistent Null Semantics for Content Guidance and Supervision

**Affected Endpoint**: Bulk download JSON files (maths primary and secondary)
**Fields Affected**: `contentGuidance`, `supervisionLevel`

**Observation**:

- `contentGuidance` is a string `NULL` in most lessons, but an array of objects in two maths primary lessons.
- `supervisionLevel` is a string `NULL` in most lessons, but `"Adult supervision required"` in those same two lessons.

**Impact**:

- Mixed field types (`string` vs `array`) complicate parsing.
- `NULL` is a string, not JSON null, which creates special-case logic.

**Requested Fix**:

- Use JSON null for absent values.
- Make `contentGuidance` consistently an array (empty array when absent).

### Issue 5: Missing Transcripts in Maths Primary

**Affected Endpoint**: Bulk download JSON files (`maths-primary.json`)
**Fields Affected**: `transcript_sentences`, `transcript_vtt`

**Observation**:

Five lessons are missing both transcript fields:

1. `composition-of-decade-numbers-to-100-making-groups-of-10`
2. `describe-and-represent-hundredths-as-a-decimal-number`
3. `identify-hundredths-as-part-of-a-whole`
4. `round-a-decimal-number-with-hundredths-to-the-nearest-whole-number`
5. `use-known-facts-from-the-10-times-table-to-solve-problems-involving-the-9-times-table`

**Impact**:

- Transcript-based search and accessibility features have coverage gaps.

**Requested Fix**:

- Ensure transcripts are present for all lessons, or include explicit availability flags.

### Issue 6: Missing Threads and Empty Descriptions on Secondary Units

**Affected Endpoint**: Bulk download JSON files (`maths-secondary.json`)
**Fields Affected**: `threads`, `description`

**Observation**:

- Units without threads: `maths-and-the-environment`, `maths-in-the-workplace`, `thinking-critically-with-maths`, `calculator-functionality`.
- Units with empty descriptions: `maths-and-the-environment`, `maths-in-the-workplace`, `thinking-critically-with-maths`.

**Impact**:

- Limits thread-based navigation and summary quality.

**Requested Fix**:

- Populate threads and descriptions for all units, or document them as optional with explicit null values.

### Issue 7: KS4 Science Accessible Only via Sequences Endpoint (2025-12-28)

**Status**: ⚠️ CLARIFIED — Not a bug, but a documentation/discoverability issue  
**Affected Endpoints**: `/api/v0/key-stages/ks4/subject/science/lessons` (returns empty)  
**Working Endpoint**: `/api/v0/sequences/science-secondary-{aqa|edexcel|ocr}/units`  
**Bulk Download**: `science-secondary.json`

**Investigation Summary** (2025-12-28):

The API **does** expose KS4 science content, but via a different endpoint path than other key stages.

#### The Subject Enum

The `/subjects` endpoint only lists 17 top-level subjects. The KS4 science "exam subjects" (`biology`, `chemistry`, `physics`, `combined-science`) are **not** in this enum — they are nested **within** the `science` subject's sequences.

#### Why `/key-stages/ks4/subject/science/lessons` Returns Empty

At KS4, science content is organised under **exam subjects** within sequences:

```
science (subject)
  └── science-secondary-aqa (sequence)
       └── Year 10 / Year 11
            └── examSubjects: [
                  { examSubjectSlug: "biology", tiers: ["foundation", "higher"], units: [...] },
                  { examSubjectSlug: "chemistry", tiers: [...], units: [...] },
                  { examSubjectSlug: "physics", tiers: [...], units: [...] },
                  { examSubjectSlug: "combined-science", tiers: [...], units: [...] }
                ]
```

This structure reflects the UK curriculum reality: at GCSE level, students choose between separate sciences (biology, chemistry, physics) or combined science.

#### Accessing KS4 Science via API

**Working approach**:

1. Query sequences: `GET /sequences/science-secondary-aqa/units`
2. For Year 10/11, iterate through `examSubjects[]` → `tiers[]` → `units[]`
3. For each unit, fetch lessons via the lessons endpoint

**Example sequence response** (Year 10):

```json
{
  "year": 10,
  "examSubjects": [
    {
      "examSubjectSlug": "chemistry",
      "tiers": [
        { "tierSlug": "foundation", "units": [...] },
        { "tierSlug": "higher", "units": [...] }
      ]
    },
    // ... biology, physics, combined-science
  ]
}
```

#### Lesson Counts (via Sequences)

| Sequence | Exam Subject | Foundation Units | Higher Units | Lessons (est.) |
|----------|-------------|------------------|--------------|----------------|
| science-secondary-aqa | biology | 13 | 13 | ~200 |
| science-secondary-aqa | chemistry | 16 | 16 | ~180 |
| science-secondary-aqa | physics | 13 | 13 | ~170 |
| science-secondary-aqa | combined-science | 50 | 50 | ~400 |

*(Similar structure for edexcel, ocr sequences)*

#### Bulk Download Discrepancy

The bulk download uses **flat** subject slugs (`biology`, `chemistry`, etc.) which don't match the API enum. This is a data representation difference, not missing data.

| Bulk Slug | API Access Path |
|-----------|-----------------|
| `biology` | `sequences/science-secondary-{board}/units` → `examSubjects[slug=biology]` |
| `chemistry` | `sequences/science-secondary-{board}/units` → `examSubjects[slug=chemistry]` |
| `physics` | `sequences/science-secondary-{board}/units` → `examSubjects[slug=physics]` |
| `combined-science` | `sequences/science-secondary-{board}/units` → `examSubjects[slug=combined-science]` |

**Impact**:

- NOT a data availability issue — all 598 KS4 science lessons ARE accessible
- Ingestion pipelines must use sequences endpoint for KS4 science
- Simple subject+keyStage queries don't work for KS4 science

**Requested Enhancement** (not a fix):

1. **Documentation**: Clarify that KS4 science uses a different access pattern via sequences
2. **OpenAPI schema**: Add `examSubjects` to the schema description so it's discoverable
3. **Consider**: Adding a convenience endpoint like `/key-stages/ks4/subject/science/exam-subjects` that lists the nested subjects

**Our Workaround**:

Enhance the ingestion pipeline to detect subjects with `examSubjects` at KS4 and use the sequences endpoint instead of the simple lessons endpoint.

**Related**: ADR-080 (KS4 metadata denormalization strategy)
