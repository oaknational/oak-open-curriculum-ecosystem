# Search Experiments

Experiments evaluating search approaches, techniques, and optimisations.

**Governing Framework**: [ADR-081: Search Approach Evaluation Framework](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)  
**Strategy**: [ADR-082: Fundamentals-First Search Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| **[EXPERIMENT-LOG.md](../EXPERIMENT-LOG.md)** | Chronological history — what happened and why |
| **[EXPERIMENT-PRIORITIES.md](./EXPERIMENT-PRIORITIES.md)** | Strategic roadmap — what to try next |
| **[current-state.md](../../plans/semantic-search/current-state.md)** | Current metrics snapshot |

---

## All Experiments

| Experiment | Status | Result | Tier |
|------------|--------|--------|------|
| [Comprehensive Synonym Coverage](./comprehensive-synonym-coverage.experiment.md) | ✅ Complete | +3.5% MRR | Fundamentals |
| [Semantic Reranking](./semantic-reranking.experiment.md) | ❌ Rejected | -16.8% regression | AI |
| [Query Expansion](./query-expansion.experiment.md) | ⏸️ Deferred | — | AI |
| [Linear Retriever](./linear-retriever.experiment.md) | 📋 Planned | — | Modern ES |
| [Phonetic Enhancement](./phonetic-enhancement.experiment.md) | 📋 Planned | — | Fundamentals |
| [Guidance Provision for MCP Agents](./guidance-provision-for-mcp-agents.experiment.md) | ✅ Complete | Improved agent success | Non-search |

---

## By Theme

### Fundamentals (Non-AI, Traditional Search)

Traditional search techniques with decades of proven value.

| Experiment | Focus | Status |
|------------|-------|--------|
| [Comprehensive Synonym Coverage](./comprehensive-synonym-coverage.experiment.md) | Vocabulary bridging | ✅ Complete |
| [Phonetic Enhancement](./phonetic-enhancement.experiment.md) | Misspelling tolerance | 📋 Planned |

**Priorities**: See [EXPERIMENT-PRIORITIES.md](./EXPERIMENT-PRIORITIES.md) for full roadmap including:
- Noise phrase filtering
- Phrase query enhancement
- Unit→Lesson cross-reference
- Thread-based relevance

### Modern Elasticsearch

Advanced ES features that don't require AI.

| Experiment | Focus | Status |
|------------|-------|--------|
| [Linear Retriever](./linear-retriever.experiment.md) | Weighted fusion | 📋 Planned |

**Also planned**: RRF parameter optimisation, field boosting optimisation.

### AI Enhancement

AI-powered techniques (pursue only after fundamentals mastered).

| Experiment | Focus | Status |
|------------|-------|--------|
| [Semantic Reranking](./semantic-reranking.experiment.md) | Cross-encoder reranking | ❌ Rejected |
| [Query Expansion](./query-expansion.experiment.md) | LLM query enrichment | ⏸️ Deferred |

**Lesson learned**: Generic AI models don't understand curriculum domain. Fundamentals first.

### Non-Search

Experiments not directly related to search relevance.

| Experiment | Focus | Status |
|------------|-------|--------|
| [Guidance Provision for MCP Agents](./guidance-provision-for-mcp-agents.experiment.md) | Agent tool guidance | ✅ Complete |

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
| [Baselines](../baselines/index.md) | Baseline measurements |
| [Evaluations README](../README.md) | Overall evaluations structure |
