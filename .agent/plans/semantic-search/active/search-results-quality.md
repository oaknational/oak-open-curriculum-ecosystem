# Search Results Quality

**Status**: Merge blocker
**Priority**: High
**Area**: Search (Elasticsearch)
**Last Updated**: 2026-02-23

---

## Problem

Single-word cross-subject lesson queries return the entire index with poor-to-mixed ranking. A teacher or AI agent searching for a simple term like "apple", "tree", or "mountain" receives 8,000–10,000 results instead of a focused set of genuinely relevant lessons.

The problem has two compounding layers:

1. **Volume** (all queries): Every single-word query returns the entire index. No `min_score` threshold filters out weak matches.
2. **Ranking** (short words, 3–5 chars): `fuzziness: 'AUTO'` allows 1-edit matches to common English words. These common words appear in thousands of transcripts, overwhelming genuine matches in the rankings.

---

## Evidence: Cross-Query Analysis

All queries run via `oak-remote-preview` MCP on 2026-02-23, `scope: "lessons"`, no subject filter.

### Query: "apple" (5 chars)

**Total**: 8,329 results | **Took**: 121ms

| Rank | Lesson | Score | Relevant? | Match reason |
|------|--------|-------|-----------|--------------|
| 1 | Create and apply defensive tactics (PE) | 0.063 | No | "apply" fuzzy match |
| 2 | Making apple flapjack bites (Cooking) | 0.058 | **Yes** | Direct "apple" match |
| 3 | Analysing 'A Poison Tree' by William Blake | 0.055 | Marginal | Apple metaphor in poem |
| 4 | Animal Farm: food and drink motifs | 0.051 | Marginal | Apple symbolism |
| 5 | Rosh Hashanah: diverse Jewish celebrations | 0.033 | **Yes** | Apples and honey tradition |
| 6–10 | "Practise and apply spelling..." (English ×5) | 0.030–0.032 | No | "apply" fuzzy match |

**Problem**: Only 1 of the top 5 results is genuinely about apples. The #1 result is a PE lesson about "applying" defensive tactics — a fuzzy match false positive. 5 of the top 10 are "apply" matches.

**Fuzzy match**: "apple" (5 chars) → "apply" (1 edit: `e` → `y`). The word "apply" appears in thousands of lesson titles and transcripts across PE, English, and other subjects.

### Query: "tree" (4 chars)

**Total**: 10,000 results (hit index cap) | **Took**: 309ms

| Rank | Lesson | Score | Relevant? | Match reason |
|------|--------|-------|-----------|--------------|
| 1 | Structure of a tree (Science KS1) | 0.061 | **Yes** | Direct "tree" match |
| 2 | Naming trees (Science KS1) | 0.058 | **Yes** | Direct "tree" match |
| 3 | 'The Twisted Tree': inferences about the tree (English KS3) | 0.057 | **Yes** | Novel about a tree |
| 4 | The benefits of trees (Geography KS2) | 0.056 | **Yes** | Geography of trees |
| 5 | Using an outcome tree to display outcomes (Maths KS3) | 0.054 | No | Maths "tree diagram" — not about trees |
| 6 | Frequency trees (Maths KS4) | 0.054 | No | Maths "frequency tree" — not about trees |
| 7 | 'The Twisted Tree': the presence of the tree (English KS3) | 0.053 | **Yes** | Novel about a tree |
| 8 | Deciduous and evergreen trees (Science KS1) | 0.052 | **Yes** | Directly about trees |
| 9 | Probability tree diagrams (Maths KS3) | 0.052 | No | Maths probability — not about trees |
| 10 | Analysing 'A Poison Tree' (English KS4) | 0.051 | Marginal | Tree as metaphor |

**Problem**: Top results are better than "apple" — 6 of top 10 are genuinely about trees. But the result set is polluted by maths "tree diagram" lessons and — critically — **"tree" fuzzy-matches to "three"**. The highlights confirm this: the "frequency trees" result highlights include `"have <mark>three</mark> unknowns"` and `"<mark>three</mark> learning cycles"`. The word "three" appears in virtually every lesson transcript (counting, numbering, sequencing), explaining why the total hits the 10,000 cap.

**Fuzzy matches**: "tree" (4 chars) → "three" (1 edit: insert `h`), "true" (1 edit: `e` → `u`). Both "three" and "true" appear in virtually every lesson.

### Query: "mountain" (8 chars)

**Total**: 8,277 results | **Took**: 192ms

| Rank | Lesson | Score | Relevant? | Match reason |
|------|--------|-------|-----------|--------------|
| 1 | The formation of mountains (Geography KS2) | 0.065 | **Yes** | Directly about mountains |
| 2 | Mountains and their features (Geography KS2) | 0.064 | **Yes** | Directly about mountains |
| 3 | Story mountain: 'Three Billy Goats Gruff' (English KS1) | 0.061 | No | "Story mountain" literacy device |
| 4 | Story mountain: 'Jack and the Beanstalk' (English KS1) | 0.061 | No | "Story mountain" literacy device |
| 5 | Mountains and landmarks of the world (Geography KS1) | 0.061 | **Yes** | Directly about mountains |
| 6–9 | Story mountain: various texts (English KS1) | 0.058–0.060 | No | "Story mountain" literacy device |
| 10 | The UK's peaks (Geography KS2) | 0.052 | **Yes** | UK mountains |

**Problem**: Top results are genuinely relevant — geography mountain lessons rank #1 and #2. But the results are diluted by English "story mountain" lessons (a literacy device, not about mountains). And 8,277 total results means 8,200+ are noise. No fuzzy match pollution because no common English word is within 2 edits of "mountain".

---

## Pattern Analysis

| Query | Length | fuzziness:AUTO edits | Poison word(s) | Total | Top-3 quality | Core issue |
|-------|--------|---------------------|----------------|-------|---------------|------------|
| "apple" | 5 | 1 edit | "apply" | 8,329 | **Poor** — #1 is false positive | Fuzzy + volume |
| "tree" | 4 | 1 edit | "three", "true" | 10,000 | **Good** — but mixed with maths | Fuzzy + volume |
| "mountain" | 8 | 2 edits | none dominant | 8,277 | **Good** — genuine mountains | Volume only |

### Two compounding problems

**Problem 1 — Volume (universal, all query lengths)**:
Every single-word query returns the entire lesson index (~8,000–10,000 results). Even "mountain" — which produces excellent top-3 results — returns 8,277. This is because:

- ELSER semantic retrievers assign non-zero similarity to almost everything
- The four-way RRF combination means any non-zero score from any retriever surfaces the result
- No `min_score` threshold filters out weak matches
- Scores in the 0.03–0.06 range indicate marginal-to-weak matches that should not be returned

**Problem 2 — Ranking (short words, 3–5 chars)**:
For words of 3–5 characters, `fuzziness: 'AUTO'` allows 1-edit matches to common English words:

- "apple" (5) → "apply" (1 edit: `e` → `y`) — "apply" in thousands of PE/English transcripts
- "tree" (4) → "three" (1 edit: insert `h`) — "three" in virtually every transcript
- "tree" (4) → "true" (1 edit: `e` → `u`) — "true" in virtually every transcript

These common words appear thousands of times in transcript fields (`lesson_content`, `lesson_structure`), which are weighted alongside structured metadata. The transcript matches amplify false positives because the same fuzzy match is counted in both BM25 content and BM25 structure retrievers.

Words of 6+ characters (like "mountain") do not suffer this because 2-edit matches to common words are rare.

---

## Root Cause Analysis

### 1. `fuzziness: 'AUTO'` for short words (PRIMARY CAUSE for ranking)

In `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts`:

```typescript
const bm25Config = scope === 'lesson'
  ? { fuzziness: 'AUTO' as const, minimum_should_match: '2<65%' }
  : { fuzziness: 'AUTO:3,6' as const, prefix_length: 1, fuzzy_transpositions: true };
```

For lessons, `fuzziness: 'AUTO'` means:
- 0–2 chars: 0 edits (exact match)
- 3–5 chars: 1 edit allowed
- 6+ chars: 2 edits allowed

For single-word queries of 3–5 characters, 1 edit is enough to match extremely common English words ("apply", "three", "true"), creating thousands of false positives.

Note: units already use `fuzziness: 'AUTO:3,6'` with `prefix_length: 1` — a more conservative configuration that would reduce but not eliminate this problem.

### 2. No minimum score threshold (PRIMARY CAUSE for volume)

No `min_score` is applied to the Elasticsearch query or post-processing. The full RRF result set is returned regardless of score. Scores in the 0.03–0.06 range are extremely weak matches that should be filtered out.

### 3. ELSER semantic retrievers surface loosely related content

The four-way RRF combines two BM25 retrievers and two ELSER semantic retrievers. ELSER assigns non-zero similarity to almost any document for any query, contributing to the universal volume problem. Even documents with no lexical match to the query receive a small ELSER score, keeping them in the result set.

### 4. Transcript content amplifies false positives

Transcript-derived fields (`lesson_content`, `lesson_structure`) contain natural speech with common words like "apply", "three", and "true" repeated thousands of times across the index. These fields are included in both the content and structure BM25 retrievers:

```typescript
const LESSON_BM25_CONTENT = [
  'lesson_title^3',
  'lesson_keywords^2',
  'key_learning_points^2',
  'misconceptions_and_common_mistakes',
  'teacher_tips',
  'content_guidance',
  'lesson_content',        // ← transcript-derived, unweighted
];

const LESSON_BM25_STRUCTURE = [
  'lesson_structure^2',    // ← transcript-derived, boosted
  'lesson_title^3',
];
```

Structured metadata fields (`lesson_title^3`, `lesson_keywords^2`) have boost factors, but the transcript fields contribute enough raw term frequency to outweigh them when a fuzzy-matched term appears hundreds of times in a document.

---

## Impact Analysis

### On MCP tool consumers (AI agents)

An AI agent using the `search` MCP tool receives 8,000+ results for any single-word query. The agent's context window fills with noise, making it impractical to use the search results. For "apple" and "tree", the noise is not just volume but also ranking — irrelevant results appear above or interleaved with relevant ones.

### On precision at K

| Query | Precision@5 | Precision@10 | Notes |
|-------|-------------|--------------|-------|
| "apple" | 0.20 (1/5) | 0.20 (2/10) | PE "apply" dominates |
| "tree" | 0.80 (4/5) | 0.60 (6/10) | Maths "tree diagrams" dilute |
| "mountain" | 0.60 (3/5) | 0.40 (4/10) | "Story mountain" dilutes |

### On teacher experience

A teacher searching for "apple" in a curriculum tool sees PE lessons about "applying tactics" before cooking lessons about apples. This fundamentally undermines trust in search quality.

---

## Query Pipeline (reference)

```text
MCP search(text="apple", scope="lessons")
  → removeNoisePhrases() → cleanedText
  → detectCurriculumPhrases() → phrases[]
  → buildFourWayRetriever():
     1. BM25 Content (fuzziness: AUTO, min_should_match: '2<65%')
     2. ELSER Semantic Content
     3. BM25 Structure (fuzziness: AUTO, min_should_match: '2<65%')
     4. ELSER Semantic Structure
  → RRF (rank_window_size: 80, rank_constant: 60)
  → normaliseTranscriptScores()
  → 8,329 results (no min_score filtering)
```

---

## Ground Truth

A cross-subject ground truth has been created to capture the "apple" failure:

**File**: `apps/oak-search-cli/src/lib/search-quality/ground-truth/cross-subject/apple-lessons.ts`

**Type**: `CrossSubjectLessonGroundTruth` (new type — no subject/phase/keyStage filters)

| Expected slug | Relevance | Rationale |
|---------------|-----------|-----------|
| `making-apple-flapjack-bites` | 3 | Directly about making apple-based food |
| `producing-our-food` | 2 | Apples are one of several food production examples |
| `selective-breeding-of-plants-non-statutory` | 2 | Apple trees as primary selective breeding example |

**Current search performance**:

- Position of `making-apple-flapjack-bites`: 2 (behind 1 false positive)
- Position of `producing-our-food`: 9
- Position of `selective-breeding-of-plants-non-statutory`: not in top 10

**Design decision**: A new `CrossSubjectLessonGroundTruth` type was created alongside the existing per-subject `LessonGroundTruth` to cleanly represent unfiltered search. The existing 30 per-subject lesson ground truths (MRR 0.983) are untouched. See [apple ground truth plan](../../../../.cursor/plans/apple_ground_truth_1b4fb3b7.plan.md) for full design rationale.

**Follow-on work**: Additional cross-subject ground truths for "tree" and "mountain" should be created following the same pattern. The benchmark runner needs adaptation to support cross-subject queries (currently always passes `subject` to the search SDK).

---

## Remediation Options

These are the changes to evaluate, roughly in priority order. Each should be tested against the cross-subject ground truths and the existing 30 per-subject ground truths (MRR 0.983, NDCG@10 0.944) to ensure no regression.

### Option 1: Reduce fuzziness for short words

**Change**: Replace `fuzziness: 'AUTO'` with `fuzziness: 'AUTO:4,7'` (or similar) for lesson BM25 queries. This raises the edit-distance thresholds:

- `AUTO:4,7` → 0 edits for 1–3 chars, 1 edit for 4–6, 2 edits for 7+
- Compare current `AUTO` → 0 edits for 1–2 chars, 1 edit for 3–5, 2 edits for 6+

This would prevent "apple" matching "apply" and "tree" matching "three"/"true".

Alternative: use `fuzziness: 0` (exact match) for single-word queries under 6 characters.

**File**: `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts`

**Impact**: High — directly eliminates the primary cause of short-word ranking pollution.

**Risk**: May reduce recall for genuine fuzzy matches (typo correction). Needs ground truth validation.

### Option 2: Add `min_score` threshold

**Change**: Apply a minimum score filter to the Elasticsearch query or in post-processing. Any result below the threshold is excluded.

**Calibration needed**: The threshold must be set empirically — too high risks filtering genuine results; too low has no effect. Current relevant results score 0.05–0.06; noise scores 0.03. A threshold around 0.04–0.05 might work.

**File**: `packages/sdks/oak-search-sdk/src/retrieval/create-retrieval-service.ts` or `rrf-query-helpers.ts`

**Impact**: High — directly addresses the volume problem. Would reduce 8,000+ results to a manageable set.

**Risk**: RRF scores are relative and may shift when index content changes. Needs ongoing calibration.

### Option 3: Reduce transcript field weighting

**Change**: Lower the weight of transcript-derived fields (`lesson_content`, `lesson_structure`) relative to structured metadata (`lesson_title`, `lesson_keywords`). Options:

- Add explicit boost factors: `lesson_content^0.5` instead of unweighted
- Remove `lesson_content` from BM25 content and rely on ELSER for semantic coverage
- Apply a separate fuzziness config for transcript fields (e.g., exact match only)

**File**: `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts`

**Impact**: Medium — reduces false positive amplification but doesn't eliminate it.

**Risk**: May reduce recall for lessons where the query term appears only in transcript.

### Option 4: Review synonym and analyser configuration

**Change**: Check whether `oak_syns_filter` or other index analysers include unexpected mappings that broaden matches. Inspect the index template at `packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/`.

**Impact**: Low-to-medium — depends on what the analyser configuration contains.

### Option 5: Query-aware fuzziness (longer term)

**Change**: Dynamically set fuzziness based on query characteristics:

- Single-word queries under 6 chars → `fuzziness: 0` (exact match)
- Single-word queries 6+ chars → `fuzziness: 1`
- Multi-word queries → `fuzziness: 'AUTO'` (typo correction more valuable)

**File**: `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts` or new query analysis module

**Impact**: High — tailors behaviour to query type.

**Risk**: Adds complexity. Needs careful testing against all ground truths.

---

## Files to Investigate

- `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts` — fuzziness and field weights
- `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-helpers.ts` — filter builders, score normalisation
- `packages/sdks/oak-search-sdk/src/retrieval/create-retrieval-service.ts` — query preprocessing
- `packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/oak-lessons.ts` — index analysers and mappings
- `apps/oak-search-cli/evaluation/analysis/benchmark-query-runner-lessons.ts` — benchmark runner (needs cross-subject support)
- `apps/oak-search-cli/evaluation/analysis/benchmark-adapters.ts` — ground truth grouping (currently groups by subject)

---

## Acceptance Criteria

1. A query for "apple" in lessons returns `making-apple-flapjack-bites` as the #1 result
2. Irrelevant fuzzy matches (e.g., PE "apply" lessons) are excluded or ranked well below relevant results
3. Total result counts reflect genuinely matched lessons, not the entire index
4. The cross-subject ground truth `APPLE_LESSONS` achieves MRR > 0.5 (first relevant result in top 2)
5. Additional cross-subject ground truths for "tree" and "mountain" pass their acceptance criteria
6. Existing per-subject ground truths maintain MRR ≥ 0.95 (no regression from current 0.983)
