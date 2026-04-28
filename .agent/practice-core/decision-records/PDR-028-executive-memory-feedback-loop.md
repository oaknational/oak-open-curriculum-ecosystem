---
pdr_kind: governance
---

# PDR-028: Executive-Memory Feedback Loop

**Status**: Accepted
**Date**: 2026-04-21
**Operationalising rule** (host-local): the `active → executive`
path named in this PDR is operationalised in this repo by
[`.agent/rules/executive-memory-drift-capture.md`](../../rules/executive-memory-drift-capture.md)
(installed Session 4 Task 4.5, 2026-04-21). Portable adopters
install the equivalent rule under their own canonical rule path.
**Related**:
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(the surprise pipeline — executive-memory drift is a form of
surprise that must enter the pipeline);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation and knowledge flow — the loop back into active/
memory is a consolidation input);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads and sessions — drift capture happens within a session
on a named thread);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(perturbation-mechanism bundle — Family B accumulation signal
consumes the plane-tag graduation channel this PDR defines);
[PDR-030](PDR-030-plane-tag-vocabulary.md)
(plane-tag vocabulary — fixes the canonical form of
`Source plane: <plane>` and the span tag used by the Family B
accumulation signal so both surfaces stay scan-reliable).

## Context

A Practice-bearing repo typically organises agent memory into
distinguishable modes. A three-mode arrangement is:

- **Active memory** — learning loop (napkin / distilled /
  patterns): continuous capture during sessions, fitness-governed
  rotation.
- **Operational memory** — continuity / session-resume state:
  refreshed per session.
- **Executive memory** — stable organisational contracts and
  catalogues: artefact inventories, reviewer catalogues,
  platform-adapter matrices. Executive memory is *looked up* when
  taking a specific action, not internalised before every
  session.

Active and operational memory have obvious feedback loops. Active
memory *is* the learning loop (capture → distil → graduate →
enforce); operational memory is refreshed every session-handoff;
both have explicit rituals that produce writes.

**Executive memory is structurally different.** It is a
catalogue: written once when the artefact architecture evolves,
consulted repeatedly thereafter. Under a naïve reading, executive
memory has no feedback loop — it is a read-only reference. This
reading produces a failure mode:

> A session consults an executive surface (e.g. the reviewer
> catalogue), finds the surface stale (a reviewer has been
> renamed; a pattern has been superseded; a matrix row no
> longer reflects reality), uses its judgement to route around
> the drift, and the session closes. The drift is silently
> preserved: no mechanism captured it, no consolidation will
> re-visit it, and the next session that consults the surface
> will encounter the same stale state.

The underlying cause: executive memory lacks a **drift-capture
channel**. Without one, accuracy degrades monotonically over
time and no feedback signal reaches the capture → distil →
graduate → enforce pipeline that would repair it.

The gap is real regardless of how executive memory is organised
(flat files, tagged sections, per-surface README). What matters
is the presence or absence of a capture channel, not the shape of
the catalogue.

## Decision

**Executive memory is part of the Practice's feedback loop, not
outside it. Each executive-memory surface carries a
drift-detection section; drift observations graduate through the
ordinary capture-distil-graduate pipeline via a named channel.
The loop runs at lookup cadence, not refresh cadence.**

### The drift-detection surface convention

Every executive-memory surface carries a short, structured
section near the top. The section uses `## Drift Detection`
on the surface itself; shown below as an indented block to
avoid affecting the structure of this PDR:

    ## Drift Detection

    **Last verified accurate**: YYYY-MM-DD

    ### Known drift / pending update

    - [no entries]

Three rules govern the section:

1. **Lookup-time verification.** On any lookup that confirms the
   surface is still accurate, the consulting session updates
   `Last verified accurate` to today's date. Passive consumption
   without drift is an affirmative signal; recording the
   verification closes the loop on "still-accurate" as a
   first-class outcome.
2. **Lookup-time drift capture.** On any lookup that surfaces
   drift, the consulting session adds a `Known drift` bullet
   naming what is stale and a **trigger-condition** that will
   move the item out of the drift list (typically: an entry in
   the pending-graduations register with its own trigger).
3. **No silent drift resolution.** When drift is corrected, the
   corresponding `Known drift` bullet is removed in the same
   edit that lands the correction. An empty list is the healthy
   state.

### The graduation channel

Drift observations enter the feedback loop through a **plane-tag
capture convention** in active memory. The convention:

> When a napkin entry originates from a stale or drifted
> executive-memory surface, tag it with a `Source plane:
> executive` marker (or equivalent).

The **pending-graduations register** is the host's named surface
that aggregates graduation candidates between the distil and
graduate stages of the capture → distil → graduate → enforce
pipeline (see PDR-011). Each register entry carries a
trigger-condition that fires the graduation action; the register
is reviewed and refreshed at every session-handoff and is a named
input to the consolidation workflow. Its host-local placement
and exact schema are named in the Host-local context below.

At consolidation (see PDR-014 and PDR-011 pipeline stages),
tagged napkin entries are aggregated into the pending-graduations
register with the drift's remediation as their trigger-condition.
From the register, the drift moves through the ordinary
capture-distil-graduate pipeline:

```text
executive-surface drift
  → napkin capture (tagged: Source plane: executive)
  → consolidation aggregation (cross-plane scan)
  → pending-graduations register (trigger-condition named)
  → graduation action (edit the executive surface; remove the
    Known-drift bullet; update Last-verified)
```

The pipeline preserves the existing graduation bars at each
stage. Executive-surface edits are *still* executive-memory
edits, subject to whatever care-and-consult discipline the host
repo applies. What the channel adds is an **explicit entry
point**: drift enters the loop by being tagged, not by being
recalled at some later session.

### The cross-plane scan

Consolidation's cross-session scan is extended to a **cross-plane
scan**. Beyond asking "what cross-session patterns emerged?",
consolidation also asks:

> Across the three memory planes, what did active/, operational/,
> and executive/ observe this session or session-set that only
> becomes visible when read together? Cross-plane patterns —
> contradictions, redundancies, liminal observations that no
> single plane owns — are candidates for graduation just as
> cross-session patterns are.

The cross-plane scan is where executive-drift entries become
part of institutional learning rather than just a patch to a
catalogue. If a reviewer catalogue entry drifts because an
underlying ADR was superseded and the superseding ADR did not
propagate to the catalogue, the cross-plane observation is
"our ADR-to-catalogue propagation is unreliable" — a
graduation-candidate pattern or rule, not merely a
catalogue edit.

### Lookup cadence, not refresh cadence

Active and operational memory have **refresh cadences**: entries
rotate, are archived, are re-authored on a known schedule.
Executive memory does not. Its cadence is **lookup cadence**:
the loop fires whenever a session consults a surface. The
cadence is therefore passive and session-driven, not scheduled.

Three consequences:

- A surface that is never consulted is also never verified. This
  is correct: a never-consulted surface has no load-bearing role
  until it is consulted, and the verification at first
  consultation is sufficient to restart the clock.
- A surface consulted many times in rapid succession is
  verified many times. This is also correct: repeated lookups
  are the main consumer; their verifications are the primary
  signal.
- A surface consulted by a sub-agent is still verified by the
  consulting session. Authority for editing the surface remains
  with whichever discipline the host applies to executive-memory
  edits (typically the PDR-003 care-and-consult protocol); drift
  observation and the verification-date update itself are
  routine consultation activities, not protected edits. The
  distinction matters: the drift-capture bullet names the
  drift; the corrective edit still flows through the host's
  ordinary edit discipline.

## Rationale

### Why executive memory needs a feedback loop at all

The alternative is accepting monotonic accuracy decay. A
catalogue that is never corrected loses accuracy at the rate of
underlying change. For artefact inventories, reviewer
catalogues, and adapter matrices — surfaces that describe
*current* conventions — decay is corrosive: agents routed by the
surface are routed wrongly, and the wrong routing looks
authoritative because the surface looked authoritative.

Passive acceptance of decay ("we'll catch it when someone
notices") is the current failure mode. Naming the loop makes
noticing into a capture step instead of a silent patch.

### Why a convention rather than automation

A scheduled script that re-verified every executive surface
would have to decide what "accurate" means for each surface —
a problem that cannot be automated without re-implementing the
surface's domain knowledge. Manual, lookup-time verification
defers the accuracy judgement to the agent that is already
doing the judgement (to decide whether the surface is useful
for the current action).

The convention is cheap: a `Last verified accurate` line is
trivial to update. Automation would be expensive and would
reintroduce the "trust the surface without reading it" failure
mode against a new target.

### Why the graduation channel uses the plane tag

Tagging the capture at source (at napkin-entry time) solves the
routing problem at the point where it is cheapest to solve.
Every napkin entry has a source; tagging it is one line. The
alternative — letting consolidation rediscover executive-origin
observations by pattern-matching over unannotated napkin
content — is strictly more expensive and more error-prone.

The plane-tag convention composes with existing consolidation
machinery: the cross-plane scan already aggregates
multi-plane observations, and the pending-graduations register
already carries trigger-conditions. The channel uses these
rather than introducing new surfaces.

### Why cross-plane scan is the scope

Cross-*session* patterns are the existing consolidation concept
(same plane, many sessions). Cross-*plane* patterns are
necessarily hidden when each plane is examined in isolation. A
session that notices executive drift while doing operational
work has produced a cross-plane observation (active-capture of
executive-drift surfaced during operational work). Naming the
scope makes the pattern greppable and surfaces it during
consolidation rather than letting it dissolve into the napkin.

### Why this must be portable

Executive-memory feedback is a property of any Practice-bearing
repo that organises its memory into modes with different refresh
characteristics. The decay dynamic does not depend on host
specifics; neither does the tag-based capture channel. A
host-local doctrine would not travel to a receiving repo
hydrating the Practice; the loop would have to be reinstalled
manually at every transplantation. A portable PDR inherits with
the Core package and activates on first consolidation.

### Alternatives rejected

- **Treat executive memory as genuinely write-once.** Rejected
  as described in Context: monotonic decay is corrosive.
- **Make executive memory refresh-per-session like operational
  memory.** Rejected — executive memory's value is its
  stability; refreshing every session would collapse it into
  operational memory and lose the "look up when taking a
  specific action" read-trigger that distinguishes it.
- **Automate drift detection with a scheduled script.**
  Rejected as described above: automating accuracy-judgement
  is a category error.
- **Use a separate drift-detection surface (e.g. a
  `drift-log.md`) rather than per-surface sections.** Rejected —
  splits the signal from the surface it governs. The
  per-surface section is colocated with the content that needs
  checking.
- **Rely on the existing surprise pipeline (PDR-011) without
  an executive-specific channel.** Rejected — without the plane
  tag, executive-origin surprises dissolve into the general
  surprise stream and lose the cross-plane observation
  structure.

## Consequences

### Required

- Every executive-memory surface carries a **Drift Detection**
  section at or near the top with a `Last verified accurate`
  field and a `Known drift / pending update` list.
- Sessions consulting an executive surface either confirm and
  update `Last verified accurate`, or capture drift as a
  `Known drift` bullet with a trigger-condition, or both.
- Napkin entries originating from executive-surface drift
  carry a `Source plane: executive` tag (or equivalent
  plane-tag convention) at capture time.
- Consolidation includes a **cross-plane scan** step that
  aggregates tagged observations into the pending-graduations
  register or promotes them to patterns.
- The loop back into active memory is documented in the
  executive-memory README (or equivalent entry surface) so that
  first-time consumers find the convention on first contact.

### Forbidden

- Executive-memory surfaces that omit the drift-detection
  section — drift becomes unrecoverable without the capture
  structure.
- Silent drift correction — editing an executive surface to fix
  drift without removing the corresponding `Known drift`
  bullet and updating `Last verified accurate` loses the
  lookup-time verification signal.
- Cross-plane observations discarded at consolidation because
  "no single plane owns them" — this is precisely the kind of
  observation the scan is meant to surface.
- Automated scripts that set `Last verified accurate` without
  a consulting session having actually consulted the surface.
  The verification is an affirmative human-or-agent judgement,
  not a mechanical freshness stamp.

### Accepted costs

- **Lookup overhead.** Updating the verification date is
  trivial; capturing drift is a few lines. Over time these
  costs compound into a meaningful corpus of drift captures,
  which is the point — the corpus is evidence of the loop
  functioning.
- **Empty-list maintenance.** `Known drift: [no entries]` is
  the healthy state and must be preserved as-is when the list
  is empty. Removing the heading when empty loses the
  convention's visibility to new contributors.
- **Per-surface section duplication.** Each surface carries the
  same section skeleton. The duplication is deliberate:
  colocating the drift-capture structure with the content it
  governs is what makes lookup-time capture cheap. A single
  central drift log would be cheaper to author but more
  expensive to consume at lookup time.

## Notes

### Composition with the three-mode memory arrangement

This PDR does not mandate a three-mode arrangement of memory.
It assumes the host repo *has* an executive-memory mode or
equivalent concept (a stable catalogue tier distinct from the
learning-loop tier and the continuity tier). A host repo with a
different memory layout can still apply the decision: the
convention attaches to "any catalogue surface consulted rather
than internalised", regardless of the enclosing taxonomy.

### Composition with the surprise pipeline (PDR-011)

PDR-011 names the capture → distil → graduate → enforce
pipeline. PDR-028 adds an *entry point* to that pipeline for a
class of observations (executive-surface drift) that would
otherwise not enter. It does not weaken the graduation bars; it
routes observations through them that previously did not
travel at all.

### Composition with per-thread-per-session landing (PDR-027)

Drift capture and verification happen *within* a session on a
*thread* (per PDR-027). A session that discovers drift captures
it against the thread's active memory; consolidation runs across
threads and sessions. The loop is therefore multi-thread by
construction — observations captured in one thread can
graduate during a consolidation that processes multiple threads
together.

### Graduation intent

Like other PDRs in the continuity family, this PDR's substance
is a candidate for eventual graduation into `practice.md`
(Knowledge Flow section) once the convention has been exercised
across multiple cross-repo hydrations. Graduation marks the
PDR `Superseded by <Core section>` and retains it as provenance.

### Host-local context (this repo only, not part of the decision)

At the time of authoring:

- Executive-memory surfaces in this repo:
  `.agent/memory/executive/artefact-inventory.md`,
  `.agent/memory/executive/invoke-code-reviewers.md`,
  `.agent/memory/executive/cross-platform-agent-surface-matrix.md`.
- The `Drift Detection` section installation on those three
  surfaces is scheduled as Phase 4 of the memory-feedback
  execution plan (see
  [`../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md)
  Tasks 4.1 and 4.2).
- The `Source plane: executive` tag convention lands on
  `.agent/memory/active/napkin.md` and is referenced by
  `.agent/commands/consolidate-docs.md` step 7a.
- The cross-plane scan lands as an extension to
  `.agent/commands/consolidate-docs.md` step 5, and a
  `cross_plane: true` frontmatter field is added to
  `.agent/memory/active/patterns/` convention.
- This repo's ADR-131 (*Self-Reinforcing Improvement Loop*)
  records the broader improvement-loop architecture; this PDR
  extends the loop's reach to executive memory. The ADR
  predated this PDR and remains authoritative for the full
  interaction map; the PDR is the portable fragment covering
  the executive-memory entry point specifically.
