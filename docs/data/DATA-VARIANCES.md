# Data Variances Across Subjects and Key Stages

**Last Updated**: 2026-02-04
**Purpose**: Consolidated reference for all curriculum data differences
**Status**: Living document — update when new variances discovered

---

## Relationship to Ontology

This document captures **data quirks** that affect how consumers process curriculum data. Some of this information is (or should be) reflected in the ontology:

| Variance                           | In Ontology? | Location                          |
| ---------------------------------- | ------------ | --------------------------------- |
| Structural patterns                | ✅ Yes       | `ontologyData.structuralPatterns` |
| KS4 programme factors              | ✅ Yes       | `ontologyData.ks4Complexity`      |
| Many-to-many cardinalities         | ❌ No        | Section 10 of this document       |
| Null handling (`"NULL"` vs `null`) | ❌ No        | Section 12 of this document       |
| Year type variations               | ❌ No        | Section 12 of this document       |
| Bulk duplicate causes              | ❌ No        | Section 7 of this document        |

**TODO**: Consider adding a `dataQuirks` section to the ontology to capture these edge cases.
See `.agent/plans/external/ooc-api-wishlist/20-ontology-and-graphs-api-proposal.md` for the full proposal.

---

## Quick Reference

| Variance Type               | Impact             | Key Finding                                                                                         |
| --------------------------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| **Transcript availability** | Search quality     | **API**: maths complete, others sample; **Bulk**: MFL ~0%, PE partial, most subjects 96-100%        |
| **Categories**              | Faceted search     | Only English, Science, RE have categories                                                           |
| **Tiers**                   | Filter handling    | Only KS4 Maths/Science                                                                              |
| **Exam boards**             | Filter handling    | KS4 only; varies by subject                                                                         |
| **Structural patterns**     | API traversal      | 7 patterns that can combine                                                                         |
| **API vs Bulk**             | Ingestion strategy | Bulk transcripts mostly complete (MFL/PE sparse); API restricts non-maths resources (TPC filtering) |
| **Bulk duplicates**         | Data processing    | 2025-12-07: 467 across 4 subjects; 2025-12-30: 513 across 5 subjects                                |
| **RSHE-PSHE**               | Availability       | Missing from bulk download entirely                                                                 |
| **Year type**               | SDK complexity     | number vs "string" vs "year-N" slug                                                                 |
| **Null handling**           | SDK complexity     | JSON null vs "NULL" string vs missing                                                               |

---

## 1. Transcript Availability

### API coverage (documented + spot checks)

**Documented scope**: Maths is complete; all other subjects are described as a **sample** (no guaranteed completeness).  
Source: [Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage)

**Observed gaps (API)**:

- MFL transcript endpoint returns 451 (near-zero coverage)
- Some maths lessons also return 451 (broader TPC enforcement)
- PE Primary near-zero; PE Secondary partial
- Non-maths subjects can return 404 even when bulk has transcripts (TPC filtering)

### Root Cause for MFL

**Verified 2026-02-12 via API** (updated from 2026-01-03):

| Subject | Lesson Example                                                      | Old Response | Current Response | Video Asset |
| ------- | ------------------------------------------------------------------- | ------------ | ---------------- | ----------- |
| French  | `greetings-and-introductions`                                       | 500          | **451**          | Exists      |
| German  | `mein-traumhaus-describing-your-dream-home`                         | 500          | **451**          | Exists      |
| Spanish | `mi-familia-introducing-your-family`                                | 404          | **451**          | 404         |
| Maths   | `pythagoras-theorem`                                                | n/a          | **451**          | Exists      |
| Maths   | `checking-understanding-of-addition-and-subtraction-with-fractions` | 200          | **200**          | Exists      |

The upstream API now returns HTTP 451 (Unavailable For Legal Reasons) consistently for unavailable transcripts. This is a significant improvement over the previous inconsistent 500/404 responses.

**Note**: The response body claims `code: "INTERNAL_SERVER_ERROR"` despite the HTTP status being 451. This is a remaining upstream inconsistency. HTTP 451 is also not yet documented in the upstream OpenAPI schema.

**Explanation (API behaviour)**: MFL lesson videos contain non-English speech. Automatic captioning services (trained on English) fail or produce garbage. The API transcript endpoint returns 451 for these lessons; bulk download shows `transcript_sentences` mostly `"NULL"` for MFL, so transcript coverage is near-zero in both sources. Some maths lessons (e.g. `pythagoras-theorem`) also return 451, suggesting broader TPC (Third Party Content) enforcement.

**API search implication**: MFL search relies entirely on:

- `lesson_structure` / `lesson_structure_semantic` (always populated)
- `lesson_title` (contains target language)
- `lesson_keywords`, `key_learning_points`, etc. (all English)

### Bulk coverage (observed via bulk download)

Coverage is calculated by treating `transcript_sentences` as **missing** when it is `null`, empty, or the string `"NULL"`.

| Category           | Subjects                                                                                                      | Coverage | Implication               |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | -------- | ------------------------- |
| **Full (96-100%)** | Art, Citizenship, Computing, Cooking & Nutrition, D&T, English, Geography, History, Maths, Music, RE, Science | 96-100%  | Rich semantic search      |
| **Partial**        | PE Secondary                                                                                                  | 29%      | Limited semantic matching |
| **None (<1%)**     | **French, Spanish, German**, PE Primary                                                                       | 0-1%     | **Structure-only search** |

**Bulk scan detail (repo snapshots)**:

- 2025-12-07: English 98.9%, Maths 99.8%, Music 98.2%, PE Secondary 29.0%, PE Primary 0.7%, MFL ~0.2%
- 2025-12-30: English 99.0%, Maths 99.8%, Music 98.2%, PE Secondary 28.6%, PE Primary 0.7%, MFL ~0.2%

**Implication**: Bulk download transcripts are far more complete than the API for non-maths subjects, but MFL and PE remain sparse even in bulk.

### Implementation

Lessons without transcripts have content fields omitted in the indexing code:

```typescript
// From buildLessonDocument() - lesson-document-core.ts
const hasTranscript = typeof params.transcript === 'string' && params.transcript.length > 0;
return {
  has_transcript: hasTranscript,
  lesson_content: hasTranscript ? params.transcript : undefined, // ← Omitted if no transcript
  lesson_content_semantic: hasTranscript ? params.transcript : undefined, // ← Omitted if no transcript
  lesson_structure: params.lessonStructure, // ← Always present
  lesson_structure_semantic: params.lessonStructure, // ← Always present
};
```

---

## 2. Category Availability

Categories are **NOT** missing data — they are an **intentional curriculum design element** present only in subjects where pedagogical categorisation is meaningful.

### Summary

| Status            | Count | Subjects                              |
| ----------------- | ----- | ------------------------------------- |
| ✅ HAS Categories | 3     | English, Science, Religious Education |
| ❌ NO Categories  | 14    | All others                            |

### Category Values by Subject

| Subject                 | Categories                                  |
| ----------------------- | ------------------------------------------- |
| **English**             | Grammar, Handwriting, Reading/writing/oracy |
| **Science**             | Biology, Chemistry, Physics                 |
| **Religious Education** | Theology, Philosophy, Social science        |

### Faceted Search Impact

- `unit_topics` field only populated for 3 subjects
- Topics facet should be hidden for other subjects
- Alternative: use thread titles as topic proxies

---

## 3. Structural Patterns (API Traversal)

> **Source**: [curriculum-structure-analysis.md](../../.agent/analysis/curriculum-structure-analysis.md)

The API response structure varies by subject and key stage. Understanding patterns is **ESSENTIAL** for complete data retrieval.

### Pattern Types (7 Total)

| Pattern ID            | Description                                       | Applies To           |
| --------------------- | ------------------------------------------------- | -------------------- |
| `simple-flat-primary` | Standard year → units → lessons                   | All subjects KS1-2   |
| `simple-flat-ks3`     | Standard year → units → lessons                   | All subjects KS3     |
| `tier-variants`       | Year includes `tiers[]` at top level              | Maths KS4            |
| `exam-subject-split`  | Science KS4 splits into Biology/Chemistry/Physics | Science KS4          |
| `exam-board-variants` | Multiple sequences for different exam boards      | Most subjects at KS4 |
| `unit-options`        | Units have `unitOptions[]` with choices           | 6 subjects at KS4    |
| `no-ks4`              | Subject has no KS4 content                        | Cooking & Nutrition  |

### Pattern Combinations

**Critical**: Patterns can COMBINE. A subject may have multiple patterns simultaneously.

| Subject           | Patterns                                                             |
| ----------------- | -------------------------------------------------------------------- |
| **Science KS4**   | exam-board-variants + exam-subject-split + tier-variants (ALL THREE) |
| **English KS4**   | exam-board-variants + unit-options                                   |
| **Geography KS4** | exam-board-variants + unit-options                                   |
| **Maths KS4**     | tier-variants only                                                   |

### Traversal Guidance

| Route                                            | When to Use                 |
| ------------------------------------------------ | --------------------------- |
| `GET /key-stages/{ks}/subject/{subject}/lessons` | KS1-KS3 all subjects        |
| `GET /sequences/{sequence}/units?year={year}`    | KS4 with tiers/examSubjects |

**⚠️ Critical Warning**: `GET /key-stages/ks4/subject/science/lessons` returns **EMPTY**. Must use sequences endpoint and traverse examSubjects → tiers → units.

---

## 4. KS4-Specific Metadata

> **Sources**:
>
> - [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts)
> - [01-derived-fields-and-ks4-metadata.md](../../.agent/plans/external/ooc-api-wishlist/01-derived-fields-and-ks4-metadata.md)

### Programme Factors

| Factor           | Values                                        | Applies To                 |
| ---------------- | --------------------------------------------- | -------------------------- |
| **Tier**         | foundation, higher                            | Maths, Science             |
| **Exam Board**   | aqa, ocr, edexcel, eduqas, edexcelb           | All KS4 subjects           |
| **Exam Subject** | biology, chemistry, physics, combined-science | Science only               |
| **Pathway**      | core, gcse                                    | Citizenship, Computing, PE |

### Exam Boards by Subject

| Subject     | Exam Boards                   |
| ----------- | ----------------------------- |
| english     | AQA, Edexcel, Eduqas          |
| science     | AQA, Edexcel, OCR             |
| geography   | AQA, Edexcel B                |
| history     | AQA, Edexcel                  |
| french      | AQA, Edexcel                  |
| spanish     | AQA, Edexcel                  |
| german      | AQA, Edexcel                  |
| music       | AQA, Edexcel, Eduqas, OCR     |
| PE          | AQA, Edexcel, OCR, Core, GCSE |
| RE          | AQA, Edexcel B, Eduqas, Core  |
| computing   | AQA, OCR, Core, GCSE          |
| citizenship | Core, GCSE                    |

### Unit Options

| Subject       | Has Unit Options | Examples                                  |
| ------------- | ---------------- | ----------------------------------------- |
| English KS4   | ✅               | Set texts (Animal Farm, Macbeth, etc.)    |
| Art KS4       | ✅               | Specialisms (Fine Art, Photography, etc.) |
| Geography KS4 | ✅               | Topics (Coastal, River, Glacial)          |
| History KS4   | ✅               | Periods (Battle of Hastings, etc.)        |
| RE KS4        | ✅               | Faiths (Buddhism vs Islam, etc.)          |
| D&T KS4       | ✅               | Material specialisms                      |
| Most others   | ❌               | N/A                                       |

### Derived Fields (No Direct API Field)

| Field           | Current Derivation     | Schema Source                                     |
| --------------- | ---------------------- | ------------------------------------------------- |
| `tier`          | Parse from slug suffix | `tiers[].tierSlug` in SequenceUnitsResponseSchema |
| `examBoard`     | Use `examBoardTitle`   | `examBoardTitle` in LessonSearchResponseSchema    |
| `ks4OptionSlug` | Use `ks4Options.slug`  | `ks4Options` object on sequences                  |

**Note**: The `pathway` concept **never existed** in the API — it was a misunderstanding. What exists is `ks4Options`.

---

## 5. Key Stage Coverage Gaps

> **Source**: [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) → `structuralPatterns.keyStageGaps`

Not all subjects cover all key stages:

| Gap                              | Subjects            |
| -------------------------------- | ------------------- |
| No KS1 (start at Year 3)         | French, Spanish     |
| No primary content               | German, Citizenship |
| No KS4 content                   | Cooking & Nutrition |
| No bulk download file (API only) | **RSHE/PSHE**       |

---

## 6. API vs Bulk Download Data

### TPC License Filtering (Intentional)

The API applies Third Party Content (TPC) license filtering to assets and transcripts:

```typescript
// From upstream API queryGate.ts
const supportedSubjects = ['maths']; // Only maths fully TPC-cleared
```

| Data Type    | API (Non-Maths) | Bulk Download      |
| ------------ | --------------- | ------------------ |
| Lessons list | ✅ Complete     | ✅ Complete        |
| Transcripts  | ❌ ~35% only    | ✅ 100%            |
| Assets       | ❌ ~35% only    | N/A (no downloads) |

### Official Documentation

From [Oak API Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage):

> Currently, the API includes **all lesson resources for KS1-4 maths**, plus a **sample of lesson resources** for [other subjects]

### Ingestion Strategy

**Use bulk download as primary source** for all subjects. API is only authoritative for:

- Lesson summaries (always available)
- Real-time validation of slugs
- Sequence/unit structure

### Known Discrepancies

| Data Type                 | Bulk Download                                                            | API                                   | Notes                                 |
| ------------------------- | ------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------- |
| **Transcripts**           | Most subjects 96-100%; MFL/PE sparse (bulk scans 2025-12-07, 2025-12-30) | Maths complete; others sample/blocked | TPC filtering and missing transcripts |
| **`downloadsAvailable`**  | Always `true`                                                            | Not applicable                        | Field may be stale                    |
| **Asset access**          | Not applicable                                                           | TPC-filtered                          | ~35% non-maths                        |
| **Tier metadata (maths)** | Missing                                                                  | Present in responses                  | Bulk has duplicates                   |
| **Null semantics**        | String `"NULL"`                                                          | JSON `null`                           | Inconsistent                          |
| **Title fields**          | Often null                                                               | Usually present                       | Denormalization gap                   |

---

## 7. Bulk Download Data Integrity Issues

> **Source**: [00-overview-and-known-issues.md](../../.agent/plans/external/ooc-api-wishlist/00-overview-and-known-issues.md)

### Duplicate Lessons in Bulk Download

Validated by scanning bulk snapshots stored in `reference/bulk_download_data/`.  
All duplicates are in **secondary** files; primary files show zero duplicates.

#### Snapshot: 2025-12-07T09_37_04.693Z

| File                | Raw Lessons | Unique Lessons | Duplicates | Cause         |
| ------------------- | ----------- | -------------- | ---------- | ------------- |
| english-secondary   | 1,035       | 1,009          | **26**     | Unit options  |
| geography-secondary | 527         | 460            | **67**     | Unit options  |
| maths-secondary     | 1,235       | 862            | **373**    | Tier variants |
| science-secondary   | 888         | 887            | **1**      | Cross-unit    |
| **All others**      | —           | —              | 0          | —             |
| **TOTAL**           | 12,783      | 12,316         | **467**    | —             |

#### Snapshot: 2025-12-30T16_07_45.986Z

| File                | Raw Lessons | Unique Lessons | Duplicates | Cause         |
| ------------------- | ----------- | -------------- | ---------- | ------------- |
| english-secondary   | 1,075       | 1,028          | **47**     | Unit options  |
| geography-secondary | 527         | 460            | **67**     | Unit options  |
| history-secondary   | 464         | 439            | **25**     | Unit options  |
| maths-secondary     | 1,235       | 862            | **373**    | Tier variants |
| science-secondary   | 890         | 889            | **1**      | Cross-unit    |
| **All others**      | —           | —              | 0          | —             |
| **TOTAL**           | 12,833      | 12,320         | **513**    | —             |

### Title Fields Null Despite Slugs Present

```json
{
  "yearTitle": null, // ← null
  "yearSlug": "year-7", // ← populated
  "keyStageTitle": null, // ← null
  "keyStageSlug": "ks3", // ← populated
  "subjectTitle": null, // ← null
  "subjectSlug": null // ← also null (double issue)
}
```

All 98 units in `maths-secondary.json` have `yearTitle: null` and `keyStageTitle: null`.

### Missing Tier Metadata (Maths KS4)

- 373 maths KS4 lessons appear as **exact duplicates** in the `lessons[]` array
- **No field** distinguishes foundation from higher tier
- Unit-level data also lacks tier information
- Must derive tier via API supplementation

### Inconsistent Null Semantics

```json
{
  "contentGuidance": "NULL", // String sentinel, not JSON null
  "supervisionLevel": "NULL"
}
```

Some fields use string `"NULL"` instead of JSON `null` for absent values.

### Missing Lesson Record Referenced by Unit

`further-demonstrating-of-pythagoras-theorem` appears in `unitLessons[]` but is **missing** from `lessons[]`. Breaks referential integrity.

---

## 8. RSHE-PSHE Availability

**Status**: 🔴 CONFIRMED MISSING from bulk download (2025-12-30)

The [Oak Bulk Download page](https://open-api.thenational.academy/bulk-download) shows RSHE (PSHE) as available, but the actual `/api/bulk` endpoint **does not return these files**.

| Expected File              | Status     |
| -------------------------- | ---------- |
| `rshe-pshe-primary.json`   | ❌ Missing |
| `rshe-pshe-secondary.json` | ❌ Missing |

**Files returned**: 30 (all subjects except RSHE-PSHE)
**Files expected**: 32

**Impact**: RSHE-PSHE content cannot be ingested from bulk. Ground truth benchmarks deferred until bulk files become available.

---

## 9. API Pagination Bug

> **Source**: [00-overview-and-known-issues.md](../../.agent/plans/external/ooc-api-wishlist/00-overview-and-known-issues.md)

The `/key-stages/{ks}/subject/{subject}/lessons` endpoint returns **incomplete data** when called without a unit filter:

| Query Type              | Maths KS4 Lessons | Status        |
| ----------------------- | ----------------- | ------------- |
| Unfiltered pagination   | **431 lessons**   | ❌ Incomplete |
| Filtered by unit        | All present       | ✅ Complete   |
| Individual lesson fetch | Works             | ✅ Works      |

**Missing lessons** (5 confirmed):

1. `problem-solving-with-compound-measures`
2. `checking-and-securing-understanding-on-chains-of-reasoning-with-angle-facts`
3. `checking-and-securing-understanding-of-exterior-angles`
4. `interquartile-range`
5. `constructing-box-plots`

**Workaround**: Fetch lessons unit-by-unit instead of using unfiltered pagination.

---

## 10. Entity Relationships

> **Source**: [knowledge-graph-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts)

### Core Hierarchy

```text
Subject → Sequence → Unit → Lesson
```

### KS4 Branching

```text
Sequence → ExamSubject → Tier → Unit (for Science KS4)
Sequence → Tier → Unit (for Maths KS4)
```

### Cross-Cutting Taxonomy

- **Threads**: Link units across years (threads span all 16 subjects)
- **Categories**: Group units within a subject (only English, Science, RE)

### Many-to-Many Relationships

| Relationship         | Cardinality  | Example                                          |
| -------------------- | ------------ | ------------------------------------------------ |
| Lesson → Tiers       | Many-to-many | "quadratic-factorising" in Foundation AND Higher |
| Lesson → Exam Boards | Many-to-many | Same lesson in AQA AND Edexcel                   |
| Lesson → Units       | Many-to-many | Same lesson in multiple units                    |
| Unit → Programmes    | Many-to-many | Same unit in multiple programme contexts         |

---

## 11. Search Quality by Data Shape

| Data Shape                                          | Subjects                    | Expected MRR | Actual MRR    |
| --------------------------------------------------- | --------------------------- | ------------ | ------------- |
| **Rich** (transcript + categories + misconceptions) | Maths, Science              | ≥0.6         | 0.614 (Maths) |
| **Good** (transcript + structured metadata)         | English, History, Geography | ≥0.5         | 0.54-0.62     |
| **Limited** (no transcript, metadata only)          | French, Spanish, German     | <0.3         | 0.19-0.29     |
| **Creative** (transcript + visual focus)            | Art, Music, D&T             | Varies       | 0.72-0.82     |

---

## 12. Type Consistency Issues

> **Critical**: These issues require special handling in SDK code.
> **Source**: [05-medium-priority-requests.md](../../.agent/plans/external/ooc-api-wishlist/05-medium-priority-requests.md) #11

### Year: Three Different Representations

The same concept "year" appears in **three incompatible formats**:

| Representation | Type            | Example    | Where Used                          |
| -------------- | --------------- | ---------- | ----------------------------------- |
| **Number**     | `number`        | `3`        | `GET /sequences/.../assets?year=3`  |
| **String**     | `string` (enum) | `"3"`      | `GET /sequences/.../units?year="3"` |
| **Slug**       | `string`        | `"year-3"` | `yearSlug` in bulk download, API    |
| **Title**      | `string`        | `"Year 3"` | `yearTitle` in responses            |

**API Schema Evidence**:

```yaml
# /sequences/{sequence}/units - year is STRING enum
parameters:
  - name: year
    schema:
      type: string
      enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'all-years']

# /sequences/{sequence}/assets - year is NUMBER
parameters:
  - name: year
    schema:
      type: number  # ← Different type!

# Response schemas - MIXED
year:
  anyOf:
    - type: number
    - type: string  # Too broad!
```

**Impact**:

- TypeScript/Zod can't infer a single `Year` type
- Client code must handle `5` vs `"5"` vs `"year-5"`
- SDK must normalize all year representations

### Null Handling: Four Different Semantics

> **Source**: [00-overview-and-known-issues.md](../../.agent/plans/external/ooc-api-wishlist/00-overview-and-known-issues.md) Issue 4

| Representation  | Example           | Where Used                    |
| --------------- | ----------------- | ----------------------------- |
| **JSON null**   | `"field": null`   | API responses (standard)      |
| **String NULL** | `"field": "NULL"` | Bulk download (maths primary) |
| **Empty array** | `"field": []`     | Some array fields             |
| **Missing key** | (field absent)    | Optional fields               |

**Example from maths-primary.json**:

```json
{
  "contentGuidance": "NULL",      // ← String "NULL", not JSON null!
  "supervisionLevel": "NULL"       // ← Same issue
}
// vs
{
  "contentGuidance": [{ "contentGuidanceLabel": "...", "contentGuidanceArea": "..." }],
  "supervisionLevel": "Adult supervision required"
}
```

**Impact**:

- SDK must check for both `null` and `"NULL"` string
- Can't use simple `if (!field)` checks
- Type guards become complex

### Duplicate Records in Bulk Data

> **Source**: [00-overview-and-known-issues.md](../../.agent/plans/external/ooc-api-wishlist/00-overview-and-known-issues.md) Issue 1

Validated by scanning bulk snapshots in `reference/bulk_download_data/`.  
See Section 7 for full tables and totals.

| Snapshot   | Subjects with duplicates                    | Total duplicates | Primary cause(s)                        |
| ---------- | ------------------------------------------- | ---------------- | --------------------------------------- |
| 2025-12-07 | English, Geography, Maths, Science          | **467**          | Unit options, tier variants, cross-unit |
| 2025-12-30 | English, Geography, History, Maths, Science | **513**          | Unit options, tier variants, cross-unit |

**Impact**:

- Deduplication required during ingestion
- Can't use slug alone as unique key
- Must track (slug + context) for uniqueness

---

## 13. API Schema Insights

> **Source**: [api-schema-sdk.json](../../packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json)

### Asset Types (Enum)

```text
slideDeck | exitQuiz | exitQuizAnswers | starterQuiz | starterQuizAnswers |
supplementaryResource | video | worksheet | worksheetAnswers
```

### Transcript Response

The `/lessons/{lesson}/transcript` endpoint:

- Returns `{ transcript: string, vtt: string }`
- **Documented 404**: Lessons without video return 404 (legitimate, not an error)
- **Undocumented 200 with empty**: Some lessons return 200 with `transcript: ""` instead of 404

### Year Enum Values

```text
1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | all-years
```

Note: `all-years` only valid for `physical-education-primary` sequence.

**⚠️ See Section 12** for year **type** inconsistencies (number vs string vs slug).

---

## Related Documents

### Detailed Analysis

| Document                                                                                         | Focus                                       |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| [curriculum-structure-analysis.md](../../.agent/analysis/curriculum-structure-analysis.md)       | 7 structural patterns, traversal strategies |
| [transcript-availability-analysis.md](../../.agent/analysis/transcript-availability-analysis.md) | Transcript coverage by subject              |
| [category-availability-by-subject.md](../../.agent/analysis/category-availability-by-subject.md) | Category availability                       |

### Upstream API Wishlist

| Document                                                                                                                    | Focus                                                 |
| --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [00-overview-and-known-issues.md](../../.agent/plans/external/ooc-api-wishlist/00-overview-and-known-issues.md)             | API bugs, data integrity issues, enhancement requests |
| [01-derived-fields-and-ks4-metadata.md](../../.agent/plans/external/ooc-api-wishlist/01-derived-fields-and-ks4-metadata.md) | KS4 metadata, derived fields registry                 |
| [05-medium-priority-requests.md](../../.agent/plans/external/ooc-api-wishlist/05-medium-priority-requests.md)               | **Type consistency issues (#11)**, schema `$ref`      |
| [15-bulk-download-examples.md](../../.agent/plans/external/ooc-api-wishlist/15-bulk-download-examples.md)                   | Bulk download data examples                           |
| [index.md](../../.agent/plans/external/ooc-api-wishlist/index.md)                                                           | Complete wishlist navigation                          |

### Planning

| Document                                                                                                                 | Focus                  |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| [comprehensive-filter-testing.md](../../.agent/plans/semantic-search/pre-sdk-extraction/comprehensive-filter-testing.md) | Filter testing plan    |
| [mfl-multilingual-embeddings.md](../../.agent/plans/semantic-search/post-sdk-extraction/mfl-multilingual-embeddings.md)  | MFL search limitations |
| [current-state.md](../../.agent/plans/semantic-search/current-state.md)                                                  | Current MRR baselines  |

### SDK Sources

| File                                                                                                             | Content                                             |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts)                              | Structural patterns, KS4 complexity, key stage gaps |
| [knowledge-graph-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts)                | Entity relationships, concept graph                 |
| [api-schema-sdk.json](../../packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json) | Complete OpenAPI schema                             |

### Technical

| Document                                                                    | Focus                  |
| --------------------------------------------------------------------------- | ---------------------- |
| [DATA-COMPLETENESS.md](../../apps/oak-search-cli/docs/DATA-COMPLETENESS.md) | What we upload in full |
| [INDEXING.md](../../apps/oak-search-cli/docs/INDEXING.md)                   | ES index structure     |

---

## Change Log

| Date       | Change                                                                                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-01-03 | **NEW Section 12**: Type Consistency Issues — year format variations, null handling semantics, duplicate records                                                     |
| 2026-01-03 | Major expansion: Added bulk download integrity issues, API pagination bug, RSHE-PSHE status, API schema insights, exam boards by subject, many-to-many relationships |
| 2026-01-03 | Moved to docs/data/, integrated ontology-data.ts and knowledge-graph-data.ts insights                                                                                |
| 2026-01-03 | Created with consolidated findings from MFL transcript investigation                                                                                                 |
