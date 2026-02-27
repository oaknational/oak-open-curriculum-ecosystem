---
name: "Phase 2 - Evidence-Based Claims Execution"
overview: >
  Standardise claim-to-evidence mapping for security hardening work and enforce
  merge-readiness expectations for non-trivial security claims.
todos:
  - id: p2-evidence-contract
    content: "Finalise claim-to-evidence contract and claim classes for security work."
    status: pending
  - id: p2-evidence-workflow
    content: "Integrate evidence bundle workflow into active security execution paths."
    status: pending
  - id: p2-merge-readiness
    content: "Define merge-readiness checks that reject unsupported non-trivial security claims."
    status: pending
  - id: p2-pilot
    content: "Run evidence-backed pilot and capture verification outcomes."
    status: pending
  - id: p2-doc-sync
    content: "Update documentation sync log with Phase 2 impacts and rationale."
    status: pending
isProject: false
---

# Phase 2 - Evidence-Based Claims Execution

## Source Strategy

- [roadmap.md](../roadmap.md)
- [phase-1-hallucination-guarding-execution.md](phase-1-hallucination-guarding-execution.md)
- [evidence-bundle.template.md](../evidence-bundle.template.md)
- [phase-2-evidence-merge-readiness-rules.md](../phase-2-evidence-merge-readiness-rules.md)
- [phase-2-evidence-based-claims-execution.md](../../agentic-engineering-enhancements/active/phase-2-evidence-based-claims-execution.md)

## Preflight

1. Re-read:
   - `.agent/directives/rules.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Prepare pilot evidence artefact:

```bash
cp .agent/plans/security-and-privacy/evidence-bundle.template.md \
  .agent/plans/security-and-privacy/evidence/$(date +%F)-security-hardening-phase2-run-001.evidence.md
```

## Atomic Tasks

### Task 2.1: Claim-to-Evidence Contract

- Output:
  - explicit rule set in `phase-2-evidence-merge-readiness-rules.md`
    requiring non-trivial security claims to include evidence references
- Deterministic validation:
  - `rg -n "Claim Register|Merge-Readiness Check|non-trivial" .agent/plans/security-and-privacy/evidence-bundle.template.md .agent/plans/security-and-privacy/roadmap.md`
  - `test -f .agent/plans/security-and-privacy/phase-2-evidence-merge-readiness-rules.md`
  - `rg -n "Evidence Rules|Merge-Readiness Rules|Required Artefacts" .agent/plans/security-and-privacy/phase-2-evidence-merge-readiness-rules.md`

### Task 2.2: Workflow Integration

- Output:
  - active plans include repeatable evidence workflow for security phases
- Deterministic validation:
  - `rg -n "evidence artefact|evidence bundle|claim" .agent/plans/security-and-privacy/active/*.md`

### Task 2.3: Merge-Readiness Rule

- Output:
  - merge-readiness rule encoded for unsupported non-trivial security claims
    in `phase-2-evidence-merge-readiness-rules.md`
- Deterministic validation:
  - `rg -n "not merge-ready|unsupported non-trivial claims" .agent/plans/security-and-privacy`

### Task 2.4: Pilot Evidence Run

- Output:
  - at least one completed evidence bundle showing verified or partially verified claims
- Deterministic validation:
  - `ls -1 .agent/plans/security-and-privacy/evidence/*.evidence.md`

### Task 2.5: Documentation Synchronisation

- Output:
  - Phase 2 entry updated in `documentation-sync-log.md`
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 2|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/security-and-privacy/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`
  - `test -f .agent/reference-docs/prog-frame/agentic-engineering-practice.md`

## Done When

1. Claim-to-evidence contract is explicit and reusable.
2. Evidence workflow is integrated into security phase execution.
3. Merge-readiness rule is defined for unsupported non-trivial claims.
4. Documentation sync entry is complete for Phase 2.
