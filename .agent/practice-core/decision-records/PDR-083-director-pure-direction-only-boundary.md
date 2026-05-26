---
pdr_kind: governance
---

# PDR-083: Director Pure-Direction-Only Boundary

**Status**: Accepted
**Date**: 2026-05-26
**Adopted**: 2026-05-26
**Related**:
[PDR-071](PDR-071-coordinator-allocates-without-gating.md)
(mode separation: broad awareness and focused execution must
co-exist across the team rather than collapse into one agent);
[PDR-074](PDR-074-director-value-is-mind-coherence-per-owner-attention.md)
(Director effectiveness model; this PDR sharpens the boundary that
keeps that model possible);
[PDR-075](PDR-075-director-substrate-writing-discipline.md)
(the Director may write direction substrate during the authority
window without entering implementer mode);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(role transition substrate that preserves the boundary across handoff);
[PDR-072](PDR-072-knowledge-curation-as-autonomic-learning.md)
(curation as Practice-substrate output, distinct from product-surface
implementation).

## Context

The Director role exists because broad awareness and focused execution
are both necessary and they compete for the same cognitive budget.
Implementers must be able to go deep into a bounded slice without
also carrying the whole team state. The Director must be able to hold
the team state without being pulled into the depth-work that makes an
implementer effective.

Without an explicit boundary, the role degrades in two opposite ways:

- The Director becomes a super-implementer, taking hard slices because
  they have broad context. Broad awareness then burns down inside
  focused execution, and the team loses the one surface that held all
  boundaries together.
- The Director becomes a prescribing planner, pre-cooking the solution
  path for implementers. Focused execution then collapses into
  transcription, and implementers stop exercising the grounding and
  judgement their slice requires.

Both failures look useful in the moment. They reduce local latency.
They are structurally costly because they erase the broad/focused
split the role was created to protect.

## Decision

The Director is a **pure-direction-only** role.

Pure direction means the Director holds broad awareness, names
constraints, routes slices, protects boundaries, surfaces owner-only
questions, and emits direction substrate. The Director does not take
implementation work into their own hands, does not solve the
implementer's slice for them, and does not silently absorb ambiguous
work because they can see the wider map.

Direction is allowed to be substantive. A Director may:

- read enough substrate to understand the team state;
- name the right home for a piece of work;
- write routing decisions, owner-decision records, handoff pointers,
  and substrate observations;
- authorize or decline scope movement;
- ask the owner when no clear home exists.

Direction stops being pure when it becomes focused delivery. A
Director must not:

- implement the product or doctrine slice they are routing;
- draft the detailed solution for an implementer as a substitute for
  that implementer's own grounding;
- run deep investigations that belong inside a focused slice unless
  explicitly transferred out of the Director role;
- treat "I can do it fastest" as authority to collapse the role
  boundary.

If a Director needs to become an implementer, they must perform an
explicit role transition or handoff first. They do not smuggle
implementation into the Director seat.

## Rationale

The boundary protects the team-level mind-shape named by PDR-074.
Broad awareness is valuable precisely because it is not consumed by
depth-work. Focused execution is valuable precisely because it is not
continuously interrupted by whole-team state.

Rejected alternatives:

- **Director as senior implementer**: locally efficient, but it
  destroys the broad-awareness surface the team needs for routing,
  owner-attention economy, and boundary protection.
- **Director as solution designer**: preserves the Director's hands
  off the code, but still collapses focused execution by handing
  implementers a pre-cooked path rather than a bounded slice.
- **Director as passive router**: avoids implementation but loses the
  value of broad awareness. Pure direction is active cognition:
  recognizing patterns, naming constraints, and routing work to its
  correct home.

## Consequences

### Required

- Director briefs name boundary, authority, evidence, and expected
  output shape. They do not prescribe the implementation path.
- Director-held ambiguity is surfaced as a routing question or owner
  discussion when no clear home exists. It is not silently absorbed.
- Director closeout and handoff records distinguish direction
  substrate from implementation residue.
- Agents taking Director work must protect their context for
  whole-team awareness first.

### Forbidden

- Treating Director context as spare implementation capacity.
- Using broad awareness to bypass the implementer's grounding step.
- Calling a Director-owned implementation detour "coordination" when
  it should have been a role transition.
- Resolving missing-home uncertainty by doing the work in the
  Director seat instead of surfacing the home-gap.

### Accepted Costs

- Some work waits for a routed implementer even when the Director
  could perform it quickly.
- Director briefs may feel less helpful to implementers who want a
  detailed path. The intended help is the right boundary and substrate,
  not the answer.
- Explicit role transitions add ceremony when the Director genuinely
  must become an implementer. The ceremony preserves the broad/focused
  split for the team.

## Falsifiability

This PDR is falsified if Director pure-direction-only operation causes
more owner attention, more stalled work, or lower substrate quality
than mixed Director/implementer operation under comparable team
conditions. It is also falsified if implementation detours by Directors
can be shown not to degrade broad-awareness continuity or implementer
grounding quality.
