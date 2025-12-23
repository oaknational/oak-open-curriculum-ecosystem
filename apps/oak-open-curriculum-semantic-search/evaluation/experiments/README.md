# Evaluation Experiments

Hypothesis-testing experiments using the Vitest framework to validate search improvements.

## Purpose

Experiments test specific hypotheses about search performance changes, providing repeatable, automated validation with pass/fail assertions.

## Directory Structure

```text
experiments/
├── current/          # Active and accepted experiments
│   ├── hybrid-superiority.experiment.ts
│   ├── mcp-comparison.experiment.ts
│   └── lib/         # Shared experiment utilities
└── historical/      # Rejected or superseded experiments
    └── semantic-reranking/  # B.2 - rejected with -16.8% regression
```

## Running Experiments

**Run all experiments**:

```bash
pnpm vitest run -c vitest.experiment.config.ts
```

**Run specific experiment**:

```bash
pnpm vitest run -c vitest.experiment.config.ts hybrid-superiority
```

**Watch mode** (for development):

```bash
pnpm vitest -c vitest.experiment.config.ts
```

## Current Experiments

### `hybrid-superiority.experiment.ts`

**Hypothesis**: Two-way hybrid (BM25 + ELSER) provides measurable benefit over single retrieval methods.

**Status**: ✅ Accepted (Phase 3.0, 2025-12-12)

**Findings**:

- Lessons: Hybrid MRR 0.908 > BM25 0.892 > ELSER 0.830
- Units: ELSER MRR 0.919 > Hybrid 0.915 > BM25 0.911

**Conclusion**: Hybrid search validated for lessons; ELSER excellent for units.

---

### `mcp-comparison.experiment.ts`

**Purpose**: Compare ES hybrid search results with MCP tool results for cross-validation.

**Status**: ✅ Active (validation tool)

**What it tests**: ES search queries that can be compared against MCP tool access results.

---

## Historical Experiments

### `semantic-reranking/` (B.2)

**Hypothesis**: Cross-encoder semantic reranking will improve hard query MRR by ≥15%.

**Status**: ❌ REJECTED (2025-12-19)

**Result**: -16.8% regression on lesson MRR

**Why rejected**: Generic AI models lack curriculum domain knowledge. This led to [ADR-082: Fundamentals-First Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md).

**Key lesson**: AI on weak fundamentals amplifies weakness. Master fundamentals first (Tiers 1-3) before adding AI (Tier 4).

---

## Experiment Framework

Experiments use shared utilities from `current/lib/`:

- **`experiment-types.ts`** - Type definitions for experiments
- **`experiment-search.ts`** - Search execution helpers
- **`experiment-metrics.ts`** - MRR, NDCG calculations
- **`experiment-runners.ts`** - Orchestration utilities
- **`experiment-logging.ts`** - Structured logging

## Adding New Experiments

When creating a new experiment:

1. **Start in `current/`** directory
2. **Use vitest framework**:

   ```typescript
   import { describe, it, expect } from 'vitest';
   ```

3. **Document hypothesis** in file header
4. **Use shared utilities** from `lib/`
5. **Make assertions** about expected improvements
6. **Document findings** in comments after completion
7. **Move to `historical/`** if rejected or superseded

## Decision Criteria

From [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md):

| Change Type      | Accept If               | Reject If              |
| ---------------- | ----------------------- | ---------------------- |
| Synonym addition | Any MRR improvement     | Standard MRR regresses |
| Noise filtering  | Colloquial MRR improves | Any category regresses |
| Cross-reference  | Hard MRR ≥+10%          | p95 latency >1500ms    |
| RRF tuning       | Any MRR improvement     | Regression anywhere    |
| AI enhancement   | Hard MRR ≥+15%          | p95 latency >2000ms    |

## Related Documentation

- [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) - Evaluation framework
- [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) - Fundamentals-first strategy
- [EXPERIMENT-LOG.md](../../../.agent/evaluations/EXPERIMENT-LOG.md) - Chronological experiment history
- [part-1-search-excellence.md](../../../.agent/plans/semantic-search/part-1-search-excellence.md) - Current work plan
