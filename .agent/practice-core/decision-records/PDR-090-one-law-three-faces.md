---
pdr_kind: governance
---

# PDR-090: One Law, Three Faces — A Frame-Slip's Cure Is Always Return to the Source

**Status**: Accepted
**Date**: 2026-06-04
**Adopted**: 2026-06-04
**Related**:
[PDR-089](PDR-089-conservation-reflex-external-check.md)
(the conservation reflex — frame-*capture* recurs at every stage; this PDR
names the sibling structure for frame-*slip*: drift from the source recurs
across three artefact surfaces, and the cure has one shape);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(preserve first, restructure second — the writing face of this law);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(the three faces each already have an enforcement surface; this PDR unifies
the principle behind them, it does not add a fourth enforcement layer).

## Context

The Practice already holds three doctrines as separate rules, each authored to
counter a recurring failure in a different artefact surface:

- **Code** — `replace-dont-bridge`: derive from the single canonical owner;
  never land a compatibility bridge between a superseded contract and its
  replacement.
- **Architecture** — the seam-map law: seams *compose*, they are never
  *reconciled*. Because every junction input is a projection of one source of
  truth, junctions compose by construction; friction at a junction is the
  signal that an input has drifted from the root.
- **Writing** — `no-tombstones-for-removed-ideas`: state what the system *is*;
  do not memorialise a removed idea by naming it in order to reject it.

These read as three independent rules for three different problems. They are
not. Seen together they are one law observed from three sides, and recognising
the shared structure is load-bearing: it converts three separate acts of recall
into one diagnostic that fires the same way in any domain.

## Decision

**Every artefact — code, architecture, prose — is a projection of a single
source of truth. When friction appears at the artefact surface (a compatibility
bridge tempts in code, a junction will not reconcile in architecture, a removed
idea wants memorialising in prose), it is the same signal in every case: a
projection has drifted from its root. The cure is identical in shape across all
three faces — return to the source of truth, fix it upstream, and state the
present truth at the surface. Bridging in code, reconciling at a seam, and
memorialising in prose are the same downstream-patch error, and each is a
symptom that the upstream root was not corrected.**

The three faces of the one law:

| Face | Surface | Friction that signals drift | The one cure |
| --- | --- | --- | --- |
| Code | a contract / module / runtime path | the urge to keep old and new both working (a bridge) | move all callers to the single canonical owner; delete the superseded path |
| Architecture | a seam between deliverables / layers | a junction that will not reconcile without a matching layer | fix the input upstream at the source it projects from; the seam then composes by construction |
| Writing | a plan / ADR / PDR / rule / doc | the urge to keep a removed idea alive by naming it to reject it | state what the system is and stop; the removed idea is gone, not memorialised |

The unifying diagnostic: **friction at any of the three surfaces is never a
"hard thing to match up." It is evidence that a fundamental concept is
misaligned upstream.** The healthy response is to find the drifted projection
and correct it at its source, never to add a downstream patch (bridge, matching
layer, or memorial) that makes the misalignment liveable.

## Rationale

**Why unify three working rules into one principle.** The three rules already
fire correctly in their own domains. The unification adds a capability the
separate rules cannot: a single recognition cue that works *before* the
domain-specific rule is recalled. An agent who has internalised "friction
means a projection drifted from its root" recognises the failure shape in a
domain whose specific rule it has not yet reached for — and applies the same
upstream cure. The principle is the generalisation; the three rules are its
instances. Per the metacognition cure-shape (structural, not doc-patch), the
generalised diagnostic is recur-proof in a way three separate recalls are not.

**Why this is not a monument.** A unifying PDR that only restated three
existing rules would be a tombstone of its own. This PDR earns its keep by its
*predictive* content: it predicts that any frame-slip cure which bridges,
reconciles, or memorialises is treating a symptom, and it directs reviewers and
authors to look *upstream* — at the source of truth the surface projects from —
whenever any of the three surfaces shows friction. That diagnostic-and-direction
is substance the three rules do not individually carry.

**The owner framing that produced the principle.** "No sections should need
reconciling; an architectural tension is a signal we have misaligned a
fundamental concept, not a legitimate hard thing to match up." The same
sentence, read three ways, is the three faces.

**Relationship to PDR-089.** PDR-089 names frame-*capture* (inheriting a frame
and not re-grounding it; the cure is an external check). This PDR names
frame-*slip* (a projection drifting from its source; the cure is returning to
the source). They are siblings: capture is failing to question the frame you
received; slip is failing to keep an artefact aligned with the root it projects
from. Both recur at every stage; both have a single structural cure.

**Alternatives rejected.**

- *Leave the three rules separate.* Loses the cross-domain recognition cue; an
  agent must recall the specific rule before the cure is available, which is
  exactly the recall-dependence the Practice works to remove.
- *Fold the three rules into one rule file.* The rules differ in their
  enforcement surfaces (code review, architecture review, write-time prose).
  Collapsing them would weaken each surface's specificity. The unification
  belongs at the principle layer (this PDR), not the enforcement layer (the
  rules stay distinct).

## Consequences

### Required

- When friction appears at any of the three surfaces, the first question is
  "which projection has drifted from its source, and where is that source?"
  — not "how do I make both sides work / match up / be remembered?"
- A frame-slip cure names the upstream source it corrected. A cure that only
  adjusts the downstream surface has not addressed the root.

### Forbidden

- Treating a junction that will not reconcile as a legitimately-hard matching
  problem rather than a drift signal.
- Landing a downstream patch (bridge, matching/translation layer whose job is
  old/new coexistence, or a prose memorial) as the cure for a frame-slip.

### Accepted cost

- Returning to the source is sometimes more work than the downstream patch in
  the moment. That cost is the mechanism by which the artefact estate stays
  aligned to its roots rather than accumulating drift-absorbing patches.

## Compliance Triggers

- A reviewer or author encounters friction at one of the three surfaces and
  reaches for a downstream patch. Apply the one cure: locate the drifted
  projection and fix it at its source.
- A second domain surfaces the same shape (a fourth face). Record it as a row
  in the table; the law generalises by construction.

## Worked Instances

- **Code** — the recurring compatibility-bridge temptation that
  `replace-dont-bridge` was authored to stop: the cure is always to move
  callers to the single canonical owner, never to keep both paths.
- **Architecture** — the seam-map law from a complex feature-DAG plan: adjacent
  handoffs are the least important, and friction at a junction is fixed upstream
  at the source the input projects from, never bridged at the seam.
- **Writing** — `no-tombstones-for-removed-ideas`: a removed idea is stated as
  the present positive design, never kept alive by being named to reject it.

## Amendment Log

None yet.
