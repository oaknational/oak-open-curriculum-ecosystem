# Bulk Download vs API Comparison

**Date**: 2025-12-30
**Status**: Strategic Analysis Complete
**Purpose**: Inform bulk-first ingestion strategy decision

---

## Executive Summary

A deep dive comparison of the Oak bulk download data against the live API reveals significant structural differences. The bulk download is **richer in content** (transcripts, metadata) but **poorer in structure** (no tier information, no unit options). The optimal strategy is a **hybrid approach**: bulk download as primary data source with API for supplementary structural data.

---

## Key Findings

### 1. Transcript Availability

| Source | Coverage | Notes |
|--------|----------|-------|
| **Bulk Download** | ~81.9% overall | Most subjects 96-100%; MFL/PE sparse (missing often `"NULL"`) |
| **Live API** | ~16% (maths only) | TPC-filtered; other subjects return 404/500 |

**Winner**: Bulk download is the authoritative source for transcripts, with explicit handling for MFL/PE sparsity.

### 2. Tier Information (Maths KS4)

| Source | Coverage | Notes |
|--------|----------|-------|
| **Bulk Download** | ❌ None | 373 lessons duplicated with identical data |
| **Live API** | ✅ Complete | Via `/sequences/{seq}/units` with `tiers[]` structure |

**Critical gap**: The bulk download cannot distinguish between foundation and higher tier. Both tiers contain identical lesson entries with no discriminator field.

**Example of the problem**:
```json
// Bulk download: Two identical entries for the same lesson
{ "lessonSlug": "changing-the-subject...", "unitSlug": "algebraic-fractions" }
{ "lessonSlug": "changing-the-subject...", "unitSlug": "algebraic-fractions" }
// No fields differ between entries!
```

### 3. Exam Board Information

| Source | Coverage | Notes |
|--------|----------|-------|
| **Bulk Download** | ✅ Partial | `examBoards` on units (with duplicates in science) |
| **Live API** | ✅ Complete | Via `ks4Options` on sequences |

The bulk download has exam board data on units, though science data contains duplicates (e.g., 4× AQA entries instead of 1).

### 4. Exam Subject Information (Science KS4)

| Source | Coverage | Notes |
|--------|----------|-------|
| **Bulk Download** | ✅ Present | `subjectSlug`: biology, chemistry, physics, combined-science |
| **Live API** | ✅ Present | Same structure |

Both sources correctly identify exam subjects at KS4 via the `subjectSlug` field.

### 5. Unit Options

| Source | Coverage | Notes |
|--------|----------|-------|
| **Bulk Download** | ❌ None | No `unitOptions` field present |
| **Live API** | ✅ Complete | Via `/sequences/{seq}/units` with `unitOptions[]` |

Geography, English, and History have unit options (alternative unit choices) that are **only available via API**. Art, D&T, and RE also expose `unitOptions[]` in the API, even where bulk duplicates are not present.

### 6. Metadata Fields

| Field | Bulk Download | API |
|-------|---------------|-----|
| `lessonTitle` | ✅ | ✅ |
| `lessonSlug` | ✅ | ✅ (in URL path) |
| `unitSlug` | ✅ | ✅ |
| `unitTitle` | ✅ | ✅ |
| `keyStageSlug` | ✅ | ✅ |
| `keyStageTitle` | ✅ | ✅ |
| `subjectSlug` | ✅ | ✅ |
| `subjectTitle` | ✅ | ✅ |
| `yearSlug` (on lesson) | ❌ | ❌ |
| `yearSlug` (on unit) | ✅ | ✅ |
| `lessonKeywords` | ✅ | ✅ |
| `keyLearningPoints` | ✅ | ✅ |
| `misconceptionsAndCommonMistakes` | ✅ | ✅ |
| `pupilLessonOutcome` | ✅ | ✅ |
| `teacherTips` | ✅ | ✅ |
| `contentGuidance` | ✅ ("NULL" string) | ✅ (JSON null) |
| `supervisionLevel` | ✅ ("NULL" string) | ✅ (JSON null) |
| `downloadsAvailable` | ✅ (as `downloadsavailable`) | ✅ |
| `canonicalUrl` | ❌ | ✅ |
| `phaseSlug` | ❌ | ✅ |
| `categories` (on unit) | ❌ | ✅ |
| `transcript_sentences` | ✅ | Via separate endpoint |
| `transcript_vtt` | ✅ (WebVTT format) | Via separate endpoint |

---

## Bulk Download Structure

```
{
  "sequenceSlug": "english-primary",
  "subjectTitle": "English",
  "sequence": [                    // Array of units
    {
      "unitSlug": "...",
      "unitTitle": "...",
      "yearSlug": "year-5",
      "year": 5,
      "keyStageSlug": "ks2",
      "examBoards": [...],         // On secondary only
      "threads": [...],
      "unitLessons": [...]
    }
  ],
  "lessons": [                     // Flat array of all lessons
    {
      "lessonSlug": "...",
      "lessonTitle": "...",
      "unitSlug": "...",           // For joining to unit
      "transcript_sentences": "...",
      "transcript_vtt": "WEBVTT\n..."
    }
  ]
}
```

### Data Quality Issues in Bulk Download

1. **Null value encoding**: Uses string `"NULL"` instead of JSON `null` for `contentGuidance` and `supervisionLevel`

2. **Typo in field name**: Uses `downloadsavailable` (lowercase) instead of `downloadsAvailable`

3. **Unit option duplicates**: English (47), Geography (67), History (25) duplicate lesson entries with no context fields

4. **Maths tier duplicates**: 373 lessons × 2 = 746 entries with no distinguishing fields

5. **Science exam board duplicates**: `examBoards` array contains duplicates (e.g., 4× AQA entries)

---

## Strategic Implications

### Recommended Hybrid Approach

```
┌─────────────────────────────────────────────────────────────────┐
│                    INGESTION STRATEGY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PRIMARY: Bulk Download                                          │
│  ├── Lesson enumeration (complete list)                          │
│  ├── Transcript content (~81.9% coverage; MFL/PE sparse)          │
│  ├── Keywords, learning points, misconceptions                   │
│  ├── Teacher tips, pupil outcomes                                │
│  ├── Exam boards (from unit `examBoards`)                        │
│  └── Exam subjects (from `subjectSlug`)                          │
│                                                                  │
│  SUPPLEMENTARY: API                                              │
│  ├── Tier information for Maths KS4                              │
│  │   └── Via `/sequences/maths-secondary/units`                  │
│  ├── Unit options for Geography/English                          │
│  │   └── Via `/sequences/{seq}/units` with `unitOptions`         │
│  └── Phase and categories (if needed)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Considerations

1. **Maths Tier Handling**: Must call API's `/sequences/maths-secondary/units` endpoint to determine which tier each lesson belongs to. The bulk download duplicates cannot be resolved without this.

2. **Deduplication Strategy**: 
   - For maths: Dedupe by `(lessonSlug, tier)` after enriching with API tier data
   - For science: Dedupe by `(lessonSlug, subjectSlug)` using bulk data
   - For exam boards: Aggregate all boards per lesson from unit data

3. **Year Derivation**: Neither source has `yearSlug` on lessons. Must join through unit → year.

4. **Null Value Normalization**: Convert `"NULL"` strings to proper nulls during parsing.

---

## Video Availability Detection: Obsolete

With a bulk-first approach, the video availability detection code (`video-availability.ts`, ADR-091) becomes **obsolete**:

1. **Bulk download already has transcripts** — no need to check if API will return 404
2. **For subjects without transcripts** (MFL, PE), we know this statically from the data
3. **The optimization provided minimal value** — even with detection, transcript API returns 404 for non-maths

**Recommendation**: Remove `video-availability.ts` and related ADR-091 implementation as part of bulk-first transition.

---

## Files for Reference

| File | Purpose |
|------|---------|
| `apps/.../bulk-downloads/` | **Active data** — 30 JSON files (2025-12-30) |
| `apps/.../scripts/download-bulk.ts` | Download script |
| `reference/bulk_download_data/.../` | Reference copy (2025-12-07) |
| `.agent/analysis/transcript-availability-analysis.md` | Transcript coverage details |
| `.agent/analysis/curriculum-structure-analysis.md` | 7 structural patterns documented |

**Note**: RSHE-PSHE bulk files are NOT available despite being listed on the website. Verified 2025-12-30. System returns 422 Unprocessable Content for RSHE-PSHE requests.

---

## ADR Updates Needed

The following ADRs should be updated to reflect bulk-first strategy:

| ADR | Update Needed |
|-----|---------------|
| **ADR-091** | Add note that this optimization is obsolete with bulk-first approach |
| **ADR-083** | Add bulk download as alternative complete enumeration source |
| **New ADR** | Document bulk-first ingestion strategy and hybrid approach |

See `docs/architecture/architectural-decisions/README.md` for ADR registry.

---

## Verification Commands

```bash
# Analyze bulk download structure
cd reference/bulk_download_data/oak-bulk-download-2025-12-30T16_07_45.986Z
python3 -c "import json; d=json.load(open('english-primary.json')); print(list(d.keys()))"

# Count transcripts
python3 -c "
import json
d = json.load(open('maths-secondary.json'))
has = sum(1 for l in d['lessons'] if l.get('transcript_sentences') not in (None, '', 'NULL'))
print(f'{has}/{len(d[\"lessons\"])} lessons have transcripts')
"

# Check for tier fields
python3 -c "
import json
d = json.load(open('maths-secondary.json'))
fields = [k for k in d['lessons'][0].keys() if 'tier' in k.lower()]
print(f'Tier-related fields: {fields}')
"
```

---

## Related Documents

- [Transcript Availability Analysis](transcript-availability-analysis.md)
- [Curriculum Structure Analysis](curriculum-structure-analysis.md)
- [ADR-091: Video Availability Detection](../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md)
- [ADR-083: Complete Lesson Enumeration](../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)
