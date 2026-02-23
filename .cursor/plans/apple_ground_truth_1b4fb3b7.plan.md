---
name: Apple Ground Truth
overview: Create a cross-subject ground truth for the "apple" search quality failure, introduce a new `CrossSubjectLessonGroundTruth` type alongside the existing per-subject system, and document the root cause analysis in the search-results-quality plan.
todos:
  - id: tdd-type
    content: Write tests for CrossSubjectLessonGroundTruth type, then implement it in types.ts
    status: completed
  - id: tdd-entry
    content: Write tests for apple-lessons ground truth entry, then create the entry file
    status: completed
  - id: wire-exports
    content: Wire the new type and entry into ground-truth/index.ts with CROSS_SUBJECT_LESSON_GROUND_TRUTHS array
    status: completed
  - id: update-plan
    content: Update search-results-quality.md with root cause analysis and link to ground truth
    status: completed
  - id: quality-gates
    content: "Run quality gates: type-check, lint:fix, test"
    status: completed
  - id: reviews
    content: "Invoke specialist reviewers: code-reviewer, test-reviewer, type-reviewer, ground-truth-designer"
    status: completed
isProject: false
---

# Cross-Subject Ground Truth for "Apple" Search Quality Failure

## Context

Searching for "apple" with `scope=lessons` (no subject filter) returns 8,329 results. The top results are PE lessons about "apply" (fuzzy match), not lessons about apples. The genuinely apple-related lessons (`making-apple-flapjack-bites`, `producing-our-food`) are buried.

**Root causes identified**:

- `fuzziness: 'AUTO'` in `[rrf-query-builders.ts](packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts)` allows "apple" (5 chars, 1 edit) to match "apply"
- No `min_score` threshold — all 8,329 results returned regardless of score (0.03-0.06)
- ELSER semantic retrievers surface loosely related content
- Transcript content amplifies false positives ("apply" appears thousands of times across PE/English)

## Design Decision: New Type, Not Modified Existing

The existing `LessonGroundTruth` type requires `subject`, `phase`, and `keyStage`. The benchmark runner always passes `subject` to the search SDK. A cross-subject ground truth is a structurally different test: it validates search quality without subject filtering.

**Approach**: Create a parallel `CrossSubjectLessonGroundTruth` type and a separate `CROSS_SUBJECT_LESSON_GROUND_TRUTHS` array. The existing per-subject system remains untouched. Benchmark runner adaptation is follow-on work.

## Files to Change

### 1. New type: `CrossSubjectLessonGroundTruth`

**File**: `[apps/oak-search-cli/src/lib/search-quality/ground-truth/types.ts](apps/oak-search-cli/src/lib/search-quality/ground-truth/types.ts)`

Add a new interface alongside `LessonGroundTruth`:

```typescript
export interface CrossSubjectLessonGroundTruth {
  readonly query: string;
  readonly expectedRelevance: ExpectedRelevance;
  readonly description: string;
  readonly subject?: AllSubjectSlug;
  readonly phase?: Phase;
  readonly keyStage?: KeyStage;
}
```

Subject, phase, and keyStage are all optional — when absent, the search runs unfiltered.

### 2. New ground truth entry

**New file**: `apps/oak-search-cli/src/lib/search-quality/ground-truth/cross-subject/apple-lessons.ts`

Based on independent discovery (COMMIT rankings before seeing search results):

- `making-apple-flapjack-bites` (relevance 3) — directly about making apple-based food, "apple" in title
- `producing-our-food` (relevance 3) — apple production as key teaching example, extensive apple discussion
- `selective-breeding-of-plants-non-statutory` (relevance 2) — apple trees as primary selective breeding example

### 3. Wire into exports

**File**: `[apps/oak-search-cli/src/lib/search-quality/ground-truth/index.ts](apps/oak-search-cli/src/lib/search-quality/ground-truth/index.ts)`

- Export `CrossSubjectLessonGroundTruth` type
- Import and export the apple entry
- Create `CROSS_SUBJECT_LESSON_GROUND_TRUTHS` array

### 4. Tests (TDD)

**New file**: `apps/oak-search-cli/src/lib/search-quality/ground-truth/cross-subject/apple-lessons.unit.test.ts`

- Validate entry has required fields
- Validate expectedRelevance has 2-3 entries with valid scores
- Validate query is non-empty

**Existing file**: `[apps/oak-search-cli/src/lib/search-quality/ground-truth/index.unit.test.ts](apps/oak-search-cli/src/lib/search-quality/ground-truth/index.unit.test.ts)`

- Add tests for `CROSS_SUBJECT_LESSON_GROUND_TRUTHS` array

### 5. Update search-results-quality plan

**File**: `[apps/.agent/plans/semantic-search/active/search-results-quality.md](.agent/plans/semantic-search/active/search-results-quality.md)`

Add the root cause analysis, link to the new ground truth, and document investigation findings:

- Fuzziness "AUTO" causing "apple" to "apply" matches
- No min_score threshold
- ELSER semantic retriever contributing false positives
- Transcript amplification of noise terms

### 6. Quality gates

Run after implementation:

- `pnpm type-check`
- `pnpm lint:fix`
- `pnpm test` (unit tests for the new ground truth)

### 7. Specialist reviews

Invoke after implementation:

- `code-reviewer` (gateway)
- `test-reviewer` (new tests)
- `type-reviewer` (new type alongside existing system)
- `ground-truth-designer` (cross-subject ground truth design validation)

## What This Does NOT Cover (Follow-On Work)

- Benchmark runner adaptation to support cross-subject queries (requires making `subject` optional in `RunQueryInput`, `GroundTruthEntry`, `EntryBenchmarkResult`, and adapting output formatting)
- Fixing the root causes (fuzziness tuning, min_score threshold, transcript weighting)
- Additional cross-subject ground truths beyond "apple"

These are documented in the search-results-quality plan for subsequent work.
