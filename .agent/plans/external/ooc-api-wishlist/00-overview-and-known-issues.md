# Upstream Open Curriculum API Metadata Enhancement Wish List

- Upstream API docs: <https://open-api.thenational.academy/docs/about-oaks-api/api-overview>
- OpenAPI schema: <https://open-api.thenational.academy/api/v0/swagger.json>
- API front page: <https://open-api.thenational.academy/>

## Open Questions

- Does OpenAPI 3.0 support `examples` at the path level, rather than just at the parameter level?
- Can we update the OpenAPI spec to OpenAPI 3.1? Does GCP support this?
- Can we make sure that the API uses Zod 4?
- Can we make sure that the API ships the Zod schemas as code snippets, in addition to JSON Schema? (See `09-schemas-endpoint-rfc.md`.)
- Can we enhance the metadata of the API to make it more useful for AI agents?
- Can we improve data integrity at the API level?

---

## API Code Review Findings (5 January 2025)

### 1. `/sequences/{sequence}/assets` ignores the year filter

**Status**: 🔴 BUG — parameter accepted but ignored  
**Endpoint**: `/api/v0/sequences/{sequence}/assets`  
**Observation**: `year` is defined in the request schema but the handler does not apply it.  
**Impact**: Consumers cannot scope assets to a year; results require client-side filtering and contradict the documented parameter.  
**User impact**: SDK/MCP engineers and API consumers get mis-scoped asset sets; teachers see irrelevant resources in year-specific workflows.  
**Requested fix**: Apply the year filter in the query or remove the parameter until supported.  
**Examples**: See `11-assets-and-transcripts-examples.md`.

### 2. Subject gating is not documented (blocked subjects and allowlists)

**Observation**:

- `blockedSequenceSubjects` includes `rshe-pshe` and returns `400 BAD_REQUEST` in sequence units, sequence questions, and sequence assets.
- Assets endpoints use allowlists (`supportedSubjects`, `supportedUnits`, `supportedLessons`) in addition to TPC filtering.
- Lesson summary can return `404` when blocked for copyright text.

**Impact**: Results can be partial or rejected without clear schema-level reasons, making it hard for clients to predict availability.
**User impact**: API consumers and SDK/MCP engineers cannot anticipate availability; teachers and curriculum leaders see inconsistent access.

**Requested fix**: Document availability rules in OpenAPI and return explicit reason codes (or provide a discovery endpoint or availability flags).  
**Examples**: See `10-availability-and-gating-examples.md`.

### 3. `/search/lessons` excludes `financial-education`

**Observation**: Search SQL excludes `subjectSlug = 'financial-education'` regardless of query parameters.  
**Impact**: Search results are incomplete relative to other endpoints.  
**User impact**: Teachers and learners miss relevant lessons; API consumers cannot rely on search completeness.  
**Requested fix**: Document this constraint or add an explicit flag/parameter and reason code.  
**Examples**: See `12-search-and-enums-examples.md`.

### 4. Questions endpoints silently drop image-based questions for unsupported content

**Observation**: `questionsForQuiz` removes multiple-choice questions with image answers when images are not allowed for the subject/unit.  
**Impact**: Consumers receive incomplete quizzes without any indication of omitted items.  
**User impact**: Teachers and students may miss key questions; SDK/MCP engineers cannot report omissions reliably.  
**Requested fix**: Add response metadata (`imagesAllowed`, `questionsOmitted`, or `omittedReason`) or expose licence/availability flags.  
**Examples**: See `13-quiz-content-examples.md`.

### 5. Key stage and subject enums come from a static, pre-filtered list

**Observation**: `keyStageAndSubjects.json` is pre-filtered to "new lessons" and drives enum constraints for several request schemas.  
**Impact**: Valid subjects/key stages may be missing from enum lists or lag the underlying data.  
**User impact**: API consumers face rejected requests; SDK/MCP engineers cannot target newly available content.  
**Requested fix**: Generate these lists from live data or document that the enums represent currently supported (non-legacy) content only.  
**Examples**: See `12-search-and-enums-examples.md`.

---

## PATTERN ANALYSIS: Data Completeness Issues (2025-12-29, Updated)

**Examples**: See `14-listing-and-pagination-examples.md` and `15-bulk-download-examples.md`.

### Issue Classification

After investigating the upstream API code, these issues have **different root causes**:

| Issue | Endpoint | Root Cause | Is Bug? |
|-------|----------|------------|---------|
| Unit Summary Truncation | `/units/{unit}/summary` → `unitLessons[]` | `sequenceView` snapshot | Unclear (design choice?) |
| Pagination Bug | `/key-stages/ks4/subject/maths/lessons` (unfiltered) | `unitVariantLessonsView` filtering | **Yes** (bug) |
| Assets Incomplete | `/key-stages/ks2/subject/art/assets` | **TPC License Filter** | **No** (intentional) |

### Category 1: Materialized View Issues (Likely Bugs)

**Unit Summary Truncation** and **Pagination Bug** likely share a common cause:

1. **Direct single-resource endpoints** (`/lessons/{lesson}/summary`) **always work** — queries authoritative views
2. **List endpoints with filters** (`/lessons?unit=X`) **mostly work** — returns complete data
3. **List endpoints without filters** **sometimes fail** — may hit different query path

### Category 2: Intentional Filtering (Not Bugs)

**Assets Endpoint** filtering is **intentional** — TPC (Third Party Content) license compliance:

```typescript
// From queryGate.ts
const supportedSubjects = ['maths'];  // Only maths fully cleared

// Lessons returned only if TPC-cleared via:
// - supportedSubjects (maths)
// - supportedUnits.json (213 units)
// - supportedLessons.json (4,559 lessons)
```

### Data Access Architecture

```
┌─────────────────────────┐
│     Hasura Views        │
├─────────────────────────┤
│ lessonView              │ ← Per-lesson queries (always complete)
│ unitVariantLessonsView  │ ← List queries (may have filtering bugs)
│ sequenceView            │ ← Unit queries (may truncate lessons)
│ downloadView            │ ← Asset queries (filtered by TPC)
└─────────────────────────┘
                │
                ▼
┌─────────────────────────┐
│    queryGate.ts         │ ← TPC License Filter
│  - supportedSubjects    │   (intentionally filters assets)
│  - supportedUnits.json  │
│  - supportedLessons.json│
└─────────────────────────┘
```

### Recommended Fixes

**For Materialized View Issues**:
1. Audit `unitVariantLessonsView` for the 5 missing maths lessons
2. Audit `sequenceView` for unit lesson truncation
3. Add `totalCount` to all list responses

**For Assets Endpoint**:
1. **Document** the TPC filtering in OpenAPI schema (not a fix, just documentation)
2. **Consider** a separate endpoint for video availability that bypasses TPC checks
3. **Add** `hasVideo`/`hasTranscript` flags to lesson list responses (Item 13)

See individual issues below for endpoint-specific details.

---

## Binary Response Schema Fix (2025-12-16)

**Examples**: See `11-assets-and-transcripts-examples.md`.

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

**User impact**: SDK/MCP engineers cannot validate downloads; API consumers must handle binary responses without reliable schema hints.

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

**Examples**: See `20-validation-and-schema-examples.md`.

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

**Examples**: See `14-listing-and-pagination-examples.md`.

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

**User impact**: Teachers and curriculum leaders see incomplete unit overviews; SDK/MCP engineers cannot trust unit summaries for traversal.

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

**Examples**: See `14-listing-and-pagination-examples.md`.

**Status**: 🔴 CRITICAL — Unfiltered pagination returns incomplete data  
**Endpoint**: `/api/v0/key-stages/{keyStage}/subject/{subject}/lessons`  
**Impact**: 5 lessons missing from Maths KS4 (431 returned instead of 436)
**User impact**: Teachers and learners miss content; API consumers and SDK/MCP engineers ingest incomplete datasets.

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

**Code**: `apps/oak-search-cli/src/lib/indexing/fetch-all-lessons.ts`

---

## Bulk Download Data Integrity Issues (2025-12-19)

**Examples**: See `15-bulk-download-examples.md`.

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

**User impact**: Human engineers and curriculum leaders see unreadable records; SDK/MCP ingestion needs extra repair logic.

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

**Investigation** (2025-12-28, **UPDATED 2025-12-30**):

The `lessons[]` array contains **byte-for-byte identical duplicate entries**:

| Metric | Count |
|--------|-------|
| Raw entries in lessons[] | 1,235 |
| Unique lessonSlugs | 862 |
| Double-appearance lessons | 373 |
| Single-appearance lessons | 63 (all in higher-only units) |

**UPDATED Analysis** (2025-12-30):

Deep investigation revealed the 373 double-appearance lessons break down as:

| Category | Count | Explanation |
|----------|-------|-------------|
| **Legitimate duplicates** | 210 | Lessons truly shared between BOTH tier variants at unit level |
| **Spurious duplicates** | 163 | Lessons in ONE tier variant only, but incorrectly duplicated in `lessons[]` |

**Example of spurious duplicate**:
- `solving-complex-quadratic-equations-by-completing-the-square`
- Appears in `algebraic-manipulation` unit variant 1 (higher tier, 16 lessons) ✅
- Does NOT appear in unit variant 2 (foundation tier, 13 lessons) ❌
- But appears TWICE in `lessons[]` array (data quality bug)

**Critical Issues**:
1. No tier discriminator field on any entry
2. 163 lessons are spuriously duplicated (data quality bug)

**Verification** (2025-12-28):

```bash
# Confirmed identical entries
jq '[.lessons[] | select(.lessonSlug == "solving-complex-quadratic-equations-by-completing-the-square")] | if .[0] == .[1] then "IDENTICAL" else "DIFFERENT" end' maths-secondary.json
# Result: "IDENTICAL"
```

**Solution for consumers**: Simple deduplication by `lessonSlug`, then derive tiers from API `/sequences/maths-secondary/units` endpoint (100% coverage confirmed).

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

**User impact**: Teachers and curriculum leaders cannot filter KS4 tiers reliably; API consumers and SDK/MCP engineers must build fragile heuristics.

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

**User impact**: API consumers and SDK/MCP engineers face broken joins; teachers and learners can see missing content.

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

**User impact**: SDK/MCP engineers and data teams need extra sanitisation; API consumers face inconsistent parsing.

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

**User impact**: Teachers and learners miss accessibility content; search quality drops for affected lessons.

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

**User impact**: Curriculum leaders and teachers lose progression context; AI tools provide weaker summaries.

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

**User impact**: API consumers and SDK/MCP engineers must implement special-case traversal; teachers and curriculum leaders face confusing access paths.

**Requested Enhancement** (not a fix):

1. **Documentation**: Clarify that KS4 science uses a different access pattern via sequences
2. **OpenAPI schema**: Add `examSubjects` to the schema description so it's discoverable
3. **Consider**: Adding a convenience endpoint like `/key-stages/ks4/subject/science/exam-subjects` that lists the nested subjects

**Our Workaround**:

Enhance the ingestion pipeline to detect subjects with `examSubjects` at KS4 and use the sequences endpoint instead of the simple lessons endpoint.

**Related**: ADR-080 (KS4 metadata denormalization strategy)

---

## Subject Assets Endpoint: TPC License Filtering (2025-12-29)

**Examples**: See `10-availability-and-gating-examples.md`.

**Status**: 🟡 CLARIFIED — Not a bug; intentional Third Party Content license filtering  
**Endpoint**: `/api/v0/key-stages/{keyStage}/subject/{subject}/assets`  
**Impact**: Cannot be used for video availability detection (use lessons endpoint instead)
**User impact**: API consumers and SDK/MCP engineers cannot infer video availability from assets; teachers and learners may face inconsistent transcript access if assumptions are wrong.

### Observation

The `/key-stages/{keyStage}/subject/{subject}/assets` endpoint returns only **15-35%** of lessons for non-maths subjects:

| Subject | Key Stage | Assets Endpoint | Lessons Endpoint | Coverage |
|---------|-----------|-----------------|------------------|----------|
| Art | KS2 | **36 lessons** | 102 lessons | ~35% |
| Computing | KS3 | **60 lessons** | ~116 lessons | ~52% |
| Maths | KS3 | **~800 lessons** | ~800 lessons | ~100% |

### Root Cause (Confirmed via Code Analysis)

This is **intentional filtering** for Third Party Content (TPC) license compliance.

**From `reference/oak-openapi/src/lib/queryGate.ts`**:

```typescript
// Line 28 - Only maths is fully TPC-cleared
const supportedSubjects = ['maths'];

// Lessons only returned if:
// 1. Subject is 'maths' (fully cleared), OR
// 2. Unit is in supportedUnits.json (213 units), OR
// 3. Lesson is in supportedLessons.json (4,559 lessons)
```

**Key insight**: The assets endpoint returns lessons **cleared for asset DOWNLOAD**, not all lessons with assets. A lesson may have video content but not yet have TPC clearance for its downloadable resources.

### This is NOT the Same Issue as Other Data Inconsistencies

| Issue | Root Cause | Is a Bug? |
|-------|------------|-----------|
| Unit summary truncation | Materialized view snapshot | Possibly (design choice) |
| Pagination missing 5 lessons | View filtering bug | **Yes** |
| Assets endpoint incomplete | TPC license filter | **No** (correct behavior) |

### Impact on Video Availability Detection

The assets endpoint **cannot** be used to determine video availability across all subjects because:
1. Maths lessons: ✅ Complete data (fully TPC-cleared)
2. Other subjects: ❌ Only ~35-52% of lessons returned

### Our Workaround

Implemented tri-state `hasVideo()` function:
- `true`: Lesson in assets response WITH video
- `false`: Lesson in assets response WITHOUT video
- `undefined`: Lesson NOT in assets response (unknown — assume video exists, fetch transcript)

**See**: [ADR-091: Video Availability Detection Strategy](../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md)

### Documentation Request (Not a Fix)

The TPC filtering is correct behavior, but should be documented in the OpenAPI schema:

```yaml
/key-stages/{keyStage}/subject/{subject}/assets:
  get:
    description: |
      Returns downloadable assets for lessons that have completed Third Party Content
      license auditing. Not all lessons are included — only those cleared for asset
      distribution.
      
      For complete lesson enumeration, use /key-stages/{keyStage}/subject/{subject}/lessons.
      
      Currently fully cleared subjects: maths
      Partial clearance: ~213 units and ~4,559 individual lessons across other subjects
```

### Future Mitigation

See Item 13 in `05-medium-priority-requests.md`: Add `hasVideo`/`hasTranscript` boolean flags directly to lesson list responses. This would eliminate the need to use the assets endpoint for video availability detection.

---

## MFL Transcript API Response Inconsistency (2026-01-03)

**Status**: 🔴 BUG — Inconsistent error responses for the same condition
**Endpoint**: `/api/v0/lessons/{lesson}/transcript`
**Impact**: Cannot reliably detect "no transcript" vs "server error"

### Observation

MFL (French, Spanish, German) lessons consistently lack transcripts, but the API returns **different error types** for the same underlying condition:

| Subject | Lesson Example | Response | Expected |
|---------|----------------|----------|----------|
| French | (any KS3 lesson) | **500 Internal Server Error** | 404 |
| Spanish | (any KS3 lesson) | **404 "not available"** | 404 ✅ |
| German | (any KS3 lesson) | **500 Internal Server Error** | 404 |

**Tested 2026-01-03 via API**

### Root Cause

MFL lesson videos contain non-English speech. Automatic captioning services (trained on English) fail or produce garbage. The videos exist, but transcripts were never generated.

### Impact

1. **Observability**: 500 errors trigger alerts; 404s don't
2. **Retry Logic**: Consumers may retry 500s assuming transient failure
3. **Caching**: 500s typically aren't cached; 404s can be cached
4. **Error Budgets**: 500s count against SLOs; 404s don't

### Requested Fix

Return consistent 404 responses with explicit reason:

```json
HTTP 404 Not Found
{
  "error": "not_found",
  "reason": "no_transcript_available",
  "message": "This lesson does not have a transcript. MFL lessons with non-English audio are not transcribed."
}
```

**User impact**: API consumers and SDK/MCP engineers can correctly handle MFL lessons; monitoring systems don't fire false alerts.

---

## Empty Transcript Responses (2025-12-30)

**Examples**: See `11-assets-and-transcripts-examples.md`.

**Status**: 🟡 KNOWN ISSUE — API returns 200 with empty string instead of 404  
**Endpoint**: `/api/v0/lessons/{lesson}/transcript`  
**Impact**: Observability issue; cannot distinguish "no transcript" from "error"
**User impact**: Teachers and learners get confusing transcript behaviour; API consumers and SDK/MCP engineers cannot handle transcript availability reliably.

### Observation

Some lessons return `200 OK` with an empty transcript string instead of `404 Not Found`:

```json
GET /lessons/some-lesson-slug/transcript

// Expected (when transcript doesn't exist):
HTTP 404 Not Found
{ "error": "Transcript not found" }

// Actual (observed during ingestion):
HTTP 200 OK
{ "transcript": "", "vtt": "" }
```

### Impact

1. **Observability Gap**: Cannot distinguish between:
   - Lesson has no video → transcript doesn't exist
   - Lesson has video but transcript is missing → data issue
   - Lesson has video with empty transcript → intentional (unlikely)

2. **Caching Complexity**: Our cache categorization treats empty 200 responses the same as 404s, but this is a workaround not a proper fix.

3. **Error Detection**: Difficult to detect missing transcripts vs. intentionally empty content.

### Our Workaround

Implemented in transcript cache categorization (ADR-092):

```typescript
// Treat empty 200 responses the same as 404
if (result.ok && result.value.transcript === '') {
  cache({ status: 'not_found' });  // Same as 404
}
```

Documented as a known issue and added to API wishlist (Item 15).

### Requested Fix

Return appropriate HTTP status codes:

| Scenario | Current Response | Desired Response |
|----------|------------------|------------------|
| Lesson has transcript | 200 + content | 200 + content ✅ |
| Lesson has no video | 200 + empty | **404 Not Found** |
| Transcript missing (bug) | 200 + empty | **404 Not Found** |

Optionally, add a reason field:

```json
HTTP 404 Not Found
{
  "error": "not_found",
  "reason": "no_video"  // or "transcript_unavailable"
}
```

See Item 15 in `05-medium-priority-requests.md` for full enhancement request.

### Related Documentation

- [ADR-092: Transcript Cache Categorization Strategy](../../../docs/architecture/architectural-decisions/092-transcript-cache-categorization.md)
- [sdk-cache README](../../../apps/oak-search-cli/src/adapters/sdk-cache/README.md)

---

## Clarifying Questions for Upstream Team (2025-12-30)

**Context**: During ingestion development, we identified several areas where API behaviour differs from documentation or differs from bulk download data. These questions help us understand whether observed behaviours are bugs, intentional design, or undocumented constraints.

### Q1: Bulk Download vs API Transcript Availability Discrepancy

**Observation**: The bulk download data (dated 2025-12-07) shows **ALL 189 art-secondary lessons** have `downloadsAvailable: true` and include full transcripts. However, the live API (tested 2025-12-30) returns 404 for transcript requests on many of these same lessons.

**Example**:
- Lesson: `principles-of-art-volume`
- Bulk download: Has `downloadsAvailable: true` and full transcript content
- API `/lessons/principles-of-art-volume/transcript`: Returns 404

**Questions**:
1. Is the bulk download sourced from a different environment than the API?
2. Has transcript availability changed since the bulk download was generated?
3. Is there a TPC or other filter applied to the transcript endpoint that isn't applied during bulk download generation?

### Q2: Maths vs Other Subjects Transcript Availability

**Observation**: Maths lessons consistently return transcripts via API, while art/other subjects frequently return 404.

**Examples**:
- `GET /lessons/checking-understanding-of-addition-and-subtraction-with-fractions/transcript` → 200 ✅
- `GET /lessons/principles-of-art-volume/transcript` → 404 ❌
- `GET /lessons/the-presence-of-nature-in-art/transcript` → 404 ❌

**Questions**:
1. Is maths a "special category" with different transcript availability rules?
2. Are non-maths transcripts filtered by TPC (similar to assets)?
3. If filtered, is this documented anywhere?

### Q3: `downloadsAvailable` Field Accuracy

**Observation**: Lessons in the bulk download have `downloadsAvailable: true` but the API returns 404 for assets and transcripts.

**Questions**:
1. What does `downloadsAvailable: true` actually indicate?
2. Is this field accurate in the bulk download, or is it a denormalized snapshot that may be stale?
3. Should we treat bulk download data as authoritative for initial processing and API for incremental updates?

### Q4: Undocumented Endpoint `/search-index/video-ids`

**Observation**: Our codebase referenced an endpoint `/search-index/video-ids` which does not exist in the OpenAPI schema and returns 404 when called.

**Questions**:
1. Did this endpoint ever exist? (It appears to be a hallucination from earlier development)
2. Is there a supported way to get a list of lessons with video/transcript availability without calling each lesson individually?
3. Would a `hasVideo`/`hasTranscript` boolean on the lessons list response be feasible? (See Item 13 in medium priority requests)

### Q5: Bulk Download Data Recency

**Observation**: The bulk download is dated 2025-12-07 but we're seeing discrepancies with live API data from 2025-12-30.

**Questions**:
1. How frequently is the bulk download regenerated?
2. Is there a changelog or timestamp we can use to detect freshness?
3. Should we document that bulk download is a "snapshot" and may differ from live API?

### Q6: Ingestion Strategy Validation

**Current Strategy**:
1. Use bulk download for initial lesson enumeration (authoritative for lesson list)
2. Use API for per-lesson details (transcripts, summaries)
3. Accept that non-maths subjects may have sparse transcript availability

**Questions**:
1. Is this a reasonable strategy given the observed discrepancies?
2. Should we expect transcript availability to improve over time (TPC clearance in progress)?
3. Is there a preferred ingestion pattern the Oak team recommends?

---

## Enhancement Requests (2025-12-30)

### ER1: Full Data Coverage Across All Subjects

**Request**: Extend full lesson resource availability (transcripts, assets, downloads) to all subjects, matching maths coverage.

**Current State**:
- Maths: **100%** lesson resource coverage via API
- Other subjects: **~0-35%** coverage, described as "a sample" in documentation

**Impact**:
- Semantic search quality severely limited for non-maths subjects
- Teachers cannot access full transcript content programmatically
- AI-powered tools limited to maths-only full functionality

**Business Case**:
- The bulk download contains **near-complete transcripts for most subjects** (overall ~81.9% of lessons; MFL/PE sparse, missing often `"NULL"`)
- API infrastructure exists — only TPC/license filtering prevents access
- Teachers for non-maths subjects cannot benefit from transcript-based search

**Requested Priority**: HIGH — this is the single largest blocker to cross-subject semantic search

**Related Documentation**:
- [Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage)
- Transcript Availability Analysis (`.agent/analysis/transcript-availability-analysis.md`)

### ER2: Documentation of API vs Bulk Download Differences

**Request**: Provide explicit documentation of all differences between API and bulk download data.

**Current State**:
- Bulk download and API return different data for the same lessons
- No documentation exists explaining these differences
- Consumers must discover discrepancies through trial and error

**Known Discrepancies** (2025-12-30):

| Data Type | Bulk Download | API | Notes |
|-----------|---------------|-----|-------|
| **Transcripts** | Most subjects 96-100%; MFL/PE sparse (~81.9% overall) | Only maths complete | TPC filtering on API |
| **`downloadsAvailable`** | Always `true` | Not applicable | Field may be stale |
| **Asset access** | Not applicable | TPC-filtered | ~35% non-maths |
| **Tier metadata (maths)** | Missing | Present in responses | Bulk has duplicates |
| **Null semantics** | String `"NULL"` | JSON `null` | Inconsistent |
| **Title fields** | Often null | Usually present | Denormalization gap |

**Requested Format**:

Add a dedicated documentation page (e.g., `https://open-api.thenational.academy/docs/about-oaks-data/api-vs-bulk-download`) that covers:

1. **Data freshness**: Bulk download snapshot date vs real-time API
2. **Coverage differences**: What each source contains that the other doesn't
3. **Field differences**: Any fields with different values or types
4. **Recommended usage**: When to use bulk download vs API
5. **Staleness handling**: How to detect/refresh stale bulk download data

**User impact**: API consumers and SDK/MCP engineers can make informed choices; ingestion pipelines can be designed correctly from the start.

### ER3: Transcript Availability Flags in Lessons Endpoint

**Request**: Add `hasTranscript: boolean` flag to lesson list responses.

**Rationale**: Currently, the only way to know if a lesson has a transcript is to attempt to fetch it (incurring a 404 for ~65% of non-maths lessons). A boolean flag would allow:

- Skip-ahead during ingestion (don't attempt fetch for `hasTranscript: false`)
- Accurate search result previews ("This lesson includes video transcript")
- Analytics on transcript coverage without hitting transcript endpoint

**Implementation Suggestion**:

```yaml
/key-stages/{keyStage}/subject/{subject}/lessons:
  get:
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                lessons:
                  type: array
                  items:
                    type: object
                    properties:
                      lessonSlug:
                        type: string
                      hasVideo:
                        type: boolean         # NEW
                      hasTranscript:
                        type: boolean         # NEW
                      hasWorksheet:
                        type: boolean         # EXISTING (currently on some responses)
```

**See also**: Item 13 in `05-medium-priority-requests.md` (boolean resource flags)

---

## Bulk Download Completeness Requests (2025-12-30)

**Context**: With the bulk-first ingestion strategy (ADR-093), these enhancements would eliminate the need for API supplementation, making the bulk download fully self-sufficient for search index population.

### ER4: Add RSHE-PSHE Bulk Download File

**Status**: 🔴 CONFIRMED MISSING — RSHE-PSHE NOT in bulk download API response (2025-12-30)

**Update**: The [Oak Bulk Download page](https://open-api.thenational.academy/bulk-download) shows RSHE (PSHE) as available, but the actual `/api/bulk` endpoint **does not return these files**. Fresh download on 2025-12-30 confirmed 30 subject files returned, RSHE-PSHE excluded.

**Impact**: RSHE-PSHE content cannot be ingested from bulk. For now, we return 422 Unprocessable Content for this subject until bulk files become available.

**Requested**: Include `rshe-pshe-primary.json` and `rshe-pshe-secondary.json` in the `/api/bulk` response.

### ER5: Add Tier Field to Maths KS4 Lessons in Bulk Download

**Request**: Add explicit `tier` or `tiers` field to maths KS4 lessons to distinguish foundation vs higher.

**Current State**:

- 373 maths KS4 lessons appear as **exact duplicates** in the `lessons[]` array
- No field distinguishes foundation from higher tier
- Unit-level data also lacks tier information
- Total raw entries: 1,235 (but only 862 unique lesson slugs)

**Impact**:

- Cannot determine tier membership without API supplementation
- Must use heuristics (analyze lesson list composition) or API calls
- Breaks lesson deduplication logic

**Current Workaround**:

Fetch `/sequences/maths-secondary/units` from API to get tier assignments.

**Requested** (at lesson level):

```json
{
  "lessonSlug": "solving-complex-quadratic-equations",
  "tiers": ["foundation", "higher"]
}
```

**OR** (at unit level):

```json
{
  "unitSlug": "algebraic-fractions",
  "tier": "higher",
  "tierSlug": "higher"
}
```

**Priority**: HIGH — affects all maths KS4 ingestion (373 lessons)

**See also**: Issue 2 in "Bulk Download Data Integrity Issues" section above

### ER6: Add Unit Options to Bulk Download

**Request**: Add `unitOptions` field to units that have alternative choices.

**Current State**:

- Geography and English KS4 have unit options (alternative units students can choose)
- API exposes this via `/sequences/{seq}/units` response
- Bulk download has **no unit options data**

**Affected Subjects/Key Stages**:

| Subject | Key Stage | Unit Options in API |
|---------|-----------|---------------------|
| Geography | KS4 | Yes |
| English | KS4 | Yes |
| Art | KS4 | Possibly |
| Design-Technology | KS4 | Possibly |

**Impact**:

- Cannot represent curriculum choices from bulk data alone
- Requires API supplementation for unit relationships

**Requested**:

```json
{
  "unitSlug": "fieldwork-human-geography",
  "unitOptions": [
    { "unitSlug": "fieldwork-physical-geography", "unitTitle": "Fieldwork - Physical Geography" }
  ]
}
```

**Priority**: MEDIUM — affects ~4 subjects but only at KS4

### ER7: Add `yearSlug` to Lessons in Bulk Download

**Request**: Include `yearSlug` directly on lesson records.

**Current State**:

- Units have `yearSlug` field
- Lessons do **not** have `yearSlug` field
- Must derive year via `lesson.unitSlug → unit.yearSlug` join

**Impact**:

- Extra processing step required during ingestion
- Potential for mismatches when lessons belong to multiple units
- Complicates lesson document building

**Requested**:

```json
{
  "lessonSlug": "adding-fractions-with-same-denominator",
  "unitSlug": "fractions",
  "yearSlug": "year-4",
  "yearTitle": "Year 4"
}
```

**Priority**: LOW — workaround exists (derive from unit)

### ER8: Add `examBoard` to Science KS4 Lessons in Bulk Download

**Request**: Include `examBoard` directly on lesson records for science KS4.

**Current State**:

- Units have `examBoards` array (e.g., `["aqa", "edexcel", "ocr"]`)
- Lessons do **not** have exam board information
- Must derive via unit relationship

**Impact**:

- Cannot filter lessons by exam board without unit join
- Extra processing during ingestion
- Science KS4 has complex structure (exam subjects × exam boards × tiers)

**Requested**:

```json
{
  "lessonSlug": "photosynthesis-part-1",
  "examBoards": ["aqa", "edexcel", "ocr"],
  "examSubject": "biology",
  "tier": "higher"
}
```

**Priority**: LOW — workaround exists (derive from unit)

---

## Bulk Download Structure Improvements (2025-12-31)

**Context**: Based on implementing the bulk-first ingestion pipeline, these structural improvements would significantly reduce processing complexity and eliminate the need for cross-referencing during ingestion.

### ER9: Add Top-Level Threads Array to Bulk Download

**Request**: Include a deduplicated `threads[]` array at the top level of bulk files.

**Current State**:

- Threads are embedded in `sequence[].threads[]` on each unit
- Same thread appears on multiple units
- Extracting unique threads requires iterating all units and deduplicating

**Example of current structure**:

```json
{
  "sequence": [
    {
      "unitSlug": "fractions-year-3",
      "threads": [{ "slug": "number-fractions", "order": 1, "title": "Number: Fractions" }]
    },
    {
      "unitSlug": "fractions-year-4",
      "threads": [{ "slug": "number-fractions", "order": 2, "title": "Number: Fractions" }]
    }
  ]
}
```

**Requested structure**:

```json
{
  "threads": [
    {
      "threadSlug": "number-fractions",
      "threadTitle": "Number: Fractions",
      "units": [
        { "unitSlug": "fractions-year-3", "order": 1 },
        { "unitSlug": "fractions-year-4", "order": 2 }
      ]
    }
  ],
  "sequence": [/* units without embedded threads, or with threadSlugs only */]
}
```

**Benefits**:

- No deduplication required during processing
- Thread→unit relationships explicit
- Smaller file size (no repeated thread objects)
- Enables thread-first traversal patterns

**Priority**: MEDIUM — current workaround requires O(units) processing

### ER10: Use JSON Null Instead of String "NULL" Sentinel

**Request**: Replace all string `"NULL"` sentinel values with JSON `null`.

**Current State**:

- Fields like `contentGuidance` and `supervisionLevel` use string `"NULL"` when absent
- Requires custom Zod schema transformation: `z.union([z.string(), z.null()]).transform(v => v === "NULL" ? null : v)`
- Mixed semantics: some fields use `null`, others use `"NULL"`

**Example of current data**:

```json
{
  "contentGuidance": "NULL",
  "supervisionLevel": "NULL"
}
```

**Requested**:

```json
{
  "contentGuidance": null,
  "supervisionLevel": null
}
```

**Benefits**:

- Standard JSON null handling
- No custom transformation logic
- Consistent semantics across all fields
- Simpler Zod schemas

**Priority**: MEDIUM — current workaround exists but adds complexity

### ER11: Bundle JSON Schema/Zod Schemas with Bulk Download

**Request**: Provide a validation schema alongside bulk download data.

**Rationale**: The bulk download format differs from the API response format. Currently, consumers must reverse-engineer the structure by analyzing sample data. A bundled schema would:

1. **Enable compile-time type generation** — Generate TypeScript types from schema
2. **Provide validation at parse time** — Catch data issues early
3. **Document the format** — Schema is documentation
4. **Version tracking** — Schema version indicates data format changes

**Suggested Formats** (pick one or more):

- **JSON Schema**: Standard, widely supported
- **Zod schema (TypeScript)**: Native to our stack, best DX
- **OpenAPI component**: Reuse existing tooling

**Example bundle structure**:

```
bulk-download-2025-12-30.zip
├── maths-primary.json
├── maths-secondary.json
├── ... (other data files)
├── schema.json              # JSON Schema
├── schema.zod.ts            # Optional: Zod schema
└── manifest.json            # Version, timestamps, file list
```

**Priority**: MEDIUM — significant DX improvement, but workarounds exist

### ER12: Add Lesson Count to Units in Bulk Download

**Request**: Include `lessonCount` field on unit records.

**Current State**:

- Units have `unitLessons[]` array with lesson slugs
- Must count array length to get lesson count
- Some `unitLessons` entries reference lessons not in `lessons[]` array (data integrity issue)

**Requested**:

```json
{
  "unitSlug": "algebraic-fractions",
  "unitTitle": "Algebraic Fractions",
  "lessonCount": 8,
  "unitLessons": [/* ... */]
}
```

**Benefits**:

- Quick access to lesson counts without array operations
- Can detect data integrity issues (count vs array length mismatch)
- Useful for progress tracking during ingestion

**Priority**: LOW — minor convenience improvement

### ER13: Add Subject-Level Metadata to Bulk Download

**Request**: Include subject-level metadata at the top level.

**Current State**:

- `subjectTitle` is at top level
- `subjectSlug` must be derived from `sequenceSlug` (e.g., `maths-primary` → `maths`)
- Key stage coverage must be inferred from unit data
- Phase (primary/secondary) derived from sequence slug

**Requested**:

```json
{
  "subjectSlug": "maths",
  "subjectTitle": "Maths",
  "sequenceSlug": "maths-primary",
  "phase": "primary",
  "phaseSlug": "primary",
  "keyStages": ["ks1", "ks2"],
  "totalLessons": 1099,
  "totalUnits": 98,
  "totalThreads": 15
}
```

**Benefits**:

- No derivation logic needed
- Explicit key stage coverage
- Useful summary statistics
- Consistent with API subject response structure

**Priority**: LOW — workarounds exist

---

## Future Enhancement Requests (2026-01-03)

### ER14: Multilingual Captioning Support for MFL Subjects

**Status**: 🟡 ENHANCEMENT — Long-term improvement
**Priority**: LOW-MEDIUM (significant effort, high value for MFL teachers)

**Current State**:

MFL (French, German, Spanish) lessons have 0% transcript coverage because:

1. Videos contain non-English speech (teachers speaking the target language)
2. Automatic captioning services are trained on English
3. Captioning fails or produces garbage for non-English audio
4. Videos exist, but transcripts were never generated

**Impact**:

| Subject | Video | Transcript | Search Quality |
|---------|-------|------------|----------------|
| French | ✅ Exists | ❌ None | MRR 0.19 |
| Spanish | Varies | ❌ None | MRR 0.29 |
| German | ✅ Exists | ❌ None | MRR 0.19 |
| Maths | ✅ Exists | ✅ Full | MRR 0.61 |

MFL search quality is 3-4x worse than subjects with transcripts.

**Requested Enhancement**:

Explore multilingual captioning options:

1. **Multilingual ASR models** — Modern models (Whisper, etc.) support French, Spanish, German
2. **Human captioning** — Higher accuracy, higher cost
3. **Hybrid approach** — ASR with human review

**Business Case**:

- ~1,350 MFL lessons across primary and secondary
- Teachers for 3 subjects (10%+ of curriculum) cannot benefit from transcript-based search
- MFL is a high-demand subject area

**User impact**: MFL teachers get full search functionality; AI agents can retrieve relevant MFL content.

---

### ER15: Document Category Availability by Subject

**Status**: 🟡 ENHANCEMENT — Documentation improvement
**Priority**: LOW

**Current State**:

Categories (`categoryTitle`, `categorySlug`) are only available for **3 of 17 subjects**:

| Subject | Has Categories | Category Values |
|---------|----------------|-----------------|
| English | ✅ | Grammar, Handwriting, Reading/writing/oracy |
| Science | ✅ | Biology, Chemistry, Physics |
| Religious Education | ✅ | Theology, Philosophy, Social science |
| **All others (14)** | ❌ | None |

This is **intentional curriculum design**, not missing data — but it's not documented.

**Requested Enhancement**:

1. **Document in OpenAPI schema** which subjects have categories:

```yaml
categories:
  type: array
  description: |
    Thematic groupings within subjects. Only available for:
    - English (Grammar, Handwriting, Reading/writing/oracy)
    - Science (Biology, Chemistry, Physics)  
    - Religious Education (Theology, Philosophy, Social science)
    
    Other subjects do not use category groupings.
```

2. **Add category descriptions** (currently only titles exist):

```json
{
  "categorySlug": "biology",
  "categoryTitle": "Biology",
  "categoryDescription": "Study of living organisms, including cells, genetics, evolution, and ecosystems"
}
```

**User impact**: API consumers understand category scope; UI developers can conditionally show category filters.

---

### ER16: Key Stage Coverage Discovery Endpoint

**Status**: 🟡 ENHANCEMENT — Discoverability improvement
**Priority**: LOW

**Current State**:

Different subjects cover different key stages, but there's no API way to discover this:

| Gap | Subjects |
|-----|----------|
| No KS1 (start at Year 3) | French, Spanish |
| No primary content | German, Citizenship |
| No KS4 content | Cooking & Nutrition |
| No bulk download | RSHE-PSHE |

Consumers must discover gaps through trial and error or external documentation.

**Requested Enhancement**:

Add key stage coverage to `/subjects` response:

```json
{
  "subjectSlug": "french",
  "subjectTitle": "French",
  "keyStages": ["ks2", "ks3", "ks4"],
  "keyStageNotes": "No KS1 content; French begins in Year 3"
}
```

Or create a dedicated discovery endpoint:

```http
GET /api/v0/subjects/{subject}/coverage
```

```json
{
  "subjectSlug": "french",
  "keyStages": {
    "ks1": { "available": false, "reason": "Subject begins at Year 3" },
    "ks2": { "available": true, "years": [3, 4, 5, 6] },
    "ks3": { "available": true, "years": [7, 8, 9] },
    "ks4": { "available": true, "years": [10, 11], "examBoards": ["aqa", "edexcel"] }
  }
}
```

**User impact**: API consumers can programmatically determine subject availability; UI developers can hide unavailable options.

---

## Ground Truth & Evaluation Support (2026-01-05)

### ER17: Phase Metadata in API and Bulk Data

**Status**: 🟡 ENHANCEMENT — Would simplify phase-aligned search and evaluation
**Priority**: MEDIUM

**Current State**:

The curriculum is fundamentally organized by **phase** (primary/secondary), not individual key stages:
- **Primary**: KS1 + KS2 (Years 1-6)
- **Secondary**: KS3 + KS4 (Years 7-11)

However, neither the API responses nor bulk download include a `phase_slug` field. Consumers must derive this:

```typescript
// Current: consumers must derive phase from key stage
const phase = ['ks1', 'ks2'].includes(keyStage) ? 'primary' : 'secondary';
```

**Key Discovery (2026-01-05)**:

During ground truth creation, we discovered that per-key-stage testing is **fundamentally flawed** because:
- The same lessons appear across KS1 and KS2 (they're filtered views of the same primary content)
- Testing KS1 separately from KS2 causes false failures (slugs valid in KS2 but not KS1)
- Search filters should operate on **phase**, not individual key stage

**Requested Enhancement**:

Add `phaseSlug` field to:

1. **Bulk download lessons**:
```json
{
  "lessonSlug": "adding-fractions",
  "phaseSlug": "primary",
  "keyStageSlug": "ks2",
  ...
}
```

2. **API lesson responses** (`/lessons/{lesson}/summary`):
```json
{
  "lessonSlug": "adding-fractions",
  "phaseSlug": "primary",
  ...
}
```

3. **Subjects endpoint** (`/subjects`):
```json
{
  "subjectSlug": "maths",
  "phases": ["primary", "secondary"],
  "phaseDetails": [
    { "phaseSlug": "primary", "keyStages": ["ks1", "ks2"], "years": [1,2,3,4,5,6] },
    { "phaseSlug": "secondary", "keyStages": ["ks3", "ks4"], "years": [7,8,9,10,11] }
  ]
}
```

**User impact**: Search implementers can filter by phase correctly; ground truth creators can organize tests by phase; teachers understand curriculum structure better.

---

### ER18: Bulk Slug Validation Endpoint

**Status**: 🟡 ENHANCEMENT — Would dramatically simplify ground truth validation
**Priority**: LOW-MEDIUM

**Current State**:

To validate that lesson/unit slugs exist, consumers must make individual API calls:

```typescript
// Current: N API calls to validate N slugs
for (const slug of slugsToValidate) {
  const result = await client.getLessonSummary(slug);
  if (!result.ok) invalidSlugs.push(slug);
}
```

For ground truth creation with 100+ queries, this means 100+ API calls just for validation.

**Requested Enhancement**:

Batch validation endpoint:

```http
POST /api/v0/validate-slugs

Request:
{
  "lessonSlugs": ["adding-fractions", "nonexistent-lesson", "subtracting-fractions"],
  "unitSlugs": ["fractions-year-4", "invalid-unit"]
}

Response:
{
  "lessons": {
    "valid": ["adding-fractions", "subtracting-fractions"],
    "invalid": ["nonexistent-lesson"],
    "deprecated": []
  },
  "units": {
    "valid": ["fractions-year-4"],
    "invalid": ["invalid-unit"],
    "deprecated": []
  }
}
```

**Benefits**:
- Single API call validates hundreds of slugs
- Clear distinction between invalid and deprecated slugs
- Enables efficient ground truth validation workflows
- Could include additional context (e.g., which subject/keyStage the slug belongs to)

**User impact**: Ground truth creators and data validators can verify large slug sets efficiently; SDK/MCP engineers can implement reliable validation tools.

---

### ER19: Field Availability Documentation by Subject

**Status**: 🟡 ENHANCEMENT — Would clarify which fields to use for search/evaluation
**Priority**: LOW

**Current State**:

Field availability varies significantly by subject, but this isn't documented:

| Subject | Transcripts | Categories | Tiers | Exam Boards | Structural Fields |
|---------|-------------|------------|-------|-------------|-------------------|
| Maths | ✅ 100% | ❌ | KS4 only | KS4 only | ✅ |
| French | ❌ 0% | ❌ | ❌ | KS4 only | ✅ |
| Science | ✅ ~100% | ✅ | KS4 only | KS4 only | ✅ |
| PE | ⚠️ ~30% | ❌ | ❌ | ❌ | ✅ |

Consumers building search or evaluation must discover these patterns through trial and error.

**Requested Enhancement**:

Add field availability matrix to OpenAPI schema or a dedicated endpoint:

```http
GET /api/v0/subjects/{subject}/field-availability

Response:
{
  "subjectSlug": "french",
  "fields": {
    "transcript_sentences": { "availability": "none", "reason": "MFL audio not transcribed" },
    "categorySlug": { "availability": "none", "reason": "Subject doesn't use categories" },
    "lesson_structure": { "availability": "full", "note": "Always populated" },
    "tierSlug": { "availability": "ks4_only", "values": ["foundation", "higher"] }
  }
}
```

**User impact**: Search implementers know which fields to rely on; ground truth creators understand what to test; API consumers avoid 404s for unavailable data.

---

### ER20: Bulk Download Version/Freshness Metadata

**Status**: 🟡 ENHANCEMENT — Would improve cache/freshness handling
**Priority**: LOW

**Current State**:

The bulk download `manifest.json` includes filenames but no version or timestamp information. Consumers cannot determine:
- When was this bulk data generated?
- Is it current with the live API?
- What API version does it correspond to?

**Requested Enhancement**:

Enhance `manifest.json`:

```json
{
  "version": "2026-01-05",
  "generatedAt": "2026-01-05T03:00:00Z",
  "apiVersion": "v0",
  "nextRefresh": "2026-01-12T03:00:00Z",
  "refreshFrequency": "weekly",
  "checksums": {
    "maths-primary.json": "sha256:abc123...",
    "maths-secondary.json": "sha256:def456..."
  },
  "files": [
    { "name": "maths-primary.json", "lessonCount": 1099, "lastModified": "2026-01-05T03:00:00Z" },
    ...
  ]
}
```

**Benefits**:
- Consumers can implement cache invalidation based on timestamps
- Checksums enable efficient incremental updates
- Clear expectations about data freshness
- Version alignment with API

**User impact**: Data engineers can build reliable caching; SDK/MCP engineers can detect stale data; teachers and learners get timely content updates.

---

## Related Documents

- **[Data Variances](../../../../docs/data/DATA-VARIANCES.md)** — Consolidated reference for all curriculum data differences (includes summaries of issues documented here)
- **[Curriculum Structure Analysis](../../analysis/curriculum-structure-analysis.md)** — 7 structural patterns, traversal strategies
- **[index.md](index.md)** — Navigation hub for all wishlist documents
