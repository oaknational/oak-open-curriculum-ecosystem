---
name: "Seam Map Plan Template Archetype"
overview: "Turn the EEF seam-map planning lesson into a reusable planning component or archetype: deliverable chains are DAGs, seams compose from one source of truth, and apparent reconciliation work signals a misaligned concept upstream."
status: future
type: planning-methodology
last_updated: 2026-06-02
isProject: false
---

# Seam Map Plan Template Archetype

**Status**: FUTURE strategic brief. Not executable until promoted to `current/`.
**Source**: owner-approved pending-graduation capture from the 2026-06-01 EEF
plan sequencing rewrite.

## Problem And Intent

Complex plans can read as linear D(n-1) to D(n) handoffs even when their real
shape is a DAG: one source produces several consumers, non-adjacent producers
join at confluence points, and an end-to-end closure arc spans the whole plan.
When those seams are not named, agents treat normal composition as
reconciliation work and start adding bridges between artifacts that should
already derive from the same source of truth.

The intent is to make "seams compose; they are not reconciled" a reusable
planning shape rather than a one-off EEF plan insight.

## End Goal

Plan authors can reach for a seam-map component or archetype when a feature
plan has non-linear deliverable dependencies, and reviewers can verify that
each seam composes from the root source of truth.

## Mechanism

The reusable shape names seam types directly:

- fan-out seams: one producer, multiple consumers;
- confluence seams: one consumer, non-adjacent producers;
- closure arc: the first contract deliverable proves through to the final proof
  deliverable;
- orthogonal runtime axis: design/runtime path crossing the execution DAG;
- layering anti-seams: boundaries held by no crossing dependency;
- cross-cutting ledger: one artifact auditing every derivation seam;
- temporal seam: a deliberate span between green removal and green replacement.

Once the seams are named, acceptance can ask whether every seam input derives
from the same root rather than whether the plan has enough bridge prose.

## Means

- Extract the EEF `## Sequencing` worked instance into a reusable component,
  archetype, or template guidance.
- Add acceptance prompts that force plan authors to name root source, producer,
  consumer, and proof for each seam.
- Add reviewer guidance for distinguishing a real hard boundary from a concept
  mismatch that should be fixed upstream.
- Back-reference the new component from the plan template README if the final
  shape is reusable across plan families.

## Boundaries And Non-Goals

- This plan does not rewrite the EEF plan; that plan remains the worked
  instance and evidence source.
- This plan does not introduce a new always-required template section for every
  plan. It applies where the work shape is non-linear.
- This plan does not bless bridge code or reconciliation prose. The doctrine is
  that seam friction usually means upstream misalignment.

## Dependencies

| Dependency | Classification | Why |
| --- | --- | --- |
| EEF plan sequencing rewrite | blocking | It is the approved worked instance and source taxonomy. |
| `oak-plan` planning discipline | blocking | The component must fit existing plan architecture. |
| Planning specialist capability | beneficial | Useful reviewer surface, but not required to author the component. |

## Strategic Acceptance Criteria

1. A reusable component, archetype, or template amendment exists under the plan
   template surface and names the seam taxonomy above.
2. The new guidance includes an acceptance checklist for root-source,
   producer/consumer, confluence, closure arc, and proof contract.
3. The guidance includes the EEF worked instance as evidence without making EEF
   vocabulary mandatory for unrelated plans.
4. `pending-graduations.md` no longer carries the seam-map item as an unresolved
   queue entry; it points here as the durable work lane.

## Risks And Unknowns

- The component could become ceremony if applied to simple linear plans. Cure:
  include a "when to apply" threshold and non-goal.
- The taxonomy could overfit EEF. Cure: preserve EEF as evidence while phrasing
  the reusable shape in plan-architecture terms.
- This may belong in the planning specialist work rather than the templates
  directory. Cure: decide final home at promotion.

## Promotion Trigger

Promote when the owner schedules the focused authoring session, when another
non-linear feature plan needs this shape, or when the planning specialist lane
is ready to absorb the component.

## Execution Note

Execution decisions are finalised only during promotion to `current` or
`active`. This future brief records intent and acceptance, not an implementation
commitment.
