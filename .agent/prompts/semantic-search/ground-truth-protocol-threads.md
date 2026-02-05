# Ground Truth Protocol: Threads

**Status**: Not Started  
**Target**: 1 ground truth  
**Index**: `oak_threads` (164 documents)

---

## What Threads Are

Threads are curriculum progressions — conceptual paths that span multiple units and years. They represent how mathematical or scientific concepts build over time.

- `thread_title` — e.g., "Number: Multiplication and division"
- `thread_slug` — unique identifier
- `subject_slugs` — subjects this thread spans
- `unit_count` — how many units in the progression

Examples:
- "Number: Place value" (maths)
- "Algebra: Equations" (maths)
- "Forces and motion" (science)
- "Living things and their habitats" (science)

---

## Search Use Cases

Teachers search for threads when:

| Use Case | Example Query |
|----------|---------------|
| Topic progression | "multiplication progression" |
| Conceptual overview | "how algebra builds across years" |
| Strand navigation | "number sense curriculum" |
| Cross-year planning | "forces year 7 to 11" |

---

## Designing Thread Ground Truths

### Step 1: Explore Available Threads

```bash
cd apps/oak-open-curriculum-semantic-search

# List threads from bulk data
jq -r '.threads[]? | "\(.threadSlug): \(.threadTitle) (\(.unitCount) units)"' \
  bulk-downloads/maths-*.json | sort -u | head -30
```

### Step 2: Design a Realistic Query

Ask: **"What would a teacher type to find this curriculum progression?"**

Rules:
- 3-7 words
- Focus on conceptual progression, not single lessons
- May use curriculum vocabulary ("strand", "progression", "thread")
- Natural teacher language

### Step 3: Test the Query

```bash
# Test against oak_threads index
# (You'll need to create a test script similar to test-query.ts for threads)
```

### Step 4: Create the Entry

File: `src/lib/search-quality/ground-truth/threads/entries/{subject}.ts`

```typescript
import type { MinimalGroundTruth } from '../../types';

export const MATHS_THREAD: MinimalGroundTruth = {
  subject: 'maths',
  phase: 'secondary',  // or 'primary' - threads may span both
  keyStage: 'ks3',
  query: 'algebra progression equations',
  expectedRelevance: {
    'algebra-equations': 3,
    'algebra-expressions': 2,
    'algebra-graphs': 1,
  },
  description: 'Thread covering algebraic equations progression across years.',
} as const;
```

---

## What Makes a Good Thread Ground Truth

| Criterion | Why |
|-----------|-----|
| Progression-focused | Threads are about how concepts build |
| Multiple units | Threads span many units, not just one |
| Curriculum vocabulary | Teachers may use "strand", "progression" |
| Cross-year relevance | Threads connect learning across years |

---

## Thread Search Characteristics

With only 164 documents:
- High precision is critical (small result set)
- Semantic matching matters (thread titles are conceptual)
- Subject filtering is essential (threads are subject-specific)

---

## Target Ground Truth

| ID | Subject | Focus |
|----|---------|-------|
| 1 | Maths | Core progression (e.g., Number or Algebra) |

Threads are predominantly Maths-focused in the current curriculum.

---

## Implementation Notes

1. May need a new `test-query-threads.ts` script targeting `oak_threads`
2. Thread queries may benefit from curriculum-specific synonyms
3. Consider whether threads are search targets or navigation aids

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [thread-document-builder.ts](/apps/oak-open-curriculum-semantic-search/src/lib/indexing/thread-document-builder.ts) | Thread document structure |
| [ground-truth-protocol-lessons.md](./ground-truth-protocol-lessons.md) | Pattern reference |
