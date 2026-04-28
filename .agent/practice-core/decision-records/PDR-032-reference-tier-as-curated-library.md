---
pdr_kind: governance
---

# PDR-032: Reference Tier as Curated Library

**Status**: Accepted
**Date**: 2026-04-22
**Related**:
[PDR-007](PDR-007-practice-core-bounded-package-contract.md)
(ephemeral-exchange contract — defines what `practice-context/`
is for and what it is not for; this PDR defines the destination
tier that absorbs material that graduates out of `outgoing/`);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation discipline — the §Graduation-target routing pattern
provides the routing logic that decides when something belongs in
`reference/` vs `research/` vs PDR vs rule vs other surface);
[PDR-023](PDR-023-documentation-structure-discipline.md)
(documentation structure discipline — `reference/` is one of the
documentation tiers that this discipline governs);
[PDR-024](PDR-024-vital-integration-surfaces.md)
(vital integration surfaces — `reference/` becomes vital once the
gate is in place because the gate creates a process-shaped surface
that downstream workflows depend on for discoverability).

## Context

Across this Practice's history, `.agent/reference/` accumulated
material whenever a candidate document was "not an ADR, not a plan,
not a research note, not memory, not doctrine" — i.e., it became
the residual catch-all for material that didn't fit any other tier.
Pre-Session-6 (2026-04-22), the directory held ~35 files across 13
subdirectories with no shared definition of what belonged there or
what process gated additions.

Three observable failure modes of the catch-all-by-default tier:

1. **Discoverability degrades silently.** Without a curating
   convention, the index README accumulates flat tables of every
   subdirectory, and readers cannot predict whether a topic will be
   found in `reference/`, `research/`, executive memory, a deep-dive
   under `reports/agentic-engineering/`, or in the practice-core
   itself. The cost is non-zero search work on every read.

2. **Aging discipline is absent.** Some material is genuinely
   evergreen (long-form references that age slowly); some is
   time-bound (work-to-date snapshots that go stale within weeks).
   The catch-all tier offered no signal about which kind a given
   file was, and no expiry/promotion mechanism. Old time-bound
   material pollutes the tier and degrades the trust signal of
   evergreen material.

3. **No graduation gate.** Material landed in `reference/` whenever
   an author thought "this should be referenceable later" — but the
   threshold was author-subjective, not process-tested. Result:
   fragmentary notes, single-session captures, and incomplete
   investigations co-existed with deliberate, owner-vetted
   reference material.

The Session-6 closing arc (2026-04-22) on the `memory-feedback`
thread surfaced the failure modes during the Phase-C outgoing-triage
pass: three `practice-context/outgoing/` files needed homes per
PDR-007, but proposing they land in `reference/` made it visible
that `reference/` lacked the definitional spine to absorb them
deliberately. The owner's resolution: reform `reference/` as a
deliberate, curated tier; relocate the entire pre-existing accumulation
to a holding bay (`research/notes/`) so the new tier could start
under definition; gate future additions on the new process.

## Decision

**`.agent/reference/` is a curated library tier.** It holds
deliberately-promoted, evergreen, owner-vetted material that
read-to-learn workflows will consult repeatedly. Material that does
not meet all three criteria does not belong in `reference/`.

### Definition (what `reference/` is)

A library document under `reference/` is:

- **Deliberately promoted.** A specific landing event (commit,
  session, decision) records why this document was promoted into
  the tier. Promotion is not the default disposition for any
  candidate — the default for fresh material is `research/`,
  `analysis/`, or `reports/`, depending on the candidate's lifecycle.
- **Evergreen.** The substance ages slowly. Time-bound material
  (work-to-date snapshots, dated progress reports, in-flight
  investigation notes, single-session syntheses) does not belong
  here. Material that requires republication every quarter is not
  reference.
- **Owner-vetted.** The owner has explicitly accepted the document
  AS reference material — not just acknowledged that it exists.
  Acceptance is recorded by either an owner-approved promotion
  proposal or an owner-authored landing event.

The tier is **read-to-learn**, not write-to-coordinate. Coordination
surfaces (memory, plans, threads) live in their own tiers; reference
is consulted when a reader needs to understand a topic, not when an
author needs to record a decision.

### Lightweight process (how things land)

Promotion into `reference/` follows three steps:

1. **Substantiate.** The candidate's substance must already exist
   somewhere — `research/`, `analysis/`, `reports/`, an outgoing
   exchange under `practice-context/outgoing/`, or in a session's
   active memory. New material is not authored directly INTO
   `reference/`; it is promoted FROM somewhere.

2. **Justify.** A promotion proposal records:
   - **Why this is reference and not research.** What read-to-learn
     workflow consults it, and why other tiers are insufficient.
   - **Why this is evergreen.** What gives the substance durable
     value (a stable abstraction, a portable contract, a
     well-understood phenomenon).
   - **Where it lives within `reference/`.** Either an existing
     subdirectory (with rationale) or a new subdirectory (with
     rationale for adding the subdirectory).
   The proposal can be in-line in a session message, in a plan body,
   or in a commit message — there is no required format. What
   matters is that the three justifications are explicit and
   inspectable post-hoc.

3. **Owner-vet.** The owner explicitly approves promotion. Once
   approved, the document is moved (with `git mv` to preserve
   history) and cross-references are updated.

The process is **deliberately lightweight** — it adds three
explicit checks but does not require formal RFCs or PDR-style
records. The weight is in the owner-vet step; the substantiate +
justify steps prepare the owner for an informed decision.

### Subdirectory discipline

`reference/` subdirectories are **thematic clusters of evergreen
material**, not file-type silos. A subdirectory exists when:

- Three or more documents will share it (sub-bin discipline:
  one-off material does not justify a directory), AND
- The cluster has a stable theme that readers will recognise (the
  theme is the read-trigger, not the author's authoring-time
  taxonomy).

A subdirectory's `README.md` (when present) explains the theme
and lists the documents with one-line summaries — it does not
duplicate substance.

### Aging gate

Material in `reference/` is reviewed **at least once per
holistic-fitness-exploration pass** (PDR-026 §Per-session landing
commitment + the consolidate-docs command rubric). The review asks:

- Is this still evergreen, or has reality moved past it?
- Is this still owner-vetted, or has the owner's stance shifted?
- Is this still consulted, or has the read-trigger evaporated?

A negative answer on any axis triggers de-promotion (move to
`research/notes/`, archive, or delete) — material is not retained
in `reference/` purely because it was once promoted.

### Holding bay

`.agent/research/notes/` is the holding bay for material that may
warrant promotion but has not yet passed the gate, OR for material
that was previously in `reference/` but lost the criteria. It is
explicitly transient — material lives there until per-file
disposition decides its forward home (research subdirectory,
reference promotion, executive memory, archive, or delete).

The holding bay is described in `research/README.md`. When the
holding bay is empty, the entry is removed and the bay is retired
until the next reformation pass.

## Consequences

### Positive

- **Discoverability**: readers who consult `reference/` know they
  are reading owner-vetted, evergreen material. Trust signal is
  high.
- **Aging hygiene**: the aging gate prevents stale-material
  accumulation; the tier stays trustworthy as the Practice evolves.
- **Coordination clarity**: `reference/` is no longer the catch-all,
  so authoring decisions become more deliberate ("does this belong
  in research, or do I want owner promotion to reference?").
- **Holding bay model is reusable**: future tier reformations
  (e.g., `analysis/`, `reports/`) can use the same holding-bay
  pattern to relocate ad-hoc accumulations under definition.

### Negative / costs

- **Promotion friction**: authors who want material referenceable
  cannot just drop it in `reference/`; they must propose and the
  owner must vet. Cost is small per-event, real in aggregate.
- **Holding-bay overhead**: `research/notes/` exists as a transient
  surface that must be periodically drained. If draining stalls,
  the bay accumulates and becomes its own catch-all. Mitigation:
  the rehoming plan
  (`agentic-engineering-enhancements/archive/completed/reference-research-notes-rehoming.plan.md`,
  archived 2026-04-22 Session 8 with full execution record:
  22 MOVED + 4 DELETED + 1 KEPT, bay reduced to single residual
  `prog-frame/` item awaiting owner disposition) executed the
  first drain pass and is the precedent for subsequent drains.
- **Definition ambiguity at edges**: some material is genuinely
  hard to classify (e.g., long-form how-to notes that age slowly
  but are not strictly read-to-learn). The tier's definition
  accepts that edge cases will require owner judgement; the gate
  is the resolution mechanism, not a test that always returns
  yes/no automatically.

### Compose-with

- **PDR-007 §Outgoing contract**: outgoing material that needs a
  durable destination MAY graduate into `reference/` per this PDR,
  but only if the substantiate/justify/owner-vet steps are followed.
  Mechanical movement out of `outgoing/` into `reference/` to
  satisfy PDR-007's "substance lives somewhere" check is NOT
  promotion under this PDR.
- **PDR-014 §Graduation-target routing**: when routing decides
  "this is library material" the routing produces a candidate
  promotion under this PDR; the routing decision is not itself
  the promotion event.
- **PDR-023 §Documentation structure**: this PDR refines the
  `reference/` row of documentation structure discipline — the
  row was previously a catch-all; this PDR makes it a curated
  tier with an explicit gate.

## Notes

### Source decision context

The reformation was decided on the `memory-feedback` thread,
Session 6, 2026-04-22, during Phase-C outgoing triage. The
Session-6 plan attempted to land three outgoing files into
`reference/`; the owner stipulated that adding new material made
the catch-all status visible and untenable, and required:

1. Existing material relocated to `research/notes/` first
2. A plan to find better homes for that relocated material
3. The new `reference/` tier defined with definition,
   lightweight process, and integration into other surfaces

This PDR is the definition + lightweight process; the integration
into other surfaces is executed in the same session
(practice-bootstrap.md, practice.md, AGENT.md, AGENTS.md,
CLAUDE.md, orientation.md, executive-memory artefact inventory);
the rehoming plan was archived 2026-04-22 Session 8 at
`agentic-engineering-enhancements/archive/completed/reference-research-notes-rehoming.plan.md`
with full execution record.

### Class A.1 firing verdict

Plan-body-first-principles-check applied to this PDR body:

- **Positive form**: the body states what `reference/` IS
  (curated library tier, three criteria, three-step process),
  not a list of what is forbidden.
- **Genuine substance**: the criteria (deliberate / evergreen /
  owner-vetted) are testable per-document; the process is
  inspectable post-hoc; the aging gate creates a real loop.
- **Routing per PDR-014**: this PDR is the right destination —
  governance decision (defines an artefact tier and its gate),
  load-bearing across multiple surfaces, portable across the
  Practice network. Not a rule (rules are atomic per-action
  checks); not a principle (principles are universal stances,
  not artefact-tier definitions); not a command (commands
  invoke this PDR's process, they don't replace it).

### Out of scope

- This PDR does not decide what specific material belongs in
  `reference/` going forward. Those decisions are per-document
  promotions under the gate.
- This PDR does not retroactively re-promote any of the relocated
  material. The rehoming plan handles per-file disposition for
  the holding-bay contents.
- This PDR does not prescribe a fixed promotion-proposal format.
  The substantiate/justify/owner-vet steps are required; the
  surface (in-line message, plan body, commit message, dedicated
  proposal file) is owner-discretion.
