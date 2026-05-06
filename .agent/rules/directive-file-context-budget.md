# Directive-File Work Requires <30% Context Budget

Editing any file under `.agent/directives/` requires the agent's
session context-usage to be below 30%. If context is at or above
30%, finish current-step work, write a session-handoff opener, and
queue the directive work for a fresh session.

## The Rule

Files under `.agent/directives/` (`AGENT.md`, `principles.md`,
`tdd-as-design.md`, `testing-strategy.md`,
`schema-first-execution.md`, `orientation.md`,
`agent-collaboration.md`, `user-collaboration.md`,
`continuity-practice.md`, `operationalisation-contract.md`) are:

- Deep, dense, and structurally load-bearing.
- Read by every agent at every session open.
- The surface where mistakes compound across the entire Practice.

The error rate of editing operations rises sharply under context
pressure. The disposition that produces *"I'll just be careful"*
under context pressure is exactly the rounding-off failure mode the
[`eager-rounding-off-on-partial-structures`][rounding] pattern
names — partial structures get filled by inference rather than by
reading, and the resulting damage is invisible until the next
session reads the affected directive.

The cure is structural, not behavioural: directive-file edits are
sequenced as the **final step** of any consolidation pass, with the
30% context-budget check at the boundary before directive work.

## Sequencing Within a Consolidation Pass

A consolidation pass runs through capture surfaces in order:

1. `napkin.md` (capture)
2. Other capture surfaces (`.remember/`, comms events, plan bodies)
3. `distilled.md` (refinement)
4. `pending-graduations.md` (queue)
5. **directives** (permanent doctrine) — gated on the 30% check

Directive-file work is the final step. Earlier-stage work happens
first; if the agent reaches the directive boundary at or above 30%
context, finish the in-flight step, write a handoff, and queue
the directive edits for a fresh session.

## The 30% Threshold Is Load-Bearing

30% is not a tidy number; it is the headroom required for:

- Full-depth reading of the directive file end-to-end.
- Comprehension of the existing structure and cross-references.
- Editing without crowding-out (every Edit/Write call consumes
  context for the diff and the surrounding excerpt).

Below 30%, all three are achievable. At or above 30%, one or more
gets compressed, and rounding-off begins.

## Owner Direction Beats Plan, Not Standing Rules

If owner direction asks for directive-file edits in a session that
is over 30%, surface the conflict explicitly:

- Name the rule and the current context-usage estimate.
- Offer to do all non-directive graduation work in this session
  and queue the directive edits for a fresh session.
- Proceed with directive edits only if the owner expressly
  authorises overriding this rule for the current session.

This is the standard surface-the-conflict discipline from
`principles.md` §Owner Direction Beats Plan applied to a standing
rule.

## Doctrinal Anchors

- per-user feedback memory: `feedback_30_percent_context_for_directives`
- principles.md §Owner Direction Beats Plan (conflict surfacing)
- pattern: [`eager-rounding-off-on-partial-structures`][rounding]
- Owner-stated standing authority: *"this is always true"* (2026-05-05)

[rounding]: ../memory/active/patterns/eager-rounding-off-on-partial-structures.md
