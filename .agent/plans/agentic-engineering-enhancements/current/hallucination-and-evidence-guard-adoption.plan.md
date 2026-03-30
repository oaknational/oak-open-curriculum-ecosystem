---
name: Hallucination and Evidence Guard Adoption
overview: >
  Deliver immediate risk reduction for AI-assisted delivery by prioritising
  hallucination guards first, then operationalising evidence-based claims for
  merge-readiness decisions.
todos:
  - id: hg-policy-contract
    content: "Define hallucination-guard policy with explicit non-trivial claim classes."
    status: pending
  - id: hg-integration-files
    content: "Apply hallucination-guard requirements to concrete prompts, reviewer templates, and plan templates."
    status: pending
  - id: hg-workflow-integration
    content: "Integrate claim->cite->verify expectations into prompts, directives, and review workflow."
    status: pending
  - id: hg-pilot-metrics
    content: "Run pilot adoption and baseline unsupported-claim/error rates."
    status: pending
  - id: evidence-schema
    content: "Define a standard evidence bundle format (commands, outputs, file spans, tests)."
    status: pending
  - id: evidence-merge-readiness
    content: "Enforce evidence completeness for non-trivial claims before merge-ready state."
    status: pending
---

# Hallucination and Evidence Guard Adoption

## 1. Intent

Reduce the highest current risk in AI-assisted engineering work: confidently-wrong claims becoming accepted implementation narratives.

This plan intentionally prioritises:

1. **Hallucination guarding** (highest and immediate concern)
2. **Evidence-based claims** (next priority)

### Execution Role

This is a strategic source plan (intent, policy, phase design, success
criteria). Day-to-day implementation tasks live in:

- [phase-1-hallucination-guarding-execution.md](active/phase-1-hallucination-guarding-execution.md)
- [phase-2-evidence-based-claims-execution.md](active/phase-2-evidence-based-claims-execution.md)

It is aligned with:

- [Augmented Engineering Safety (research)](augmented-engineering-safety.research.md)
- [Augmented Engineering Practices (research)](augmented-engineering-practices.research.md)
- [Architectural Enforcement Adoption](architectural-enforcement-adoption.plan.md)
- [Evidence Bundle Template](evidence-bundle.template.md)

## 2. Scope and Priority Order

### In Scope

- A policy and workflow that forces non-trivial claims to be verifiable.
- A practical claim -> cite -> verify loop for day-to-day plan, implementation, and review work.
- Evidence capture rules strong enough to support merge-readiness decisions.

### Out of Scope for This Plan (deferred notes only)

- Sandboxed execution rollout
- Prompt-injection red-team automation

These are intentionally deferred and noted in Section 8 only.

## 3. Foundation Cadence (applies at each phase)

At the start of each phase, re-read:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

And re-ask:

1. Are we solving the right problem at the right layer?
2. Could this be simpler without compromising quality?
3. Does each claimed outcome have observable evidence?

## 4. Workstream A: Hallucination Guarding (Highest Priority)

### A1. Define the policy contract

Define non-trivial claims that require evidence before they can be presented as fact:

- "Tests pass"
- "Type-check/build/lint pass"
- "Behaviour preserved/changed"
- "API/signature compatibility claim"
- "Performance/security/migration safety claim"

For each class, require:

- claim statement
- cited evidence pointer(s)
- verification status (`verified`, `partially verified`, `unverified`)

### A2. Integrate claim -> cite -> verify into existing workflow

Update agent-facing guidance (prompts/directives/review checklists) so outputs must:

- cite evidence for each non-trivial claim
- abstain when evidence is missing
- distinguish intent from observed result

Target integration points:

- start-right prompts
- review prompts/checklists
- plan templates used for implementation planning

### A2.1 File-level integration map

Apply phase work explicitly to:

- `.agent/skills/start-right-quick/shared/start-right.md`
- `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
- `.agent/prompts/archive/gt-review.md`
- `.agent/sub-agents/templates/code-reviewer.md`
- `.agent/sub-agents/templates/architecture-reviewer.md`
- `.agent/sub-agents/templates/test-reviewer.md`
- `.agent/sub-agents/templates/security-reviewer.md`
- `.agent/plans/templates/feature-workstream-template.md`
- `.agent/plans/templates/quality-fix-plan-template.md`

Minimum required integration in each target:

- classify non-trivial claims
- require claim-to-evidence linkage for assertions
- require explicit abstention where evidence is missing

### A3. Pilot and calibrate

Pilot on one active plan stream and collect baseline signals:

- unsupported claims found during review
- incorrect "tests pass" statements
- reviewer effort to validate claims

Use pilot results to tune strictness before wider enforcement.

## 5. Workstream B: Evidence-Based Claims (Second Priority)

### B1. Define a standard evidence bundle

Create a minimal, repeatable evidence format for engineering claims:

- command executed
- captured output excerpt
- file span references (`path:line`)
- test suite and result evidence
- diff references for behaviour-change claims

Initial template artifact:

- [Evidence Bundle Template](evidence-bundle.template.md)

### B2. Standardise evidence placement

Define where evidence lives for consistency:

- collection evidence artefacts in `.agent/plans/agentic-engineering-enhancements/evidence/`
- plan updates
- PR/change narrative
- review handoff notes

The objective is reproducibility, not verbosity.

File naming convention for this collection:

- `YYYY-MM-DD-<plan-slug>-<phase>-<run-id>.evidence.md`

### B3. Merge-readiness rule

Adopt policy:

- No evidence for non-trivial claim -> not merge-ready
- No test output evidence -> cannot claim tests passed

If uncertain, the correct behaviour is explicit abstention and follow-up verification.

## 6. Delivery Sequence

1. **Phase 0 (A1)**: policy contract and non-trivial claim classes
2. **Phase 1 (A2 + A3)**: workflow integration and pilot baseline
3. **Phase 2 (B1 + B2)**: evidence bundle and placement standard
4. **Phase 3 (B3)**: merge-readiness enforcement

## 7. Success Metrics

- 100% of non-trivial claims include evidence pointers in pilot scope
- 0 accepted "tests pass" claims without command/output evidence
- Downward trend in unsupported-claim findings across review cycles
- Reviewers can validate claims without reconstructing context from scratch

## 8. Documentation Propagation Requirement

Apply the shared documentation-propagation contract:

- [Documentation Propagation component](../templates/components/documentation-propagation.md)
- [documentation-sync-log.md](documentation-sync-log.md) (collection tracking)

## 9. Deferred Safety Notes (not planned now)

The following are acknowledged as important but intentionally deferred:

1. Sandboxed execution and privilege isolation
2. Prompt-injection and confused-deputy red-team automation

Revisit trigger:

- after hallucination/evidence controls stabilise across at least two delivery cycles, or
- when safety incidents indicate earlier escalation is needed.

## 10. Dependencies and Alignment

- This plan complements architectural enforcement; it does not replace structural constraints.
- This plan complements mutation testing; mutation testing validates test quality, while this plan validates claim integrity.
- This plan is platform-agnostic and should remain compatible with cross-agent standardisation work.
- Shared evidence format lives in [Evidence Bundle Template](evidence-bundle.template.md).

## 11. Template Integration Strategy (ADR-117)

This document is a collection-level strategic plan. Implementation sessions should instantiate executable plans from the shared templates and components:

- Use `.agent/plans/templates/quality-fix-plan-template.md` for policy, prompt, and review-guidance updates.
- Use `.agent/plans/templates/feature-workstream-template.md` for code-integrated enforcement work.
- Apply components from `.agent/plans/templates/components/`:
  - `foundation-alignment.md`
  - `quality-gates.md`
  - `risk-assessment.md`
  - `adversarial-review.md`

Collection-specific addition:

- [Evidence Bundle Template](evidence-bundle.template.md) acts as a specialised, reusable evidence component for claim verification.
