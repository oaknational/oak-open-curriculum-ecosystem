---
name: "Phase 1 - Hallucination Guarding Execution"
overview: >
  Execute hallucination-guard policy and workflow integration so non-trivial
  claims cannot be accepted without verifiable support.
todos:
  - id: p1-kickoff-pack
    content: "Prepare Phase 1 kickoff package (baseline capture, edit order, pilot protocol)."
    status: completed
  - id: p1-policy-contract
    content: "Define and publish non-trivial claim classes and verification states."
    status: pending
  - id: p1-prompt-integration
    content: "Integrate claim requirements into start-right and review prompts."
    status: pending
  - id: p1-reviewer-integration
    content: "Integrate claim checks into reviewer templates."
    status: pending
  - id: p1-pilot
    content: "Run one pilot stream and capture unsupported-claim baseline."
    status: pending
  - id: p1-calibration
    content: "Calibrate strictness and update guidance based on pilot findings."
    status: pending
  - id: p1-doc-sync
    content: "Update documentation sync log with ADR/directive/reference-doc/README impact for Phase 1."
    status: pending
---

# Phase 1 - Hallucination Guarding Execution

## Source Strategy

- [hallucination-and-evidence-guard-adoption.plan.md](../hallucination-and-evidence-guard-adoption.plan.md)

## Kickoff Package (Prepared 2026-02-24)

Execution is intentionally staged so we can land policy first, then prompts,
then reviewer templates, then pilot evidence.

### Preflight (run before any non-planning edits)

1. Re-read:
   - `.agent/directives/rules.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Capture baseline signal:

```bash
rg -n "non-trivial claim|verified|partially verified|unverified|claim-to-evidence|abstain|unsupported claim|No evidence for non-trivial claim" \
  .agent/prompts/start-right.prompt.md \
  .agent/prompts/start-right-thorough.prompt.md \
  .agent/prompts/gt-review.md \
  .agent/sub-agents/templates/code-reviewer.md \
  .agent/sub-agents/templates/architecture-reviewer.md \
  .agent/sub-agents/templates/test-reviewer.md \
  .agent/sub-agents/templates/security-reviewer.md
```

Expected initial baseline: little/no explicit hallucination-guard vocabulary.

3. Prepare pilot evidence artefact:

```bash
cp .agent/plans/agentic-engineering-enhancements/evidence-bundle.template.md \
  .agent/plans/agentic-engineering-enhancements/evidence/$(date +%F)-hallucination-guards-phase1-run-001.evidence.md
```

### File-by-File Edit Order (Phase 1 implementation)

1. Policy contract first:
   - `.agent/prompts/start-right.prompt.md`
   - `.agent/prompts/start-right-thorough.prompt.md`
   - `.agent/prompts/gt-review.md`
2. Reviewer template integration second:
   - `.agent/sub-agents/templates/code-reviewer.md`
   - `.agent/sub-agents/templates/test-reviewer.md`
   - `.agent/sub-agents/templates/architecture-reviewer.md`
   - `.agent/sub-agents/templates/security-reviewer.md`
3. Calibration and pilot evidence third:
   - `.agent/plans/agentic-engineering-enhancements/evidence/*.evidence.md`
   - `.agent/plans/agentic-engineering-enhancements/documentation-sync-log.md` (Phase 1 section)

### Required Contract Content to Add During Implementation

- Claim classes: tests-pass, build-type-lint-pass, behaviour-change, api-compat, security-or-migration-safety.
- Verification states: `verified`, `partially verified`, `unverified`.
- Behaviour rule: no non-trivial claim without evidence pointer.
- Uncertainty rule: explicit abstention and follow-up action.
- Merge-readiness language: unsupported non-trivial claims are not merge-ready.

### Pilot Protocol (minimum)

1. Choose one active stream for pilot execution (single stream only).
2. Produce one evidence bundle with:
   - baseline unsupported-claim count
   - at least one corrected claim-to-evidence mapping example
   - calibration notes (strictness changes and why)
3. Update Phase 1 entry in `documentation-sync-log.md`.

## Atomic Tasks

### Task 1.1: Publish Policy Contract

- Output:
  - policy contract available in agent-facing guidance (claim classes +
    verification statuses)
- Deterministic validation:
  - `rg -n "non-trivial claim|verified|partially verified|unverified" .agent/directives .agent/prompts`

### Task 1.2: Prompt Integration

- Target files:
  - `.agent/prompts/start-right.prompt.md`
  - `.agent/prompts/start-right-thorough.prompt.md`
  - `.agent/prompts/gt-review.md`
- Deterministic validation:
  - `rg -n "claim|evidence|abstain" .agent/prompts/start-right*.prompt.md .agent/prompts/gt-review.md`

### Task 1.3: Reviewer Template Integration

- Target files:
  - `.agent/sub-agents/templates/code-reviewer.md`
  - `.agent/sub-agents/templates/architecture-reviewer.md`
  - `.agent/sub-agents/templates/test-reviewer.md`
  - `.agent/sub-agents/templates/security-reviewer.md`
- Deterministic validation:
  - `rg -n "claim|evidence|unsupported" .agent/sub-agents/templates/*reviewer*.md`

### Task 1.4: Pilot Baseline

- Output:
  - one evidence bundle with unsupported-claim baseline
- Deterministic validation:
  - `ls -1 .agent/plans/agentic-engineering-enhancements/evidence/*.evidence.md`

### Task 1.5: Calibration Update

- Output:
  - updated guidance from pilot findings
- Deterministic validation:
  - `rg -n "pilot|baseline|calibrate" .agent/plans/agentic-engineering-enhancements`

### Task 1.6: Documentation Synchronisation

- Output:
  - Phase 1 entry updated in documentation sync log
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 1|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`

## Done When

1. Hallucination-guard requirements are integrated into prompts and reviewer templates.
2. Pilot baseline exists as evidence artifact.
3. Guidance reflects pilot calibration outcomes.
4. Documentation sync entry is complete for Phase 1.
