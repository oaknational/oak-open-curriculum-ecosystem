---
pdr_kind: governance
---

# PDR-100: Decision-Debt as a First-Class Pillar (owner-gated abolished; provenance over perfection)

**Status**: Accepted
**Date**: 2026-06-16
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture → distil → graduate → enforce — this PDR sharpens the
graduate/enforce edge and the buffer's lifecycle);
[PDR-067](PDR-067-surface-classification-for-fitness-response.md)
(buffer surfaces are flow-control; fitness pressure is a rate signal);
[PDR-068](PDR-068-pipeline-back-pressure-as-structural-cure-signal.md)
(back-pressure routes to a pipeline diagnostic, never an envelope raise);
ADR-144
(the decision-debt count metric is the substrate sensor this PDR makes
first-class).

## Context

The knowledge flow (`capture → distil → graduate → enforce`) is how the
repository learns across ephemeral agent sessions. The buffer between distil and
graduate — the pending-graduations register — was the last place the Practice
tolerated softness:

- **`owner-gated` was a sanctioned owner-pre-approval status.** It let the
  consumer (graduation) fall behind the producer (capture) invisibly: a wrong
  call could not happen because no call was made, so debt accumulated under a
  status that looked legitimate. At the 2026-06-16 audit, 61 of 66 live register
  items carried it.
- **The only sensor was line-count** — a byte-proxy that conflated how-many-items
  with how-big-each-item, and understated the true decision-debt (5 visible vs 72
  actual once the hidden block/prose/annotated entries were counted).
- **Residue accumulated** — recovery-file ledgers pointing at deleted files,
  provenance pointers to curator-passes, processing-pass narratives — bookkeeping
  the buffer does not need.

The deeper principle violated throughout: _strict, everywhere, all the time_. A
schema with optional parts, an owner-pre-approval state, a soft proxy, and
accumulated residue are all the same failure at different points.

## Decision

1. **`owner-gated` is abolished.** There is no owner-pre-approval status. Every
   live register item is **decision-debt**, with status `pending` / `due` /
   `overdue`, resolved only by a recorded terminal disposition
   (`graduated` / `rejected` / `duplicate`). A backlog that has remained undecided
   past the empty-buffer target is `overdue`, not `pending`.

2. **Provenance over perfection.** The safety net for a wrong decision is
   **provenance, traceability, visibility, awareness, and the ability to adapt** —
   not owner pre-approval. If the repo makes a bad call, the commit history and the
   landed artefact record it, and the repo learns from it and adapts. Perfection
   gated on a human is not the goal; a fast, visible, self-correcting loop is.

3. **Decision-debt is a first-class pillar.** It is measured **directly** — the
   decision-debt count metric (ADR-144 §Decision-Debt Count Extension), a
   flow-rate reading of whether graduation keeps pace with capture — and is
   surfaced with full weight as a first-class prioritisation signal like any other
   fitness reading (report-only, never a build gate — ADR-144). A buffer's defining
   health is its queue depth, not its byte size.

4. **The count falls only by deciding (the inversion guard).** Lowering the count
   by deleting an undecided item, annotating its status, or raising a limit is the
   fitness→goal inversion the Practice forbids. The only legitimate cures are:
   decide each item (graduate/reject with provenance), raise consumer cadence, and
   lower producer over-eagerness (PDR-068's four bottlenecks).

5. **No residue.** The landed doctrine, rule, or result — and the commit that
   landed it — are the record of graduation. A buffer carries decision-debt and
   minimal structure only; it does not carry historical bookkeeping, references to
   deleted files, or provenance pointers (the commit and the home are the
   provenance).

## The Schema is the Perception Interface

A buffer's entries conform to a parseable schema not as a formatting nicety but
because the schema is the **contract by which every consumer perceives the
buffer's state** — the count sensor, the trigger-scan, a cold-start agent, the
owner. The coupling is unavoidable; the schema makes it explicit and stable
rather than implicit and brittle. A schema therefore has **no optional parts**:
a concept-counted buffer that does not declare its count thresholds has no
flow-rate zone, and a buffer with no zone is a schema failure.

## Consequences

- A consolidator and the owner read decision-debt at a glance in the standard
  fitness report, and the count trends down **through deciding**, never silent
  trimming.
- The register cannot re-accumulate into a junk drawer behind a legitimate-looking
  status: there is no such status.
- Wrong calls are tolerated and learned from, because they are visible and
  reversible through provenance — which is cheaper and more honest than a perfect
  gate that stalls the loop.
- Buffers stay lean; graduation's record lives in the landed artefacts and git
  history.

## Falsifiability

A future register that carries an owner-pre-approval status, a residue ledger of
graduated or deleted items, or a count lowered by anything other than a recorded
disposition is the failure mode this PDR forbids. A register that is near-empty
because items are decided promptly, with the record living in landed doctrine and
commits, is the success shape.

## Owner Direction

Owner-directed across a dedicated 2026-06-16 session: _"remove the concept of
owner gated, if the repo makes bad decisions it needs to learn from them, we
don't need perfection, we need provenance, traceability, visibility, awareness,
and the ability to adapt"_; _"we need to start treating the repo learning as a
first-class pillar"_; and _"everything in the pending graduation queue is overdue
… the landed doctrine, rules, results are the record of graduation, this tendency
to leave residue is wrong, and it needs to stop."_
