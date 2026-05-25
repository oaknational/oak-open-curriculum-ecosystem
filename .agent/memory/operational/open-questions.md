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
  three-failure-mode broadcast); audit trail §R4 in the archived
  `post-m1-attestation-tidy-up.plan.md` under
  `.agent/plans/agentic-engineering-enhancements/archive/completed/`
  (PR #114 merged at `77fcf746`). The R4 plan-update-decision shape is
  now stale — the decision-shape concern that motivated Q-001 remains
  open as a meta-question about plan-update authority, but the specific
  §R4 anchor refers to the archived audit trail rather than a live
  decision lane.
- Route-named (2026-05-25 Mistbound consolidation): the long-term home for the
  three named comms-substrate failure-mode cures is **PDR-078 and PDR-082
  amendments via the new plan's WS3 + WS4**, not a new dedicated plan. WS4
  covers heartbeat-content-drift (mechanical state-binding) and
  heartbeats-are-infrastructure (PDR-078 amendment, not new rule). WS3β covers
  the emission-vs-absorption gap analogue (silent-API-failure cure: heartbeat
  retention at n=2 unless explicitly owner-opted-out, OR all-channels watcher
  emits silent-detection event after N min of zero peer activity). See
  [the n=2/coordination-efficiency program plan][n2-plan].
  Q-001 remains `open` because the plan is pending owner ratification with
  execution deferred to next session; mark `answered-in-place` when WS3 + WS4
  land.

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

### Q-003: Does start-right-team need a "joined-at-closeout" reduced-bootstrap mode?

- Raised by: Stormy Surfing Dock (2a7b65) @ 2026-05-25T13:15Z
- Context: The `start-right-team` SKILL §0/§0.5/§1 protocols (all-channels
  comms watcher, liveness heartbeat cron, team-start broadcast) are stated
  as non-negotiable preconditions that EVERY participating agent runs in
  EVERY team session. The skill's worked precedents all start the team at
  the same time the agents start work — the protocols' setup cost is
  amortised over hours of coordinated work. There is no named shape for
  the case where a team forms partway through a session (e.g., the owner
  appoints a Commit Marshal late, after several agents are already in
  flight). An agent reaching that signal at closeout faces an asymmetry:
  full protocol bootstrap (persistent watcher + 4-min heartbeat cron +
  broadcast) creates infrastructure that runs for minutes before being
  torn down at compaction or session-end, while a single broadcast +
  acknowledgement could carry the same coordination signal at far lower
  cost. Worked instance this session: Stormy was solo for most of the
  audit/decomposition work, the owner appointed Fiery as marshal during
  closeout, and the minimum-coordination path (single comms broadcast
  acknowledging Fiery, no persistent watcher/heartbeat) was the
  pragmatically chosen shape; the skill body does not name this as
  legitimate.
- Why deferred: editing the start-right-team SKILL is a substrate edit;
  a single worked instance is not enough evidence to graduate a new
  protocol mode. The next instance of late-formed-team or
  closeout-only participation will be the second data point that ripens
  this for cure-shape work.
- Suggested resolution path: capture this question's existence; let a
  future curator lane (or `consolidate-docs` pass) reconcile it once a
  second instance lands. Cure candidates if it graduates: (a) named
  exemption set on §0/§0.5 for closeout-only participation; (b) a
  "team-formed-late" sub-section with a minimum-coordination contract
  (single broadcast acknowledging the marshal/coordinator, identity-row
  update on thread record, deferred handoff state surfaced in closeout
  rather than recorded via heartbeat).
- Status: open
- Linked: `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0
  (all-channels watcher), §0.5 (liveness heartbeat), §1 (register
  presence); experience file
  `.agent/experience/2026-05-25-stormy-surfing-dock-pr-0-and-sweep-incident.md`
  §"What surprised me about the team-protocol arc"; comms event posted
  2026-05-25T13:15Z titled "Stormy Surfing Dock: PR-0 landed at 78a90723;
  Fiery marshal acknowledged; standing down for compaction".
- Composes with (2026-05-25 Mistbound consolidation): PDR-082 n=2 mode and the
  new plan's WS3 SKILL amendment. Q-003 names a *timing-axis* reduced-bootstrap
  shape ("team formed late"); PDR-082 names a *size-axis* reduced-bootstrap
  shape (n=2 from session-start). Both are scale-sensitivity expressions; the
  long-term shape may be the obligation-tier taxonomy (WS3γ / WS8) where each
  obligation classifies its scale-sensitivity (size + timing + chat-visibility)
  independently. Second-instance evidence for either Q-003 OR PDR-082 informs
  both. See
  [the n=2/coordination-efficiency program plan][n2-plan].

[n2-plan]:
  ../../plans/agent-tooling/current/n2-and-coordination-efficiency-program-2026-05-25.plan.md
