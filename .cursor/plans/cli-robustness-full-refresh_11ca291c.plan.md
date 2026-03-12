---
name: cli-robustness-full-refresh
overview: Refresh the active CLI robustness plan into a concise, execution-ready document that preserves completed evidence while making remaining incident work (metadata schema/mapping remediation) and closeout gates explicit.
todos:
  - id: baseline-active-state
    content: Extract and consolidate current incident facts, completed outcomes, and remaining obligations from the active plan and high-level index.
    status: completed
  - id: restructure-executable-plan
    content: Rewrite the full plan structure to executable-plan standards with concise completed evidence and explicit remaining phases.
    status: completed
  - id: define-phase5-remediation
    content: Specify RED/GREEN/REFACTOR tasks for metadata schema/mapping remediation and alias-health validation with deterministic checks.
    status: completed
  - id: define-phase4-closeout
    content: Specify reviewer/documentation/ADR closeout tasks and final quality-gate sequence with measurable acceptance criteria.
    status: completed
  - id: final-alignment-pass
    content: Run a final foundation-alignment pass to ensure fail-fast, schema-first, TDD, and no-compatibility-layer commitments are explicit and coherent.
    status: completed
isProject: false
---

# CLI Robustness Plan Refresh (Full)

## Outcome

Produce a fully refreshed executable plan for the active semantic-search CLI lane, preserving historical evidence but restructuring the document for faster execution, clearer ownership, and deterministic validation.

## Scope

- In scope: full rewrite of the active plan document structure, phase/status normalisation, remaining work definition, risk/test/quality-gate clarity.
- Out of scope: implementing product code changes, running ingestion commands, or editing unrelated strategic documents.

## Source Inputs

- Primary plan to refresh: `[.agent/plans/semantic-search/active/cli-robustness.plan.md](.agent/plans/semantic-search/active/cli-robustness.plan.md)`
- Strategic alignment source: `[.agent/plans/high-level-plan.md](.agent/plans/high-level-plan.md)`
- Planning directives: `[.agent/commands/plan.md](.agent/commands/plan.md)`, `[.agent/directives/principles.md](.agent/directives/principles.md)`, `[.agent/directives/testing-strategy.md](.agent/directives/testing-strategy.md)`, `[.agent/directives/schema-first-execution.md](.agent/directives/schema-first-execution.md)`, `[.agent/plans/templates/README.md](.agent/plans/templates/README.md)`

## Execution Approach

1. Re-baseline the active incident state from the current plan and high-level index; keep only facts still relevant to ongoing execution.
2. Rebuild the plan using executable-plan conventions:

- concise frontmatter todos with accurate statuses
- explicit RED/GREEN/REFACTOR structure for remaining work
- deterministic validation commands per task
- explicit non-goals and risk mitigations

1. Compress completed phases into a short "completed evidence" section, removing repeated narrative while retaining critical decisions and outcomes.
2. Expand remaining work into two sharp tracks:

- Phase 5: metadata schema/mapping contract remediation (`previous_version`) and alias health verification
- Phase 4 closeout: reviewer gates, ADR/doc propagation, final acceptance criteria

1. Add a single authoritative “Done When” block linked to measurable checks (exit codes, alias health, mapping compatibility, quality gates).
2. Cross-check plan language for foundation alignment (fail-fast, no compatibility layers, schema-first, TDD at all levels).

## TDD Shape for Remaining Work

- RED: define failing tests/validation proving current metadata-contract mismatch and lifecycle failure mode.
- GREEN: minimal schema/mapping/generator-aligned changes to pass lifecycle metadata commit and alias checks.
- REFACTOR: simplify plan wording, remove duplicated proofs, and lock final validation sequence.

## Validation and Evidence

- Require explicit command-based checks for:
  - lifecycle ingest completion with zero exit
  - metadata write acceptance under strict mapping
  - post-run alias integrity validation
  - quality-gate pass list in documented order
- Keep claim/evidence pairing concise so each major claim is backed by one concrete check.

## Risks to Control

- Plan bloat returning after refresh (mitigation: keep completed work as compact evidence only).
- Ambiguous ownership of remaining tasks (mitigation: task-level acceptance criteria and deterministic commands).
- Drift between strategic and executable docs (mitigation: align with high-level-plan incident lane wording only once).

## Deliverables

- Refreshed active executable plan at `[.agent/plans/semantic-search/active/cli-robustness.plan.md](.agent/plans/semantic-search/active/cli-robustness.plan.md)`
- Updated machine-readable frontmatter todo states reflecting actual remaining execution work
- Clear closeout checklist for reviewers, docs, and acceptance gates
