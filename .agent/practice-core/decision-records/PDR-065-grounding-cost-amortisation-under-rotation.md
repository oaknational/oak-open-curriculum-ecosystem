---
pdr_kind: governance
---

# PDR-065: Grounding-Cost Amortisation Under Rotating-Cast Operation

**Status**: Proposed
**Date**: 2026-05-22
**Related**:
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing commitment — fast-bootstrap sessions still
declare a landing target);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, identity — fast-bootstrap agents identify
through the same identity tuple as fully-grounded agents);
[PDR-052](PDR-052-directive-file-context-budget.md)
(directive file context budget — the 30% processing-window
constraint this PDR's fast-bootstrap mode helps satisfy under
rotation);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(ten named cures — fast-bootstrap eligibility constraints below
preserve cure (i) out-of-band-direction discipline by keeping
coordinator-role and broad-claim agents on full grounding);
[PDR-063](PDR-063-mid-cycle-retirement-protocol.md)
(mid-cycle retirement protocol — fast-bootstrap agents pick up
handoff records as their entry point; the handoff record
substitutes for some of the durable-substrate read fast-bootstrap
skips);
[PDR-066](PDR-066-comms-events-as-failure-mode-channel.md)
(comms-events as failure-mode channel — provides the optional
`tags` array field that PDR-065's `[DOCTRINE]` tag value
`doctrine-update` extends; PDR-065 landing is structurally
downstream of PDR-066's schema-amendment commit).

## Context

The `start-right-team` SKILL mandates a substantial foundation
read before any substantive work: AGENT.md, RULES_INDEX,
principles, tdd-as-design, testing-strategy, orientation,
schema-first-execution, the touched thread's next-session
record, active claims, shared-comms-log, the relevant plan
body, the always-active rules tier on platforms that do not
auto-load it, and the live branch state. Empirically this
foundation read consumes ~30k tokens before any productive work.

This cost is correct and load-bearing for human-pace sessions
and for any session that opens broad source claims or takes the
coordinator role. It becomes a structural problem at the
rotating-cast operational target the owner has named:

- Auto-spawn cadence approaching 10 minutes.
- Per-agent context budget bounded at ~250k tokens.
- A working-day operational window (≈ 8 hours).

Under those parameters, naive full-grounding gives:

- 6 spawns/hour × 30k tokens/spawn = 180k tokens/hour spent on
  duplicate grounding.
- Over an 8-hour day, ~1.44M tokens consumed on grounding
  alone — substantially more than the productive-work output
  of any single agent.

The architectural question is not *whether* this cost matters
(it does), but *whether full grounding is the right shape for
every rotating-cast agent*, or whether a fast-bootstrap mode is
appropriate for narrowly-scoped agents that pick up a single
named cycle on a known thread.

The capture trigger for this PDR is the gate-1a delivery
addendum's §"Question 3: Grounding-cost amortisation" plus the
empirical cost observed in current team sessions.

## Decision

Adopt **two session modes** for rotating-cast operation:

### Mode A — Full grounding (current default)

The existing `start-right-team` shared foundation. Required for:

- Any agent taking the coordinator role.
- Any agent opening a source claim that spans more than one
  named cycle on a single thread.
- Any agent on a thread their session has not touched in the
  prior ~24 hours (the thread record's substance has drifted
  too far for a recent-comms-window read to recover).
- Any agent whose owner-direction or coordinator brief
  explicitly requires it.

Full-grounding agents continue to read the foundation set in
full. This mode is unchanged from the existing SKILL contract.

### Mode B — Fast-bootstrap (new, scoped)

A narrower foundation read for agents picking up a single named
cycle on a thread that has been actively touched in the prior
~24 hours. The fast-bootstrap reading order:

1. The active thread's `next-session.md` record (carries identity,
   landing target, plan pointers, lane state).
2. The active plan body referenced by the thread record, scoped
   to the cycle the agent is picking up.
3. Active claims (`active-claims.json`) plus the commit queue.
4. The most recent comms-event window — by default the last
   100 events under `.agent/state/collaboration/comms/`,
   filtered to the agent's identity (via self-exclusion). The
   window is chosen because it reliably covers the prior
   coordinator's session in active-rotation operation; finer
   tuning is deferred to first-instance observation.
5. Any handoff record at `.agent/state/collaboration/handoffs/`
   (PDR-063) pointed to by the claim the agent is picking up.
6. The git branch state (`git status --short`, `git log --oneline
   -5`).

Fast-bootstrap explicitly **skips**:

- The full directive set (AGENT.md, principles, tdd-as-design,
  testing-strategy, schema-first-execution, orientation) on
  the assumption that the coordinator already verified
  directive compliance at session open and any directive
  change is surfaced via the `[DOCTRINE]` tag below.
- The always-applied rules tier on platforms that auto-load it
  (Claude Code, Cursor) — auto-load satisfies this read.
- The full ADR index scan — fast-bootstrap agents read only
  ADRs referenced from their cycle's plan body.
- The repo-continuity scan — the thread record carries the
  scoped subset fast-bootstrap needs.

A fast-bootstrap agent's foundation read is empirically ~5–10k
tokens, depending on plan-body size. This buys back ~20k tokens
per agent for productive work.

### Eligibility constraints (forbidden cases)

Fast-bootstrap is **forbidden** in any of:

- The agent is taking the coordinator role.
- The cycle in scope touches more than one workspace OR more
  than one substrate (e.g. a cycle that edits source AND
  schema AND plan body crosses substrate boundaries
  fast-bootstrap is not sized for).
- The cycle in scope involves any of: SDK boundary, schema
  edits, ADR amendments, security boundary, auth surface,
  collaboration-state schema, reviewer-roster changes. These
  are full-grounding categories regardless of cycle size.
- The thread has not been touched in the prior ~24 hours, OR
  the prior session's closeout was non-natural (handoff record
  exists, in-flight reasoning carries open decisions).
- Owner direction explicitly requires full grounding for the
  current session.

When eligibility is ambiguous, the agent defaults to Mode A
(full grounding). The eligibility constraint is a one-way valve:
errors of caution are tolerated; errors of under-grounding are
not.

### The `[DOCTRINE]` doctrine-update tag

To keep Mode B safe, doctrine changes (new always-applied rule,
graduated PDR / pattern, schema migration, SKILL amendment) are
surfaced as comms-events with a `[DOCTRINE]` tag on the first
body line. The tag composes with PDR-066's failure-mode tag-set;
both use the optional `tags` array field PDR-066 introduces.

Fast-bootstrap agents read all `[DOCTRINE]` events in the
recent-comms-window unconditionally; they may skip routine
`[BROADCAST]` / `[GROUP]` / `[DIRECTED]` events outside their
cycle's scope but never doctrine-updates. The doctrine-update
producer (typically the coordinator landing a new rule or
graduating a PDR) is responsible for posting the `[DOCTRINE]`
event at the same time as the doctrine surface lands.

The `[DOCTRINE]` tag value is `doctrine-update` in the comms-
event `tags` array per PDR-066's tag-namespace convention.

#### Migration sequence

PDR-065 landing is downstream of PDR-066's schema landing. The
deployment order is: (a) PDR-066 owner-approves, its
schema-amendment commit (introducing the optional `tags` array
property on the three event kinds) lands, the CLI watcher
rendering update lands; (b) the `[DOCTRINE]` tag value
`doctrine-update` is added to PDR-066's tag namespace; (c)
fast-bootstrap mode is safely enabled, because the
`[DOCTRINE]` events fast-bootstrap agents rely on for
doctrine-update sweeps can now be produced and consumed under
the new schema. Adopting Mode B before the schema lands risks
fast-bootstrap agents missing a doctrine-update event that the
producer could not yet tag.

### Verification at session open

A fast-bootstrap agent's team-start broadcast must explicitly
declare the mode:

> *"Foundation: complete via fast-bootstrap per PDR-065 — thread
> \<name\>, cycle \<id\>, handoff record \<path or null\>,
> doctrine-update sweep clean."*

The declaration makes the choice team-visible. Any peer or
coordinator may challenge the choice if they believe the cycle
exceeds fast-bootstrap eligibility; the challenged agent then
upgrades to Mode A before opening any claim.

## Rationale

**Why two modes, not three.** The fast/full boundary is a
substance judgement: does this work need the full directive
substrate to be done correctly, or does the cycle's plan body
plus the recent operational window carry enough? Three modes
would force a more granular judgement that the empirical
evidence does not yet support. Two modes is the minimum that
captures the substantive distinction.

**Why narrow fast-bootstrap eligibility.** Errors of
under-grounding cost real correctness (an agent that skips
schema-first-execution writes manual types at an SDK boundary;
an agent that skips testing-strategy writes audit-shaped tests).
The eligibility constraints are deliberately conservative: any
ambiguity routes to Mode A. The cost of Mode A is paid in
tokens; the cost of skipped grounding is paid in defects.

**Why `[DOCTRINE]` events instead of "fast-bootstrap reads
distilled.md".** Distilled.md is a consolidation surface, not a
change-feed. A fast-bootstrap agent reading distilled.md sees
the cumulative state but not the recent deltas; the deltas are
what matter for "what changed since my last grounding". A
real-time doctrine-update event stream catches deltas at the
moment they land, which is exactly what fast-bootstrap needs.

**Why the team-start declaration.** Without it, peers cannot tell
which mode an agent is operating in, which makes coordinator
escalation (challenge → upgrade) impossible. The declaration
is small ceremony for substantial transparency.

**Why fast-bootstrap is not the default.** The default must
preserve correctness; fast-bootstrap is an optimisation enabled
by specific conditions (thread freshness, cycle narrowness,
absence of architectural-class scope). Making fast-bootstrap
default would put the burden of proof in the wrong place.

**Trigger to graduate from Proposed to Accepted.** Owner-direction
graduation, OR first rotating-cast launch where fast-bootstrap is
observed empirically against productive cycle work. The launch
substantiates whether the ~5–10k vs ~30k empirical estimate
holds in practice and whether the eligibility constraints catch
the right cases.

## Consequences

### Required

- The `start-right-team` SKILL adds a §"Session modes" subsection
  naming Mode A (full grounding) as the default and Mode B
  (fast-bootstrap) as the conditional opt-in. The mode-choice
  decision tree (the eligibility constraints above) lives in
  that subsection.
- The team-start broadcast format adds an optional mode
  declaration line that fast-bootstrap agents must include.
- The `[DOCTRINE]` tag is added to PDR-066's tag namespace as
  `doctrine-update`. Coordinator-role agents landing a
  doctrine change post the corresponding doctrine-update event
  in the same coordination window as the doctrine surface
  lands.
- The watch CLI rendering convention extends from PDR-066:
  doctrine-update events render with a `[DOCTRINE]` prefix on
  the first body line.
- The thread `next-session.md` record format adds a
  `fast_bootstrap_eligible: true | false` field, which the
  outgoing session sets based on its own assessment of the
  thread state. The field is advisory (the incoming agent
  re-evaluates against current state) but it is the prior
  agent's honest read. (Note: this is a SEPARATE schema
  operation on a different substrate — the thread-record
  frontmatter under `.agent/memory/operational/threads/<slug>.next-session.md`
  — not the comms-event schema. The two schema changes land on
  independent commits with no ordering dependency between them.)

### Forbidden

- Coordinator-role agents using Mode B. Coordinator authority
  requires full grounding regardless of cycle scope.
- Fast-bootstrap agents opening cross-workspace or cross-
  substrate claims. The eligibility constraint is a hard rule;
  an agent that discovers their cycle has cross-cutting scope
  mid-work must upgrade to Mode A before continuing.
- Silent Mode B (no team-start declaration). The declaration
  is mandatory; absence means Mode A by audit-default.
- Skipping doctrine-update events in the fast-bootstrap recent-
  comms-window read. Even if the agent skips other event
  classes outside their cycle scope, doctrine-update events
  are unconditional reads.

### Accepted Cost

- A new substance-judgement at session open: *"is this cycle
  fast-bootstrap-eligible?"*. The judgement is bounded by the
  eligibility constraints; the cost is small (~30 seconds of
  reasoning at session start in exchange for ~20k tokens of
  productive-work headroom).
- The `[DOCTRINE]` event channel adds posting cost on every
  doctrine landing. The cost is small (one short event per
  doctrine change) and amortised by the fast-bootstrap mode
  it enables.
- A possible class of defect where a fast-bootstrap agent
  misses a doctrine update because the producer forgot to
  post the `[DOCTRINE]` event. The cure is producer-side
  discipline; the cost is structurally similar to existing
  doctrine-drift risks but with a sharper feedback loop
  (the next fast-bootstrap agent's defects surface the missed
  event).

## Open questions deferred to first-instance observation

1. **Recent-comms-window size.** The decision specifies "last
   100 events" as the fast-bootstrap window. Empirical
   evidence may push this up (rotation cadence wider than
   expected) or down (rotation cadence tighter); first-launch
   observation will inform.
2. **Plan-body scoping under fast-bootstrap.** The decision
   says "plan body scoped to the cycle the agent is picking
   up". What is the operational definition of "scoped" — the
   plan's todo with the matching id and depends_on chain? Or
   the full plan body with the agent reading selectively?
   First-launch agents observe what they actually read.
3. **Cross-mode coordination.** If a Mode B agent and a Mode A
   agent are both in the same team session, do their team-
   start broadcasts compose cleanly? (Hypothesis: yes; the
   Mode B agent's declaration is additional substance, not
   contradictory.)
4. **Mode B for non-cycle work.** Is there a legitimate Mode B
   for non-cycle work (e.g. a consolidation pass that touches
   memory but not source)? This PDR is silent because the
   first-launch use case is cycle work; consolidation passes
   are typically owner-direct sessions that already cost full
   grounding.
5. **`[DOCTRINE]` event TTL.** Should doctrine-update events
   have a different retention shape than routine comms-events
   (e.g. surfaced in distilled.md as part of the
   consolidation cadence rather than fitness-pressured out of
   the live stream)? Likely yes, but the substance is a
   consolidation-discipline question, not a fast-bootstrap one.
