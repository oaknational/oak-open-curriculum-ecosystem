---
name: "Phase 2 - Evidence-Based Claims Execution"
overview: >
  Standardise evidence artifacts and enforce evidence-backed claims as a
  merge-readiness requirement.
todos:
  - id: p2-template-adoption
    content: "Adopt evidence bundle template in target plans and workflows."
    status: pending
  - id: p2-storage-convention
    content: "Enforce evidence storage and naming conventions."
    status: pending
  - id: p2-template-component-integration
    content: "Integrate evidence-and-claims guidance into plan templates/components usage."
    status: pending
  - id: p2-merge-readiness-rule
    content: "Wire evidence-based merge-readiness checks into review workflow."
    status: pending
  - id: p2-measurement
    content: "Capture adoption metrics (% claims with evidence, unsupported claims count)."
    status: pending
  - id: p2-doc-sync
    content: "Update documentation sync log with ADR/directive/reference-doc/README impact for Phase 2."
    status: pending
---

# Phase 2 - Evidence-Based Claims Execution

## Source Strategy

- [hallucination-and-evidence-guard-adoption.plan.md](../hallucination-and-evidence-guard-adoption.plan.md)
- [evidence-bundle.template.md](../evidence-bundle.template.md)

## Atomic Tasks

### Task 2.1: Evidence Template Adoption

- Output:
  - evidence template referenced from primary adoption plans
- Deterministic validation:
  - `rg -n "evidence-bundle.template.md" .agent/plans/agentic-engineering-enhancements/*.md`

### Task 2.2: Storage and Naming Convention

- Output:
  - evidence storage guidance present and discoverable
- Deterministic validation:
  - `test -f .agent/plans/agentic-engineering-enhancements/evidence/README.md`
  - `rg -n "YYYY-MM-DD-<plan-slug>-<phase>-<run-id>.evidence.md" .agent/plans/agentic-engineering-enhancements`

### Task 2.3: Template/Component Integration

- Output:
  - evidence/claims guidance reusable in template system
- Deterministic validation:
  - `test -f .agent/plans/templates/components/evidence-and-claims.md`
  - `rg -n "evidence-and-claims" .agent/plans/templates/README.md`

### Task 2.4: Merge-Readiness Enforcement

- Output:
  - explicit rule that unsupported non-trivial claims block merge-ready state
- Deterministic validation:
  - `rg -n "not merge-ready|No evidence for non-trivial claim" .agent/plans/agentic-engineering-enhancements`

### Task 2.5: Adoption Metrics

- Output:
  - periodic metrics note in evidence artifacts or plan updates
- Deterministic validation:
  - `rg -n "unsupported claims|% claims with evidence|baseline" .agent/plans/agentic-engineering-enhancements/evidence .agent/plans/agentic-engineering-enhancements 2>/dev/null`

### Task 2.6: Documentation Synchronisation

- Output:
  - Phase 2 entry updated in documentation sync log
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 2|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/directives/practice.md`
  - `test -f .agent/reference-docs/prog-frame/agentic-engineering-practice.md`

## Done When

1. Evidence template and component are embedded in planning workflow.
2. Storage and naming conventions are consistently used.
3. Merge-readiness rule is explicit and evidence-backed.
4. Documentation sync entry is complete for Phase 2.
