# IR Metrics Guide for Search Quality Evaluation

**Last Updated**: 2026-01-03

**Purpose**: Reference guide for Information Retrieval (IR) metrics used in search quality evaluation  
**Audience**: Developers unfamiliar with IR assessment protocols  
**Used By**: Search quality evaluation, experiment analysis

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

- **3 = Highly Relevant**: Exact match for query intent
- **2 = Relevant**: Related and useful
- **1 = Marginally Relevant**: Tangentially related
- **0 = Not Relevant**: Wrong topic entirely

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

### How to Create Ground Truth

1. **Run a search** for each test query
2. **For each result**, ask: "If a teacher searched for X, would this lesson help?"
   - **3**: "Perfect! This is exactly what they're looking for"
   - **2**: "Good, this is clearly related and useful"
   - **1**: "Maybe useful, but not directly what they want"
   - **0**: "Wrong topic, not helpful" (don't list these - implicit)
3. **Record the lesson slug** and relevance score

---

## Running Evaluations

```bash
cd apps/oak-open-curriculum-semantic-search

# Per-category evaluation
pnpm eval:per-category

# Diagnostic evaluation
pnpm eval:diagnostic

# Full metrics breakdown
pnpm tsx evaluation/analysis/full-metrics-breakdown.ts
```

---

## Recording Results

All experiment results should be recorded in:

- **EXPERIMENT-LOG.md**: `.agent/evaluations/EXPERIMENT-LOG.md`
- **Experiment files**: `.agent/evaluations/experiments/`

---

## Further Reading

- [NDCG Wikipedia](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
- [MRR Wikipedia](https://en.wikipedia.org/wiki/Mean_reciprocal_rank)
- [Elasticsearch: Measuring Search Relevance](https://www.elastic.co/blog/evaluating-search-relevance)
