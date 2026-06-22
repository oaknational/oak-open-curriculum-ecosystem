---
pdr_kind: governance
---

# PDR-113: Source Intent From the Principal, Not the Records

**Status**: Accepted
**Date**: 2026-06-22
**Related**:
[PDR-098](PDR-098-doctrine-traction-firing-detection-response.md) (the
fluency-as-tripwire and passive-guidance family — the smoothness of reading records is the
tell);
the `ground-convenient-claims` verification discipline (this PDR is its intent-fidelity case);
[PDR-046](PDR-046-layered-knowledge-processing.md) (records are a downstream projection of an
upstream source — here the source is the principal, not a prior layer).

## Context

When an agent is asked whether a large apparatus — a plan, schema, survey, restructure, or
pipeline — will deliver the principal's **intent**, the reflex is to reconstruct "the intent"
from the records (the controlling plan, the prior session's framing, the design notes) and grade
the apparatus against that reconstruction.

The records are a **projection** of intent, authored across many sessions each grounding on the
previous session's writing rather than on the principal. So records and apparatus can be
perfectly mutually consistent and yet **collectively adrift** from the principal — grading the
apparatus against the records is a circular check that cannot detect the drift. Reading the
records *feels* like rigorous grounding, and that fluency is precisely the tripwire: the smoother
the reconstructed-intent arrives, the less it was grounded at the source. The same pathology can
sit one level down inside the apparatus itself (a gate that measures the model rather than the
intent).

## Decision

For any intent-alignment check ("will this deliver what you intended?"), **elicit the intent from
the principal directly** — what success looks like; what the feared failure is — and treat the
records as a **hypothesis to verify against that source**, never as the source itself.

A context-isolated reader (or a records corpus read in isolation) can verify artefact
**consistency**; it can never verify intent **fidelity**, because it never held the intent. Pair
every form/conformance acceptance with a substance gate anchored to the principal's stated
intent, not to the model the records express.

## Consequences

- An "is this aligned with your intent?" task routes first to the principal, not to a records
  read. The records read is the second step (hypothesis formation), checked against the source.
- A consistency check and a fidelity check are distinct; a subagent or an isolated reader can be
  trusted with the former and never the latter.
- The smoothness of a reconstructed-intent narrative is a signal to re-ground at the source, not
  a sign the grounding is done.

## Enables

This closes a gap the `ground-convenient-claims` discipline left open: that discipline guards
against a claim that conveniently supports the agent's thesis; this PDR guards against the subtler
case where the *whole records corpus* conveniently supports a thesis that has drifted from the
principal. Both resolve at the same gate — verify against the source, most strictly when the
read is fluent.

## Notes (host-local)

Two worked instances seeded this PDR: a multi-session strategy/plan-estate effort where the agent
reconstructed the owner's intent from the controlling plan and design notes and was about to grade
the apparatus against that reconstruction (owner correction: "I am the source of my intent, not
the repo records"); and the recurring substrate-pointer-read-as-current-state family where a
record's projection was taken for the live state. The durable formulation graduated from
`.agent/memory/active/distilled.md` at the 2026-06-22 dedicated consolidation.
