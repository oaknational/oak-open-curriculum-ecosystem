# Evaluations

Structured evaluation and experimentation for the Oak Curriculum ecosystem.

## 🎯 Start Here

**[EXPERIMENTAL-PROTOCOL.md](./EXPERIMENTAL-PROTOCOL.md)** — The canonical reference for how to design, execute, record, and learn from search experiments.

**Formal framework**: [ADR-081: Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

**Acceptance criteria**: [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md) — Defines "Target Met" vs "Exhausted"

---

## 🔄 Current Priority: Benchmark & Iterate (2026-01-13)

**RRF architecture fixed.** Ground truths restructured (120 queries, 30 entries). Ready for benchmarking.

**Prerequisite complete**: ADR-099 — Transcript-Aware RRF Score Normalisation

**Goal**: Iterate until the constraining factor is **search quality**, not ground truth quality.

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm benchmark --all --verbose  # Run benchmarks
# Analyse failures → Fix ground truths OR confirm search is the bottleneck
```

| Failure Type | Action |
|--------------|--------|
| Ground truth wrong | Fix expected slugs, re-run benchmark |
| Search wrong | Ground truths validated, proceed to search improvements |

---

## Unified Evaluation Infrastructure (2026-01-06)

**Status**: Infrastructure built. Benchmark validation in progress.

| Dimension | Current | Target | Status |
|-----------|---------|--------|--------|
| Subjects with GT | 16 | 16 | ✅ All subjects |
| Subjects with primary GT | 14 | 14 | ✅ Complete |
| Subjects with secondary GT | 16 | 16 | ✅ Complete |
| Subject/phase entries in registry | 28 | 28 | ✅ Complete |

**What was built**:

- `GROUND_TRUTH_REGISTRY` as single source of truth (ADR-098)
- Unified `benchmark.ts` replaces 5 fragmented analysis scripts
- Behavior-focused smoke tests (deleted 10 performance-measuring tests)
- KS4 queries use `keyStage: 'ks4'` property for correct ES filtering

**Needs validation**: Run `pnpm benchmark --all` against live ES to confirm infrastructure works end-to-end.

See [M3: Comprehensive Ground Truths](../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md).

---

## 📊 Curriculum Baseline Counts (2026-01-03)

Reference data: `reference/bulk_download_data/oak-bulk-download-2025-12-30T16_07_45.986Z/`

### ⚠️ Important: Bulk Download Contains Duplicates

The bulk download files contain **duplicate entries** for lessons that exist in multiple tiers (foundation/higher). The tier discriminator field is **missing** from the bulk download, so duplicates appear identical.

**Example**: Maths secondary has 1,235 raw entries but only **862 unique lessons** (373 lessons × 2 = 746 duplicate entries for tier variants).

See [00-overview-and-known-issues.md](../plans/external/ooc-api-wishlist/00-overview-and-known-issues.md) → Issue 2 for upstream fix request.

### Lessons by Subject

| Subject | Primary | Secondary | Raw Total | Unique Lessons | Duplicates | Cause |
|---------|---------|-----------|-----------|----------------|------------|-------|
| english | 1,512 | 1,075 | 2,587 | **2,540** | 47 | Unit options |
| maths | 1,072 | 1,235 | 2,307 | **1,934** | 373 | Tier variants |
| science | 390 | 890 | 1,280 | **1,279** | 1 | Cross-unit |
| physical-education | 432 | 560 | 992 | 992 | 0 | — |
| geography | 223 | 527 | 750 | **683** | 67 | Unit options |
| history | 218 | 464 | 682 | **657** | 25 | Unit options |
| religious-education | 216 | 395 | 611 | 611 | 0 | — |
| computing | 180 | 348 | 528 | 528 | 0 | — |
| spanish | 112 | 413 | 525 | 525 | 0 | — |
| french | 105 | 417 | 522 | 522 | 0 | — |
| music | 216 | 218 | 434 | 434 | 0 | — |
| german | 0 | 411 | 411 | 411 | 0 | — |
| art | 214 | 204 | 418 | 418 | 0 | — |
| design-technology | 144 | 216 | 360 | 360 | 0 | — |
| citizenship | 0 | 318 | 318 | 318 | 0 | — |
| cooking-nutrition | 72 | 36 | 108 | 108 | 0 | — |
| rshe-pshe | ? | ? | ? | ? | — | No bulk file |
| **TOTAL** | — | — | **12,833** | **~12,320** | **513** | — |

**Verified duplicates (2025-12-30)**: Maths (373 tier variants), Geography (67 unit options), English (47 unit options), History (25 unit options), Science (1 cross-unit).

### Ingestion Target Counts

Use these **unique lesson counts** as acceptance criteria for ES ingestion:

| Subject | ES Target | Tolerance | Notes |
|---------|-----------|-----------|-------|
| maths | 1,934 | ±3 lessons | Verified: 373 tier duplicates removed |
| english | 2,540 | ±3 lessons | Verified: 47 unit option duplicates |
| geography | 683 | ±3 lessons | Verified: 67 unit option duplicates |
| history | 657 | ±3 lessons | Verified: 25 unit option duplicates |
| science | 1,279 | ±3 lessons | KS4 via sequences endpoint (598 lessons) |
| All others | Raw bulk count | ±3 lessons | No duplicates found |

### Key Stage Distribution (Approximate)

| Key Stage | Phase | Year Groups | Notes |
|-----------|-------|-------------|-------|
| KS1 | Primary | Years 1-2 | Foundational |
| KS2 | Primary | Years 3-6 | Foundational |
| KS3 | Secondary | Years 7-9 | Pre-GCSE |
| KS4 | Secondary | Years 10-11 | GCSE |

### Current ES Coverage (2026-01-02)

**Full curriculum ingestion complete** via bulk downloads.

| Index | Documents |
|-------|-----------|
| `oak_lessons` | 12,833 |
| `oak_units` | 1,665 |
| `oak_threads` | 164 |
| `oak_sequences` | 30 |
| `oak_sequence_facets` | 57 |
| **Total** | **16,414** |

**Note**: ES document counts for `oak_lessons` and `oak_unit_rollup` are higher (184,985 and 165,345) due to ELSER sub-documents.

### Science KS4 Structure Clarification (2025-12-28)

The science subject splits into **exam subjects** at KS4:

| Key Stage | Subject Access | Lesson Count |
|-----------|----------------|--------------|
| KS1-KS2 | `subject=science` | 390 |
| KS3 | `subject=science` | ~290 |
| KS4 | Via `sequences/science-secondary-{board}/units` → `examSubjects[]` | ~598 |

The bulk download shows KS4 lessons with subject slugs `biology`, `chemistry`, `physics`, `combined-science` — but the API accesses them via the science sequences endpoint, not as separate top-level subjects.

**Pipeline fix needed**: Use sequences endpoint for KS4 science instead of simple subject+keyStage queries.

### Subjects with Unit Options (2025-12-28)

These subjects have `unitOptions[]` at KS4, causing duplicate lesson entries in bulk data:

| Subject | Cause | Duplicates | Examples |
|---------|-------|------------|----------|
| Art | Area specialisms | 0* | Fine Art, Photography, Textiles, 3D Design |
| Design-technology | Material types | 0* | Papers/boards, Polymers/timbers, Textiles |
| English | Set texts | 47 | Animal Farm, Inspector Calls, Macbeth |
| Geography | Topics | 67 | Coastal, River, Glacial landscapes |
| History | Historic environments | 25 | Battle of Hastings, Durham Cathedral |
| Religious-education | Religions | 0* | Buddhism vs Islam |

*\* = No bulk duplicates, but API returns unitOptions structure that pipeline must handle.*

---

> ✅ **INGESTION COMPLETE**: Full curriculum indexed (16,414 documents). Ground truth restructuring is the current work — see [M3 Revised: Phase-Aligned Search Quality](../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md).

---

## Unified Evaluation Architecture ✅ IMPLEMENTED

### Two Categories of Tools

| Category | Question Answered | When Run | Output |
|----------|-------------------|----------|--------|
| **Evaluations** | "Did this change improve/regress quality?" | Before/after changes | Metrics to compare |
| **Smoke Tests** | "Is our search service working as expected?" | CI/CD, deployment | Pass/fail |

**Never conflate these concerns.** Evaluation measures quality; smoke tests verify behavior.

### Components

| Component | Category | Purpose | Location |
|-----------|----------|---------|----------|
| **Ground Truth Registry** | Data | Single source of ALL ground truths | `ground-truth/registry/` |
| **Validation Script** | Pre-check | Validates ALL slugs from registry | `evaluation/validation/validate-ground-truth.ts` |
| **Benchmark Tool** | Evaluation | Measure MRR for any scope | `evaluation/analysis/benchmark.ts` |
| **Smoke Tests** | Smoke Test | Verify search behavior works | `smoke-tests/*.smoke.test.ts` |

### Usage

```bash
cd apps/oak-open-curriculum-semantic-search

# Validate all ground truths (pre-check)
pnpm tsx evaluation/validation/validate-ground-truth.ts

# Evaluate (measure effects of changes)
pnpm benchmark --all                    # All 30 subject/phase entries
pnpm benchmark --subject maths          # One subject
pnpm benchmark --phase primary          # One phase

# Smoke test (is it working?)
pnpm smoke:dev:stub                     # Behavior-focused tests
```

### Metrics Output

Benchmark outputs ALL standard IR metrics at **per-category granularity**:

| Metric | What It Measures |
|--------|------------------|
| **MRR** | Position of first relevant result |
| **NDCG@10** | Ranking quality with graded relevance |
| **Precision@10** | Proportion of top 10 that are relevant |
| **Recall@10** | Proportion of relevant found in top 10 |
| **Zero-Hit Rate** | Queries returning nothing |
| **p95 Latency** | 95th percentile response time |

**Required output format** (for EVERY benchmark run):

```
Subject/Phase/Category | MRR      | NDCG@10  | P@10     | R@10     | Zero%    | p95ms
                       | Act/Tgt  | Act/Tgt  | Act/Tgt  | Act/Tgt  | Act/Tgt  | Act/Tgt
-----------------------|----------|----------|----------|----------|----------|----------
maths/secondary/precise| 0.89/0.70| 0.82/0.75| 0.17/0.50| 0.83/0.60| 0%/≤10%  | 234/≤300
```

Each cell shows: `actual/target` with status indicator (✅/⚠️/❌)

> **Full definitions**: See [IR-METRICS.md](../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md)

**Key Distinction**:

- **Evaluations** are tools you run manually to measure effects of changes
- **Smoke tests** are automated pass/fail checks that run in CI/CD

---

## Directory Structure

```text
.agent/evaluations/
├── README.md                    ← You are here
├── EXPERIMENTAL-PROTOCOL.md     ← 🎯 CANONICAL: How to run experiments
├── EXPERIMENT-LOG.md            ← Chronological experiment history
├── experiments/                 ← A/B experiments
│   ├── index.md                 ← Experiment listing with themes
│   ├── EXPERIMENT-PRIORITIES.md ← Strategic roadmap
│   ├── template-for-experiments.md
│   ├── template-for-search-experiments.md
│   └── *.experiment.md          ← Individual experiments
├── baselines/                   ← Baseline measurements
│   ├── index.md                 ← Baseline listing
│   └── *.md                     ← Individual baselines
└── guidance/                    ← Practical how-to guides
    └── search-experiment-guidance.md
```

---

## Quick Links

| Section | Purpose |
|---------|---------|
| **[EXPERIMENT-LOG.md](./EXPERIMENT-LOG.md)** | Chronological history — what happened and why |
| [Experiments](./experiments/index.md) | A/B experiments comparing approaches |
| [Baselines](./baselines/index.md) | Baseline measurements of current state |
| [Priorities](./experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap and tier system |
| [Guidance](./guidance/search-experiment-guidance.md) | Practical how-to guides for running experiments |
| [Roadmap](../plans/semantic-search/roadmap.md) | Strategic roadmap for the semantic search system |
| [Current State](../plans/semantic-search/current-state.md) | Current metrics snapshot |

---

## File Naming Conventions

### Experiments (`experiments/`)

**Format**: `{kebab-case-description}.experiment.md`

**Examples**:

- `semantic-reranking.experiment.md`
- `comprehensive-synonym-coverage.experiment.md`
- `linear-retriever.experiment.md`

### Baselines (`baselines/`)

**Format**: `{kebab-case-description}.md`

**Examples**:

- `hard-query-baseline.md`

### Guidance (`guidance/`)

**Format**: `{domain}-guidance.md` or `{domain}-evaluation.md`

---

## Experiment Lifecycle

```text
1. DESIGN        Create experiment doc with hypothesis & success criteria
                 Status: 📋 Planned

2. EXECUTE       Run experiments (Playground → Smoke Tests)
                 Status: 🔬 In Progress

3. ANALYSE       Interpret results, compare to hypothesis
                 Fill in Discussion section

4. DECIDE        Accept / Reject / Inconclusive
                 Status: ✅ Complete or ❌ Rejected or ⏸️ Deferred
```

---

## When to Create What

| Situation | Create |
|-----------|--------|
| Testing a specific change (control vs variant) | `*.experiment.md` in `experiments/` |
| Documenting current system behaviour | `*.md` in `baselines/` |
| How-to guide for running experiments | `*-guidance.md` in `guidance/` |

---

## Templates

| Template | Use For |
|----------|---------|
| [`template-for-experiments.md`](experiments/template-for-experiments.md) | Generic experiments |
| [`template-for-search-experiments.md`](experiments/template-for-search-experiments.md) | Search relevance experiments |

Copy the appropriate template and rename following the conventions above.

---

## Related Documents

### Evaluation References (App-Level)

Technical documentation for search evaluation lives in the search app workspace:

| Document | Location | Purpose |
|----------|----------|---------|
| **IR Metrics Guide** | [apps/.../docs/IR-METRICS.md](../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) | MRR, NDCG@10, zero-hit rate definitions |
| **Data Completeness** | [apps/.../docs/DATA-COMPLETENESS.md](../../apps/oak-open-curriculum-semantic-search/docs/DATA-COMPLETENESS.md) | Which fields are indexed completely |
| **Querying** | [apps/.../docs/QUERYING.md](../../apps/oak-open-curriculum-semantic-search/docs/QUERYING.md) | How hybrid search queries work |
| **Indexing** | [apps/.../docs/INDEXING.md](../../apps/oak-open-curriculum-semantic-search/docs/INDEXING.md) | Index structure and field mappings |
| **Synonyms** | [apps/.../docs/SYNONYMS.md](../../apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md) | Synonym expansion strategy |
| **Diagnostic Queries** | [apps/.../docs/DIAGNOSTIC-QUERIES.md](../../apps/oak-open-curriculum-semantic-search/docs/DIAGNOSTIC-QUERIES.md) | Diagnostic query categories |

### Planning Documents

- **Acceptance Criteria**: [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md) — **Defines "Target Met" vs "Exhausted"**
- **Roadmap**: [Semantic Search Roadmap](../plans/semantic-search/roadmap.md) — Master roadmap
- **Current State**: [Current State](../plans/semantic-search/current-state.md) — Authoritative metrics

### ADRs

- **ADR-081**: [Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) — Decision criteria, metrics definitions
- **ADR-082**: [Fundamentals-First Search Strategy](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — Tier system, strategic approach
- **ADR-085**: [Ground Truth Validation Discipline](../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) — Ensures experiment integrity

### Guidance

- **Search Experiment Guidance**: [search-experiment-guidance.md](guidance/search-experiment-guidance.md) — Practical how-to
