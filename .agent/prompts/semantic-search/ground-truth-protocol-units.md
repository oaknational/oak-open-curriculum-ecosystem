# Ground Truth Protocol: Units

**Status**: Not Started  
**Target**: 2 ground truths (1 primary, 1 secondary)  
**Index**: `oak_units` / `oak_unit_rollup` (1,665 documents)

---

## What Units Are

Units are collections of lessons organised around a topic. They contain:

- `unit_title` — e.g., "Fractions: Adding and subtracting"
- `unit_slug` — unique identifier
- `subject_slug`, `key_stage`, `phase_slug` — filtering
- `lesson_count` — how many lessons
- `description`, `why_this_why_now` — enrichment text
- `thread_slugs`, `thread_titles` — curriculum progression links

---

## Search Use Cases

Teachers search for units when planning sequences of lessons:

| Query Type | Example |
|------------|---------|
| Topic + Year | "fractions year 5" |
| Topic + KeyStage | "algebra KS3" |
| Conceptual | "introduction to forces" |
| Planning | "addition and subtraction unit" |

---

## Designing Unit Ground Truths

### Step 1: Find Units with Rich Content

```bash
cd apps/oak-open-curriculum-semantic-search

# List units with enrichment data
jq -r '.sequence[] | select(.unitDescription != null) | 
  "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/{subject}-{phase}.json | head -20
```

### Step 2: Design a Realistic Query

Ask: **"What would a teacher type to find this unit?"**

Rules:
- 3-7 words
- Natural teacher vocabulary
- Focus on unit-level concepts (not individual lesson topics)
- May include year/key stage context

### Step 3: Test the Query

```bash
# Test against oak_unit_rollup index
# (You'll need to create a test script similar to test-query.ts for units)
```

### Step 4: Create the Entry

File: `src/lib/search-quality/ground-truth/units/entries/{subject}-{phase}.ts`

```typescript
import type { MinimalGroundTruth } from '../../types';

export const MATHS_PRIMARY_UNIT: MinimalGroundTruth = {
  subject: 'maths',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'adding fractions different denominators',
  expectedRelevance: {
    'fractions-adding-and-subtracting': 3,
    'fractions-equivalence-and-comparison': 2,
    'fractions-multiplication-and-division': 1,
  },
  description: 'Unit covering addition/subtraction of fractions with unlike denominators.',
} as const;
```

---

## What Makes a Good Unit Ground Truth

| Criterion | Why |
|-----------|-----|
| Multi-lesson concepts | Units span topics, not single facts |
| Planning-oriented | Teachers search for units when planning |
| Year/stage context | Units are organised by progression |
| Enrichment-rich | Units with descriptions test semantic search |

---

## Target Ground Truths

| ID | Phase | Subject | Focus |
|----|-------|---------|-------|
| 1 | Primary | Maths or English | Core subject with rich enrichment |
| 2 | Secondary | Science or Maths | Complex topic hierarchy |

---

## Implementation Notes

1. May need a new `test-query-units.ts` script targeting `oak_unit_rollup`
2. May need separate benchmark adapters for unit ground truths
3. The unit index supports `title_suggest` for autocomplete — consider testing this

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [unit-document-core.ts](/apps/oak-open-curriculum-semantic-search/src/lib/indexing/unit-document-core.ts) | Unit document structure |
| [ground-truth-protocol-lessons.md](./ground-truth-protocol-lessons.md) | Pattern reference |
