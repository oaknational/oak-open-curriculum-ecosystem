---
pdr_kind: governance
---

# PDR-066: Comms-Events as Real-Time Failure-Mode Capture Channel

**Status**: Proposed
**Date**: 2026-05-22
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture, distil, graduate, enforce — this PDR formalises the
*capture* stage's real-time vehicle for failure-mode substance);
[PDR-048](PDR-048-insight-capture-at-moment-of-occurrence.md)
(insight capture at moment of occurrence — the substance is the
same; the channel moves from napkin to comms-event for the
rotating-cast operational mode);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(ten named cures — cure (viii) worker-side empirical discoveries
do not propagate is the failure surface this PDR addresses);
[PDR-063](PDR-063-mid-cycle-retirement-protocol.md)
(mid-cycle retirement protocol — coupled: retirement events under
rotation are exactly the moments where in-flight failure modes
must be visible to the next agent during their session).

## Context

The Practice's current capture vehicle for failure modes (verdict
walk-backs, backtick incidents, shell-quoting hazards, audit-shaped
tests, premature optimisation reflexes) is the active napkin file
`.agent/memory/active/napkin.md`. Capture happens primarily at
session close: the retiring agent consolidates the session's
substantive surprises and corrections into napkin entries, which
are then distilled into `distilled.md` at consolidation cadence
and graduated to PDRs / rules / patterns as substance warrants
(PDR-014's capture → distil → graduate → enforce pipeline).

This vehicle is correct for human-pace sessions where session
close is the natural absorption point. It is structurally
insufficient under **rotating-cast operation** (multiple agents
spawned at ~10-minute cadence against a 250k-token-per-agent
budget) because:

1. **The napkin lives in the authoring agent's context.** Until
   the agent writes it at session close, the substance is
   invisible to peers and to the next coordinator.
2. **Session close is the wrong cadence.** Failure modes
   discovered at minute 5 of a 30-minute session sit dormant for
   25 minutes before any peer can pick them up. Under rotating-
   cast, the *next* coordinator may already be running, paying
   the cost of the same failure mode their predecessor already
   diagnosed.
3. **The napkin is a single-author surface.** Two agents
   diagnosing the same failure mode in parallel sessions both
   write near-duplicate napkin entries that consolidate to one
   distilled rule — the diagnostic redundancy is wasteful and
   the consolidation lag is operationally costly.

The all-channels comms watcher (mandated by `start-right-team`
SKILL §0) gives every team agent a real-time event stream they
already monitor. Surfacing failure modes as comms-events makes
them visible to the next coordinator's watcher *during the next
coordinator's session*, not at the prior coordinator's close.

The capture trigger for this PDR is the gate-1a delivery
addendum's §"Question 4: Comms-events as the failure-mode
capture channel" plus the all-channels-watcher-non-negotiable
discipline already in `start-right-team` (which was implicit
infrastructure for this protocol but did not yet name failure-
mode capture as a load-bearing use case).

## Decision

Adopt the comms-event stream as the **durable real-time channel
for failure-mode capture** under any team session running under
the all-channels watcher discipline. The session-close napkin
becomes the *consolidation* surface for real-time events, not the
first capture.

### What gets surfaced in real time

A failure-mode comms-event is posted whenever an agent observes,
recognises, or self-corrects on a substantive failure mode whose
substance another agent would want to know during their session.
Concrete classes:

- **Verdict walk-backs**: the agent stated a verdict, then revised
  it on contact with evidence. The next agent benefits from
  knowing the original verdict was wrong, not just the corrected
  one.
- **Shell-quoting / tool-shape hazards**: a tool invocation that
  appears safe but exhibits a hidden defect (e.g. silent
  truncation, unescaped substitution, race against background
  state).
- **Premature-optimisation reflex saves**: the agent caught
  themselves reaching for an abstraction the current
  requirements don't justify; the corrected shape and the
  diagnostic carry forward.
- **Audit-shaped test catches**: the agent caught themselves
  authoring a test that asserts on implementation rather than
  describing system state; the substance of the catch is useful
  to peers.
- **Reviewer dispatch surprises**: a reviewer returned a verdict
  whose shape the agent did not anticipate; subsequent
  reviewer briefs benefit from the surprise being on the
  stream.
- **Coordination-protocol gaps**: an instance where the existing
  start-right-team / commit / claim discipline did not cover
  the situation cleanly; peers benefit from being warned the
  gap exists before they hit it themselves.

### What does *not* get surfaced in real time

- Routine substance that fits naturally in the existing event
  shapes (team-start, claim-open, claim-close, decision-points,
  reviewer dispatch reports) — those events carry their own
  substance and do not need a parallel failure-mode event.
- Mechanical corrections (typo, wrong file path, retry after a
  transient error) where no doctrine surface is implicated.
- Self-doubt without a substantive correction (the agent
  reconsidered and arrived at the same answer). The stream is
  for substance, not deliberation.

### Event shape — tag-based discrimination

Real-time failure-mode events use the existing `narrative` comms-
event kind with a clear tag on the first line of the body. The
tag-set:

- `[FAILURE-MODE]` — substantive failure mode worth surfacing.
- `[BEHAVIOUR-NOTE]` — a softer category: a noticed behavioural
  pattern that is not yet a failure mode but is worth the next
  agent's attention (e.g. *"the X reviewer is currently
  returning Y verdicts when Z is in scope; reshape briefs
  accordingly"*).

The watch CLI (`pnpm agent-tools:collaboration-state -- comms
watch`) renders the existing `[BROADCAST] / [GROUP] / [DIRECTED]
/ [LIFECYCLE]` discriminator tags on the first line of each
event, derived from the event's structural shape. Failure-mode
tags compose with those discriminators: a failure-mode broadcast
renders as *"[BROADCAST] [FAILURE-MODE]..."*; a directed failure-
mode note renders as *"[DIRECTED] [FAILURE-MODE]..."*.

### Event body conventions

A failure-mode event body carries four short sections:

1. **Observation** — what happened. Concrete, citable, terse.
2. **Diagnosis** — what the substance of the failure was.
3. **Cure** (if known) — what the corrected shape looks like, or
   the structural change that would prevent recurrence.
4. **Pointer** — link to or quote from any artefact that should
   absorb this substance (a doctrine surface, a SKILL, a rule,
   an open plan section, a pending-graduations entry).

The body stays small enough that a watcher reading it inline
absorbs the substance in one read pass. A failure-mode event
that needs more than ~300 words probably belongs in a focused
sidebar conversation, not a single broadcast.

### Schema migration shape

The comms-event schema requires extension to recognise the new
tag-set, but the extension is **additive and backward-compatible**:

- A new optional top-level field `tags` is added to the
  `narrative`, `lifecycle`, and `directed` definitions (each).
  The field is an array of short string tags (`"failure-mode"`,
  `"behaviour-note"`, future tags).
- The field is **optional**. Existing events that lack `tags`
  continue to validate; new events that carry `tags` carry the
  semantic discriminator.
- The `additionalProperties: false` constraint on existing
  definitions is preserved; only the explicit new field is
  added.
- The CLI `comms watch` rendering reads the `tags` array and
  prefixes the first body line with `[FAILURE-MODE]` /
  `[BEHAVIOUR-NOTE]` when present. Events without `tags` render
  unchanged.

**No backfill is required.** Existing events without the field
are valid against the migrated schema; future events choose
whether to carry the field per the discrimination shape above.
The schema migration is a one-shot edit landed on its own commit
after this PDR is owner-approved, independent of any data
migration.

#### Migration sequence

Although the schema extension is additive, the deployment order
matters because `additionalProperties: false` strict readers
reject unknown fields. The sequence:

1. **Schema-amendment commit lands first.** The
   `comms-event.schema.json` edit adding the optional `tags`
   array property on the three event kinds is committed and
   merged. Strict readers loading the new schema now accept
   events with or without `tags`.
2. **CLI watcher rendering update lands in the same commit or
   the immediately following commit.** The watch CLI is updated
   to render `[FAILURE-MODE]` / `[BEHAVIOUR-NOTE]` prefixes when
   `tags` is present.
3. **Only after both land, events with `tags` begin being
   written.** Writing tagged events before step 1 lands would
   produce events that fail validation against the still-old
   schema for any reader on the old schema; writing tagged
   events before step 2 lands would produce events the watcher
   does not render with the new prefix.

This order preserves correctness for both old-and-new readers
and old-and-new writers across the migration window.

### Coupling with PDR-063 (mid-cycle retirement)

When an agent retires mid-cycle (PDR-063), the structured
handoff record's "in-flight reasoning" section is the natural
home for failure modes the retiring agent has accumulated in
their session. The retiring agent additionally posts any
already-surfaced failure-mode events as references in the
handoff record (event id pointer); fresh failure modes
discovered at retirement time are surfaced as new failure-mode
events first, then referenced in the handoff record.

The two surfaces are complementary: failure-mode events are the
real-time stream; the handoff record's reasoning section is the
consolidated view at retirement.

## Rationale

**Why comms-events, not napkin.** The all-channels watcher
discipline (mandated by `start-right-team` SKILL §0) is the
existing real-time substrate every team agent monitors. Adding
a parallel real-time substrate would fragment the team's
attention; reusing the comms stream amortises the watcher cost
already paid.

**Why tags on `narrative`, not a new event kind.** A new event
kind would require parser amendment, renderer amendment, reader
compatibility, and a schema migration with a discriminator value.
The narrative kind already carries title + body + audience; tags
on the existing kind add the discriminator without restructuring.
The migration sequence above (§"Migration sequence") makes the
additive extension safe under `additionalProperties: false`:
strict readers reject unknown fields, so the schema amendment
declaring `tags` as a new optional property must land before
any event is written with the field. Once the schema declares
`tags`, strict readers accept events with or without it.

**Why two tags (`failure-mode`, `behaviour-note`), not one.** The
boundary between "substantive failure that requires a doctrine
update" and "behaviour pattern worth noting" is empirically
fuzzy. Tag separation preserves the substance distinction (and
the consolidation flow at session close routes them differently)
without forcing the authoring agent to pre-commit to which
category a single observation belongs to.

**Why no backfill.** Existing failure modes captured in napkin
entries are already in their consolidation home. Re-creating them
as historical comms-events would inflate the comms substrate
without operational benefit (no one is going to "watch" historical
failure modes; they are doctrine inputs, not real-time signals).
The migration is forward-only.

**Why the session-close napkin remains.** The napkin retains two
roles after this PDR lands: (a) the consolidation surface for the
session's failure-mode comms-events (the retiring agent reads
their own session's failure-mode events and writes the integrated
view at close, which then graduates per PDR-014); (b) the capture
surface for non-team or solo-session work where the comms
watcher is not the natural channel. The napkin is not deprecated;
its role is narrowed.

**Trigger to graduate from Proposed to Accepted.** Second observed
real-time failure-mode comms-event posted in a session distinct
from this PDR's drafting session, OR owner-direction graduation.
The rotating-cast Round 1 launch will trivially exercise the
second-instance criterion; the PDR moves to Accepted with any
refinements absorbed from the second instance.

## Consequences

### Required

- The comms-event schema (`comms-event.schema.json`) is extended
  with an optional `tags` array field on each of the
  `narrative`, `lifecycle`, and `directed` definitions. The
  extension lands on its own commit after this PDR is
  owner-approved.
- The watch CLI (`pnpm agent-tools:collaboration-state -- comms
  watch`) is updated to render `[FAILURE-MODE]` / `[BEHAVIOUR-
  NOTE]` tags on the first body line when present. The
  rendering update lands in the same commit as the schema
  extension or the immediately following commit.
- The `start-right-team` SKILL adds a §"Real-time failure-mode
  capture" subsection (or extends an existing closeout-related
  subsection) naming this PDR as the governing protocol.
- The closeout napkin discipline is updated: agents at session
  close read their own session's failure-mode events from the
  comms substrate and consolidate them into napkin / distilled
  entries as appropriate, rather than capturing fresh.

### Forbidden

- Using failure-mode events for routine substance that fits an
  existing event shape. The discrimination is a substance
  judgement; tag-flood would dilute the channel.
- Posting failure-mode events without the four-section body
  convention (Observation / Diagnosis / Cure / Pointer). The
  convention is the contract that makes the channel scannable.
- Embedding failure-mode substance only in the napkin during
  team sessions running under the all-channels watcher
  discipline. The napkin is the consolidation surface, not the
  first capture.

### Accepted Cost

- Additional comms-event volume during team sessions. Each
  failure-mode event is a few hundred bytes; the all-channels
  watcher's self-exclusion discipline (`comms-watch-mechanism.md`)
  already handles peer-of-self filtering, so additional volume
  does not directly inflate any single agent's notification
  load beyond their already-paid watcher subscription.
- A new substance-judgement cost on every agent: *"is this
  observation substantive enough to surface, or is it
  routine?"*. The cost is small (the four-section body shape is
  a forcing function: if you cannot fill it, the substance is
  probably routine).
- One commit of schema work + one commit of CLI work after this
  PDR lands. The cost is amortised by the operational benefit
  it unlocks.

## Open questions deferred to second-instance observation

1. **Tag namespace boundaries.** Are `failure-mode` and
   `behaviour-note` sufficient, or will rotating-cast operation
   surface a third tag (e.g. `protocol-gap`, `coordination-
   surprise`, `reviewer-drift`)? The first PDR-Accepted refresh
   may add tags; the boundary should stay small.
2. **Cross-session failure-mode threading.** When a failure mode
   recurs in a later session, does the new event reference the
   prior one via `in_response_to`, or stand alone? (Hypothesis:
   reference the prior one when the substance is *the same
   failure recurring*; stand alone when the substance is a
   *new failure with similar shape*.)
3. **Consolidation cadence under rotation.** The PDR-014 capture
   → distil flow assumes session close. Under rotation, who
   distils failure-mode events whose authoring agent has
   retired? (Hypothesis: the next coordinator running an active
   consolidation window absorbs them on the same cadence as
   their own session's events, treating prior agents' events
   as inputs.)
4. **Tag fitness pressure.** As the substrate accumulates,
   does the tag-set need fitness pressure (deletion / archival
   / decay)? Or does the natural per-PDR consolidation cadence
   sufficiently graduate substantive failure modes out of the
   live stream? First-launch observation will inform.
