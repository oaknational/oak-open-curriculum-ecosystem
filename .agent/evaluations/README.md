# Evaluations

Structured evaluation and experimentation for the Oak Curriculum ecosystem.

**Formal framework**: [ADR-081: Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

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

- **ADR-081**: [Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) — Decision criteria, metrics definitions
- **ADR-082**: [Fundamentals-First Search Strategy](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — Tier system, strategic approach
- **Guidance**: [Search Experiment Guidance](guidance/search-experiment-guidance.md) — Practical how-to
