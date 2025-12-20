# Search Baselines

Baseline measurements documenting current system behaviour for comparison.

---

## All Baselines

| Baseline | Date | Key Metrics |
|----------|------|-------------|
| [Hard Query Baseline](./hard-query-baseline.md) | 2025-12-19 | Lesson MRR: 0.367, Unit MRR: 0.811 |

---

## Hard Query Baseline

**Purpose**: Establish baseline performance on challenging queries (misspellings, synonyms, multi-concept, colloquial, intent-based).

**Key Findings**:
- 4-way hybrid RRF achieves Lesson MRR 0.367, Unit MRR 0.811
- 5 of 8 lesson failures are vocabulary gaps (fixable with synonyms)
- Misspellings cause 3 of 8 failures (fuzzy/phonetic needed)

**Used By**:
- [Comprehensive Synonym Coverage](../experiments/comprehensive-synonym-coverage.experiment.md) — Used baseline failure analysis to target vocabulary gaps

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Experiments](../experiments/index.md) | A/B experiments comparing approaches |
| [EXPERIMENT-PRIORITIES.md](../experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap |
