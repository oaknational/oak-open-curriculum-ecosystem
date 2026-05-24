---
pdr_kind: governance
---

# PDR-063: Mid-Cycle Retirement Protocol for Token-Bounded Agents

**Status**: Proposed
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
[`practice-index.md`](../practice-index.md) (substrate-implementation
ADR carrying the repo-specific phenotype of this PDR).

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
they were working toward; natural-boundary closeouts continue to
use the existing `start-right-team` §Closeout Contract unchanged.

### Step 1 — Sense approaching budget

The retiring agent senses approaching budget at either of two
triggers, whichever comes first:

- **Quantitative**: context usage ≥ 80 % of the agent's bounded
  budget.
- **Post-commit**: immediately after landing any commit, the agent
  re-evaluates remaining budget against the next-cycle floor (TDD
  authoring + reviewer absorption + gate suite) and retires if the
  remaining budget would not cover one more cycle with margin.

The 80 % quantitative trigger has priority over the post-commit
trigger: an agent at 85 % mid-cycle does not get to "push for one
more commit"; the protocol fires.

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
- Using the mid-cycle handoff discriminator for natural-boundary
  closeouts. A natural-boundary closeout uses the existing
  closeout contract; the mid-cycle discriminator is reserved for
  unnatural retirement so the audit trail remains semantically
  honest.

### Accepted Cost

- An additional context budget (estimated 2–5 k tokens; empirical
  evidence will set the floor) at retirement time spent writing
  the handoff record. The retiring agent must reserve this budget
  before the 80 % trigger fires; the budget is a fixed cost of
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
[`practice-index.md`](../practice-index.md) for the current
substrate state.
