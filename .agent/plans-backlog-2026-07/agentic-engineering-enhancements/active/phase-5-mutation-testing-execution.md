---
name: "Phase 5 - Mutation Testing Execution"
overview: >
  Execute the evidence-gated Stryker canary sequence: explicit test-scope
  contract, pure unit canary, integration-only canary, mixed canary, and only
  then optimisation or broader-rollout decisions.
todos:
  - id: p5-phase0-rebaseline
    content: "Phase 0a: preserve the completed 2026-07-15 re-baseline and cheaply re-verify it immediately before implementation."
    status: completed
  - id: p5-phase0-contract
    content: "Phase 0b: prove typed config, explicit unit/integration test selection, production globs, and E2E exclusion with a dry run."
    status: pending
  - id: p5-phase1-unit-canary
    content: "Phase 1: run and fully triage a pure unit-test canary."
    status: pending
  - id: p5-phase2-integration-canaries
    content: "Phase 2: prove an integration-only canary, then one mixed unit/integration workspace."
    status: pending
  - id: p5-phase3-evaluate
    content: "Phase 3: independently evaluate TypeScript checking, incremental reuse, report retention, and invocation cadence."
    status: pending
  - id: p5-phase4-expand
    content: "Phase 4: choose value-led workspace expansion and make any blocking-gate proposal as a separate decision."
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

- [mutation-testing-implementation.plan.md](../current/mutation-testing-implementation.plan.md)
- [mutation-testing-incremental-rollout-concept-exploration-2026-07-15.md](../../../reports/mutation-testing-incremental-rollout-concept-exploration-2026-07-15.md)
- [evidence-bundle.template.md](../evidence-bundle.template.md)

## Atomic Tasks

### Task 5.0a: Re-verify the Recorded Baseline

- Output:
  - dated confirmation or correction of the 2026-07-15 current-state facts
- Deterministic validation:
  - `rg -n "Current State — Re-baselined|<NONEXISTENT>" .agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md`
  - `rg -n "\"mutate\"" turbo.json package.json`

### Task 5.0b: RED-to-GREEN Dry-run Contract

- Output:
  - typed root configuration contract and one workspace-local config
  - explicit production source and unit/integration test globs
  - evidence that no E2E test is selected and `allowEmpty` remains false
- Stop condition:
  - do not create mutants until the unmutated dry run is deterministic

### Task 5.1: Pure Unit Canary

- Output:
  - re-verified canary choice, initially `@oaknational/type-helpers`
  - one full, non-incremental result with every survivor category dispositioned
- Deterministic validation:
  - `rg -n "pilot|surviv|runtime|score" .agent/plans/agentic-engineering-enhancements/evidence .agent/plans/agentic-engineering-enhancements 2>/dev/null`

### Task 5.2: Integration-only, Then Mixed Canary

- Output:
  - integration-only result, initially from re-verified
    `@oaknational/search-contracts`
  - proof of integration inclusion and E2E exclusion
  - one later mixed unit/integration result

### Task 5.3: Optimisation Evaluations

- Output:
  - TypeScript-checker comparison
  - incremental reuse comparison after a trusted full result
  - measured invocation-cadence options and report-retention contract
- Deterministic validation:
  - `rg -n "TypeScript checker|incremental|cadence|retention" .agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md`

### Task 5.4: Value-led Expansion and Gate Decision

- Output:
  - named next workspaces justified by behavioural risk and feedback cost
  - explicit no-change or separate proposal for blocking promotion
- Stop condition:
  - do not turn a score or workspace-adoption percentage into an unexamined
    target

### Task 5.5: Evidence Bundles per Phase

- Output:
  - evidence artifact for each source phase claim set
- Deterministic validation:
  - `ls -1 .agent/plans/agentic-engineering-enhancements/evidence/*.evidence.md`

### Task 5.6: Documentation Synchronisation

- Output:
  - Phase 5 entry updated in documentation sync log
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 5|Status:|ADR-119 update or rationale|practice.md update or rationale|practice-application update or rationale|Consolidation review" .agent/memory/operational/documentation-sync-logs/agentic-engineering-enhancements.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`

## Done When

1. Source phases 0-4 are delivered with deterministic validation.
2. Rollout claims are evidence-backed.
3. Unit, integration-only, and mixed test-scope claims are separately proven.
4. Promotion decision for `pnpm check` is explicit and justified, including a
   valid no-promotion result.
5. Documentation sync entry is complete for Phase 5.
