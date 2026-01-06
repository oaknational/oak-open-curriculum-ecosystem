# Evaluation Analysis

Unified search quality measurement using the Ground Truth Registry.

## Purpose

Evaluation scripts **measure** search quality to quantify the impact of changes.
This is fundamentally different from smoke tests, which **verify** behavior works.

| Concern        | Tool               | Question                 | Output            |
| -------------- | ------------------ | ------------------------ | ----------------- |
| **Evaluation** | `benchmark.ts`     | "How well does it work?" | MRR, NDCG metrics |
| **Smoke Test** | `smoke-tests/*.ts` | "Does it work?"          | Pass/fail         |

**Never conflate these concerns.** Evaluation measures quality; smoke tests verify behavior.

## Single Benchmark Tool

All search quality evaluation is consolidated into one tool: `benchmark.ts`

### Usage

```bash
# Run all ground truths from the registry
pnpm benchmark --all

# Run for a specific subject
pnpm benchmark --subject maths

# Run for a specific phase
pnpm benchmark --phase secondary

# Run for a specific subject/phase combination
pnpm benchmark --subject maths --phase ks4
```

### What It Measures

- **MRR (Mean Reciprocal Rank)**: Position of first relevant result
- **NDCG@10**: Ranking quality across top 10 results
- **Zero-hit rate**: Percentage of queries returning no results
- **Query count**: Number of queries evaluated

### Output

```text
================================================================================
BENCHMARK RESULTS
================================================================================
Subject/Phase      | Queries | MRR    | NDCG@10 | Zero-hit
-------------------|---------|--------|---------|----------
maths/secondary    | 20      | 0.894  | 0.782   | 0.0%
maths/ks4          | 5       | 0.850  | 0.720   | 0.0%
science/primary    | 15      | 0.852  | 0.695   | 0.0%
...
================================================================================
```

## Ground Truth Registry

The benchmark uses `GROUND_TRUTH_ENTRIES` from the registry as the single source
of truth. Each entry contains:

- `subject`: The Oak curriculum subject slug
- `phase`: `primary` | `secondary` | `ks4`
- `queries`: Ground truth queries with expected relevance judgments
- `baselineMrr`: Documented MRR baseline (for reference, not used by benchmark)

See `src/lib/search-quality/ground-truth/registry/` for implementation.

## Phase Definitions

- **primary**: KS1 + KS2 (Years 1-6) content
- **secondary**: KS3 + general secondary content
- **ks4**: KS4-specific scenarios with additional structural complexity
  - Tier variants (Maths, Science)
  - Exam subject split (Science: biology, chemistry, physics)
  - Set texts / unit options (English, Geography, History)

KS4 ground truths are stored in `subject/secondary/ks4/` directories and test
KS4-specific query patterns that don't apply to KS3.

## Adding Ground Truths

To add new ground truths:

1. Create query files in `src/lib/search-quality/ground-truth/{subject}/{phase}/`
2. Export an `ALL_QUERIES` array from the index
3. Add entry to `GROUND_TRUTH_ENTRIES` in `registry/entries.ts`
4. Run benchmark to measure initial MRR
5. Update `baselineMrr` with measured value

## Related Documentation

- [ADR-098](../../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) - Registry architecture
- [current-state.md](../../../../.agent/plans/semantic-search/current-state.md) - Current system metrics
- [DATA-VARIANCES.md](../../../../docs/data/DATA-VARIANCES.md) - Curriculum data differences by subject
