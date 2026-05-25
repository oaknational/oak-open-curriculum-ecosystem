---
fitness_line_target: 180
fitness_line_limit: 240
fitness_char_limit: 14000
fitness_line_length: 100
split_strategy: >-
  Surface owner-decision items during consolidate-docs; move answered or
  withdrawn entries to an archive when the register needs rotation.
merge_class: mostly-append-register
---

# Open Questions — Substrate

**Purpose**: Persistent log of questions surfaced during work that cannot be
answered within current context or a reasonable amount of time/effort. Each
question is processed at document consolidation time through the long-term
architectural-excellence lens; questions that do not resolve at consolidation
are surfaced to the owner.

**Owner**: shared — any agent appends; the consolidator drains.

## Protocol

### When to add an entry

A question goes in this file when:

- It surfaces during work and cannot be answered cheaply in the current context.
- It is not a "should I do this next step?" question — those go to the owner via
  chat or to a peer via directed comms, depending on urgency.
- It is a longer-term planning, design, or process question whose answer shapes
  future work but does not block the current cycle.

A question does NOT go here when:

- It can be answered by reading a file or running a command.
- It is owner-direction needed RIGHT NOW.
- It is already captured in an open plan body, ADR, or PDR.

### Entry shape

Each entry follows the shape below. Bodies that need length go to a linked plan
or ADR draft; this file stays scannable.

```text
### Q-<NNN>: <one-line question>
- Raised by: <agent_name> (<session_id_prefix>) @ <UTC timestamp>
- Context: <one-paragraph framing — what work surfaced this question>
- Why deferred: <time / effort / context bound that prevented in-place resolution>
- Suggested resolution path: <plan / ADR / PDR / consolidation pass / owner direction>
- Status: open | answered-in-place (with pointer) | surfaced-to-owner | withdrawn
- Linked: <plan / ADR / thread / comms-event references, if any>
```

### Lifecycle

1. **Open** at append time.
2. **Mid-life** updates allowed: any agent who acquires context for an answer
   drops a comment-shaped append under the entry, naming themselves and
   time-stamping. The original question stays untouched.
3. **Consolidation pass** (per the consolidate-docs skill): walk all open
   entries; apply the long-term architectural-excellence lens; for each entry
   decide one of:
   - **Resolve-in-place**: a clear answer has emerged from the comments; mark
     `answered-in-place` and point at the resolution artefact.
   - **Surface-to-owner**: the question is decision-class for the owner; mark
     `surfaced-to-owner` and include in the consolidation-pass owner-facing
     report.
   - **Withdraw**: the question has been overtaken by events or no longer
     applies; mark `withdrawn` with a one-line reason.
4. **Backpressure**: if open entries accumulate beyond ~10, the accumulation
   itself is a substrate signal that consolidation cadence has slipped;
   surface to owner as a cadence concern.

### Relationship to pending-graduations

Sibling buffers with different release valves:

- **pending-graduations**: candidate patterns waiting for substance,
  trigger-gated for graduation to permanent doctrine (rules / skills / ADRs).
- **open-questions** (this file): unresolved decision-shapes waiting for context
  or owner direction; release valve is resolution or owner-surface.

A pending-graduation that is blocked on a decision is naturally also an open
question; cross-link rather than duplicate.

## Open

### Q-001: What is the long-term home for comms-substrate failure-mode cures?

- Raised by: Wooded Flowering Leaf (f03dbd) @ 2026-05-25T06:18Z
- Context: Misty (Director) named three distinct comms-substrate failure-modes
  during the 06:13–06:18Z window — heartbeat-content-drift, heartbeat-tag-
  overloading (substantive-broadcast-as-heartbeat), and emission-vs-absorption
  gap (events posted to canonical comms not reaching receiving agents) — and
  stated "Owning these for the R4 plan-update" inside
  `post-m1-attestation-tidy-up.plan.md`. The concrete decision is whether
  those cures belong in the existing tidy-plan R4 task or in a new dedicated
  plan. Three failure-modes with disjoint cure shapes is a lot of weight for
  one R4 plan-update item; a dedicated plan may serve long-term architectural
  excellence better than an R4 graft.
- Why deferred: the substrate-care decision is Misty's call from the Director
  seat; not for the ONBOARDING.md lane to pre-empt. Misty is actively
  coordinating other live threads (Eclipsed absorption-gap escalation).
- Suggested resolution path: let R4 evolve; if R4 accumulates beyond healthy
  scope or surfaces lock-in across cycles, escalate at next consolidation pass.
- Status: open
- Linked: comms-events `c4f50491` (Cycle 9 routing), `[06:13:41Z]` (fold-check
  verdict), `[06:17:21Z]` (Hushed reconciliation), `[06:18:14Z]` (Misty
  three-failure-mode broadcast); plan
  `.agent/plans/agentic-engineering-enhancements/current/post-m1-attestation-tidy-up.plan.md`
  §R4.

### Q-002: Should consolidate-docs explicitly reference this file?

- Raised by: Wooded Flowering Leaf (f03dbd) @ 2026-05-25T06:25Z
- Context: This file's lifecycle names a consolidation pass that walks all
  open entries through the long-term architectural-excellence lens. The
  reference was one-way (this file pointed at the skill); the skill body did
  not yet point back. Architectural excellence says explicit two-way reference
  prevents drift; convention-only invites the skill drifting away from the
  substrate it is supposed to drain.
- Why deferred: editing a SKILL is a deliberate substrate edit that should be
  scoped, paired with tests where applicable, and not folded into the open-
  questions seeding lane.
- Suggested resolution path: skill-edit cycle on a future curator lane; pair
  with a substrate-care reviewer pass.
- Status: answered-in-place
- Linked: `.agent/skills/consolidate-docs/` (canonical),
  `.agent/skills/session-handoff/` (canonical),
  `.agent/plans/agentic-engineering-enhancements/current/open-questions-memory-system.plan.md`.
