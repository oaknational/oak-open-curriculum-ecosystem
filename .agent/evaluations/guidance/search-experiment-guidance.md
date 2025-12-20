# Search Experiment Guidance

Practical guide for running search relevance experiments.

**Formal framework**: [ADR-081: Search Approach Evaluation Framework](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)  
**Template**: [Search Experiment Template](../experiments/template-for-search-experiments.md)

---

## Quick Start

### 1. Before You Start

Ask yourself:

- [ ] What specific problem am I trying to solve?
- [ ] What metric will tell me if it worked?
- [ ] What's the smallest change I can test?
- [ ] How will I know if I've made things worse?

### 2. Choose Your Tool

| Tool | Best For | Speed | Effort |
|------|----------|-------|--------|
| **Kibana Playground** | Quick iteration, LLM features | ⚡ Fast | Low |
| **Dev Tools Console** | Complex queries, ES features | 🔧 Medium | Medium |
| **Smoke Tests** | Automated, reproducible, CI | 🔬 Slow | Higher |

**Start with Playground**, graduate to smoke tests when you have a winner.

### 3. Run the Experiment

```bash
# Quick smoke test run
pnpm smoke:dev:stub -- --grep "four-retriever"

# Full ablation suite
pnpm smoke:dev:stub -- --grep "ablation"
```

---

## Metrics Cheat Sheet

### What to Measure

| Metric | What It Tells You | Target |
|--------|-------------------|--------|
| **MRR** | "How quickly do users find what they need?" | Higher = better |
| **NDCG@10** | "Is the ranking order good?" | Higher = better |
| **Zero-hit** | "How often do we return nothing?" | Lower = better |
| **p95 Latency** | "How long do the slow queries take?" | Lower = better |

### Current Baselines (December 2024)

| Query Type | Current MRR | Target MRR | Gap |
|------------|-------------|------------|-----|
| Standard (topic) | 0.931 | ≥0.92 | ✅ Met |
| Hard (all) | 0.367 | ≥0.50 | ❌ -26% |
| — Naturalistic | ~0.40 | ≥0.50 | ❌ -20% |
| — Misspelling | ~0.30 | ≥0.45 | ❌ -33% |
| — Multi-concept | ~0.35 | ≥0.45 | ❌ -22% |

### Reading MRR Values

| MRR | Meaning | User Experience |
|-----|---------|-----------------|
| 1.00 | Perfect | First result is always correct |
| 0.80 | Excellent | Usually in top 1-2 |
| 0.50 | Good (TARGET) | Usually in top 2-3 |
| 0.367 | Acceptable (CURRENT hard) | Usually in top 3-4 |
| 0.25 | Poor | Scrolling required |
| <0.20 | Very poor | "I can't find it" |

---

## Decision Rules

### When to Accept a Change

✅ **Accept if ALL of these are true**:

1. Target metric improved by the threshold amount
2. Standard query MRR stayed ≥0.92 (no regression)
3. p95 latency stayed within budget (typically ≤1500ms)

### When to Reject

❌ **Reject if ANY of these are true**:

1. Standard query MRR dropped by >2%
2. Latency exceeded budget with no path to fix
3. Improvement was <5% (noise, not signal)

### Thresholds by Change Type

| Change | Required Improvement | Latency Budget | Reject If |
|--------|---------------------|----------------|-----------|
| Reranking | Hard MRR +15% | +500ms overhead | p95 >2000ms |
| Query expansion | Target category +20% | +200ms overhead | p95 >1500ms |
| Fusion weights | Overall MRR +5% | +0ms | Any regression |
| Field boosting | Any improvement | +0ms | Any regression |

> See [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)
> for the full decision criteria matrix.

---

## Common Experiments

### A. Testing Semantic Reranking

**Hypothesis**: Cross-encoder reranking will improve hard query MRR.

**Playground approach**:

1. Open Kibana Playground
2. Load `oak_lessons` index
3. Add reranker: `.rerank-v1-elasticsearch`
4. Run hard queries, compare results

**What to look for**:

- Do misspelled queries improve?
- Do naturalistic queries get better ranking?
- Is latency acceptable?

### B. Testing Query Expansion

**Hypothesis**: LLM expansion will help naturalistic queries.

**Playground approach**:

1. Take a naturalistic query: "teach my students about solving for x"
2. Ask the LLM to expand it with curriculum terms
3. Run both original and expanded through search
4. Compare which finds "linear equations" faster

**What to look for**:

- Does the expansion add relevant terms?
- Does it hurt simple topic queries?
- What's the latency overhead?

### C. Testing Weight Changes

**Hypothesis**: Adjusting retriever weights will improve specific query types.

**Smoke test approach**:

```typescript
// In bm25-config-ablation.smoke.test.ts
const configs = [
  { name: 'baseline', weights: { bm25: 1, elser: 1 } },
  { name: 'elser-heavy', weights: { bm25: 0.5, elser: 1.5 } },
  { name: 'bm25-heavy', weights: { bm25: 1.5, elser: 0.5 } },
];
```

**What to look for**:

- Does ELSER-heavy help semantic queries?
- Does BM25-heavy help exact matches?
- Is there a single best config, or do we need per-query-type?

---

## Workflow

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Hypothesis │────►│  Playground │────►│   Winner?   │
└─────────────┘     │  (iterate)  │     └──────┬──────┘
                    └─────────────┘            │
                                               ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │   Codify    │◄────│  Document   │◄────│ Smoke Tests │
                    │  Learnings  │     │  (exp file) │     │ (validate)  │
                    └─────────────┘     └─────────────┘     └─────────────┘
```

1. **Form hypothesis** — What do you expect to happen?
2. **Iterate in Playground** — Fast feedback, try variations
3. **Identify winner** — Which config looks best?
4. **Validate with smoke tests** — Reproducible, automated
5. **Document** — Create experiment file with full analysis
6. **Codify learnings** — Extract lasting value (see below)

### Step 6: Codify Learnings

This is where we extract lasting value from experiments:

| If the experiment... | Then update... |
|---------------------|----------------|
| Led to an architectural decision | Create or update an **ADR** |
| Revealed best practices | Update **INGESTION-GUIDE.md**, **SYNONYMS.md**, etc. |
| Changed the process | Update **NEW-SUBJECT-GUIDE.md** |
| Changed metrics | Update **current-state.md** |

**Key principle**: 
- **What we DO** → Goes in operational guides (NEW-SUBJECT-GUIDE.md, INGESTION-GUIDE.md)
- **What we DON'T DO** → Stays in experiment log (EXPERIMENT-LOG.md, experiment files)
- **Why we decided** → Full reasoning in experiment file

---

## Ground Truth Queries

### Location

```text
apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/
├── hard-queries.ts      # 15 challenging queries
├── standard-queries.ts  # Baseline topic queries
├── types.ts             # GroundTruthQuery interface
└── index.ts             # Exports
```

### Query Categories

| Category | Example | Challenge |
|----------|---------|-----------|
| **Naturalistic** | "teach my students about solving for x" | Pedagogical intent, informal |
| **Misspelling** | "fotosinthesis" | Vocabulary errors |
| **Multi-concept** | "combining algebra with graphs" | Cross-topic |
| **Colloquial** | "the water cycle thing" | Informal language |
| **Intent-based** | "help with end of unit test" | Pure intent, no topic |

### Adding New Test Queries

```typescript
// In hard-queries.ts
{
  query: 'your new query',
  category: 'naturalistic', // or misspelling, etc.
  priority: 'high',         // critical, high, medium, exploratory
  description: 'What this tests and why it matters',
  expectedRelevance: {
    'expected-lesson-slug': 3,  // 3 = highly relevant
    'also-relevant-slug': 2,    // 2 = relevant
  },
},
```

---

## Troubleshooting

### "My MRR went down"

1. Check if you regressed standard queries (bad)
2. Check if hard queries improved but overall went down (might be ok)
3. Look at per-query breakdown — which specific queries changed?

### "Latency is too high"

1. Is it the retrieval or the reranking?
2. Try smaller `window_size` for reranking
3. Consider if it's acceptable for hard queries only

### "Results look random"

1. Check your ground truth — are the expected docs actually relevant?
2. Run multiple times — is there variance?
3. Check ES query structure — is the variant actually different?

### "I can't reproduce Playground results in code"

1. Export the Playground query (View query button)
2. Compare structure to your code-generated query
3. Common issues: missing filters, different field names

---

## Resources

- **ADR-081**: [Search Approach Evaluation Framework](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)
- **Research**: [Hard Query Optimization](../../research/search-query-optimization-research.md)
- **Phase 3 Plan**: [Multi-Index and Fields](../../plans/semantic-search/phase-3-multi-index-and-fields.md)
- **ES Docs**: [Semantic Reranking](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html)
