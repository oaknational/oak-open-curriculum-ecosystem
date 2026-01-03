# Semantic Search — Session Entry Point

**Last Updated**: 2026-01-03

This is a **standalone entrypoint** for semantic search sessions. Start here.

---

## 🎯 CURRENT PRIORITY: Milestone 3 — Search Quality Optimization

**Full ingestion is complete** (16,414 documents). Now optimising search quality.

**Detailed Plan**: [m3-search-quality-optimization.md](../../plans/semantic-search/active/m3-search-quality-optimization.md)

### M3 Phases

| Phase | Focus | Status |
|-------|-------|--------|
| **1. Ground Truths** | Create queries for all 17 subjects, all 4 key stages | 📋 Start here |
| **2. Baselines** | Establish per-subject, per-category MRR before changes | 📋 |
| **3. Synonym Audit** | Remove noise, add high-impact terms | 📋 |
| **4. ES Tuning** | Evaluate deferred query-time enhancements | 📋 |
| **5. Measure & Iterate** | Experiment, measure, accept/reject | 📋 |

### Current Ground Truth Gap

| Dimension | Current | Required |
|-----------|---------|----------|
| Subjects covered | Maths only | 17 subjects |
| Key Stages | KS4 only | KS1-4 |
| Ground truth queries | 73 | 200+ |

### Key Files for M3

| File | Purpose |
|------|---------|
| `evaluation/ground-truth/standard-queries.json` | Standard ground truth queries |
| `evaluation/ground-truth/hard-queries.json` | Hard query set (category-tagged) |
| `packages/libs/oak-curriculum-search-lib/src/synonyms/` | Synonym files (163 terms) |
| `reference/bulk_download_data/` | Bulk download data for analysis |

---

## Current ES Index State

From Elastic Cloud (2026-01-02):

| Index | Documents | Storage |
|-------|-----------|---------|
| `oak_lessons` | 184,985 | 806.62MB |
| `oak_unit_rollup` | 165,345 | 706.06MB |
| `oak_units` | 1,635 | 8.94MB |
| `oak_threads` | 164 | 255.53KB |
| `oak_sequence_facets` | 57 | 375.14KB |
| `oak_sequences` | 30 | 267.67KB |
| `oak_meta` | 1 | 5.34KB |

**Actual documents**: 16,414 (ES counts include ELSER sub-documents).

---

## Search Quality Metrics (KS4 Maths Only)

| Category | MRR | Status |
|----------|-----|--------|
| Misspelling | 0.833 | ✅ Excellent |
| Naturalistic | 0.722 | ✅ Good |
| Multi-concept | 0.625 | ✅ Good |
| Synonym | 0.611 | ✅ Good |
| Colloquial | 0.500 | ⚠️ Acceptable |
| Intent-based | 0.229 | ❌ Exception granted |
| **Overall** | **0.614** | ✅ Tier 1 target met |

**These metrics only cover KS4 Maths.** Full curriculum benchmarks needed — see M3.

---

## Evaluation Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# Current benchmarks (KS4 Maths only)
pnpm eval:per-category    # Per-category MRR breakdown
pnpm eval:diagnostic      # Detailed pattern analysis

# Full metrics
pnpm tsx evaluation/analysis/full-metrics-breakdown.ts
```

---

## Experiment Protocol

**For every change**, follow this workflow:

1. **Design** — Document hypothesis in `.experiment.md` file
2. **Baseline** — Run `pnpm eval:per-category`, record in EXPERIMENT-LOG
3. **Implement** — Make the change
4. **Measure** — Run benchmarks again
5. **Decide** — Accept if improvement, reject if regression

**Templates**: [template-for-search-experiments.md](../../evaluations/experiments/template-for-search-experiments.md)

**Guidance**: [search-experiment-guidance.md](../../evaluations/guidance/search-experiment-guidance.md)

---

## ✅ What's Complete

| Milestone | Status |
|-----------|--------|
| M1: Complete ES Ingestion | ✅ |
| M2: Sequence Indexing | ✅ |
| M4: DRY/SRP Refactoring | ✅ |
| M5: Data Completeness | ✅ |

---

## CLI Usage

```bash
# Full bulk ingestion
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force --verbose

# Reset indices
pnpm es:setup --reset
pnpm es:status
```

---

## Quality Gates

Run after every change (from repo root):

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Navigation

### Plans (How we're going to do it)

| Document | Purpose |
|----------|---------|
| **[roadmap.md](../../plans/semantic-search/roadmap.md)** | Master roadmap and dependency chain |
| [current-state.md](../../plans/semantic-search/current-state.md) | Current metrics snapshot |
| [search-acceptance-criteria.md](../../plans/semantic-search/search-acceptance-criteria.md) | Tier definitions ("Target Met" vs "Exhausted") |
| [README.md](../../plans/semantic-search/README.md) | Navigation hub for all plans |

### Evaluations (How we measure success)

| Document | Purpose |
|----------|---------|
| [evaluations/README.md](../../evaluations/README.md) | Evaluation framework overview |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Chronological experiment history |
| [experiments/index.md](../../evaluations/experiments/index.md) | Experiment listing |

### Technical Documentation (How things work)

| Document | Purpose |
|----------|---------|
| [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | MRR, NDCG@10, zero-hit rate definitions |
| [QUERYING.md](../../../apps/oak-open-curriculum-semantic-search/docs/QUERYING.md) | How hybrid search queries work |
| [INDEXING.md](../../../apps/oak-open-curriculum-semantic-search/docs/INDEXING.md) | Index structure and field mappings |
| [SYNONYMS.md](../../../apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md) | Synonym expansion strategy |
| [INGESTION-GUIDE.md](../../../apps/oak-open-curriculum-semantic-search/docs/INGESTION-GUIDE.md) | How to run ingestion |

---

## Foundation Documents (MANDATORY)

Before any work, read:

1. **[rules.md](../../directives-and-memory/rules.md)** — First Question, TDD, no type shortcuts
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — TDD at ALL levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth

---

## Key Principles

1. **TDD always** — Red → Green → Refactor
2. **No type shortcuts** — No `as`, `any`, `!`
3. **Single pipeline** — NO duplication of ingestion logic
4. **Measure before/after** — Every experiment needs baselines

---

## Two SDKs

| SDK | Location | Purpose |
|-----|----------|---------|
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/` | Access to upstream Oak API, type-gen |
| **Search SDK** | To be: `packages/libs/search-sdk/` | Elasticsearch-backed semantic search |

The Search SDK **consumes types from** the Curriculum SDK but is a separate concern.

---

## ES Documentation

**Do NOT guess how ES works** — read the official documentation:

- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [ELSER model docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Inference queue docs](https://www.elastic.co/docs/explore-analyze/machine-learning/inference/inference-queue)
