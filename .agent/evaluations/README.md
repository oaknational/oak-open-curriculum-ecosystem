# Evaluations

Structured evaluation and experimentation for the Oak Curriculum ecosystem.

**Formal framework**: [ADR-081: Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

---

## Directory Structure

```text
.agent/evaluations/
├── README.md                    ← You are here
├── experiments/                 ← Individual experiment documents
│   ├── template-for-experiments.md
│   ├── template-for-search-experiments.md
│   ├── E-001-*.experiment.md    ← A/B experiments
│   └── B-001-*.experiment.md    ← Baseline documentation
└── guidance/                    ← Practical how-to guides
    └── search-experiment-guidance.md
```

---

## File Naming Conventions

### Experiments (`experiments/`)

| Prefix | Purpose | Example |
|--------|---------|---------|
| `E-XXX` | **A/B Experiment** — Compare control vs variant | `E-001-semantic-reranking.experiment.md` |
| `B-XXX` | **Baseline Documentation** — Record current state | `B-001-hard-query-baseline.experiment.md` |

**Format**: `{prefix}-{sequential-number}-{kebab-case-description}.experiment.md`

**Sequential numbering**:

- Numbers are global across all experiment types
- Use 3 digits with leading zeros (001, 002, etc.)
- Never reuse numbers, even for abandoned experiments

### Guidance (`guidance/`)

| Pattern | Purpose | Example |
|---------|---------|---------|
| `{domain}-guidance.md` | How-to guide for a domain | `search-experiment-guidance.md` |
| `{domain}-evaluation.md` | Completed evaluation/audit | `mcp-agent-guidance-evaluation.md` |

---

## Experiment Lifecycle

```text
1. DESIGN        Create experiment doc with hypothesis & success criteria
                 Status: 🔬 In Progress

2. EXECUTE       Run experiments (Playground → Smoke Tests)
                 Document results as you go

3. ANALYSE       Interpret results, compare to hypothesis
                 Fill in Discussion section

4. DECIDE        Accept / Reject / Inconclusive
                 Status: ✅ Complete or ❌ Abandoned

5. FOLLOW-UP     Create implementation tasks or next experiment
```

---

## When to Create What

| Situation | Create |
|-----------|--------|
| Testing a specific change (control vs variant) | `E-XXX-*.experiment.md` |
| Documenting current system behaviour | `B-XXX-*.experiment.md` |
| How-to guide for running experiments | `*-guidance.md` in `guidance/` |
| Completed audit/review | `*-evaluation.md` in `guidance/` |

---

## Templates

| Template | Use For |
|----------|---------|
| [`template-for-experiments.md`](experiments/template-for-experiments.md) | Generic experiments (performance, UX, etc.) |
| [`template-for-search-experiments.md`](experiments/template-for-search-experiments.md) | Search relevance experiments (MRR, NDCG, etc.) |

Copy the appropriate template and rename following the conventions above.

---

## Related Documents

- **ADR-081**: [Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) — Decision criteria, metrics definitions
- **Research**: [Search Query Optimization](../research/search-query-optimization-research.md) — Techniques and experiment plan
- **Guidance**: [Search Experiment Guidance](guidance/search-experiment-guidance.md) — Practical how-to
