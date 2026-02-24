---
name: "Phase 3 - Architectural Enforcement Execution"
overview: >
  Execute architectural enforcement phases 0-5 with atomic, validated tasks
  and evidence-backed completion claims.
todos:
  - id: p3-phase0-lint-baseline
    content: "Phase 0: Complete ESLint strict baseline."
    status: pending
  - id: p3-phase1-max-files
    content: "Phase 1: Wire max-files-per-dir rule and resolve violations."
    status: pending
  - id: p3-phase2-boundaries
    content: "Phase 2: Configure eslint-plugin-boundaries using canonical import matrix."
    status: pending
  - id: p3-phase3-depcruise
    content: "Phase 3: Land dependency-cruiser barrel and boundary checks."
    status: pending
  - id: p3-phase4-knip
    content: "Phase 4: Integrate knip dead-code detection into workflow."
    status: pending
  - id: p3-phase5-grounding
    content: "Phase 5: Add architectural enforcement directive grounding and qg updates."
    status: pending
  - id: p3-doc-sync
    content: "Update documentation sync log with ADR/directive/reference-doc/README impact for Phase 3."
    status: pending
---

# Phase 3 - Architectural Enforcement Execution

## Source Strategy

- [architectural-enforcement-adoption.plan.md](../architectural-enforcement-adoption.plan.md)

## Atomic Tasks

### Task 3.0 (Source Phase 0): ESLint Strict Baseline

- Output:
  - strict lint baseline restored across target workspaces
- Deterministic validation:
  - `pnpm lint`

### Task 3.1 (Source Phase 1): Physical Modularity Rule

- Output:
  - `max-files-per-dir` exported and active in strict config
- Deterministic validation:
  - `rg -n "max-files-per-dir" packages/core/oak-eslint src eslint.config.ts packages/core/oak-eslint`

### Task 3.2 (Source Phase 2): Layer Boundary Rules

- Output:
  - `eslint-plugin-boundaries` config reflects canonical matrix
- Deterministic validation:
  - `rg -n "boundaries|core|libs|sdks|apps" eslint.config.ts packages 2>/dev/null`

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
  - architectural enforcement directive exists and is referenced from root grounding docs
- Deterministic validation:
  - `test -f .agent/directives/architectural-enforcement.md`
  - `rg -n "architectural-enforcement\\.md" .agent/directives/AGENT.md`

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
  - `test -f .agent/directives/practice.md`
  - `test -f .agent/reference-docs/prog-frame/agentic-engineering-practice.md`

## Done When

1. Source phases 0-5 are implemented with deterministic checks.
2. Enforcement completion claims are evidence-backed.
3. Quality gates pass for the enforcement delta.
4. Documentation sync entry is complete for Phase 3.
