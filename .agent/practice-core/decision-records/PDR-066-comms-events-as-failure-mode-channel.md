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
same; the channel moves from the consolidation surface to the
real-time event stream for the rotating-cast operational mode);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(ten named cures — cure (viii) worker-side empirical discoveries
do not propagate is the failure surface this PDR addresses);
[PDR-063](PDR-063-mid-cycle-retirement-protocol.md)
(mid-cycle retirement protocol — coupled: retirement events under
rotation are exactly the moments where in-flight failure modes
must be visible to the next agent during their session);
[`practice-index.md`](../practice-index.md) (substrate-implementation
ADR carrying the repo-specific phenotype of this PDR).

## Context

The Practice's current capture vehicle for failure modes (verdict
walk-backs, shell-quoting hazards, audit-shaped tests, premature-
optimisation reflexes, reviewer-dispatch surprises, coordination-
protocol gaps) is the active consolidation surface. Capture happens
primarily at session close: the retiring agent consolidates the
session's substantive surprises and corrections into capture
entries, which are then distilled at consolidation cadence and
graduated to decision records / rules / patterns as substance
warrants (PDR-014's capture → distil → graduate → enforce
pipeline).

This vehicle is correct for human-pace sessions where session
close is the natural absorption point. It is structurally
insufficient under **rotating-cast operation** (multiple agents
spawned against a bounded per-agent context budget) because:

1. **The consolidation surface lives in the authoring agent's
   context.** Until the agent writes it at session close, the
   substance is invisible to peers and to the next coordinator.
2. **Session close is the wrong cadence.** Failure modes
   discovered at minute 5 of a 30-minute session sit dormant for
   25 minutes before any peer can pick them up. Under rotating-
   cast, the *next* coordinator may already be running, paying
   the cost of the same failure mode their predecessor already
   diagnosed.
3. **The consolidation surface is a single-author surface.** Two
   agents diagnosing the same failure mode in parallel sessions
   both write near-duplicate entries that consolidate to one
   distilled rule — the diagnostic redundancy is wasteful and the
   consolidation lag is operationally costly.

The all-channels comms watcher (mandated by `start-right-team`
SKILL §0) gives every team agent a real-time event stream they
already monitor. Surfacing failure modes as comms-events makes
them visible to the next coordinator's watcher *during the next
coordinator's session*, not at the prior coordinator's close.

The capture trigger for this PDR is the rotating-cast operational
model plus the all-channels-watcher-non-negotiable discipline
already in `start-right-team` (which is implicit infrastructure
for this protocol but does not yet name failure-mode capture as a
load-bearing use case).

## Decision

Adopt the comms-event stream as the **durable real-time channel
for failure-mode capture** under any team session running under
the all-channels watcher discipline. The session-close
consolidation surface becomes the *consolidation* destination for
real-time events, not the first capture.

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
  appears safe but exhibits a hidden defect (silent truncation,
  unescaped substitution, race against background state).
- **Premature-optimisation reflex saves**: the agent caught
  themselves reaching for an abstraction the current requirements
  do not justify; the corrected shape and the diagnostic carry
  forward.
- **Audit-shaped test catches**: the agent caught themselves
  authoring a test that asserts on implementation rather than
  describing system state; the substance of the catch is useful
  to peers.
- **Reviewer dispatch surprises**: a reviewer returned a verdict
  whose shape the agent did not anticipate; subsequent reviewer
  briefs benefit from the surprise being on the stream.
- **Coordination-protocol gaps**: an instance where the existing
  team-start / commit / claim discipline did not cover the
  situation cleanly; peers benefit from being warned the gap
  exists before they hit it themselves.

### What does *not* get surfaced in real time

- Routine substance that fits naturally in existing event shapes
  (team-start, claim-open, claim-close, decision-points, reviewer
  dispatch reports) — those events carry their own substance and
  do not need a parallel failure-mode event.
- Mechanical corrections (typo, wrong file path, retry after a
  transient error) where no doctrine surface is implicated.
- Self-doubt without a substantive correction (the agent
  reconsidered and arrived at the same answer). The stream is for
  substance, not deliberation.

### Discrimination shape — tag-based on existing event kind

Real-time failure-mode events use the existing `narrative` comms-
event kind with a semantic discriminator carried as a tag on the
event. The discriminator categories:

- **`failure-mode`** — substantive failure mode worth surfacing.
- **`behaviour-note`** — softer category: a noticed behavioural
  pattern that is not yet a failure mode but is worth the next
  agent's attention (e.g. *"the X reviewer is currently returning
  Y verdicts when Z is in scope; reshape briefs accordingly"*).

The discriminator composes with the existing channel
discriminator (broadcast / group / directed / lifecycle): a
failure-mode broadcast is *broadcast + failure-mode*; a directed
behaviour-note is *directed + behaviour-note*. The substrate
implementation governs the on-the-wire shape and the watch CLI's
rendering convention.

### Event body convention

A failure-mode event body carries four short sections:

1. **Observation** — what happened. Concrete, citable, terse.
2. **Diagnosis** — what the substance of the failure was.
3. **Cure** (if known) — what the corrected shape looks like, or
   the structural change that would prevent recurrence.
4. **Pointer** — link to or quote from any artefact that should
   absorb this substance (a doctrine surface, a SKILL, a rule,
   an open plan section, a pending-graduations entry).

The body stays small enough that a watcher reading it inline
absorbs the substance in one read pass. A failure-mode event that
needs more than ~300 words probably belongs in a focused sidebar
conversation, not a single broadcast.

### Coupling with PDR-063 (mid-cycle retirement)

When an agent retires mid-cycle (PDR-063), the structured handoff
record's "in-flight reasoning" section is the natural home for
failure modes the retiring agent has accumulated in their session.
The retiring agent additionally posts any already-surfaced failure-
mode events as references in the handoff record (event-id
pointer); fresh failure modes discovered at retirement time are
surfaced as new failure-mode events first, then referenced in the
handoff record.

The two surfaces are complementary: failure-mode events are the
real-time stream; the handoff record's reasoning section is the
consolidated view at retirement.

## Rationale

**Why comms-events, not the consolidation surface alone.** The
all-channels watcher discipline (mandated by `start-right-team`
SKILL §0) is the existing real-time substrate every team agent
monitors. Adding a parallel real-time substrate would fragment
the team's attention; reusing the comms stream amortises the
watcher cost already paid.

**Why tags on `narrative`, not a new event kind.** A new event
kind would require parser amendment, renderer amendment, reader
compatibility, and a schema migration with a discriminator value.
The narrative kind already carries title + body + audience; a
semantic tag on the existing kind adds the discriminator without
restructuring. The additive-extension discipline (PDR-049 +
PDR-050) governs the substrate implementation.

**Why two tags (`failure-mode`, `behaviour-note`), not one.** The
boundary between "substantive failure that requires a doctrine
update" and "behaviour pattern worth noting" is empirically fuzzy.
Tag separation preserves the substance distinction (and the
consolidation flow at session close routes them differently)
without forcing the authoring agent to pre-commit to which
category a single observation belongs to.

**Why no backfill of existing capture-surface entries.** Existing
failure modes captured in the consolidation surface are already
in their consolidation home. Re-creating them as historical
comms-events would inflate the comms substrate without operational
benefit; they are doctrine inputs, not real-time signals.

**Why the session-close consolidation surface remains.** The
consolidation surface retains two roles after this PDR lands:
(a) the consolidation surface for the session's failure-mode
comms-events (the retiring agent reads their own session's
failure-mode events and writes the integrated view at close,
which then graduates per PDR-014); (b) the capture surface for
non-team or solo-session work where the comms watcher is not the
natural channel. The consolidation surface is not deprecated; its
role is narrowed.

**Trigger to graduate from Proposed to Accepted.** Second
observed real-time failure-mode comms-event posted in a session
distinct from this PDR's drafting session, OR owner-direction
graduation. The rotating-cast Round 1 launch will trivially
exercise the second-instance criterion; the PDR moves to Accepted
with any refinements absorbed from the second instance.

## Consequences

### Required

- The comms-event substrate carries an optional semantic-
  discriminator field on the event kinds that participate in this
  PDR's discipline. The exact field shape and the value vocabulary
  are governed by the substrate-implementation ADR.
- The team-coordination SKILL's real-time-capture subsection names
  this PDR as the governing protocol.
- The closeout consolidation discipline is updated: agents at
  session close read their own session's failure-mode events from
  the comms substrate and consolidate them into capture / distilled
  entries as appropriate, rather than capturing fresh.

### Forbidden

- Using failure-mode events for routine substance that fits an
  existing event shape. The discrimination is a substance
  judgement; tag-flood would dilute the channel.
- Posting failure-mode events without the four-section body
  convention (Observation / Diagnosis / Cure / Pointer). The
  convention is the contract that makes the channel scannable.
- Embedding failure-mode substance only in the consolidation
  surface during team sessions running under the all-channels
  watcher discipline. The consolidation surface is the
  consolidation destination, not the first capture.

### Accepted Cost

- Additional comms-event volume during team sessions. Each
  failure-mode event is small; the all-channels watcher's self-
  exclusion discipline already handles peer-of-self filtering, so
  additional volume does not directly inflate any single agent's
  notification load beyond their already-paid watcher
  subscription.
- A new substance-judgement cost on every agent: *"is this
  observation substantive enough to surface, or is it routine?"*.
  The cost is small (the four-section body shape is a forcing
  function: if you cannot fill it, the substance is probably
  routine).
- One or two substrate-implementation commits to land the schema
  extension and the CLI rendering update, in the order the
  substrate-implementation ADR specifies. The cost is amortised
  by the operational benefit it unlocks.

## Open questions deferred to second-instance observation

1. **Tag namespace boundaries.** Are `failure-mode` and
   `behaviour-note` sufficient, or will rotating-cast operation
   surface a third tag (e.g. `protocol-gap`, `coordination-
   surprise`, `reviewer-drift`)? The first PDR-Accepted refresh
   may add tags; the boundary should stay small.
2. **Cross-session failure-mode threading.** When a failure mode
   recurs in a later session, does the new event reference the
   prior one (via the existing event-thread linkage shape), or
   stand alone? (Hypothesis: reference the prior one when the
   substance is *the same failure recurring*; stand alone when
   the substance is a *new failure with similar shape*.)
3. **Consolidation cadence under rotation.** The PDR-014 capture
   → distil flow assumes session close. Under rotation, who
   distils failure-mode events whose authoring agent has retired?
   (Hypothesis: the next coordinator running an active
   consolidation window absorbs them on the same cadence as
   their own session's events, treating prior agents' events as
   inputs.)
4. **Tag fitness pressure.** As the substrate accumulates, does
   the tag-set need fitness pressure (deletion / archival /
   decay)? Or does the natural per-PDR consolidation cadence
   sufficiently graduate substantive failure modes out of the
   live stream? First-launch observation will inform.

## Substrate implementation

The repository-specific implementation of this PDR — the
comms-event schema field shape, the tag-vocabulary values, the
CLI rendering convention, the landing-tranche plan, and the file
paths involved — lives in an ADR (the phenotype). The PDR
captures the principle (this document); the ADR captures the
repository's concrete realisation of it. See the substrate
implementation ADR referenced from
[`practice-index.md`](../practice-index.md) for the current
substrate state.
