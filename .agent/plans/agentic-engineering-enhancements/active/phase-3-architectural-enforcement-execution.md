---
name: "Phase 3 - Architectural Enforcement Execution"
overview: >
  Execute architectural enforcement phases 0-5 with atomic, validated tasks
  and evidence-backed completion claims, with ESLint convergence tasks
  delegated where canonical ownership moved to developer-experience plans.
todos:
  - id: p3-phase0-lint-baseline
    content: "Phase 0: Complete ESLint strict baseline."
    status: pending
  - id: p3-phase1-max-files
    content: "Phase 1: Record canonical delegation for the max-files-per-dir workstream."
    status: completed
  - id: p3-phase2-boundaries
    content: "Phase 2: Record canonical delegation for developer-experience execution owners."
    status: completed
  - id: p3-phase3-depcruise
    content: "Phase 3: Delegate dependency-cruiser execution to the canonical directory-complexity plan."
    status: completed
  - id: p3-phase4-knip
    content: "Phase 4: Delegate knip execution to the canonical directory-complexity plan."
    status: completed
  - id: p3-phase5-grounding
    content: "Phase 5: Delegate directory-complexity grounding and qg integration while retaining collection-level oversight."
    status: completed
  - id: p3-doc-sync
    content: "Update documentation sync log with ADR/directive/reference-doc/README impact for Phase 3."
    status: pending
---

# Phase 3 - Architectural Enforcement Execution

## Source Strategy

- [architectural-enforcement-adoption.plan.md](../current/architectural-enforcement-adoption.plan.md)

## Convergence Delegation (2026-03-04)

Execution ownership changed for part of this stream:

1. Delegated to [devx-strictness-convergence.plan.md](../../developer-experience/active/devx-strictness-convergence.plan.md):
   - no-console convergence
   - strictness-specific shared-config promotion work
2. Delegated to [directory-complexity-enablement.execution.plan.md](../../developer-experience/current/directory-complexity-enablement.execution.plan.md):
   - remediation SOP for directory-complexity breaches
   - boundary/public-API support bundle
   - depcruise, knip, qg integration for this workstream
   - staged `max-files-per-dir` activation
3. Retained in this plan:
   - evidence bundling for non-trivial enforcement claims
   - collection-level architectural-enforcement status tracking

## Atomic Tasks

### Task 3.0 (Source Phase 0): ESLint Strict Baseline

- Output:
  - strict lint baseline restored across target workspaces
- Deterministic validation:
  - `pnpm lint`

### Task 3.1 (Source Phase 1): Physical Modularity Rule

- Output:
  - canonical execution link to the queued directory-complexity plan is present
- Deterministic validation:
  - `rg -n "directory-complexity-enablement\\.execution\\.plan\\.md|max-files-per-dir" ../architectural-enforcement-adoption.plan.md`

### Task 3.2 (Source Phase 2): Layer Boundary Rules

- Output:
  - delegated execution links to the canonical developer-experience plans are present
- Deterministic validation:
  - `rg -n "devx-strictness-convergence\\.plan\\.md|directory-complexity-enablement\\.execution\\.plan\\.md" ../architectural-enforcement-adoption.plan.md ../../developer-experience/active/devx-strictness-convergence.plan.md ../../developer-experience/current/directory-complexity-enablement.execution.plan.md`

### Task 3.3 (Source Phase 3): Dependency-Cruiser Lockdown

- Output:
  - canonical execution ownership is delegated and this file no longer duplicates the task breakdown
- Deterministic validation:
  - `rg -n "directory-complexity-enablement\\.execution\\.plan\\.md|dependency-cruiser" ../architectural-enforcement-adoption.plan.md ../../developer-experience/current/directory-complexity-enablement.execution.plan.md`

### Task 3.4 (Source Phase 4): Knip Integration

- Output:
  - canonical execution ownership is delegated and referenced consistently
- Deterministic validation:
  - `rg -n "directory-complexity-enablement\\.execution\\.plan\\.md|knip" ../architectural-enforcement-adoption.plan.md ../../developer-experience/current/directory-complexity-enablement.execution.plan.md`

### Task 3.5 (Source Phase 5): Agentic Grounding

- Output:
  - delegated directory-complexity ownership is documented; retained collection scope is explicit
- Deterministic validation:
  - `rg -n "delegated|devx-strictness-convergence\\.plan\\.md|directory-complexity-enablement\\.execution\\.plan\\.md" ../architectural-enforcement-adoption.plan.md ../../developer-experience/active/devx-strictness-convergence.plan.md ../../developer-experience/current/directory-complexity-enablement.execution.plan.md`

### Task 3.6: Evidence Bundle for Enforcement Claims

- Output:
  - evidence bundle captured for non-trivial enforcement claims
- Deterministic validation:
  - `ls -1 .agent/plans/agentic-engineering-enhancements/evidence/*.evidence.md`

### Task 3.7: Documentation Synchronisation

- Output:
  - Phase 3 entry updated in documentation sync log
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 3|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`

## Done When

1. Source phases 0-5 are either implemented, delegated to canonical owners, or explicitly deferred with rationale.
2. Enforcement completion claims are evidence-backed.
3. Quality gates pass for the enforcement delta.
4. Documentation sync entry is complete for Phase 3.
