---
pdr_kind: governance
---

# PDR-063: Mid-Cycle Retirement Protocol for Token-Bounded Agents

**Status**: Proposed (amended 2026-07-08 — §Retirement authority +
§Deliberate succession, owner rulings; amended 2026-07-13 — signal
model, observable floor, executable bounds, transport exception)
**Date**: 2026-05-22
**Related**:
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing commitment — extends the
landing-vs-no-landing dichotomy to landing-via-handoff);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, identity — handoff records identify
authoring + receiving agents through the same identity tuple);
[PDR-049](PDR-049-memory-and-state-file-merge-semantics.md)
(memory and state file merge semantics — the active-claim
surface this protocol extends);
[PDR-050](PDR-050-state-memory-substrate-contracts.md)
(state and memory substrate contracts — peer substrate to the
one this protocol introduces);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(ten named cures — this protocol is a structural addition adjacent
to cure (iii) stale-claims and cure (viii) worker-side discoveries);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator-handoff two moments — coordinator-role mid-cycle
handoff intersection; join-point at the active-acknowledgement
boundary);
[PDR-077](PDR-077-marshal-as-cycle-discipline.md)
(commit marshal as cycle-discipline role — when the marshal seat
retires mid-cycle, this PDR governs the per-cycle handoff and
PDR-077 governs the marshal-role transfer; the two events are
distinct and MUST use distinct message kinds);
[PDR-078](PDR-078-liveness-heartbeat-contract.md)
(liveness-heartbeat contract — the retirement-threshold this
contract names triggers this PDR's per-cycle handoff protocol when a
heartbeat-emitting role retires under token pressure; PDR-078 defers
to PDR-063 for the per-cycle handoff substrate, and PDR-063 in turn
relies on PDR-078's threshold for the trigger);
the host estate's practice index (the substrate-implementation
ADR carrying the repo-specific phenotype of this PDR lives behind it;
Core cites hosts by role, never by path, per PDR-105).

## Context

Multi-agent operation in this Practice is moving from human-pace
sessions with natural-boundary closeouts (slice-complete,
commit-landed, peer-closeout) toward rotating-cast operation: a
larger pool of agents, each bounded to a fixed context budget, with
auto-spawn cadence approaching human-faster-than-pace operation.
Under those conditions a new and previously unobserved retirement
mode becomes routine:

> An agent approaching its context budget mid-cycle, mid-edit,
> possibly mid-claim must retire before the natural boundary they
> were heading for.

The existing closeout contract (codified in the `start-right-team`
SKILL §Closeout Contract) only governs natural-boundary closeouts.
A token-pressured retirement at an unnatural boundary has two
failure paths the closeout contract cannot prevent:

1. **Indeterminate-state leakage**: the agent retires without
   leaving the next agent a structured view of where the work
   actually was — which files are open and at what state, what
   analysis was in flight, what decisions are settled, what is
   still owed. The next agent rediscovers state by re-reading
   artefacts and inferring, which is expensive and lossy.

2. **Rushed-landing breaches atomic-landing**: the agent senses the
   ceiling and tries to force a commit at an unsafe point, which
   either breaks the atomic-landing invariant (tests and product
   code split across commits) or skips reviewer absorption to make
   the deadline.

The capture trigger for this PDR is the rotating-cast operational
model: the first rotating-cast Round 1 launch will be the controlled
stress test for the protocol. The PDR exists to give that stress
test a structured artefact to observe against, rather than retro-
fitting a protocol from whatever the first instance happens to
produce.

## Decision

Adopt the following five-step mid-cycle retirement protocol. It
fires only when an agent must retire before the natural boundary
they were working toward AND the ORIGIN is a measured budget signal.
The owner CALLING the handoff moment on that measured signal
(§Retirement authority ruling 2) stays inside these five steps; an
owner INITIATING a succession with no measured budget signal in play
routes through §Deliberate succession below instead.
Natural-boundary closeouts continue to use the existing
`start-right-team` §Closeout Contract unchanged.

### Step 1 — Sense approaching budget

The retiring agent senses approaching budget at any of three
triggers, whichever comes first:

- **Effectiveness-window start** (the primary handover-start signal
  under rotating-cast operation): measured usage crosses ~50 % of the
  full window — see the refinement below for the calibration and why
  this fires long before the capacity ceiling.
- **Quantitative ceiling**: context usage ≥ 80 % of the agent's
  bounded budget — the hard stop.
- **Post-commit**: immediately after landing any commit, the agent
  re-evaluates remaining budget against the next-cycle floor and
  enters this protocol if the remaining budget would not cover one
  more cycle with margin. The floor is OBSERVABLE, not estimated: the
  measured token cost of this session's most recent completed cycle
  (TDD authoring + reviewer absorption + gate suite, read from the
  transcript). A session with no completed cycle yet has no measured
  floor — its post-commit arm cannot fire; the two threshold axes
  govern alone.

The 80 % quantitative trigger has priority over the post-commit
trigger: an agent at 85 % mid-cycle does not get to "push for one
more commit"; the protocol fires. Firing means the seat surfaces the
measured figure and follows §Retirement authority below on who calls
the handoff — firing is never self-retirement.

Sensing is MEASUREMENT plus SURFACING, never self-declaration: the
budget figure is measured (transcript usage against the actual
window, per the effectiveness-window refinement below; the estate's
deterministic context-budget tooling when it lands), and who calls
the retirement follows §Retirement authority below (owner rulings
2026-07-08). Every trigger figure is a metric-surfacing threshold,
never a self-retirement authority, and the signal model has two axes
— the ~50 % effectiveness-window start (the primary handover-start
signal; refinement below) and the ≥ 80 % hard-stop ceiling. This
routing applies to every trigger above, the post-commit verdict
included: a measured post-commit shortfall is surfaced and routed
through §Retirement authority exactly like a threshold crossing.

**Effectiveness-window refinement** (owner-taught calibration 2026-06-28/29;
held as an approximate heuristic per model, not a constant). The ≥ 80 % trigger
reads *token capacity*, which is roughly linear — but **effectiveness vs context
consumed is non-linear, a decreasing sigmoid**, so 80 % of the bounded budget is
far too late if read against the full context window. The trigger therefore has
**two axes**: the hard token-capacity ceiling (≥ 80 % of bounded budget, above)
AND an **effectiveness-window start** — handover should *start* at ~50 % of the
full window, well before the ~65 % point where mistake-odds rise. The
effectiveness-window start is the **primary** handover-start signal under
rotating-cast operation; the ≥ 80 % ceiling is the hard stop. Owner calibration
for Opus 4.8 1M: peak ~40–45 %, **start handover ~50 %**, mistake-odds rise
~65 %, degraded (slows, makes strange decisions) ~80 %. Read the % against the
**effectiveness** curve, not the capacity curve; measure it (transcript usage vs
the actual window), do not confabulate it. Hold the curve as an approximate
owner heuristic, recalibrated by observation per model — not a precise constant.

### Step 2 — Freeze work-in-progress to a structured handoff record

The retiring agent writes a handoff record naming four sections:

1. **Current edit state** — for each open or in-flight file, the
   path, the working-tree state (clean / modified / staged), the
   intended next edit, and any uncommitted-but-staged content
   summary.
2. **In-flight reasoning** — the analysis that led to the current
   state. Not chain-of-thought; the *substantive* reasoning the
   next agent needs to continue. Falsifiability anchor for
   "substantive": reasoning that, if omitted, would force the
   receiving agent to re-derive a multi-step inference from
   primary artefacts. Citations to comms-events, plan sections,
   reviewer verdicts, ADRs, or other PDRs as appropriate.
3. **Decisions made** — what is settled. Each decision named with
   its rationale and any evidence reference. The next agent treats
   these as committed-but-not-yet-coded.
4. **Decisions deferred** — what the next agent must resolve. Each
   open question named, with the constraints and options as the
   retiring agent saw them.

The handoff record is a first-class artefact: human-readable,
content-addressed by the active claim, discoverable through the
collaboration-state substrate, replay-able by any future agent
reconstructing the cycle's history, and retained until the claim
closes successfully.

**Confabulation-from-compression is a succession signal (worked instance,
2026-07-2x).** Beyond the budget triggers, a RISING error class of
confabulated specifics — details asserted from compressed memory that the
record contradicts (the instance included a fabricated-bot-identity commit
attribution) — after a long tenure (~a week, two compactions in the
instance) is itself grounds to surface for deliberate succession: the seat's
compressed context is now generating false precision, and no amount of
care inside the same context cures it. Surface the observed error class;
the owner or Director calls the succession.

**Reviewer outputs travel verbatim (owner tightening, 2026-07-24).**
When the frozen cycle carries reviewer or fleet feedback, the handoff
record includes every reviewer's RAW output VERBATIM as individual
files alongside the record — never summarised into it. The receiving
assessor (Director or successor) assesses the fleet feedback
independently BEFORE reading the retiring implementer's dispositions,
then diffs the two readings; a summarised-only handoff collapses that
independent check into the implementer's frame and defeats it.

**Externally-mutable facts carry an as-of stamp plus a
recount-at-pickup instruction** (amendment, 2026-07-06). A handoff
record's counts and states that other actors can change — open PR
review threads, check states, bot comments, upstream branch tips —
are true only at their evidence timestamp: stamp each such fact
with when it was observed and instruct the receiving agent to
recount at pickup. Worked instance: "the two Copilot threads" was
true on 2026-07-03 evidence and silently false (eight) by pickup.

**Writer-side record obligations** (amendment, 2026-07-30 dedicated
consolidation; each clause carries its worked instance):

- **An assumption ledger rides every handover, not only wraps.** Flag
  each load-bearing assumption the record transmits (`Fact` /
  `Owner's-call` / `To-verify` / `Dropped`). Writing the ledger is the
  only instrument observed to make a record-author's own error visible
  from the inside — "flag all assumptions" forced the admission that a
  ticket's premise was a docstring read, and one command then falsified
  it before anyone built on it (2026-07-27).
- **Carried constraints are re-priced by cure cost, and the record says
  the price.** A constraint's hardness is priced by what curing it
  costs at time of use, never by the framing it arrived in — a
  credentials expiry rode five compaction boundaries framed as "the
  hard bound" when re-minting was the work of seconds (owner-corrected
  2026-07-29). A record transmitting a "hard" constraint names the
  cure cost or marks it unpriced.
- **Gates hand over as NOT-OBTAINED, never dressed as discharged.** A
  review or check that was dispatched but never delivered is inherited
  as a first-act obligation, not a waived gate — "dispatched" is not
  "discharged" (worked instance 2026-07-30: a pre-execution review
  died four times across two seats under provider overload; the honest
  NOT-OBTAINED handover held at every hop).
- **Lane obligations can outlive the seat.** A live surface the lane
  owes (a render server in the owner's browser, a monitor another seat
  reads) survives the seat that started it; the record names each such
  obligation so the successor probes and re-establishes it first-hand
  — the freeze premise "monitors stay live" is falsifiable by the
  platform after the fact (worked instance 2026-07-29).
- **Decisions carry their ratification status.** For each decision the
  record transmits, mark it owner-seen, merely-executed, or unknown —
  executed is not ratified, and a lineage that transmits the activity
  record over the goal record lets a never-ratified scope narrowing
  read as settled (worked instance 2026-07-29: a ticket-scope
  narrowing executed 2026-07-27 was carried as fact while the
  register held the owner's contradicting boundary verbatim; no seat
  noticed they conflicted until the owner did). The reader's closing
  question at pickup: "what changed since the records froze?"

### Step 3 — Extend the active claim

The retiring agent updates their active-claim entry with a single
optional field naming the handoff record. The field's presence
signals "this claim is mid-cycle and carries a handoff record"; its
absence signals normal active-claim semantics. No other schema
field changes; existing readers ignore the new field without
breakage.

### Step 4 — Hand off via directed comms-event

The retiring agent posts a directed comms-event with a discriminator
identifying it as a mid-cycle handoff (distinct from natural-
boundary closeout and from coordination-notice classes). The event
body carries:

- the claim identifier being handed off;
- a pointer to the handoff record;
- a one-paragraph human summary (≤ 200 words) of where the work
  is and what the next agent must do first;
- the retiring agent's identity tuple (per PDR-027 identity
  discipline) so the receiving agent knows who to credit for the
  handoff.

### Step 5 — Retire

The retiring agent posts a final retirement broadcast (existing
team-cadence shape, no new event kind required) naming the
handed-off claim and the receiving agent (if known) so the team
sees the retirement is not abandonment. The agent then ends their
session.

Where no session-scoped completion goal exists, the session simply ends.
Where the handing-off session carries one — any host mechanism that
evaluates that session's own terminal state (a stop-hook goal, a
terminal-state assertion) — clearing or transferring that goal is a named
handoff step. The goal is satisfied by the TEAM via the successor's work,
but a session-terminal evaluator cannot see the transfer: it reads the
handing session's disk state, which a correctly handed-off agent can no
longer satisfy (the successor holds the work under an active claim).
Surface the clear/transfer to the owner at the handoff; the handing
agent's correct terminal state is then: handoff verified live, the
clear/transfer surfaced to the owner, holding for the owner's resolution.
Do not resume the handed-off work to satisfy the evaluator, do not
re-argue it per fire, and do not re-check the surfaced request at the
evaluator's fire cadence (fires are far faster than the successor's
progress on the handed-off work).

### Retirement authority — measured metrics, owner-called handoffs (owner rulings 2026-07-08)

Four owner rulings (2026-07-08, recorded verbatim-substance at ruling
time) supersede this protocol's original self-sensed trigger semantics
on the AUTHORITY axis — who may declare budget exhaustion and who
calls the handoff moment. The thresholds are unchanged; the five-step
mechanics stand with ONE explicit Step 4 TRANSPORT exception, defined
in ruling 3 below: when no live recipient exists for the directed
`mid-cycle-handoff` event, a broadcast pending-handoff announcement
replaces it. No other step changes.

1. **No self-declared exhaustion, ever.** Budget verdicts come only
   from measured context figures (transcript usage against the actual
   window; the estate's deterministic context-budget tooling once it
   lands). An agent never retires, hands off, or declines work on a
   guessed budget state.
2. **Owner-present: the seat surfaces the measured metric; the OWNER
   calls the handoff moment.** Surfacing measured metrics is the
   agent's whole authority in this mode.
3. **Owner-absent at a measured handover signal: surface, then
   autonomous handoff.** The signal is any measured Step 1 trigger —
   the effectiveness-window start (~50 % of the full window; the
   primary handover-start signal under rotating-cast operation), the
   ≥ 80 % hard-stop ceiling, or a measured post-commit shortfall —
   whichever fires first. The seat
   surfaces the measurement through the comms event PLUS an
   out-of-band owner notification where the platform provides a
   notification capability (a host-phenotype concern — each estate
   names its mechanism; a platform with none satisfies surfacing with
   the comms event alone, and the declared deadline still governs),
   waits the declared window for owner or coordinator word, and AT
   THE DEADLINE EXECUTES the declared default action — the REMAINING
   Steps 2–5, autonomously, on the measured verdict (Step 1 has
   already fired, surfaced, and completed this authority wait;
   re-entering it would recurse) — never on an unmeasured sense of
   fullness; owner or coordinator word arriving before the deadline
   redirects the seat and EXITS this path instead. The bounded wait
   can never become an indefinite one. The bound is
   executable, not vibes: the surfacing event MUST declare its
   absolute deadline and the default action that fires at the
   deadline (protocol default when no coordinator SLA applies:
   10 minutes, then autonomous execution of the remaining Steps 2–5 —
   matching
   the estate liveness convention's 10-minute retirement window).
   Autonomous execution does not require a live successor: the
   remaining steps complete with the Step 2 handoff record as the
   durable interface. The claim retains `handoff_record_path`; Step 4's
   directed `mid-cycle-handoff` event (schema-required point-to-point
   with a `to` recipient) is sent when a live recipient — successor
   or coordinator — exists. When neither exists, Step 4 takes the
   no-recipient variant: a BROADCAST narrative comms event announcing
   the PENDING handoff and the record path (broadcasts carry no `to`,
   so no schema violation), plus the surfacing step's out-of-band
   owner notification where the platform provides one (the same
   capability condition as above); the successor later picks up via claim ADOPTION
   (the §Deliberate succession in-flight substrate), which needs no
   directed event from the departed seat. The seat closes cleanly;
   successor instantiation then follows ruling 4 (owner-mediated)
   from the record.
4. **Successor instantiation is owner-mediated until session-spawn
   automation exists** (the owner's named automation gap: "yes to
   automated handoff, however we have no way of automatically
   starting new sessions, yet"). This section is deliberately
   mechanism-agnostic: the Step 2 handoff-record contract is the
   stable interface any future spawner consumes; spawner-command
   work precedes any editor-plugin route (owner sequencing ruling,
   same day).

### Deliberate succession — the in-flight discriminator (amendment 2026-07-08)

Deliberate (owner-directed) succession is not a budget-triggered
mid-cycle retirement — the owner's call, not a threshold crossing,
starts it — and it may occur mid-cycle or at rest: the discriminator
against this protocol is the INITIATOR (an owner call versus a
measured budget signal), never the state. It takes one of two shapes,
and the shape discriminator is whether state is IN-FLIGHT (in-flight
state selects the record-plus-adoption shape below, not this
protocol's five steps):

- **In-flight state exists** (open cycle, live claim, uncommitted
  decisions): the record substrate plus claim ADOPTION carry the
  succession — the predecessor's handoff record and claim transfer to
  the successor (worked instances at the peer estate: the 2026-07-07
  standby→successor adoption; the 2026-07-08 in-flight succession).
- **The lane is AT REST** (work landed, claim closed, no open
  decisions): the hand is TRACKED-SURFACES-ONLY — there is NO claim
  to adopt and NO handoff record; the successor opens their OWN claim
  at go, against the re-derived registry (worked instance at the peer
  estate: a directed event had to correct an incoming successor's
  adopt-expectation — expecting an adoptable claim on an at-rest lane
  was the named loss vector).

Successors expect the shape the discriminator names; a missing
handoff record on an at-rest lane is the correct state, not a gap.

**Deliberate handovers carry wrap-grade ceremony** (owner word,
2026-07-30, in-session during a live lane swap: "I expect a full
handover probably needs almost a full /oak-wrap"). An owner-directed
lane handover is not claim adoption plus a note: it carries safety
evidence, a conservation map, the four-section record, and gate-state
honesty (including NOT-OBTAINED gates) — the record contents approach
the wrap workflow's safety/conservation sections. Worked instance the
same hour: a swap whose outgoing side rode a full wrap-grade freeze
plus claim-anchored record, and whose incoming side recounted the
record's one unverified transmitted claim first-hand at pickup — and
that one unverified claim was the record's one false claim.

### Warm and cold pauses — the vocabulary (amendment 2026-07-30)

Pause states between full activity and retirement, enacted consistently
across three-plus instances (2026-07-28→30) and now named so enactment
does not depend on imitation:

- **Warm pause**: the seat continues; monitors STAY LIVE; resume is
  immediate. Warm means *resumable*, not *running* — when every peer is
  paused and the loops have no consumer, standing them down and keeping
  a one-call re-arm is still warm (the state that makes resume cheap is
  the durable record, never a burning loop).
- **Cold pause**: loops stopped BY INTENT; a freeze/continuation record
  carries the state; silence is the declared posture — observers read
  intent, not absence (no retirement detection fires on a declared cold
  seat).

Either pause names its resume trigger (owner word, a deadline, an event).
The freeze premise "monitors stay live" is falsifiable by the platform
after the fact — resumers and successors verify monitor-backed
obligations first-hand.

### Handover timing — naming a successor starts the clock (owner-taught 2026-06-28)

**Naming a successor STARTS the handover; the predecessor DRIVES it to
completion at a timing it chooses.** Once a successor is named, the handover has
begun, however slowly — leaving it hanging indefinitely is not an option, and a
"warm + named successor + retained claim held open" state is **not a valid
indefinite rest state**. The predecessor decides *when* the handover completes
(loop-exit-criteria applies to "warm" too: "warm" needs a completion criterion,
not "until the successor happens to show up") — **unless** the predecessor ends
ungracefully (a crash), in which case the silent-retirement / auto-rebalance
protocols (PDR-078) take the timing instead. The failure mode this cures: a
predecessor that treats warm-limbo as a stable resting state and goes passive,
leaving the *successor* to initiate the pickup unilaterally. Corollary: the
predecessor keeps its **incoming-visibility watcher armed until the handover is
acknowledged-complete**, not dropped at the first closeout broadcast — a
retiring-but-not-yet-handed-over predecessor must stay able to see the live
pickup. One authorised exception: ruling 3's no-recipient path (§Retirement
authority) closes the seat with NO live receiver to watch for — there the
watcher stands down with the seat, and pickup accountability transfers to the
durable surfaces the path requires (the pending-handoff broadcast, the claim's
record pointer, and — for coordinators — the Moment 1 pre-positioning event).

### Receiving agent's pickup contract

A receiving agent picking up a claim carrying a handoff-record
pointer:

1. Reads the handoff record before any source edit or comms post.
2. **Validates the prior agent's state assumptions against current
   reality** (see "Discontinuity-boundary validation step" below).
3. Posts a directed acknowledgement event back to the retiring
   agent's identity (the comms record persists even after the
   retiring agent's session ends; the acknowledgement is for the
   audit trail, not for the retired agent to read).
4. Updates the active-claim entry with their own identity in the
   agent-id block; clears the handoff-record pointer field only
   when they decide the cycle has resumed on a natural footing
   and no further handoff is currently pending.
5. Proceeds with the cycle, treating Step 2's "decisions made" as
   committed and "decisions deferred" as the open work surface.

**Reader-side claim classification** (amendment, 2026-07-30 dedicated
consolidation, from the 2026-07-27 wrap harvest that routed it here).
A handoff record is trusted per-document, but its claims decay
per-claim, at class-dependent rates — classify at read:

- **Code-anchored claims** (a path:line, a commit, a diff) held
  everywhere observed; cheapest to trust, cheapest to spot-check.
- **Live-state descriptions** (branch positions, check states, counts)
  are already recount-at-pickup doctrine above.
- **Disposition/verdict claims** ("benign", "cured", "satisfied",
  "equivalent") have NO mechanical contact until acted on and persist
  wrong the longest — **touch the verdicts first**. Two founding
  instances: a "benign — verify the fingerprint instead" guard note
  that hard-failed (exit 1) at first contact; a verification pass
  whose four DIVERGED claims were all estate-state descriptions while
  every code-anchored claim held. Sharpened bound: even honest
  verdicts decay across environment changes (a toolchain rebuild sat
  between the writing and the reading), which is why the cure is
  reader-side classification, never a writer-side ledger alone.
  Falsifier: a pickup that applies the classification and still
  enacts a false disposition.

### Discontinuity-boundary validation step

Added 2026-05-22 (Mistbound Slipping Night). Worked-instance:
Mistbound's compaction-boundary resumption assumed ff2 plan edits
were lost; only by grepping file content was the truth discovered
(edits had been swept into a peer commit during the pause). The
validation step structurally prevents agents redoing work or
assuming loss after any discontinuity boundary.

The receiving agent — whether picking up a peer's handoff, resuming
their own session after compaction, or restarting after crash — runs
the following validation checks BEFORE any source edit:

1. **Prior-edit landing check** — for every file the retiring agent
   reported as edited (in `current edit state`):
   `git log --since "<boundary-time>" -- <file>`.
   If commits appear in the window, the prior edits MAY have landed
   already; read the diff before assuming the receiver must re-do
   the work.
2. **Claim-closure check** — for every claim referenced in the
   handoff record:
   inspect `.agent/state/collaboration/closed-claims.archive.json`
   for closures during the discontinuity window. A closed-then-archived
   claim signals the work landed (or was abandoned with rationale).
3. **Queue-state check** — for every intent referenced in the handoff:
   `commit-queue show --intent-id <id>` returns the current phase.
   Abandoned intents during the discontinuity window often signal
   peer coordination cures (e.g., voluntary back-off per
   `agent-state-observable.md`).
4. **Sub-agent transcript recovery** — for any pending sub-agent
   dispatch named in the handoff, locate the transcript per
   `feedback_subagent_transcript_recovery` (under
   `~/.claude/projects/<project>/<session>/subagents/agent-<id>.jsonl`
   for Claude Code) before re-dispatching.

The validation step is **mandatory** and runs BEFORE the
acknowledgement event (pickup contract item 3). The receiver's
acknowledgement reports the validation outcome — what was confirmed
landed, what was confirmed lost, what was confirmed still in-flight.
This makes the discontinuity-window state observable.

Topology-independence: applies equally to solo session resumption
(your future self is a new receiver), mid-cycle peer pickup (the
classic PDR-063 case), compaction-boundary self-resumption (you are
the receiver of your prior self's handoff), and post-crash recovery.

### Handoff-record carriage decision

The handoff record is carried as a separate content artefact rather
than inline on the active-claim entry. Inline carriage was rejected
because:

- The claims surface stays compact (small-envelope discipline);
  attaching a multi-section reasoning payload to every mid-cycle
  claim would bloat the surface against its design.
- A handoff record is a first-class content artefact (replay-able,
  citable, discoverable); embedding it in operational state
  conflates content boundaries with operational boundaries at the
  wrong layer.
- File-per-handoff (or equivalent first-class-artefact carriage)
  aligns with the existing decision-record / plan convention
  (file-per-decision, content-addressed by name).

## Rationale

**Why a protocol, not just a guideline.** Mid-cycle retirement
under context-budget pressure is structurally different from
natural-boundary closeout. Without explicit steps, agents under
pressure will default to either rushing (atomic-landing breach) or
stopping silently (state leakage). A protocol that an agent can
follow under cognitive pressure is the structural cure; a guideline
that asks an agent to "think clearly while almost out of context"
is not.

**Why a separate content artefact, not inline on claims.** See
"Handoff-record carriage decision" above. Claims are operational
state with a small-envelope discipline; handoff records are content
artefacts with their own lifecycle. Conflating them at the schema
layer is a category error.

**Why an optional schema field, not a new claim kind.** A new claim
kind forces every claim reader to disambiguate "ordinary" versus
"mid-cycle" claims at every read site. An optional pointer field is
additive: readers that do not understand it ignore it; readers that
do understand it branch on its presence. Matches the additive-
extension discipline in PDR-049 and PDR-050.

**Why a value-on-existing-field discriminator on comms-events.**
Strict readers already accept arbitrary discriminator values on the
existing directed-event shape. A new value is the smallest change
that satisfies the protocol; a new event kind would force parser +
renderer + reader-compatibility amendments. The orthogonal schema-
property-addition layer (tags on event kinds) is governed by
PDR-066; the two schema operations sit on different layers.

**Why broadcast retirement at Step 5.** Without the broadcast,
peers reading the comms log later cannot distinguish "agent
retired with handoff" from "agent abandoned the claim". The
broadcast preserves the audit trail.

**Why the receiving agent's acknowledgement (pickup contract item
2) goes to the retired agent's identity.** The retiring agent's
session is gone; the acknowledgement is not for them to read. It is
for the durable audit trail: any future agent reconstructing the
cycle can correlate retirement → acknowledgement → continuation
through the comms-event stream, even if no single agent observed
the whole arc live.

**Trigger to graduate from Proposed to Accepted.** First observed
mid-cycle retirement instance in a rotating-cast Round 1 launch.
The first launch is the controlled stress test. Post-launch
observation captures what worked, what broke, what the protocol
does not yet cover; this PDR moves to Accepted with any refinements
absorbed inline.

## Consequences

### Required

- A first-class handoff-record substrate exists as a peer of the
  other collaboration-state substrates.
- An optional handoff-record-pointer field is added additively to
  the active-claim schema.
- The handoff record's four named sections (current edit state,
  in-flight reasoning, decisions made, decisions deferred) are
  the strict shape; the substrate implementation may enforce a
  formal schema once the first worked instance accumulates.
- A reference example record exists once the first instance lands,
  so future agents have an anchor.
- The `start-right-team` SKILL §Closeout Contract names mid-cycle
  retirement as a distinct closeout mode following this protocol.
- The `start-right-team` SKILL First Moves order extends for
  agents picking up a claim carrying a handoff-record pointer:
  the handoff record is read before any source edit.

### Forbidden

- Mid-cycle retirement without writing a handoff record. The
  retiring agent must complete Step 2 even if it costs the last
  few thousand tokens; the alternative is unbounded state leakage
  for the receiving agent.
- Embedding the handoff record content inline on the claims
  surface. The carriage decision is structural, not stylistic.
- Pushing the 80 % trigger upward to squeeze in one more cycle.
  The trigger threshold may be revisited under empirical evidence;
  individual agents may not move it for their own session.
- Self-declared exhaustion: retiring, handing off, or declining work
  on a budget state that was guessed (conversation length, session
  "feel", a memory heuristic) rather than measured. A budget claim
  needs a measurement or a declared uncertainty (worked instance
  2026-07-08: a seat asserted "does not cover slice 1 with margin"
  from vibes; the owner measured 27 % remaining and ruled "you can do
  a LOT with that").
- Using the mid-cycle handoff discriminator for natural-boundary
  closeouts. A natural-boundary closeout uses the existing
  closeout contract; the mid-cycle discriminator is reserved for
  unnatural retirement so the audit trail remains semantically
  honest.

### Accepted Cost

- An additional context budget (estimated 2–5 k tokens; empirical
  evidence will set the floor) at retirement time spent writing
  the handoff record. The retiring agent must reserve this budget
  before the FIRST measured Step-1 signal can fire — in rotating-cast
  operation that is the ~50 % effectiveness-window start, not only
  the 80 % ceiling; the budget is a fixed cost of
  rotating-cast operation, not waste.
- A new content substrate. Archive discipline is a follow-on once
  a handful of records exist; not specified here because the
  empirical shape of accumulation is not yet known.

## Open questions deferred to first-instance observation

These are explicitly **not** specified by this PDR; they are
recorded so the Round 1 stress-test observer knows what to look
for, and the PDR can absorb the answers when it graduates to
Accepted.

1. **Retirement-budget reserve size.** How many tokens does Step 2
   actually take? The 2–5 k estimate is a guess; empirical
   evidence will set the floor.
2. **Picker contention.** If two agents observe a mid-cycle
   handoff event before either acknowledges, how is the contention
   resolved? (Hypothesis: first-acknowledgement-wins, same as
   singleton-lane coordination in `start-right-team` §1.)
3. **Re-retirement.** If the receiving agent also approaches their
   budget before resolving the open decisions, do they write a
   second handoff record on the same claim, or does the chain
   switch to a new claim with the prior handoff as provenance?
   (Hypothesis: same claim, append a new handoff record under a
   versioned successor; the claim's pointer field updates to the
   latest.)
4. **Coordinator-role handoff.** Is mid-cycle coordinator
   retirement a distinct protocol or a special case of this one?
   PDR-064 (two-distinct-moments coordinator handoff) governs
   the active-acknowledgement boundary; the intersection with
   this PDR's mid-cycle handoff is a join-point that the Round 1
   stress test will exercise.

## Substrate implementation

The repository-specific implementation of this PDR — the handoffs
directory location, the handoff-record JSON schema, the active-
claim schema field name, the comms-event discriminator value, the
landing-tranche plan — lives in an ADR (the phenotype). The PDR
captures the principle (this document); the ADR captures the
repository's concrete realisation of it. See the substrate
implementation ADR referenced from
the host's `practice-index.md` for the current
substrate state.
