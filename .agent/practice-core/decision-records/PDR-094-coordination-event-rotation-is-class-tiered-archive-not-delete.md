---
pdr_kind: governance
---

# PDR-094: Coordination-Event Rotation Is Class-Tiered and Archive-Not-Delete

**Status**: Accepted
**Created**: 2026-06-13
**Last updated**: 2026-06-14
**Related**:
[PDR-080](PDR-080-coordination-event-absorption-is-signal-driven.md)
(coordination-event absorption is signal-driven — that PDR establishes
absorption-before-rotation as a bin-signalled discipline and leaves the
*rotation mechanism itself* — "deletion, archival, or summary-replacement" — a
host-phenotype choice; **this PDR constrains that mechanism** with portable
invariants);
[PDR-067](PDR-067-surface-classification-for-fitness-response.md)
(surface classification — the raw coordination-event stream is Buffer-class for
absorption pressure; this PDR governs how Buffer-class events leave the active
stream without losing the durable substance PDR-067's preservation discipline
protects);
[PDR-078](PDR-078-liveness-heartbeat-contract.md)
(liveness-heartbeat contract — heartbeat-family events are the highest-volume,
lowest-per-event-value class this PDR's class-tiering names for shortest
retention);
[PDR-081](PDR-081-curator-role-and-substrate-care-lane.md)
(curator role and substrate-care lane — the cross-session lane that runs a
rotation pass on the consolidation / session-close cadence);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture → distil → graduate → enforce — absorption is the capture-stage read
this rotation discipline gates removal behind).

## Context

A multi-agent coordination-event stream grows without bound while a team
operates. [PDR-080](PDR-080-coordination-event-absorption-is-signal-driven.md)
establishes that *absorption* (homing durable substance) is signal-driven and
must precede *rotation* (removal from the active stream), but it deliberately
leaves the rotation mechanism open: "deletion, archival to a dated snapshot, or
summary-replacement … is a host-phenotype choice."

That openness is correct for the absorption doctrine but leaves three portable
hazards unaddressed when the chosen mechanism is **deletion**:

1. **Unrecoverable loss.** An event removed by deletion before it is durably
   stored in version control (or an equivalent backup) cannot be recovered. A
   stream typically carries a mix of durably-stored and not-yet-stored events;
   a blanket delete treats them identically.
2. **Provenance breakage.** Permanent decision records cite individual events by
   id as evidence anchors. Once the cited event leaves the active stream and any
   untracked store, the citation dangles — the claim it anchored can no longer
   be verified from a clean checkout.
3. **Volume-blind retention.** A stream's classes are not equal in value. The
   liveness/heartbeat family is typically the largest share of events and the
   lowest per-event research value once aggregate cadence statistics are
   extracted; the failure-signal family is the smallest share and the highest
   value. A single retention window applied across all classes either keeps
   low-value bulk too long or rotates high-value signal too soon.

A further honesty hazard sits underneath any size-based trigger: the intuition
that "the stream's size degrades the mechanism that watches it" is frequently
asserted but rarely *measured*. A rotation strategy that sells itself as a fix
for an unmeasured health problem encodes a hypothesis as a mechanism.

## Decision

Coordination-event **rotation is class-tiered, age-triggered, and
archive-not-delete**, governed by six invariants and one operative gate.
Rotation runs as a deterministic curator-lane pass on the consolidation /
session-close cadence — not as an autonomous daemon, and not behind per-pass
owner approval once the contract is ratified.

### Invariant 1 — No unprocessed signal is removed

Nothing leaves the active stream until its signal is **absorbed into a durable
home** *or* an **item-level disposition is recorded** (see §"The operative
absorption gate"). This restates and operationalises
[PDR-080](PDR-080-coordination-event-absorption-is-signal-driven.md)
Invariant 3 for the rotation step.

### Invariant 2 — No unrecoverable loss: rotation moves, it does not destroy

Rotation **moves** events out of the active stream into a retained store; it
does not destroy them. "Leaves the active stream" never means "lost." Removal
from the watched/active path is the operational goal; byte-destruction is not
part of it.

A standing constraint makes the move loss-safe for *future* events, not only
already-stored ones: an event that is not yet committed to version control (or
otherwise backed up) MUST be durably stored before it is moved, **or** the
retained store itself MUST be made recoverable (periodic backup). An untracked
move target protects already-tracked events but not freshly-emitted untracked
ones.

### Invariant 3 — Provenance survives rotation

Any event id **cited in a permanent record** (a decision record, a pattern, a
governance doc) MUST remain resolvable after the event leaves the active stream.
Three composing parts, in preference order:

1. **Inline-quote-first (preferred default).** A permanent-record citation
   carries a verbatim body excerpt sufficient to verify the claim it anchors,
   co-located with the claim. Self-contained; needs no external store.
2. **Tracked digest (fallback)** for long bodies or multi-record citations: a
   version-controlled record, outside the rotatable stream, capturing per cited
   event its id, author identity, emission timestamp, and excerpt.
3. **A mandatory pre-rotation provenance check.** Before a rotation pass moves
   any event, it scans permanent records for event-id tokens and **refuses to
   move any cited event lacking inline or digest coverage.** This converts the
   discipline from prose-only to enforced exactly where it is hardest to trust.

Identity provenance for *cited* events is preserved by the same two surfaces;
*uncited* events' identity and any body-citation linkage remain navigable in the
retained store. (Where a stream's structured reply/threading fields are unused,
there are no such chains to preserve — provenance reduces to cited event ids and
identity.)

### Invariant 4 — The active stream has a bounded working set, honestly labelled

The active stream is bounded by a host-tunable trigger (typically an age
window). **Honesty clause:** if the bound is not derived from a *measured* health
metric of the consuming mechanism, it is a **hygiene target**, not a
health-derived bound, and the host phenotype MUST label it as such. A bound
asserted to track an unmeasured health link is non-compliant with this invariant
even if it numerically names a threshold. The bound becomes health-derived only
when a controlled measurement of the consuming mechanism against stream size
exists to size it.

### Invariant 5 — Distinct classes get distinct retention

Events are tiered by **research value, not volume alone**:

- The **highest-volume / lowest-per-event-value class** (liveness/heartbeat
  family per [PDR-078](PDR-078-liveness-heartbeat-contract.md)) gets the
  **shortest** retention. Its aggregate cadence statistics are extracted once
  into a durable artefact; the raw beats then move on the shortest window.
- The **research-precious class** (failure-signal-tagged events plus the
  genuine-signal subset of behaviour-note-tagged events — *not* the routine
  bulk) gets the **longest** retention, behind the absorption gate, until
  graduated.
- **Coordination-narrative and directed** events get the standard window behind
  the operative gate.
- **Diagnostic / test / noise** events are immediate-eligible *after a body
  read* (see the falsifier in the operative gate).

### Invariant 6 — Untracking the active stream makes curation a standing obligation

A host may move the active stream out of version control entirely (untrack it),
so that the live coordination tier is preserved on disk but no longer carried in
history. This is legitimate — it removes the stream from the watched/auditable
path that Invariant 4 bounds. But it removes an **accidental
knowledge-preservation safety net**: while the stream was version-controlled,
durable substance an agent failed to curate still survived in history; once
untracked, uncurated substance is lost when the on-disk file rotates or the
checkout is discarded.

Therefore, when the host untracks the stream, **curation of the stream's durable
substance into permanent homes becomes a mandatory standing obligation** — wired
into the host's lifecycle / session-close / consolidation procedures as an
explicit, non-optional step, not best-effort. The substance in scope is the same
the absorption gate already names (failure-signal and genuine behaviour-note
content, decisions, and reusable what-worked instances); the untrack changes only
its enforcement from "history is a backstop" to "curation is the only path."

**Atomic-propagation clause.** A protocol change recorded only in a decision
record but absent from the operational surfaces agents actually read at
session-open and session-close is an invisible, half-broken state. The untrack
and the standing-obligation wiring across those operational surfaces MUST land
**together**, in one change; an untrack that ships ahead of the wiring removes
the safety net before the replacement obligation is installed.

### The operative absorption gate

This is the single gate for the whole contract; it supersedes any looser
phrasing elsewhere. **Rotation never moves an event whose disposition is not
recorded, where a recorded disposition is one of: (a) absorbed into a durable
home, (b) classified routine, or (c) quarantined.**
[PDR-080](PDR-080-coordination-event-absorption-is-signal-driven.md)'s
bin-signal indicates when a class has accumulated enough to warrant an absorption
pass; this PDR adds the move step after recorded disposition. PDR-080 absorbs;
this PDR moves the absorbed.

**Bulk-classification safeguard.** Routine classification (b) and quarantine (c)
may be applied to a candidate set in bulk, but **title or genre alone is never
sufficient.** Every bulk pass MUST include a body read of a sample *plus* every
event whose body length exceeds a routine threshold, before any of the set is
moved. The standing falsifier: an event whose title reads as a throwaway test
("reproducer-test…") but whose body carries a load-bearing proposal. A pass that
cannot show a body check on its bulk-classified set has not satisfied Invariant 1,
however confident the title genre looked.

### Activation-enthalpy framing — rotation by prevention, not only removal

The steady state is not only "rotate the heavy stream faster" but **"which
substrate for which coordination shape."** Lowering the activation enthalpy of a
lightweight, ephemeral coordination channel (append-only, zero-ceremony) reduces
how many low-value events reach the heavy, auditable stream in the first place.
This is rotation by *prevention* as well as by *removal*. It is a steering
recommendation, not a mandate.

## Rationale

### Alternatives considered

- **Delete-on-cadence** (the simplest mechanism PDR-080 permits). Rejected as
  the default: it violates Invariant 2 for not-yet-stored events and breaks
  Invariant 3 for cited events. Archive-move dissolves both at the cost of
  retained-store disk only.
- **Size-triggered rotation.** Rejected as a *primary* trigger unless the size →
  health link is measured: a size trigger encodes an unproven hypothesis as a
  mechanism (the failure mode Invariant 4's honesty clause guards). Age is the
  honest primary trigger; size may compose once measured.
- **Single retention window across all classes.** Rejected: ignores the volume /
  value asymmetry Invariant 5 names. Class-tiering captures most of the
  live-stream reduction (the heartbeat class alone is typically ~half the
  stream) independent of the unproven health question.
- **A new autonomous hook or daemon to run rotation.** Rejected: it risks moving
  events mid-research and adds standing machinery. A curator-lane pass on an
  existing cadence (PDR-081) is deterministic, owner-or-agent-initiated, and adds
  no new coordination surface.

### Why archive-move is the structural cure, not a behaviour campaign

Invariants 2 and 3 are satisfied by *mechanism* (the move retains bytes; the
provenance check refuses unsafe moves) rather than by asking agents to be
careful. This is the stated-principles-require-structural-enforcement discipline
applied to rotation: the gate enforces what prose alone would not.

## Consequences

- The active stream's lifetime is bounded by age and class, and its substance is
  preserved by absorption-before-move plus a retained store — never by a
  destroy step.
- Permanent-record citations remain verifiable from a clean checkout via inline
  excerpts or the tracked digest, enforced by the pre-rotation check.
- The largest, lowest-value class is reducible immediately (once its aggregate is
  extracted) without waiting on any health measurement.
- A host that asserts a size→health justification without measurement is forced
  by Invariant 4 to label its bound as hygiene, keeping the doctrine honest about
  what its evidence licenses.
- This PDR composes with, and does not replace, any storage-shape redesign of the
  stream: if the host moves to a watermark/segment store, "rotation" becomes
  "retire segments older than the window" with the class-tiers and the operative
  gate unchanged.

## Falsifiability

A host-side response that **deletes** coordination events (rather than moving
them to a retained store), or that moves an event **cited in a permanent record
without preserving its provenance**, or that bulk-classifies events as routine
**on title genre alone**, or that labels a size-derived bound as health-derived
**without a measurement**, is the failure mode this PDR forbids.

A host-side mechanism that absorbs first, moves (never destroys) on a class-tiered
age trigger, preserves cited-event provenance behind an enforced pre-move check,
and labels its working-set bound honestly is the success shape.

## Notes

The concrete phenotype — the retained-store location, the digest location, the
per-class windows, the curator-pass procedure, and the provenance-check
implementation — is a host concern carried in the bridge index and the host's
architectural-decision surface, per the PDR portability constraint. This PDR
names invariants and the operative gate only; no specific window or path is
Practice-Core canonical.

This PDR is the rotation-mechanism companion to
[PDR-080](PDR-080-coordination-event-absorption-is-signal-driven.md)'s
absorption-trigger doctrine: PDR-080 says *when* to absorb and that absorption
precedes rotation; PDR-094 says *how* events leave the stream once absorbed.

### Metadata-shape note

Per the PDR-080 precedent, this PDR adopts **Created** and **Last updated** as
separate fields rather than the single `Date` field named in
`decision-records/README.md`, to disambiguate first-authoring from
latest-revision date.

## Revision history

- **v1 (2026-06-13)** — initial authoring, recording the owner-ratified
  ("ratify as proposed", 2026-06-13) class-tiered, archive-not-delete rotation
  contract derived from a two-round adversarially-reviewed proposal. The
  proposal's host-specific evidence and phenotype are recorded in the host's
  paired architectural-decision record, not here (portability constraint).
- **v2 (2026-06-14)** — added Invariant 6 (untracking the active stream makes
  curation a standing obligation, with the atomic-propagation clause), recording
  the portable doctrine surfaced when the host phenotype executed the full
  untrack of its coordination tier. The host-specific boundary and wiring are in
  the paired architectural-decision record (portability constraint).
