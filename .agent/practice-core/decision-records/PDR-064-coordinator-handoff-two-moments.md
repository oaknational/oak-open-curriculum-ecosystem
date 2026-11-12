---
pdr_kind: governance
---

# PDR-064: Coordinator Handoff — Pre-Positioning vs Active-Acknowledgement

**Status**: Accepted (2026-06-12 — the Proposed→Accepted trigger named in
§Rationale fired many times over: four further coordinator/Director
successions inside one 24-hour window of 2026-06-10/11, each running the
two-moments shape; the refinements those instances produced are absorbed
in the 2026-06-12 amendment below)
**Date**: 2026-05-22 (amended 2026-06-12 — pre-positioning matured from a
single event into a shadow-period process; standing-successor authorisation
and the citable-gate test added, resolving deferred open question 4;
Director-session closeout obligations added per owner-standing direction;
amended 2026-07-04 — owner-probe semantics during a protocol window;
amended 2026-07-13 — the intersection's owner-absent deadline default
scoped to the steps the retiring seat itself can execute, steps 2–6
with Moment 1 interleaved; step 7 is the receiver's Moment 2;
amended 2026-09-25 — the intersection starts on the owner's call,
never on a context reading, per PDR-063)
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
(mid-cycle retirement protocol — an owner-called coordinator
handoff mid-cycle exercises both this PDR's two-moments boundary
and PDR-063's mid-cycle handoff; the join-point is named below);
[PDR-077](PDR-077-marshal-as-cycle-discipline.md)
(commit marshal as cycle-discipline role — the marshal seat uses
this PDR's two-moments shape for role transitions, with
`git index/HEAD` authority as the analogue of the coordinator-cadence
cron; both seats are slice-class authority bearers);
[PDR-078](PDR-078-liveness-heartbeat-contract.md)
(liveness-heartbeat contract — the coordinator-handoff 30-minute
grace window is one of PDR-078's named heartbeat-exemption classes;
PDR-078 defers to this PDR for the boundary specification while
naming the exemption itself).

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
  absorbs both full-handoff and slice-handoff cases — see
  §"Partial / Slice-Scoped Coordinator Transfer" below for the
  slice-handoff shape);
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
  different coordinator — with ONE forced exception: a retirement
  the owner calls under PDR-063 §Retirement authority; once called,
  the retirement proceeds whether or not a receiver exists.
  In that case the coordinator does not leave
  authority pending for an unnamed successor: the Step 5 retirement broadcast
  explicitly returns coordination authority to the OWNER (the scarce
  authority above every seat); the coordinator-role context rides
  the Moment 1 pre-positioning event (re-broadcast if stale — the
  role is team-state, never handoff-record content); any open cycle
  claim additionally takes the pending-handoff transport; and the
  next coordinator is owner-designated or team-designated at pickup
  — never silently assumed.

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
  Slice-coordinator cron cases are governed separately by
  §"Partial / Slice-Scoped Coordinator Transfer" below.
  If the outgoing
  coordinator must end their session before active-
  acknowledgement, the cron / wakeup / monitor stays armed and
  the outgoing coordinator declares the gap explicitly in the
  pre-positioning event (*"if Moment 2 has not landed by
  \<deadline\>, the cron continues firing into an empty
  coordinator slot — this is the structural defect; the team
  must surface a new candidate"*). Under the forced
  exception above (the authority-invariant bullet; PDR-063
  §Retirement authority), session-scoped cadence surfaces cannot outlive
  the retiring session: the Step 5 retirement broadcast declares
  them stood down by name, and the empty-slot surfacing duty rides
  the Moment 1 pre-positioning event (the durable coordinator-role
  surface — re-broadcast it if stale) to the owner-designated
  pickup; the per-claim handoff record, where one exists, carries
  only the cycle-claim context.

### Pre-positioning is a process — the shadow period (2026-06-12 amendment)

Moment 1 names a single information-transfer **event**; matured succession
practice runs pre-positioning as a **process**. A shadow period opens at
(or before) the Moment 1 broadcast, during which:

- the outgoing holder front-loads transfer continuously rather than in one
  dump — the candidate successor reads the live surfaces (roster, slice
  state, routing queue, standing notes) while the outgoing holder still
  carries authority;
- the handover criteria are **named and team-visible** — what the successor
  must have read, acknowledged, or demonstrated before Moment 2 is
  legitimate;
- an **abrupt-unavailability recovery path** is named in advance: if the
  outgoing holder goes silent before Moment 2, the front-loaded transfer
  plus the named criteria let the team (or the owner) complete the
  succession rather than rescue it.

Worked deviation instance (2026-06-10): an outgoing holder went silent
between the moments; because transfer had been front-loaded as a process,
the owner-directed Moment 2 was a *completion*, not a rescue. Four further
successions in the following ~24 hours each ran pre-positioning as a
process.

### Standing-successor authorisation and the citable-gate test (2026-06-12 amendment)

**A standing successor naming IS the authorisation.** When the owner has
named a successor (directly, or via standing direction that a named class
of agent succeeds), Moment 2 fires on the successor's
active-acknowledgement broadcast **without a fresh owner sign-off ask**.
Asking the owner to re-confirm a naming they have already made is an
invented gate that burns the owner-attention this role exists to conserve.
This resolves deferred open question 4 in the collapsed-event direction:
an explicit owner naming plus the successor's active-acknowledgement
completes the transfer.

The general form is the **citable-gate test**: before writing "owner
directs X", "owner must approve X", or any owner-reservation into a
coordination artefact (pre-positioning events, handoff records, closeout
summaries, plans), cite where the owner reserved X. **An uncited
reservation is an invented gate.** The test supersedes a bare
"fire and let the owner interrupt" framing, which over-corrects at
genuinely owner-owned moments — the discipline asks for the citation, not
for boldness.

### Owner-probe semantics during a protocol window (2026-07-04 amendment)

When the owner has installed a defined multi-party process (this PDR's
two-moments handoff, or any gated choreography), an owner probe ("what's
the status?", "should this be moving?") means **advance your own next
defined step** — confirm readiness to the counterparty, fix the transport
blocking them, fire the prepared moment. The two failure modes are
symmetric substitutes for that step: passive waiting for an authorisation
the owner considers given, and unilateral seizure of authority the
choreography has not yet transferred (owner-corrected in both directions
within one hour, 2026-06-10). The defined step does neither: it asks for
no re-validation of the destination and skips none of the choreography.

On the **second** owner probe in the same area, stop answering narrowly:
present the full protocol state, name the fork and who owns it, state
your default, and name the trigger for the other branch. Repeated probes
at a protocol gap signal the owner expects movement or a surfaced fork,
not another literal answer — and a relayed owner directive (read via
another agent's event) is an interpretation surface the live owner can
override: act on it as the standing default, holding it override-open
rather than re-asking. In waiting
or shadow roles, passivity is also a choice that needs surfacing: drive
the named readiness criteria rather than observing heartbeats.

### Director-session closeout obligations (2026-06-12 amendment)

At every Director/coordinator session closeout, the closing holder runs
the host's FULL lightweight-handoff workflow AND its deep-consolidation
workflow BEFORE landing the final coordination change set; the session is
not closed until that change set lands. (Owner-standing direction,
2026-06-12; the host's team-session-opener surface is the operational
home — this clause is the portable contract it realises.)

What a succession record transmits is where Director tenures fail. Five
Directors in about fifty hours left five error signatures, each a failure
of transmission and none of capability: absorption into execution;
confabulation from a compressed context; trusting the tenure's own
descriptions; answering the owner process-first; and drift in the
tenure's description of itself (the cross-tenure synthesis of a
succession record, 2026-07-26). The cure enacted then has three parts:
the owner-channel contract is first-class state in the tracked brief; the
formation letter carries it as story; and the succession record is
checked by another reader before it is transmitted (the first such check
was owner-ordered and found real defects). Its falsifier stands: if the
next tenure's first owner correction is still of the owner-channel class,
the cure belongs in structure (an answer-first tripwire), not in more
prose.

### Partial / Slice-Scoped Coordinator Transfer

The full-session coordinator role is one shape of coordinator
authority. A second shape co-exists: **slice-scoped coordinator
authority**, where one agent owns coordination of a bounded sub-arc
(a multi-cycle implementation slice, a multi-PDR drafting set, a
multi-agent reviewer fan-out) while the full-session coordinator
continues to own the broader session. The slice-coordinator sits
*inside* the full-coordinator window, not in place of it.

The two-moments shape applies to slice transfers, but with reduced
operational surface:

- **Moment 1 (pre-positioning) for a slice transfer** is a narrative
  broadcast naming the slice boundary, the outgoing slice-coordinator,
  the incoming slice-coordinator, and the carried slice state
  (open routing inside the slice, queued slice-internal
  decision-points, slice-specific reviewer dispatches in flight).
  The pre-positioning event explicitly names the slice scope —
  *"slice-coordinator pre-positioning for [slice boundary]:
  \<outgoing\> → \<incoming\>"* — so peers know the transfer is
  scoped, not full-session.
- **Moment 2 (active-acknowledgement) for a slice transfer** is a
  narrative broadcast from the incoming slice-coordinator with the
  conventional title *"Slice-coordinator role acknowledgement
  for [slice boundary]: \<incoming\> from \<prior\>"*, referencing
  the slice pre-positioning event via `in_response_to` and naming
  the cadence the incoming slice-coordinator will adopt for the
  slice.

The structural reductions relative to full-session transfer:

- **No full-authority transfer**: routing outside the slice, reviewer
  dispatch outside the slice, and commit-window mediation outside
  the slice remain with the full-session coordinator throughout.
- **No coordinator-cadence cron rearm**: a slice-coordinator does
  not own a session-cadence cron; the full-session coordinator's
  cadence continues unchanged. Slice-coordinator cadence, if any,
  is a slice-internal artefact owned by the slice-coordinator (a
  scoped wakeup, a slice-internal Monitor) and ends when the slice
  closes or transfers, never persisting into the full-session role.
- **Boundary-bounded scope**: the slice transfer authority covers
  only events whose scope is the named slice. Events that touch
  surfaces outside the slice remain a full-session-coordinator
  concern and are routed through them as normal.

The slice transfer still requires both moments. Slice pre-positioning
without active-acknowledgement creates a slice-coordinator-less window
inside an otherwise-coordinated session — peers route slice-internal
events to no one and the slice stalls. The cure shape is the same:
authority transfers only when the incoming slice-coordinator's
active-acknowledgement lands as a distinct event referencing the
pre-positioning.

A single session may carry multiple slice-coordinator boundaries
concurrently (e.g. one slice-coord on a PDR-drafting arc, another
slice-coord on an implementation cycle), each governed by its own
two-moments pair. The full-session coordinator routes inter-slice
events and remains the escalation surface above each slice-coord.

### Intersection with PDR-063 (mid-cycle retirement)

If the owner calls the outgoing coordinator's handoff mid-cycle
(PDR-063 Step 1), both protocols fire:

1. PDR-063 Step 1 — the owner calls the handoff; an owner redirect
   exits this sequence here. The retiring seat then executes steps
   2–6 below: they realise PDR-063's Steps 2–5 with Moment 1
   interleaved, with no separate contiguous Steps-2–5 block for a
   coordinator. Step 7 (Moment 2) is the receiving agent's later
   pickup action, never the retiring seat's.
2. PDR-063 Step 2 — ONLY when the coordinator was running an open
   cycle claim: write the structured handoff record for it.
3. PDR-063 Step 3 — under the same open-claim condition: extend that
   claim with `handoff_record_path` (claim adoption preserves the
   field but never adds it, so this step must precede any transport
   whose pickup relies on adoption). With no open cycle claim,
   Steps 2–4 all skip and execution proceeds to Moment 1.
4. This PDR's Moment 1 — broadcast the pre-positioning event
   covering coordinator responsibilities (which is broader than
   any single cycle claim).
5. PDR-063 Step 4 — ONLY when an open cycle claim exists (Steps 2
   and 3 created and linked its record): directed `mid-cycle-handoff`
   event to a named receiver for that claim; when no live receiver
   exists (neither successor nor another coordinator), PDR-063
   ruling 3's Step 4 transport exception applies — a broadcast
   pending-handoff announcement carrying the record path, with pickup
   via claim adoption. A coordinator with NO open cycle claim skips
   this step entirely; the role handoff is Moment 1's to carry.
6. PDR-063 Step 5 — retirement broadcast.
7. The receiving agent for the coordinator role then provides
   this PDR's Moment 2 (active-acknowledgement) when they pick
   up the role.

The coordinator role itself is not embedded in the handoff record
(handoff records are per-claim content; the coordinator role is
team-state). The pre-positioning event carries the coordinator-
role context; the handoff record carries any cycle-claim context
the coordinator was also running.

### Moment 2 follows a demonstrated board (2026-10-01 amendment, recording a Director's ruling of 2026-09-09)

The outgoing Director's GO follows a demonstration, not a reading list: the successor posts "a
directed event to me with the board recomputed first-hand (each open PR: head, state, threads, the
next command) and the three standing owner words that bind the day", and "Moment 2 fires on my
directed GO after that demonstration, or on the owner's word, whichever first" (the Director seat of
2026-09-09, OCE comms event 67c04dd2; one instance, recorded with its decider on 2026-10-01). The
same event's abrupt-unavailability clause is superseded by PDR-117's amendment of 2026-09-17 (a
takeover rests on a written stand-down, never on freshness) and is not carried.

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
ends (owner-directed end-of-session, environment constraint), the
team needs to know the cron will fire into an
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
  Moment 1. Cadence ends at Moment 2 or not at all — with this PDR's
  one forced exception (§Cron / cadence boundary): a retirement
  the owner calls under PDR-063 §Retirement authority stands the
  session-scoped cadence surfaces down BY NAME in the Step 5
  broadcast, before any Moment 2 can land.
- Using `mid-cycle-handoff` (PDR-063 message_kind) for
  coordinator role transitions. The role is team-state; cycle
  handoffs are claim-state. They may co-occur (see
  "Intersection with PDR-063") but they are distinct events.

### Accepted Cost

- Two events per coordinator handoff instead of one. Small;
  amortised by the audit clarity it provides.
- A possible coordinator-less *waiting* state if active-
  acknowledgement is delayed. The cure is the rule "outgoing
  coordinator does not retire until Moment 2 lands" (subject to the
  same authorised-forced-retirement exception — a PDR-063-authorised
  retirement completes steps 2–6 of THIS PDR's §Intersection sequence
  and ends the session before
  Moment 2, returning authority to the owner); the cost
  is that the outgoing coordinator's session length is bounded
  by the incoming coordinator's arrival, which is acceptable
  because the owner can call the forced exception (PDR-063
  §Retirement authority) when waiting for Moment 2 costs more than
  it saves.

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
4. **Owner-direct designation without pre-positioning.** RESOLVED by the
   2026-06-12 amendment (§Standing-successor authorisation): the owner
   naming is the authorisation; the named agent's explicit
   active-acknowledgement broadcast (which a team-start broadcast naming
   the role per owner direction satisfies) completes Moment 2. No fresh
   owner sign-off ask is legitimate — an uncited reservation is an
   invented gate.
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
