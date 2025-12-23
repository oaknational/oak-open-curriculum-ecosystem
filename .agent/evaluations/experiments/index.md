# Search Experiments

Experiments evaluating search approaches, techniques, and optimisations.

**Governing Framework**: [ADR-081: Search Approach Evaluation Framework](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)  
**Strategy**: [ADR-082: Fundamentals-First Search Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## 🔴 CRITICAL: All Experiments Need Re-Running (2025-12-23)

**Ground truth had 63 invalid slugs (15% of the data).** All previous MRR measurements are suspect.

### What Was Fixed

- ✅ 63 slugs corrected in lesson ground truth
- ✅ Integration test created to validate all slugs exist
- ✅ Unit and sequence ground truth added with validation
- ✅ All quality gates pass

### What Must Happen

1. **Re-run all experiments** against corrected ground truth
2. **Establish true baselines** before making decisions
3. **Re-evaluate rejected experiments** (especially semantic reranking)

**See**: [ground-truth-corrections.md](../ground-truth-corrections.md) for details

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| **[EXPERIMENT-LOG.md](../EXPERIMENT-LOG.md)** | Chronological history — what happened and why |
| **[EXPERIMENT-PRIORITIES.md](./EXPERIMENT-PRIORITIES.md)** | Strategic roadmap — what to try next |
| **[current-state.md](../../plans/semantic-search/current-state.md)** | Current metrics snapshot |
| **[ground-truth-corrections.md](../ground-truth-corrections.md)** | Details of the 63 slug corrections |

---

## All Experiments

| Experiment | Implementation | Previous Result | Verified? | Action Required |
|------------|----------------|-----------------|-----------|-----------------|
| [Comprehensive Synonym Coverage](./comprehensive-synonym-coverage.experiment.md) | ✅ Complete | +3.5% MRR | ❌ NO | 🔄 Re-measure |
| [Semantic Reranking](./semantic-reranking.experiment.md) | ✅ Complete | -16.8% regression | ❌ NO | ⚠️ **RE-EVALUATE** |
| [Query Expansion](./query-expansion.experiment.md) | ⏸️ Deferred | — | N/A | Await Tier 4 |
| [Linear Retriever](./linear-retriever.experiment.md) | 📋 Planned | — | N/A | Await Tier 3 |
| [Phonetic Enhancement](./phonetic-enhancement.experiment.md) | 📋 Planned | — | N/A | Low priority |
| [Guidance Provision for MCP Agents](./guidance-provision-for-mcp-agents.experiment.md) | ✅ Complete | Improved | ✅ YES | Not affected |

### Tier 1 Features (Implemented, Need Verification)

| Feature | Status | Claimed Impact | Verified? |
|---------|--------|----------------|-----------|
| B.4 Noise Filtering | ✅ Implemented | +16.8% | ❌ Re-measure |
| B.5 Phrase Boosting | ✅ Implemented | (never measured) | ❌ Measure |

---

## By Theme

### Fundamentals (Non-AI, Traditional Search)

Traditional search techniques with decades of proven value.

| Experiment | Focus | Implementation | Verification |
|------------|-------|----------------|--------------|
| [Comprehensive Synonym Coverage](./comprehensive-synonym-coverage.experiment.md) | Vocabulary bridging | ✅ Complete | 🔄 Re-measure |
| [Phonetic Enhancement](./phonetic-enhancement.experiment.md) | Misspelling tolerance | 📋 Planned | N/A |
| B.4 Noise Filtering | Colloquial preprocessing | ✅ Complete | 🔄 Re-measure |
| B.5 Phrase Boosting | Multi-word curriculum terms | ✅ Complete | 🔄 Measure |

### Modern Elasticsearch

Advanced ES features that don't require AI.

| Experiment | Focus | Status |
|------------|-------|--------|
| [Linear Retriever](./linear-retriever.experiment.md) | Weighted fusion | 📋 Planned |

### AI Enhancement

AI-powered techniques (pursue only after fundamentals mastered).

| Experiment | Focus | Previous Status | Current Status |
|------------|-------|-----------------|----------------|
| [Semantic Reranking](./semantic-reranking.experiment.md) | Cross-encoder reranking | ❌ Rejected | ⚠️ **NEEDS RE-EVALUATION** |
| [Query Expansion](./query-expansion.experiment.md) | LLM query enrichment | ⏸️ Deferred | Await verified Tier 1-3 |

**Critical insight**: The semantic reranking rejection was based on invalid ground truth. We may have discarded a working approach.

### Non-Search

Experiments not directly related to search relevance.

| Experiment | Focus | Status |
|------------|-------|--------|
| [Guidance Provision for MCP Agents](./guidance-provision-for-mcp-agents.experiment.md) | Agent tool guidance | ✅ Complete (not affected by GT issues) |

---

## Immediate Priorities

### 1. Establish True Baselines (FIRST)

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # Hard query baseline with corrected GT
pnpm eval:diagnostic      # Detailed pattern analysis
```

### 2. Measure B.5 Impact (SECOND)

B.5 Phrase Boosting is implemented but was never measured. Get actual numbers.

### 3. Re-Evaluate Semantic Reranking (THIRD)

Once true baselines are established, re-run the semantic reranking experiment to validate/invalidate the rejection decision.

---

## Templates

| Template | Use For |
|----------|---------|
| [template-for-experiments.md](./template-for-experiments.md) | Generic experiments |
| [template-for-search-experiments.md](./template-for-search-experiments.md) | Search relevance experiments |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [EXPERIMENT-PRIORITIES.md](./EXPERIMENT-PRIORITIES.md) | Strategic roadmap and tier system |
| [ground-truth-corrections.md](../ground-truth-corrections.md) | Details of the 63 slug corrections |
| [Baselines](../baselines/index.md) | Baseline measurements — **NEED RE-MEASUREMENT** |
| [Evaluations README](../README.md) | Overall evaluations structure |
