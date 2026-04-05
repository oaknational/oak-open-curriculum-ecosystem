# Assumption Auditing: A Meta-Level Capability

**Type**: Transferable Pattern
**Origin**: oak-mcp-ecosystem (2026-04-02)
**Related concept**: Assumptions Reviewer — Meta-Level Plan Assessment

## Summary

Assumption auditing is a meta-level review capability that questions whether proposed work is proportional to the problem, whether assumptions have evidence, and whether blocking relationships are legitimate. It operates at the plan/design level, not the code level.

## The Gap It Fills

Existing reviewer systems question whether work is done correctly (code quality, architectural compliance, type safety, test coverage, documentation accuracy). No existing reviewer questions whether the work should be done at all, or at the proposed scale. This creates a systematic bias toward accepting plans as proposed, regardless of proportionality.

## Key Design Decision: Inverted Doctrine Hierarchy

Standard domain specialists (per the domain specialist capability pattern) place external expertise at the top of their doctrine hierarchy. The assumptions reviewer inverts this:

1. **Project principles** — "could it be simpler?" takes priority
2. **Architectural decisions** — existing constraints
3. **Practice governance** — development practice and quality gates
4. **External expertise** — consulted for fact-checking, not for driving decisions

The inversion is intentional. External expertise answers "how should we do X?" Project principles answer "should we do X at all?"

## Assessment Areas

Six areas, applicable to any plan or design proposal:

1. **Proportionality** — is the work proportional to the problem?
2. **Assumption validity** — do assumptions have evidence?
3. **Blocking legitimacy** — do blockers reflect genuine dependencies?
4. **Consumer evidence** — do proposed artefacts have identified consumers?
5. **Technology commitment timing** — are choices committed before research?
6. **Simplification opportunities** — where could less machinery deliver the same outcome?

## Output: Assumption Audit

A structured per-assumption evidence check with three ratings:

- **Validated** — evidence exists and supports the assumption
- **Partially validated** — some evidence but gaps remain
- **Unvalidated** — no evidence; assumption treated as decision without basis

## Adoption Guidance

This pattern follows the domain specialist capability triplet shape (reviewer template + active skill + situational rule) and can be adopted by any repo carrying the agentic engineering practice. The inverted doctrine hierarchy is the key differentiator — it requires a conscious departure from the standard domain specialist hierarchy.

Trigger conditions: plan marked decision-complete, blocking assertions, 3+ agents proposed, new workspace categories, technology commitments before research.
