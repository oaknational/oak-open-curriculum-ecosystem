---
pdr_kind: governance
---

# PDR-031: Build-vs-Buy Attestation Pre-ExitPlanMode

**Status**: Accepted
**Date**: 2026-04-21
**Related**:
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — this PDR adds an attestation gate at the
planning-mode exit boundary);
[PDR-015](PDR-015-reviewer-authority-and-dispatch.md)
(reviewer authority and dispatch — the plan-time reviewer phase
this attestation is enforced by, per PDR-015 §Reviewer phases
aligned to lifecycle plan-time row);
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(grounding discipline — the attestation is grounded against current
external reality, not plan-write-time recollection);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(perturbation mechanisms — Family-A tripwires; this attestation is a
plan-exit Family-A tripwire candidate against the
`build-because-not-found-before-checking` failure mode).

## Context

Agentic plans frequently propose to **build** a capability (a
library, a script, a service, a parser, a tool) when an
**already-existing** capability would have served. The pattern
repeats across multiple sessions: the plan body assumes nothing
suitable exists, proposes a build, and proceeds past the planning
phase without ever explicitly checking the alternative.

Three observed failure shapes:

1. **Plan-write-time recollection used as evidence of absence.**
   The plan author "doesn't recall a library that does this" and
   takes that as evidence none exists. Recall-as-evidence-of-absence
   is unreliable; the search for an existing tool was never
   performed.
2. **Mid-plan build-mode lock-in.** Once the plan has framed the
   work as a build, mid-plan reviewers focus on build quality
   (architecture, tests, error handling) rather than questioning
   whether the build was warranted in the first place. The earlier
   the build framing locks in, the harder it is to reverse.
3. **Post-implementation discovery.** Only after the build is
   complete does someone notice that an off-the-shelf library would
   have replaced 80% of it. The cost of discovery is the entire
   build cost, plus the cost of either retiring the build or
   carrying a custom replacement of standard infrastructure
   forever.

Underlying cause: the planning workflow has no explicit
**attestation moment** at which the plan author asserts, with
evidence, that the build path was preferred over the buy path
(where "buy" includes off-the-shelf libraries, vendor SDKs,
existing internal tools, and existing patterns elsewhere in the
codebase). Without an attestation gate, the omission is invisible
until the build is complete.

## Decision

**Before exiting planning mode (i.e. before any plan that proposes
building a non-trivial new capability is approved for execution),
the plan body MUST carry a build-vs-buy attestation that names what
was searched, what was found, and why building was preferred over
buying.**

### What triggers the attestation

The attestation is required when a plan proposes to **build** any
of:

- A library (in-repo or to be published).
- A non-trivial script or CLI tool (more than glue around existing
  tools).
- A service, daemon, or background worker.
- A parser, validator, or serialiser for a non-trivial format.
- A protocol implementation.
- A non-trivial integration (e.g. a custom HTTP client wrapping a
  vendor API beyond what their SDK provides).
- Any new abstraction layer (adapter, wrapper, façade) that
  duplicates substantial behaviour available elsewhere.

The attestation is NOT required when the plan proposes:

- Wiring up an existing library to a specific consumer.
- Writing tests for existing behaviour.
- Bug fixes, configuration changes, refactors that do not
  introduce a new capability.
- Trivial scripts (one-shot utilities under ~20 lines).

The attestation IS required when the build is small but the
**concept** is reusable — small builds that re-implement
standard infrastructure are exactly the items most likely to
have a buy alternative the plan author missed.

### Required attestation contents

The attestation lives in the plan body, in a named section
(suggested heading: `## Build-vs-buy attestation`). It carries:

- **What was searched**: named registries, package indexes, vendor
  SDK catalogues, and internal codebase locations the author
  consulted (with concrete search terms, not "I looked").
- **What was found**: candidate libraries, vendor capabilities, or
  existing internal patterns identified by the search, with brief
  notes on each.
- **Why building was preferred**: explicit trade-off statement
  naming the property the build provides that the buy alternatives
  do not (e.g. licence compatibility, type-system fit, performance
  envelope, security posture, integration cost). "I didn't find
  one" is not an acceptable rationale; the search must have
  occurred and found candidates that were rejected on named
  grounds, OR the search must be documented as having found
  nothing across the named registries.

If the search legitimately found nothing, the attestation says so
explicitly: *"Searched npm registry for `<terms>`; reviewed the
top-N matches; none provided `<required-property>`. Searched the
internal codebase for `<terms>`; no existing implementation."*
This makes the absence-of-buy claim falsifiable at review time.

### Where the attestation lands

For plans authored in `.agent/plans/`, the attestation is a
section in the plan body, surfacing immediately after the plan's
context/scope section and before its task breakdown. For plans
authored in tools that surface a discrete planning-mode artefact
(e.g. Claude Code's plan-mode), the attestation lives in the
plan-mode artefact itself, prior to plan approval.

The attestation is part of the plan; it is reviewed by the
planning reviewer dispatch (per PDR-015) alongside the rest of
the plan.

### Pre-exit gate

A plan that proposes to build a triggering capability is **not
ready to exit planning mode** until the attestation is present.
Reviewers (sub-agent or owner) reviewing the plan check for the
attestation and reject the plan back to planning if absent.

## Rationale

**Why an explicit attestation, not a soft guideline.** The
failure mode is exactly that the plan-author's recall is unreliable
*and the unreliability is invisible at plan-write time*. A soft
guideline ("consider whether something exists") relies on the
agent noticing what they did not check; an explicit attestation
forces the check by requiring named search artefacts.

**Why pre-exit-planning-mode, not pre-implementation.** Once a
plan has been approved and execution has started, the build framing
is sunk cost. Reviewers in implementation mode focus on whether the
build is well-done, not on whether it should exist. The cheapest
moment to catch an unwarranted build is at planning approval, when
the build cost is still hypothetical.

**Why the attestation is falsifiable.** "I checked and found
nothing" is not an attestation; "I searched npm for `<terms>`,
reviewed top-N matches, none provided `<property>`" is. The first
is unfalsifiable; the second can be checked at review by any
reviewer running the same search.

**Why this PDR is separate from PDR-018 (planning discipline).**
PDR-018 governs the broad shape of plans (structure, sequencing,
acceptance criteria). The build-vs-buy attestation is a specific
pre-exit gate at one lifecycle moment. It composes with PDR-018
but is load-bearing in its own right — the failure mode it
prevents is distinct from the failure modes PDR-018 addresses.

Alternatives rejected:

- **Soft guideline only.** Repeat-failure-rate is the evidence
  this is insufficient.
- **Attestation at implementation start.** Sunk-cost framing
  takes over before this gate fires.
- **Attestation only for "large" builds.** Size is a poor
  predictor; small builds of standard infrastructure are exactly
  where buy-alternatives are commonest.

## Consequences

### Required

- Every plan that proposes building a triggering capability
  carries a build-vs-buy attestation in its body.
- Reviewers (sub-agent or owner) reviewing the plan check the
  attestation; absence is a planning-mode-blocker.
- The attestation names searched-locations, found-candidates, and
  preferred-build-rationale concretely enough to be falsifiable
  at review.

### Forbidden

- Exiting planning mode on a triggering plan without the
  attestation.
- Recall-as-evidence-of-absence ("I don't think anything exists")
  in the attestation slot.
- Treating the attestation as boilerplate; the named-search-terms
  and named-candidates make the attestation specific.

### Accepted cost

- A small added planning-time cost (running the search and
  documenting it). Justified by the cost of a single
  unnecessary build.
- Reviewers must read and assess the attestation. Justified by
  the same.

## Notes

### Graduation intent

This PDR's substance is a candidate for eventual graduation into
`practice.md` (the planning section) once the attestation
discipline has been exercised across multiple cross-repo
hydrations. Graduation marks the PDR `Superseded by <Core
section>` and retains it as provenance.

### Host-local context (this repo only, not part of the decision)

At the time of authoring:

- Plans live in `.agent/plans/`. The attestation section MUST
  appear after `## Context` (or equivalent scope-setting section)
  and before the first task or phase section.
- Sub-agent reviewers used to assess plans against this PDR include
  `assumptions-reviewer` (broader plan assumptions audit) and the
  domain-specialist reviewer most relevant to the proposed build
  (e.g. `architecture-reviewer-*` for structural builds).
- Originating instance: 2026-04-21 mid-Session-4 owner direction
  retracting an earlier build-mode plan when the existence of a
  suitable off-the-shelf alternative surfaced post-plan-approval.
  Captured in the retracted standing-decisions register entry
  `build-vs-buy-attestation-required-pre-exitplanmode` and
  graduated to this PDR in 2026-04-21 Session 5 per the
  decomposition arc.
