# Ground Truth Protocol: Sequences

**Status**: Not Started  
**Target**: 1 ground truth  
**Index**: `oak_sequences` (30 documents)

---

## What Sequences Are

Sequences are subject-phase combinations — the highest level of curriculum organisation. Each sequence represents a complete subject programme.

- `sequence_title` — e.g., "Mathematics Secondary"
- `sequence_slug` — e.g., "maths-secondary"
- `subject_slug`, `phase_slug` — filtering
- `key_stages`, `years` — what's covered
- `unit_slugs` — ordered units in the sequence
- `category_titles` — topics/threads in this sequence

---

## The Filter vs Search Question

With only 30 documents, sequences may be:

| Role | Behaviour |
|------|-----------|
| **Filter** | User selects from dropdown/menu, not free-text search |
| **Search** | User types "secondary maths programme" in search box |
| **Navigation** | User clicks through from broader context |

**Recommendation**: Create 1 ground truth to validate that sequence search works, but expect sequences to primarily serve as filters/navigation rather than search targets.

---

## Search Use Cases (if applicable)

| Use Case | Example Query |
|----------|---------------|
| Programme overview | "secondary science curriculum" |
| Subject landing | "primary maths programme" |
| Phase exploration | "KS3 history sequence" |

---

## Designing Sequence Ground Truths

### Step 1: List Available Sequences

```bash
cd apps/oak-open-curriculum-semantic-search

# List all sequences
jq -r '.sequences[]? | "\(.sequenceSlug): \(.sequenceTitle)"' \
  bulk-downloads/*.json | sort -u
```

### Step 2: Design a Realistic Query

Ask: **"Would a teacher actually search for this, or would they navigate to it?"**

If search is plausible:
- 3-7 words
- Focus on programme/curriculum level
- May include "programme", "curriculum", "sequence"

### Step 3: Test the Query

```bash
# Test against oak_sequences index
# (You'll need to create a test script similar to test-query.ts for sequences)
```

### Step 4: Create the Entry

File: `src/lib/search-quality/ground-truth/sequences/entries/{subject}-{phase}.ts`

```typescript
import type { MinimalGroundTruth } from '../../types';

export const MATHS_SECONDARY_SEQUENCE: MinimalGroundTruth = {
  subject: 'maths',
  phase: 'secondary',
  keyStage: 'ks3',  // Representative key stage
  query: 'secondary mathematics curriculum',
  expectedRelevance: {
    'maths-secondary': 3,
  },
  description: 'The complete secondary mathematics programme.',
} as const;
```

---

## What Makes a Good Sequence Ground Truth

| Criterion | Why |
|-----------|-----|
| Programme-level | Sequences are subject-phase combinations |
| High-level vocabulary | "curriculum", "programme", "sequence" |
| Single-result expectation | With 30 docs, expect 1 correct result |

---

## Sequence Search Characteristics

With only 30 documents:
- Result set is tiny — precision is binary (found or not)
- Semantic matching less important (titles are formulaic: "Subject Phase")
- May be better served by structured navigation than search

---

## Target Ground Truth

| ID | Subject | Phase | Notes |
|----|---------|-------|-------|
| 1 | Maths | Secondary | Validates search works for sequences |

---

## Implementation Notes

1. Sequences may be better served by autocomplete/suggest than full search
2. Consider whether sequence "search" should redirect to browse UI
3. Low priority compared to lessons, units, threads

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [sequence-document-builder.ts](/apps/oak-open-curriculum-semantic-search/src/lib/indexing/sequence-document-builder.ts) | Sequence document structure |
| [ground-truth-protocol-lessons.md](./ground-truth-protocol-lessons.md) | Pattern reference |
