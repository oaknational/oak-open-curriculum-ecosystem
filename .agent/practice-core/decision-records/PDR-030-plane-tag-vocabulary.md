---
pdr_kind: governance
---

# PDR-030: Plane-Tag Vocabulary

**Status**: Accepted
**Date**: 2026-04-21
**Related**:
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(surprise pipeline — plane-origin tags mark capture-stage
entries so consolidation can route them);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation — cross-plane scan aggregates plane-span tags at
graduation);
[PDR-028](PDR-028-executive-memory-feedback-loop.md)
(executive-memory feedback loop — introduces the origin tag
`Source plane: executive` as the executive-drift capture
channel);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(perturbation-mechanism bundle — Family B Layer 2 consumes the
span tag `cross_plane: true` as an accumulation signal).

## Context

Two sibling decisions in the same bundle introduced
plane-aware tags on distinct surfaces:

- PDR-028 introduces **`Source plane: <plane>`** as an inline
  tag in napkin-entry text, marking that an observation
  *originated from* a particular plane of memory (typically
  executive; potentially others as the convention extends).
- PDR-029 introduces **`cross_plane: true`** as a frontmatter
  field on patterns, marking that a pattern *spans across*
  multiple planes rather than being scoped to a single plane.

The two tags share the "plane" vocabulary but carry different
semantics:

| Question | Answer by tag | Used at | Surface |
| --- | --- | --- | --- |
| Where did this observation come from? | `Source plane: <plane>` | Napkin-entry time (capture stage) | Inline text in active-memory surface |
| Which planes does this artefact touch? | `cross_plane: true` (and optionally `planes: [<plane>, <plane>]`) | Pattern-authoring time (graduation stage) | Frontmatter on a pattern or doctrine artefact |

Without coordination, the vocabulary will fragment as more
plane-aware scenarios accrue: a third mechanism will invent
`origin_plane:` or `from-plane:` or `plane: active` and the
surface will lose its scan-ability. The consolidation workflow
relies on a small, stable set of tags to aggregate observations
across sessions; vocabulary drift defeats the aggregation.

A second concern: the vocabulary only makes sense in hosts
whose memory taxonomy **has distinguishable planes**. A host
with a single-mode memory surface has no need for plane tags
and should not inherit them as required convention. The PDR
must be conditional on host structure, not universal.

## Decision

**Plane-aware tagging is a small, fixed vocabulary with two
facets — origin and span. Each facet has one canonical form.
The vocabulary applies only to hosts whose memory organisation
distinguishes two or more planes. New plane-prefixed tags
require PDR amendment.**

### The two facets

**Origin** — *where did this observation come from?*

- **Canonical form**: `Source plane: <plane-name>` written inline
  in the capture surface (napkin entry, correction record, or
  equivalent).
- **Applies to**: capture-stage artefacts — content authored
  during a session that may later graduate into more durable
  surfaces.
- **Read by**: consolidation workflow; cross-plane scan step
  (per PDR-028, PDR-014).
- **`<plane-name>` values**: the plane identifiers the host
  taxonomy uses (e.g. `active`, `operational`, `executive` for
  the three-mode taxonomy referenced by PDR-028).

**Span** — *which planes does this artefact touch?*

- **Canonical form**: `cross_plane: true` as a boolean
  frontmatter field on any promoted artefact (pattern, PDR,
  ADR, rule) that observes phenomena across two or more planes.
- **Optional refinement**: `planes: [<plane>, <plane>]` as a
  list frontmatter field when the specific planes matter for
  downstream routing. Omitting the list is compliant; the
  boolean is the required minimum.
- **Applies to**: graduation-stage artefacts — patterns and
  doctrine authored from observations that span planes.
- **Read by**: Family B accumulation signal (PDR-029);
  consolidation meta-check on taxonomy-seam correctness.

**Impact** — *which higher-permanence plane does this
lane-level work affect?* (Added 2026-04-21 for catalogue
completeness after architecture review flagged that this tag
was in use but un-enumerated.)

- **Canonical form**: `executive-impact:` as an inline
  workstream-brief field (typically under Required Fields in
  the brief) listing executive-memory surfaces the lane has
  contradicted, extended, or superseded during its current work.
- **Applies to**: lane-level operational surfaces —
  `.agent/memory/operational/workstreams/<slug>.md` briefs
  recording an operational → executive cross-plane impact.
- **Read by**: consolidation workflow's cross-plane scan step
  (PDR-028's feedback-loop channel); routes the signal to the
  affected executive surface for amendment at next
  consolidation.

### Conditional applicability

The vocabulary is **required** on any host whose memory
organisation distinguishes two or more planes (a multi-mode
taxonomy such as the three-mode arrangement active / operational
/ executive). It is **inapplicable** on a host with a single
memory plane — tags without planes to discriminate between
carry no information.

A host migrating from single-plane to multi-plane organisation
adopts the vocabulary at the migration boundary. A host
migrating from multi-plane back to single-plane deprecates the
vocabulary at the migration boundary.

### Extension discipline

New plane-prefixed tags (a third facet, a new form for origin
or span, a plane-scoped category field) **require PDR
amendment** — either an amendment to this PDR or a superseding
PDR. The vocabulary's value is its smallness and stability;
ad-hoc extension defeats both. Capture the need in the
pending-graduations register with an amendment trigger-
condition rather than inventing a tag on-the-fly.

Adding new **plane values** (e.g. introducing a fourth plane)
does not require amendment of this PDR; it requires amendment
of the taxonomy PDR that defines the planes. This PDR is
plane-agnostic in values; it is strict only in shape.

## Rationale

### Why origin and span as the two facets

Observing the two live use cases: PDR-028's origin tag answers
"which plane's drift produced this observation?" — a sourcing
question about an individual capture event. PDR-029's span tag
answers "does this recurring pattern cross the seams between
planes?" — a structural question about accumulated artefacts.

The two questions are both load-bearing and neither reduces to
the other. A single observation has one origin; it does not
have a span (span is a property of patterns, not of
observations). A pattern has a span; it does not have a single
origin (it was extracted from many observations, each with
their own). Forcing them into one vocabulary element would
produce unclear semantics — the result would be a tag whose
meaning depends on what it's attached to, which is the exact
failure mode vocabulary standardisation is meant to prevent.

### Why inline for origin and frontmatter for span

Origin tags are attached to **ephemeral, dense content**
(napkin entries are short, many per session, authored fast).
Inline tagging lets the capture be one line and keeps the tag
colocated with the content it describes. Frontmatter would be
overkill for a single-line entry and would fragment the flow
of the capture surface.

Span tags are attached to **promoted, structured artefacts**
(patterns, PDRs, rules — authored deliberately, fewer per
session). Frontmatter is the standard authoring surface for
metadata on these artefacts; adding a boolean is the smallest
possible addition to existing conventions.

The two surface choices are not interchangeable without loss.

### Why conditional applicability

A host with a single memory plane has nothing to distinguish.
Mandating plane tags on such a host would add noise without
signal. The conditional scope matches the convention to the
structural precondition that makes it meaningful.

This is the same shape as PDR-028's conditional scope
("executive memory mode or equivalent concept"): portability
without universality — the convention travels to hosts that
have the structural precondition, and lies dormant on hosts
that do not.

### Why extension requires amendment

New plane-prefixed conventions would accrete under pressure
unless the vocabulary was fixed. An amendment-required
discipline converts the continuous decision ("should I invent a
new plane tag?") into a discrete trigger event ("I would need
to write an amendment") — which is itself a tripwire per the
Heath-brothers framing in PDR-029. The friction of the
amendment requirement is the point: it forces consideration
before addition.

### Alternatives rejected

- **Single unified plane tag with variant suffixes** (e.g.
  `plane: source=executive` vs `plane: span=[active,
  executive]`). Rejected — compresses two distinct semantic
  roles into one surface shape, producing tags whose meaning
  depends on parsing rather than recognition.
- **Free-form tagging without canonical forms.** Rejected —
  reproduces the fragmentation the PDR is installed to
  prevent.
- **Wait for a third use case before standardising.** Rejected —
  the bundle that introduced the first two uses is the right
  moment to codify. Waiting produces the classic
  "passive-guidance-loses-to-artefact-gravity" failure: the
  rule would be authored after the drift had already
  accumulated.
- **Make the vocabulary universal rather than conditional.**
  Rejected — adds noise on single-plane hosts without
  corresponding signal.

## Consequences

### Required

- Hosts with multi-plane memory organisation use `Source
  plane: <plane-name>` inline on capture-stage entries that
  originate from a specific plane.
- Hosts with multi-plane memory organisation use
  `cross_plane: true` (and optionally `planes: [<plane>,
  <plane>]`) as frontmatter on graduation-stage artefacts
  that span two or more planes.
- Consolidation workflows on multi-plane hosts name both
  tags as inputs to the cross-plane scan step.
- Introducing any new plane-prefixed tag (third facet, new
  form, new field name) requires amendment to this PDR or a
  superseding PDR.

### Forbidden

- Inventing new plane-tag forms on-the-fly under pressure
  (e.g. `origin_plane:`, `from-plane:`, `plane-scope:`).
  Capture the need in the pending-graduations register with
  an amendment trigger-condition; do not invent.
- Using the origin tag on graduation-stage artefacts or the
  span tag on capture-stage entries. The surface-to-facet
  mapping is load-bearing.
- Applying the vocabulary on single-plane hosts; it carries
  no information there.

### Accepted costs

- **Vocabulary calcification risk.** A stable vocabulary
  resists extension; if the underlying taxonomy evolves
  faster than the vocabulary, the vocabulary becomes a mild
  friction. Family B meta-tripwires (PDR-029) surface this
  condition when the taxonomy itself needs review; the
  friction against vocabulary extension is the intended
  signal.
- **Minor duplication.** An observation that is both
  origin-tagged (it came from executive plane) and will
  eventually feed into a span-tagged pattern carries
  information twice. This is not waste — the origin is a
  per-observation fact and the span is a per-pattern fact;
  the duplication is the normal shape of routing
  information through the capture → graduate pipeline.

## Notes

### Composition with PDR-028 and PDR-029

- **PDR-028** introduces the origin tag for executive-memory
  drift capture. PDR-030 generalises the tag form so other
  planes (active-origin corrections, operational-origin
  continuity surprises) can use the same shape without
  vocabulary drift.
- **PDR-029** introduces the span tag as a Family B Layer 2
  accumulation signal. PDR-030 fixes the canonical form so
  the accumulation signal is scan-reliable over time.
- Together the three PDRs form a coherent set: PDR-028 names
  the executive feedback channel and its entry tag; PDR-029
  names the tripwire family that reacts to span-tag
  accumulation; PDR-030 fixes the vocabulary both consume so
  their composition remains stable.

### Plane-value taxonomy not decided here

This PDR is agnostic about *which* planes exist. The
three-mode arrangement (active / operational / executive)
referenced in sibling PDRs is one valid plane taxonomy; a host
with a different taxonomy (e.g. a four-mode arrangement with a
distinct "ephemeral" and "active-distilled" split) uses that
host's plane identifiers in the `<plane-name>` slot. The
plane taxonomy itself lives in host doctrine or in a dedicated
PDR that any multi-plane host adopts; this PDR governs only
the tag vocabulary attached to whichever taxonomy the host
uses.

### Graduation intent

Like PDR-011, PDR-026, PDR-027, PDR-028, and PDR-029, this PDR's
substance is a candidate for eventual graduation into
`practice.md` (vocabulary section) once the tag vocabulary has
been exercised across multiple cross-repo hydrations.
Graduation marks the PDR `Superseded by <Core section>` and
retains it as provenance.

### Authoring provenance

This PDR originated as an owner-decision item surfaced by the
Session 3 bundle's docs-adr-reviewer pass (OWNER-DECISION 1):
the reviewer observed that the sibling PDR-028 and PDR-029
were introducing two distinct plane-aware tags without a
coordinating vocabulary, and flagged the risk of fragmentation
if the vocabulary was not fixed before the tags landed. The
owner accepted the recommendation and directed that the
vocabulary be codified in the same bundle rather than deferred.
This note is retained for historical provenance; the Rationale
above stands on its own merits.

### Host-local context (this repo only, not part of the decision)

At the time of authoring:

- The origin tag `Source plane: executive` lands on
  `.agent/memory/active/napkin.md` as part of the Phase 3
  installs of the memory-feedback execution plan.
- The span tag `cross_plane: true` lands as a frontmatter
  field on `.agent/memory/active/patterns/` per the Phase 5
  installs of the memory-feedback execution plan.
- The plane taxonomy in force is the three-mode arrangement
  (active / operational / executive) ratified as a Standing
  decision on 2026-04-21.
- The amendment-required discipline for new plane tags is
  enforced by the pending-graduations register at
  `.agent/memory/operational/repo-continuity.md` — any
  plane-tag proposal becomes a register item with a PDR
  amendment as its graduation target.
