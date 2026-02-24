---
name: "Phase 5 - Mutation Testing Execution"
overview: >
  Execute mutation testing phases 0-3 with re-baselining, pilot rollout, and
  evidence-backed progression criteria.
todos:
  - id: p5-phase0-rebaseline
    content: "Phase 0: complete re-baseline audit and foundation setup."
    status: pending
  - id: p5-phase1-pilot
    content: "Phase 1: run pilot workspaces and record performance/mutant findings."
    status: pending
  - id: p5-phase2-rollout
    content: "Phase 2: roll out mutate tasks across all workspaces with tests."
    status: pending
  - id: p5-phase3-optimise
    content: "Phase 3: optimise and decide qg promotion readiness."
    status: pending
  - id: p5-evidence
    content: "Capture evidence bundles for mutation claims in each phase."
    status: pending
  - id: p5-doc-sync
    content: "Update documentation sync log with ADR/directive/reference-doc/README impact for Phase 5."
    status: pending
---

# Phase 5 - Mutation Testing Execution

## Source Strategy

- [mutation-testing-implementation.plan.md](../mutation-testing-implementation.plan.md)
- [evidence-bundle.template.md](../evidence-bundle.template.md)

## Atomic Tasks

### Task 5.0 (Source Phase 0): Re-baseline and Foundation

- Output:
  - completed re-baseline checklist and updated current-state section
- Deterministic validation:
  - `rg -n "Re-baseline checklist|Prerequisite gate" .agent/plans/agentic-engineering-enhancements/mutation-testing-implementation.plan.md`
  - `rg -n "\"mutate\"" turbo.json package.json`

### Task 5.1 (Source Phase 1): Pilot Workspaces

- Output:
  - pilot results for one lib and one app with survivor hotspots
- Deterministic validation:
  - `rg -n "pilot|surviv|runtime|score" .agent/plans/agentic-engineering-enhancements/evidence .agent/plans/agentic-engineering-enhancements 2>/dev/null`

### Task 5.2 (Source Phase 2): Monorepo Rollout

- Output:
  - mutate tasks available for all workspaces with test scripts
- Deterministic validation:
  - `rg -n "\"mutate\"" **/package.json`

### Task 5.3 (Source Phase 3): Optimisation and Promotion Decision

- Output:
  - touched-files/incremental approach documented
  - explicit promotion decision for `pnpm qg` with threshold rationale
- Deterministic validation:
  - `rg -n "incremental|touched-files|promotion|pnpm qg" .agent/plans/agentic-engineering-enhancements/mutation-testing-implementation.plan.md`

### Task 5.4: Evidence Bundles per Phase

- Output:
  - evidence artifact for each source phase claim set
- Deterministic validation:
  - `ls -1 .agent/plans/agentic-engineering-enhancements/evidence/*.evidence.md`

### Task 5.5: Documentation Synchronisation

- Output:
  - Phase 5 entry updated in documentation sync log
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 5|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/directives/practice.md`
  - `test -f .agent/reference-docs/prog-frame/agentic-engineering-practice.md`

## Done When

1. Source phases 0-3 are delivered with deterministic validation.
2. Rollout claims are evidence-backed.
3. Promotion decision for `pnpm qg` is explicit and justified.
4. Documentation sync entry is complete for Phase 5.
