# Bulk Download Examples

These examples mirror the bulk download data integrity issues listed in `00-overview-and-known-issues.md`.

## Example 1: Title fields null despite slug fields populated

```json
{
  "yearTitle": null,
  "yearSlug": "year-7",
  "keyStageTitle": null,
  "keyStageSlug": "ks3",
  "subjectTitle": null,
  "subjectSlug": null,
  "unitTitle": "Place value",
  "unitSlug": "place-value"
}
```

**Desired**

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

## Example 2: Missing tier metadata for KS4 variants (maths-secondary)

**Unit-level duplicates**

```json
{
  "unitSlug": "algebraic-fractions",
  "unitLessons": [/* 8 lessons in higher */]
}
```

**Desired (unit level)**

```json
{
  "unitSlug": "algebraic-fractions",
  "tier": "higher",
  "tierSlug": "higher",
  "unitLessons": [/* 8 lessons */]
}
```

**Desired (lesson level)**

```json
{
  "lessonSlug": "solving-complex-quadratic-equations-by-completing-the-square",
  "tiers": ["foundation", "higher"]
}
```

## Example 3: Missing lesson record referenced by unit lessons

```json
{
  "unitLessons": [
    { "lessonSlug": "further-demonstrating-of-pythagoras-theorem", "state": "new" }
  ],
  "lessons": [
    // lessonSlug missing from lessons[]
  ]
}
```

## Example 4: Inconsistent null semantics for content guidance and supervision

```json
{
  "contentGuidance": "NULL",
  "supervisionLevel": "NULL"
}
```

**Desired**

```json
{
  "contentGuidance": [],
  "supervisionLevel": null
}
```

## Example 5: Missing transcripts in maths primary

```json
{
  "lessonSlug": "composition-of-decade-numbers-to-100-making-groups-of-10",
  "transcript_sentences": null,
  "transcript_vtt": null
}
```

## Example 6: Missing threads and empty descriptions on secondary units

```json
{
  "unitSlug": "maths-and-the-environment",
  "threads": [],
  "description": ""
}
```

## Example 7: KS4 science bulk slugs vs API access paths

```json
{
  "bulkSubjectSlug": "biology",
  "apiAccessPath": "sequences/science-secondary-{board}/units -> examSubjects[slug=biology]"
}
```

---

## Bulk Download Completeness Examples (2025-12-30)

These examples relate to the enhancement requests (ER4-ER8) in `00-overview-and-known-issues.md`.

## Example 8: Missing RSHE-PSHE bulk file (ER4)

**Status**: 🔴 CONFIRMED MISSING (2025-12-30)

The Oak Bulk Download UI shows RSHE-PSHE as available, but the API does NOT return these files.

**Current** (fresh download 2025-12-30):

```text
bulk-downloads/
├── art-primary.json
├── art-secondary.json
├── ...
├── rshe-pshe-primary.json    ← MISSING (not returned by API)
├── rshe-pshe-secondary.json  ← MISSING (not returned by API)
├── ...
└── spanish-secondary.json
```

**Files returned**: 30 (all subjects except RSHE-PSHE)
**Files expected**: 32

**Requested**: Include RSHE-PSHE files in the `/api/bulk` response

## Example 9: Missing tier field for maths KS4 (ER5)

**Current** (lessons[] array has exact duplicates):

```json
{
  "lessons": [
    {
      "lessonSlug": "solving-complex-quadratic-equations",
      "unitSlug": "quadratic-equations"
      // NO tier field - appears twice, identical entries
    },
    {
      "lessonSlug": "solving-complex-quadratic-equations",
      "unitSlug": "quadratic-equations"
      // Exact duplicate - no way to distinguish foundation vs higher
    }
  ]
}
```

**Desired** (option A - single entry with tiers array):

```json
{
  "lessons": [
    {
      "lessonSlug": "solving-complex-quadratic-equations",
      "unitSlug": "quadratic-equations",
      "tiers": ["foundation", "higher"]
    }
  ]
}
```

**Desired** (option B - separate entries with tier field):

```json
{
  "lessons": [
    {
      "lessonSlug": "solving-complex-quadratic-equations",
      "unitSlug": "quadratic-equations",
      "tier": "foundation"
    },
    {
      "lessonSlug": "solving-complex-quadratic-equations",
      "unitSlug": "quadratic-equations",
      "tier": "higher"
    }
  ]
}
```

## Example 10: Missing unit options (ER6)

**Current** (geography-secondary.json):

```json
{
  "unitSlug": "fieldwork-human-geography",
  "unitTitle": "Fieldwork - Human Geography"
  // NO unitOptions field
}
```

**Desired**:

```json
{
  "unitSlug": "fieldwork-human-geography",
  "unitTitle": "Fieldwork - Human Geography",
  "unitOptions": [
    {
      "unitSlug": "fieldwork-physical-geography",
      "unitTitle": "Fieldwork - Physical Geography"
    }
  ]
}
```

## Example 11: Missing yearSlug on lessons (ER7)

**Current**:

```json
{
  "lessonSlug": "adding-fractions-with-same-denominator",
  "unitSlug": "fractions"
  // NO yearSlug - must derive from unit
}
```

**Desired**:

```json
{
  "lessonSlug": "adding-fractions-with-same-denominator",
  "unitSlug": "fractions",
  "yearSlug": "year-4",
  "yearTitle": "Year 4"
}
```

## Example 12: Missing exam board on science KS4 lessons (ER8)

**Current**:

```json
{
  "lessonSlug": "photosynthesis-part-1",
  "unitSlug": "photosynthesis-and-cellular-respiration"
  // NO examBoard - must derive from unit
}
```

**Desired**:

```json
{
  "lessonSlug": "photosynthesis-part-1",
  "unitSlug": "photosynthesis-and-cellular-respiration",
  "examBoards": ["aqa", "edexcel", "ocr"],
  "examSubject": "biology",
  "tier": "higher"
}
```
