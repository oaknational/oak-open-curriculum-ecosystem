---
name: ground-truth-evaluation
description: Evaluate and validate ground truths for Oak semantic search using the COMMIT protocol. Use when reviewing existing ground truths, diagnosing low MRR scores, interpreting benchmark results, or running pnpm benchmark.
---

# Ground Truth Evaluation

Validate existing ground truths to ensure they accurately represent what search SHOULD return.

## Priorities

1. **Minimal working system** — Prove the approach with ~33 foundational ground truths
2. **Product integration** — Integrate semantic search into useful teacher tools
3. **Expansion** — Once proven, plan GT expansions for improved coverage

## Core Principles

### We Test OUR Value, Not Elasticsearch

We know Elasticsearch works. We test whether **our search service with our data** delivers value to teachers. Don't evaluate ground truths for morphological variation, disambiguation, or other ES features.

### We Enable Teachers, Not Police Them

When evaluating, don't flag "difficulty mismatch" as an issue. Teachers can search for anything.

### Metadata Is the Default

ALL search works on metadata. Don't evaluate MFL/PE differently because they lack transcripts — metadata-based search is the foundation for ALL subjects.

### No Redundant Subject Terms

Flag queries that include the subject name when already filtered. "French negation" filtered to French is redundant.

## Critical: Teacher Persona

**ALL ground truths are from the perspective of a PROFESSIONAL TEACHER in the UK** searching for curriculum content to teach. When evaluating, always ask: "Would a UK teacher searching for this topic find these lessons useful?"

## Bulk Data Access

**IMPORTANT**: The `bulk-downloads/` directory is gitignored. Cursor tools (LS, Glob, Grep) will NOT see these files.

Use shell commands:

```bash
ls bulk-downloads/
jq '.lessons[] | {slug: .lessonSlug, title: .lessonTitle}' bulk-downloads/SUBJECT-PHASE.json
```

## Cardinal Rules

### Rule 1: Search Might Be RIGHT. Expected Slugs Might Be WRONG.

When MRR is low, ask: "Are the expected slugs actually the best matches?"

Session 9 proved this: MRR 0.000 was blamed on "search quality". After investigation, expected slugs used "emotions" but query said "feel". Search correctly prioritised "feelings" lessons. After correction: MRR 0.000 → 1.000.

### Rule 2: Form YOUR Assessment BEFORE Seeing Search Results

True independent discovery means: identify best lessons from curriculum content, COMMIT to rankings, ONLY THEN compare with search.

**This is NOT independent discovery**:

1. Run benchmark
2. See what search returned
3. Justify those results as "good"

### Rule 3: Every Query Requires FRESH Analysis

Even when queries have "similar semantic intent", you MUST do fresh bulk exploration for EACH query. Copying expected slugs is FORBIDDEN.

## Foundational Ground Truth Structure

The current system uses `LessonGroundTruth` entries:

```typescript
export const MATHS_SECONDARY: LessonGroundTruth = {
  subject: 'maths',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'dividing fractions using reciprocals',
  expectedRelevance: {
    'dividing-a-fraction-by-a-fraction': 3,
    'dividing-with-decimals': 2,
    'checking-and-securing-dividing-a-fraction-by-a-whole-number': 2,
  },
  description: 'Lesson teaches dividing fractions by fractions using diagrams and the reciprocal method.',
} as const;
```

### Relevance Scores

| Score | Meaning |
|-------|---------|
| 3 | Direct match — teaches exactly what query asks |
| 2 | Related — covers topic but not directly |
| 1 | Tangential — mentions concept peripherally |

## Metrics Reference

### MRR (Mean Reciprocal Rank)

Position of first relevant result.

| MRR | Meaning |
|-----|---------|
| > 0.90 | Excellent - first result almost always relevant |
| > 0.70 | Good - relevant result usually in top 2 |
| > 0.50 | Fair - relevant result usually in top 3 |
| < 0.50 | Poor - users must scroll |

### NDCG@10 (Normalized Discounted Cumulative Gain)

Overall ranking quality across top 10.

| NDCG | Meaning |
|------|---------|
| > 0.85 | Excellent - near-optimal ranking |
| > 0.75 | Good - highly relevant results near top |
| > 0.60 | Fair - some ranking issues |
| < 0.60 | Poor - significant ranking problems |

### P@3 (Precision at 3)

Of top 3 results, what proportion are relevant?

| P@3 | Meaning |
|-----|---------|
| > 0.80 | Excellent - most results relevant |
| > 0.60 | Good - majority useful |
| > 0.40 | Fair - some noise |
| < 0.40 | Poor - too many irrelevant |

### R@10 (Recall at 10)

Of all relevant results, what proportion found in top 10?

| R@10 | Meaning |
|------|---------|
| > 0.80 | Excellent - finding almost all |
| > 0.60 | Good - finding most |
| > 0.40 | Fair - missing some |
| < 0.40 | Poor - systematically missing content |

### Diagnostic Patterns

| Pattern | Interpretation | Action |
|---------|----------------|--------|
| High R@10 + Low MRR | Results found but poorly ranked | Search ranking issue |
| Low R@10 | Expected slugs not in results | GT likely wrong |
| High MRR + Low NDCG | First result good, rest poor | Ranking tail issue |
| Low P@3 | Too much noise in top results | Query too broad |

## Quick Review Process

### Step 1: Test Query via test-query-lessons.ts

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm tsx src/lib/search-quality/test-query-lessons.ts "query" subject keyStage
```

### Step 2: Explore Curriculum Data

Use MCP tools to verify relevance:

```text
get-lessons-summary: lesson="lesson-slug"
get-units-summary: unit="unit-slug"
```

### Step 3: Verify with Direct ES Queries

For imprecise-input or ranking issues:

```bash
source .env.local
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {"bool": {
      "must": [{"match": {"lesson_title": {"query": "term", "fuzziness": "AUTO"}}}],
      "filter": [{"term": {"subject_slug": "subject"}}]
    }},
    "size": 5,
    "_source": ["lesson_slug", "lesson_title"]
  }' | jq '.hits.hits[]._source'
```

### Step 4: Update Ground Truth

Based on evidence:

1. **Update query** if it lacks differentiation power
2. **Update expectedRelevance** with qualitatively best matches
3. **Update description** to explain what the test proves

### Step 5: Validate

```bash
pnpm type-check
pnpm test
```

## Troubleshooting

### Low MRR Despite Good Results

**Symptom**: Benchmark shows useful results, but expected slugs not found.

**Diagnosis**: Expected slugs may not be the best matches.

**Fix**:

1. Look at what search actually returns
2. Use MCP tools to verify if returned results are qualitatively better
3. Update expectedRelevance if search found genuinely better lessons

### Query Too Broad

**Symptom**: Many relevant results, hard to pick expected slugs.

**Diagnosis**: Query lacks specificity.

**Fix**: Add distinguishing terms:

- "fractions" → "adding fractions unlike denominators"
- "democracy" → "democracy voting elections UK"

### Query/Slug Term Mismatch

**Symptom**: Low MRR, expected slugs don't contain query terms.

**Diagnosis**: Query says "verbs" but expected slugs have "avoir" without "verb" in keywords.

**Fix**: Either redesign query to match content terminology, or find slugs that actually contain query-relevant terms.

## Anti-Patterns

### Search Validation (NOT Independent Discovery)

**WRONG**:

1. Run benchmark → see search returns A, B, C
2. Get MCP summaries for A, B, C
3. Note they have relevant content
4. Conclude "A, B, C are good"
5. COMMIT table matches search exactly

**CORRECT**:

1. Search bulk data → find candidates X, Y, Z, A, B, W... (10+ slugs)
2. Analyse each against query
3. Realise X and Y directly match; A and B are tangential
4. COMMIT: X=#1, Y=#2, W=#3 (BEFORE seeing search)
5. Run benchmark → see search returns A, B, C
6. Three-way comparison shows differences
7. Conclude: "X and Y are better because..."

### Title-Only Discovery

**WRONG**: Only examine lessons with matching titles.

**CORRECT**: Review ALL units. MCP summaries reveal content that titles don't suggest.

## Additional Resources

For design principles, category-specific guidance, and lessons learned from 25+ review sessions:

@apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md
@apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md
