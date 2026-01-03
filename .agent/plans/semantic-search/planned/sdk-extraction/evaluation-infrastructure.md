# Sub-Plan 03: Evaluation Infrastructure — Fix Duplication

**Status**: 📋 Backlog  
**Parent**: [README.md](../README.md) | [roadmap.md](../../roadmap.md)  
**Priority**: Low — Nice-to-have, not blocking M3
**Last Updated**: 2026-01-02

---

## Goal

Clarify and unify the evaluation directory structure. Remove confusion about where evaluation artifacts belong.

---

## Current State (Duplicated/Confused)

We have TWO evaluation directories:

### `.agent/evaluations/` — Agent-Level Documentation

```text
.agent/evaluations/
├── README.md                    # Navigation (outdated)
├── EXPERIMENT-LOG.md            # Chronological history ✅
├── ground-truth-corrections.md  # Incident documentation ✅
├── experiments/                 # Experiment DESIGN docs (*.experiment.md)
│   ├── index.md
│   ├── EXPERIMENT-PRIORITIES.md
│   ├── template-for-experiments.md
│   └── *.experiment.md
├── baselines/                   # Baseline DOCUMENTATION
│   └── *.md
└── guidance/                    # How-to guides
    └── *.md
```

### `apps/oak-open-curriculum-semantic-search/evaluation/` — App-Level Execution

```text
apps/oak-open-curriculum-semantic-search/evaluation/
├── README.md                    # Script usage
├── analysis/                    # Measurement SCRIPTS
│   ├── analyze-per-category.ts
│   ├── analyze-diagnostic-queries.ts
│   ├── analyze-intent-queries.ts
│   └── full-metrics-breakdown.ts
├── audit/                       # Data validation scripts
└── experiments/                 # What is this? (unclear)
```

### Problems

1. **Unclear boundaries**: Where does documentation end and code begin?
2. **Duplicate `experiments/` directories**: One has docs, one has... unclear
3. **Outdated README**: `.agent/evaluations/README.md` still says index is incomplete
4. **Cross-references missing**: No clear link between design docs and execution scripts

---

## Proposed Structure

### Principle: Separate Concerns

- **Documentation** → `.agent/evaluations/` (no executable code)
- **Execution** → `apps/.../evaluation/` (no design docs)
- **Cross-reference** → Each references the other explicitly

### `.agent/evaluations/` — Pure Documentation

```text
.agent/evaluations/
├── README.md                    # Navigation, status
├── EXPERIMENT-LOG.md            # Chronological history
├── ground-truth-corrections.md  # Incident documentation
├── experiments/                 # Experiment DESIGN only
│   ├── index.md                 # Links to execution scripts
│   ├── EXPERIMENT-PRIORITIES.md
│   ├── templates/
│   │   ├── experiment-template.md
│   │   └── search-experiment-template.md
│   └── *.experiment.md          # Design docs reference execution scripts
├── baselines/
│   └── *.md
└── guidance/
    └── *.md
```

### `apps/.../evaluation/` — Pure Execution

```text
apps/oak-open-curriculum-semantic-search/evaluation/
├── README.md                    # How to run scripts, links to design docs
├── analysis/                    # Measurement scripts
│   ├── per-category.ts
│   ├── diagnostic-queries.ts
│   ├── intent-queries.ts
│   └── full-metrics.ts
├── audit/                       # Validation scripts
│   └── *.ts
└── scripts/                     # Renamed from experiments/
    └── *.ts                     # Ad-hoc scripts, clearly labeled
```

---

## Pending Work

### 1. Update `.agent/evaluations/README.md`

**Current Issue**: ~~Line 9 still says "🔴 BLOCKING: All experiments are currently against an incomplete index"~~

**Status**: ✅ DONE (2026-01-02) — README now reflects complete index and ground truth gap

### 2. Rename/Reorganize App-Level `experiments/`

**Current**: `apps/.../evaluation/experiments/` — unclear purpose

**Options**:

1. Delete if empty/unused
2. Rename to `scripts/` if it contains ad-hoc scripts
3. Merge into `analysis/` if similar purpose

**Action**: Audit contents and decide

### 3. Add Cross-References

**In each `.experiment.md`**: Add "Execution Script" section linking to app-level script

**In each app-level script**: Add header comment linking to design doc

### 4. Create Unified README

Update both README files to:

1. Explain the separation of concerns
2. Link to each other
3. Provide clear "how to" guidance

---

## Acceptance Criteria

- [ ] No executable code in `.agent/evaluations/`
- [ ] No design documentation in `apps/.../evaluation/`
- [ ] Both README files updated and cross-referenced
- [ ] No "outdated" warnings in documentation
- [ ] Clear guidance on where to put new artifacts

---

## Related Documents

- [ADR-081: Search Approach Evaluation Framework](../../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)
- [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)
