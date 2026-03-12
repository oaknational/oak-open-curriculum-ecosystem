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

- [hallucination-and-evidence-guard-adoption.plan.md](../current/hallucination-and-evidence-guard-adoption.plan.md)
- [evidence-bundle.template.md](../evidence-bundle.template.md)

## Preflight

Before any non-planning edits:

1. Re-read:
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Confirm evidence-bundle template exists:

```bash
test -f .agent/plans/agentic-engineering-enhancements/evidence-bundle.template.md
```

## Blocked Protocol

If any validation command fails or produces unexpected output during
task execution:

1. **Stop** — do not proceed to the next step or task
2. **Document** the failure: command, actual output, expected output
3. **Present** the failure to the project owner before continuing
4. **Do not guess** a workaround — ask for clarification

## Atomic Tasks

### Task 2.1: Evidence Template Adoption

- Output:
  - evidence template referenced from primary adoption plans
- Deterministic validation:
  - `rg -n "evidence-bundle.template.md" .agent/plans/agentic-engineering-enhancements/*.md`

#### Steps

1. **Identify target plans** that make non-trivial claims but lack evidence references
   - Run: `rg -l "claim\|evidence\|merge-ready" .agent/plans/agentic-engineering-enhancements/*.md`
   - Expected: list of candidate plans
2. **Add evidence template reference** to each plan that lacks one
   - File: each identified plan
   - Change: add `> See [Evidence Bundle Template](../evidence-bundle.template.md)` in the appropriate section
3. **Validate references are present**
   - Run: `rg -n "evidence-bundle.template.md" .agent/plans/agentic-engineering-enhancements/*.md`
   - Expected: at least 3 matches across distinct plan files

### Task 2.2: Storage and Naming Convention

- Output:
  - evidence storage guidance present and discoverable
- Deterministic validation:
  - `test -f .agent/plans/agentic-engineering-enhancements/evidence/README.md`
  - `rg -n "YYYY-MM-DD-<plan-slug>-<phase>-<run-id>.evidence.md" .agent/plans/agentic-engineering-enhancements`

#### Steps

1. **Create evidence directory** if it does not exist
   - Run: `mkdir -p .agent/plans/agentic-engineering-enhancements/evidence`
2. **Write README.md** with naming convention, storage rules, and examples
   - File: `.agent/plans/agentic-engineering-enhancements/evidence/README.md`
   - Content: naming pattern `YYYY-MM-DD-<plan-slug>-<phase>-<run-id>.evidence.md`, storage location, lifecycle (created at phase start, finalised at phase end)
3. **Validate**
   - Run: `test -f .agent/plans/agentic-engineering-enhancements/evidence/README.md && echo "EXISTS"`
   - Expected: `EXISTS`

### Task 2.3: Template/Component Integration

- Output:
  - evidence/claims guidance reusable in template system
  - plan-compliance check integrated into adversarial-review component
- Deterministic validation:
  - `test -f .agent/plans/templates/components/evidence-and-claims.md`
  - `rg -n "evidence-and-claims" .agent/plans/templates/README.md`
  - `rg -n "Verify plan compliance" .agent/plans/templates/components/adversarial-review.md`

#### Steps

1. **Verify evidence-and-claims component exists** (already created)
   - Run: `test -f .agent/plans/templates/components/evidence-and-claims.md && echo "EXISTS"`
   - Expected: `EXISTS`
2. **Verify README.md references it**
   - Run: `rg -n "evidence-and-claims" .agent/plans/templates/README.md`
   - Expected: at least 1 match
3. **Verify adversarial-review includes plan-compliance gate** (added 2026-03-04)
   - Run: `rg -n "Verify plan compliance" .agent/plans/templates/components/adversarial-review.md`
   - Expected: at least 1 match
4. **If any check fails**, create the missing artefact per the blocked protocol

### Task 2.4: Merge-Readiness Enforcement

- Output:
  - explicit rule that unsupported non-trivial claims block merge-ready state
- Deterministic validation:
  - `rg -n "not merge-ready|No evidence for non-trivial claim" .agent/plans/agentic-engineering-enhancements .agent/plans/templates/components/evidence-and-claims.md`

#### Steps

1. **Check if merge-readiness rule already exists** in evidence-and-claims component
   - Run: `rg -n "not merge-ready" .agent/plans/templates/components/evidence-and-claims.md`
   - Expected: at least 1 match (already present)
2. **Ensure adoption plan also states the rule**
   - Run: `rg -n "not merge-ready" .agent/plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md`
   - Expected: at least 1 match; if missing, add it
3. **Validate combined coverage**
   - Run: `rg -c "not merge-ready|No evidence for non-trivial claim" .agent/plans/agentic-engineering-enhancements .agent/plans/templates/components/evidence-and-claims.md`
   - Expected: 2+ matches across files

### Task 2.5: Adoption Metrics

- Output:
  - periodic metrics note in evidence artefacts or plan updates
- Deterministic validation:
  - `rg -n "unsupported claims|% claims with evidence|baseline" .agent/plans/agentic-engineering-enhancements/evidence .agent/plans/agentic-engineering-enhancements 2>/dev/null`

#### Steps

1. **Define metric collection approach**: scan active plans for claims without evidence IDs
   - Run: `rg -c "claim class|evidence ID|evidence reference" .agent/plans/*/active/*.md 2>/dev/null || echo "0 matches"`
   - Expected: count of current adoption
2. **Record baseline** in evidence directory
   - File: `.agent/plans/agentic-engineering-enhancements/evidence/$(date +%F)-p2-adoption-metrics-run-001.evidence.md`
   - Content: date, scan command, count, percentage of plans with evidence artefacts
3. **Validate**
   - Run: `ls .agent/plans/agentic-engineering-enhancements/evidence/*adoption-metrics* 2>/dev/null | head -1`
   - Expected: at least 1 file path

### Task 2.6: Documentation Synchronisation

- Output:
  - Phase 2 entry updated in documentation sync log
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 2|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`

#### Steps

1. **Update documentation sync log** with Phase 2 entry
   - File: `.agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
   - Content: status, ADR-119 impact (update or no-change rationale), practice.md impact
2. **Run consolidation**
   - Run: `jc-consolidate-docs` (or equivalent manual review)
3. **Validate sync log entry**
   - Run: `rg -n "## Phase 2" .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
   - Expected: 1 match

## Evidence and Claims

> See [Evidence and Claims component](../../templates/components/evidence-and-claims.md)

- Every non-trivial claim in this phase must map to evidence IDs in the phase
  evidence bundle.

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

## Done When

1. Evidence template and component are embedded in planning workflow.
2. Storage and naming conventions are consistently used.
3. Merge-readiness rule is explicit and evidence-backed.
4. Plan-compliance check is integrated into adversarial-review component.
5. Adoption metrics baseline is captured.
6. Documentation sync entry is complete for Phase 2.
7. No blocked-protocol items remain unresolved.
