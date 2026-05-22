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
(directive file context budget — the 30 % processing-window
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
(comms-events as failure-mode channel — provides the substrate
on which any doctrine-change surfacing mechanism for Mode B
would mount; the specific mechanism is currently deferred — see
§"Doctrine-change visibility under Mode B" below);
[`practice-index.md`](../practice-index.md) (substrate-
implementation ADR(s) carrying the repo-specific phenotype of
this PDR when the deferred mechanisms graduate).

## Context

The shared start-right foundation read mandated by the team-
coordination SKILL is substantial: identity preflight, the
canonical directives, the rules tier (on platforms that do not
auto-load it), the touched thread's continuity record, the live
operational state surface, the relevant plan body, and the live
branch state. Empirically this foundation read consumes a
substantial fraction of an agent's context budget (~30 k tokens
in the current substrate) before any productive work.

This cost is correct and load-bearing for human-pace sessions and
for any session that opens broad source claims or takes the
coordinator role. It becomes a structural problem at the
rotating-cast operational target the owner has named:

- Auto-spawn cadence approaching the minute-scale.
- Per-agent context budget bounded.
- A working-day operational window.

Under those parameters, naive full-grounding consumes a duplicate-
grounding tax substantially larger than any single agent's
productive output.

The architectural question is not *whether* this cost matters
(it does), but *whether full grounding is the right shape for
every rotating-cast agent*, or whether a fast-bootstrap mode is
appropriate for narrowly-scoped agents that pick up a single
named cycle on a known thread.

## Decision

Adopt **two session modes** for rotating-cast operation.

### Mode A — Full grounding (current default)

The existing shared foundation read. Required for:

- Any agent taking the coordinator role.
- Any agent opening a source claim that spans more than one
  named cycle on a single thread.
- Any agent on a thread their session has not touched in the
  prior ~24 hours (the thread record's substance has drifted
  too far for a recent-event-window read to recover).
- Any agent whose owner-direction or coordinator brief explicitly
  requires it.

Full-grounding agents continue to read the foundation set in full.
This mode is unchanged from the existing SKILL contract.

### Mode B — Fast-bootstrap (new, scoped)

A narrower foundation read for agents picking up a single named
cycle on a thread that has been actively touched in the prior
~24 hours. The fast-bootstrap read covers, abstractly:

1. The active thread's continuity record (carrying identity,
   landing target, plan pointers, lane state).
2. The active plan body referenced by the thread record, scoped
   to the cycle the agent is picking up.
3. The live operational state surface (active claims + commit
   queue equivalent).
4. The most recent event-stream window — sized to reliably cover
   the prior coordinator's session in active-rotation operation;
   the precise window size is deferred to first-instance
   observation.
5. Any structured handoff record (per PDR-063) pointed to by the
   claim the agent is picking up.
6. The live branch state.

Fast-bootstrap explicitly **skips**:

- The full directive substrate on the assumption that the
  coordinator has verified directive compliance at session open
  AND any directive change is surfaced via a doctrine-change
  surfacing mechanism on the team's real-time event stream (see
  §"Doctrine-change visibility under Mode B" below — currently
  deferred).
- The always-applied rules tier on platforms that auto-load it
  (auto-load satisfies this read).
- The full architectural-decision index scan — fast-bootstrap
  agents read only decisions referenced from their cycle's plan
  body.
- The repo-continuity-wide scan — the thread record carries the
  scoped subset fast-bootstrap needs.

A fast-bootstrap agent's foundation read is empirically a small
fraction of the full grounding cost; the precise figure depends
on plan-body size and the chosen event-window size.

### Eligibility constraints (forbidden cases)

Fast-bootstrap is **forbidden** in any of:

- The agent is taking the coordinator role.
- The cycle in scope touches more than one workspace OR more
  than one substrate (a cycle that edits source AND schema AND
  plan body crosses substrate boundaries fast-bootstrap is not
  sized for).
- The cycle in scope involves any of: SDK boundary, schema
  edits, architectural-decision amendments, security boundary,
  auth surface, collaboration-state schema, reviewer-roster
  changes. These are full-grounding categories regardless of
  cycle size.
- The thread has not been touched in the prior ~24 hours, OR
  the prior session's closeout was non-natural (handoff record
  exists, in-flight reasoning carries open decisions).
- Owner direction explicitly requires full grounding for the
  current session.

When eligibility is ambiguous, the agent defaults to Mode A
(full grounding). The eligibility constraint is a one-way valve:
errors of caution are tolerated; errors of under-grounding are
not.

### Doctrine-change visibility under Mode B (deferred mechanism)

For Mode B to be safe, an incoming agent must observe any
doctrine change (new always-applied rule, graduated decision
record, schema migration, SKILL amendment) that landed since
their previous grounding. The team's real-time event stream
(PDR-066) is the natural substrate on which such a surfacing
mechanism would mount.

**The specific mechanism is currently deferred** under the
long-term-architectural-excellence invariant: a cross-substrate
mechanism added without empirical second-instance evidence of
need is over-shape. Rotating-cast Round 1 is the controlled
stress test that will surface what shape (and substrate
amendment, if any) the doctrine-change visibility mechanism
should take. Until then:

- Mode B remains gated behind owner-direction approval per the
  eligibility constraint above. The default remains Mode A.
- If Mode B is exercised before the mechanism lands, the
  exercising agent compensates by including the
  prior-coordinator's session's full event stream in their
  recent-event-window read — a wider read than Mode B's target
  but cheaper than full directive substrate.

The substrate-implementation ADR for any mechanism that
graduates from this deferral will live at an ADR cross-
referenced from
[`practice-index.md`](../practice-index.md).

### Eligibility-signal carriage (deferred)

A natural extension is for the outgoing session to mark its
thread continuity record with an eligibility signal that the
incoming session reads. The architectural-excellence reading
defers this: the incoming agent can (and must) re-evaluate
eligibility from the current state of the thread, the live
operational state, and the recent event window. An inherited
eligibility signal creates session-to-session coupling and a
stale-decision risk; re-derivation by the incoming agent is the
sound shape. If empirical evidence shows the re-derivation cost
is systematically high enough to merit a static signal, the
signal mechanism can graduate via the substrate-implementation
ADR pattern.

### Verification at session open

A fast-bootstrap agent's team-start broadcast must explicitly
declare the mode:

> *"Foundation: complete via fast-bootstrap per PDR-065 — thread
> \<name\>, cycle \<id\>, handoff record \<pointer or null\>,
> doctrine-change sweep \<clean / pending\>."*

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

**Why the doctrine-change surfacing mechanism is deferred.**
Cross-substrate mechanism addition without second-instance
evidence is over-shape. The PDR-066 substrate is already being
proposed; mounting another consumer on it before either lands
forecloses substrate-level design space that should remain open.
Rotating-cast Round 1 is the controlled stress test; the
mechanism graduates after empirical evidence.

**Why the eligibility-signal field is deferred.** Eligibility is
a property of *current* state, not inherited state. An incoming
agent reading the thread record will read everything the static
signal would have summarised. A static signal creates stale-
decision risk and inter-session coupling that the re-derivation
shape avoids.

**Why the team-start declaration.** Without it, peers cannot tell
which mode an agent is operating in, which makes coordinator
escalation (challenge → upgrade) impossible. The declaration is
small ceremony for substantial transparency.

**Why fast-bootstrap is not the default.** The default must
preserve correctness; fast-bootstrap is an optimisation enabled
by specific conditions (thread freshness, cycle narrowness,
absence of architectural-class scope). Making fast-bootstrap
default would put the burden of proof in the wrong place.

**Trigger to graduate from Proposed to Accepted.** Owner-direction
graduation, OR first rotating-cast launch where fast-bootstrap is
observed empirically against productive cycle work. The launch
substantiates whether the empirical cost estimate holds and
whether the eligibility constraints catch the right cases. The
deferred mechanisms (doctrine-change surfacing, eligibility
signal) graduate via separate substrate-implementation ADRs when
their second-instance evidence accumulates.

## Consequences

### Required

- The team-coordination SKILL adds a §"Session modes" subsection
  naming Mode A (full grounding) as the default and Mode B
  (fast-bootstrap) as the conditional opt-in. The mode-choice
  decision tree (the eligibility constraints above) lives in
  that subsection.
- The team-start broadcast format adds an optional mode
  declaration line that fast-bootstrap agents must include.
- Mode B's doctrine-change visibility relies on a mechanism that
  is currently deferred (see §"Doctrine-change visibility under
  Mode B"). Until the mechanism graduates, Mode B is exercised
  only with owner-direction approval and with the compensating
  wider event-stream read described above.

### Forbidden

- Coordinator-role agents using Mode B. Coordinator authority
  requires full grounding regardless of cycle scope.
- Fast-bootstrap agents opening cross-workspace or cross-
  substrate claims. The eligibility constraint is a hard rule;
  an agent that discovers their cycle has cross-cutting scope
  mid-work must upgrade to Mode A before continuing.
- Silent Mode B (no team-start declaration). The declaration is
  mandatory; absence means Mode A by audit-default.
- Mounting a cross-substrate doctrine-change surfacing mechanism
  on the comms-event substrate without explicit substrate-
  implementation ADR approval. The deferral above is the rule;
  premature implementation is over-shape.

### Accepted Cost

- A new substance-judgement at session open: *"is this cycle
  fast-bootstrap-eligible?"*. The judgement is bounded by the
  eligibility constraints; the cost is small.
- A possible class of defect where a fast-bootstrap agent
  misses a recent doctrine change because the deferred
  surfacing mechanism has not yet landed. The cure during the
  deferral period is the wider event-stream read described
  above; the longer-term cure is the substrate-implementation
  ADR that graduates the mechanism.

## Open questions deferred to first-instance observation

1. **Recent-event-window size.** Empirical evidence sets the
   floor (rotation cadence wider than expected pushes up;
   tighter pushes down).
2. **Plan-body scoping under fast-bootstrap.** What is the
   operational definition of "scoped" — the plan's todo with the
   matching id and depends_on chain? Or the full plan body with
   the agent reading selectively? First-launch agents observe
   what they actually read.
3. **Cross-mode coordination.** If a Mode B agent and a Mode A
   agent are both in the same team session, do their team-start
   broadcasts compose cleanly? (Hypothesis: yes; the Mode B
   agent's declaration is additional substance, not
   contradictory.)
4. **Mode B for non-cycle work.** Is there a legitimate Mode B
   for non-cycle work (e.g. a consolidation pass that touches
   memory but not source)? This PDR is silent because the
   first-launch use case is cycle work; consolidation passes
   are typically owner-direct sessions that already cost full
   grounding.
5. **Doctrine-change surfacing mechanism shape.** The deferred
   mechanism (see §"Doctrine-change visibility under Mode B")
   graduates via a substrate-implementation ADR when second-
   instance evidence accumulates.
6. **Eligibility-signal mechanism shape.** Similarly deferred
   pending evidence that the re-derivation cost is systematically
   high enough to merit a static signal.

## Substrate implementation

The repository-specific implementation of this PDR — the precise
foundation-set file paths for Mode A and Mode B, the event-
window size, the team-start broadcast format extension, and any
mechanism that graduates from the deferred sections above — lives
in substrate-implementation ADR(s) cross-referenced from
[`practice-index.md`](../practice-index.md). The PDR captures the
principle (this document); the ADR(s) capture the repository's
concrete realisation of it.
