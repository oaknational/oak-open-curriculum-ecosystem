# Current Experiments

Active and accepted experiments that validate search system behavior.

## Experiments

### `hybrid-superiority.experiment.ts`

**Phase**: 3.0 (Multi-Index and Fields)  
**Date**: 2025-12-12  
**Status**: ✅ Accepted

**Hypothesis**: Two-way hybrid search (BM25 + ELSER) provides measurable benefit over either retrieval method alone.

**Dataset**: Maths KS4 (40 lesson queries, 43 unit queries)

**Results**:

| Index   | Retrieval | MRR   | Winner          |
| ------- | --------- | ----- | --------------- |
| Lessons | Hybrid    | 0.908 | ✅ Best         |
| Lessons | BM25      | 0.892 | Good            |
| Lessons | ELSER     | 0.830 | Acceptable      |
| Units   | ELSER     | 0.919 | ✅ Excellent    |
| Units   | Hybrid    | 0.915 | ✅ Best NDCG@10 |
| Units   | BM25      | 0.911 | Good            |

**Conclusions**:

- For lessons: Hybrid clearly outperforms single methods
- For units: ELSER alone is excellent; hybrid has slight NDCG advantage
- Unit reranking deferred until full curriculum indexed

**Documentation**: See `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`

---

### `mcp-comparison.experiment.ts`

**Purpose**: Cross-validation between ES hybrid search and MCP tool results  
**Status**: ✅ Active validation tool

**What it does**:

- Runs ES hybrid search queries
- Produces results that can be compared against MCP tool access
- Validates consistency between ES direct access and MCP interface

**Test queries**:

- Lesson searches: "fractions", "pythagoras", "linear equations"
- Unit searches: "number", "geometry", "algebra"

**Use case**: Ensure MCP tool results match direct ES access for integrity validation.

---

## Running These Experiments

**All experiments**:

```bash
pnpm vitest run -c vitest.experiment.config.ts
```

**Specific experiment**:

```bash
pnpm vitest run -c vitest.experiment.config.ts hybrid-superiority
pnpm vitest run -c vitest.experiment.config.ts mcp-comparison
```

## Shared Utilities (`lib/`)

All experiments use shared utilities:

- **`experiment-types.ts`** - Common type definitions
- **`experiment-search.ts`** - Search execution helpers
- **`experiment-metrics.ts`** - MRR, NDCG, and other metrics
- **`experiment-runners.ts`** - Test orchestration utilities
- **`experiment-logging.ts`** - Structured experiment logging

## Adding New Experiments

1. Create `my-hypothesis.experiment.ts` in this directory
2. Use vitest `describe`/`it` structure
3. Import utilities from `lib/`
4. Document hypothesis in file header
5. Add findings to comments after completion
6. Move to `historical/` if rejected

## Experiment Standards

- **Classification**: Mark as EXPERIMENT (not test)
- **Network IO**: Clearly state ES requirement
- **Informational**: Results guide decisions, not pass/fail CI
- **Documentation**: Update this README when adding experiments
