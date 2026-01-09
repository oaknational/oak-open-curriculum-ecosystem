# IR Metrics Guide for Search Quality Evaluation

**Last Updated**: 2026-01-06

**Purpose**: Reference guide for Information Retrieval (IR) metrics used in search quality evaluation  
**Audience**: Developers unfamiliar with IR assessment protocols  
**Used By**: Search quality evaluation, smoke tests, experiment analysis

---

## Why These Metrics?

Information Retrieval (IR) metrics measure how well search results match what users actually want. We use industry-standard metrics that balance "did we find the right thing?" with "did we find it quickly?"

> **Note**: The targets in this document are **industry benchmarks** for reference. For **project-specific acceptance thresholds** (which are more lenient given curriculum search complexity), see [search-acceptance-criteria.md](../../../.agent/plans/semantic-search/search-acceptance-criteria.md).

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

### Precision@k

**What it measures**: Of the top k results, what proportion are relevant?

**How it works**: Count relevant results in top k, divide by k.

**Calculation**: `(relevant results in top k) / k`

```text
Top 10 results: [✓, ✓, ✗, ✓, ✗, ✗, ✗, ✗, ✗, ✗]
Relevant: 3
Precision@10 = 3/10 = 0.30
```

**Target**: Precision@10 > 0.50 means at least half of the top 10 results are relevant.

| Precision@10 | Meaning                                  |
| ------------ | ---------------------------------------- |
| > 0.70       | Excellent - most results are relevant    |
| > 0.50       | Good - majority of results are useful    |
| > 0.30       | Fair - some noise in results             |
| < 0.30       | Poor - too many irrelevant results shown |

**When to use**: Precision matters when users are overwhelmed by irrelevant results. High precision = less noise.

---

### Recall@k

**What it measures**: Of all the relevant results that exist, what proportion did we find in the top k?

**How it works**: Count relevant results in top k, divide by total relevant results in ground truth.

**Calculation**: `(relevant results in top k) / (total relevant in ground truth)`

```text
Ground truth has 5 relevant results
Top 10 contains 3 of them
Recall@10 = 3/5 = 0.60
```

**Target**: Recall@10 > 0.70 means we're finding most of the relevant content.

| Recall@10 | Meaning                                         |
| --------- | ----------------------------------------------- |
| > 0.80    | Excellent - finding almost all relevant results |
| > 0.60    | Good - finding most relevant results            |
| > 0.40    | Fair - missing some relevant results            |
| < 0.40    | Poor - systematically missing relevant content  |

**When to use**: Recall matters when users need to find ALL relevant content. Low recall = missing results.

---

### Precision vs Recall Trade-off

These metrics have an inherent trade-off:

- **High Precision, Low Recall**: Very selective — few results, but they're good
- **High Recall, Low Precision**: Very inclusive — finds everything, but with noise
- **Balanced**: MRR and NDCG implicitly balance both

**For curriculum search**: We prioritise MRR (finding ONE good result fast) but monitor Precision/Recall to detect if we're missing content (low recall) or showing too much noise (low precision).

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
3. **Validate slugs exist** using MCP tools or the validation script
4. **Add to registry** in `src/lib/search-quality/ground-truth/registry/entries.ts`

### Validating Ground Truth

**Critical**: All slugs must be validated against the live Oak API before use.

```bash
# Validate all ground truth slugs
pnpm tsx evaluation/validation/validate-ground-truth.ts
```

See [ADR-085: Ground Truth Validation Discipline](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md).

---

## Two Categories of Tools

We use IR metrics in two distinct ways:

| Category        | Question Answered                            | When Run             | Output             |
| --------------- | -------------------------------------------- | -------------------- | ------------------ |
| **Evaluations** | "Did this change improve/regress quality?"   | Before/after changes | Metrics to compare |
| **Smoke Tests** | "Is our search service working as expected?" | CI/CD, deployment    | Pass/fail          |

---

## Running Evaluations

**Purpose**: Measure search quality to compare before/after making changes.

```bash
cd apps/oak-open-curriculum-semantic-search

# Unified benchmark tool (the only evaluation tool)
pnpm benchmark --all                              # All subjects, all phases
pnpm benchmark --subject maths --phase secondary  # Specific scope
pnpm benchmark --phase primary --verbose          # Detailed output
```

**Output**: MRR, NDCG@10, zero-hit rate, per-entry breakdown — use to compare before vs after your change.

---

## Running Smoke Tests

**Purpose**: Verify search service meets baseline expectations.

```bash
# Runs all smoke tests including search-baseline
pnpm smoke:dev:stub
```

**What it checks**:

- Iterates ALL subject/phase combinations from `GROUND_TRUTH_REGISTRY`
- Asserts MRR >= baseline for each (with 5% regression tolerance)
- Single pass/fail: "Is search working?"

---

## Recording Results

All experiment results should be recorded in:

- **EXPERIMENT-LOG.md**: `.agent/evaluations/EXPERIMENT-LOG.md`
- **Experiment files**: `.agent/evaluations/experiments/`

---

## Related Documentation

| Document                                                                                                | Purpose                       |
| ------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [GROUND-TRUTH-PROCESS.md](../src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md)               | Ground truth creation process |
| [EXPERIMENTAL-PROTOCOL.md](../../../.agent/evaluations/EXPERIMENTAL-PROTOCOL.md)                        | How to run experiments        |
| [search-acceptance-criteria.md](../../../.agent/plans/semantic-search/search-acceptance-criteria.md)    | Per-category MRR thresholds   |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Ground truth validation       |
| [ADR-098](../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md)              | Ground truth registry         |
| [M3 Plan](../../../.agent/plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md)      | Current search quality work   |

---

## Further Reading

- [NDCG Wikipedia](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
- [MRR Wikipedia](https://en.wikipedia.org/wiki/Mean_reciprocal_rank)
- [Precision and Recall Wikipedia](https://en.wikipedia.org/wiki/Precision_and_recall)
- [Elasticsearch: Measuring Search Relevance](https://www.elastic.co/blog/evaluating-search-relevance)
