# Evaluations

Structured evaluation and experimentation for the Oak Curriculum ecosystem.

**Formal framework**: [ADR-081: Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

**Acceptance criteria**: [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md) — Defines "Target Met" vs "Exhausted"

---

## 📊 Curriculum Baseline Counts (2025-12-28)

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

### Current ES Coverage (2025-12-28)

| Subject | ES Count | Unique Target | Coverage | Notes |
|---------|----------|---------------|----------|-------|
| maths | 1,934 | 1,934 | ✅ 100% | Ingested today |
| english | 1,521 | ~2,551 | 60% | Missing ~1,030 |
| art | 537 | ~403 | 133%* | ES has tier variants |
| computing | 528 | 528 | ✅ 100% | |
| design-technology | 426 | ~360 | 118%* | ES has tier variants |
| citizenship | 318 | 318 | ✅ 100% | |
| cooking-nutrition | 108 | 108 | ✅ 100% | |
| science | 679 | ~1,278 | 53% | KS4 accessible via sequences endpoint |
| All others | 0 | ~7,836 | ❌ 0% | Pending ingestion |

*\*ES correctly shows more lessons because our ingestion traverses tier variants via the API, while bulk download has missing tier metadata.*

**Overall coverage**: ~51% (6,051 of ~11,810 accessible lessons)

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

> ⚠️ **INGESTION INCOMPLETE**: Only 6 of 17 subjects are in ES. See [semantic-search.prompt.md](../prompts/semantic-search/semantic-search.prompt.md) for ingestion commands.

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

- **Acceptance Criteria**: [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md) — **Defines "Target Met" vs "Exhausted"**
- **ADR-081**: [Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) — Decision criteria, metrics definitions
- **ADR-082**: [Fundamentals-First Search Strategy](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — Tier system, strategic approach
- **ADR-085**: [Ground Truth Validation Discipline](../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) — Ensures experiment integrity
- **Guidance**: [Search Experiment Guidance](guidance/search-experiment-guidance.md) — Practical how-to
