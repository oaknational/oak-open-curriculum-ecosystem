# Curriculum Structure Analysis

**Status**: COMPLETE — Comprehensive analysis verified 2025-12-28  
**Date**: 2025-12-28  
**Purpose**: Document all structural patterns across ALL 17 subjects and ALL 4 key stages

---

## Executive Summary

The Oak National Academy curriculum API has **7 distinct structural patterns** that require different traversal strategies. This document provides a comprehensive analysis to inform:

1. Ingestion pipeline design
2. Ontology redesign discussions
3. Upstream API enhancement requests

**Key Finding**: A single universal traversal algorithm is NOT possible. The pipeline must detect and handle different patterns based on subject and key stage.

**Subjects Verified**: All 17 (art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish)

**Key Stages Verified**: All 4 (KS1, KS2, KS3, KS4)

---

## Structural Patterns

### Pattern 1: Simple Flat Structure (Primary)

**Applies to**: All subjects at KS1-KS2

**Structure**:
```
subject → sequence → year → units[] → lessons[]
```

**Characteristics**:
- No exam boards, tiers, or exam subjects
- 1:1 mapping of lesson to unit
- No duplicates

**Subjects**: 15 of 17 subjects have primary content:

| Have Primary | No Primary |
|--------------|------------|
| art, computing, cooking-nutrition, design-technology, english, french, geography, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish | citizenship, german |

**Note**: French and Spanish start at KS2 only (no KS1 content).

**Example**: `maths-primary`, `science-primary`

---

### Pattern 2: Simple Flat Structure (Secondary KS3)

**Applies to**: Most subjects at KS3

**Structure**:
```
subject → sequence → year → units[] → lessons[]
```

**Characteristics**:
- Same as Pattern 1
- No KS4 complexity yet

**Subjects**: All except science (see Pattern 5)

---

### Pattern 3: Tier Variants (Maths KS4)

**Applies to**: `maths-secondary` at KS4 (Years 10-11)

**API Structure**:
```
subject → sequence → year → tiers[] → units[] → lessons[]
```

**Bulk Download Structure**:
- **No tier field** on lessons or units
- Units duplicated with different lesson lists (foundation subset of higher)
- Lessons duplicated (373 lessons × 2 = 746 entries for 862 unique lessons)

**API Response Example** (Year 10):
```json
{
  "year": 10,
  "tiers": [
    { "tierSlug": "foundation", "units": [...] },
    { "tierSlug": "higher", "units": [...] }
  ]
}
```

**Ingestion Impact**:
- Must query via sequences endpoint
- Must extract tier from response structure, not from lesson/unit fields
- Must deduplicate lessons while preserving tier association

---

### Pattern 4: Exam Board Variants

**Applies to**: Secondary subjects with `ks4Options` containing exam boards

**Subjects with Exam Boards**:
| Subject | Exam Boards |
|---------|-------------|
| english | AQA, Edexcel, Eduqas |
| science | AQA, Edexcel, OCR |
| geography | AQA, Edexcel B |
| history | AQA, Edexcel |
| french | AQA, Edexcel |
| spanish | AQA, Edexcel |
| german | AQA, Edexcel |
| music | AQA, Edexcel, Eduqas, OCR |
| PE | AQA, Edexcel, OCR, Core, GCSE |
| RE | AQA, Edexcel B, Eduqas, Core |
| computing | AQA, OCR, Core, GCSE |
| citizenship | Core, GCSE |

**Structure**:
```
subject → sequence-{board} → year → units[] → lessons[]
```

**API Response Example** (Geography AQA Year 10):
```json
{
  "year": 10,
  "units": [
    { "unitSlug": "geographical-skills", ... },
    { "unitSlug": "natural-and-tectonic-hazards", ... }
  ]
}
```

**Ingestion Impact**:
- Must query each exam board sequence separately
- Same lesson may appear in multiple sequences
- Must aggregate exam boards per lesson

---

### Pattern 5: Exam Subject Split (Science KS4)

**Applies to**: `science-secondary-*` at KS4 (Years 10-11) only

**Structure**:
```
subject → sequence-{board} → year → examSubjects[] → tiers[] → units[] → lessons[]
```

**API Response Example** (Science AQA Year 10):
```json
{
  "year": 10,
  "examSubjects": [
    {
      "examSubjectSlug": "biology",
      "tiers": [
        { "tierSlug": "foundation", "units": [...] },
        { "tierSlug": "higher", "units": [...] }
      ]
    },
    { "examSubjectSlug": "chemistry", "tiers": [...] },
    { "examSubjectSlug": "physics", "tiers": [...] },
    { "examSubjectSlug": "combined-science", "tiers": [...] }
  ]
}
```

**Bulk Download Structure**:
- Lessons have `subjectSlug` = `biology`, `chemistry`, `physics`, or `combined-science`
- NOT `science` at KS4

**Critical**: The subject enum in the API only contains `science`, not the exam subjects. These are ONLY accessible via the sequences endpoint with nested traversal.

**Ingestion Impact**:
- Cannot use `/key-stages/ks4/subject/science/lessons` (returns empty)
- Must query sequences, then traverse examSubjects, then tiers, then units
- Must track exam subject as metadata (not top-level subject)

---

### Pattern 6: Unit Options (Specialisms/Choices)

**Applies to**: Art, Design-Technology, English, Geography, History, Religious-Education at KS4

**Structure**:

```text
subject → sequence → year → units[] where unit has unitOptions[]
```

**Subjects with unitOptions (verified 2025-12-28)**:

| Subject | Unit Options Examples | Bulk Duplicates |
|---------|----------------------|-----------------|
| Art | Fine Art, Photography, Textiles, 3D Design, Graphic Comms | 0 |
| Design-Technology | Papers/boards, Polymers/timbers, Textiles | 0 |
| English | Animal Farm, Inspector Calls, Macbeth, etc. | 26 |
| Geography | Coastal, River, Glacial landscapes | 67 |
| History | Battle of Hastings, Durham Cathedral, etc. | 0 |
| Religious-Education | Buddhism vs Islam beliefs/practices | 0 |

**API Response Example** (English AQA Year 10):

```json
{
  "unitTitle": "Modern text: first study",
  "unitOptions": [
    { "unitTitle": "Animal Farm: the pigs and power", "unitSlug": "modern-text-first-study-5139" },
    { "unitTitle": "An Inspector Calls: power and responsibility", "unitSlug": "modern-text-first-study-4896" },
    { "unitTitle": "Leave Taking: a sense of belonging", "unitSlug": "modern-text-first-study-198" }
  ]
}
```

**Bulk Download Impact**:

- Lessons appear in multiple unit variants (different unit slugs, same lesson)
- English: 26 duplicate lesson entries
- Geography: 67 duplicate lesson entries
- Art, D&T, History, RE: No bulk duplicates despite having unitOptions (lessons unique to each option)

**Ingestion Impact**:

- Lessons may belong to multiple units (different text/topic options)
- Must aggregate `unit_ids` as array, not deduplicate

---

### Pattern 7: No KS4 Content

**Applies to**: Cooking-nutrition only

**Characteristic**: Secondary sequence only covers KS3 (Years 7-9), no Years 10-11 content.

**Ingestion Impact**: Skip KS4 traversal entirely for this subject.

---

## Data Analysis Summary

### Bulk Download Analysis (Complete — All 30 Files)

| File | Raw Lessons | Unique Lessons | Duplicates | Cause |
|------|-------------|----------------|------------|-------|
| art-primary | 214 | 214 | 0 | — |
| art-secondary | 189 | 189 | 0 | — |
| citizenship-secondary | 318 | 318 | 0 | — |
| computing-primary | 180 | 180 | 0 | — |
| computing-secondary | 348 | 348 | 0 | — |
| cooking-nutrition-primary | 72 | 72 | 0 | — |
| cooking-nutrition-secondary | 36 | 36 | 0 | — |
| design-technology-primary | 144 | 144 | 0 | — |
| design-technology-secondary | 216 | 216 | 0 | — |
| english-primary | 1,516 | 1,516 | 0 | — |
| english-secondary | 1,035 | 1,009 | **26** | Unit options |
| french-primary | 105 | 105 | 0 | — |
| french-secondary | 417 | 417 | 0 | — |
| geography-primary | 223 | 223 | 0 | — |
| geography-secondary | 527 | 460 | **67** | Unit options |
| german-secondary | 411 | 411 | 0 | — |
| history-primary | 216 | 216 | 0 | — |
| history-secondary | 468 | 468 | 0 | — |
| maths-primary | 1,072 | 1,072 | 0 | — |
| maths-secondary | 1,235 | 862 | **373** | Tier variants |
| music-primary | 216 | 216 | 0 | — |
| music-secondary | 218 | 218 | 0 | — |
| physical-education-primary | 432 | 432 | 0 | — |
| physical-education-secondary | 560 | 560 | 0 | — |
| religious-education-primary | 216 | 216 | 0 | — |
| religious-education-secondary | 396 | 396 | 0 | — |
| science-primary | 390 | 390 | 0 | — |
| science-secondary | 888 | 887 | **1** | Cross-unit |
| spanish-primary | 112 | 112 | 0 | — |
| spanish-secondary | 413 | 413 | 0 | — |
| **TOTAL** | **12,783** | **12,316** | **467** | — |

**Note**: RSHE-PSHE has no bulk download file (API only).

### Subject Split at KS4

Only `science-secondary.json` contains lessons with **different subject slugs** than the file name:

| Key Stage | Subject Slugs in lessons[] |
|-----------|---------------------------|
| KS3 | `science` only |
| KS4 | `biology`, `chemistry`, `physics`, `combined-science` |

This is **unique to science** — no other subject has this split.

---

## Traversal Strategy

### Universal Algorithm (NOT POSSIBLE)

A single traversal cannot handle all patterns because:

1. **Tier nesting varies**: Maths has tiers, most subjects don't
2. **Exam subjects exist only in science**: Requires special handling
3. **Unit options create duplicates**: Must aggregate, not deduplicate

### Required Strategy: Pattern Detection

```typescript
async function traverseSubject(subject: string, keyStage: string) {
  const sequences = await getSequencesForSubject(subject);
  
  for (const sequence of sequences) {
    const yearsForKeyStage = getYearsForKeyStage(sequence, keyStage);
    
    for (const year of yearsForKeyStage) {
      const response = await getSequenceUnits(sequence.slug, year);
      
      // Pattern detection based on response structure
      if (hasExamSubjects(response)) {
        // Pattern 5: Science KS4
        traverseExamSubjectsWithTiers(response);
      } else if (hasTiers(response)) {
        // Pattern 3: Maths KS4
        traverseTiersWithUnits(response);
      } else if (hasUnitOptions(response)) {
        // Pattern 6: English/Geography unit options
        traverseUnitsWithOptions(response);
      } else {
        // Patterns 1, 2, 4: Simple flat structure
        traverseSimpleUnits(response);
      }
    }
  }
}
```

### Detection Functions

```typescript
function hasExamSubjects(response: SequenceUnitsResponse): boolean {
  return response.data.some(year => 'examSubjects' in year);
}

function hasTiers(response: SequenceUnitsResponse): boolean {
  return response.data.some(year => 'tiers' in year);
}

function hasUnitOptions(response: SequenceUnitsResponse): boolean {
  return response.data.some(year => 
    year.units?.some(unit => 'unitOptions' in unit)
  );
}
```

---

## Aggregation Requirements

### Lesson-Level Aggregations

Each lesson document should contain arrays for:

| Field | Description | Pattern(s) |
|-------|-------------|------------|
| `unit_ids` | All units this lesson belongs to | Pattern 6 (options) |
| `tiers` | Foundation, Higher, or both | Patterns 3, 5 |
| `exam_boards` | AQA, Edexcel, etc. | Patterns 4, 5 |
| `exam_subjects` | Biology, Chemistry, etc. | Pattern 5 only |

### Unit-Level Aggregations

Each unit document should contain:

| Field | Description |
|-------|-------------|
| `tiers` | Which tiers include this unit |
| `exam_boards` | Which exam board sequences include this unit |
| `is_option_of` | Parent unit if this is a unit option |

---

## API Enhancement Requests

### High Priority

1. **Add tier field to lesson/unit resources**
   - Currently only derivable from sequence traversal
   - Maths KS4 lessons have no tier in bulk download

2. **Expose exam subjects as subjects in the API**
   - `biology`, `chemistry`, `physics`, `combined-science` should be queryable as subjects
   - OR document that KS4 science requires sequence traversal

### Medium Priority

3. **Add `unitOptions` indicator to unit summary**
   - Currently only visible in sequence response
   - Would help consumers understand lesson deduplication

4. **Standardize bulk download subject slugs**
   - Science KS4 uses different slugs than the API
   - Creates confusion for consumers

---

## Related Documents

- [ADR-080: KS4 Metadata Denormalisation Strategy](../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)
- [ADR-083: Complete Lesson Enumeration Strategy](../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)
- [Upstream API Wishlist](./external/ooc-api-wishlist/00-overview-and-known-issues.md)

