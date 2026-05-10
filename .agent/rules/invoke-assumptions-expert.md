# Invoke Assumptions Expert

Operationalises [ADR-146 (Assumptions Reviewer — Meta-Level Plan Assessment)](../../docs/architecture/architectural-decisions/146-assumptions-expert-meta-level-plan-assessment.md) and [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).

When plans, designs, or architectural proposals are being finalised, invoke the `assumptions-expert` specialist in addition to the standard `code-expert` gateway.

## Trigger Conditions

Invoke `assumptions-expert` when:

- Any plan is marked "DECISION-COMPLETE" or "READY FOR EXECUTION"
- A plan asserts blocking relationships over other workstreams
- A plan proposes 3+ new specialist agents
- A plan proposes new workspace categories or package topology changes
- A plan commits to technology choices before research phases complete
- A user or agent requests an assumption audit or proportionality check

## Non-Goals

Do not invoke `assumptions-expert` for:

- Code quality, style, or implementation correctness (use `code-expert`)
- Architectural boundary compliance in code (use the architecture reviewers)
- Documentation completeness or ADR accuracy (use `docs-adr-expert`)
- Test quality or TDD compliance (use `test-expert`)
- Domain-specific technology validation (use the relevant domain specialist)

## Overlap Boundaries

- **`code-expert`**: Always invoke as the gateway for code changes. `assumptions-expert` operates at the plan level, not the code level — they do not overlap.
- **`docs-adr-expert`**: Validates documentation accuracy. `assumptions-expert` questions whether the documented decisions are proportional — complementary, not overlapping.
- **`architecture-expert-barney`**: Simplification focus. `assumptions-expert` questions proportionality at the plan level; Barney questions simplification at the architecture level. Invoke both when a plan proposes significant architectural changes.
- **`subagent-architect`**: Reviews agent triplet quality. `assumptions-expert` questions whether the proposed agents are needed at all. Invoke `assumptions-expert` first when 3+ agents are proposed; `subagent-architect` reviews the triplets after the count is validated.

## Invocation

See `.agent/memory/executive/invoke-code-experts.md` for the full reviewer catalogue and invocation policy. The `assumptions-expert` canonical template is at `.agent/sub-agents/templates/assumptions-expert.md`.
