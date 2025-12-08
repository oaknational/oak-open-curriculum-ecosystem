# IR Metrics Guide for Search Quality Evaluation

**Purpose**: Reference guide for Information Retrieval (IR) metrics used in search quality evaluation  
**Audience**: Developers unfamiliar with IR assessment protocols  
**Used By**: Phase 1C (Baseline), Phase 2 (Three-Way Comparison), Phase 3+ (Relevance Enhancement)

---

## Phase 1C Implementation Checklist

Before diving into theory, here's the concrete implementation order:

1. **Step 0: Discover actual data** - Query ES to see what lessons exist in Maths KS4
2. **Step 1: Create ground truth** - Judge relevance of actual results (not placeholder slugs)
3. **Step 2: Implement metrics** - MRR and NDCG calculation functions
4. **Step 3: Create E2E test** - Automated evaluation against live search
5. **Step 4: Run and analyze** - Execute tests, record results
6. **Step 5: Decide** - Two-way sufficient or proceed to Phase 2?

---

## Search API Reference

### Endpoint

**POST** `/api/search`

### Request Body

```typescript
{
  text: string;           // Search query
  scope: 'lessons';       // Use 'lessons' for baseline (also: 'units', 'sequences')
  subject?: 'maths';      // Filter by subject
  keyStage?: 'ks4';       // Filter by key stage
  size?: number;          // Results per page (default 25)
  highlight?: boolean;    // Include highlights
  includeFacets?: boolean;
}
```

### Response Structure

```typescript
{
  scope: 'lessons';
  total: number;
  took: number; // Time in ms
  timedOut: boolean;
  results: Array<{
    id: string;
    rankScore: number;
    lesson: {
      lesson_slug: string; // ← Use this for ground truth
      lesson_title: string;
      lesson_id: string;
      subject_slug: string;
      key_stage: string;
      // ... other fields
    };
    highlights: string[];
  }>;
}
```

### Example cURL

```bash
curl -X POST http://localhost:3333/api/search \
  -H "Content-Type: application/json" \
  -d '{"text":"Pythagoras theorem","scope":"lessons","subject":"maths","keyStage":"ks4","size":10}'
```

---

## Why These Metrics?

Information Retrieval (IR) metrics measure how well search results match what users actually want. We use industry-standard metrics that balance "did we find the right thing?" with "did we find it quickly?"

---

## Metric Definitions

### Mean Reciprocal Rank (MRR)

**What it measures**: How quickly does the user find their first relevant result?

**How it works**:

- If the first result is relevant → score = 1.0
- If the second result is relevant → score = 0.5
- If the third result is relevant → score = 0.33
- If no relevant result in top 10 → score = 0

**Calculation**: Average the reciprocal ranks across all test queries.

```text
Query 1: First relevant at position 1 → 1/1 = 1.0
Query 2: First relevant at position 3 → 1/3 = 0.33
Query 3: First relevant at position 2 → 1/2 = 0.5
MRR = (1.0 + 0.33 + 0.5) / 3 = 0.61
```

**Target**: MRR > 0.70 means on average, the first relevant result appears in position 1-2.

**Interpretation**:

| MRR Score | Meaning                                           |
| --------- | ------------------------------------------------- |
| > 0.90    | Excellent - first result almost always relevant   |
| > 0.70    | Good - relevant result usually in top 2           |
| > 0.50    | Fair - relevant result usually in top 3           |
| < 0.50    | Poor - users must scroll to find relevant results |

---

### NDCG@10 (Normalized Discounted Cumulative Gain)

**What it measures**: How good is the overall ranking of the top 10 results?

**How it works**: Uses graded relevance (not just relevant/not relevant):

- **3 = Highly Relevant**: Exact match for query intent (e.g., "Pythagoras theorem" → lesson titled "Pythagoras' Theorem")
- **2 = Relevant**: Related and useful (e.g., "Pythagoras" → lesson on "Right-angled triangles")
- **1 = Marginally Relevant**: Tangentially related (e.g., "Pythagoras" → general geometry lesson)
- **0 = Not Relevant**: Wrong topic entirely

**Calculation** (simplified):

1. Score each result position (higher positions get more weight)
2. Compare to "ideal" ranking (all 3s at top, then 2s, then 1s)
3. Divide actual score by ideal score → value between 0 and 1

**Formula**:

```text
DCG@k = Σ (2^rel_i - 1) / log₂(i + 1)  for i = 1 to k

NDCG@k = DCG@k / IDCG@k

where IDCG is DCG with perfectly ranked results
```

**Target**: NDCG@10 > 0.75 means ranking quality is good across all top 10 results.

**Interpretation**:

| NDCG Score | Meaning                                 |
| ---------- | --------------------------------------- |
| > 0.85     | Excellent - near-optimal ranking        |
| > 0.75     | Good - highly relevant results near top |
| > 0.60     | Fair - some ranking issues              |
| < 0.60     | Poor - significant ranking problems     |

---

### Zero-Hit Rate

**What it measures**: What percentage of queries return no results?

**Calculation**: `(queries with 0 results) / (total queries) × 100%`

**Target**: < 10% means fewer than 1 in 10 queries fail completely.

**Interpretation**:

| Zero-Hit Rate | Meaning                                                  |
| ------------- | -------------------------------------------------------- |
| < 5%          | Excellent - nearly all queries return results            |
| < 10%         | Good - acceptable coverage                               |
| < 20%         | Fair - some vocabulary gaps                              |
| > 20%         | Poor - significant content or query understanding issues |

---

### p95 Latency

**What it measures**: 95% of queries complete within this time.

**Why p95 not average?**: Averages hide outliers. p95 ensures most users have good experience.

**Target**: < 300ms for good user experience.

**Interpretation**:

| p95 Latency | Meaning                   |
| ----------- | ------------------------- |
| < 100ms     | Excellent - feels instant |
| < 300ms     | Good - responsive         |
| < 500ms     | Fair - noticeable delay   |
| > 500ms     | Poor - frustrating wait   |

---

## Creating Ground Truth (Relevance Judgments)

Before measuring metrics, you must define what "relevant" means for each test query.

### Relevance Scale

| Score | Label               | Definition                   | Example                                                   |
| ----- | ------------------- | ---------------------------- | --------------------------------------------------------- |
| 3     | Highly Relevant     | Exact match for query intent | "Pythagoras theorem" → "Pythagoras' Theorem Introduction" |
| 2     | Relevant            | Related and useful           | "Pythagoras" → "Right-angled Triangles"                   |
| 1     | Marginally Relevant | Tangentially related         | "Pythagoras" → "Properties of Triangles"                  |
| 0     | Not Relevant        | Wrong topic                  | "Pythagoras" → "Solving Linear Equations"                 |

### Ground Truth File Structure

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth.ts`

**⚠️ IMPORTANT**: The slugs below are PLACEHOLDERS. You MUST run the discovery script (Step 0) first and replace these with actual lesson slugs from the Maths KS4 dataset.

```typescript
/**
 * Ground truth relevance judgments for search quality evaluation.
 *
 * ⚠️ POPULATE THESE FROM DISCOVERY SCRIPT OUTPUT
 *
 * Relevance scores:
 * - 3: Highly relevant (exact match for query intent)
 * - 2: Relevant (related and useful)
 * - 1: Marginally relevant (tangentially related)
 * - 0: Not relevant (implicit - unlisted results assumed 0)
 */
export const GROUND_TRUTH_QUERIES = [
  {
    query: 'Pythagoras theorem',
    // TODO: Replace with actual slugs from discovery script
    expectedRelevance: {
      // lesson_slug → relevance score
      // Example after running discovery:
      // 'pythagoras-theorem-6m4k2c': 3,
      // 'applying-pythagoras-8j2k1d': 3,
    } as Record<string, number>,
  },
  {
    query: 'quadratic equations',
    expectedRelevance: {
      // TODO: Replace with actual slugs
    } as Record<string, number>,
  },
  {
    query: 'trigonometry',
    expectedRelevance: {
      // TODO: Replace with actual slugs
    } as Record<string, number>,
  },
  {
    query: 'simultaneous equations',
    expectedRelevance: {
      // TODO: Replace with actual slugs
    } as Record<string, number>,
  },
  {
    query: 'expanding brackets',
    expectedRelevance: {
      // TODO: Replace with actual slugs
    } as Record<string, number>,
  },
];
```

### How to Create Ground Truth (Concrete Steps)

1. **Run discovery script** (Step 0) to see actual lesson slugs
2. **For each query**, look at the top 10 results returned
3. **For each result**, ask: "If a teacher searched for X, would this lesson help?"
   - **3**: "Perfect! This is exactly what they're looking for"
   - **2**: "Good, this is clearly related and useful"
   - **1**: "Maybe useful, but not directly what they want"
   - **0**: "Wrong topic, not helpful" (don't list these - implicit)
4. **Copy the lesson_slug** from discovery output into ground truth file
5. **Assign your relevance score** (3/2/1)

### Judging Maths KS4 Content Specifically

| Query                    | Score 3 (Highly Relevant)          | Score 2 (Relevant)                       | Score 1 (Marginal)      |
| ------------------------ | ---------------------------------- | ---------------------------------------- | ----------------------- |
| "Pythagoras theorem"     | Lessons with "Pythagoras" in title | Right-angled triangles, distance formula | General geometry        |
| "quadratic equations"    | Solving/factorising quadratics     | Completing the square, quadratic formula | Graphing parabolas      |
| "trigonometry"           | SOHCAHTOA, trig ratios             | Sine/cosine rule, trig graphs            | Triangles in general    |
| "simultaneous equations" | Substitution/elimination methods   | Graphical solutions                      | Linear equations        |
| "expanding brackets"     | Single/double bracket expansion    | Factorising                              | Simplifying expressions |

### Minimum Query Set

For meaningful metrics, include at least:

- **5-10 representative queries** covering main Maths KS4 topics
- **2-3 edge cases** - misspellings like "pythagorus", synonyms like "quadratics"
- **1-2 harder queries** - e.g., "how to solve equations with x squared"

---

## Metrics Implementation

### MRR Calculation

```typescript
/**
 * Calculate Mean Reciprocal Rank.
 *
 * @param results - Array of lesson slugs in ranked order
 * @param relevance - Map of slug → relevance score (3/2/1/0)
 * @returns MRR score (0-1), higher is better
 */
export function calculateMRR(results: string[], relevance: Record<string, number>): number {
  for (let i = 0; i < results.length; i++) {
    const slug = results[i];
    const score = relevance[slug] ?? 0;
    if (score >= 2) {
      // Consider 2+ as "relevant" for MRR
      return 1 / (i + 1);
    }
  }
  return 0; // No relevant result found
}
```

### NDCG Calculation

```typescript
/**
 * Calculate NDCG@k (Normalized Discounted Cumulative Gain).
 *
 * @param results - Array of lesson slugs in ranked order
 * @param relevance - Map of slug → relevance score (3/2/1/0)
 * @param k - Number of results to consider (default 10)
 * @returns NDCG score (0-1), higher is better
 */
export function calculateNDCG(
  results: string[],
  relevance: Record<string, number>,
  k = 10,
): number {
  const topK = results.slice(0, k);

  // Calculate DCG (Discounted Cumulative Gain)
  let dcg = 0;
  for (let i = 0; i < topK.length; i++) {
    const rel = relevance[topK[i]] ?? 0;
    dcg += (Math.pow(2, rel) - 1) / Math.log2(i + 2);
  }

  // Calculate ideal DCG (if results were perfectly ranked)
  const idealOrder = Object.values(relevance)
    .sort((a, b) => b - a)
    .slice(0, k);
  let idcg = 0;
  for (let i = 0; i < idealOrder.length; i++) {
    idcg += (Math.pow(2, idealOrder[i]) - 1) / Math.log2(i + 2);
  }

  return idcg === 0 ? 0 : dcg / idcg;
}
```

---

## Step 0: Discover Actual Data

**CRITICAL**: Before creating ground truth, you MUST query ES to see what lessons actually exist.

### Discovery Script

**File**: `apps/oak-open-curriculum-semantic-search/scripts/discover-lessons.ts`

```typescript
/**
 * Run this first to see actual lesson slugs in Maths KS4.
 * Usage: npx tsx scripts/discover-lessons.ts
 */
const BASE_URL = 'http://localhost:3333';

const TEST_QUERIES = [
  'Pythagoras theorem',
  'quadratic equations',
  'trigonometry',
  'simultaneous equations',
  'expanding brackets',
];

async function discoverLessons(): Promise<void> {
  for (const query of TEST_QUERIES) {
    console.log(`\n=== Query: "${query}" ===\n`);

    const response = await fetch(`${BASE_URL}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: query,
        scope: 'lessons',
        subject: 'maths',
        keyStage: 'ks4',
        size: 10,
      }),
    });

    const data = await response.json();
    console.log(`Total hits: ${data.total}`);
    console.log('Top 10 results:');

    for (const [i, result] of data.results.entries()) {
      console.log(`  ${i + 1}. ${result.lesson.lesson_slug}`);
      console.log(`     Title: ${result.lesson.lesson_title}`);
      console.log(`     Score: ${result.rankScore.toFixed(3)}`);
    }
  }
}

discoverLessons().catch(console.error);
```

### Run Discovery

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm dev &  # Start server
sleep 5
npx tsx scripts/discover-lessons.ts
```

**Output this gives you**: Actual lesson slugs to use in ground truth.

---

## E2E Test Suite Template

**File**: `apps/oak-open-curriculum-semantic-search/e2e-tests/search-quality.e2e.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { GROUND_TRUTH_QUERIES } from '../src/lib/search-quality/ground-truth.js';
import { calculateMRR, calculateNDCG } from '../src/lib/search-quality/metrics.js';

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3333';

interface SearchResult {
  lesson: { lesson_slug: string };
  rankScore: number;
}

interface SearchResponse {
  total: number;
  took: number;
  results: SearchResult[];
}

async function searchLessons(query: string): Promise<{ results: string[]; latency: number }> {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: query,
      scope: 'lessons',
      subject: 'maths',
      keyStage: 'ks4',
      size: 10,
    }),
  });
  const latency = performance.now() - start;
  const data: SearchResponse = await response.json();
  const results = data.results.map((r) => r.lesson.lesson_slug);
  return { results, latency };
}

describe('Search Quality Baseline (Phase 1C)', () => {
  const metrics = {
    mrr: [] as number[],
    ndcg: [] as number[],
    latencies: [] as number[],
    zeroHits: 0,
  };

  for (const { query, expectedRelevance } of GROUND_TRUTH_QUERIES) {
    it(`evaluates: "${query}"`, async () => {
      const { results, latency } = await searchLessons(query);
      metrics.latencies.push(latency);

      if (results.length === 0) {
        metrics.zeroHits++;
      }

      const mrr = calculateMRR(results, expectedRelevance);
      const ndcg = calculateNDCG(results, expectedRelevance, 10);

      metrics.mrr.push(mrr);
      metrics.ndcg.push(ndcg);

      console.log(`Query: "${query}"`);
      console.log(
        `  Results: ${results.length}, MRR: ${mrr.toFixed(3)}, NDCG@10: ${ndcg.toFixed(3)}, Latency: ${latency.toFixed(0)}ms`,
      );
      console.log(`  Top 3: ${results.slice(0, 3).join(', ')}`);
    });
  }

  it('meets baseline targets', () => {
    const avgMRR = metrics.mrr.reduce((a, b) => a + b, 0) / metrics.mrr.length;
    const avgNDCG = metrics.ndcg.reduce((a, b) => a + b, 0) / metrics.ndcg.length;
    const zeroHitRate = metrics.zeroHits / GROUND_TRUTH_QUERIES.length;
    const p95Latency = metrics.latencies.sort((a, b) => a - b)[
      Math.floor(metrics.latencies.length * 0.95)
    ];

    console.log('\n=== BASELINE METRICS ===');
    console.log(`MRR:          ${avgMRR.toFixed(3)} (target: > 0.70)`);
    console.log(`NDCG@10:      ${avgNDCG.toFixed(3)} (target: > 0.75)`);
    console.log(`Zero-hit:     ${(zeroHitRate * 100).toFixed(1)}% (target: < 10%)`);
    console.log(`p95 Latency:  ${p95Latency.toFixed(0)}ms (target: < 300ms)`);

    expect(avgMRR).toBeGreaterThan(0.7);
    expect(avgNDCG).toBeGreaterThan(0.75);
    expect(zeroHitRate).toBeLessThan(0.1);
    expect(p95Latency).toBeLessThan(300);
  });
});
```

---

## Running the Evaluation

```bash
cd apps/oak-open-curriculum-semantic-search

# Start server in background
pnpm dev &
sleep 5

# Run search quality tests
pnpm test:e2e -- search-quality

# Or run manually for debugging
npx tsx scripts/evaluate-search-quality.ts
```

---

## Comparing Approaches (Phase 2+)

When comparing two-way vs three-way hybrid:

| Metric      | Two-Way (BM25+ELSER) | Three-Way (+Dense) | Delta | Decision |
| ----------- | -------------------- | ------------------ | ----- | -------- |
| MRR         | ?                    | ?                  | ?     | ?        |
| NDCG@10     | ?                    | ?                  | ?     | ?        |
| Zero-hit    | ?                    | ?                  | ?     | ?        |
| p95 latency | ?                    | ?                  | ?     | ?        |

**Decision Criteria**:

- **Proceed with three-way if**: MRR or NDCG improves by ≥10% AND latency increase ≤50ms
- **Stay with two-way if**: Improvements < 10% OR latency increase > 50ms

---

## Further Reading

- [NDCG Wikipedia](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
- [MRR Wikipedia](https://en.wikipedia.org/wiki/Mean_reciprocal_rank)
- [Elasticsearch: Measuring Search Relevance](https://www.elastic.co/blog/evaluating-search-relevance)

---

**End of Reference Document**
