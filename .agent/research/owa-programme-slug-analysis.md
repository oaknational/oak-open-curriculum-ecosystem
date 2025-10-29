# OWA Programme Slug Analysis

**Source**: [Oak Web Application Sitemap](https://www.thenational.academy/sitemap.xml)

**Date**: 2025-10-28

---

## Programme Slug Patterns Observed

### Pattern 1: Basic (Non-KS4)

**Structure**: `{subject}-{phase}-{keyStage}`

**Examples**:

- `art-primary-ks1`
- `maths-primary-ks2`
- `english-secondary-ks3`
- `geography-primary-ks2`
- `history-secondary-ks3`

### Pattern 2: Basic with Legacy Flag

**Structure**: `{subject}-{phase}-{keyStage}-l`

**Examples**:

- `art-primary-ks1-l`
- `computing-primary-ks2-l`
- `drama-secondary-ks3-l`
- `french-secondary-ks3-l`

**Note**: The `-l` suffix appears to indicate legacy content/curriculum version.

### Pattern 3: KS4 with Tier and Exam Board

**Structure**: `{subject}-secondary-ks4-{tier}-{examBoard}`

**Examples**:

- `biology-secondary-ks4-foundation-aqa`
- `biology-secondary-ks4-higher-ocr`
- `chemistry-secondary-ks4-foundation-edexcel`
- `chemistry-secondary-ks4-higher-aqa`
- `combined-science-secondary-ks4-foundation-ocr`
- `combined-science-secondary-ks4-higher-edexcel`
- `physics-secondary-ks4-foundation-aqa`
- `physics-secondary-ks4-higher-ocr`

**Tiers**: `foundation`, `higher`

**Exam Boards**: `aqa`, `ocr`, `edexcel`, `eduqas`

### Pattern 4: KS4 with Pathway (No Tier)

**Structure**: `{subject}-secondary-ks4-{pathway}`

**Examples**:

- `citizenship-secondary-ks4-core`
- `citizenship-secondary-ks4-gcse`
- `computing-secondary-ks4-core`
- `computing-secondary-ks4-gcse-aqa`

**Pathways**: `core`, `gcse`

### Pattern 5: KS4 with Exam Board Only (No Tier)

**Structure**: `{subject}-secondary-ks4-{examBoard}`

**Examples**:

- `english-secondary-ks4-aqa`
- `english-secondary-ks4-edexcel`
- `english-secondary-ks4-eduqas`
- `french-secondary-ks4-aqa`
- `french-secondary-ks4-edexcel`
- `history-secondary-ks4-aqa`
- `history-secondary-ks4-edexcel`

### Pattern 6: KS4 with Legacy Flag

**Structure**: `{subject}-secondary-ks4-{tier?}-l`

**Examples**:

- `biology-secondary-ks4-l`
- `chemistry-secondary-ks4-l`
- `combined-science-secondary-ks4-foundation-l`
- `combined-science-secondary-ks4-higher-l`
- `french-secondary-ks4-l`

### Pattern 7: Early Years Foundation Stage

**Structure**: `{subject}-foundation-early-years-foundation-stage-l`

**Examples**:

- `expressive-arts-and-design-foundation-early-years-foundation-stage-l`
- `literacy-foundation-early-years-foundation-stage-l`
- `maths-foundation-early-years-foundation-stage-l`

---

## Programme Slug Components

### Required Components

1. **Subject** (e.g., `maths`, `english`, `biology`, `combined-science`)
2. **Phase** (e.g., `primary`, `secondary`, `foundation`)
3. **Key Stage** (e.g., `ks1`, `ks2`, `ks3`, `ks4`, `early-years-foundation-stage`)

### Optional Components (Context-Dependent)

4. **Tier** (KS4 only): `foundation`, `higher`
5. **Exam Board** (KS4 only): `aqa`, `ocr`, `edexcel`, `eduqas`
6. **Pathway**: `core`, `gcse`
7. **Legacy Flag**: `-l` suffix

---

## Comparison to API "Sequence" Slugs

From the API tests and code, sequence slugs follow similar patterns:

**API Examples**:

- `english-primary` (no key stage)
- `maths-secondary` (no key stage)
- `science-secondary-aqa` (includes exam board)

**Key Difference**: API sequences appear to be **less granular** - they don't include key stage in the slug for non-KS4 subjects.

### Hypothesis: Sequence vs Programme Relationship

Based on this analysis:

```plaintext
Sequence (API):
  - english-primary (covers KS1 + KS2)
  - maths-secondary (covers KS3 + KS4)
  - biology-secondary-aqa (covers KS4 with AQA exam board)

Programme (OWA):
  - english-primary-ks1 ───┐
  - english-primary-ks2 ───┴─ Derived from "english-primary" sequence

  - maths-secondary-ks3 ─────────────────┐
  - maths-secondary-ks4-foundation-aqa ──┤
  - maths-secondary-ks4-higher-aqa ──────┴─ Derived from "maths-secondary" sequence

  - biology-secondary-ks4-foundation-aqa ─┐
  - biology-secondary-ks4-higher-aqa ─────┴─ Derived from "biology-secondary-aqa" sequence
```

**Programme = Sequence + Context Filters (key stage, tier, pathway, legacy flag)**

---

## URL Structure Patterns

### Programme URLs

From OWA sitemap:

```plaintext
/teachers/programmes/{programmeSlug}/units
/teachers/programmes/{programmeSlug}/units/{unitSlug}
/teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons
/teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons/{lessonSlug}
```

**Example**:

```plaintext
/teachers/programmes/biology-secondary-ks4-foundation-aqa/units
/teachers/programmes/english-secondary-ks4-eduqas/units/macbeth-lady-macbeth-as-a-machiavellian-villain-4877/lessons/lady-macbeths-ambition
```

### Canonical URLs

For context-independent resources:

```plaintext
/teachers/lessons/{lessonSlug}
/teachers/units/{unitSlug}
```

**Example**:

```plaintext
/teachers/lessons/lady-macbeths-ambition
/teachers/units/macbeth-lady-macbeth-as-a-machiavellian-villain-4877
```

---

## Subject Naming Patterns

From the sitemap, subjects use kebab-case with some compound names:

**Simple subjects**:

- `art`, `maths`, `english`, `geography`, `history`, `music`, `french`, `german`, `spanish`, `latin`

**Compound subjects**:

- `combined-science`
- `cooking-nutrition`
- `design-technology`
- `physical-education`
- `religious-education`
- `rshe-pshe`
- `expressive-arts-and-design`
- `financial-education`

**KS4 exam subjects** (science split):

- `biology`
- `chemistry`
- `physics`

---

## Key Findings

1. **Programme slugs include more context** than sequence slugs (key stage, tier, exam board)
2. **One sequence can generate multiple programmes** (e.g., `maths-secondary` → multiple KS3/KS4 programmes)
3. **Programme = contextualized view** of a sequence
4. **Legacy flag (`-l`)** indicates older curriculum versions
5. **KS4 has most variation** due to tiers, exam boards, and pathways
6. **Canonical URLs exist** for lessons and units (context-independent)
7. **Programme URLs provide context** (showing which tier/exam board pathway the resource belongs to)

---

## Questions for Data Team

Based on this analysis:

1. Is a "sequence" the base curriculum structure (e.g., `maths-secondary`) from which multiple programmes are derived?
2. Are programme slugs **synthetic identifiers** created by combining sequence + context filters?
3. What is the formal relationship: `Sequence GENERATES Programme` or `Programme == Sequence`?
4. Should the API expose programmes directly, or continue to expose only sequences?
