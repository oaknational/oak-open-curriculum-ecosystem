# Evaluation Analysis

Unified search quality measurement using the Ground Truth Registry.

## Purpose

Evaluation scripts **measure** search quality to quantify the impact of changes.
This is fundamentally different from smoke tests, which **verify** behavior works.

| Concern        | Tool                   | Question                 | Output         |
| -------------- | ---------------------- | ------------------------ | -------------- |
| **Evaluation** | `benchmark-lessons.ts` | "How well does it work?" | All IR metrics |
| **Smoke Test** | `smoke-tests/*.ts`     | "Does it work?"          | Pass/fail      |

**Never conflate these concerns.** Evaluation measures quality; smoke tests verify behavior.

## Single Benchmark Tool

All search quality evaluation is consolidated into one tool: `benchmark-lessons.ts`

### Usage

```bash
# Run all ground truths from the registry
pnpm benchmark:lessons --all

# Run for a specific subject
pnpm benchmark:lessons --subject maths

# Run for a specific phase
pnpm benchmark:lessons --phase secondary

# Run for a specific subject/phase combination
pnpm benchmark:lessons --subject maths --phase secondary

# Review mode: detailed per-query output for ground truth investigation
pnpm benchmark:lessons --subject maths --phase secondary --review

# Issues mode: generate markdown report of all problematic queries
pnpm benchmark:lessons --issues
```

### What It Measures

All metrics from [IR-METRICS.md](../../docs/IR-METRICS.md):

| Metric            | Description                                              |
| ----------------- | -------------------------------------------------------- |
| **MRR**           | Mean Reciprocal Rank — position of first relevant result |
| **NDCG@10**       | Normalized Discounted Cumulative Gain — ranking quality  |
| **Precision@3**   | Proportion of top 3 results that are relevant            |
| **Recall@10**     | Proportion of relevant results found in top 10           |
| **Zero-hit rate** | Percentage of queries with no relevant results           |
| **p95 Latency**   | 95th percentile query latency in milliseconds            |

### Output

```text
===========================================================================================================
BENCHMARK RESULTS
===========================================================================================================
Subject              | Phase      | #Q   | MRR    | NDCG   | P@3    | R@10   | Zero%  | p95ms
-----------------------------------------------------------------------------------------------------------
maths                | secondary  | 60   | 0.894  | 0.782  | 0.600  | 0.850  | 5.0%   | 245
science              | primary    | 15   | 0.852  | 0.695  | 0.550  | 0.920  | 0.0%   | 198
...
-----------------------------------------------------------------------------------------------------------

OVERALL: 100 queries | MRR=0.870 | NDCG=0.745 | P@3=0.580 | R@10=0.880 | Zero=3.2% | p95=267ms
```

## Baselines

Baselines are stored separately from ground truths in `evaluation/baselines/baselines.json`:

```json
{
  "referenceValues": {
    "mrr": { "excellent": 0.90, "good": 0.70, "target": 0.70 },
    "ndcg10": { "excellent": 0.85, "good": 0.75, "target": 0.75 },
    ...
  },
  "measuredBaselines": {
    "entries": {
      "maths/secondary": { "mrr": 0.894, "ndcg10": 0.782, ... },
      ...
    }
  }
}
```

- **Reference values**: Industry-standard targets, same for all subjects
- **Measured baselines**: Actual values from the last benchmark run

## Ground Truth Registry

The benchmark uses `GROUND_TRUTH_ENTRIES` from the registry as the single source
of truth. Each entry contains:

- `subject`: The Oak curriculum subject slug
- `phase`: `primary` | `secondary` (KS4 is part of secondary)
- `queries`: Ground truth queries with expected relevance judgments

See `src/lib/search-quality/ground-truth/registry/` for implementation.

## Ground Truth Validation

Before running benchmarks, validate that all slugs exist in the bulk data:

```bash
pnpm ground-truth:validate
```

See `GROUND-TRUTH-GUIDE.md` for the full process of creating valid ground truths.

## Phase Definitions

- **primary**: KS1 + KS2 (Years 1-6) content
- **secondary**: KS3 + KS4 (Years 7-11) content

**KS4 Special Case**: KS4 is part of secondary but has additional structural
complexity. KS4-specific queries have `keyStage: 'ks4'` set on individual query
objects for correct ES filtering:

- Tier variants (Maths, Science)
- Exam subject split (Science: biology, chemistry, physics)
- Set texts / unit options (English, Geography, History)

KS4 ground truths are stored in `subject/secondary/ks4/` directories.

## Adding Ground Truths

Follow the step-by-step process in `GROUND-TRUTH-GUIDE.md`:

1. Download bulk data for your subject/phase
2. Explore available lessons using jq queries
3. Create queries with expected slugs and relevance scores
4. Validate slugs with `pnpm ground-truth:validate`
5. Run benchmark to measure initial metrics
6. Update baselines.json with measured values

## Related Documentation

- [IR-METRICS.md](../../docs/IR-METRICS.md) - Metric definitions and interpretation
- [GROUND-TRUTH-GUIDE.md](../../src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) - Design and evaluation guide
- [ADR-098](../../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) - Registry architecture
