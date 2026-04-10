# Invoke Assumptions Reviewer

When plans, designs, or architectural proposals are being finalised, invoke the `assumptions-reviewer` specialist in addition to the standard `code-reviewer` gateway.

## Trigger Conditions

Invoke `assumptions-reviewer` when:

- Any plan is marked "DECISION-COMPLETE" or "READY FOR EXECUTION"
- A plan asserts blocking relationships over other workstreams
- A plan proposes 3+ new specialist agents
- A plan proposes new workspace categories or package topology changes
- A plan commits to technology choices before research phases complete
- A user or agent requests an assumption audit or proportionality check

## Non-Goals

Do not invoke `assumptions-reviewer` for:

- Code quality, style, or implementation correctness (use `code-reviewer`)
- Architectural boundary compliance in code (use the architecture reviewers)
- Documentation completeness or ADR accuracy (use `docs-adr-reviewer`)
- Test quality or TDD compliance (use `test-reviewer`)
- Domain-specific technology validation (use the relevant domain specialist)

## Overlap Boundaries

- **`code-reviewer`**: Always invoke as the gateway for code changes. `assumptions-reviewer` operates at the plan level, not the code level — they do not overlap.
- **`docs-adr-reviewer`**: Validates documentation accuracy. `assumptions-reviewer` questions whether the documented decisions are proportional — complementary, not overlapping.
- **`architecture-reviewer-barney`**: Simplification focus. `assumptions-reviewer` questions proportionality at the plan level; Barney questions simplification at the architecture level. Invoke both when a plan proposes significant architectural changes.
- **`subagent-architect`**: Reviews agent triplet quality. `assumptions-reviewer` questions whether the proposed agents are needed at all. Invoke `assumptions-reviewer` first when 3+ agents are proposed; `subagent-architect` reviews the triplets after the count is validated.

## Invocation

See `.agent/directives/invoke-code-reviewers.md` for the full reviewer catalogue and invocation policy. The `assumptions-reviewer` canonical template is at `.agent/sub-agents/templates/assumptions-reviewer.md`.
