# ADR-099: Transcript-Aware RRF Score Normalisation

**Status**: Accepted
**Created**: 2026-01-12
**Context**: Semantic Search RRF Architecture

## Context

The 4-way RRF combines scores from four retrievers:

| Retriever       | Field                       | With Transcript | Without Transcript |
| --------------- | --------------------------- | --------------- | ------------------ |
| BM25 content    | `lesson_content`            | ✅              | ❌ Field omitted   |
| ELSER content   | `lesson_content_semantic`   | ✅              | ❌ Field omitted   |
| BM25 structure  | `lesson_structure`          | ✅              | ✅                 |
| ELSER structure | `lesson_structure_semantic` | ✅              | ✅                 |

Per [ADR-095](095-missing-transcript-handling.md), documents without transcripts have their content fields **omitted entirely** (not empty strings or placeholders). This means:

- Documents **with** transcripts can appear in all 4 retrievers
- Documents **without** transcripts can only appear in 2 retrievers

### The RRF Scoring Problem

The RRF formula is: `score = Σ 1/(k + rank_i)`

With the current `rank_constant` of k=60:

| Document Type                          | Best Possible Score | Calculation |
| -------------------------------------- | ------------------- | ----------- |
| With transcript (rank #1 in all 4)     | ~0.066              | 4 × 1/61    |
| Without transcript (rank #1 in both 2) | ~0.033              | 2 × 1/61    |

**A document that ranks #1 in ALL applicable retrievers gets half the score if it lacks a transcript.** This is architecturally wrong.

### The Correct Mental Model

- **Metadata-only is the baseline** — All 12,833 lessons have structure fields
- **Transcripts are a bonus** — Additional retrieval paths for ~81% of lessons
- **The system should not penalise the baseline case**

### Affected Subjects

| Subject Group                 | Transcript Coverage | Impact                   |
| ----------------------------- | ------------------- | ------------------------ |
| MFL (French, German, Spanish) | ~0%                 | 50% scoring disadvantage |
| PE Primary                    | ~0.6%               | 50% scoring disadvantage |
| PE Secondary                  | ~28.5%              | Mostly 50% disadvantage  |

These subjects' lessons are structurally unable to compete with transcript-having lessons, regardless of query relevance.

## Decision

Add post-RRF score normalisation that adjusts scores based on the number of applicable retrievers.

### Implementation

```typescript
/**
 * Normalises RRF scores to account for transcript availability.
 *
 * Documents without transcripts can only appear in 2 of 4 retrievers.
 * This function normalises scores so a document ranking #1 in all
 * APPLICABLE retrievers gets the same normalised score regardless
 * of how many retrievers apply to it.
 *
 * @param results - RRF search results with `has_transcript` in `_source`
 * @returns Results with normalised `_score` values, re-sorted
 */
export function normaliseRrfScores<T extends RrfResultWithTranscript>(results: readonly T[]): T[] {
  const TOTAL_RETRIEVERS = 4;
  const STRUCTURE_ONLY_RETRIEVERS = 2;

  const normalised = results.map((doc) => {
    const applicableRetrievers = doc._source.has_transcript
      ? TOTAL_RETRIEVERS
      : STRUCTURE_ONLY_RETRIEVERS;
    const normalisationFactor = TOTAL_RETRIEVERS / applicableRetrievers;

    return {
      ...doc,
      _score: doc._score * normalisationFactor,
    };
  });

  // Re-sort by normalised score (stable sort)
  return normalised.sort((a, b) => b._score - a._score);
}
```

### Application Points

The normalisation is applied after RRF results are returned:

1. **Lesson search** — In `src/lib/hybrid-search/lessons.ts`

Note: Unit search does NOT require normalisation because `unit_content` is derived from aggregated lesson content and is always present (units always have content fields).

### Testability via Dependency Injection

Per [ADR-078](078-dependency-injection-for-testability.md), search functions accept dependencies as parameters:

```typescript
export interface RunLessonsSearchOptions {
  readonly search?: EsSearchFn; // Defaults to esSearch
}

export async function runLessonsSearch(
  q: StructuredQuery,
  size: number,
  from: number,
  doHighlight: boolean,
  options: RunLessonsSearchOptions = {},
): Promise<HybridSearchResult>;
```

This enables **integration testing without mocking**:

```typescript
// Integration test injects fake search function
const fakeSearch = createFakeSearch(mockResponse);
const result = await runLessonsSearch(query, 10, 0, false, { search: fakeSearch });
expect(result.results[0].rankScore).toBeCloseTo(0.066); // Normalised score
```

## Consequences

### Positive

- **Fair ranking** — Documents compete on relevance, not transcript availability
- **MFL/PE findable** — Teacher queries for these subjects return relevant results
- **Simple implementation** — Pure function, easy to test, no ES changes required
- **Explicit** — The normalisation is visible in code, not hidden in ES config

### Negative

- **Post-processing required** — Adds a step after ES returns results
- **Re-sorting needed** — Normalisation may change document order

### Neutral

- **Pagination considerations** — For deep pagination, the re-sort affects result sets; however, most searches use top-N results where this is not an issue

## Alternatives Considered

### Alternative A: ES Function Score

Use `function_score` to apply conditional boost in ES:

```json
{
  "function_score": {
    "functions": [
      {
        "filter": { "term": { "has_transcript": false } },
        "weight": 2.0
      }
    ],
    "boost_mode": "multiply"
  }
}
```

**Rejected**: Does not compose well with RRF retriever API. The boost would apply before RRF fusion, not after.

### Alternative B: Separate Retriever Paths

Run different RRF configurations based on subject:

```typescript
if (isMflSubject(subject)) {
  return buildTwoWayStructureRrf(params);
}
return buildFourWayRrf(params);
```

**Rejected**: Subject-specific logic is fragile. Does not help when results include mixed transcript/non-transcript documents.

### Alternative C: Adjust RRF rank_constant

Increase k value to reduce the disadvantage proportionally.

**Rejected**: Does not eliminate the disadvantage, only reduces it. The fundamental problem remains.

## Implementation Plan

1. **Write unit tests first** (TDD) for `normaliseRrfScores`
2. **Implement** the pure function
3. **Apply** in lesson and unit search pipelines
4. **Run quality gates**
5. **Benchmark** to validate improvement

## Related

- [ADR-078: Dependency Injection for Testability](078-dependency-injection-for-testability.md) — Pattern for injectable search functions
- [ADR-094: `has_transcript` Field](094-has-transcript-field.md) — The field we use for normalisation
- [ADR-095: Missing Transcript Handling](095-missing-transcript-handling.md) — Why content fields are omitted
- [ADR-076: ELSER-Only Embedding Strategy](076-elser-only-embedding-strategy.md) — Four-retriever architecture
