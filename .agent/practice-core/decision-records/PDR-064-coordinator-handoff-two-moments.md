---
pdr_kind: governance
---

# PDR-064: Coordinator Handoff — Pre-Positioning vs Active-Acknowledgement

**Status**: Proposed
**Date**: 2026-05-22
**Related**:
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, identity — coordinator identity travels
through the same identity tuple as any other agent);
[PDR-049](PDR-049-memory-and-state-file-merge-semantics.md)
(memory and state file merge semantics — peer-collaboration
governance into which the coordinator role is structurally
embedded);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(ten named cures — cure (i) out-of-band-direction reading drift is
the failure surface this PDR's pattern addresses for role
transitions);
[PDR-063](PDR-063-mid-cycle-retirement-protocol.md)
(mid-cycle retirement protocol — coordinator retirement under
token pressure exercises both this PDR's two-moments boundary
and PDR-063's mid-cycle handoff; the join-point is named below).

## Context

Coordinator role transitions in multi-agent sessions surfaced a
recurring conflation: **a coordinator handoff has two distinct
moments that are commonly treated as one.** The first observed
instance is recorded in pending-graduations as
*"2026-05-21 — Coordinator-handoff: pre-positioning vs active-
acknowledgement"* (the entry carries the specific session
references that are unsuitable for permanent doctrine surfaces).

The observed shape:

- The outgoing coordinator broadcasts a pre-positioning event
  carrying the team roster, slice state, outstanding work, and
  standing notes — the foundation read for the incoming
  coordinator on arrival.
- The outgoing coordinator then cancels their coordinator-cadence
  cron and acts as if the handoff is complete.
- Owner correction: *"you are coordinator until \<incoming\>
  actively acknowledges taking over the role."*
- The outgoing coordinator re-arms cadence and re-asserts
  authority via a correction broadcast.
- The incoming coordinator's active-acknowledgement broadcast
  some time later is the actual moment of authority transfer.

The conflation matters because between the pre-positioning
broadcast and the active-acknowledgement, three concrete
coordinator responsibilities are at risk:

1. **Routing**: incoming directed events from peers expecting
   coordinator routing have no addressee with authority to act.
2. **Cron cadence**: any scheduled coordinator-loop tick that
   was running becomes silent, depriving peers of expected
   progress signals.
3. **Reviewer dispatch / commit-window coordination**: peers who
   surface decision-points get no answer; commit windows that
   need coordinator-mediated ordering have no mediator.

If the incoming coordinator's session is delayed (auto-spawn
queue, environment bootstrap, owner direction interleaving), the
gap between pre-positioning and active-acknowledgement can be
minutes to hours. Treating pre-positioning as transfer creates a
coordinator-less window the team cannot detect from comms alone.

## Decision

Recognise two distinct moments in any coordinator handoff and
codify their semantics:

### Moment 1 — Pre-positioning

The outgoing coordinator broadcasts a **pre-positioning event**
carrying:

- the current team roster (identity tuples per PDR-027);
- the slice state (which agents are on which boundaries, what
  cycle each is in, what is staged versus committed versus
  open);
- outstanding work (the open routing surface, the queued
  decision-points, the open commit windows);
- standing notes (any operational direction the outgoing
  coordinator has been carrying that the incoming coordinator
  must inherit);
- the proposed incoming coordinator's identity (if known), or
  the criteria for self-selection (if not).

Pre-positioning is **information transfer**, not **authority
transfer**. The outgoing coordinator retains:

- all routing authority;
- all scheduled coordinator-loop ticks (cron / wakeup / monitor);
- all reviewer-dispatch authority;
- all commit-window mediation authority.

The pre-positioning event uses the existing `narrative` comms-event
kind with a clear title (e.g. *"Coordinator pre-positioning:
\<outgoing\> → \<incoming\>"*). No schema change is required.

### Moment 2 — Active-acknowledgement

Authority transfer occurs only when the incoming coordinator
broadcasts an **active-acknowledgement event** declaring
intent-to-coordinate. The active-acknowledgement event:

- names the incoming coordinator's identity tuple;
- names the prior coordinator (the agent transferring out);
- references the pre-positioning event's identifier
  (via `in_response_to` on the narrative event kind);
- explicitly states *"I am taking the [slice] coordinator role
  from \<prior\>"* in the title or first line of the body (the
  square-bracketed `[slice]` is an optional scope qualifier that
  absorbs both full-handoff and slice-handoff cases — see the
  pending follow-on amendment §"Partial / Slice-Scoped Coordinator
  Transfer" captured for post-Round-1 absorption);
- declares the cadence the incoming coordinator will adopt (which
  may differ from the outgoing coordinator's cadence).

The outgoing coordinator continues to hold authority **until the
active-acknowledgement broadcast lands** in the comms stream.

If the active-acknowledgement never arrives:

- the outgoing coordinator remains coordinator;
- the team continues to route through the outgoing coordinator;
- a re-broadcast of pre-positioning may occur if the team needs
  to surface a fresh candidate;
- the outgoing coordinator may not retire until either active-
  acknowledgement lands or the team explicitly designates a
  different coordinator.

### Cron / cadence boundary

Any coordinator-cadence cron, scheduled wakeup, or persistent
monitor owned by the outgoing coordinator:

- **continues to run** through Moment 1 (pre-positioning is
  information, not transfer);
- **ends** at Moment 2, after the incoming coordinator's
  active-acknowledgement broadcast lands;
- **never goes dark** between Moments 1 and 2 within the same
  coordinator-role authority window. Falsifiability anchor: a
  comms-event chain showing coordinator-cadence cron silence
  after a Moment 1 broadcast but before the corresponding
  Moment 2 active-acknowledgement falsifies this rule.
  Slice-coordinator cron cases are out of scope for this PDR
  and are captured for a follow-on amendment. If the outgoing
  coordinator must end their session before active-
  acknowledgement, the cron / wakeup / monitor stays armed and
  the outgoing coordinator declares the gap explicitly in the
  pre-positioning event (*"if Moment 2 has not landed by
  \<deadline\>, the cron continues firing into an empty
  coordinator slot — this is the structural defect; the team
  must surface a new candidate"*).

### Intersection with PDR-063 (mid-cycle retirement)

If the outgoing coordinator is retiring mid-cycle under token
pressure (PDR-063 trigger), both protocols fire:

1. PDR-063 Step 1 — sense the budget threshold.
2. PDR-063 Step 2 — write the structured handoff record for any
   open cycle claim the coordinator was running.
3. This PDR's Moment 1 — broadcast the pre-positioning event
   covering coordinator responsibilities (which is broader than
   any single cycle claim).
4. PDR-063 Step 4 — directed `mid-cycle-handoff` event to a named
   receiver for the cycle claim.
5. PDR-063 Step 5 — retirement broadcast.
6. The receiving agent for the coordinator role then provides
   this PDR's Moment 2 (active-acknowledgement) when they pick
   up the role.

The coordinator role itself is not embedded in the handoff record
(handoff records are per-claim content; the coordinator role is
team-state). The pre-positioning event carries the coordinator-
role context; the handoff record carries any cycle-claim context
the coordinator was also running.

## Rationale

**Why two distinct moments, not one ceremonial handoff event.** The
empirical instance demonstrates that conflating them creates a
coordinator-less window the team cannot detect. Two moments map
to two distinct operational states (transfer-pending vs transfer-
complete), and only the second one carries the authority
transition. The owner-correction at the first instance was
precisely this distinction: *"you are coordinator until \<other\>
actively acknowledges."*

**Why active-acknowledgement, not silent absorption.** Silent
absorption (the incoming coordinator quietly starts routing without
broadcasting) is indistinguishable from "no one is coordinating"
from the peers' perspective. The active-acknowledgement is the
team-visible signal that authority has moved. It is not ceremony;
it is a load-bearing audit event.

**Why narrative kind, not a new event kind.** A new event kind
would require schema amendment plus parser and renderer support
plus reader compatibility. The narrative kind already carries
title + body + audience and supports `in_response_to` for
threading. The first observed instance used narrative shape
successfully; adding a structural kind would be premature
optimisation.

**Why cron / cadence continues through Moment 1.** The cron
cancellation at Moment 1 in the first observed instance was the
proximate cause of the coordinator-less window: the cron was
treated as a coordinator-personal artefact rather than a
coordinator-role artefact. The rule *"cadence ends at Moment 2"*
makes the cadence's lifecycle match the role's lifecycle.

**Why the outgoing coordinator names the gap explicitly.** If
Moment 2 cannot land before the outgoing coordinator's session
ends (token pressure, owner-directed end-of-session, environment
constraint), the team needs to know the cron will fire into an
empty slot. Naming the defect in pre-positioning is honest;
silently cancelling the cron and hoping the next agent picks it
up is not.

**Trigger to graduate from Proposed to Accepted.** Second observed
instance in a session distinct from the first. Rotating-cast
operation will hit the second instance within hours of launch
(per the gate-1a delivery addendum's stress-test design); the
PDR moves to Accepted with any refinements absorbed from the
second instance.

## Consequences

### Required

- The `start-right-team` SKILL Closeout Contract (or a new
  Coordinator Handoff subsection) names the two moments and
  binds the cron / cadence boundary to Moment 2.
- The `start-right-team` SKILL First Moves order is extended for
  agents arriving with a pre-positioning event already in the
  comms stream: their team-start broadcast may declare intent
  to become coordinator, but authority does not transfer until
  the active-acknowledgement broadcast lands as a distinct
  event.
- Pre-positioning events use clear, conventional titles
  (*"Coordinator pre-positioning: \<outgoing\> → \<incoming\>"*)
  so watchers can identify them at a glance.
- Active-acknowledgement events use clear, conventional titles
  (*"Coordinator role acknowledgement: \<incoming\> from
  \<prior\>"*) and reference the pre-positioning event via
  `in_response_to`.
- Owner-mediated coordinator selection (the owner naming the
  incoming coordinator out-of-band) still requires the named
  incoming coordinator to broadcast active-acknowledgement
  before authority transfers. Owner direction is final on *who*
  the coordinator should be; this PDR governs *when* authority
  transfers.

### Forbidden

- Treating pre-positioning as authority transfer. The outgoing
  coordinator does not retire or cancel cron at pre-positioning.
- Silent absorption of the coordinator role. The incoming
  coordinator must broadcast active-acknowledgement; absent the
  broadcast, peers cannot route to them.
- Cancelling coordinator-cadence cron / wakeup / monitor at
  Moment 1. Cadence ends at Moment 2 or not at all.
- Using `mid-cycle-handoff` (PDR-063 message_kind) for
  coordinator role transitions. The role is team-state; cycle
  handoffs are claim-state. They may co-occur (see
  "Intersection with PDR-063") but they are distinct events.

### Accepted Cost

- Two events per coordinator handoff instead of one. Small;
  amortised by the audit clarity it provides.
- A possible coordinator-less *waiting* state if active-
  acknowledgement is delayed. The cure is the rule "outgoing
  coordinator does not retire until Moment 2 lands"; the cost
  is that the outgoing coordinator's session length is bounded
  by the incoming coordinator's arrival, which is acceptable
  for non-token-pressured handoffs and is exactly why PDR-063's
  mid-cycle retirement protocol exists for the token-pressured
  case.

## Open questions deferred to second-instance observation

1. **Active-acknowledgement timeout.** What is the deadline by
   which the incoming coordinator must broadcast active-
   acknowledgement after a pre-positioning event names them, and
   what happens if they miss it? The first instance had a
   sub-minute gap; rotating-cast may stretch this materially.
2. **Multi-candidate pre-positioning.** Can a pre-positioning
   event name multiple candidate incoming coordinators (let
   whoever arrives first take the role), and if so how is the
   contention resolved when two arrive nearly simultaneously?
3. **Role partial-transfer.** Is there a legitimate "share the
   role for N minutes" mode (e.g. transition rehearsal in a
   training session)? If so, how is dual-authority disambiguated
   on routing? This PDR explicitly rejects dual-authority as
   default; the question is whether a controlled exception
   exists.
4. **Owner-direct designation without pre-positioning.** Owner
   sometimes names a coordinator directly in the chat without a
   prior pre-positioning event. Does the named agent's team-
   start broadcast satisfy Moment 2, or is a distinct active-
   acknowledgement still required? (Hypothesis: a team-start
   broadcast that explicitly names *"I am coordinator from
   session-open per owner direction"* satisfies Moment 2 by
   collapsing the two events.)
5. **Malformed active-acknowledgement.** What is the audit-trail
   behaviour when the active-acknowledgement broadcast is
   malformed — missing `in_response_to`, missing the prior
   coordinator's identity tuple, or otherwise failing the §Required
   shape? Does the team treat it as having landed Moment 2 (and
   correct downstream), or wait for a re-issued broadcast (and
   leave authority unsettled in the interim)? The §Required shape
   names the fields but does not name the behaviour under
   non-compliance.
6. **Dual-authority detection.** This PDR rejects dual-authority
   as default, but does not name what counts as evidence of
   dual-authority arising in practice. If two agents are
   broadcasting from the coordinator role under a misread (e.g.
   both interpreted a Moment 1 event as naming them), what is
   the structural signal that surfaces the contention, and who
   is empowered to resolve it? (Hypothesis: a team-member
   broadcast naming the contention and tagging both candidates
   forces a coordinator-of-record decision by the next-arriving
   peer or by the owner.)
