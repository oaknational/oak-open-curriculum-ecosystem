---
pdr_kind: governance
---

# PDR-063: Mid-Cycle Retirement Protocol for Token-Bounded Agents

**Status**: Proposed (amended 2026-07-08 — §Retirement authority +
§Deliberate succession, owner rulings; amended 2026-07-13 — signal
model, observable floor, executable bounds, transport exception;
amended 2026-09-25 — context readings never stop a seat, owner word;
the owner starts every handoff)
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
(liveness-heartbeat contract — PDR-078 detects a silent retirement;
an owner-called handoff of a heartbeat-emitting role uses this PDR's
per-cycle handoff substrate);
the host estate's practice index (the substrate-implementation
ADR carrying the repo-specific phenotype of this PDR lives behind it;
Core cites hosts by role, never by path, per PDR-105).

## Context

Multi-agent operation in this Practice runs many seats at once, and
the owner sometimes hands a seat's work to a successor before the
natural boundary it was heading for: mid-cycle, mid-edit, possibly
mid-claim. (When this PDR was written, a seat nearing its context
budget retired this way. Since 2026-09-25 no context reading starts
a handoff: §Context readings never stop a seat.)

The existing closeout contract (codified in the `start-right-team`
SKILL §Closeout Contract) only governs natural-boundary closeouts.
A handoff at an unnatural boundary has two failure paths the
closeout contract cannot prevent:

1. **Indeterminate-state leakage**: the agent retires without
   leaving the next agent a structured view of where the work
   actually was — which files are open and at what state, what
   analysis was in flight, what decisions are settled, what is
   still owed. The next agent rediscovers state by re-reading
   artefacts and inferring, which is expensive and lossy.

2. **Rushed-landing breaches atomic-landing**: the handing-off agent
   tries to force a commit at an unsafe point before it hands over,
   which either breaks the atomic-landing invariant (tests and
   product code split across commits) or skips reviewer absorption
   to make it.

The capture trigger for this PDR is the rotating-cast operational
model: the first rotating-cast Round 1 launch will be the controlled
stress test for the protocol. The PDR exists to give that stress
test a structured artefact to observe against, rather than retro-
fitting a protocol from whatever the first instance happens to
produce.

## Decision

Adopt the following five-step protocol for handing in-flight work
to a successor before the natural boundary it was heading for. The
owner starts every handoff a live seat makes (§Deliberate succession
below); no context reading starts one (§Context readings never stop a
seat, next). A seat gone silent is recovered under PDR-078 §3.
Natural-boundary closeouts continue to use the existing
`start-right-team` §Closeout Contract unchanged.

### Context readings never stop a seat (owner word, 2026-09-25)

The owner, to every seat, verbatim: "ALL seats need to STOP stopping
mid session because of some ambiguous and made up "rules" about
context. ALL you have achieved is stopping. Prepare for compaction
then stop".

- No context reading stops a seat, hands its work over or starts a
  succession. A seat works through every threshold.
- A seat keeps its records current as it goes (its continuity record,
  its napkin, its claims), so that a compaction can land at any moment
  and lose nothing.
- When the owner calls a compaction, the seat runs the compaction
  drill: records committed, processes stopped, claims kept, "ready for
  compaction" said; then it stops, and the same session resumes on the
  owner's word.
- When the platform compacts, there is no drill: the records kept
  current stand in for it. On the far side the seat re-arms its
  processes and carries on without waiting.
- After either compaction the seat keeps its claims and runs the
  §Discontinuity-boundary validation step below against its own
  continuity record before any source edit. A compaction keeps the
  seat: it has no successor and no claim adoption.
- A seat reports its context reading as information when asked, and
  reads it unasked only for PDR-052's check. PDR-052's floor for
  directive-file edits defers that one kind of edit until after the
  next compaction; the seat carries on with other work meanwhile.

**Effectiveness calibration** (owner-taught 2026-06-28/29; an
approximate heuristic per model, recalibrated by observation, not a
constant). Effectiveness against context consumed is non-linear, a
decreasing sigmoid. Owner calibration for Opus 4.8 1M: peak ~40–45 %,
past peak from ~50 %, mistake-odds rise ~65 %, degraded (slows, makes
strange decisions) ~80 %. Read a reading against this curve, measured (transcript usage
against the actual window), never confabulated. Its one use is to keep
the records more current as the curve falls.

### Step 1 — The owner calls the handoff

The owner calls the handoff of a seat's in-flight work to a successor
(§Deliberate succession). The seat never starts one itself
(§Context readings never stop a seat).

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
2026-07-2x).** A RISING error class of
confabulated specifics — details asserted from compressed memory that the
record contradicts (the instance included a fabricated-bot-identity commit
attribution) — after a long tenure (~a week, two compactions in the
instance) is itself grounds to surface for deliberate succession: the seat's
compressed context is now generating false precision, and no amount of
care inside the same context cures it. Surface the observed error class;
the owner calls the succession.

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

### Retirement authority — the owner calls every handoff (owner rulings 2026-07-08; owner word 2026-09-25)

1. **No self-declared exhaustion, ever.** An agent never retires,
   hands off or declines work on its context budget, measured or
   guessed (§Context readings never stop a seat). The one thing a
   reading orders is when a directive-file edit runs (PDR-052).
2. **The OWNER calls every handoff a live seat makes.** A seat's
   context reading is information for the owner, never a request to
   hand over. A standing owner naming of a successor (PDR-064
   §Standing-successor authorisation) is the owner's call.
3. **No live recipient: the pending-handoff broadcast** (the transport
   exception, 2026-07-13). The claim
   retains `handoff_record_path`, and Step 4's directed
   `mid-cycle-handoff` event (schema-required point-to-point with a
   `to` recipient) is sent when a live recipient, a successor or a
   coordinator, exists. When neither exists at the owner-called
   handoff, Step 4 takes the no-recipient variant: a BROADCAST
   narrative comms event announcing the PENDING handoff and the record
   path (broadcasts carry no `to`, so no schema violation), plus an
   out-of-band owner notification where the platform provides one, so
   that an owner who stepped away after the call sees the record path
   (a host-phenotype concern; each estate names its mechanism). The
   successor later picks up via claim ADOPTION (the §Deliberate
   succession in-flight substrate), which needs no directed event from
   the departed seat. The seat closes cleanly; successor instantiation
   then follows ruling 4 from the record.
4. **Successor instantiation is owner-mediated until session-spawn
   automation exists** (the owner's named automation gap: "yes to
   automated handoff, however we have no way of automatically
   starting new sessions, yet"). This section is deliberately
   mechanism-agnostic: the Step 2 handoff-record contract is the
   stable interface any future spawner consumes; spawner-command
   work precedes any editor-plugin route (owner sequencing ruling,
   same day).

### Deliberate succession — the in-flight discriminator (amendments 2026-07-08 and 2026-09-25)

Every succession of a live seat is deliberate: the owner's call
starts it, and it may occur mid-cycle or at rest. It takes one of two shapes, and the
shape discriminator is whether state is IN-FLIGHT:

- **In-flight state exists** (open cycle, live claim, uncommitted
  decisions): the five steps above carry the succession, and the
  predecessor's handoff record and claim transfer to the successor by
  claim ADOPTION (worked instances at the peer estate: the 2026-07-07
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
A lane waiting on a peer needs the same release condition, and a hold
with no default is a stall waiting to happen (two retained claims waited
on a silent partner with no release condition until a handoff record
proposed one, 2026-09-25).
The compaction drill (§Context readings never stop a seat) is a cold
pause whose resume trigger is the owner's word.
The freeze premise "monitors stay live" is falsifiable by the platform
after the fact — resumers and successors verify monitor-backed
obligations first-hand.

### Handover timing — naming a successor starts the clock (owner-taught 2026-06-28)

**The owner's call starts the handover, and naming a successor starts its
clock; the predecessor DRIVES it to completion at a timing it chooses.**
Once the owner has called it and a successor is named, the handover has
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
classic PDR-063 case), compaction-boundary self-resumption (your own
continuity record stands in for the handoff record, and the validation
outcome goes into it), and post-crash recovery.

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

**Why a protocol, not just a guideline.** A mid-cycle handoff is
structurally different from natural-boundary closeout. Without
explicit steps, a handing-off agent defaults to either rushing
(atomic-landing breach) or stopping silently (state leakage). A
protocol the agent can follow step by step is the structural cure.

**Why the seat carries on through a compaction.** A compaction keeps
the seat, its lane and its claims, and the work resumes in the same
session; a successor's grounding is spent only when the owner calls a
handoff (§Context readings never stop a seat).

**Why a separate content artefact, not inline on claims.** See
"Handoff-record carriage decision" above. Claims are operational
state with a small-envelope discipline; handoff records are content
artefacts with their own lifecycle. Conflating them at the schema
layer is a category error.

**Why an optional schema field, not a new claim kind.** A new claim
kind forces every claim reader to disambiguate "ordinary" versus
"mid-cycle" claims at every read site. An optional pointer field lets
readers that understand it branch on its presence without that
forced disambiguation. (Corrected 2026-08-02: the "additive-extension
discipline in PDR-049 and PDR-050" originally cited here was a
phantom citation; PDR-050 §Latest-schema-version-only governs.)

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
3) goes to the retired agent's identity.** The retiring agent's
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

- A mid-cycle handoff without a handoff record. The handing-off
  agent completes Step 2 before Step 5; the alternative is unbounded
  state leakage for the receiving agent.
- Embedding the handoff record content inline on the claims
  surface. The carriage decision is structural, not stylistic.
- Stopping, handing off, retiring or declining work on a context
  budget, measured or guessed (§Context readings never stop a seat).
  The one thing a reading orders is when a directive-file edit runs
  (PDR-052). Worked instance, 2026-07-08: a seat asserted "does not
  cover slice 1 with margin" from vibes; the owner measured 27 %
  remaining and ruled "you can do a LOT with that".
- Using the mid-cycle handoff discriminator for natural-boundary
  closeouts. A natural-boundary closeout uses the existing
  closeout contract; the mid-cycle discriminator is reserved for
  unnatural retirement so the audit trail remains semantically
  honest.

### Accepted Cost

- An additional context cost (estimated 2–5 k tokens; empirical
  evidence will set the figure) at handoff time spent writing the
  handoff record. Records kept current as the work goes
  (§Context readings never stop a seat) keep it small.
- A new content substrate. Archive discipline is a follow-on once
  a handful of records exist; not specified here because the
  empirical shape of accumulation is not yet known.

## Open questions deferred to first-instance observation

These are explicitly **not** specified by this PDR; they are
recorded so the Round 1 stress-test observer knows what to look
for, and the PDR can absorb the answers when it graduates to
Accepted.

1. **Handoff-record cost.** How many tokens does Step 2 actually
   take? The 2–5 k estimate is a guess; empirical evidence will set
   the figure.
2. **Picker contention.** If two agents observe a mid-cycle
   handoff event before either acknowledges, how is the contention
   resolved? (Hypothesis: first-acknowledgement-wins, same as
   singleton-lane coordination in `start-right-team` §1.)
3. **Re-handoff.** If the owner hands the receiving agent's work on
   again before the open decisions resolve, does that agent write a
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
