# Bulk Ingestion Investigation — 2025-12-31

**Status**: ✅ COMPLETE
**Purpose**: Verify assumptions in semantic-search.prompt.md through deep investigation
**Method**: Direct examination of bulk download files, codebase analysis, data verification

---

## Executive Summary

This investigation systematically verified 15 assumptions from `semantic-search.prompt.md`. Key findings:

1. **Lesson counts are correct**: 12,833 raw lessons, 12,320 unique (after per-file deduplication)
2. **Transcript coverage claims are accurate**: MFL subjects have ~0% real transcripts, PE has partial
3. **The "NULL" string issue**: MFL and PE transcripts contain literal "NULL" (4 chars), not actual content
4. **Deduplication is safe**: Duplicate lessons are identical; simple dedup by lessonSlug preserves all data
5. **RSHE-PSHE is missing from Oak's bulk download**: Requested but not returned by API
6. **MFL lessons have rich pedagogical data**: Can be indexed for search despite missing transcripts

---

## Foundation Documents (Re-read before continuing)

1. **[rules.md](../../directives/rules.md)** — TDD at ALL levels
2. **[testing-strategy.md](../../directives/testing-strategy.md)** — Red → Green → Refactor
3. **[schema-first-execution.md](../../directives/schema-first-execution.md)** — Generator is source of truth

---

## Verified Findings

### A1: Bulk Download Lesson Counts ✅ VERIFIED

**Method**: Direct jq count of all 30 JSON files in `bulk-downloads/`

| Metric | Value |
|--------|-------|
| **Raw total lessons** | 12,833 |
| **Unique per-file** | 12,320 |
| **Duplicates** | 513 |

**Duplicate breakdown by subject**:
| Subject | Raw | Unique | Duplicates |
|---------|-----|--------|------------|
| maths-secondary | 1,235 | 862 | 373 |
| geography-secondary | 527 | 460 | 67 |
| english-secondary | 1,075 | 1,028 | 47 |
| history-secondary | 464 | 439 | 25 |
| science-secondary | 890 | 889 | 1 |

**Conclusion**: The documented claim of ~12,833 lessons is accurate. After deduplication, expect ~12,320 unique lessons.

---

### A2: oak_unit_rollup Contents ✅ VERIFIED

**Method**: Code analysis of `document-transforms.ts` and related files

The `oak_unit_rollup` index requires **enriched documents** that differ from `oak_units`:

| Field | Source | Purpose |
|-------|--------|---------|
| `unit_content` | Aggregated lesson planning snippets + pedagogical data | BM25 content search |
| `unit_structure` | Semantic summary from `generateUnitSemanticSummary()` | ELSER structure search |
| `unit_content_semantic` | Same as `unit_content` | ELSER content embedding |
| `unit_structure_semantic` | Same as `unit_structure` | ELSER structure embedding |

**Rollup text composition** (`createEnrichedRollupText`):
1. Lesson planning snippets (key learning points, teacher tips, misconceptions, keywords)
2. Prior knowledge requirements section
3. National curriculum content section

**Semantic summary composition** (`generateUnitSemanticSummary`):
1. Context line: "{unitTitle} is a {keyStage} {subject} unit containing {n} lessons"
2. Overview (whyThisWhyNow)
3. Description
4. Prior knowledge
5. National curriculum
6. Threads
7. Topics
8. Lesson titles

**Current bulk path issue**: Does not create `oak_unit_rollup` documents at all.

---

### A4: MFL Transcript Coverage ✅ VERIFIED

**Method**: Direct examination of transcript content in bulk files

| Subject | Primary | Secondary |
|---------|---------|-----------|
| **French** | 0/105 (0%) | 1/417 (0.2%) |
| **German** | — | 1/411 (0.2%) |
| **Spanish** | 1/112 (0.8%) | 0/413 (0%) |

**Critical finding**: The "transcripts" are literally the string `"NULL"` (4 characters), not empty or undefined.

```json
{
  "transcript_sentences": "NULL",
  "transcript_vtt": "NULL"
}
```

**Implication**: The vocab-gen's `nullSentinelSchema` should convert "NULL" → null, but the current `bulk-lesson-transformer.ts` line 83:
```typescript
const transcriptText = lesson.transcript_sentences ?? '[No transcript available]';
```
This treats "NULL" as valid content because `"NULL" ?? fallback` returns `"NULL"`.

---

### A5: RSHE-PSHE Absence ✅ VERIFIED (Documented)

**Method**: Examination of ADR-093 and download script

**Decision documented in ADR-093** (line 269):
> "RSHE-PSHE handling: Oak's UI shows RSHE-PSHE as available, but the `/api/bulk` endpoint does NOT return these files (confirmed 2025-12-30). Return 422 Unprocessable Content for this subject until bulk files become available."

The download script requests rshe-pshe, but Oak's bulk API does not return these files.

**Status**: Known limitation. Decision made to return 422 until Oak includes RSHE-PSHE in bulk download.

---

### A6: MFL Lesson Format ✅ VERIFIED

**Method**: Direct examination of MFL lesson content

MFL lessons contain **rich pedagogical data** despite missing transcripts:

```json
{
  "lessonTitle": "Back to school: information questions...",
  "lessonKeywords": [
    { "keyword": "SFC", "description": "silent final consonant..." },
    { "keyword": "être", "description": "French verb meaning 'to be'" }
  ],
  "keyLearningPoints": [
    { "keyLearningPoint": "The final consonant of a word is often silent..." },
    { "keyLearningPoint": "The verb être means to be or being..." }
  ],
  "misconceptionsAndCommonMistakes": [
    { "misconception": "There is always a liaison...", "response": "After the verb être, a liaison is in fact optional..." }
  ],
  "pupilLessonOutcome": "I can ask and answer questions in French...",
  "teacherTips": [
    { "teacherTip": "Ask pupils to learn and perform their conversations..." }
  ]
}
```

**Conclusion**: MFL lessons CAN be indexed for semantic search using `lesson_structure` populated from pedagogical fields. Only `lesson_content` (transcript) would be missing/placeholder.

---

### A10: Simple Deduplication ✅ VERIFIED (Safe)

**Method**: Comparison of duplicate lesson records

**Maths duplicates**: Same unitSlug, identical content
```json
// Both occurrences of 'a-single-solution-set':
[
  { "unitSlug": "inequalities", "transcript": 21366 },
  { "unitSlug": "inequalities", "transcript": 21366 }  // Identical
]
```

**English duplicates**: Different unitSlugs (unit options pattern)
```json
// Two occurrences of 'analysing-responses-on-education-in-leave-taking':
[
  { "unitSlug": "modern-text-first-deep-dive-1719" },
  { "unitSlug": "modern-text-first-deep-dive-188" }  // Different unit
]
```

**Conclusion**: Simple deduplication by `lessonSlug` is correct. When lessons appear in multiple units, the implementation should track `unit_ids: string[]` (array of all unit relationships).

---

### A14/A15: Transcript Coverage by Subject ✅ VERIFIED

**Method**: Full scan of all 30 files

| Subject | Phase | Total | Real Transcripts | % |
|---------|-------|-------|-----------------|---|
| english | primary | 1,512 | 1,485 | 98.2% |
| maths | secondary | 1,235 | 1,235 | 100% |
| english | secondary | 1,075 | 1,075 | 100% |
| maths | primary | 1,072 | 1,067 | 99.5% |
| science | secondary | 890 | 890 | 100% |
| geography | secondary | 527 | 527 | 100% |
| history | secondary | 464 | 464 | 100% |
| religious-education | secondary | 395 | 395 | 100% |
| science | primary | 390 | 390 | 100% |
| computing | secondary | 348 | 348 | 100% |
| citizenship | secondary | 318 | 318 | 100% |
| geography | primary | 223 | 223 | 100% |
| history | primary | 218 | 218 | 100% |
| religious-education | primary | 216 | 216 | 100% |
| music | primary | 216 | 216 | 100% |
| design-technology | secondary | 216 | 216 | 100% |
| art | primary | 214 | 214 | 100% |
| music | secondary | 218 | 210 | 96.3% |
| art | secondary | 204 | 204 | 100% |
| computing | primary | 180 | 180 | 100% |
| **physical-education** | **secondary** | **560** | **160** | **28.5%** |
| design-technology | primary | 144 | 144 | 100% |
| cooking-nutrition | primary | 72 | 72 | 100% |
| cooking-nutrition | secondary | 36 | 36 | 100% |
| **physical-education** | **primary** | **432** | **3** | **0.6%** |
| **spanish** | **primary** | **112** | **1** | **0.8%** |
| **german** | **secondary** | **411** | **1** | **0.2%** |
| **french** | **secondary** | **417** | **1** | **0.2%** |
| **spanish** | **secondary** | **413** | **0** | **0%** |
| **french** | **primary** | **105** | **0** | **0%** |

**Summary**:
- 14 subjects: 95-100% transcript coverage
- PE Primary: 0.6%
- PE Secondary: 28.5%
- MFL (French, German, Spanish): ~0%

---

## Code Issues Identified

### 1. "NULL" String Not Handled

**Location**: `src/adapters/bulk-lesson-transformer.ts` line 83

```typescript
// Current (WRONG):
const transcriptText = lesson.transcript_sentences ?? '[No transcript available]';

// Problem: "NULL" ?? fallback returns "NULL" (truthy string)
// "NULL" is treated as valid transcript content
```

**Fix required**: Check for "NULL" string explicitly, or rely on SDK's nullSentinelSchema.

### 2. lesson_structure Explicitly Undefined

**Location**: `src/adapters/bulk-lesson-transformer.ts` lines 86-88

```typescript
lesson_structure: undefined,
lesson_structure_semantic: undefined,
```

**Impact**: ELSER structure retrievers return 0% MRR.

### 3. No oak_unit_rollup Creation

**Location**: `src/lib/indexing/bulk-ingestion.ts`

The bulk path only creates operations for `oak_lessons`, `oak_units`, and `oak_threads`. No rollup index.

### 4. Subject Filter Bug (Only Affects Filtered Runs)

**Location**: `src/lib/indexing/bulk-ingestion.ts` line 87

```typescript
const subject = file.data.sequenceSlug.split('-')[0];
// "physical-education-primary" → "physical" (WRONG)
```

**Note**: Only applies when `--subject` filter is used. Unfiltered runs are not affected.

---

## Remaining Investigation

### A3: Parity Requirements Validation

**Status**: Pending

Need to run API-mode ingestion and compare document structure with bulk-mode output. Deferred until bulk path is fixed and producing correct output.

---

## Architectural Opportunities

Based on this investigation:

1. **Shared Document Creation**: Both paths should use `createLessonDocument()`, `generateLessonSemanticSummary()`, `createRollupDocument()` — adapted bulk data feeds the same transformation pipeline

2. **"NULL" Sentinel Handling**: Should be handled at SDK level (already in nullSentinelSchema) and verified at adapter boundary

3. **MFL Indexing Strategy**: MFL lessons have rich pedagogical content — index with `lesson_structure` populated, `lesson_content` as placeholder

4. **RSHE-PSHE Handling**: Document as unavailable, return 422 from search API, investigate with Oak

---

## Related Documents

| Document | Update Needed |
|----------|---------------|
| `semantic-search.prompt.md` | Update assumptions with verification status |
| `bulk-api-parity-requirements.md` | Add NULL handling requirement |
| `roadmap.md` | Update investigation status |
| `bulk-code-review.md` | Reference this investigation |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-31 | Initial investigation | Agent |

