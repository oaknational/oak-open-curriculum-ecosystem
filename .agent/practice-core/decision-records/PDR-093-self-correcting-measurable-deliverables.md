---
pdr_kind: pattern
---

# PDR-093: Self-Correcting Measurable Deliverables

**Status**: Accepted (owner-approved for authoring at the 2026-06-11
register walk; trigger fired when the founding plan's mid-sequence
deliverable landed green as one commit, 2026-06-05)
**Date**: 2026-06-12
**Related**:
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — this PDR is a drafting-level pattern inside
PDR-018's plan-shape governance);
[PDR-085](PDR-085-definition-of-delivery.md)
(definition of delivery — this structure is the honesty mechanism
PDR-085's instrument/discovery amendment names: consumption gates make
undelivered predecessors break loudly);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing commitment — a landing is an invariant achieved in
code; this PDR shapes multi-deliverable plans so each landing's
acceptance is measurable).

## Context

Multi-deliverable plans drift silently: deliverable N is marked
complete, the plan moves on, and only much later does work discover
that N's output was wrong, incomplete, or never actually consumed by
anything. The drift is invisible because nothing downstream *depends
structurally* on N being right — acceptance was checked against N's own
description, not against a consumer.

The founding instance is a seven-stage rebuild plan whose deliverables
were deliberately sequenced by consumption: the typed corpus foundation
fed the contract; the contract fed the capability shape; the capability
shape fed the query layer; the query layer landed green as one commit
whose tests consumed every predecessor's output. Mid-sequence drift was
impossible to hide because each stage's gate would have broken on a
drifted predecessor.

## Decision

**Sequence plan deliverables by consumption, so that D(n+1)'s
acceptance gate breaks if D(n) drifted.** Each deliverable is drafted
with three named elements:

1. **Measurable acceptance** — an executable or directly observable
   criterion, not a prose description of completeness.
2. **What it consumes** — the named outputs of earlier deliverables
   this one depends on.
3. **How the gate breaks if the predecessor drifted** — the specific
   way this deliverable's acceptance fails when an input it consumes is
   wrong, stale, or absent.

A deliverable nothing later consumes is a terminal deliverable; it
needs an external consumer in its acceptance (a released surface, a
beneficiary journey, an instrument's first reading per PDR-085) or it
is scaffolding mislabelled as delivery.

## Rationale

The structure converts plan-state honesty from a review activity into a
construction property: drift breaks a gate instead of waiting for an
audit. It is the plan-shape analogue of test-driven design — the
consumer is written into the plan before the producer is trusted — and
the mechanism PDR-092 would choose for the "completed deliverable
quietly wrong" failure class: the firing moment (gate breakage) is
mechanical, not vigilance.

## Consequences

### Required

- Plan-authoring surfaces (the host's plan skill and templates) carry
  the three drafting elements for multi-deliverable plans.
- Where genuinely independent deliverables exist, independence is
  declared rather than a false consumption chain invented — this PDR
  composes with, and does not override, the atomic-independent-cycles
  drafting discipline for parallel dispatch.

### Forbidden

- Marking a deliverable complete against its own description when a
  named consumer gate exists and has not run.

### Accepted cost

- Drafting the consumption chain is extra plan-authoring work; the
  founding instance shows it pays for itself by making mid-sequence
  drift loud.

## Falsifiability

Falsified if plans drafted with consumption-sequenced gates exhibit the
same silent-drift rate as plans without them, or if the discipline
degenerates into inventing artificial consumption edges that serialise
genuinely parallel work (the named cost PDR-018's parallel-dispatch
discipline guards against).
