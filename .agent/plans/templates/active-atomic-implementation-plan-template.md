---
name: "[Phase Name] - Atomic Execution"
overview: >
  [One-line execution summary with deterministic outcomes.]
todos:
  - id: phase-kickoff
    content: "Prepare baseline and execution order."
    status: pending
  - id: phase-policy
    content: "[Define/update policy or contract for this phase.]"
    status: pending
  - id: phase-implementation
    content: "[Deliver implementation tasks with deterministic validation.]"
    status: pending
  - id: phase-evidence
    content: "[Capture evidence artefact(s) for non-trivial claims.]"
    status: pending
  - id: phase-doc-sync
    content: "Update documentation sync log with required canonical docs impact."
    status: pending
isProject: false
---

# [Phase Name] - Atomic Execution

## Source Strategy

- [roadmap.md](../roadmap.md)
- [[strategic-source].plan.md](../[strategic-source].plan.md)
- [[research-source].research.md](../[research-source].research.md)

## Preflight

Before any non-planning edits:

1. Re-read:
   - `.agent/directives/rules.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Capture baseline signal:

```bash
[deterministic baseline command]
```

3. Prepare evidence artefact:

```bash
cp .agent/plans/[collection]/evidence-bundle.template.md \
  .agent/plans/[collection]/evidence/$(date +%F)-[phase-slug]-run-001.evidence.md
```

## Atomic Tasks

### Task 1: [Task Name]

- Output: [Expected artefact(s)]
- Deterministic validation:
  - `[command]`

### Task 2: [Task Name]

- Output: [Expected artefact(s)]
- Deterministic validation:
  - `[command]`

### Task 3: Documentation Synchronisation

- Output:
  - Phase entry updated in `documentation-sync-log.md`
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## [Phase]|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/[collection]/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`
  - `test -f .agent/reference-docs/prog-frame/agentic-engineering-practice.md`

## Evidence and Claims

> See [Evidence and Claims component](components/evidence-and-claims.md)

- Every non-trivial claim in this phase must map to evidence IDs in the phase
  evidence bundle.

## Foundation Alignment

> See [Foundation Alignment component](components/foundation-alignment.md)

## Done When

1. All atomic tasks complete with deterministic validation output.
2. Evidence bundle exists and covers non-trivial claims.
3. Documentation sync entry is complete for this phase.
