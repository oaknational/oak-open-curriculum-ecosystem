---
ddr: DDR-008
iri: urn:uuid:e62b037b-4810-4fbd-9019-41503ac7f5eb
title: Floor conformance is a closed predicate
status: accepted
date: 2026-08-06
deciders: Director seat under owner delegation (2026-08-06)
edges:
  depends_on: [DDR-001, DDR-006]
  supersedes: []
  informed_by:
    - .agent/reports/design/oak-components-capability-floor-shaping-debate-2026-08-06.md
  related:
    - 'PR #783 — the capability floor document this shape supersedes in substance'
---

# DDR-008: Floor conformance is a closed predicate

## Context

The first capability-floor draft (PR #783) was a list of rows — honest
evidence, but open-ended: nothing defined what "meets the floor" means, how
a claim is checked, or what happens when evidence decays. The 2026-08-06
shaping debate closed the shape.

## Decision

Floor conformance is a **closed, mechanical predicate** (the v2 shape):

- **MEETS-FLOOR** is a conformance predicate with universe-level closure —
  every floor item is met-with-witness, or the artefact does not meet the
  floor; an exception never satisfies the predicate. Every unmet item is
  either cured or carried as a loud RELEASE-PERMITTED exception; nothing
  is silently out of scope.
- **Witnesses are defeasible**: each carries LIVE status bound to an
  artefact digest — it decays to non-witnessing when the artefact it
  witnessed changes or its evidence goes stale, and it can be manually
  suspended on severe credible evidence (two-key, below) — never rotting
  as a permanent claim.
- **RELEASE-PERMITTED** is loud on the estate and silent on user-facing
  artefacts: each invocation takes an owner card at the moment of
  invocation, a registry row naming surface, gap, warrant, closure
  condition, and horizon, and per-build CI visibility; the exception
  expires at its closure condition and re-cards if it outlives its
  horizon.
- **Suspension of a harm-class obligation needs two keys**, never one
  actor.
- Transformations over the floor are **versioned**; the coverage registry
  is **generated, never hand-authored**; claims live in a **single CLAIMS
  table**.

## Consequences

- The floor document is a database with prose, not an essay; its rewrite to
  this shape is directed by the shaping record.
- Conformance disputes resolve against the predicate and its witnesses, not
  against narrative.
- Floor growth (new rows above the reference-derived minimum, per DDR-006)
  extends the same predicate — there is no second conformance regime.

## Provenance

- Shaping record through §"The v2 final shape", closing the 2026-08-05/06
  floor conversation: owner ratifications of the intermediate positions, a
  cross-vendor challenge round, and the final shape decided at the Director
  seat under the owner's delegation (2026-08-06).
