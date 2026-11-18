---
pdr_kind: governance
---

# PDR-094: Coordination-Event Rotation Is Class-Tiered and Extraction-Gated

**Status**: Accepted (v3+v4 core correction by owner word, 2026-07-26,
formulation owner-ratified — see §Revision history; the filename preserves
the v1 title for citation stability)
**Created**: 2026-06-13
**Last updated**: 2026-07-26
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
extraction-gated: retention lives in the KNOWLEDGE; the raw source then
archives as a mining substrate, never as a hedge.** Owner policy, stated
2026-07-26 (both halves verbatim-substance, same day): *"once the
knowledge is retained, we are DONE, we don't need the source any more"* —
and — *"I am happy for events to be archived, in order to ENABLE future
mining, but not as a mechanism for hedging: we do the full extraction,
then we archive in case a future technology or additional resource
changes things materially. We never treat it as a safety mechanism to
enable 'I will do it later', or 'it's okay to [skimp on] this because
it's safe'."* The extraction bar is therefore identical whether or not
an archive exists; the archive carries **no curation obligation, no
deferral licence, and no safety-net status** — it is cheap optionality
for future re-mining, nothing more. Rotation runs as a deterministic
curator-lane pass on the consolidation / session-close cadence — not as
an autonomous daemon, and not behind per-pass owner approval once the
contract is ratified.

### Invariant 1 — No unprocessed signal is removed

Nothing leaves the active stream until its signal is **absorbed into a durable
home** *or* an **item-level disposition is recorded** (see §"The operative
absorption gate"). This restates and operationalises
[PDR-080](PDR-080-coordination-event-absorption-is-signal-driven.md)
Invariant 3 for the rotation step.

### Invariant 2 — Extract fully first; then archive as substrate, never as hedge

Once an event is covered by the operative gate (recorded absorption
watermark + class window; body-read safeguard satisfied), the source
archive-moves out of the live stream into the off-drain-path archive. The
**retention is the knowledge in its durable homes**; the archive exists
only to ENABLE future mining (a future technology or additional resource
may extract more from raw text than today's pass could). Three teeth keep
that honest:

- **The anti-hedge clause.** The archive changes NOTHING about the
  extraction bar. An event may not move with its extraction deferred,
  thinned, or promised — "it's in the archive" licenses no 'later' and no
  half-done sweep. A pass that leans on the archive's existence to lower
  its own extraction quality has failed the gate, however safe the bytes.
- **No accounting ceremony.** No per-event disposition ledger, no
  manifest rows (v3's finding stands: that machinery was write-only and
  manufactured an "impossible to move" state — the v1 defect the owner
  actually objected to). The pass-level watermark and the durable homes
  are the record.
- **No curation obligation on the archive.** The archive is not a buffer,
  appears in no drain inventory, and is never "owed" work. Mining it is a
  deliberate, owner-priced research act (the corpus-analysis pipelines),
  not a standing duty.

Nothing in-window moves (the live stream is the working coordination
surface regardless of absorption state). This invariant governs knowledge
SOURCES post-extraction only — it neither touches nor weakens the host's
protections for in-flight WORK (working trees, drafts, uncommitted
changes). §Rationale names both structural generators this clause pins
down: loss-aversion hoarding (v1–v2's drift into deletion-grade ceremony)
and correction-momentum overcorrection (v3's same-hour swing into
deletion of the substrate itself).

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

Identity provenance for *cited* events is preserved by the same two surfaces.
Under v3 there is no retained store: an uncited, absorbed, past-window event's
bytes are gone by design — which is why the pre-deletion provenance check is
load-bearing, not advisory. (Where a stream's structured reply/threading
fields are unused, there are no chains to preserve — provenance reduces to
cited event ids and identity.)

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
phrasing elsewhere. **Rotation never moves an event outside a recorded
absorption watermark.** The record is **pass-level, never per-event**: a
consolidation/curation pass that has swept the stream records "absorbed
through time T" in its own pass record (exactly the shape the host's
capture-buffer rotations already use), and events with `created_at ≤ T`
that are also past their class window are thereby covered and
archive-move. A per-event disposition ledger is retired as of v3 — it is
accounting the estate's consolidation-record doctrine forbids elsewhere,
its only observed reader was the machinery that wrote it, and it is the
mechanism that once manufactured a "cannot move" state over a loss-free
operation. Quarantined events are the one per-item exception: a
quarantine is named individually and holds its event live until resolved.
[PDR-080](PDR-080-coordination-event-absorption-is-signal-driven.md)'s
bin-signal indicates when a class has accumulated enough to warrant an
absorption pass; this PDR adds the archive step after the watermark
covers it. PDR-080 absorbs; this PDR archives the extracted.

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

- **Delete-on-cadence** (the simplest mechanism PDR-080 permits). Rejected
  as an *ungated* default: blind deletion loses unabsorbed signal and breaks
  cited-event provenance. **v3 correction**: the v1 response over-corrected
  into archive-not-delete — deletion-grade caution attached to a boundary
  that, once the absorption watermark and provenance check gate it, carries
  no loss at all. The v1 archive tier's ledger was written and never read;
  its store was a monument to loss-aversion asymmetry (agents bear no cost
  for hoarding and fear blame for deleting, so every locally-cautious call
  ratcheted toward lossless — against standing owner policy). Gated deletion
  is the v3 shape.
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

- The active stream's lifetime is bounded by age and class, and its substance
  is preserved by **absorption into durable homes** — the knowledge is the
  retention; spent sources delete.
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

Four failure modes, one per era of this record's own history, all forbidden:

- **Moving or deleting outside the watermark** — an event leaves the live
  stream with its extraction not covered by a recorded pass (the original
  loss mode), or a cited event moves without inline/digest provenance, or
  a bulk class moves on title genre alone, or a size bound masquerades as
  health-derived without a measurement.
- **Hedge-archiving** — a pass that defers, thins, or half-does extraction
  because the archive makes the bytes "safe". The archive is optionality
  for future mining; it is never a safety mechanism, and it never lowers
  the extraction bar (owner word, 2026-07-26).
- **Ceremony that manufactures impossibility** — per-event ledgers,
  disposition-recording machinery, or any gate whose input channel does
  not exist, converting a loss-free move into a standing "cannot" (the
  v1–v2 defect the owner actually objected to).
- **Correction-momentum destruction** — deleting the mining substrate
  itself to demonstrate alignment with an anti-hoarding correction (the
  v3 defect, same hour as the correction; agents optimise for the last
  correction, not the policy — the record's own history is the instance).

A host-side mechanism that extracts fully first, archive-moves behind the
watermark and the enforced provenance check on a class-tiered age trigger,
keeps the archive obligation-free, and labels its working-set bound
honestly is the success shape.

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
- **v3 (2026-07-26)** — core corrected by owner word: *"I never wanted a
  lossless record of everything, I wanted knowledge retained; once the
  knowledge is retained, we are DONE, we don't need the source any more...
  that has always been the policy, and agents have always pulled in the
  other direction."* Archive-not-delete (Invariant 2) reversed to
  absorption-gated deletion; the per-event disposition ledger retired in
  favour of the pass-level watermark; the H1 retitled (filename kept for
  citation stability). The trigger was a first-hand review finding the v1
  ledger write-only, the archive store consumed by nothing, and a
  1,400-event disposition backlog that existed only to feed them.
- **v4 (2026-07-26, same day)** — owner refined within the hour, and the
  enacting seat's overshoot is part of the record: v3 read the disposal
  LICENCE as a delete MANDATE and destroyed the archive substrate
  (6,917 archived + 1,648 past-window events; the pre-2026-06-14 era
  survives in git history, the post-untrack window's raw events do not —
  their extraction was complete, so the loss is bounded to future
  re-mining of that window). Owner, verbatim-substance: *"I am happy for
  events to be archived, in order to ENABLE future mining, but not as a
  mechanism for hedging: we do the full extraction, then we archive in
  case a future technology or additional resource changes things
  materially — but we never treat it as a safety mechanism... My
  objection was never archiving the files, it was that you claimed it
  wasn't possible to do it."* v4 restores archive-move with the
  anti-hedge clause and keeps every v3 kill: no per-event ledger, no
  impossibility-manufacturing ceremony, pass-level watermark only. The
  owner ratified this record's v4 formulation of the policy in-session.
