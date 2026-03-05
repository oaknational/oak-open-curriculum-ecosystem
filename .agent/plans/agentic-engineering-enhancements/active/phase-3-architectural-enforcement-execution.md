---
name: "Phase 3 - Architectural Enforcement Execution"
overview: >
  Execute architectural enforcement phases 0-5 with atomic, validated tasks
  and evidence-backed completion claims, with ESLint convergence tasks
  delegated where canonical ownership moved to devx strictness convergence.
todos:
  - id: p3-phase0-lint-baseline
    content: "Phase 0: Complete ESLint strict baseline."
    status: pending
  - id: p3-phase1-max-files
    content: "Phase 1: Wire max-files-per-dir rule and resolve violations. (Deferred for current window.)"
    status: pending
  - id: p3-phase2-boundaries
    content: "Phase 2: Boundary-rule implementation delegated to devx strictness convergence; keep strategic oversight here."
    status: pending
  - id: p3-phase3-depcruise
    content: "Phase 3: Land dependency-cruiser barrel and boundary checks."
    status: pending
  - id: p3-phase4-knip
    content: "Phase 4: Integrate knip dead-code detection into workflow."
    status: pending
  - id: p3-phase5-grounding
    content: "Phase 5: Add architectural enforcement grounding and qg updates; split-guidance subset delegated to devx strictness convergence."
    status: pending
  - id: p3-doc-sync
    content: "Update documentation sync log with ADR/directive/reference-doc/README impact for Phase 3."
    status: pending
---

# Phase 3 - Architectural Enforcement Execution

## Source Strategy

- [architectural-enforcement-adoption.plan.md](../architectural-enforcement-adoption.plan.md)

## Convergence Delegation (2026-03-04)

Execution ownership changed for part of this stream:

1. Delegated to [devx-strictness-convergence.plan.md](../../developer-experience/active/devx-strictness-convergence.plan.md):
   - boundary/separation ESLint convergence
   - no-console convergence
   - split-guidance updates for large functions/files/directories
2. Retained in this plan:
   - depcruise, knip, qg integration
   - evidence bundling for non-trivial enforcement claims
3. Explicitly deferred:
   - `max-files-per-dir` rollout

## Atomic Tasks

### Task 3.0 (Source Phase 0): ESLint Strict Baseline

- Output:
  - strict lint baseline restored across target workspaces
- Deterministic validation:
  - `pnpm lint`

### Task 3.1 (Source Phase 1): Physical Modularity Rule

- Output:
  - deferred decision recorded with rationale and re-entry gate
- Deterministic validation:
  - `rg -n "max-files-per-dir|Deferred" ../architectural-enforcement-adoption.plan.md`

### Task 3.2 (Source Phase 2): Layer Boundary Rules

- Output:
  - delegated execution link to canonical strictness plan is present
- Deterministic validation:
  - `rg -n "devx-strictness-convergence\\.plan\\.md" ../architectural-enforcement-adoption.plan.md ../../developer-experience/active/devx-strictness-convergence.plan.md`

### Task 3.3 (Source Phase 3): Dependency-Cruiser Lockdown

- Output:
  - dependency-cruiser rules enforce index.ts boundary policy
- Deterministic validation:
  - `test -f .dependency-cruiser.cjs`
  - `rg -n "index\\.ts|forbidden|dependency-cruiser" .dependency-cruiser.cjs`

### Task 3.4 (Source Phase 4): Knip Integration

- Output:
  - knip integrated into validation workflow
- Deterministic validation:
  - `rg -n "knip" package.json turbo.json .github .agent 2>/dev/null`

### Task 3.5 (Source Phase 5): Agentic Grounding

- Output:
  - delegated split-guidance ownership is documented; retained grounding scope is explicit
- Deterministic validation:
  - `rg -n "split-guidance|delegated|devx-strictness-convergence\\.plan\\.md" ../architectural-enforcement-adoption.plan.md ../../developer-experience/active/devx-strictness-convergence.plan.md`

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
