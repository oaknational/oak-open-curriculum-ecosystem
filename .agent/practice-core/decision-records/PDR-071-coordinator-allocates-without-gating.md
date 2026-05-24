---
pdr_kind: governance
---

# PDR-071: Coordinator Allocates Without Gating

**Status**: Proposed
**Date**: 2026-05-23
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture, distil, graduate, enforce);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(identity tuple discipline across multi-agent sessions);
[PDR-053](PDR-053-orchestrator-vs-gate-structural-cure.md)
(orchestrator-vs-gate polarity);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(inter-agent collaboration cures);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator authority transfer);
[`practice-index.md`](../../practice-index.md) (host adoption and
implementation bridge).

## Context

Multi-agent sessions need two complementary awareness modes:

- **Broad awareness** holds the whole team, the open substrate, the
  cross-cutting decision clusters, and the integration shape between
  focused outputs.
- **Focused awareness** holds one slice deeply enough to produce a
  concrete verdict, artefact, review, gate result, or commit-window
  action.

The two modes are mutually necessary. Broad awareness without focused
outputs becomes passive overview. Focused work without broad routing
duplicates effort, collides on shared surfaces, or loses cross-slice
decisions. The structural failure appears when one mode invades the
other: the coordinator starts executing or gating the work it is
routing, or focused implementers are left to infer the global routing
state while deep inside their slice.

This PDR proposes the positive principle: **a coordinator allocates
work; it does not execute or gate it.** The point is definitional. It
names what the coordinator mode is, not a procedural checklist for
what one named agent must do.

The evidence basis is broader than a single successful session. The
captured corpus contained at least three recurring instances across two
failure modes: coordinator over-execution that generated or polluted
the work being coordinated, and coordinator under-execution where
caution was misread as permission to leave focused agents idle. Later
positive evidence showed sessions working when live pressure selected
bounded functions, each with explicit proof surfaces, instead of a
fixed role menu. This PDR promotes that reframed mode-separation slice,
not a permanent ontology of role labels.

## Decision

A coordinator is the broad-awareness mode that allocates attention,
ownership, sequence, and exchange surfaces across a team session.

The coordinator:

- reads the live team state and names the next allocation problem;
- routes slices to focused agents with explicit boundaries;
- resolves overlap by assigning complementary boundaries;
- chooses or asks for the evidence surface needed for a decision;
- keeps integration pressure visible across slices;
- routes commit, review, and gate outcomes to the agents whose modes
  own those outcomes.

The coordinator does **not** own the focused execution surface for the
work it coordinates:

- no primary implementation in the coordinated slice;
- no primary fact-finding whose result the coordinator will then route
  as if independently verified;
- no reviewer verdict in place of a focused reviewer;
- no gate-running or commit authorship in place of the elected
  gate-runner or commit marshal;
- no hidden final approval that serialises work behind coordinator
  permission.

Mechanical hooks, elected gate-runners, reviewers, implementers, and
commit marshals each keep their own authority. The coordinator routes
their outputs; it does not absorb their authority.

If a session needs the same agent to leave coordinator mode and enter a
focused execution mode, the transition must be explicit: coordinator
authority is handed off, retired, or scoped down before the agent
claims the focused work. Simultaneous coordinator-plus-implementer
collapse is not the default shape.

## Rationale

The coordinator's value is breadth. It sees the whole team, the queue,
the open decisions, the outstanding risks, and the integration points
between focused slices. That breadth is what lets the team avoid
collision and choose where focused attention should go next.

The implementer's value is depth. It enters one boundary deeply enough
to produce a concrete result. That depth is what makes the routed work
real rather than merely organised.

The load-bearing mechanism is separation. If the coordinator performs
the focused work, its broad awareness collapses into the slice. If the
implementer becomes responsible for global routing while doing focused
work, the slice loses depth and the team loses shared allocation.
Keeping the modes structurally separate lets both coexist.

Rejected alternatives:

- **Coordinator as gatekeeper**: the coordinator becomes the hidden
  final approval surface. This serialises the team and displaces
  mechanical hooks, focused reviewers, elected gate-runners, and commit
  marshals.
- **Coordinator as implementer**: the coordinator performs the focused
  work it is routing. This collapses broad awareness into a single
  slice and leaves cross-slice integration unattended.
- **Fixed role-label doctrine**: a permanent menu of role names becomes
  the doctrine. This calcifies session-local pressure shapes instead of
  preserving the portable primitive: broad and focused modes must stay
  structurally separated.

This is also an instance of recursion as method. Focused agents produce
outputs into the shared communication substrate. The coordinator reads
those outputs as inputs, routes the next focused move, and the next
outputs return to the substrate. The team learns by recursively
exchanging broad routing and focused evidence rather than by collapsing
both into one agent's private context.

## Worked Instance

A current worked instance used one director-mode agent to route
multiple decision clusters while separate focused agents handled a
drift audit, a doctrine amendment, and commit marshalling. The exchange
surface was the real-time team communication stream: the director
allocated work and integrated results; focused agents produced the
evidence, prose, queue items, and commit-window facts. The session
worked because the director stayed broad and the focused agents stayed
deep.

## Cascade

This PDR names, but does not itself execute, two downstream
amendments:

1. The inter-agent collaboration directive surfaces the two-mode
   property as portable doctrine.
2. The team-start skill's coordinator-delegation section derives its
   coordinator-only discipline from this definitional principle.

Those amendments are separate cycles. This PDR is the principle layer;
the downstream surfaces are implementation and operating doctrine.

## Consequences

**Enables**:

- Teams can use coordinator mode without turning it into a hidden
  approval gate.
- Focused agents know whether they are producing evidence, review,
  implementation, gate output, or commit-window facts, instead of
  waiting for coordinator permission to make the work real.
- Coordinator handoffs can transfer broad routing authority without
  implying transfer of every focused execution responsibility.

**Costs**:

- A coordinator must resist useful-looking local execution, even when
  it would be faster in the moment.
- Teams must name focused owners for gates, reviews, commit windows,
  and implementation instead of letting the coordinator absorb them by
  ambient pressure.
- Mode transitions need explicit handoff or retirement language when
  the same agent changes function.

**Forbids**:

- Treating coordinator approval as the final gate for work whose
  verdict belongs to a reviewer, hook, gate-runner, implementer, or
  commit marshal.
- Having the coordinator quietly perform focused execution while still
  claiming broad routing authority.
- Encoding a fixed menu of permanent role labels as the doctrine. The
  doctrine is the mode separation; labels are session-local names for
  live pressure shapes.

## Falsifiability

This PDR is falsified if a team session preserves broad coordinator
awareness and focused slice depth while the coordinator simultaneously
owns primary execution or gate authority for the same slice. It is also
falsified if repeated sessions show that fixed role labels, rather than
mode separation, are the stable portable primitive.
