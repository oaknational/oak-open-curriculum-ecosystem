# Evaluations

Structured evaluation and experimentation for the Oak Curriculum ecosystem.

**Formal framework**: [ADR-081: Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

**Acceptance criteria**: [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md) — Defines "Target Met" vs "Exhausted"

---

## ⚠️ Critical Gap: Ground Truth Coverage (2026-01-02)

**Ground truth covers KS4 Maths ONLY.** Full curriculum is indexed but benchmarks are incomplete.

| Dimension | Current | Required |
|-----------|---------|----------|
| Subjects | Maths only | 17 subjects |
| Key Stages | KS4 only | KS1-4 |
| Queries | 73 | 200+ |

**Next step**: Create ground truths for all subjects before meaningful cross-curriculum evaluation.

See [Milestone 3: Search Quality Optimization](../plans/semantic-search/roadmap.md).

---

## 📊 Curriculum Baseline Counts (2026-01-02)

Reference data: `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/`

### ⚠️ Important: Bulk Download Contains Duplicates

The bulk download files contain **duplicate entries** for lessons that exist in multiple tiers (foundation/higher). The tier discriminator field is **missing** from the bulk download, so duplicates appear identical.

**Example**: Maths secondary has 1,235 raw entries but only **862 unique lessons** (373 lessons × 2 = 746 duplicate entries for tier variants).

See [00-overview-and-known-issues.md](../plans/external/ooc-api-wishlist/00-overview-and-known-issues.md) → Issue 2 for upstream fix request.

### Lessons by Subject

| Subject | Primary | Secondary | Raw Total | Unique Lessons | Duplicates | Cause |
|---------|---------|-----------|-----------|----------------|------------|-------|
| english | 1,516 | 1,035 | 2,551 | **2,525** | 26 | Unit options |
| maths | 1,072 | 1,235 | 2,307 | **1,934** | 373 | Tier variants |
| science | 390 | 888 | 1,278 | **1,277** | 1 | Cross-unit |
| physical-education | 432 | 560 | 992 | 992 | 0 | — |
| geography | 223 | 527 | 750 | **683** | 67 | Unit options |
| history | 216 | 468 | 684 | 684 | 0 | — |
| religious-education | 216 | 396 | 612 | 612 | 0 | — |
| computing | 180 | 348 | 528 | 528 | 0 | — |
| spanish | 112 | 413 | 525 | 525 | 0 | — |
| french | 105 | 417 | 522 | 522 | 0 | — |
| music | 216 | 218 | 434 | 434 | 0 | — |
| german | 0 | 411 | 411 | 411 | 0 | — |
| art | 214 | 189 | 403 | 403 | 0 | — |
| design-technology | 144 | 216 | 360 | 360 | 0 | — |
| citizenship | 0 | 318 | 318 | 318 | 0 | — |
| cooking-nutrition | 72 | 36 | 108 | 108 | 0 | — |
| rshe-pshe | ? | ? | ? | ? | — | No bulk file |
| **TOTAL** | — | — | **12,783** | **~12,316** | **467** | — |

**Verified duplicates (2025-12-28)**: Maths (373 tier variants), Geography (67 unit options), English (26 unit options), Science (1 cross-unit).

### Ingestion Target Counts

Use these **unique lesson counts** as acceptance criteria for ES ingestion:

| Subject | ES Target | Tolerance | Notes |
|---------|-----------|-----------|-------|
| maths | 1,934 | ±3 lessons | Verified: 373 tier duplicates removed |
| english | 2,525 | ±3 lessons | Verified: 26 unit option duplicates |
| geography | 683 | ±3 lessons | Verified: 67 unit option duplicates |
| science | 1,277 | ±3 lessons | KS4 via sequences endpoint (598 lessons) |
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
| English | Set texts | 26 | Animal Farm, Inspector Calls, Macbeth |
| Geography | Topics | 67 | Coastal, River, Glacial landscapes |
| History | Historic environments | 0* | Battle of Hastings, Durham Cathedral |
| Religious-education | Religions | 0* | Buddhism vs Islam |

*\* = No bulk duplicates, but API returns unitOptions structure that pipeline must handle.*

---

> ✅ **INGESTION COMPLETE**: Full curriculum indexed (16,414 documents). Ground truth coverage is the current gap — see [M3: Search Quality Optimization](../plans/semantic-search/active/m3-search-quality-optimization.md).

---

## Directory Structure

```text
.agent/evaluations/
├── README.md                    ← You are here
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
