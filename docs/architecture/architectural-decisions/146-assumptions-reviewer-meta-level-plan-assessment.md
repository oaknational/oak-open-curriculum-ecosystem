# ADR-146: Assumptions Reviewer — Meta-Level Plan Assessment

**Status**: Accepted
**Date**: 2026-04-02
**Related**: [ADR-129 (Domain Specialist Capability Pattern)](129-domain-specialist-capability-pattern.md), [ADR-114 (Layered Sub-agent Prompt Composition)](114-layered-sub-agent-prompt-composition-architecture.md), [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md), [ADR-125 (Agent Artefact Portability)](125-agent-artefact-portability.md)

## Context

The existing reviewer system questions code quality, architecture, security, types, tests, and documentation — but no reviewer questions whether the plan itself is proportional to the problem, whether blocking relationships are legitimate, or whether assumptions have evidence.

This gap was surfaced during the frontend-practice-integration plan's assumption audit (2026-04-01), which challenged proportionality, consumer evidence, technology commitment timing, and agent proliferation. The audit produced actionable amendments that simplified the plan. The methodology itself is transferable.

Existing reviewers apply their doctrine hierarchy with external expertise at the top (per ADR-129). An assumptions reviewer requires the opposite: project principles (especially "could it be simpler?") must outrank external expertise, because the reviewer's job is to question whether the proposed work is proportional, not whether it follows best practice.

## Decision

Create an `assumptions-reviewer` following the ADR-129 Domain Specialist Capability Pattern with an **inverted doctrine hierarchy**.

### Inverted Doctrine Hierarchy

1. **Project principles and directives** — especially the first question ("could it be simpler without compromising quality?"), proportionality, and simplicity-first assessment.
2. **Architectural decisions (ADRs)** — existing constraints and accepted trade-offs in the repository.
3. **Practice governance** — development practice, testing strategy, and quality gate framework.
4. **External expertise** — domain knowledge relevant to the plan's technology choices (lowest priority, consulted for fact-checking, not for driving decisions).

This inverts the standard ADR-129 hierarchy where external documentation ranks first. The inversion is intentional: the assumptions reviewer questions whether work is necessary and proportional, not whether it follows external best practice.

### Assessment Areas

The assumptions reviewer assesses six areas:

1. **Proportionality** — Is the proposed work proportional to the problem it solves? Could fewer artefacts, simpler architecture, or a smaller scope deliver equivalent value?
2. **Assumption validity** — For each assumption the plan makes, what evidence exists? What evidence is missing? Are unvalidated assumptions treated as decisions?
3. **Blocking legitimacy** — Do blocking relationships between workstreams reflect genuine technical dependencies, or are they sequencing preferences disguised as hard gates?
4. **Consumer evidence** — Do proposed artefacts (packages, agents, documents) have identified consumers? If a package has no consumer at plan time, is there evidence one will materialise?
5. **Technology commitment timing** — Are technology choices being committed to before research phases complete? Is the commitment reversible if research produces different conclusions?
6. **Simplification opportunities** — Where could the plan achieve the same outcome with less machinery?

### Output Format

The reviewer produces a structured Assumption Audit with per-assumption evidence ratings:

- **Validated** — evidence exists and supports the assumption.
- **Partially validated** — some evidence exists but gaps remain.
- **Unvalidated** — no evidence; the assumption is treated as a decision without basis.

## Rationale

### Why an inverted hierarchy

Standard reviewers question whether work is done correctly. The assumptions reviewer questions whether the work should be done at all, or at the proposed scale. External expertise answers "how should we do X?" but project principles answer "should we do X?" The latter must take priority for this reviewer.

### Why a separate reviewer, not a planning step

Assumption auditing is most valuable as an independent assessment after a plan is drafted — similar to how code review happens after implementation. Embedding it in the planning workflow risks the planner self-validating their own assumptions. An independent reviewer with a distinct prompt and doctrine provides genuine challenge.

### Why this is transferable

The six assessment areas (proportionality, assumption validity, blocking legitimacy, consumer evidence, technology commitment timing, simplification opportunities) apply to any agentic engineering practice, not just this repository. The pattern can propagate through the Practice Core.

## Consequences

### Positive

- Plans receive independent challenge on proportionality and assumptions before execution begins.
- Blocking relationships between workstreams must justify themselves with evidence.
- The inverted doctrine hierarchy creates a natural counterweight to complexity-accepting reviewers.
- The methodology is transferable to any repository carrying the agentic engineering practice.

### Trade-offs

- Adds one more reviewer to the ecosystem. Mitigated by targeted trigger conditions — this reviewer is not invoked on every change, only on plan-level events.
- The inverted doctrine hierarchy departs from ADR-129's standard hierarchy. This is documented and intentional, not a drift.
- Risk of false simplification — questioning proportionality could undermine genuinely necessary complexity. Mitigated by requiring evidence-based findings, not opinion.

## References

- `.agent/sub-agents/templates/assumptions-reviewer.md` — reviewer template
- `.agent/skills/assumptions-expert/SKILL.md` — active workflow skill
- `.agent/rules/invoke-assumptions-reviewer.md` — situational invocation rule
- `.agent/memory/executive/invoke-code-reviewers.md` — reviewer invocation guidance
- `.agent/directives/principles.md` — project principles (first question, simplicity)
