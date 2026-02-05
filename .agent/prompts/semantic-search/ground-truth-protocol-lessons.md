# Ground Truth Protocol

**Status**: ✅ Phase 1 Complete (30 ground truths)  
**Purpose**: Create and maintain ground truths that measure search quality.

---

## Current State

Phase 1 is complete with 30 foundational ground truths integrated with the benchmark system. This protocol documents how to:

1. **Add new ground truths** (for expansion)
2. **Modify existing ground truths** (if curriculum changes)
3. **Run the benchmark** (to validate search quality)

For the methodology rationale, see [ADR-106: Known-Answer-First Ground Truth Methodology](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md).

---

## Why Ground Truths Matter

Teachers use our search to find lessons for their classes. Ground truths test:

> **"If a teacher searches for X, do they get useful results?"**

Each ground truth is a known query with known expected results. The benchmark measures how well search performs against these expectations.

---

## Running the Benchmark

```bash
cd apps/oak-open-curriculum-semantic-search

# All ground truths
pnpm benchmark --all

# Single subject-phase
pnpm benchmark -s maths -p secondary

# Review mode (detailed per-query output)
pnpm benchmark -s maths -p secondary --review

# Issues mode (generate report)
pnpm benchmark --issues
```

### Current Baseline Metrics

| Metric | Value | Rating |
|--------|-------|--------|
| MRR | 1.000 | Excellent |
| NDCG@10 | 0.989 | Excellent |
| P@3 | 0.956 | Excellent |
| R@10 | 1.000 | Excellent |

---

## Testing Queries

**Critical**: Always test via `test-query.ts`, not raw Elasticsearch.

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm tsx src/lib/search-quality/test-query.ts "your query" subject keyStage

# Examples
pnpm tsx src/lib/search-quality/test-query.ts "expanding brackets algebra" maths ks3
pnpm tsx src/lib/search-quality/test-query.ts "dividing fractions" maths ks3
```

The script runs queries through the full 4-way RRF pipeline (BM25 + ELSER on Content + Structure).

---

## Adding a Ground Truth

### Step 1: Choose Subject-Phase

Check coverage in [queries-redesigned.md](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/queries-redesigned.md).

### Step 2: Find a Rich Unit

```bash
cd apps/oak-open-curriculum-semantic-search

jq -r '.sequence[] | select(.unitLessons | length >= 5) | 
  "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/{subject}-{phase}.json | head -20
```

### Step 3: Pick a Lesson and Extract Data

```bash
jq '.lessons[] | select(.lessonSlug == "LESSON-SLUG") | {
  slug: .lessonSlug,
  title: .lessonTitle,
  unit: .unitTitle,
  keyStage: .keyStageSlug,
  keywords: [.lessonKeywords[]?.keyword],
  keyLearning: [.keyLearningPoints[]?.keyLearningPoint],
  outcome: .pupilLessonOutcome
}' bulk-downloads/{subject}-{phase}.json
```

### Step 4: Design a Realistic Query

Ask: **"What would a teacher actually type to find this content?"**

Rules:
- 3-7 words
- Natural teacher vocabulary
- NO meta-phrases ("lessons on", "how to teach")
- NO redundant subject terms
- Must NOT just match the lesson title

### Step 5: Test the Query

```bash
pnpm tsx src/lib/search-quality/test-query.ts "your query" subject keyStage
```

### Step 6: Capture Top 3 with Relevance Scores

| Score | Meaning |
|-------|---------|
| 3 | Direct match — teaches exactly what query asks |
| 2 | Related — covers topic but not directly |
| 1 | Tangential — mentions concept peripherally |

### Step 7: Create the Entry

Create `src/lib/search-quality/ground-truth/entries/{subject}-{phase}.ts`:

```typescript
import type { MinimalGroundTruth } from '../types';

export const SUBJECT_PHASE: MinimalGroundTruth = {
  subject: 'subject-slug',
  phase: 'primary' | 'secondary',
  keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4',
  query: 'the realistic teacher query',
  expectedRelevance: {
    'top-result-slug': 3,
    'second-result-slug': 2,
    'third-result-slug': 2,
  },
  description: 'Brief description explaining what the lesson teaches.',
} as const;
```

### Step 8: Register and Validate

1. Add export to `ground-truth/index.ts`
2. Run `pnpm type-check`
3. Run `pnpm benchmark -s {subject} -p {phase}`
4. Update [queries-redesigned.md](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/queries-redesigned.md)

---

## Common Mistakes

### Using Raw ES Queries

**Wrong**: `curl -X POST "$ES_URL/oak_lessons/_search" -d '{"query": ...}'`

**Right**: `pnpm tsx src/lib/search-quality/test-query.ts "query" subject keyStage`

### Matching on Title

**Wrong**: Query "Brackets in equations" for lesson "brackets-in-equations"

**Right**: Query "expanding brackets algebra" — natural teacher vocabulary

### Technical Jargon

**Wrong**: "probabilities sum to one mutually exclusive"

**Right**: "what is probability of all outcomes" — how a teacher would phrase it

---

## File Locations

| File | Purpose |
|------|---------|
| `src/lib/search-quality/ground-truth/entries/*.ts` | Ground truth definitions |
| `src/lib/search-quality/ground-truth/types.ts` | Type definitions |
| `src/lib/search-quality/ground-truth/index.ts` | Exports and accessors |
| `src/lib/search-quality/test-query.ts` | Query testing script |
| `evaluation/analysis/benchmark.ts` | Benchmark runner |
| `docs/ground-truths/queries-redesigned.md` | Coverage tracking |

---

## Future Expansion

See [ground-truth-expansion-plan.md](../../plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) for:

- KS4 science variants
- Multiple queries per subject-phase
- Category diversity

The archived 120-query system is at `ground-truth-archive/` for reference.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Methodology decision |
| [semantic-search-architecture.md](../../directives-and-memory/semantic-search-architecture.md) | Structure is the foundation |
| [queries-redesigned.md](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/queries-redesigned.md) | Coverage matrix |
