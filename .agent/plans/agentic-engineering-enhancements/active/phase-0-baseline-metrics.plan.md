---
name: Phase 0 Baseline Metrics for Harness Concept Adoption
overview: >
  Establish reproducible baseline measurements for documentation drift,
  recurring review issues, and cleanup throughput before safe-track adoption
  starts.
todos:
  - id: p0-metric-definitions
    content: "Lock metric definitions and measurement windows."
    status: pending
  - id: p0-data-sources
    content: "Define exact command/data sources for each metric."
    status: pending
  - id: p0-baseline-capture
    content: "Capture initial 4-cycle baseline snapshot and store artefact."
    status: pending
  - id: p0-validation
    content: "Validate reproducibility by re-running baseline capture."
    status: pending
  - id: p0-readout
    content: "Publish baseline readout and confirm Phase 1 entry criteria."
    status: pending
---

# Phase 0 Baseline Metrics for Harness Concept Adoption

## 1. Intent

Create a trustworthy baseline so later claims of improvement are evidence-led,
comparable, and reproducible.

## 2. Scope

In scope:

- Metric definitions and data sources
- Baseline capture for one 4-cycle window
- Reproducibility validation
- Phase 1 entry decision support

Out of scope:

- Any quality-gate relaxation
- Safe-track implementation work (Phase 1 items)
- Best-track pilots (Phases 2-3)

## 3. Metric Definitions

- **Operational cycle**: one calendar week (Monday to Sunday).
- **Baseline window**: four complete operational cycles ending immediately
  before Phase 1 starts.
- **Doc drift finding**: one actionable stale/incorrect documentation issue
  captured in a tracked change request.
- **Repeated review comment**: same rule category repeated across at least
  two distinct pull requests in the baseline window.
- **Entropy cleanup volume**: count of cleanup PRs opened and resolved per
  cycle for small consistency/drift fixes.

## 4. Data Sources and Collection Commands

Primary sources:

- Git history and PR metadata (`git`, `gh`)
- Plan/change logs in `.agent/plans/`
- Reviewer outputs captured in repository artefacts

Collection commands (versioned in each baseline artefact):

1. Gather merged PRs in window:
   - `gh pr list --state merged --limit 500 --search "merged:>=<WINDOW_START> merged:<=<WINDOW_END>"`
2. Capture PR metadata for classification:
   - `gh pr view <PR_NUMBER> --json number,title,body,reviews,comments,files`
3. Count docs drift issues opened/resolved:
   - `gh issue list --state all --limit 500 --search "label:documentation updated:>=<WINDOW_START> updated:<=<WINDOW_END>"`
4. Count entropy cleanup PRs opened/resolved:
   - `gh pr list --state all --limit 500 --search "label:cleanup updated:>=<WINDOW_START> updated:<=<WINDOW_END>"`

Classification rubric is recorded in each evidence artefact, including
inclusion/exclusion examples for `doc drift finding` and `entropy cleanup`.

## 5. Baseline Artefacts

Store artefacts in:

- `.agent/plans/agentic-engineering-enhancements/evidence/`

Naming convention:

- `YYYY-MM-DD-harness-concepts-phase-0-baseline-<run-id>.evidence.md`

Each artefact must include:

- exact commands executed
- window boundaries
- raw counts by metric
- classification notes
- known data quality caveats

## 6. Exit Criteria

- Metric definitions are frozen for Phase 1 comparison.
- Baseline window artefact is committed.
- Re-run on the same window produces equivalent results.
- Phase 1 can start with explicit baseline values.

## 7. Risks and Mitigations

1. **Classification ambiguity**
   - Mitigation: define category rubric in artefact and apply consistently.
2. **Window inconsistency**
   - Mitigation: always record explicit start/end timestamps.
3. **Collection fragility**
   - Mitigation: keep commands simple and repository-local.

## 8. Next Actions

1. Create the first baseline evidence file under
   `.agent/plans/agentic-engineering-enhancements/evidence/`.
2. Validate a second run against the same window.
3. Update parent plan status once baseline is accepted.
