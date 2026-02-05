# ADR-106: Known-Answer-First Ground Truth Methodology

## Status

Accepted (2026-02-05)

## Context

Semantic search quality measurement requires ground truths: known queries with expected results. The traditional approach designs queries first ("what might a teacher search for?") then determines what results should appear.

This approach has problems:

1. **Invented queries** may not reflect actual teacher behaviour
2. **Expected results** become subjective ("should this lesson match?")
3. **Validation is circular** — we decide what's relevant, then test if we find it
4. **Coverage gaps** — hard to ensure we test actual curriculum content

### Evidence from Previous Approach

The original ground truth system (120 queries, 4 categories) suffered from:

- **59% zero-hit rate** on natural-expression queries
- **Subjective relevance judgments** — disagreement on what "should" match
- **High maintenance burden** — 401 files, split architecture
- **Unclear value signal** — were low scores due to bad queries or bad search?

## Decision

### Adopt Known-Answer-First Methodology

Design ground truths starting from the **answer** (curriculum content), not the **question** (search query).

### The Process

For each subject-phase:

1. **Find a rich unit** — Target units with 5+ lessons
2. **Pick a lesson** — Extract title, keywords, key learning, transcript
3. **Understand the content** — What does this lesson actually teach?
4. **Design query** — "What would a teacher type to find THIS specific lesson?"
5. **Run query** — Execute via actual search system (4-way RRF)
6. **Capture top 3** — Record actual results with relevance scores
7. **Lock in** — If top results are reasonable, record as ground truth

### Key Principles

1. **Start from curriculum content** — The lesson exists, it teaches something specific
2. **Design realistic queries** — Natural teacher vocabulary, not title matching
3. **Test against actual search** — Use the full 4-way RRF pipeline
4. **Accept actual results** — If search returns reasonable lessons, that's valid
5. **Relevance is grounded** — Score based on what the lesson actually teaches

### Relevance Score Definition

| Score | Meaning      | Grounding                                |
| ----- | ------------ | ---------------------------------------- |
| 3     | Direct match | Lesson teaches exactly what query asks   |
| 2     | Related      | Lesson covers the topic but not directly |
| 1     | Tangential   | Lesson mentions the concept peripherally |

Scores are determined by examining lesson content (title, keywords, key learning points, transcript), not by subjective judgment.

## Consequences

### Positive

1. **Queries reflect real content** — Every ground truth points to an actual lesson
2. **Objective relevance** — Scores based on what lessons actually teach
3. **Clear failure signal** — If a lesson about X doesn't appear for query X, search has a problem
4. **Reduced maintenance** — One ground truth per subject-phase establishes baseline
5. **Measurable value** — "Does search help teachers find curriculum content?"

### Negative

1. **Coverage gaps** — One query per subject-phase may miss edge cases
2. **Happy path bias** — Starting from good content may not test failure modes
3. **Requires curriculum knowledge** — Must understand what lessons actually teach

### Mitigations

- **Expansion plan** — Add more queries per subject-phase when needed
- **Category diversity** — Future work can add natural-expression, typo, cross-topic queries
- **Archived reference** — Previous 120-query system preserved for selective restoration

## Implementation

### Foundational Ground Truths

30 ground truths created (one per subject-phase), located at:

```text
apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/entries/
```

Each entry contains:

```typescript
export const MATHS_SECONDARY: MinimalGroundTruth = {
  subject: 'maths',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'dividing fractions using reciprocals',
  expectedRelevance: {
    'dividing-a-fraction-by-a-fraction': 3,
    'dividing-with-decimals': 2,
    'checking-and-securing-dividing-a-fraction-by-a-whole-number': 2,
  },
  description:
    'Lesson teaches dividing fractions by fractions using diagrams and the reciprocal method.',
} as const;
```

### Benchmark Integration

The benchmark system runs all ground truths through:

1. **4-way RRF search** (BM25 + ELSER on Content + Structure)
2. **Subject/phase filtering** per ground truth configuration
3. **IR metrics calculation** (MRR, NDCG, Precision, Recall)

### Results

Phase 1 baseline metrics (30 queries):

| Metric        | Value | Rating    |
| ------------- | ----- | --------- |
| MRR           | 1.000 | Excellent |
| NDCG@10       | 0.989 | Excellent |
| P@3           | 0.956 | Excellent |
| R@10          | 1.000 | Excellent |
| Zero-hit rate | 0.000 | Excellent |

## Alternatives Considered

### Query-First Design

Design queries based on assumed teacher behaviour, then determine expected results.

**Rejected**: Led to 59% zero-hit rate on natural-expression queries. Subjective relevance judgments caused disagreement and maintenance burden.

### Exhaustive Category Coverage

4 categories per subject-phase (precise-topic, natural-expression, imprecise-input, cross-topic).

**Deferred**: 120 queries proved difficult to maintain. Starting with one well-grounded query per subject-phase establishes baseline. Categories can be added incrementally based on evidence.

### Title Matching

Use lesson titles as queries (e.g., query "Brackets in equations" for lesson "brackets-in-equations").

**Rejected**: Tests ES keyword matching, not search value. Teachers don't search by exact lesson titles.

## Related Decisions

- [ADR-098](./098-ground-truth-registry.md) — Original ground truth registry design
- [ADR-078](./078-dependency-injection-for-testability.md) — Benchmark dependency injection
- [ADR-101](./101-subject-hierarchy-for-search-filtering.md) — Subject filtering for KS4 science

## References

- [Ground Truth Protocol](/.agent/prompts/semantic-search/ground-truth-protocol.md) — Step-by-step process
- [Expansion Plan](/.agent/plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) — Future work
- [Archive](/../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth-archive/README.md) — Previous approach
