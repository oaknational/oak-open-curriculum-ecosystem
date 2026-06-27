---
name: "Shared-State Topology Is a Coordinator Question, Not a Solo-Archaeology One"
polarity: anti-pattern
use_this_when: "You need to know who owns a shared artefact, which branch carries the canonical buffer/coordination state, or where live shared state lives — and you are not the coordinator/Director."
category: process
proven_in: "2026-06-27 (Hawthorn rides Foliage) — deduced the canonical buffer base by a ~6-step solo divergence-archaeology pass diffing napkins across 8 worktrees; one directed question to the Director (Hearth tracks Tallow) answered it authoritatively (the canonical branch and its stable tip, flow-back into the coordination branch, and that repo-continuity is the Director's lane)."
proven_date: 2026-06-27
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Burning many read/diff steps reconstructing shared-state topology (canonical branch, artefact ownership, lane boundaries) that the coordinator can answer in one exchange — and risking acting on a wrong reconstruction."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** When the question is *who owns this* or *where
> the canonical shared state lives*, the coordinator holds the authoritative
> answer. Solo archaeology to avoid asking is the failure — slow, and it risks
> acting on a wrong reconstruction.

## The shape

Facing "which branch is the canonical buffer base?", the reflex was to
reconstruct it first-hand: ~6 read/diff steps comparing napkins across 8
worktrees to *deduce* the branch carrying the live state. One directed question
to the Director would have answered it directly and authoritatively — including
facts archaeology could not have recovered (the flow-back topology, the
Director's single coordination-PR-to-main model, that repo-continuity is the
Director's lane).

Shared-state topology is **coordination knowledge**: someone already holds it.
Reconstructing it from artefacts is re-deriving what the team already knows.

## The cure

When the question is about ownership, canonical-state location, or lane
boundaries, **route it to the coordinator first.** Reserve first-hand
investigation for *verifying* their answer (per
[`calibrate-verification-to-stakes`](../../../rules/verify-dont-trust.md)), not
for reconstructing what coordination already knows.

## Distinct from its neighbours

- [`read-before-asking`](../../../rules/read-before-asking.md) targets asking
  *before* reading available context. Here the context is another agent's to
  give, not a file to read — so the inverse failure (reading/archaeology to
  avoid asking) is the one that bites.
- [[feedback_implementer_routes_questions_via_director]] targets routing to the
  Director *rather than the owner*. This pattern targets asking *anyone* rather
  than doing *solo archaeology*. Sibling: [[feedback_useful_work_over_ceremony]].
