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
(memory and state file merge semantics — the active-claims
surface this protocol extends);
[PDR-050](PDR-050-state-memory-substrate-contracts.md)
(state and memory substrate contracts — adds a new substrate
under `.agent/state/collaboration/handoffs/`);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(ten named cures — this PDR is a structural addition adjacent to
cure (iii) stale-claims and cure (viii) worker-side discoveries);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator-handoff two moments — coordinator-role mid-cycle handoff
intersection; join-point at the active-acknowledgement boundary).

## Context

Multi-agent operation in this Practice is moving from human-pace
sessions with natural-boundary closeouts (slice-complete,
commit-landed, peer-closeout) toward rotating-cast operation: a
larger pool of agents, each bounded to ~250k context tokens, with
auto-spawn cadence approaching 10 minutes. Under those conditions a
new and previously unobserved retirement mode becomes routine:

> An agent approaching token budget mid-cycle, mid-edit, possibly
> mid-claim must retire before the natural boundary they were
> heading for.

The existing closeout contract (codified in `start-right-team`
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

The capture trigger for this PDR is the gate-1a delivery addendum's
§"Question 1: Mid-cycle retirement protocol" plus the rotating-cast
operational model the owner has directed toward. Rotating-cast
Round 1 will be the controlled stress test for the protocol; the
PDR exists to give that stress test a structured artefact to
observe against, rather than retro-fitting a protocol from whatever
the first instance happens to produce.

## Decision

Adopt the following five-step mid-cycle retirement protocol. It
fires only when an agent must retire before the natural boundary
they were working toward; natural-boundary closeouts continue to
use the existing `start-right-team` §Closeout Contract unchanged.

### Step 1 — Senses approaching budget

The retiring agent senses approaching budget at either of two
triggers, whichever comes first:

- **Quantitative**: context usage ≥ 80 % of the agent's bounded
  budget (~200k of a 250k cap).
- **Post-commit**: immediately after landing any commit, the agent
  re-evaluates remaining budget against the next-cycle floor (TDD
  authoring + reviewer absorption + gate suite) and retires if the
  remaining budget would not cover one more cycle with margin.

The 80 % quantitative trigger has priority over the post-commit
trigger: an agent at 85 % mid-cycle does not get to "push for one
more commit"; the protocol fires.

### Step 2 — Freezes work-in-progress to a structured handoff record

The retiring agent writes a handoff record to
`.agent/state/collaboration/handoffs/<claim_id>.json`, where
`<claim_id>` is the active claim the agent owns. The handoff
record carries four named sections:

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

The handoff record is a first-class artefact. It is human-readable
JSON (one document per claim, content-addressed by claim_id),
discoverable through the filesystem, replay-able by any future
agent reconstructing the cycle's history, and retained until the
claim closes successfully.

### Step 3 — Extends the active claim

The retiring agent updates their active-claims entry with one new
field:

```json
"handoff_record_path": ".agent/state/collaboration/handoffs/<claim_id>.json"
```

The field is **optional** on the claim schema. Its presence
signals "this claim is mid-cycle and carries a handoff record";
its absence signals normal active-claim semantics. No other
schema field changes; existing readers ignore the new field
without breakage.

### Step 4 — Hands off via directed comms-event

The retiring agent posts a directed comms-event with
`message_kind: "mid-cycle-handoff"` to the receiving agent (or
broadcast to the team if no specific receiver is named, with
`audience` listing the agents in scope). The event body carries:

- the `claim_id` being handed off;
- the `handoff_record_path` pointer;
- a one-paragraph human summary (≤ 200 words) of where the work
  is and what the next agent must do first;
- the retiring agent's name + session prefix (per PDR-027
  identity discipline) so the receiving agent knows who to credit
  for the handoff.

The comms-event schema is unchanged; `mid-cycle-handoff` becomes a
new `message_kind` value on the existing directed event shape.

### Step 5 — Retires

The retiring agent posts a final retirement broadcast (existing
team-cadence shape, no new event kind required) naming the
handed-off claim and the receiving agent (if known) so the team
sees the retirement is not abandonment. The agent then ends their
session.

### Receiving agent's pickup contract

A receiving agent picking up a claim with `handoff_record_path`
set:

1. Reads the handoff record before any source edit or comms post.
2. Posts a directed acknowledgement event back to the retiring
   agent's identity (the comms record persists even after the
   retiring agent's session ends; the acknowledgement is for the
   audit trail, not for the retired agent to read).
3. Updates the active-claims entry with their own identity in
   the `agent_id` block; clears the `handoff_record_path` field
   only when they decide the cycle has resumed on a natural
   footing and no further handoff is currently pending.
4. Proceeds with the cycle, treating Step 2's "decisions made" as
   committed and "decisions deferred" as the open work surface.

### Handoff-record carriage decision

The handoff record is carried as a separate file under
`.agent/state/collaboration/handoffs/` rather than inline on the
active-claims entry. Inline carriage was rejected because:

- The claims surface is meant to stay compact (10 KB envelope
  per existing convention); attaching a multi-section reasoning
  payload to every mid-cycle claim would bloat the surface against
  its design.
- A handoff record is a first-class content artefact (replay-able,
  citable, discoverable); embedding it in operational state
  conflates content boundaries with operational boundaries at the
  wrong layer.
- File-per-handoff aligns with the existing PDR / ADR / plan
  convention (file-per-decision, content-addressed by name).

## Rationale

**Why a protocol, not just a guideline.** Mid-cycle retirement
under token pressure is structurally different from natural-
boundary closeout. Without explicit steps, agents under pressure
will default to either rushing (atomic-landing breach) or stopping
silently (state leakage). A protocol that an agent can follow
under cognitive pressure is the structural cure; a guideline that
asks an agent to "think clearly while almost out of context" is
not.

**Why file-per-handoff, not inline on claims.** See "Handoff-record
carriage decision" above. The summary: claims are operational
state with a small-envelope discipline; handoff records are content
artefacts with their own lifecycle. Conflating them at the schema
layer would be a category error.

**Why an optional schema field, not a new claim kind.** A new claim
kind would force all claim readers to disambiguate "ordinary"
versus "mid-cycle" claims at every read site. An optional
`handoff_record_path` field is additive: readers that do not
understand it ignore it; readers that do understand it can branch
on its presence. This matches the additive-extension discipline in
PDR-049 and PDR-050.

**Why a new comms-event `message_kind`, not a schema amendment.**
The existing comms-event schema's directed shape carries a
`message_kind` sub-discriminator with examples listed in the
schema docstring (`session-handoff-summary`, `coordination-notice`,
`sidebar-request`). Adding `mid-cycle-handoff` is a new value on
an existing field, not a structural amendment. Strict readers
already accept arbitrary `message_kind` strings. The orthogonal
schema-property-addition layer (new optional `tags` array on
event kinds) is governed by [PDR-066](PDR-066-comms-events-as-failure-mode-channel.md);
the two schema operations sit on different layers and land on
separate commits in the order that PDR specifies.

**Why broadcast retirement at Step 5.** Without the broadcast,
peers reading the comms log later cannot distinguish "agent
retired with handoff" from "agent abandoned the claim". The
broadcast preserves the audit trail.

**Why the receiving-agent's acknowledgement (Step 4 pickup contract
item 2) goes to the retired agent's identity.** The retiring
agent's session is gone; the acknowledgement is not for them to
read. It is for the durable audit trail: any future agent
reconstructing the cycle can correlate retirement → acknowledgement
→ continuation through the comms-event stream, even if no single
agent observed the whole arc live.

**Trigger to graduate from Proposed to Accepted.** First observed
mid-cycle retirement instance in a rotating-cast Round 1 launch.
The first launch will deliberately stress-test this protocol via
mid-round coordinator retirement per the gate-1a delivery
addendum. The post-launch observation captures what worked, what
broke, what the protocol does not yet cover; the PDR moves to
Accepted with any refinements absorbed inline.

## Consequences

### Required

- A new directory `.agent/state/collaboration/handoffs/` exists
  as a first-class collaboration-state substrate (peer of
  `comms/`, `comms-seen/`, `conversations/`, `escalations/`).
- A new optional field `handoff_record_path` is added to the
  active-claims schema (`active-claims.schema.json`) on a
  separate commit, not as part of this PDR's landing.
- A new schema for handoff records
  (`.agent/state/collaboration/handoff-record.schema.json`)
  defines the four named sections (current edit state, in-flight
  reasoning, decisions made, decisions deferred) as a strict
  shape, also on a separate commit.
- The `start-right-team` SKILL §Closeout Contract adds a
  subsection naming mid-cycle retirement as a distinct closeout
  mode that follows this protocol instead of the natural-boundary
  contract.
- The `start-right-team` SKILL First Moves order is extended for
  agents picking up claims with `handoff_record_path` set: the
  handoff record is read before any source edit (peer of
  reading the thread record and current plan body).
- A reference example handoff record (anonymised, drawn from the
  first observed instance once Round 1 lands) lives at
  `.agent/state/collaboration/handoffs/EXAMPLE.json` so future
  agents have a worked instance to anchor on.

### Forbidden

- Mid-cycle retirement without writing a handoff record (the
  retiring agent must complete Step 2 even if it costs the last
  few thousand tokens; the alternative is unbounded state leakage
  for the receiving agent).
- Embedding the handoff record content inline in the claims
  surface (the carriage decision is structural, not stylistic).
- Pushing the 80 % trigger upward to squeeze in one more cycle.
  The trigger threshold may be revisited under empirical
  evidence; individual agents may not move it for their own
  session.
- Using `mid-cycle-handoff` for natural-boundary closeouts. A
  natural-boundary closeout uses the existing closeout contract;
  the `mid-cycle-handoff` message_kind is reserved for unnatural
  retirement so the audit trail remains semantically honest.

### Accepted Cost

- An additional ~2–5k tokens at retirement time spent writing the
  handoff record. The retiring agent must reserve this budget
  before the 80 % trigger fires; the budget is a fixed cost of
  rotating-cast operation, not waste.
- A new directory and new schema file in the collaboration-state
  substrate; new readers must understand the directory's purpose
  and the schema's shape. The cost is amortised by the
  rotating-cast operation it enables.
- Handoff records accumulate under `.agent/state/collaboration/
  handoffs/` over time. Archive discipline (likely an
  `archive/` subdirectory keyed by claim-close date) is a
  follow-on once a handful of records exist; not specified here
  because the empirical shape of accumulation is not yet known.

## Open questions deferred to first-instance observation

These are explicitly **not** specified by this PDR; they are
recorded so the Round 1 stress-test observer knows what to look
for, and the PDR can absorb the answers when it graduates to
Accepted:

1. **Retirement-budget reserve size.** How many tokens does Step 2
   actually take? The 2–5 k estimate is a guess; empirical
   evidence will set the floor.
2. **Picker contention.** If two agents observe a mid-cycle-
   handoff event before either acknowledges, how is the
   contention resolved? (Hypothesis: first-acknowledgement-wins,
   same as singleton-lane coordination in `start-right-team`
   §1.)
3. **Re-retirement.** If the receiving agent also approaches their
   budget before resolving the open decisions, do they write a
   second handoff record on the same claim_id, or does the
   chain switch to a new claim with the prior handoff as
   provenance? (Hypothesis: same claim, append a new handoff
   record under a versioned filename; the claim's
   `handoff_record_path` updates to the latest.)
4. **Coordinator-role handoff.** Is mid-cycle coordinator
   retirement a distinct protocol or a special case of this one?
   PDR-064 (two-distinct-moments coordinator handoff) governs
   the active-acknowledgement boundary; the intersection with
   this PDR's mid-cycle handoff is a join-point that the Round 1
   stress test will exercise.
