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
