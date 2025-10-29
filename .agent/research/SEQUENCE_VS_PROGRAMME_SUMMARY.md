# Sequence vs Programme: Key Findings Summary

**Date**: 2025-10-28

**Purpose**: This document summarizes our analysis of the sequence vs programme distinction, combining evidence from the API, OWA sitemap, and production data.

---

## TL;DR

**Sequences and programmes are NOT the same thing.**

- **Sequence**: API's internal curriculum structure (broad, multi-context)
- **Programme**: OWA's user-facing view (specific, contextualized)
- **Relationship**: One sequence → multiple programmes

**Example**: `science-secondary-aqa` (sequence) generates **8 Year 10 programmes**:

- `biology-secondary-ks4-foundation-aqa`
- `biology-secondary-ks4-higher-aqa`
- `chemistry-secondary-ks4-foundation-aqa`
- `chemistry-secondary-ks4-higher-aqa`
- `combined-science-secondary-ks4-foundation-aqa`
- `combined-science-secondary-ks4-higher-aqa`
- `physics-secondary-ks4-foundation-aqa`
- `physics-secondary-ks4-higher-aqa`

---

## Evidence

### 1. API Data (`GET /subjects`)

From live API via MCP tools:

```json
{
  "subjectTitle": "Science",
  "subjectSlug": "science",
  "sequenceSlugs": [
    {
      "sequenceSlug": "science-secondary-aqa",
      "years": [7, 8, 9, 10, 11],
      "keyStages": [{ "keyStageSlug": "ks3" }, { "keyStageSlug": "ks4" }],
      "ks4Options": {
        "title": "AQA",
        "slug": "aqa"
      }
    }
  ]
}
```

**Key observations**:

- Sequence covers multiple years (7-11)
- Sequence covers multiple key stages (KS3 + KS4)
- No tier information at this level
- `ks4Options` only shows exam board, not tiers

### 2. OWA Sitemap (Production URLs)

From `https://www.thenational.academy/sitemap.xml`:

```plaintext
/teachers/programmes/biology-secondary-ks4-foundation-aqa/units
/teachers/programmes/biology-secondary-ks4-higher-aqa/units
/teachers/programmes/chemistry-secondary-ks4-foundation-aqa/units
/teachers/programmes/chemistry-secondary-ks4-higher-aqa/units
/teachers/programmes/combined-science-secondary-ks4-foundation-aqa/units
/teachers/programmes/combined-science-secondary-ks4-higher-aqa/units
/teachers/programmes/physics-secondary-ks4-foundation-aqa/units
/teachers/programmes/physics-secondary-ks4-higher-aqa/units

/teachers/programmes/maths-primary-ks1/units
/teachers/programmes/maths-primary-ks2/units
/teachers/programmes/maths-secondary-ks3/units
```

**Key observations**:

- Programme slugs include key stage (`ks1`, `ks2`, `ks3`, `ks4`)
- Programme slugs include tier for sciences (`foundation`, `higher`)
- Programme slugs include exam subject for KS4 sciences (`biology`, `chemistry`, etc.)
- Programme slugs include exam board (`aqa`, `ocr`, `edexcel`, `eduqas`)

### 3. Nested Tier Data (`GET /sequences/{sequence}/units?year=10`)

From `GET /sequences/science-secondary-aqa/units?year=10`:

```json
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
          "units": [...]
        },
        {
          "tierTitle": "Higher",
          "tierSlug": "higher",
          "units": [...]
        }
      ]
    },
    {
      "examSubjectTitle": "Chemistry",
      "examSubjectSlug": "chemistry",
      "tiers": [
        { "tierSlug": "foundation", "units": [...] },
        { "tierSlug": "higher", "units": [...] }
      ]
    },
    {
      "examSubjectTitle": "Combined science",
      "examSubjectSlug": "combined-science",
      "tiers": [
        { "tierSlug": "foundation", "units": [...] },
        { "tierSlug": "higher", "units": [...] }
      ]
    },
    {
      "examSubjectTitle": "Physics",
      "examSubjectSlug": "physics",
      "tiers": [
        { "tierSlug": "foundation", "units": [...] },
        { "tierSlug": "higher", "units": [...] }
      ]
    }
  ]
}
```

**Key observations**:

- Tier information exists but is deeply nested
- 4 exam subjects × 2 tiers = 8 combinations
- Each combination corresponds to a different programme
- No way to query by tier directly

---

## Programme = Sequence + Context Filters

### Formula

```plaintext
Programme Slug = Sequence Slug + Programme Factors

Where Programme Factors:
  - Key Stage (required for all)
  - Tier (KS4 sciences only)
  - Exam Subject (KS4 sciences only)
  - Exam Board (KS4 subjects)
  - Pathway (some KS4 subjects)
  - Legacy Flag (curriculum version)
```

### Examples

#### Simple Programme (Non-KS4)

```plaintext
Sequence: maths-primary
Programme Factors: + keyStage=ks1
Result: maths-primary-ks1

Sequence: maths-primary
Programme Factors: + keyStage=ks2
Result: maths-primary-ks2
```

#### Complex Programme (KS4 Science)

```plaintext
Sequence: science-secondary-aqa
Programme Factors:
  + keyStage=ks4
  + examSubject=biology
  + tier=foundation
Result: biology-secondary-ks4-foundation-aqa
```

#### KS4 Non-Science

```plaintext
Sequence: english-secondary-aqa
Programme Factors: + keyStage=ks4
Result: english-secondary-ks4-aqa
(No tier - English doesn't have Foundation/Higher)
```

---

## Programme Factor Inventory

Based on OWA sitemap analysis:

### 1. Key Stage (Universal)

**Values**: `ks1`, `ks2`, `ks3`, `ks4`

**Applies to**: All programmes

**Example**: `maths-primary` → `maths-primary-ks1`, `maths-primary-ks2`

### 2. Tier (Sciences Only)

**Values**: `foundation`, `higher`

**Applies to**: KS4 sciences (Biology, Chemistry, Combined Science, Physics)

**Example**: `science-secondary-aqa` → `biology-secondary-ks4-foundation-aqa`, `biology-secondary-ks4-higher-aqa`

### 3. Exam Subject (Sciences Only)

**Values**: `biology`, `chemistry`, `combined-science`, `physics`

**Applies to**: KS4 sciences

**Why**: Secondary science splits into separate subjects at KS4

### 4. Exam Board

**Values**: `aqa`, `ocr`, `edexcel`, `eduqas`, `edexcelb`

**Applies to**: Most KS4 subjects (English, Maths, Sciences, Languages, Humanities)

**Example**: `english-secondary-aqa` vs `english-secondary-edexcel`

### 5. Pathway

**Values**: `core`, `gcse`

**Applies to**: Some KS4 subjects (Citizenship, Computing, Physical Education)

**Example**: `citizenship-secondary-ks4-core`, `citizenship-secondary-ks4-gcse`

### 6. Legacy Flag

**Format**: `-l` suffix

**Applies to**: Older curriculum versions

**Example**: `art-primary-ks1-l` (legacy), `art-primary-ks1` (current)

---

## Why This Matters

### For Teachers

Teachers think in programmes, not sequences:

- ❌ "I teach science AQA" (sequence-level thinking)
- ✅ "I teach Year 10 Foundation Biology AQA" (programme-level thinking)

### For AI Tools

AI needs to match teacher mental models:

**Current problem**:

> Teacher: "Find me Year 10 Foundation Biology lessons"
>
> AI: _Searches `science-secondary-aqa` sequence, gets all subjects + tiers mixed together, struggles to filter_

**With programme support**:

> Teacher: "Find me Year 10 Foundation Biology lessons"
>
> AI: _Queries programme `biology-secondary-ks4-foundation-aqa` directly, gets exactly the right content_

### For Canonical URLs

OWA uses programme slugs in URLs:

- ✅ Correct: `https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-foundation-aqa`
- ❌ Doesn't exist: `https://www.thenational.academy/teachers/sequences/science-secondary-aqa`

**Without programme support**: Can't generate correct OWA URLs

**With programme support**: Direct mapping to OWA URLs

---

## Impact on AI Integration

### Current Limitations

1. **Can't filter by tier**: Must fetch all tiers, filter client-side
2. **Can't generate OWA URLs**: Sequence slugs don't match OWA patterns
3. **Unclear teacher intent**: "Biology AQA" could mean 8 different programmes
4. **Clunky queries**: Multi-step filtering through nested structures

### With Programme Support

1. **Direct filtering**: `GET /programmes?tier=foundation&examSubject=biology`
2. **Correct URLs**: Programme slug → OWA URL (1:1 mapping)
3. **Clear intent**: Teacher specifies exactly what they want
4. **Efficient queries**: Single endpoint returns exactly the right data

---

## Recommendation

**Add `/programmes` endpoint to the API** (see Item #5 in upstream-api-metadata-wishlist.md for detailed specification)

**Why**:

1. Matches teacher mental model
2. Enables correct OWA URL generation
3. Allows programme-level filtering
4. Clarifies the sequence/programme relationship
5. Unblocks advanced AI tools (comparative analysis, progression tracking)

**Breaking changes are acceptable**: This is important enough to warrant a major version bump (v1.0 → v2.0).

---

## Related Documentation

- **Full analysis**: `.agent/research/sequence-slug-vs-programme-slug-comparison.md`
- **Tier investigation**: `.agent/research/tier-analysis.md`
- **OWA sitemap patterns**: `.agent/research/owa-programme-slug-analysis.md`
- **API wishlist**: `.agent/plans/upstream-api-metadata-wishlist.md` (Item #5)
- **Updated ontology**: `docs/architecture/curriculum-ontology.md`
