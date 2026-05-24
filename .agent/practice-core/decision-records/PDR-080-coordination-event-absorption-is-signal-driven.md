---
pdr_kind: governance
---

# PDR-080: Coordination-Event Absorption Is Signal-Driven

**Status**: Accepted
**Created**: 2026-05-23
**Last updated**: 2026-05-24
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture → distil → graduate → enforce pipeline; this PDR specifies
the absorption-trigger discipline for a pre-capture substrate read
by the capture stage);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(layered knowledge processing — preserve first, restructure second;
cited here for the principle that substance routes to the surface
whose lifecycle matches it);
[PDR-067](PDR-067-surface-classification-for-fitness-response.md)
(surface classification — this PDR sits alongside 067 by
distinguishing two artefacts that prior usage of the phrase
"comms log" sometimes conflated: the **rendered prose log** (which
PDR-067 already classifies as State-class) and the **raw
coordination-event stream** (this PDR's subject, which is
Buffer-class with respect to absorption pressure));
[PDR-068](PDR-068-pipeline-back-pressure-as-structural-cure-signal.md)
(pipeline back-pressure as structural-cure signal — this PDR
extends 068's buffer-surface back-pressure doctrine to the
coordination-event stream and maps 068's four-bottleneck diagnostic
onto this surface);
[`practice-index.md`](../practice-index.md)
(substrate-implementation ADR carrying the repo-specific phenotype
of this PDR — the bin-signal tooling and host-side workflow edits
that surface the doctrine).

## Context

The Practice's capture → distil → graduate → enforce pipeline
(PDR-014) operates across several surface kinds. The
**coordination-event stream** — the timestamped feed of inter-agent
coordination events (broadcasts, directed messages, narrative
posts, lifecycle markers, heartbeats) emitted during multi-agent
sessions — is the substrate this PDR addresses.

### Two artefacts under one informal label

Prior usage of the phrase "comms log" has informally referred to
two distinct artefacts:

- **The raw coordination-event stream** — the structured event
  records emitted by agents during a session, each carrying author
  identity, timestamp, routing, body, and optional tags.
- **The rendered prose log** — a human-readable rendering of the
  event stream (typically Markdown), regenerated periodically from
  the events themselves and used as a session-spanning narrative.

PDR-067's surface taxonomy includes "comms log" in its State-class
example list with the response "archive the dated slice per the
surface's split strategy". That classification reads cleanly as
applying to the **rendered prose log** (which is "historical prose
accumulated" in PDR-067's vocabulary). This PDR addresses the
**raw coordination-event stream** — a structurally different
artefact with different absorption pressures.

### What coordination events carry

Coordination events carry two distinct substances:

- **Volatile coordination context** — current-turn directives,
  ephemeral status, routing decisions whose value expires when the
  session arc closes.
- **Durable substance** — owner directions captured inline, worked
  instances of coordination cures, tooling friction surfaced under
  team load, decision-timelines, pattern evidence.

The absorption stage extracts the durable substance into permanent
homes (distilled memory, patterns, governance records) before the
source event rotates out of the stream.

### The failure mode this PDR addresses

The recurring failure mode is **treating the coordination-event
stream as a calendar-bounded surface**: setting a fixed
time-since-emission (e.g., "older than N days") as the trigger for
processing-and-rotation. Calendar-bounded retention has two
structural costs:

1. **Decouples retention from absorption capacity.** Quiet weeks
   emit few events; storm windows emit hundreds per day. A
   fixed-calendar cutoff retains the same window-width in both,
   irrespective of whether absorption is keeping pace.
2. **Couples processing to rotation at the cutoff boundary.** This
   forces the absorption pass to share a clock with a rotation
   deadline, which inverts the natural ordering: durable substance
   should be homed because absorption fires, not because a calendar
   threshold approached.

## Decision

Treat coordination-event accumulation as a **back-pressure signal
on the absorption stage**, not as a calendar-deadline for retention.
Four named invariants govern the doctrine.

### Invariant 1 — The coordination-event stream is Buffer-class for absorption

The coordination-event stream — the raw event substrate, distinct
from any rendered prose log derived from it — is Buffer-class with
respect to absorption pressure. Per PDR-068, a full buffer is a
producer-vs-consumer rate signal, not a preservation question. The
rendered prose log derived from the stream remains State-class per
PDR-067 and follows the State-surface fitness response (archive per
the surface's split strategy); it is regenerated after each
absorption pass from the events that remain in the active stream.

### Invariant 2 — The absorption trigger is a bin-signal

A **bin-signal** partitions a time-ordered stream into named
age-bins and uses per-bin occupancy as the diagnostic value, in
contrast to continuous signals (percentile, raw count) or
threshold-deadline cutoffs.

The absorption trigger is a bin-signal over the coordination-event
stream's emission timestamps. The signal has at minimum two named
thresholds — **informational** and **critical** — partitioning
events into three bins: **fresh** (events recently emitted, in
active coordination scope), **informational** (events whose age has
crossed the first threshold), and **critical** (events whose age
has crossed the second threshold).

**The thresholds are categorisation boundaries, not lifecycle
deadlines.** Crossing a threshold places an event into the
corresponding bin; it does not by itself trigger any lifecycle
action on the event. The lifecycle action (absorption + rotation)
is triggered by bin occupancy reaching the conditions named under
§"The correct response", not by any single event crossing a
threshold.

The signal is a pure read over the stream. No state-write, no
persisted signal record; the bins are computed at observation time
from the stream itself.

### Invariant 3 — Absorption-before-rotation holds

This invariant is already operationalised in host phenotypes as the
*process-before-removal* contract. This PDR records it at the
doctrine layer. Substance found during absorption routes to its
durable home before the source event rotates out of the active
stream. Mechanical rotation without an absorption pass is the
failure mode this PDR forbids. The preservation discipline
(PDR-067) applies to the durable substance carried by the stream,
even though the stream itself is Buffer-class with respect to
absorption pressure.

### Invariant 4 — Thresholds are host-tunable, with shape constraints

The Practice mandates that signals exist and that
absorption-before-rotation holds. The host phenotype names the bin
sizes, the absorption-trigger thresholds, and the cadence at which
signals are computed. No specific calendar offset is Practice-Core
canonical.

**Shape constraints** on the tunables — these preserve the signal's
discriminating power and are not host-tunable:

- The informational threshold MUST be strictly less than the
  critical threshold.
- Both thresholds MUST be positive (greater than zero, in whatever
  unit the host uses to measure event age — typically a duration
  unit such as hours or days, or a count of absorption-pass
  cadences).
- The gap between them MUST be at least one absorption-pass cadence
  — otherwise the informational signal cannot fire an absorption
  pass before the critical signal would also fire, collapsing the
  two-stage warning into a one-stage warning.

A configuration that violates these shape constraints is
non-compliant with this PDR even if it numerically names
"informational" and "critical" thresholds.

### The correct response to bin-signal occupancy

When the informational bin or the critical bin is non-empty, the
next consolidation pass runs an absorption sweep over the events in
those bins. The sweep:

1. Reads each event's substance.
2. Routes durable substance to its target surface (distilled
   memory, patterns, governance records, host-permanent docs).
   *The routing function is host-phenotype; this PDR specifies
   that routing happens, not which surface receives which kind of
   substance.*
3. Records no duplicate copy for events carrying only volatile
   coordination context.
4. Rotates absorbed events out of the active stream.
5. Triggers regeneration of any State-class rendered log derived
   from the stream so its content reflects the remaining live
   window.

The sweep is the lifecycle action; the bin-signal triggers it; the
calendar does not.

### Defining "rotation"

**Rotation** means removal from the active stream. The specific
mechanism — deletion, archival to a dated snapshot, or
summary-replacement — is a host-phenotype choice. The invariant is
that after rotation, the rotated events are no longer in the active
stream visible to running agents. Substance routed to durable
surfaces during step 2 of the sweep is preserved by that routing;
the rotated event record itself need not be preserved.

## Composition with PDR-068's four bottleneck candidates

PDR-068 names four candidate bottlenecks for buffer surfaces under
back-pressure. Each maps onto the coordination-event stream:

1. **Consumer cadence too low** — absorption fires only at
   consolidation passes, which under high-volume multi-agent
   operation may lag emission rate. The cure-direction (PDR-068
   §"Correct Response") is a lighter-weight scan-only pass that any
   session can run to drain ripe events opportunistically, not a
   threshold raise.
2. **Trigger conditions unscannable** — absorption discovery
   requires reading every event to assess substance. The
   cure-direction is emission-time discipline: event titles plus
   optional tags should carry enough signal that the absorption
   pass can prioritise by metadata before reading bodies.
3. **Producer doctrine-drafting in the buffer** — agents emitting
   long substantive content into coordination events instead of
   writing directly to napkin or distilled-memory surfaces. The
   cure-direction is an emission-shape contract: events carry a
   short body and a pointer to the substantive artefact rather than
   the substance itself.
4. **Capture over-eagerness** — not every coordination event
   carries durable substance; many are pure transient routing. The
   cure-direction is capture-discipline at absorption: distinguish
   events whose substance routes to durable homes from events whose
   entire content is volatile coordination context, and rotate the
   latter without homing.

All four bottlenecks apply. The bin-signal observes the
rate-mismatch symptom; the four-bottleneck diagnostic identifies
which structural cure applies.

## Rationale

### Alternatives considered

- **Keep the calendar cutoff.** Rejected: couples retention to a
  clock that does not track absorption capacity, and forces the
  rotation deadline to share a timer with the absorption pass.
- **Make signal emission a periodic background job that writes
  substrate.** Rejected at the doctrine layer: a periodic emitter
  assumes signals must be persisted to a substrate file. The
  doctrine remains correct under either lazy-computed-on-demand or
  persistently-emitted signals; the host phenotype may choose
  either. Persisting the signal adds substrate without adding
  truth.
- **Use the existing fitness-zone surface to carry the signal.**
  Permitted as a host phenotype choice, not mandated by the
  doctrine. A standalone diagnostic surface is equally compliant.

### Why a bin-signal not a percentile or absolute-count

Percentiles vary with stream volume and lose meaning at low
volumes; absolute counts within named age-bins are directly
actionable. Two events in the critical bin during a quiet week is a
stronger signal than fifty events in the informational bin during
a storm week, and the bin-shape preserves that distinction.

### Why the absorption-before-rotation invariant

It preserves the substance-not-volume preservation discipline
(PDR-067 §"Preservation Discipline Has Surface Scope") for the
durable substance carried by the event stream, even though the
stream itself is Buffer-class with respect to absorption pressure.
The two disciplines compose without contradiction because their
scopes are disjoint: preservation governs the durable substance;
back-pressure governs the rate at which the stream as a whole is
absorbed.

## Consequences

- Coordination-event lifetimes are not bounded by a calendar. They
  are bounded by absorption capacity.
- Absorption-stage cadence is observable: agents and owners read
  the bin-signal to know whether absorption is keeping pace.
- The host phenotype names tunable parameters; the doctrine names
  invariants only.
- The composition with PDR-014's pipeline is exact: the
  coordination-event stream is a **pre-capture substrate read by
  the capture stage**; absorption fires at the bin-signal; durable
  substance graduates upward; the source event rotates afterward.
  Rendered prose logs derived from the stream remain State-class
  per PDR-067.
- Existing host-side specification text that references calendar
  cutoffs for coordination-event retention is superseded by
  signal-bin language under this doctrine. Host adoption is a
  bridge-index concern.
- **This PDR extends PDR-067's surface taxonomy** by naming the
  raw coordination-event stream as a distinct artefact from the
  rendered prose log; PDR-067's "comms log" example is preserved
  as referring to the rendered log. A future PDR-067 amendment
  cycle may incorporate the distinction directly into the taxonomy
  table; until then, this PDR carries the distinction.

## Falsifiability

A future host-side response to coordination-event accumulation that
mechanically rotates events at a calendar threshold without an
absorption pass is the failure mode this PDR forbids.

A future host-side mechanism that surfaces the bin-signal, runs
absorption when the signal fires, and rotates events only after
substance is homed is the success shape.

### Why no per-event audit marker

This doctrine intentionally does not require an absorption-decision
audit marker per event. The reasoning: an audit record covering
every absorbed event would accumulate at the same rate as the
events themselves, defeating the absorption discipline's primary
value (preventing unbounded state growth). Verification of
compliance is by sampling — observing whether durable surfaces
(distilled memory, patterns, governance records) contain substance
that maps to historical coordination events — not by per-event
audit log. The doctrine trusts the absorption pass; verification is
post-hoc and statistical rather than per-event and exhaustive.

## Notes

The phenotype that surfaces the signal — a diagnostic command, a
fitness-pressure surface, a session-open observability surface, or
some combination — is a host concern carried in the bridge index
per the PDR portability constraint. The bin thresholds are likewise
host parameters; the doctrine specifies that thresholds exist as
host-tunable values subject to the Invariant 4 shape constraints,
not that any particular calendar offset is canonical.

This PDR is one of a family of refinements composing with PDR-067's
surface taxonomy and PDR-068's back-pressure framing. PDR-068
covered the pending-graduations buffer; this PDR covers the
coordination-event stream. Future PDRs may similarly address other
surface kinds where the four-class taxonomy needs a worked
specification for a specific stream or accumulator.

### Metadata-shape note

The PDR shape contract in `decision-records/README.md` names a
single `Date` field. This PDR adopts **Created** and **Last
updated** as separate fields to disambiguate first-authoring date
from latest-revision date — the standard pattern for evolving
records. The README PDR-shape contract should be updated to
authorise this pattern as a follow-up cycle; future PDRs adopting
the same pattern before that update should likewise carry this
note.

## Revision history

- **v1 (2026-05-23)** — initial draft authored under owner-guided
  design conversation.
- **v2 (2026-05-23)** — incorporated verified findings from a
  sequential reviewer pass (documentation-and-ADR reviewer +
  code-quality reviewer): event-stream/rendered-log distinction
  made explicit; PDR-014 placement corrected to pre-capture
  substrate; threshold-ordering shape constraints added; PDR-068
  four-bottleneck mapping added; "rotation" defined; "materially
  populated" trigger language replaced with implementable form;
  bin-signal conceptual definition added; Invariant 3 framed as
  doctrine-layer restatement; audit-marker gap acknowledged as
  intentional.
- **v3 (2026-05-24)** — incorporated verified findings from a
  second sequential reviewer pass: Status moved to controlled
  vocabulary; "per Invariant 3" back-reference in §"Defining
  'rotation'" cleaned up; threshold unit qualifier added to
  Invariant 4; bin-signal operational-definition clarification
  added; Consequences acknowledgement of PDR-067 vocabulary
  extension added; "fitness-zone counter" portability breach in
  §Notes replaced with "fitness-pressure surface"; PDR-046
  paraphrase aligned to actual title; metadata-shape divergence
  flagged in §Notes. Owner ratified as Accepted at this revision.
