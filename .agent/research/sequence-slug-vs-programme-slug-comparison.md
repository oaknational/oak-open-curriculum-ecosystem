# Sequence Slug vs Programme Slug Comparison

**Date**: 2025-10-28

**Sources**:

- **API Sequences**: Live Oak Curriculum API (`get-subjects` MCP tool)
- **OWA Programmes**: Production sitemap at [https://www.thenational.academy/sitemap.xml](https://www.thenational.academy/sitemap.xml)

---

## Key Finding: Sequence != Programme

**Sequences are API-level curriculum structures that span multiple key stages and don't include tier information.**

**Programmes are OWA-level URLs that include year context (key stage + tier).**

---

## Complete Sequence Slug Inventory (from API)

### Art

**Sequences**:

- `art-primary` (KS1, KS2)
- `art-secondary` (KS3, KS4)

**Matching OWA Programmes**:

- `art-primary-ks1`
- `art-primary-ks2`
- `art-secondary-ks3`
- `art-secondary-ks4`

### Citizenship

**Sequences**:

- `citizenship-secondary-core` (KS3, KS4) [ks4Options: "Core"]
- `citizenship-secondary-gcse` (KS3, KS4) [ks4Options: "GCSE"]

**Matching OWA Programmes**:

- `citizenship-secondary-ks3`
- `citizenship-secondary-ks4-core`
- `citizenship-secondary-ks4-gcse`

### Computing

**Sequences**:

- `computing-primary` (KS1, KS2)
- `computing-secondary-aqa` (KS3, KS4) [ks4Options: "AQA"]
- `computing-secondary-core` (KS3, KS4) [ks4Options: "Core"]
- `computing-secondary-gcse` (KS3, KS4) [ks4Options: "GCSE"]
- `computing-secondary-ocr` (KS3, KS4) [ks4Options: "OCR"]

**Matching OWA Programmes**:

- `computing-primary-ks1`
- `computing-primary-ks2`
- `computing-secondary-ks3`
- `computing-secondary-ks4-core`
- `computing-secondary-ks4-gcse-aqa`
- `computing-secondary-ks4-gcse-ocr`

### English

**Sequences**:

- `english-primary` (KS1, KS2)
- `english-secondary-aqa` (KS3, KS4) [ks4Options: "AQA"]
- `english-secondary-edexcel` (KS3, KS4) [ks4Options: "Edexcel"]
- `english-secondary-eduqas` (KS3, KS4) [ks4Options: "Eduqas"]

**Matching OWA Programmes**:

- `english-primary-ks1`
- `english-primary-ks2`
- `english-secondary-ks3`
- `english-secondary-ks4-aqa`
- `english-secondary-ks4-edexcel`
- `english-secondary-ks4-eduqas`

### French

**Sequences**:

- `french-primary` (KS2)
- `french-secondary-aqa` (KS3, KS4) [ks4Options: "AQA"]
- `french-secondary-edexcel` (KS3, KS4) [ks4Options: "Edexcel"]

**Matching OWA Programmes**:

- `french-primary-ks2`
- `french-secondary-ks3`
- `french-secondary-ks4-aqa`
- `french-secondary-ks4-edexcel`

### Geography

**Sequences**:

- `geography-primary` (KS1, KS2)
- `geography-secondary-aqa` (KS3, KS4) [ks4Options: "AQA"]
- `geography-secondary-edexcelb` (KS3, KS4) [ks4Options: "Edexcel B"]

**Matching OWA Programmes**:

- `geography-primary-ks1`
- `geography-primary-ks2`
- `geography-secondary-ks3`
- `geography-secondary-ks4-aqa`
- `geography-secondary-ks4-edexcelb`

### History

**Sequences**:

- `history-primary` (KS1, KS2)
- `history-secondary-aqa` (KS3, KS4) [ks4Options: "AQA"]
- `history-secondary-edexcel` (KS3, KS4) [ks4Options: "Edexcel"]

**Matching OWA Programmes**:

- `history-primary-ks1`
- `history-primary-ks2`
- `history-secondary-ks3`
- `history-secondary-ks4-aqa`
- `history-secondary-ks4-edexcel`

### Maths

**Sequences**:

- `maths-primary` (KS1, KS2)
- `maths-secondary` (KS3, KS4) [NO ks4Options]

**Matching OWA Programmes**:

- `maths-primary-ks1`
- `maths-primary-ks2`
- `maths-secondary-ks3`
- `maths-secondary-ks4` (no exam board variant)

### Music

**Sequences**:

- `music-primary` (KS1, KS2)
- `music-secondary-aqa` (KS3, KS4) [ks4Options: "AQA"]
- `music-secondary-edexcel` (KS3, KS4) [ks4Options: "Edexcel"]
- `music-secondary-eduqas` (KS3, KS4) [ks4Options: "Eduqas"]
- `music-secondary-ocr` (KS3, KS4) [ks4Options: "OCR"]

**Matching OWA Programmes**:

- `music-primary-ks1`
- `music-primary-ks2`
- `music-secondary-ks3`
- `music-secondary-ks4-aqa`
- `music-secondary-ks4-edexcel`
- `music-secondary-ks4-eduqas`
- `music-secondary-ks4-ocr`

### Physical Education

**Sequences**:

- `physical-education-primary` (KS1, KS2)
- `physical-education-secondary-aqa` (KS3, KS4) [ks4Options: "AQA"]
- `physical-education-secondary-core` (KS3, KS4) [ks4Options: "Core"]
- `physical-education-secondary-edexcel` (KS3, KS4) [ks4Options: "Edexcel"]
- `physical-education-secondary-gcse` (KS3, KS4) [ks4Options: "GCSE"]
- `physical-education-secondary-ocr` (KS3, KS4) [ks4Options: "OCR"]

**Matching OWA Programmes**:

- `physical-education-primary-ks1`
- `physical-education-primary-ks2`
- `physical-education-secondary-ks3`
- `physical-education-secondary-ks4-core`
- `physical-education-secondary-ks4-gcse` (generic?)
- `physical-education-secondary-ks4-aqa`
- `physical-education-secondary-ks4-edexcel`
- `physical-education-secondary-ks4-ocr`

### Science

**Sequences**:

- `science-primary` (KS1, KS2)
- `science-secondary-aqa` (KS3, KS4) [ks4Options: "AQA"]
- `science-secondary-edexcel` (KS3, KS4) [ks4Options: "Edexcel"]
- `science-secondary-ocr` (KS3, KS4) [ks4Options: "OCR"]

**Matching OWA Programmes** (Combined Science):

- `combined-science-secondary-ks4-foundation-aqa`
- `combined-science-secondary-ks4-higher-aqa`
- `combined-science-secondary-ks4-foundation-edexcel`
- `combined-science-secondary-ks4-higher-edexcel`
- `combined-science-secondary-ks4-foundation-ocr`
- `combined-science-secondary-ks4-higher-ocr`

**Matching OWA Programmes** (Separate Sciences):

- `biology-secondary-ks4-foundation-aqa`
- `biology-secondary-ks4-higher-aqa`
- `chemistry-secondary-ks4-foundation-aqa`
- `chemistry-secondary-ks4-higher-aqa`
- `physics-secondary-ks4-foundation-aqa`
- `physics-secondary-ks4-higher-aqa`
- (+ all edexcel/ocr variants)

---

## Critical Missing Information: Tiers

**API sequences do NOT include tier information** (foundation/higher), but:

**OWA programmes DO include tier** for KS4 sciences:

- `biology-secondary-ks4-foundation-aqa`
- `biology-secondary-ks4-higher-aqa`
- `chemistry-secondary-ks4-foundation-ocr`
- `combined-science-secondary-ks4-foundation-edexcel`
- `combined-science-secondary-ks4-higher-edexcel`

---

## Mapping Pattern

### For Non-KS4 Subjects

```plaintext
API Sequence: {subject}-{phase}
OWA Programmes: {subject}-{phase}-{keyStage}

Example:
  geography-primary (API)
    ├── geography-primary-ks1 (OWA)
    └── geography-primary-ks2 (OWA)
```

### For KS4 Subjects (No Tier)

```plaintext
API Sequence: {subject}-secondary-{examBoard}
OWA Programmes: {subject}-secondary-ks3, {subject}-secondary-ks4-{examBoard}

Example:
  english-secondary-aqa (API)
    ├── english-secondary-ks3 (OWA) [shared across all exam boards]
    └── english-secondary-ks4-aqa (OWA)
```

### For KS4 Subjects (With Tier)

```plaintext
API Sequence: science-secondary-{examBoard}
OWA Programmes: {tier}-science-secondary-ks4-{tier}-{examBoard}

Example:
  science-secondary-aqa (API)
    ├── combined-science-secondary-ks4-foundation-aqa (OWA)
    ├── combined-science-secondary-ks4-higher-aqa (OWA)
    ├── biology-secondary-ks4-foundation-aqa (OWA)
    ├── biology-secondary-ks4-higher-aqa (OWA)
    ├── chemistry-secondary-ks4-foundation-aqa (OWA)
    ├── chemistry-secondary-ks4-higher-aqa (OWA)
    ├── physics-secondary-ks4-foundation-aqa (OWA)
    └── physics-secondary-ks4-higher-aqa (OWA)
```

---

## Summary Table

| **Concept**             | **API Concept**  | **OWA Concept**    | **Key Difference**                                        |
| ----------------------- | ---------------- | ------------------ | --------------------------------------------------------- |
| **Identifier**          | `sequenceSlug`   | `programmeSlug`    | Sequences are broader; programmes are year-contextualized |
| **Includes KS**         | No (for non-KS4) | Yes                | OWA splits by key stage                                   |
| **Includes Tier**       | No               | Yes (for sciences) | OWA explicitly shows foundation/higher                    |
| **Includes Exam Board** | Sometimes        | Sometimes          | Both include for KS4 options                              |
| **Includes Legacy**     | No               | Yes (`-l` suffix)  | OWA marks legacy curriculum                               |
| **Span**                | Multi-key-stage  | Single-context     | One sequence → multiple programmes                        |

---

## Relationship Hypothesis

**Programme = Sequence + Display Context**

```plaintext
sequenceSlug: geography-primary
  + keyStage: ks1
  → programmeSlug: geography-primary-ks1

sequenceSlug: science-secondary-aqa
  + tier: foundation
  + subject variant: combined-science
  + keyStage: ks4
  → programmeSlug: combined-science-secondary-ks4-foundation-aqa
```

---

## Questions for Data Team

1. **Are programme slugs synthetic?** Generated by combining sequence + filters?
2. **What determines tier mapping?** `science-secondary-aqa` → 8 programmes (3 subjects × 2 tiers + combined science)
3. **What about the `-l` suffix?** Is this a curriculum version indicator?
4. **Should the API expose programmes directly**, or continue using sequences + metadata?
5. **How do canonical URLs work?** Do lessons/units belong to a sequence or a programme?

---

## OWA Programmes NOT Found in API Sequences

From the sitemap, these programme patterns appear but don't have clear sequence equivalents:

- `drama-primary-ks1-l` (no drama sequence found)
- `latin-secondary-ks3-l` (no latin sequence found)
- `expressive-arts-and-design-foundation-early-years-foundation-stage-l` (EYFS)
- `literacy-foundation-early-years-foundation-stage-l` (EYFS)
- `financial-education-*` (no financial education sequence found)

**These may be legacy or not yet exposed via the API.**

---

## Canonical URL Patterns

Based on OWA sitemap:

```plaintext
/teachers/programmes/{programmeSlug}/units
/teachers/programmes/{programmeSlug}/units/{unitSlug}
/teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons
/teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons/{lessonSlug}

Context-independent:
/teachers/lessons/{lessonSlug}
/teachers/units/{unitSlug}
```

**Note**: The API uses `sequenceSlug` internally, but OWA uses `programmeSlug` in URLs.
