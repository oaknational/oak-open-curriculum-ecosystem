---
name: "Phase 1 - Hallucination Guarding Execution"
overview: >
  Prevent unsupported non-trivial security claims by requiring explicit claim
  classes, verification states, and evidence-ready language across key prompts
  and reviewer guidance.
todos:
  - id: p1-policy-contract
    content: "Define and publish security non-trivial claim classes and verification states."
    status: pending
  - id: p1-prompt-integration
    content: "Integrate hallucination guard requirements into start-right and review prompts."
    status: pending
  - id: p1-reviewer-integration
    content: "Integrate unsupported-claim checks into reviewer templates."
    status: pending
  - id: p1-pilot
    content: "Run one pilot stream and capture unsupported-claim baseline evidence."
    status: pending
  - id: p1-calibration
    content: "Calibrate strictness and update guidance from pilot findings."
    status: pending
  - id: p1-doc-sync
    content: "Update documentation sync log with Phase 1 impacts and rationale."
    status: pending
isProject: false
---

# Phase 1 - Hallucination Guarding Execution

## Source Strategy

- [roadmap.md](../roadmap.md)
- [developing-secure-mcp-servers.research.md](../developing-secure-mcp-servers.research.md)
- [phase-1-security-claim-contract.md](../phase-1-security-claim-contract.md)
- [phase-1-hallucination-guarding-execution.md](../../agentic-engineering-enhancements/active/phase-1-hallucination-guarding-execution.md)

## Preflight

1. Re-read:
   - `.agent/directives/rules.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Create pilot evidence artefact:

```bash
cp .agent/plans/security-and-privacy/evidence-bundle.template.md \
  .agent/plans/security-and-privacy/evidence/$(date +%F)-security-hardening-phase1-run-001.evidence.md
```

## Atomic Tasks

### Task 1.1: Security Claim Contract

- Output:
  - claim classes and verification states documented for security work in
    `phase-1-security-claim-contract.md`
  - explicit alignment statement to global guardrail policy
- Deterministic validation:
  - `rg -n "security-control-enabled|policy-enforced|risk-reduced|verified|partially verified|unverified" .agent/plans/security-and-privacy`
  - `test -f .agent/plans/security-and-privacy/phase-1-security-claim-contract.md`
  - `rg -n "Alignment Rule|Claim Classes|Verification Statuses|Guard Rules" .agent/plans/security-and-privacy/phase-1-security-claim-contract.md`

### Task 1.2: Prompt and Reviewer Integration

- Target surfaces:
  - `.agent/skills/start-right-quick/shared/start-right.md`
  - `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
  - `.agent/sub-agents/templates/*reviewer*.md`
- Deterministic validation:
  - `rg -n "non-trivial claim|unsupported claim|evidence" .agent/skills/start-right-quick/shared/start-right.md .agent/skills/start-right-thorough/shared/start-right-thorough.md .agent/sub-agents/templates/*reviewer*.md`

### Task 1.3: Pilot Baseline and Calibration

- Output:
  - one pilot evidence bundle with unsupported-claim baseline
  - calibration note documenting strictness changes
- Deterministic validation:
  - `ls -1 .agent/plans/security-and-privacy/evidence/*.evidence.md`
  - `rg -n "pilot|baseline|calibration" .agent/plans/security-and-privacy`

### Task 1.4: Documentation Synchronisation

- Output:
  - Phase 1 entry updated in `documentation-sync-log.md`
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 1|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/security-and-privacy/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`

## Done When

1. Hallucination-guard contract exists for security-relevant non-trivial claims.
2. Target prompt/reviewer surfaces enforce unsupported-claim handling.
3. Pilot baseline evidence exists with calibration notes.
4. Documentation sync entry is complete for Phase 1.
